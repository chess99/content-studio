#!/usr/bin/env python3
"""Sync vendored Agent skills from their upstream Git repositories."""

from __future__ import annotations

import argparse
import json
import os
import hashlib
import re
import shutil
import subprocess
import tempfile
import uuid
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "vendor" / "skills.json"


def run(*args: str, cwd: Path | None = None) -> str:
    result = subprocess.run(
        args,
        cwd=cwd,
        text=True,
        capture_output=True,
        check=False,
        env={**os.environ, "GIT_LFS_SKIP_SMUDGE": "1"},
    )
    if result.returncode != 0:
        detail = result.stderr.strip() or result.stdout.strip()
        raise RuntimeError(f"{' '.join(args)} failed: {detail}")
    return result.stdout.strip()


def repo_path(relative: str) -> Path:
    path = (ROOT / relative).resolve()
    if path == ROOT or ROOT not in path.parents:
        raise ValueError(f"path escapes repository root: {relative}")
    if ROOT / "vendor" not in path.parents:
        raise ValueError(f"destination must be inside vendor/: {relative}")
    return path


def tree_digest(path: Path) -> str:
    """Hash relative filenames and bytes; ignore generated caches, never follow links."""
    digest = hashlib.sha256()
    for item in sorted(path.rglob("*")):
        relative = item.relative_to(path)
        if any(part in {".git", "__pycache__", "node_modules"} for part in relative.parts) or item.suffix == ".pyc":
            continue
        if item.is_symlink():
            raise ValueError(f"symlink in vendor source: {relative}")
        if item.is_file():
            digest.update(relative.as_posix().encode() + b"\0")
            digest.update(hashlib.sha256(item.read_bytes()).digest())
    return digest.hexdigest()


def copy_source(checkout: Path, source: Path, staged: Path, config: dict[str, Any]) -> None:
    tree_digest(source)  # Check symlinks before copytree can follow them.
    shutil.copytree(source, staged, ignore=shutil.ignore_patterns(".git", "__pycache__", "*.pyc", "node_modules"))
    for src, dst in config.get("extraFiles", {}).items():
        src_path, dst_path = Path(src), Path(dst)
        if any(p.is_absolute() or ".." in p.parts for p in (src_path, dst_path)):
            raise ValueError("unsafe extraFiles path")
        origin = checkout / src_path
        if origin.is_symlink() or checkout.resolve() not in origin.resolve().parents:
            raise ValueError("unsafe extraFiles source")
        target = staged / dst_path
        if target.exists():
            raise ValueError(f"extraFiles would overwrite {dst}")
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(origin, target)


def validate_config(name: str, config: dict[str, Any]) -> None:
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", name):
        raise ValueError(f"invalid skill name: {name}")
    repo_path(str(config["destination"]))
    if not re.fullmatch(r"[0-9a-f]{40}", str(config.get("commit", ""))):
        raise ValueError(f"missing pinned commit for {name}")
    if not config.get("license"):
        raise ValueError(f"missing license for {name}")


def verify(name: str, config: dict[str, Any]) -> None:
    validate_config(name, config)
    destination = repo_path(config["destination"])
    if not (destination / "SKILL.md").is_file():
        raise ValueError(f"missing SKILL.md for {name}")
    expected = config.get("sha256")
    if not expected or tree_digest(destination) != expected:
        raise ValueError(f"vendor content changed or unrecorded: {name}")


def remove_path(path: Path) -> None:
    if path.is_symlink() or path.is_file():
        path.unlink()
    elif path.exists():
        shutil.rmtree(path)


def load_manifest() -> dict[str, Any]:
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if data.get("version") != 1 or not isinstance(data.get("skills"), dict):
        raise ValueError(f"unsupported vendor manifest: {MANIFEST}")
    return data


def stage_skill(
    name: str,
    config: dict[str, Any],
    ref_override: str | None,
    staging_root: Path,
) -> tuple[Path, Path, str, str]:
    repository = str(config["repository"])
    ref = ref_override or str(config["ref"])
    source_relative = Path(str(config["subdirectory"]))
    if source_relative.is_absolute() or ".." in source_relative.parts:
        raise ValueError(f"unsafe upstream subdirectory for {name}: {source_relative}")

    destination = repo_path(str(config["destination"]))
    checkout_key = hashlib.sha256(f"{repository}\0{ref}".encode()).hexdigest()[:16]
    checkout = staging_root / f"repo-{checkout_key}"
    staged = staging_root / f"{name}-content"

    if not checkout.exists():
        run("git", "init", "--quiet", str(checkout))
        run("git", "-C", str(checkout), "remote", "add", "origin", repository)
        run("git", "-C", str(checkout), "fetch", "--depth", "1", "origin", ref)
        run("git", "-C", str(checkout), "checkout", "--quiet", "--detach", "FETCH_HEAD")
    commit = run("git", "-C", str(checkout), "rev-parse", "HEAD")

    source = (checkout / source_relative).resolve()
    try:
        source.relative_to(checkout.resolve())
    except ValueError as error:
        raise ValueError(f"upstream subdirectory escapes checkout for {name}") from error
    if not (source / "SKILL.md").is_file():
        raise FileNotFoundError(f"{name} does not contain SKILL.md at {source_relative}")

    copy_source(checkout, source, staged, config)
    return staged, destination, commit, ref


def sync(names: list[str], ref_override: str | None, locked: bool = False) -> None:
    names = list(dict.fromkeys(names))
    manifest = load_manifest()
    skills: dict[str, dict[str, Any]] = manifest["skills"]

    unknown = [name for name in names if name not in skills]
    if unknown:
        raise KeyError(f"unknown vendor skill(s): {', '.join(unknown)}")
    if ref_override and len(names) != 1:
        raise ValueError("--ref can only be used when syncing exactly one skill")

    for name in names:
        validate_config(name, skills[name])
        if skills[name].get("sha256") and repo_path(skills[name]["destination"]).exists():
            verify(name, skills[name])
    destinations = [repo_path(config["destination"]) for config in skills.values()]
    for i, destination in enumerate(destinations):
        for other in destinations[i + 1:]:
            if destination == other or destination in other.parents or other in destination.parents:
                raise ValueError("vendor destinations overlap")

    patched = [
        name
        for name in names
        if skills[name].get("localPatches")
        and repo_path(str(skills[name]["destination"])).exists()
    ]
    if patched:
        raise RuntimeError(
            "refusing to overwrite declared local patches for: "
            f"{', '.join(patched)}; review and remove localPatches after rebasing them"
        )

    with tempfile.TemporaryDirectory(prefix="content-studio-vendor-") as temporary:
        staging_root = Path(temporary)
        staged_items = [
            (name, *stage_skill(name, skills[name], skills[name]["commit"] if locked else ref_override, staging_root))
            for name in names
        ]

        # Recheck after the network fetch: a concurrent local edit must survive.
        if load_manifest() != manifest:
            raise RuntimeError("vendor manifest changed during sync; retry after review")
        for name in names:
            if skills[name].get("sha256") and repo_path(skills[name]["destination"]).exists():
                verify(name, skills[name])

        transaction = uuid.uuid4().hex
        replacements: list[tuple[Path, Path, Path]] = []
        installed: list[tuple[Path, Path]] = []
        temporary_manifest = MANIFEST.with_name(f".skills-{transaction}.json")
        try:
            for name, staged, destination, commit, ref in staged_items:
                destination.parent.mkdir(parents=True, exist_ok=True)
                replacement = destination.with_name(f".{destination.name}.sync-{transaction}")
                backup = destination.with_name(f".{destination.name}.backup-{transaction}")
                replacements.append((replacement, destination, backup))
                shutil.copytree(staged, replacement, copy_function=shutil.copy2)
                skills[name]["sha256"] = tree_digest(replacement)
                skills[name]["commit"] = commit
                if ref_override:
                    skills[name]["ref"] = ref

            temporary_manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            for replacement, destination, backup in replacements:
                if destination.exists():
                    destination.replace(backup)
                installed.append((destination, backup))
                replacement.replace(destination)
            temporary_manifest.replace(MANIFEST)
        except BaseException:
            for destination, backup in reversed(installed):
                remove_path(destination)
                if backup.exists():
                    backup.replace(destination)
            raise
        finally:
            remove_path(temporary_manifest)
            for replacement, _, _ in replacements:
                remove_path(replacement)
        for _, backup in installed:
            remove_path(backup)
        for name, _, _, commit, _ in staged_items:
            print(f"synced {name} at {commit}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Sync third-party Agent skills declared in vendor/skills.json",
    )
    parser.add_argument(
        "skills",
        nargs="*",
        help="skill names to sync; omit to sync every declared skill",
    )
    parser.add_argument(
        "--ref",
        help="override and persist the upstream branch, tag, or commit for one skill",
    )
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true", help="verify local content without network or changes")
    mode.add_argument("--locked", action="store_true", help="restore the recorded commit instead of following ref")
    args = parser.parse_args()
    if args.ref and (args.locked or args.check):
        parser.error("--ref cannot be combined with --locked or --check")
    return args


def main() -> int:
    args = parse_args()
    manifest = load_manifest()
    names = args.skills or list(manifest["skills"])
    if args.check:
        for name in names:
            verify(name, manifest["skills"][name])
            print(f"verified {name}")
    else:
        sync(names, args.ref, args.locked)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

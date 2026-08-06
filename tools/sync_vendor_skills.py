#!/usr/bin/env python3
"""Sync vendored Agent skills from their upstream Git repositories."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import tempfile
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
    )
    if result.returncode != 0:
        detail = result.stderr.strip() or result.stdout.strip()
        raise RuntimeError(f"{' '.join(args)} failed: {detail}")
    return result.stdout.strip()


def repo_path(relative: str) -> Path:
    path = (ROOT / relative).resolve()
    if path != ROOT and ROOT not in path.parents:
        raise ValueError(f"path escapes repository root: {relative}")
    return path


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
    checkout = staging_root / f"{name}-repo"
    staged = staging_root / f"{name}-content"

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

    shutil.copytree(source, staged, copy_function=shutil.copy2)
    return staged, destination, commit, ref


def sync(names: list[str], ref_override: str | None) -> None:
    manifest = load_manifest()
    skills: dict[str, dict[str, Any]] = manifest["skills"]

    unknown = [name for name in names if name not in skills]
    if unknown:
        raise KeyError(f"unknown vendor skill(s): {', '.join(unknown)}")
    if ref_override and len(names) != 1:
        raise ValueError("--ref can only be used when syncing exactly one skill")

    with tempfile.TemporaryDirectory(prefix="content-studio-vendor-") as temporary:
        staging_root = Path(temporary)
        staged_items = [
            (name, *stage_skill(name, skills[name], ref_override, staging_root))
            for name in names
        ]

        for name, staged, destination, commit, ref in staged_items:
            destination.parent.mkdir(parents=True, exist_ok=True)
            replacement = destination.with_name(f".{destination.name}.sync")
            remove_path(replacement)
            shutil.copytree(staged, replacement, copy_function=shutil.copy2)
            remove_path(destination)
            replacement.replace(destination)

            skills[name]["commit"] = commit
            if ref_override:
                skills[name]["ref"] = ref
            print(f"synced {name} at {commit}")

    serialized = json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
    temporary_manifest = MANIFEST.with_suffix(".json.tmp")
    temporary_manifest.write_text(serialized, encoding="utf-8")
    temporary_manifest.replace(MANIFEST)


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
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    manifest = load_manifest()
    names = args.skills or list(manifest["skills"])
    sync(names, args.ref)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

"""Resolve legacy in-repo projects and external content video directories."""

from __future__ import annotations

import argparse
import re
from pathlib import Path


def add_project_arguments(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("project", nargs="?", help="legacy project slug under projects/")
    parser.add_argument("--project-dir", help="external video project directory")


def resolve_project(root: Path, args: argparse.Namespace) -> tuple[Path, str]:
    if args.project_dir:
        project_dir = Path(args.project_dir).expanduser().resolve()
    elif args.project:
        project_dir = (root / "projects" / args.project).resolve()
    else:
        raise ValueError("请提供 project slug 或 --project-dir")

    raw_key = project_dir.parent.name if project_dir.name.lower() == "video" else project_dir.name
    project_key = re.sub(r"[^A-Za-z0-9._-]+", "-", raw_key).strip("-").lower()
    if not project_key:
        raise ValueError(f"无法从项目目录生成有效标识：{project_dir}")
    return project_dir, project_key

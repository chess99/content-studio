#!/usr/bin/env python3
"""检查 skill 发现入口、上游副本与本地媒体工具。"""
from __future__ import annotations
import argparse
import json
import os
from pathlib import Path
import shutil
from sync_vendor_skills import ROOT, load_manifest, verify


def expected_links(root: Path, manifest: dict) -> dict[Path, Path]:
    result = {root / '.agents/skills' / p.parent.name: p.parent for p in (root / 'skills').glob('*/SKILL.md')}
    for name, config in manifest['skills'].items():
        if config.get('discovery', True):
            result[root / '.agents/skills' / name] = root / config['destination']
    result.update({root / agent / 'skills': root / '.agents/skills' for agent in ('.claude', '.catpaw')})
    return result


def check_link(link: Path, target: Path, repair: bool) -> str | None:
    if link.is_symlink() and link.resolve() == target.resolve() and target.is_dir():
        return None
    if repair:
        if link.exists() and not link.is_symlink():
            return f'保留已有目录/文件，无法修复：{link}'
        if not target.is_dir():
            return f'目标不存在：{target}'
        link.parent.mkdir(parents=True, exist_ok=True)
        temporary = link.with_name(link.name + '.repair')
        if temporary.exists() or temporary.is_symlink():
            return f'修复临时路径已存在：{temporary}'
        try:
            temporary.symlink_to(os.path.relpath(target, link.parent), target_is_directory=True)
            temporary.replace(link)
        except OSError as error:
            if temporary.is_symlink():
                temporary.unlink()
            return f'无法建立软链（Windows 可启用开发者模式）：{link}: {error}'
        return None
    return f'入口不可用：{link} → {target}'


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repair-links', action='store_true', help='修复缺失或失效软链；保留真实目录')
    parser.add_argument('--json', action='store_true')
    args = parser.parse_args()
    manifest = load_manifest()
    errors = []
    for link, target in expected_links(ROOT, manifest).items():
        error = check_link(link, target, args.repair_links)
        if error:
            errors.append(error)
    for name, config in manifest['skills'].items():
        try:
            verify(name, config)
        except (ValueError, OSError) as error:
            errors.append(str(error))
    tools = {name: shutil.which(name) is not None for name in ('python3', 'node', 'ffmpeg', 'ffprobe')}
    dependencies = {'motion-video': (ROOT / 'apps/motion-video/node_modules/hyperframes/bin/hyperframes.mjs').is_file()}
    report = {'ok': not errors, 'errors': errors, 'tools': tools, 'dependencies': dependencies}
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print('工作区入口与上游副本：' + ('通过' if not errors else '需要修复'))
        for error in errors:
            print('  ' + error)
        for name, available in {**tools, **dependencies}.items():
            print(f'  {name}: ' + ('可用' if available else '未安装（按任务需要安装）'))
    return 0 if report['ok'] else 1


if __name__ == '__main__':
    raise SystemExit(main())

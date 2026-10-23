#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["requests>=2.32,<3"]
# ///
"""从抖音公开移动分享页下载单作品；仅使用内存中的游客会话。"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import time
from urllib.parse import parse_qs, unquote, urlencode, urlsplit, urlunsplit

import requests

UA = ('Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) '
      'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1')
SHARE_HOSTS = ('www.iesdouyin.com', 'www.douyin.com')


class DownloadError(Exception):
    pass


def input_url(text: str) -> str:
    if re.fullmatch(r'\d{15,22}', text.strip()):
        return f'https://www.douyin.com/video/{text.strip()}'
    match = re.search(r'https?://[^\s<>"\u201c\u201d]+', text)
    if not match:
        raise DownloadError('未找到抖音作品链接')
    url = match.group().rstrip('.,;，。；！!）)')
    parts = urlsplit(url)
    if parts.hostname not in {'douyin.com', 'www.douyin.com', 'm.douyin.com',
                               'v.douyin.com', 'iesdouyin.com', 'www.iesdouyin.com'}:
        raise DownloadError('仅接受抖音官方作品链接')
    if parts.username or parts.password or parts.port not in (None, 80, 443):
        raise DownloadError('作品链接不能包含凭证或自定义端口')
    return url


def id_from_url(url: str) -> str | None:
    parts = urlsplit(url)
    match = re.search(r'/(?:video|note|slides)/(\d{15,22})(?:/|$)', parts.path)
    if match:
        return match.group(1)
    query = parse_qs(parts.query)
    for key in ('modal_id', 'aweme_id', 'item_id'):
        value = query.get(key, [''])[0]
        if re.fullmatch(r'\d{15,22}', value):
            return value
    return None


def resolve_id(text: str, session) -> str:
    url = input_url(text)
    ident = id_from_url(url)
    if ident:
        return ident
    if urlsplit(url).hostname != 'v.douyin.com':
        raise DownloadError('需要单条作品链接；主页和收藏列表不受本工具支持')
    with session.get(url, timeout=(10, 25), stream=True) as response:
        response.raise_for_status()
        ident = id_from_url(input_url(response.url))
    if not ident:
        raise DownloadError('短链未跳转到可识别的作品页')
    return ident


def router_data(page: str) -> dict:
    marker = re.search(r'(?:window\.)?_ROUTER_DATA\s*=\s*', page)
    if marker:
        # raw_decode 只读取完整 JSON，避免正则在嵌套对象或字符串中的花括号处截断。
        try:
            data, _ = json.JSONDecoder().raw_decode(page[marker.end():].lstrip())
            if isinstance(data, dict):
                return data
        except ValueError:
            pass
    match = re.search(r'<script\b[^>]*\bid=["\']RENDER_DATA["\'][^>]*>(.*?)</script>', page, re.S)
    if match:
        try:
            data = json.loads(unquote(html.unescape(match.group(1))))
            if isinstance(data, dict):
                return data
        except ValueError:
            pass
    return {}


def find_item(data, ident: str) -> dict | None:
    if isinstance(data, dict):
        if str(data.get('aweme_id', '')) == ident and ('images' in data or 'video' in data):
            return data
        for value in data.values():
            found = find_item(value, ident)
            if found is not None:
                return found
    elif isinstance(data, list):
        for value in data:
            found = find_item(value, ident)
            if found is not None:
                return found
    return None


def fetch_item(session, ident: str, attempts: int = 3) -> dict:
    reasons = []
    for host in SHARE_HOSTS:
        for attempt in range(attempts):
            try:
                with session.get(f'https://{host}/share/video/{ident}/', timeout=(10, 25)) as response:
                    response.raise_for_status()
                    item = find_item(router_data(response.text), ident)
                if item is not None:
                    return item
                reasons.append('分享页无作品数据')
            except requests.RequestException as exc:
                reasons.append(f'网络请求失败（{type(exc).__name__}）')
            # 首次空壳页可能刚下发 ttwid；保持同一 Session，继续请求作品数据。
            if attempt + 1 < attempts:
                time.sleep(0.6)
    raise DownloadError(f'{reasons[-1]}；已尝试两个官方分享域名。可能受访问校验或作品权限影响，不能据此判断已删除')


def urls_in(node: dict) -> list[str]:
    values = node.get('url_list') or node.get('download_url_list') or []
    return list(dict.fromkeys(u for u in values if isinstance(u, str) and u.startswith('https://')))


def media_plan(item: dict) -> tuple[str, list[dict]]:
    images = item.get('images') or (item.get('image_post_info') or {}).get('images') or []
    if images:
        plan = []
        for i, image in enumerate(images, 1):
            urls = urls_in(image) or urls_in(image.get('display_image') or {})
            if not urls:
                raise DownloadError(f'图集第 {i} 张缺少图片地址，未将残缺图集标为成功')
            plan.append({'key':f'image-{i:03d}', 'kind':'image', 'urls':urls})
        return 'images', plan
    video = item.get('video') or {}
    addresses = urls_in(video.get('play_addr') or {})
    urls = []
    for url in addresses:
        parts = urlsplit(url)
        if parts.path.endswith(('/playwm/', '/play/')):
            query = parse_qs(parts.query)
            query['ratio'] = ['1080p']
            path = parts.path.replace('/playwm/', '/play/')
            urls.append(urlunsplit((parts.scheme, parts.netloc, path, urlencode(query, doseq=True), '')))
            urls.append(urlunsplit(('https', 'www.iesdouyin.com', path, urlencode(query, doseq=True), '')))
        else:
            urls.append(url)
    if not urls:
        raise DownloadError('作品未提供可下载的图片或视频地址')
    return 'video', [{'key':'source', 'kind':'video', 'urls':list(dict.fromkeys(urls))}]


def media_extension(header: bytes, kind: str) -> str:
    if kind == 'video':
        if header[4:8] == b'ftyp' and header[8:12] not in (b'avif', b'avis', b'heic', b'mif1'):
            return '.mp4'
    else:
        if header[:3] == b'\xff\xd8\xff':
            return '.jpg'
        if header[:8] == b'\x89PNG\r\n\x1a\n':
            return '.png'
        if header[:4] == b'RIFF' and header[8:12] == b'WEBP':
            return '.webp'
        if header[:6] in (b'GIF87a', b'GIF89a'):
            return '.gif'
        if header[4:8] == b'ftyp' and header[8:12] in (b'avif', b'avis'):
            return '.avif'
    raise DownloadError('响应不含预期媒体文件头，可能是空响应、HTML 校验页或非目标媒体')


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open('rb') as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def valid_file(folder: Path, record: dict) -> bool:
    name = record.get('name', '')
    if not name or Path(name).name != name:
        return False
    path = folder / name
    return (path.is_file() and not path.is_symlink() and path.stat().st_size > 0
            and path.stat().st_size == record.get('size_bytes') and sha256(path) == record.get('sha256'))


def probe(path: Path, kind: str) -> dict:
    if not shutil.which('ffprobe'):
        return {'method':'file_header', 'note':'未安装 ffprobe，仅验证文件头和完整传输'}
    result = subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)],
                            capture_output=True, text=True, timeout=30)
    if result.returncode:
        raise DownloadError('ffprobe 无法读取下载文件')
    data = json.loads(result.stdout)
    videos = [s for s in data.get('streams', []) if s.get('codec_type') == 'video']
    if not videos:
        raise DownloadError('下载文件没有图像流，不能用背景音频代替视频')
    duration = float(data.get('format', {}).get('duration') or 0)
    if kind == 'video' and duration <= 0:
        raise DownloadError('视频时长无效')
    v = videos[0]
    return {'method':'ffprobe', 'width':v.get('width'), 'height':v.get('height'),
            'codec':v.get('codec_name'), 'duration_seconds':duration if kind == 'video' else None,
            'audio_tracks':sum(s.get('codec_type') == 'audio' for s in data.get('streams', []))}


def download_media(session, entry: dict, folder: Path, force: bool = False) -> dict:
    partial = folder / f"{entry['key']}.part"
    last_reason = ''
    for url in entry['urls']:
        try:
            with session.get(url, timeout=(10, 30), stream=True) as response:
                response.raise_for_status()
                with partial.open('wb') as handle:
                    for chunk in response.iter_content(256 * 1024):
                        handle.write(chunk)
                expected = response.headers.get('Content-Length')
                if expected and not response.headers.get('Content-Encoding') and partial.stat().st_size != int(expected):
                    raise DownloadError('下载未完成：响应长度与文件长度不一致')
            with partial.open('rb') as handle:
                extension = media_extension(handle.read(32), entry['kind'])
            check = probe(partial, entry['kind'])
            dest = folder / f"{entry['key']}{extension}"
            if dest.exists() and not force:
                raise DownloadError(f'{dest.name} 已存在且未通过已记录的校验，请使用 --force 或更换输出目录')
            partial.replace(dest)
            return {'key':entry['key'], 'name':dest.name, 'kind':entry['kind'],
                    'size_bytes':dest.stat().st_size, 'sha256':sha256(dest), 'verification':check}
        except (requests.RequestException, DownloadError, ValueError, subprocess.TimeoutExpired) as exc:
            last_reason = str(exc) if isinstance(exc, DownloadError) else type(exc).__name__
            continue
        finally:
            partial.unlink(missing_ok=True)
    raise DownloadError(f"{entry['key']} 下载或校验失败（{last_reason}）；未标记为成功，已有文件保留")


def write_metadata(path: Path, data: dict) -> None:
    temp = path.with_suffix('.json.tmp')
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temp.replace(path)


def download_one(session, text: str, output: Path, *, force=False, metadata_only=False, attempts=3) -> dict:
    ident = resolve_id(text, session)
    folder = output / ident
    path = folder / 'metadata.json'
    previous = json.loads(path.read_text(encoding='utf-8')) if path.exists() else {}
    if previous and (previous.get('schema_version') != 1 or previous.get('id') != ident):
        raise DownloadError('已有元数据格式不匹配，请更换输出目录')
    old_files = previous.get('files', [])
    if not force and previous.get('complete'):
        if len(old_files) == previous.get('expected_file_count') and old_files and all(valid_file(folder, r) for r in old_files):
            return {'id':ident, 'status':'skipped', 'directory':str(folder), 'files':len(old_files)}
        raise DownloadError('已有归档文件缺失或校验不符，请使用 --force 修复，或更换输出目录')
    item = fetch_item(session, ident, attempts)
    kind, plan = media_plan(item)
    canonical = f"https://www.douyin.com/{'note' if kind == 'images' else 'video'}/{ident}"
    folder.mkdir(parents=True, exist_ok=True)
    saved = {r['key']:r for r in old_files if valid_file(folder, r)} if not force else {}
    data = {'schema_version':1, 'id':ident, 'source_url':canonical, 'title':item.get('desc', ''),
            'author':(item.get('author') or {}).get('nickname', ''), 'created_at':item.get('create_time'),
            'type':kind, 'method':'public_share_guest_session', 'expected_file_count':len(plan),
            'complete':False, 'files':[], 'scope':'静态图集或公开普通视频；不包含实况动图和收藏枚举'}
    # 元数据探测不覆盖此前下载进度。
    if metadata_only:
        target = folder / 'metadata-preview.json'
        write_metadata(target, data)
        return {'id':ident, 'status':'metadata', 'type':kind, 'expected_file_count':len(plan), 'metadata':str(target)}
    data['files'] = [saved[e['key']] for e in plan if e['key'] in saved]
    write_metadata(path, data)
    for entry in plan:
        record = saved.get(entry['key'])
        if record is None:
            record = download_media(session, entry, folder, force)
            saved[entry['key']] = record
        data['files'] = [saved[e['key']] for e in plan if e['key'] in saved]
        write_metadata(path, data)
    data['complete'] = len(data['files']) == len(plan)
    write_metadata(path, data)
    return {'id':ident, 'status':'downloaded', 'type':kind, 'directory':str(folder), 'files':len(plan)}


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    single = sub.add_parser('single', help='下载一条或多条公开作品；每个作品按完整 ID 独立归档')
    single.add_argument('urls', nargs='+', help='抖音链接、分享文本或作品 ID')
    single.add_argument('-o', '--output', required=True, type=Path, help='调用方提供的素材目录')
    single.add_argument('--metadata-only', action='store_true', help='只保存媒体数量等元数据，不下载文件')
    single.add_argument('--force', action='store_true', help='重新下载并替换该作品已保存的媒体')
    single.add_argument('--attempts', type=int, default=3, choices=range(1, 6), help='每个官方分享域名的最大请求次数')
    args = parser.parse_args(argv)
    session = requests.Session()
    session.headers.update({'User-Agent':UA, 'Referer':'https://www.douyin.com/', 'Accept-Language':'zh-CN,zh;q=0.9'})
    failed = False
    try:
        for text in args.urls:
            try:
                result = download_one(session, text, args.output.resolve(), force=args.force,
                                      metadata_only=args.metadata_only, attempts=args.attempts)
            except (DownloadError, requests.RequestException, ValueError, OSError) as exc:
                # requests 异常可能包含签名 URL；只报告异常类别，不回显凭证或临时地址。
                message = str(exc) if isinstance(exc, DownloadError) else type(exc).__name__
                try:
                    parts = urlsplit(input_url(text))
                    source = urlunsplit((parts.scheme, parts.netloc, parts.path, '', ''))
                except (DownloadError, ValueError):
                    source = '(无法识别的输入)'
                result = {'status':'failed', 'input':source, 'error':message}
                failed = True
            print(json.dumps(result, ensure_ascii=False), flush=True)
    finally:
        session.close()
    return 1 if failed else 0


if __name__ == '__main__':
    raise SystemExit(main())

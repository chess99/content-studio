#!/usr/bin/env python3
"""生成视频技术报告和带时间码的抽帧联系表；无需在线服务。"""
from __future__ import annotations
import argparse
import json
import math
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def run(args: list[str]) -> str:
    result = subprocess.run(args, capture_output=True, text=True, check=False)
    if result.returncode:
        raise RuntimeError(result.stderr.strip()[-3000:])
    return result.stdout


def probe(path: Path) -> dict:
    return json.loads(run(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', str(path)]))


def assess(metadata: dict, expected_duration: float | None = None,
           expected_size: tuple[int, int] | None = None, require_audio: bool = False) -> dict:
    videos = [s for s in metadata.get('streams', []) if s.get('codec_type') == 'video' and not s.get('disposition', {}).get('attached_pic')]
    audio = [s for s in metadata.get('streams', []) if s.get('codec_type') == 'audio']
    errors = []
    if not videos:
        return {'ok': False, 'errors': ['没有视频流'], 'visualReview': 'pending', 'listeningReview': 'pending'}
    video = videos[0]
    duration = float(video.get('duration') or metadata.get('format', {}).get('duration', 0))
    if not math.isfinite(duration) or duration <= 0:
        errors.append('无法读取有效时长')
    if expected_duration is not None and abs(duration - expected_duration) > 0.15:
        errors.append(f'时长 {duration:.3f}s，与预期 {expected_duration}s 不符')
    size = (video.get('width'), video.get('height'))
    if expected_size is not None and size != expected_size:
        errors.append(f'画幅 {size}，与预期 {expected_size} 不符')
    if require_audio and not audio:
        errors.append('缺少要求的音轨')
    if video.get('pix_fmt') not in ('yuv420p', 'yuvj420p'):
        errors.append('像素格式非通用 8-bit 4:2:0，请核对目标平台兼容性')
    return {'ok': not errors, 'errors': errors, 'duration': duration, 'width': size[0], 'height': size[1],
            'videoCodec': video.get('codec_name'), 'pixelFormat': video.get('pix_fmt'),
            'frameRate': video.get('avg_frame_rate'), 'audioTracks': len(audio),
            'visualReview': 'pending', 'listeningReview': 'pending' if audio else 'not-applicable'}


def sample_times(duration: float, count: int) -> list[float]:
    # Exclude the exact endpoint, which has no frame. Include the first frame.
    end = max(0, duration - min(0.1, duration / 4))
    return [round(i * end / (count - 1), 3) for i in range(count)]


# Tiny fixed glyphs keep timestamps portable when FFmpeg lacks libfreetype/drawtext.
DIGITS = {
    '0': ['111','101','101','101','111'], '1': ['010','110','010','010','111'],
    '2': ['111','001','111','100','111'], '3': ['111','001','111','001','111'],
    '4': ['101','101','111','001','001'], '5': ['111','100','111','001','111'],
    '6': ['111','100','111','101','111'], '7': ['111','001','010','010','010'],
    '8': ['111','101','111','101','111'], '9': ['111','101','111','001','111'],
    '.': ['000','000','000','000','010'], 's': ['000','011','100','011','110'],
}


def timestamp_ppm(second: float, path: Path) -> None:
    width, height, scale = 480, 30, 3
    pixels = bytearray(bytes((24, 32, 31)) * width * height)
    for i, char in enumerate(f'{second:.2f}s'):
        for y, row in enumerate(DIGITS[char]):
            for x, bit in enumerate(row):
                if bit == '1':
                    for dy in range(scale):
                        for dx in range(scale):
                            offset = ((7 + y * scale + dy) * width + 12 + i * 12 + x * scale + dx) * 3
                            pixels[offset:offset + 3] = bytes((244, 240, 232))
    path.write_bytes(f'P6\n{width} {height}\n255\n'.encode() + pixels)


def contact_sheet(video: Path, output: Path, duration: float, count: int) -> list[float]:
    times = sample_times(duration, count)
    with tempfile.TemporaryDirectory(prefix='content-studio-frames-') as folder:
        temporary = Path(folder)
        for i, second in enumerate(times):
            label = temporary / 'timestamp.ppm'
            timestamp_ppm(second, label)
            vf = ("[0:v:0]scale=480:270:force_original_aspect_ratio=decrease,"
                  "pad=480:270:(ow-iw)/2:(oh-ih)/2:color=0x18201f,setsar=1[frame];"
                  "[frame][1:v]vstack=inputs=2[out]")
            run(['ffmpeg', '-v', 'error', '-nostdin', '-ss', str(second), '-i', str(video),
                 '-i', str(label), '-filter_complex', vf, '-map', '[out]', '-frames:v', '1',
                 str(temporary / f'{i:03}.png')])
        run(['ffmpeg', '-v', 'error', '-nostdin', '-framerate', '1', '-i', str(temporary / '%03d.png'),
             '-vf', f'tile=3x{math.ceil(count / 3)}', '-frames:v', '1', str(output)])
    return times


def review(video: Path, output: Path, **kwargs) -> dict:
    video, output = video.resolve(), output.resolve()
    if output == ROOT or ROOT in output.parents:
        raise ValueError('检查产物须写入外部主题目录或临时目录')
    if output.exists():
        raise ValueError('输出目录已存在，请使用新目录保留上次检查')
    count = kwargs.pop('count', 12)
    metadata = probe(video)
    report = assess(metadata, **kwargs)
    output.mkdir(parents=True)
    (output / 'probe.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n')
    if report.get('duration', 0) > 0:
        try:
            report['samples'] = contact_sheet(video, output / 'contact-sheet.png', report['duration'], count)
        except RuntimeError as error:
            report['ok'] = False
            report['errors'].append(f'抽帧失败：{error}')
    report['source'] = str(video)
    (output / 'review.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('video', type=Path)
    parser.add_argument('--output-dir', type=Path, required=True)
    parser.add_argument('--expect-duration', type=float)
    parser.add_argument('--expect-size', help='例如 1920x1080')
    parser.add_argument('--require-audio', action='store_true')
    parser.add_argument('--samples', type=int, default=12, choices=range(3, 31))
    args = parser.parse_args()
    size = None
    if args.expect_size:
        try:
            size = tuple(map(int, args.expect_size.split('x')))
            if len(size) != 2 or min(size) <= 0:
                raise ValueError()
        except ValueError:
            parser.error('--expect-size 须为正整数宽x高，例如 1920x1080')
    if args.expect_duration is not None and (not math.isfinite(args.expect_duration) or args.expect_duration <= 0):
        parser.error('--expect-duration 须为正数')
    report = review(args.video, args.output_dir, expected_duration=args.expect_duration,
                    expected_size=size, require_audio=args.require_audio, count=args.samples)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report['ok'] else 1


if __name__ == '__main__':
    raise SystemExit(main())

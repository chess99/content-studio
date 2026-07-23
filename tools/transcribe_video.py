#!/usr/bin/env python3
"""Transcribe a local video with whisper.cpp.

ffmpeg extracts a 16 kHz mono WAV, then whisper-cli writes txt/srt/json outputs.
The GGML model is kept outside git under models/asr/.
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path


DEFAULT_MODEL = Path("models/asr/ggml-small.bin")
DEFAULT_MODEL_URLS = (
    "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin",
    "https://hf-mirror.com/ggerganov/whisper.cpp/resolve/main/ggml-small.bin",
)
DEFAULT_PROMPT = (
    "上下文腐烂 context rot context poisoning distraction attention budget "
    "agent 越改越烂 新对话 Chroma Anthropic DeepMind Gemini Salesforce "
    "LoCoBench Consensus Inertia Contextual Drag Autocompact sub-agent"
)


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd), flush=True)
    subprocess.run(cmd, check=True)


def require_tool(name: str) -> None:
    if shutil.which(name) is None:
        raise SystemExit(f"Missing required command: {name}")


def download_model(model: Path, urls: tuple[str, ...]) -> None:
    if model.exists() and model.stat().st_size > 1024 * 1024:
        return

    model.parent.mkdir(parents=True, exist_ok=True)
    last_error: Exception | None = None
    for url in urls:
        try:
            print(f"Downloading ASR model: {url}", flush=True)
            with urllib.request.urlopen(url) as response, model.open("wb") as fh:
                shutil.copyfileobj(response, fh)
            return
        except Exception as exc:  # noqa: BLE001 - keep fallback URL simple.
            last_error = exc
            if model.exists():
                model.unlink()
            print(f"Download failed: {exc}", file=sys.stderr)

    raise SystemExit(f"Could not download model: {last_error}")


def srt_to_markdown(srt_path: Path, md_path: Path, video: Path, model: Path) -> None:
    text = srt_path.read_text(encoding="utf-8")
    blocks = re.split(r"\n\s*\n", text.strip())
    lines = [
        "# 视频语音转写（Whisper small / whisper.cpp）",
        "",
        f"- 视频：`{video}`",
        f"- 模型：`{model}`",
        "- 说明：自动语音识别结果，术语和数字仍需结合视频字幕/OCR 人工核对。",
        "",
    ]

    for block in blocks:
        parts = [line.strip() for line in block.splitlines() if line.strip()]
        if len(parts) < 3:
            continue
        timestamp = parts[1].replace(",", ".")
        segment_text = " ".join(parts[2:])
        lines.append(f"- [{timestamp}] {segment_text}")

    md_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("video", type=Path, help="Input video/audio file")
    parser.add_argument("--out-dir", type=Path, required=True, help="Output directory")
    parser.add_argument("--model", type=Path, default=DEFAULT_MODEL, help="GGML model path")
    parser.add_argument("--language", default="zh", help="Whisper language code")
    parser.add_argument("--prompt", default=DEFAULT_PROMPT, help="Initial prompt")
    parser.add_argument("--basename", default="transcript-whisper", help="Output basename")
    parser.add_argument("--threads", default=str(max(4, (os.cpu_count() or 4) // 2)))
    parser.add_argument("--no-download", action="store_true", help="Do not download model")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    video = args.video.expanduser().resolve()
    out_dir = args.out_dir.resolve()
    model = args.model.resolve()

    if not video.exists():
        raise SystemExit(f"Input file not found: {video}")

    require_tool("ffmpeg")
    require_tool("whisper-cli")

    if not args.no_download:
        download_model(model, DEFAULT_MODEL_URLS)
    if not model.exists():
        raise SystemExit(f"Model file not found: {model}")

    out_dir.mkdir(parents=True, exist_ok=True)
    output_base = out_dir / args.basename

    with tempfile.TemporaryDirectory(prefix="content-asr-") as tmp:
        wav = Path(tmp) / "audio.wav"
        run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(video),
                "-vn",
                "-ar",
                "16000",
                "-ac",
                "1",
                "-c:a",
                "pcm_s16le",
                str(wav),
            ]
        )
        run(
            [
                "whisper-cli",
                "-m",
                str(model),
                "-f",
                str(wav),
                "-l",
                args.language,
                "--prompt",
                args.prompt,
                "-t",
                args.threads,
                "-otxt",
                "-osrt",
                "-oj",
                "-of",
                str(output_base),
                "-pp",
            ]
        )

    srt_to_markdown(output_base.with_suffix(".srt"), output_base.with_suffix(".md"), video, model)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

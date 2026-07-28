"""使用本机 Qwen3-TTS 为项目逐场景生成配音。"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel
from project_paths import add_project_arguments, resolve_project


def main() -> None:
    parser = argparse.ArgumentParser()
    add_project_arguments(parser)
    parser.add_argument("--speaker", default="Uncle_Fu")
    parser.add_argument("--model", default="Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    if not torch.cuda.is_available():
        raise RuntimeError("未检测到 CUDA。请安装 PyTorch CUDA 版本后重试。")

    root = Path(__file__).resolve().parents[1]
    project_dir, project_key = resolve_project(root, args)
    script = json.loads((project_dir / "script.json").read_text(encoding="utf-8"))
    output_dir = root / "public" / "generated" / project_key / "audio"
    output_dir.mkdir(parents=True, exist_ok=True)

    pending = [
        scene for scene in script["scenes"]
        if args.force or not is_valid_audio(output_dir / f'{scene["id"]}.wav')
    ]
    if not pending:
        print("所有场景配音均已存在。")
        return

    model = Qwen3TTSModel.from_pretrained(
        args.model,
        device_map="cuda:0",
        dtype=torch.bfloat16,
        attn_implementation="sdpa",
    )

    for index, scene in enumerate(script["scenes"], start=1):
        destination = output_dir / f'{scene["id"]}.wav'
        if not args.force and is_valid_audio(destination):
            print(f"[{index}/{len(script['scenes'])}] 跳过 {destination.name}")
            continue
        wavs, sample_rate = model.generate_custom_voice(
            text=scene["speechText"],
            language="Chinese",
            speaker=args.speaker,
        )
        sf.write(destination, wavs[0], sample_rate)
        print(f"[{index}/{len(script['scenes'])}] {destination.name}")


def is_valid_audio(path: Path) -> bool:
    return path.exists() and path.stat().st_size > 1024


if __name__ == "__main__":
    main()

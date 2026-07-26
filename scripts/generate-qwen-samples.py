"""生成同稿的 Qwen3-TTS 本地声线样音。"""

from __future__ import annotations

import argparse
from pathlib import Path

import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel


SAMPLE_TEXT = (
    "现在的 A 股，到底贵不贵？世界银行序列显示，二零零七年超过百分之一百二十；"
    "而二零二五年，大约回到百分之七十九点五。高位，不等于极端。"
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--model", default="Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice")
    args = parser.parse_args()

    if not torch.cuda.is_available():
        raise RuntimeError("未检测到 CUDA。请先安装 PyTorch CUDA 版本。")

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    model = Qwen3TTSModel.from_pretrained(
        args.model,
        device_map="cuda:0",
        dtype=torch.bfloat16,
        attn_implementation="sdpa",
    )

    for speaker in ("Uncle_Fu", "Dylan"):
        wavs, sample_rate = model.generate_custom_voice(
            text=SAMPLE_TEXT,
            language="Chinese",
            speaker=speaker,
        )
        path = output_dir / f"qwen3-0.6b-{speaker.lower()}.wav"
        sf.write(path, wavs[0], sample_rate)
        print(path)


if __name__ == "__main__":
    main()

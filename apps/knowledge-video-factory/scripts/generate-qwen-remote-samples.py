"""通过 Qwen 官方 Hugging Face 演示生成同稿试听样音。"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from gradio_client import Client


SAMPLE_TEXT = (
    "现在的 A 股，到底贵不贵？世界银行序列显示，二零零七年超过百分之一百二十；"
    "而二零二五年，大约回到百分之七十九点五。高位，不等于极端。"
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    client = Client("Qwen/Qwen3-TTS")
    instruction = "专业、克制、自然的财经解说；语速适中，数字清楚，避免夸张播音腔。"

    for speaker in ("Uncle_fu", "Dylan"):
        audio, status = client.predict(
            text=SAMPLE_TEXT,
            language="Chinese",
            speaker=speaker,
            instruct=instruction,
            model_size="1.7B",
            api_name="/generate_custom_voice",
        )
        if not audio:
            raise RuntimeError(f"{speaker} 生成失败：{status}")
        destination = output_dir / f"qwen3-1.7b-{speaker.lower()}.wav"
        shutil.copy2(audio, destination)
        print(f"{destination} | {status}")


if __name__ == "__main__":
    main()

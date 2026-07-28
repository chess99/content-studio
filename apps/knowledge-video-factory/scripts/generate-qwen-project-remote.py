"""通过 Qwen 官方演示为项目逐场景生成高质量草案配音。

仅用于试听和原型成片；正式批量生产应改用本地模型或有 SLA 的商业 API。
"""

from __future__ import annotations

import argparse
import json
import shutil
import time
from pathlib import Path

from gradio_client import Client


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("project")
    parser.add_argument("--speaker", default="Uncle_fu")
    parser.add_argument("--model-size", default="1.7B", choices=("0.6B", "1.7B"))
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    project_dir = root / "projects" / args.project
    script = json.loads((project_dir / "script.json").read_text(encoding="utf-8"))
    output_dir = root / "public" / "generated" / args.project / "audio"
    output_dir.mkdir(parents=True, exist_ok=True)

    client = with_retries(lambda: Client("Qwen/Qwen3-TTS"), "连接 Qwen 演示服务")
    instruction = "专业、克制、自然的财经解说；语速适中，数字清楚，避免夸张播音腔。"

    for index, scene in enumerate(script["scenes"], start=1):
        destination = output_dir / f'{scene["id"]}.wav'
        if destination.exists() and not args.force:
            print(f"[{index}/{len(script['scenes'])}] 跳过 {destination.name}")
            continue
        audio, status = with_retries(
            lambda: client.predict(
                text=scene["speechText"],
                language="Chinese",
                speaker=args.speaker,
                instruct=instruction,
                model_size=args.model_size,
                api_name="/generate_custom_voice",
            ),
            f'生成 {scene["id"]}',
        )
        if not audio:
            raise RuntimeError(f'{scene["id"]} 生成失败：{status}')
        shutil.copy2(audio, destination)
        print(f"[{index}/{len(script['scenes'])}] {destination.name} | {status}")


def with_retries(action, label: str, attempts: int = 4):
    last_error = None
    for attempt in range(1, attempts + 1):
        try:
            return action()
        except Exception as error:  # 网络和公开演示队列均可能瞬时失败
            last_error = error
            if attempt == attempts:
                break
            delay = attempt * 3
            print(f"{label}失败（{attempt}/{attempts}），{delay} 秒后重试：{error}")
            time.sleep(delay)
    raise RuntimeError(f"{label}连续失败 {attempts} 次") from last_error


if __name__ == "__main__":
    main()

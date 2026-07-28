"""使用 Fish Audio 为项目生成同稿样音或逐场景配音。"""

from __future__ import annotations

import argparse
import json
import time
import urllib.error
import urllib.request
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("project")
    parser.add_argument("--reference-id", required=True)
    parser.add_argument("--voice-alias", default="voice")
    parser.add_argument("--model", default="s2.1-pro-free")
    parser.add_argument("--speed", type=float, default=1.05)
    parser.add_argument("--sample", action="store_true")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    if not 0.5 <= args.speed <= 2:
        raise ValueError(f"无效 speed：{args.speed}")

    root = Path(__file__).resolve().parents[1]
    env = load_env(root / ".env")
    api_key = env.get("FISH_AUDIO_API_KEY")
    if not api_key:
        raise RuntimeError(".env 中缺少 FISH_AUDIO_API_KEY")

    project_dir = root / "projects" / args.project
    script = json.loads((project_dir / "script.json").read_text(encoding="utf-8"))
    if args.sample:
        jobs = [(
            f"fish-{args.model}-{args.voice_alias}",
            " ".join(scene["displayText"] for scene in (script["scenes"][0], script["scenes"][4])),
            project_dir / "publish" / "voice-samples" / f"fish-{args.model}-{args.voice_alias}.mp3",
        )]
    else:
        jobs = [
            (
                scene["id"],
                scene["displayText"],
                root / "public" / "generated" / args.project / "audio-fish" / f'{scene["id"]}.mp3',
            )
            for scene in script["scenes"]
        ]

    for index, (job_id, text, destination) in enumerate(jobs, start=1):
        destination.parent.mkdir(parents=True, exist_ok=True)
        if not args.force and destination.exists() and destination.stat().st_size > 1024:
            print(f"[{index}/{len(jobs)}] 跳过 {job_id}")
            continue
        body = json.dumps(
            {
                "text": text,
                "reference_id": args.reference_id,
                "temperature": 0.6,
                "top_p": 0.7,
                "prosody": {"speed": args.speed, "volume": 0, "normalize_loudness": True},
                "chunk_length": 200,
                "normalize": True,
                "format": "mp3",
                "sample_rate": 44100,
                "mp3_bitrate": 192,
                "latency": "normal",
                "max_new_tokens": 4096,
                "repetition_penalty": 1.2,
                "min_chunk_length": 50,
                "condition_on_previous_chunks": True,
                "early_stop_threshold": 1,
            },
            ensure_ascii=False,
        ).encode("utf-8")
        audio = request_audio(api_key, args.model, body)
        if len(audio) < 1024:
            raise RuntimeError(f"Fish Audio 返回文件过小：{len(audio)} bytes")
        destination.write_bytes(audio)
        print(f"[{index}/{len(jobs)}] {job_id} / {len(audio)} bytes")


def request_audio(api_key: str, model: str, body: bytes, attempts: int = 4) -> bytes:
    request = urllib.request.Request(
        "https://api.fish.audio/v1/tts",
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "model": model,
        },
    )
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        try:
            with urllib.request.urlopen(request, timeout=240) as response:
                return response.read()
        except urllib.error.HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")[:1000]
            raise RuntimeError(f"Fish Audio 请求失败：{error.code} {detail}") from error
        except (urllib.error.URLError, TimeoutError) as error:
            last_error = error
            if attempt == attempts:
                break
            delay = 1.5 * (2 ** (attempt - 1))
            print(f"Fish Audio 连接失败，{delay:g} 秒后重试（{attempt}/{attempts}）")
            time.sleep(delay)
    raise RuntimeError("Fish Audio 多次连接失败") from last_error


def load_env(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    result: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        result[key] = value
    return result


if __name__ == "__main__":
    main()

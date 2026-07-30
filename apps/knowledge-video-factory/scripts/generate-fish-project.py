"""使用 Fish Audio 为项目生成同稿样音或逐场景配音。"""

from __future__ import annotations

import argparse
import json
import time
import urllib.error
import urllib.request
from pathlib import Path
from project_paths import add_project_arguments, resolve_project


DEFAULT_MODEL = "s2.1-pro-free"
DEFAULT_SPEED = 1.05


def main() -> None:
    parser = argparse.ArgumentParser()
    add_project_arguments(parser)
    parser.add_argument("--config", default="config.json", help="项目内的配置文件名")
    parser.add_argument("--reference-id")
    parser.add_argument("--voice-alias", default="voice")
    parser.add_argument("--model")
    parser.add_argument("--speed", type=float)
    parser.add_argument("--sample", action="store_true")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    project_dir, project_key = resolve_project(root, args)
    config_path = project_dir / args.config
    config = json.loads(config_path.read_text(encoding="utf-8"))
    voice = resolve_voice_settings(
        config,
        reference_id=args.reference_id,
        model=args.model,
        speed=args.speed,
    )
    require_script_approval(config)

    env = load_env(root / ".env")
    api_key = env.get("FISH_AUDIO_API_KEY")
    if not api_key:
        raise RuntimeError(".env 中缺少 FISH_AUDIO_API_KEY")

    script = json.loads((project_dir / "script.json").read_text(encoding="utf-8"))
    if args.sample:
        jobs = [(
            f"fish-{voice['model']}-{args.voice_alias}",
            " ".join(scene["displayText"] for scene in (script["scenes"][0], script["scenes"][4])),
            project_dir / "publish" / "voice-samples" / f"fish-{voice['model']}-{args.voice_alias}.mp3",
        )]
    else:
        audio_subdirectory = voice["audioSubdirectory"]
        audio_extension = voice["audioExtension"]
        jobs = [
            (
                scene["id"],
                scene.get("speechText") or scene["displayText"],
                root / "public" / "generated" / project_key / audio_subdirectory / f'{scene["id"]}.{audio_extension}',
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
                "reference_id": voice["referenceId"],
                "temperature": 0.6,
                "top_p": 0.7,
                "prosody": {"speed": voice["speed"], "volume": 0, "normalize_loudness": True},
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
        audio = request_audio(api_key, voice["model"], body)
        if len(audio) < 1024:
            raise RuntimeError(f"Fish Audio 返回文件过小：{len(audio)} bytes")
        destination.write_bytes(audio)
        print(f"[{index}/{len(jobs)}] {job_id} / {len(audio)} bytes")


def resolve_voice_settings(
    config: dict,
    *,
    reference_id: str | None = None,
    model: str | None = None,
    speed: float | None = None,
) -> dict[str, str | float]:
    voice = config.get("voice") or {}
    provider = voice.get("provider")
    if provider != "fish-audio" and not reference_id:
        raise ValueError(
            f"当前 voice.provider={provider!r}，默认生成 Fish 配音需要设为 'fish-audio'；"
            "试听其他配置时可显式传入 --reference-id。"
        )

    resolved_reference_id = reference_id or voice.get("referenceId")
    if not resolved_reference_id:
        raise ValueError("Fish Audio 缺少 referenceId；请写入 config.json 的 voice.referenceId 或传入 --reference-id。")

    resolved_model = model or voice.get("model") or DEFAULT_MODEL
    resolved_speed = speed if speed is not None else voice.get("rate", DEFAULT_SPEED)
    if isinstance(resolved_speed, bool) or not isinstance(resolved_speed, (int, float)):
        raise ValueError(f"Fish Audio voice.rate 必须是数字：{resolved_speed!r}")
    if not 0.5 <= float(resolved_speed) <= 2:
        raise ValueError(f"无效 Fish Audio 语速：{resolved_speed}")

    audio_extension = voice.get("audioExtension", "mp3")
    if audio_extension != "mp3":
        raise ValueError("当前 Fish Audio 生成器只支持 voice.audioExtension='mp3'")

    return {
        "referenceId": str(resolved_reference_id),
        "model": str(resolved_model),
        "speed": float(resolved_speed),
        "audioSubdirectory": str(voice.get("audioSubdirectory", "audio-fish")),
        "audioExtension": audio_extension,
    }


def require_script_approval(config: dict) -> None:
    if not (config.get("gates") or {}).get("scriptApproved", False):
        raise RuntimeError("脚本尚未通过人工审核：请先将 config.json 的 gates.scriptApproved 设为 true。")


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

#!/usr/bin/env python3
"""Validate and save an image exported from a ChatGPT Web page asset bundle."""

from __future__ import annotations

import argparse
import io
import os
import sys
import tempfile
from pathlib import Path


FORMATS = {"png", "jpeg", "webp"}
EXTENSION_FORMATS = {".png": "png", ".jpg": "jpeg", ".jpeg": "jpeg", ".webp": "webp"}


def detect_format(data: bytes) -> str:
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if data.startswith(b"\xff\xd8\xff"):
        return "jpeg"
    if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    raise ValueError("source is not a supported PNG, JPEG, or WebP image")


def choose_output_format(out_path: Path, requested: str, detected: str) -> str:
    suffix_format = EXTENSION_FORMATS.get(out_path.suffix.lower())
    if requested == "auto":
        return suffix_format or detected
    if suffix_format and suffix_format != requested:
        raise ValueError(
            f"output extension {out_path.suffix!r} does not match --format={requested}"
        )
    return requested


def _write_copy(data: bytes, temp_path: Path) -> None:
    with temp_path.open("wb") as handle:
        handle.write(data)
        handle.flush()
        os.fsync(handle.fileno())


def _write_converted(data: bytes, temp_path: Path, output_format: str) -> None:
    try:
        from PIL import Image
    except ImportError as exc:
        raise RuntimeError(
            "Pillow is required for format conversion; install it or keep the source format"
        ) from exc

    with Image.open(io.BytesIO(data)) as image:
        image.load()
        save_format = "JPEG" if output_format == "jpeg" else output_format.upper()
        if output_format == "jpeg" and image.mode not in {"RGB", "L"}:
            if "A" in image.getbands():
                background = Image.new("RGB", image.size, "white")
                background.paste(image, mask=image.getchannel("A"))
                image = background
            else:
                image = image.convert("RGB")
        image.save(temp_path, format=save_format)
    with temp_path.open("rb+") as handle:
        os.fsync(handle.fileno())


def save_image(
    source: Path,
    out_path: Path,
    requested_format: str = "auto",
    force: bool = False,
) -> tuple[Path, str]:
    if not source.is_file():
        raise ValueError(f"source image not found: {source}")
    if source.resolve() == out_path.resolve():
        raise ValueError("source and output paths must be different")
    if out_path.exists() and not force:
        raise FileExistsError(f"output already exists: {out_path}")

    data = source.read_bytes()
    detected = detect_format(data)
    output_format = choose_output_format(out_path, requested_format, detected)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    temp_handle = tempfile.NamedTemporaryFile(
        prefix=f".{out_path.name}.", suffix=".tmp", dir=out_path.parent, delete=False
    )
    temp_path = Path(temp_handle.name)
    temp_handle.close()
    try:
        if output_format == detected:
            _write_copy(data, temp_path)
        else:
            _write_converted(data, temp_path, output_format)
        if out_path.exists() and not force:
            raise FileExistsError(f"output already exists: {out_path}")
        os.replace(temp_path, out_path)
    except Exception:
        temp_path.unlink(missing_ok=True)
        raise
    return out_path.resolve(), output_format


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Save a ChatGPT Web page-asset image to a workspace path."
    )
    parser.add_argument("source", type=Path, help="Image file exported by pageAssets")
    parser.add_argument("-o", "--out", type=Path, required=True, help="Destination image path")
    parser.add_argument("--format", choices=["auto", *sorted(FORMATS)], default="auto")
    parser.add_argument("--force", action="store_true", help="Overwrite an existing destination")
    args = parser.parse_args()

    try:
        saved_path, _ = save_image(args.source, args.out, args.format, args.force)
    except (OSError, RuntimeError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    print(saved_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

from __future__ import annotations

import base64
import importlib.util
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).parents[1] / "scripts" / "save-chat-web-image.py"
SPEC = importlib.util.spec_from_file_location("save_chat_web_image", SCRIPT)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)

PNG_1X1 = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
)


class SaveChatWebImageTests(unittest.TestCase):
    def test_saves_extensionless_png_asset(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "page-asset"
            output = root / "result.png"
            source.write_bytes(PNG_1X1)

            saved, output_format = MODULE.save_image(source, output)

            self.assertEqual(saved, output.resolve())
            self.assertEqual(output_format, "png")
            self.assertEqual(output.read_bytes(), PNG_1X1)

    def test_refuses_to_overwrite_by_default(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "page-asset"
            output = root / "result.png"
            source.write_bytes(PNG_1X1)
            output.write_bytes(b"existing")

            with self.assertRaises(FileExistsError):
                MODULE.save_image(source, output)

            self.assertEqual(output.read_bytes(), b"existing")

    def test_force_overwrites_existing_output(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "page-asset"
            output = root / "result.png"
            source.write_bytes(PNG_1X1)
            output.write_bytes(b"existing")

            MODULE.save_image(source, output, force=True)

            self.assertEqual(output.read_bytes(), PNG_1X1)

    def test_converts_png_to_webp_from_output_extension(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "page-asset"
            output = root / "result.webp"
            source.write_bytes(PNG_1X1)

            _, output_format = MODULE.save_image(source, output)

            data = output.read_bytes()
            self.assertEqual(output_format, "webp")
            self.assertEqual(data[:4], b"RIFF")
            self.assertEqual(data[8:12], b"WEBP")

    def test_explicit_format_must_match_output_extension(self) -> None:
        with self.assertRaisesRegex(ValueError, "does not match"):
            MODULE.choose_output_format(Path("result.webp"), "png", "png")

    def test_rejects_unsupported_source(self) -> None:
        with self.assertRaisesRegex(ValueError, "supported PNG"):
            MODULE.detect_format(b"not an image")


if __name__ == "__main__":
    unittest.main()

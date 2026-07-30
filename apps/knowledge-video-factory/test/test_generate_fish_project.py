import importlib.util
import sys
import unittest
from pathlib import Path


SCRIPTS_DIR = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))
SPEC = importlib.util.spec_from_file_location("generate_fish_project", SCRIPTS_DIR / "generate-fish-project.py")
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class FishVoiceSettingsTests(unittest.TestCase):
    def setUp(self):
        self.config = {
            "voice": {
                "provider": "fish-audio",
                "model": "s2.1-pro-free",
                "referenceId": "configured-voice",
                "rate": 1.05,
                "audioSubdirectory": "audio-fish",
                "audioExtension": "mp3",
            },
            "gates": {"scriptApproved": True},
        }

    def test_reads_defaults_from_project_config(self):
        result = MODULE.resolve_voice_settings(self.config)
        self.assertEqual(result["referenceId"], "configured-voice")
        self.assertEqual(result["model"], "s2.1-pro-free")
        self.assertEqual(result["speed"], 1.05)

    def test_cli_values_override_project_config(self):
        result = MODULE.resolve_voice_settings(
            self.config,
            reference_id="override-voice",
            model="s2.1-pro",
            speed=1.12,
        )
        self.assertEqual(result["referenceId"], "override-voice")
        self.assertEqual(result["model"], "s2.1-pro")
        self.assertEqual(result["speed"], 1.12)

    def test_rejects_missing_reference_id(self):
        self.config["voice"].pop("referenceId")
        with self.assertRaisesRegex(ValueError, "referenceId"):
            MODULE.resolve_voice_settings(self.config)

    def test_rejects_non_fish_default_provider(self):
        self.config["voice"]["provider"] = "qwen3-tts"
        with self.assertRaisesRegex(ValueError, "voice.provider"):
            MODULE.resolve_voice_settings(self.config)

    def test_requires_script_approval(self):
        self.config["gates"]["scriptApproved"] = False
        with self.assertRaisesRegex(RuntimeError, "人工审核"):
            MODULE.require_script_approval(self.config)


if __name__ == "__main__":
    unittest.main()

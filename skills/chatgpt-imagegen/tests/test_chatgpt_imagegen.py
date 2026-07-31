from __future__ import annotations

import importlib.util
import time
import unittest
from pathlib import Path
from unittest.mock import patch


SCRIPT = Path(__file__).parents[1] / "scripts" / "chatgpt-imagegen.py"
SPEC = importlib.util.spec_from_file_location("chatgpt_imagegen", SCRIPT)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class FakeResponse:
    def __iter__(self):
        yield b"data: [DONE]\n"
        yield b"\n"

    def close(self) -> None:
        pass


class StreamTimeoutTests(unittest.TestCase):
    def test_urlopen_uses_remaining_total_budget(self) -> None:
        deadline = time.monotonic() + 120
        with patch.object(MODULE.urllib.request, "urlopen", return_value=FakeResponse()) as mocked:
            list(MODULE._stream("https://example.test", {}, {}, deadline))

        timeout = mocked.call_args.kwargs["timeout"]
        self.assertGreater(timeout, 100)
        self.assertLessEqual(timeout, 120)

    def test_expired_deadline_fails_before_network_call(self) -> None:
        with patch.object(MODULE.urllib.request, "urlopen") as mocked:
            with self.assertRaisesRegex(MODULE.GatewayError, "total timeout budget"):
                list(MODULE._stream("https://example.test", {}, {}, time.monotonic() - 1))

        mocked.assert_not_called()

    def test_read_timeout_is_reported_as_gateway_error(self) -> None:
        with patch.object(MODULE, "_stream", side_effect=TimeoutError):
            with self.assertRaisesRegex(MODULE.GatewayError, "stream timed out"):
                MODULE._post_for_image({}, {}, time.monotonic() + 120, verbose=False)


if __name__ == "__main__":
    unittest.main()

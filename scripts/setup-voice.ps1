param(
  [string]$Python = "python"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$venv = Join-Path $root ".venv"
$requirements = Join-Path $root "requirements-voice.txt"

if (-not (Test-Path -LiteralPath (Join-Path $venv "Scripts\python.exe"))) {
  & $Python -m venv $venv
}

& (Join-Path $venv "Scripts\python.exe") -m pip install -r $requirements
& (Join-Path $venv "Scripts\edge-tts.exe") --version

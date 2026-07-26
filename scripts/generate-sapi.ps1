param(
  [Parameter(Mandatory = $true)]
  [string]$Text,

  [Parameter(Mandatory = $true)]
  [string]$OutputPath,

  [int]$Rate = 0,
  [string]$Voice = "Microsoft Huihui Desktop"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Speech

$parent = Split-Path -Parent $OutputPath
if ($parent) {
  New-Item -ItemType Directory -Path $parent -Force | Out-Null
}

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  try {
    $synth.SelectVoice($Voice)
  } catch {
    $culture = [System.Globalization.CultureInfo]::GetCultureInfo("zh-CN")
    $synth.SelectVoiceByHints(
      [System.Speech.Synthesis.VoiceGender]::Female,
      [System.Speech.Synthesis.VoiceAge]::Adult,
      0,
      $culture
    )
  }
  $synth.Rate = $Rate
  $synth.Volume = 100
  $synth.SetOutputToWaveFile($OutputPath)
  $synth.Speak($Text)
} finally {
  $synth.Dispose()
}

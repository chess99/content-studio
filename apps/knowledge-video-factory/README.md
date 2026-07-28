# Knowledge Video Factory

面向抖音、小红书、B 站等平台的可复用知识视频生产骨架。目标形式是无真人出镜的财经编辑式知识图解：动态排版、真实数据图表、硬朗分栏和大字幕。

当前版本已经跑通第一条 1080×1920 样片，包含可追溯资料、脚本、分镜、本地 Qwen3-TTS 中文配音、Remotion 动画、字幕、响度标准化、自动质检、封面和发布文案。流程不会自动发布内容。

## 生产流程

```text
原始文章 / 数据 / 来源
  → brief
  → 口播稿与事实检查
  → 人工审核
  → 结构化分镜
  → 分场景配音与字幕
  → 画面渲染
  → 自动质检与低清预览
  → 人工审核
  → 正式视频与发布包
```

## 目录说明

```text
brand/       品牌视觉、发音词典和公共素材规范
config/      平台与生产流程配置
docs/        工作流和接入说明
projects/    项目模板；正式视频资产保存在外部内容仓库
schemas/     brief、口播与分镜的数据约束
scripts/     项目级辅助命令
src/         配音、渲染、质检等适配层
templates/   可复用场景模板
```

## 已验证技术栈

- Node.js 22+ 与 pnpm
- Remotion 4 + React：代码驱动的动态图表和编辑式信息排版
- Qwen3-TTS 0.6B：本地中文正式配音；当前验证设备为 RTX 4060 Ti 8GB
- Edge Neural TTS：无需账号的快速工程预览
- Chrome：逐帧渲染
- FFmpeg / ffprobe：音量标准化、编码和媒体质检

## 首次安装

要求 Node.js 22+、FFmpeg、Chrome/Chromium 和 Python 3.12。正式本地配音还需要 NVIDIA CUDA 显卡。

```powershell
pnpm install
powershell -ExecutionPolicy Bypass -File scripts/setup-voice.ps1
pnpm check:structure
pnpm typecheck
$videoDir = "D:\code\content\topics\YYYYMMDD-my-first-video\video"
Copy-Item -Recurse projects/_template $videoDir
```

然后填写新项目中的 `input/source.md`、`input/sources.json` 和 `input/data.csv`。不要直接在 `_template` 里制作视频。

本地 Qwen 配音使用独立环境，避免影响 Edge 预览环境：

```powershell
python -m venv .venv-qwen
.\.venv-qwen\Scripts\python.exe -m pip install qwen-tts
.\.venv-qwen\Scripts\python.exe -m pip install --upgrade torch==2.11.0+cu128 torchaudio==2.11.0+cu128 --index-url https://download.pytorch.org/whl/cu128
.\.venv-qwen\Scripts\python.exe scripts/generate-qwen-project-local.py --project-dir $videoDir --speaker Dylan --force
```

CUDA 版本应按本机驱动与 PyTorch 官方安装页调整，不要机械照搬示例版本。

Fish Audio 可先用免费开发模型做同稿样音：

```powershell
Copy-Item .env.example .env
# 将 FISH_AUDIO_API_KEY 写入 .env 后：
python scripts/generate-fish-project.py --project-dir $videoDir --sample --model s2.1-pro-free --reference-id <voice-id> --voice-alias natural-male
```

密钥不得写入代码、日志或提交；`.env` 已被 Git 忽略。

生成整条 Fish 配音并使用独立配置准备时间线：

```powershell
python scripts/generate-fish-project.py --project-dir $videoDir --model s2.1-pro-free --reference-id <voice-id> --voice-alias natural-male --speed 1.05
node scripts/prepare-project.mjs --project-dir $videoDir --config config.fish.json
```

Fish 音频写入 `public/generated/<project>/audio-fish/`，不会覆盖本地 Qwen 音频。

## 制作一条视频

```powershell
# 1. 逐场景配音
.\.venv-qwen\Scripts\python.exe scripts/generate-qwen-project-local.py --project-dir $videoDir --speaker Dylan

# 2. 校验项目、按真实音频生成时间线与 SRT
node scripts/prepare-project.mjs --project-dir $videoDir

# 3. 生成 540×960 低清预览并质检
node scripts/render-project.mjs --project-dir $videoDir
node scripts/qa-video.mjs --project-dir $videoDir

# 4. 人工确认后生成 1080×1920 正式版、封面与最终报告
node scripts/render-project.mjs --project-dir $videoDir --final
node scripts/qa-video.mjs --project-dir $videoDir --final
```

正式版会自动做响度标准化。质检会检查尺寸、编码、时长、字幕时间、来源、黑帧与音量，并从每个场景抽取一张截图到 `tmp/qa/`。

项目可在 `<VIDEO_DIR>/config.json` 中用 `voice.playbackRate` 控制成片语速。建议先试 `1.04—1.12`；当前试播片使用 `1.08`。封面由独立的 `KnowledgeCover` 画布生成，不再从视频首帧抽取。

正式渲染前按 [独立审核闸门](docs/REVIEW_WORKFLOW.md) 分别做内容审核与视觉/品牌审核；品牌识别规则见 [brand/BRAND.md](brand/BRAND.md)。

## 下一步

1. 增加 Fish Audio、Azure Dragon HD 等云端正式 TTS 适配器。
2. 增加场景级缓存与局部重渲染，缩短迭代时间。
3. 增加自动文本溢出检测和多平台安全区预设。
4. 将现有场景继续抽象为可配置模板，并补充快照测试。

更完整的阶段划分见 `docs/WORKFLOW.md`。

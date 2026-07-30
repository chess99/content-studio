# Knowledge Video Factory

面向抖音、小红书、B 站等平台的可复用知识视频生产骨架。引擎负责可追溯脚本、结构化分镜、配音、字幕、渲染与质检；账号品牌来自外部内容资产仓库，具体项目可选择财经编辑式等视觉预设。

当前版本已经跑通第一条 1080×1920 样片，包含可追溯资料、脚本、分镜、Fish Audio 中文配音、Remotion 动画、字幕、响度标准化、自动质检、封面和发布文案。流程不会自动发布内容。

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
config/      平台与生产流程配置
docs/        工作流和接入说明
projects/    项目模板；正式视频资产保存在外部内容仓库
schemas/     brief、口播与分镜的数据约束
scripts/     项目级辅助命令
src/         配音、渲染、质检等适配层
templates/   可复用场景模板
themes/      版式、图表和动效预设；不保存账号母品牌
```

## 已验证技术栈

- Node.js 22+ 与 pnpm
- Remotion 4 + React：代码驱动的动态图表和编辑式信息排版
- Fish Audio：正式默认配音；开发和小规模生成默认使用 `s2.1-pro-free`
- Qwen3-TTS 0.6B：离线、零调用费兜底；当前验证设备为 RTX 4060 Ti 8GB
- Edge Neural TTS：无需账号的快速工程预览，不作为正式成片默认声音
- Chrome：逐帧渲染
- FFmpeg / ffprobe：音量标准化、编码和媒体质检

## 首次安装

要求 Node.js 22+、FFmpeg、Chrome/Chromium 和 Python 3.12。默认 Fish 配音需要 API key；使用本地 Qwen 兜底时还需要 NVIDIA CUDA 显卡。

```powershell
pnpm install
powershell -ExecutionPolicy Bypass -File scripts/setup-voice.ps1
pnpm check:structure
pnpm typecheck
$videoDir = "D:\code\content\topics\YYYYMMDD-my-first-video\video"
Copy-Item -Recurse projects/_template $videoDir
```

然后填写新项目中的 `input/source.md`、`input/sources.json` 和 `input/data.csv`。不要直接在 `_template` 里制作视频。

默认 Fish 配音只从 app 根目录的 `.env` 读取密钥：

```powershell
Copy-Item .env.example .env
# 将 FISH_AUDIO_API_KEY 写入 .env；不得提交该文件
```

模板默认使用已验证的 `s2.1-pro-free`、1.05 倍 API 语速和“自然流男”公开声线。该声线 ID 便于开箱验证，但公开声线的长期商用授权需要在正式发布前自行核实；品牌稳定后应在项目 `config.json` 中替换为权属明确的品牌声线。大规模生产可将 `voice.model` 切换为 `s2.1-pro`。

本地 Qwen 兜底使用独立环境，避免影响 Edge 预览环境：

```powershell
python -m venv .venv-qwen
.\.venv-qwen\Scripts\python.exe -m pip install qwen-tts
.\.venv-qwen\Scripts\python.exe -m pip install --upgrade torch==2.11.0+cu128 torchaudio==2.11.0+cu128 --index-url https://download.pytorch.org/whl/cu128
.\.venv-qwen\Scripts\python.exe scripts/generate-qwen-project-local.py --project-dir $videoDir --speaker Dylan --force
```

CUDA 版本应按本机驱动与 PyTorch 官方安装页调整，不要机械照搬示例版本。

脚本人工确认并将 `gates.scriptApproved` 设为 `true` 后，可生成 Fish 同稿样音：

```powershell
python scripts/generate-fish-project.py --project-dir $videoDir --sample --voice-alias natural-male
```

密钥不得写入代码、日志或提交；`.env` 已被 Git 忽略。

正式逐场景配音和时间线准备：

```powershell
python scripts/generate-fish-project.py --project-dir $videoDir
node scripts/prepare-project.mjs --project-dir $videoDir
```

脚本会从项目 `config.json` 读取模型、声线、语速和音频目录；命令行参数仍可临时覆盖。Fish 音频写入 `public/generated/<project>/audio-fish/`，不会覆盖本地 Qwen 音频。

## 制作一条视频

```powershell
# 1. 逐场景配音
python scripts/generate-fish-project.py --project-dir $videoDir

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

项目可在 `<VIDEO_DIR>/config.json` 中用 `voice.rate` 控制 Fish 生成时的自然语速；`voice.playbackRate` 只用于成片阶段的小幅无损微调。建议优先调整 `rate`，避免过度后期加速。封面由独立的 `KnowledgeCover` 画布生成，不再从视频首帧抽取。

正式渲染前按 [独立审核闸门](docs/REVIEW_WORKFLOW.md) 分别做内容审核与视觉/品牌审核。账号品牌识别规则读取外部内容仓库的 `brand/BRAND.md`；内置的 [财经编辑部预设](themes/finance-editorial/README.md) 只约束版式、图表和动效。

## 下一步

1. 增加场景级缓存与局部重渲染，缩短迭代时间。
2. 增加自动文本溢出检测和多平台安全区预设。
3. 将现有场景继续抽象为可配置模板，并补充快照测试。

更完整的阶段划分见 `docs/WORKFLOW.md`。

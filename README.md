# Knowledge Video Factory

面向抖音、小红书、B 站等平台的可复用知识视频生产骨架。目标形式是无真人出镜的轻 MG 知识图解：动态排版、数据图表、信息卡片、大字幕和少量必要素材。

当前版本已经跑通第一条 1080×1920 样片，包含可追溯资料、脚本、分镜、Edge Neural TTS 中文配音、Remotion 轻 MG 动画、字幕、响度标准化、自动质检、封面和发布文案。流程不会自动发布内容。

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
projects/    每条视频的输入、过程文件和输出
schemas/     brief、口播与分镜的数据约束
scripts/     项目级辅助命令
src/         配音、渲染、质检等适配层
templates/   可复用场景模板
```

## 已验证技术栈

- Node.js 22+ 与 pnpm
- Remotion 4 + React：代码驱动的动态图表和信息卡片
- Edge Neural TTS：无需账号的中文配音；需要联网，不承诺商用 SLA
- Chrome：逐帧渲染
- FFmpeg / ffprobe：音量标准化、编码和媒体质检

## 首次安装

要求 Node.js 22+、FFmpeg、Chrome/Chromium 和 Python 3.10+。

```powershell
pnpm install
powershell -ExecutionPolicy Bypass -File scripts/setup-voice.ps1
pnpm check:structure
pnpm typecheck
Copy-Item -Recurse projects/_template projects/my-first-video
```

然后填写新项目中的 `input/source.md`、`input/sources.json` 和 `input/data.csv`。不要直接在 `_template` 里制作视频。

## 制作一条视频

```powershell
# 1. 校验项目、逐场景配音、按真实音频生成时间线与 SRT
pnpm video:prepare a-share-buffett

# 2. 生成 540×960 低清预览并质检
pnpm video:render a-share-buffett
pnpm video:qa a-share-buffett

# 3. 人工确认后生成 1080×1920 正式版、封面与最终报告
pnpm video:render a-share-buffett --final
pnpm video:qa a-share-buffett --final
```

正式版会自动做响度标准化。质检会检查尺寸、编码、时长、字幕时间、来源、黑帧与音量，并从每个场景抽取一张截图到 `tmp/qa/`。

## 下一步

1. 增加 MiniMax 等带词级时间戳的正式 TTS 适配器。
2. 增加场景级缓存与局部重渲染，缩短迭代时间。
3. 增加自动文本溢出检测和多平台安全区预设。
4. 将现有场景继续抽象为可配置模板，并补充快照测试。

更完整的阶段划分见 `docs/WORKFLOW.md`。

# Knowledge Video Factory

面向抖音、小红书、B 站等平台的可复用知识视频生产骨架。目标形式是无真人出镜的轻 MG 知识图解：动态排版、数据图表、信息卡片、大字幕和少量必要素材。

当前版本只建立稳定的项目协议与目录边界，不包含任何付费 API 调用，也不会自动发布内容。

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

## 快速开始

要求 Node.js 22 或更高版本。第一版正式接入时，建议再安装 FFmpeg、Chrome/Chromium，并选择实际使用的渲染器与 TTS 服务。

```powershell
npm run check:structure
Copy-Item -Recurse projects/_template projects/my-first-video
```

然后填写新项目中的 `input/source.md`、`input/sources.json` 和 `input/data.csv`。不要直接在 `_template` 里制作视频。

## 下一步

1. 选定并验证主渲染引擎。
2. 接入中文 TTS，按场景保存音频及词级时间戳。
3. 实现 JSON Schema 校验、事实来源校验和媒体参数校验。
4. 完成第一个 `a-share-buffett` 样片，沉淀首批场景模板。

更完整的阶段划分见 `docs/WORKFLOW.md`。

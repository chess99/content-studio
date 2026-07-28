---
name: knowledge-video-workflow
description: 可追溯知识视频生产工作流。用于把文章、数据或研究主题制作成竖屏知识视频、口播视频、动态图表视频或无真人财经视频，编排 brief、脚本、分镜、配音、字幕、渲染和质检；不用于普通图文或长文。
---

# 知识视频工作流

## 定位

使用 `apps/knowledge-video-factory/` 作为确定性生产引擎，使用内容资产仓库作为唯一正式资产来源。执行前读取：

- `apps/knowledge-video-factory/AGENTS.md`
- `apps/knowledge-video-factory/docs/WORKFLOW.md`
- 内容资产仓库根目录 `AGENTS.md`

## 目录

先确定 `TOPIC_DIR`，视频项目目录固定为：

```text
VIDEO_DIR = TOPIC_DIR/video/
```

新项目从 `apps/knowledge-video-factory/projects/_template/` 初始化到 `VIDEO_DIR`。不要在 app 的 `projects/` 中创建正式选题。

## 阶段

1. 填写 `video/input/source.md`、`sources.json` 和必要的数据文件。
2. 生成并核对 `brief.json`。
3. 生成带 `sourceIds` 的 `script.json`，等待脚本人工确认。
4. 生成 `storyboard.json`；优先选择工厂注册模板。
5. 脚本确认后再生成配音、字幕和时间线。
6. 生成低清预览并运行技术质检。
7. 完成独立内容审核和视觉审核，关闭 P0 问题。
8. 用户确认低清预览后再渲染正式版。
9. 将封面、字幕、标题、平台文案、来源说明和最终视频放入 `video/publish/`；不自动上传平台。

## 引擎命令

在 `content-studio` 根目录运行：

```powershell
node apps/knowledge-video-factory/scripts/prepare-project.mjs --project-dir "<VIDEO_DIR>"
node apps/knowledge-video-factory/scripts/render-project.mjs --project-dir "<VIDEO_DIR>"
node apps/knowledge-video-factory/scripts/qa-video.mjs --project-dir "<VIDEO_DIR>"
```

正式渲染在用户确认低清预览后增加 `--final`。配音脚本同样传入 `--project-dir`；如果某个 provider 尚不支持外部目录，先修复适配器，不要把项目复制回 app。

## 门禁

- 每个事实性句子和图表值必须可追溯到 `sourceIds`。
- 付费配音或素材服务在脚本确认前不得调用。
- 正式渲染在低清预览确认前不得执行。
- 不得自动公开发布。

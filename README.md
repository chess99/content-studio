# Content Studio

本地优先、Agent 驱动的内容生产 monorepo。统一维护长文、图文和知识视频工作流，以及生图、转录、排版、渲染和多平台发布工具。

## 项目边界

- 内容资产：`D:\code\content`
- 博客发布：`D:\code\blog`
- 创作能力与生产工具：本仓库

所有工作流都接收明确的主题目录 `TOPIC_DIR`，例如：

```text
D:\code\content\topics\20260722-superpowers-flow-tax
```

不得把具体选题产物写入本仓库，也不得重新引入 `drafts/` 或 app 内部 `projects/` 作为正式内容库。

账号级品牌由内容资产仓库的 `brand/BRAND.md` 统一提供。工作流默认读取这个生效入口，再按任务需要读取封面、命名或视觉细则；本仓库只保存生产方法和可复用视觉预设，不复制某个账号的品牌资产。

本仓库是工作流与生产工具的当前维护入口，替代旧的独立 `content-workflows` 与 `knowledge-video-factory` 工作区。旧仓库只作历史参考，不再双向同步功能修改。

## 结构

```text
skills/                         Agent 工作流与工具入口
apps/wx-publisher/              微信公众号排版与草稿应用
apps/knowledge-video-factory/   知识视频生产与渲染应用
labs/xhs-publisher/             小红书发布能力实验
tools/                          小型通用工具
docs/                           跨模块设计和迁移文档
```

各 app 保留自己的依赖、测试、说明和局部 `AGENTS.md`。根目录不复制 app 的实现代码。

## Skills

- `longform-workflow`：博客、公众号和小红书长文的选题、研究、写作与审校。
- `image-post-workflow`：小红书、抖音等图片轮播内容的分级创作流程。
- `knowledge-video-workflow`：调用视频工厂完成知识视频脚本、分镜、配音、渲染和质检。
- `wechat-publish`：预览公众号内容并创建文章或贴图草稿。
- `chatgpt-imagegen`：通过本地命令生成位图。
- `douyin-download`：归档用户有权访问的抖音内容。

兼容入口：

- `.agents/skills` → `../skills`
- `.claude/skills` → `../skills`
- `.catpaw/skills` → `../skills`

## Apps 与 Tools

- `tools/transcribe_video.py`：使用 `ffmpeg` 和 `whisper.cpp` 转录本地音视频。
- `apps/wx-publisher`：Markdown/HTML 转微信公众号内容，提供 CLI、Studio、API、文章草稿和贴图草稿。
- `apps/knowledge-video-factory`：提供知识视频的结构化脚本、配音、字幕、Remotion 渲染和自动质检。
- `labs/xhs-publisher`：记录小红书发布工具的实测、风险和两阶段发布接口探索。

模型、大型中间文件、登录态和平台凭证保存在本地，不提交 Git。

## 验证

```powershell
python -m py_compile tools/transcribe_video.py
npm --prefix apps/wx-publisher test
pnpm --dir apps/knowledge-video-factory check:structure
pnpm --dir apps/knowledge-video-factory typecheck
```

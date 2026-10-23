# Content Studio

本地优先的内容创作工作区。把选题、产品更新和已有素材做成文章、图片或视频，保留可编辑工程，按需对接发布工具。

## 从任务开始

| 想完成的内容 | 入口 |
|---|---|
| 还没确定形式，或要同时做文章、图文和视频 | [内容制作](skills/content-producer/SKILL.md) |
| 博客、公众号、深度长文 | [长文工作流](skills/longform-workflow/SKILL.md) |
| 小红书、抖音图片轮播 | [图文工作流](skills/image-post-workflow/SKILL.md) |
| 信息图、机制图、知识漫画 | [视觉叙事](skills/visual-storytelling/SKILL.md) |
| 产品宣传片、软件演示、自由动效、素材剪辑 | [动态视频](skills/motion-video-workflow/SKILL.md) |
| 带来源、配音与字幕的知识视频 | [知识视频](skills/knowledge-video-workflow/SKILL.md) |
| 预览并创建公众号草稿 | [公众号发布](skills/wechat-publish/SKILL.md) |

可以直接描述目标和提供材料，由 Agent 选择对应入口。单项修改沿用原有文件与工程。

## 工作区与内容

本仓库保存制作能力。具体选题、文稿、素材、工程与成片保存在独立的 `content` 仓库，博客发布副本保存在 `blog`。优先使用调用方提供的路径；常见布局为三个同级目录，支持 macOS/Linux 与 Windows。

每次创作明确 `TOPIC_DIR`，先读取内容仓库的 `AGENTS.md` 与 `brand/BRAND.md`。资产组织以内容仓库规则为准；不自动将其 `research/` 中的探索结果当作生效品牌。正式产物不写入本仓库示例或缓存。

```text
skills/                         自研任务入口与流程
vendor/                         固定版本的第三方技术参考与工具
apps/motion-video/              可编辑 HTML 视频与本地渲染
apps/knowledge-video-factory/   结构化知识视频、配音与字幕
apps/wx-publisher/              公众号排版、预览与草稿
labs/xhs-publisher/             小红书发布实验
tools/                          转录、媒体检查与工作区维护
docs/                           模块设计和集成说明
```

## 开始使用

```sh
python3 tools/workspace_doctor.py
```

检查 Agent 入口、上游完整性与基础媒体工具。发现失效软链时：

```sh
python3 tools/workspace_doctor.py --repair-links
```

脚本保留真实目录，只修复软链。Windows 需支持 Git 软链检出及创建软链，必要时启用开发者模式。`.agents/skills/` 是发现入口，`.claude/skills` 和 `.catpaw/skills` 复用它。

按任务安装应用依赖即可。动态视频的快速上手与渲染命令见 [motion-video](apps/motion-video/README.md)；知识视频见 [knowledge-video-factory](apps/knowledge-video-factory/README.md)；公众号排版见 [wx-publisher](apps/wx-publisher/README.md)。

## 上游能力

- 归藏：真实产品组件、影片方向、配乐与审片。
- HyperFrames：HTML 视频、时间线编辑、渲染与技术检查。
- 宝玉：信息图布局与漫画叙事参考。
- human-writing：中文写作与改稿。

新增第三方源码由本地 workflow 按需读取，保持上游原样。许可与选型说明见 [创作能力集成](docs/creative-integrations.md)，精确 commit、内容摘要、额外许可证文件和本地补丁见 `vendor/skills.json`。

```sh
python3 tools/sync_vendor_skills.py --check
python3 tools/sync_vendor_skills.py baoyu-infographic baoyu-comic
python3 tools/sync_vendor_skills.py hyperframes --locked
```

同步默认跟踪 ref；`--locked` 使用已登记 commit。存在本地补丁或未登记改动时停止，避免静默覆盖。升级后检查差异、运行相应测试并提交。

## 常用工具

- `tools/media_review.py`：媒体参数检查、带时间码的联系表，输出到指定外部目录。
- `tools/transcribe_video.py`：通过 FFmpeg 和 whisper.cpp 转录本地音视频。
- `chatgpt-imagegen`：供缺少原生生图能力的环境使用的兼容入口；有原生工具时优先使用原生能力。
- `douyin-download`：归档有权访问的抖音素材。

本地转换、检查和预览可以直接执行。创建平台草稿、公开发布各自遵循明确授权；密钥、登录态和模型缓存不进入 Git。

## 验证

```sh
python3 tools/workspace_doctor.py
python3 -m unittest discover -s tests -v
python3 -m py_compile tools/sync_vendor_skills.py tools/workspace_doctor.py tools/media_review.py
npm --prefix apps/motion-video test
npm --prefix apps/wx-publisher test
pnpm --dir apps/knowledge-video-factory check:structure
pnpm --dir apps/knowledge-video-factory typecheck
```

修改自研 skill 后运行 `skill-creator` 的 `quick_validate.py`。视频流程还需实际渲染、打开抽帧、播放视频与试听；技术检查不替代内容和审美判断。

# Content Workflows

内容创作的 skills、工具和工作流开发仓库。本仓库只维护可复用能力，不保存具体选题资产，也不承担任何渠道的最终发布目录。

## 项目边界

- 内容资产：`D:\code\content`
- 博客发布：`D:\code\blog`
- 创作能力：本仓库

所有工作流都应接收明确的主题目录 `TOPIC_DIR`，例如：

```text
D:\code\content\topics\20260722-superpowers-flow-tax
```

不得假设主题内容位于本仓库，也不得重新引入 `drafts/` 作为本地创作区。

## Skills

- `content-workflow`：选题、研究、写作、审校、图片和渠道适配。
- `chatgpt-imagegen`：通过本地命令生成位图。
- `wechat-image-post`：准备公众号贴图素材并保存草稿。
- `douyin-download`：归档用户有权访问的抖音内容。

兼容入口：

- `.agents/skills` → `../skills`
- `.claude/skills` → `../skills`

## Tools

- `tools/transcribe_video.py`：使用 `ffmpeg` 和 `whisper.cpp` 转录本地音视频。

模型和大型中间文件保存在本地，不提交 Git。

在 macOS 上可安装工具依赖：

```bash
brew bundle
```

## 验证

```powershell
node --check skills/wechat-image-post/scripts/prepare-wechat-image-post.mjs
node --check skills/wechat-image-post/scripts/wechat-image-post-draft.mjs
python -m py_compile tools/transcribe_video.py
```

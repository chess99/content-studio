---
name: douyin-download
description: Use when a user asks to download, archive, parse, or save Douyin videos, image posts, favorites, or provides a douyin.com / v.douyin.com link.
---

# Douyin Download

使用独立命令行工具 `douyin-dl` 下载用户有权访问和保存的抖音内容。工具复用 Chrome 或 Edge 的现有登录态，不导出 Cookie，不依赖第三方解析站。

## 使用前检查

浏览器需要已登录抖音，并在 `chrome://inspect/#remote-debugging` 或 `edge://inspect/#remote-debugging` 中开启远程调试。

```powershell
douyin-dl doctor
```

若命令不存在，在本机工具仓库安装：

```powershell
cd D:\code\douyin-dl
npm link
```

## 下载单条作品

```powershell
douyin-dl single "https://www.douyin.com/video/作品ID" -o "<TOPIC_DIR>/douyin/source"
douyin-dl single "https://www.douyin.com/note/作品ID" -o "<TOPIC_DIR>/douyin/source"
```

只采集稳定元数据而不下载媒体：

```powershell
douyin-dl single "<抖音链接>" --metadata-only -o "<TOPIC_DIR>/douyin/source"
```

## 收藏列表

先预览，再按用户确认的数量下载：

```powershell
douyin-dl favorites --limit 20 --dry-run
douyin-dl favorites --limit 20 -o "<TOPIC_DIR>/douyin/source"
```

只有用户明确要求完整归档时才使用 `--all`。首次枚举会写入 `inventory.jsonl` 快照，断点续跑默认复用快照；只有需要重新抓取当前收藏时才添加 `--refresh-inventory`。成功作品记录在输出根目录的 `archive.jsonl`，重复运行会自动跳过；用户明确要求重下时添加 `--force`。最终失败项写入 `errors.jsonl`。

## 输出与边界

- 视频输出 `source.mp4`，图集输出 `image-001.webp` 等，每个作品同时写入 `metadata.json`。可选的 Whisper 转写会生成 `transcript.json`、`transcript.srt` 和必要的抽帧联系表；内容提炼由外部 AI 工作流写入 `analysis.json`，不使用仓库内置的本地大模型。
- 内容创作原始素材默认放在内容资产仓库的 `TOPIC_DIR/douyin/source/`，除非用户指定其他位置。
- 不提交下载的视频、图片、Cookie、收藏列表或临时媒体 URL，除非用户明确要求版本化媒体。
- 不绕过付费、私密、已删除或其他访问控制；单条不可访问作品应报告具体错误。
- 退出码 `1` 表示批量中存在内容失败，退出码 `2` 表示参数、浏览器、登录态或配置错误。

完整命令说明见 `D:\code\douyin-dl\README.md`。

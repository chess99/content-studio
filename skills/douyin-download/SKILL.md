---
name: douyin-download
description: Use when a user asks to download, archive, parse, or save Douyin videos, image posts, favorites, or provides a douyin.com / v.douyin.com link.
---

# Douyin Download

下载用户有权访问和保存的抖音视频或图文。优先使用已安装的独立工具 `douyin-dl`；缺少工具时，可通过已登录浏览器保存当前作品的媒体。本仓库只有编排入口，不包含 `douyin-dl` 的实现。

## 使用前检查

1. 确认当前机器、命令和工具源码是否存在。macOS/Linux 使用 `command -v douyin-dl`，PowerShell 使用 `Get-Command douyin-dl -ErrorAction SilentlyContinue`。命令缺失只代表本机未安装，不能据此判断工具源码或抖音接口失效。
2. 确定输出位置，遵循目标内容资产库的 `AGENTS.md`。下文 `<OUTPUT_DIR>` 是解析后的素材目录；不要把下载结果留在本工具仓库。
3. 若命令可用，运行诊断：

```powershell
douyin-dl doctor
```

只有 `douyin-dl` 的浏览器连接模式需要其 README 指定的远程调试设置。通过已连接的浏览器工具保存页面素材不要求另开调试端口。

历史工具位置是 `D:\code\douyin-dl`，先确认目录及 README 存在再安装，不把 Windows 路径当作所有机器的路径。确有本机源码时，可在工具仓库执行：

```powershell
npm link
```

## 下载单条作品

```powershell
douyin-dl single "https://www.douyin.com/video/作品ID" -o "<OUTPUT_DIR>"
douyin-dl single "https://www.douyin.com/note/作品ID" -o "<OUTPUT_DIR>"
```

只采集稳定元数据而不下载媒体：

```powershell
douyin-dl single "<抖音链接>" --metadata-only -o "<OUTPUT_DIR>"
```

## 缺少工具时的浏览器保存

适合单条作品；不据此宣称收藏批量下载已经可用。

1. 使用已连接的浏览器打开或读取用户提供的作品页，确认标题、作者和实际媒体类型。`/note/` 通常是图文，不应许诺生成 `source.mp4`。
2. 从当前作品的 DOM 定位主图或视频，排除头像、推荐列表封面、背景音乐和页面装饰。图集需逐页检查并按作品顺序保存、去重；未核实总数时注明只保存了当前可见图片。
3. 使用浏览器工具提供的媒体下载能力。当前 Chrome 工具支持匹配媒体元素后的 `locator.downloadMedia()`；可用 `pageAssets.list()` / `bundle()` 按确切资源 ID 保存作备选。按本次加载的工具文档调用，不在页面中运行任意网络请求或导出 Cookie。
4. 下载能力可能返回 Downloads 或临时目录路径，将成功文件归入 `<OUTPUT_DIR>`，记录稳定元数据（作品 ID、来源页面、标题、作者、类型、保存方式、已保存文件）。不把有期限的签名 CDN 地址当作长期来源。
5. 检查文件类型、尺寸或时长并查看内容。封面保存成功不等于视频保存成功；若视频只有 `blob:` 或下载失败，报告具体限制，不能用截图或封面充当成片。

## yt-dlp 与替代工具

`yt-dlp` 可作为视频候选，先探测再下载：

```sh
yt-dlp --ignore-config --no-cache-dir --skip-download --no-playlist --socket-timeout 20 "<视频链接>"
```

抖音与 TikTok 的支持范围不同。抖音 `/note/` 不匹配提取器时，换成 `/video/` 不能证明图集可用；403、`Fresh cookies` 等错误也不能直接解释为作品已删除。网络解析失败应先区分环境限制。需要 Cookie 时优先复用已登录浏览器，不要求用户把凭证贴入聊天。

研究其他方案前，读取 [工具核验记录](references/tool-status.md)。区分官方宣称支持、源码核验和本机下载实测，不能把 README 功能表当作成功验证。

## 收藏列表

先预览，再按用户确认的数量下载：

```powershell
douyin-dl favorites --limit 20 --dry-run
douyin-dl favorites --limit 20 -o "<OUTPUT_DIR>"
```

只有用户明确要求完整归档时才使用 `--all`。首次枚举会写入 `inventory.jsonl` 快照，断点续跑默认复用快照；只有需要重新抓取当前收藏时才添加 `--refresh-inventory`。成功作品记录在输出根目录的 `archive.jsonl`，重复运行会自动跳过；用户明确要求重下时添加 `--force`。最终失败项写入 `errors.jsonl`。

## 输出与边界

- `douyin-dl` 的约定输出为视频 `source.mp4`、图集 `image-001.webp` 等，同时写入 `metadata.json`。浏览器保存按实际编码使用扩展名，不把 JPEG 改名为 WebP。可选的 Whisper 转写会生成 `transcript.json`、`transcript.srt` 和必要的抽帧联系表；内容提炼由外部 AI 工作流写入 `analysis.json`，不使用仓库内置的本地大模型。
- 输出目录服从调用方提供的 `TOPIC_DIR` 和内容资产规范。无具体创作主题的工具实测归入资产库的调研目录，不创建虚构选题。
- 不提交下载的视频、图片、Cookie、收藏列表或临时媒体 URL，除非用户明确要求版本化媒体。
- 不绕过付费、私密、已删除或其他访问控制；单条不可访问作品应报告具体错误。
- 退出码 `1` 表示批量中存在内容失败，退出码 `2` 表示参数、浏览器、登录态或配置错误。

`douyin-dl` 完整命令说明以实际工具仓库的 README 为准；以上历史命令在本机缺少工具时不能视为已验证能力。

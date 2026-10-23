---
name: douyin-download
description: Use when a user asks to download, archive, parse, or save Douyin videos, image posts, favorites, or provides a douyin.com / v.douyin.com link.
---

# Douyin Download

优先使用本仓库的 `tools/douyin_download.py` 保存公开普通视频和静态图集。它读取移动分享页中的作品数据，在内存中保留网站下发的游客会话，不读取浏览器登录 Cookie，不依赖解析站、签名服务或远程调试。

## 输出与运行环境

- 定位本 skill 所属仓库，在仓库根目录运行命令；从其他目录调用时使用脚本绝对路径。
- 优先使用调用方提供的 `CONTENT_ROOT`、`TOPIC_DIR`；未提供内容根目录时可定位同级 `../content`。先读取实际内容库的 `AGENTS.md`，将 `<OUTPUT_DIR>` 解析为符合其规范的素材目录。无具体创作主题的工具测试放入调研目录，不创建虚构选题。
- Python ≥3.10，唯一 Python 运行依赖为 `requests`。推荐 `uv run` 自动准备隔离环境；已有 Python 环境安装 requests 后也可直接运行。FFprobe 可选，存在时自动检查图像流、尺寸、时长与音轨；不存在时只检查文件头和传输长度。
- 不把正式产物、凭证或临时媒体 URL 写入本工具仓库。

## 下载单条或多条作品

```sh
uv run tools/douyin_download.py single "https://www.douyin.com/note/作品ID" -o "<OUTPUT_DIR>"
uv run tools/douyin_download.py single "https://www.douyin.com/video/作品ID" -o "<OUTPUT_DIR>"
```

同一个 `single` 命令可接多个链接，也接受一段包含链接的分享文本、`modal_id` 作品链接和纯作品 ID。分享短链会先跟随官方重定向。主页、收藏列表不能当作单作品输入。

只获取元数据和媒体数量：

```sh
uv run tools/douyin_download.py single "<作品链接>" --metadata-only -o "<OUTPUT_DIR>"
```

行为与结果：

- 每个作品保存在 `<OUTPUT_DIR>/<完整作品ID>/`，包含 `metadata.json` 和 `source.mp4` 或按原顺序编号的 `image-001.webp` 等。图片扩展名依据文件头，保留服务端实际提供的编码。
- 图集优先读取全部图片，不能把图集的背景音乐当成视频。当前仅承诺静态图片，不承诺实况照片中的动态片段。
- MP4 使用官方播放地址请求 1080p；实际分辨率以输出文件检查结果为准，不承诺原上传画质或 4K。
- 首次分享页可能只有空壳但刚下发游客身份，工具会在同一会话重试，并有限地尝试两个官方域名。默认每个域名最多 3 次，可用 `--attempts 1` 至 `5` 调整；仍无数据时不把作品断言为已删除。
- 每保存一个文件就记录字节数和 SHA-256；`complete: true` 仅在全作品保存后写入。重跑跳过已通过哈希校验的完整归档；未完成图集继续保存缺失文件，不支持媒体字节级续传。
- 已归档文件损坏或丢失时报告错误，不静默跳过。用户要求修复或重下时使用 `--force` 替换该作品媒体；不要为普通重复运行添加此参数。
- `--metadata-only` 写入 `metadata-preview.json`，不覆盖未完成下载的进度。已完成且校验通过的归档默认直接跳过。
- 标准输出每条一个 JSON 结果，状态为 `downloaded`、`skipped`、`metadata` 或 `failed`。退出码 `0` 表示本次输入均成功或跳过，`1` 表示至少一条失败，`2` 表示参数错误。

下载后检查 `metadata.json` 的数量与验证结果；需要质量验收时打开图片，视频可额外做完整解码、抽帧与试听。没有 FFprobe 时不得把文件头检查称为完整媒体验证。

## 分享页失败时的浏览器备选

1. 使用已连接的浏览器读取用户提供的作品页，核对标题、作者、类型和图集数量。
2. 从当前作品 DOM 定位主图或视频，排除头像、推荐封面、背景音乐和装饰。图集逐页保存并核对顺序；未核实总数时注明仅保存了当前可见图片。
3. 使用当前工具文档支持的媒体下载能力。Chrome 工具可对确切媒体元素调用 `locator.downloadMedia()`；`pageAssets.list()` / `bundle()` 可作备选。不要自行连接调试端口或在页面中导出 Cookie。
4. 下载工具返回 Downloads 或临时路径时，将成功文件归入 `<OUTPUT_DIR>`，记录稳定来源页面与保存方式。不要覆盖主下载器格式的 `metadata.json`，除非同时遵循其完整性记录。
5. 检查实际文件。封面成功不等于视频成功；仅有 `blob:`、验证码或下载失败时报告限制，不用截图、音频或封面冒充成片。

## 收藏与其他工具

- 本脚本不枚举收藏或主页。若用户要求批量收藏，先读取 [工具核验记录](references/tool-status.md) 并检查当前机器是否具备另外的枚举工具；不能假装单作品命令已支持收藏。
- 历史 `douyin-dl` 是独立工具，源码不在本仓库。只有确认本机命令和源码存在，才按其 README 运行 `doctor`、`favorites` 等；历史 Windows 路径不代表当前机器已安装。用户明确要求完整归档时才能使用其 `--all`，否则先预览并限定数量。
- yt-dlp 的抖音 `/note/` 与 TikTok 图集支持不同，403 或 Fresh cookies 也不能直接解释为作品不存在。候选工具要做实际下载验证，README 功能表不能充当成功证据。
- 不绕过付费、私密、已删除等访问控制；遇到需要用户登录或完成验证码的页面应报告具体状态。

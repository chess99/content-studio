# 抖音下载工具核验

首次核验日期为 2026-10-23，2026-10-24 继续做了实际安装、下载与重复运行验证。平台和版本会变化，以下结果只代表本次环境。

## 当前推荐：仓库内公开分享页下载器

`tools/douyin_download.py` 使用 requests Session 读取两个官方移动分享域名，不读取浏览器 Cookie，游客身份只在进程内保留。首次空壳页之后继续请求作品数据，是本次成功所需的关键处理；不能见到 `_ROUTER_DATA` 就当作已经拿到作品。

2026-10-24 在 macOS、Python 3.12、requests 2.34.2 下，用 `uv run` 三次启动独立进程、游客会话及输出目录：

| 真实样本 | 每次落盘结果 | 三轮结果 |
| --- | --- | --- |
| 用户原链接，作品 ID `7680458809420405860` | 一张 1080×1440 WebP，30,964 字节 | 3/3 成功 |
| 公开短视频 `7699394719613218470` | 20.066667 秒，1080×1768，H.264 + AAC MP4，3,788,663 字节 | 3/3 成功 |
| F2 官方测试提及的图集 `7686072587252833777` | 两张 1440×1920 WebP，按作品顺序保存 | 3/3 成功 |

三轮同一媒体的 SHA-256 一致，12 个媒体文件全部通过完整解码检查；图集打开核对，视频检查抽帧。另验证已完成归档重跑时不访问网络。自动化测试覆盖空壳重试、作品 ID 匹配、图集音乐排除、音频冒充视频拒绝、截断响应、实际图片编码、哈希损坏检测、图集失败后续下缺失文件及元数据不包含签名 URL。

边界：只验证了普通视频与静态图集；不支持收藏/主页枚举，不承诺实况片段、原上传画质或 4K。F2 官方旧短链 `iRNBho6u` 能跳转，但当前未取得作品数据，未计作短链下载成功。

公开分享页方法的调研来源为 [aiaoxd/douyinDownloader](https://github.com/aiaoxd/douyinDownloader)、[qgeng1465/douyin-watermark-free-downloader](https://github.com/qgeng1465/douyin-watermark-free-downloader) 与 [media-parser 抖音解析说明](https://github.com/ucmao/media-parser/blob/main/docs/parsers/douyin.md)。仓库脚本独立实现未直接引入第三方源码，也没有引入这些项目的浏览器登录或合成视频流程。

## 其他路径实测

环境为 macOS，已有登录抖音的 Chrome，安装的 yt-dlp 版本为 `2026.08.19`。

| 路径 | 结果 | 结论边界 |
| --- | --- | --- |
| 仓库 skill → `douyin-dl` | 命令及历史独立仓库在当前 Mac 不存在 | 本机缺依赖，未验证原独立工具源码是否失效 |
| yt-dlp 读取用户提供的 `/note/` | `Unsupported URL` | 该图文入口不受支持 |
| yt-dlp 读取同 ID 的 `/video/` | 403，`Fresh cookies (not necessarily logged in) are needed` | 单独改 URL 不能让图集变得受支持 |
| yt-dlp `--cookies-from-browser chrome` 读取真实短视频 | 本机完成 Cookie 读取后仍报 403 / Fresh cookies | 该视频的已登录请求也失败，没有作为稳定入口 |
| F2 默认开发分支的隔离安装 | 成功安装并运行；无登录 Cookie 的单作品请求返回 HTTP 200 空响应，退出码 1 | F2 的登录态临时配置测试被自动审批拒绝，未执行；未用其他方式继续提取凭证 |
| qgeng 轻量下载器 2.1.1 官方 CLI | 原图文和短视频均误报不存在/已删除；进程仍退出 0 | 第一次拿到的空壳数据被当作终局，不能靠退出码判断下载成功 |
| Chrome 当前作品 → 媒体元素下载 | 单图成功；另下载了 20.066667 秒、1080×1768 的 HEVC + AAC 视频，完整解码通过 | 可作单作品备选；没有验证收藏批量 |
| Chrome `pageAssets.bundle()` | 同图 JPEG 资源成功，WebP 资源 fetch 失败 | 失败时可试元素媒体下载，不能因单一路径失败断言资源不可保存 |

yt-dlp [当前 DouyinIE 源码](https://github.com/yt-dlp/yt-dlp/blob/master/yt_dlp/extractor/tiktok.py) 的 URL 匹配仍为 `/video/`。TikTok 图集功能不能直接外推到抖音 `/note/`。

## 其他工具的维护状态

### F2

- [官方仓库](https://github.com/Johnserf-Seed/f2)与[正式文档](https://f2.wiki)。官方列出单作品视频、图集及收藏等能力，并提供 Cookie 配置。
- 默认分支为 `v0.0.1.8-pw3`，仓库最近推送日期为 2026-10-19；README 明示默认分支是开发分支，改动可能尚未发布到 PyPI。
- GitHub 最新正式 Release 仍为 [v0.0.1.7](https://github.com/Johnserf-Seed/f2/releases/tag/v0.0.1.7)，发布时间为 2024-12-31。不能把开发分支功能当作包管理器安装后的保证。
- 开发分支已在临时环境安装实测，见上表；当前不设为默认下载依赖。包内显示版本仍为 `0.0.1.7`，因此记录来源分支比只记 CLI 版本更有意义。

### TikTokDownloader / DouK-Downloader

- [官方仓库](https://github.com/JoeanAmier/TikTokDownloader)列出抖音视频、图集、收藏、断点续传和从浏览器读取 Cookie 等能力，支持 Mac / Windows。
- 最新 Release 为 [5.8](https://github.com/JoeanAmier/TikTokDownloader/releases/tag/5.8)，发布时间为 2026-09-13，源码要求 Python ≥3.12。
- 当前 README 顶部明确说明“本项目的加密参数算法不再维护”，平台变动后可能需要自行提供算法。不能仅凭 stars 或发布日期推荐为开箱即用的默认方案。

当前单作品优先使用本仓库脚本，失败时使用已登录浏览器保存媒体。需要收藏/主页批量枚举时，另行验证枚举工具，不把单作品成功外推为整账号归档已通过。

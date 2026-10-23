# 抖音下载工具核验

核验日期为 2026-10-23。平台和版本会变化，以下结果只代表本次环境；重试时记录当前版本和实际错误。

## 本机实测

环境为 macOS，已有登录抖音的 Chrome，安装的 yt-dlp 版本为 `2026.08.19`。

| 路径 | 结果 | 结论边界 |
| --- | --- | --- |
| 仓库 skill → `douyin-dl` | 命令及历史独立仓库在当前 Mac 不存在 | 本机缺依赖，未验证原独立工具源码是否失效 |
| yt-dlp 读取用户提供的 `/note/` | `Unsupported URL` | 该图文入口不受支持 |
| yt-dlp 读取同 ID 的 `/video/` | 403，`Fresh cookies (not necessarily logged in) are needed` | 未带浏览器 Cookie 的探测失败，不能外推所有视频均无法下载 |
| Chrome 当前作品主图 → 媒体元素下载 | 成功下载 WebP，1080×1440，并打开核对 | 验证了一条单图图文，未验证多图、真实视频或收藏批量 |
| Chrome `pageAssets.bundle()` | 同图 JPEG 资源成功，WebP 资源 fetch 失败 | 失败时可试元素媒体下载，不能因单一路径失败断言资源不可保存 |

yt-dlp [当前 DouyinIE 源码](https://github.com/yt-dlp/yt-dlp/blob/master/yt_dlp/extractor/tiktok.py) 的 URL 匹配仍为 `/video/`。TikTok 图集功能不能直接外推到抖音 `/note/`。

## 替代候选（仅官方资料核验，未安装实测）

### F2

- [官方仓库](https://github.com/Johnserf-Seed/f2)与[正式文档](https://f2.wiki)。官方列出单作品视频、图集及收藏等能力，并提供 Cookie 配置。
- 默认分支为 `v0.0.1.8-pw3`，仓库最近推送日期为 2026-10-19；README 明示默认分支是开发分支，改动可能尚未发布到 PyPI。
- GitHub 最新正式 Release 仍为 [v0.0.1.7](https://github.com/Johnserf-Seed/f2/releases/tag/v0.0.1.7)，发布时间为 2024-12-31。不能把开发分支功能当作包管理器安装后的保证。
- 若要恢复长期 CLI 批量下载，可优先在隔离环境评估。应固定版本，先用单条视频和图集验证，再验证收藏与断点续跑；本次不将它设为稳定默认依赖。

### TikTokDownloader / DouK-Downloader

- [官方仓库](https://github.com/JoeanAmier/TikTokDownloader)列出抖音视频、图集、收藏、断点续传和从浏览器读取 Cookie 等能力，支持 Mac / Windows。
- 最新 Release 为 [5.8](https://github.com/JoeanAmier/TikTokDownloader/releases/tag/5.8)，发布时间为 2026-09-13，源码要求 Python ≥3.12。
- 当前 README 顶部明确说明“本项目的加密参数算法不再维护”，平台变动后可能需要自行提供算法。不能仅凭 stars 或发布日期推荐为开箱即用的默认方案。

对单条已可见作品，优先保存已登录浏览器加载的媒体；需要无人值守或批量时，再做候选工具的真实下载验证。

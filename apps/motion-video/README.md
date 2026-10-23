# 动态视频工程

用 HTML、CSS、GSAP 和本地媒体制作可编辑视频。适合产品演示、自由动效、机制讲解与素材编排。预览和时间线编辑复用 HyperFrames 自带界面。

## 环境

需要 Node.js 22+、FFmpeg/FFprobe、可用的 Chrome。首次安装：

```sh
npm --prefix apps/motion-video ci
```

`package-lock.json` 固定运行依赖；当前 HyperFrames 为 `0.8.188`，GSAP 为 `3.15.0`。包装器关闭 HyperFrames 遥测，只开放本地制作命令，不安装全局 skills。Chrome 未被识别时，通过 `HYPERFRAMES_BROWSER_PATH` 指定浏览器可执行文件。使用已安装浏览器可避免额外下载。

## 新建与预览

以下命令在仓库根目录执行。把占位路径换成实际**绝对路径**，所有工程与输出必须在本仓库以外。

```sh
node apps/motion-video/scripts/video.mjs init --project-dir "<TOPIC_DIR>/video/project" --width 1920 --height 1080 --duration 6
node apps/motion-video/scripts/video.mjs lint --project-dir "<TOPIC_DIR>/video/project"
node apps/motion-video/scripts/video.mjs check --project-dir "<TOPIC_DIR>/video/project" -- --json
node apps/motion-video/scripts/video.mjs snapshot --project-dir "<TOPIC_DIR>/video/project" -- --at 0,2,4
node apps/motion-video/scripts/video.mjs preview --project-dir "<TOPIC_DIR>/video/project"
```

初始化生成一个技术样片及本地 GSAP 文件，用于验证渲染链路。`project.json` 保存初始尺寸、时长和运行版本；实际时间线以 HTML 的 `data-duration`、场景和媒体为准。制作时替换样片内容，修改画幅时同步工程参数。已有目录不会被初始化覆盖。

预览命令输出本地地址，可在浏览器中查看并编辑。命令前台运行，结束预览时停止对应进程。`info`、`timeline` 可查看工程信息。`--` 后的参数传给已安装版本的对应 CLI 命令。

## 渲染与检查

```sh
node apps/motion-video/scripts/video.mjs render --project-dir "<TOPIC_DIR>/video/project" --output "<TOPIC_DIR>/video/renders/preview-01.mp4" --quality draft
python3 tools/media_review.py "<TOPIC_DIR>/video/renders/preview-01.mp4" --output-dir "<TOPIC_DIR>/video/review/preview-01" --expect-duration 6 --expect-size 1920x1080
```

渲染前自动运行 HyperFrames `check`，失败时停止。`draft` 是较低编码质量，保持工程画幅；正式成片使用 `--quality delivery` 并输出到主题的 `video/publish/`。同名成片拒绝覆盖，修改后使用新版本文件名。

媒体检查生成 `probe.json`、`review.json` 和带时间码的 `contact-sheet.png`。有音频要求时增加 `--require-audio`。技术报告检查时长、画幅、像素格式和音轨存在性；视觉与听感保留待审状态，需要实际看画面、播放视频并试听。它不检测全部黑帧、错字、削波或字幕同步问题。

## 可编辑性与依赖

工程保存本地素材、字体、源 HTML 和必要许可。复杂影片按场景拆分，参考 `skills/motion-video-workflow/`。依赖安装在本 app，工程可通过此包装器在另一台机器复现；分发工程时附带所用版本信息与依赖安装说明。

GSAP 源文件保留原版权头，并随工程复制上游 README 中的许可入口。HyperFrames 采用 Apache-2.0；GSAP 使用其标准许可。第三方字体、照片、音乐和产品组件分别保留来源。

```sh
npm --prefix apps/motion-video test
node --check apps/motion-video/scripts/video.mjs
```

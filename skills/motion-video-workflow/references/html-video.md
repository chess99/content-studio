# HTML 视频

使用 `apps/motion-video` 固定版本的 HyperFrames。先读该 app 的 README；全部命令显式传入外部 `--project-dir`。运行时只安装一次，工程保存可编辑 HTML 和本地资源。

## 按需阅读上游

根目录：`vendor/heygen-com/hyperframes/`。

| 遇到的问题 | 技术参考 |
|---|---|
| 时间轴、场景拆分、变量和媒体标签 | `hyperframes/references/format.md` |
| GSAP、Three.js、Canvas 等 seek 行为 | `hyperframes/references/runtimes.md` |
| 镜头动作与节奏 | `hyperframes/references/motion.md` |
| 字幕与图层 | `hyperframes/references/captions.md`、`overlays.md` |
| 已有组件是否合适 | `hyperframes-registry/SKILL.md` |
| 检查、抽帧、局部修改 | `hyperframes-cli/SKILL.md` |
| 音乐、配音、素材处理 | `media-use/SKILL.md` 中对应参考；外部服务按本任务授权选择 |

上游 `npx hyperframes` 命令须对应本地锁定版本；优先用 app 包装器。需要额外 CLI 功能时先查看已安装 CLI 的 `--help`，不要运行会自动刷新 skills 的命令。

## 工程约束

- 所有动画由可定位的时间轴驱动；不用真实时钟、随机数或定时器推进成片。
- 拆分长片为独立场景；根文件保留组装关系。文案和颜色通过可编辑变量暴露。
- 字体、图片、脚本和音轨本地化。记录许可，确认中文字体覆盖及跨机器可用性。
- 有数据的图表由准确数据渲染；图片模型可提供背景和插画，不能提供事实数据。
- `.clip` 的显示由引擎控制，入场动画作用于子元素。显式给音轨 id、时长与音量。
- 运行 `check` 后，打开首帧、每个场景中点和转场两侧的静帧，再看解码后的成片抽帧。缺失组件与字体须回到源工程修复。

场景复杂度从内容需要出发。短解释片用少量动作就能说清时，不追加章节卡、反复淡入、泛光或悬浮装饰。

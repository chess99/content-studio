# 产品演示

先确认实际要宣传的功能和版本范围。用户已指定范围就沿用；未指定时从提供的材料提出一个具体范围。不能把尚未发布的功能演成已上线，也不能从几个提交推断产品全貌。

## 镜头素材

按可行性优先使用：真实业务组件与固定演示数据、真实页面或录屏、经核对的截图。抽象动画适合解释流程与机制。画面中的产品名称、功能标签、数值和结果要能回到来源。

组件抽取放入独立视频工程，补齐必要 provider 和样式；不带入账户 Cookie、生产接口、用户数据或完整业务依赖。接通一个镜头后先出静帧，确认视觉与产品一致。复杂原生应用可以使用录屏，不强行重写一套假界面。

把产品的动作转成影片动作：操作触发结果，结果带出下一段；镜头放大观众需要看清的局部。产品设计语言决定颜色、字形和材质，构图与字号为视频观看距离调整。

## 归藏参考与工具

源码：`vendor/op7418/guizang-product-video-skill/`。

- 镜头方向：`references/direction.md`、`references/visual-vocabulary.md`。
- 接入真实组件：`references/component-pipeline.md`。
- 声音制作与审片：`references/audio-sourcing.md`、`references/audio-and-qa.md`、`references/review.md`。
- 需要 React 业务组件与逐帧浏览器交互时，可使用上游起步工程：

```sh
python3 vendor/op7418/guizang-product-video-skill/scripts/init_project.py --output "<TOPIC_DIR>/video/project" --style repo --repo "<PRODUCT_REPO>"
python3 vendor/op7418/guizang-product-video-skill/scripts/check_environment.py --project "<TOPIC_DIR>/video/project" --engine browser
```

该工程使用上游自己的 build、preview、render 命令；先读其 `references/starter.md`，不要交给本地 HyperFrames 包装器渲染。仅在确需该运行时才初始化它。

上游主体为 AGPL-3.0，`assets/fallback/` 有单独的 BUSL-1.1 来源说明；保留原许可证。默认使用产品自己的设计与素材，不把 CodePilot fallback 当成本工作区公共品牌。分发派生代码前核对对应条款。简单 HTML 动效使用本工作区独立编写的起步工程。

# 创作能力集成

核对日期：2026-10-23。此文记录生产工具的选型、维护边界和验证方式。上游精确版本与本地摘要见 `vendor/skills.json`。

## 能力分工

| 任务 | 本地入口 | 执行方式 |
|---|---|---|
| 选题转制作任务、跨形态组合 | `content-producer` | 根据读者目标选择已有工作流 |
| 长文与图片轮播 | `longform-workflow`、`image-post-workflow` | 保留现有研究、写作和图片质检链路 |
| 信息图、机制图、知识漫画 | `visual-storytelling` | 自研编排，按需读取宝玉布局与叙事参考 |
| 可追溯口播与数据知识视频 | `knowledge-video-workflow` | 现有 Remotion 工厂与配音、字幕管线 |
| 产品演示、自由动效、素材剪辑 | `motion-video-workflow` | HTML 视频、归藏组件工程或已有剪辑链路 |
| 公众号草稿 | `wechat-publish` | 保留现有明确授权边界 |

视频编辑界面复用 HyperFrames。工作区负责稳定入口、外部资产路径、版本固定和成片检查；不维护另一套时间线编辑器。知识视频工厂继续承接结构化脚本与事实来源约束，已有项目无需迁移。

## 上游核对与选择

| 来源 | 核实的能力与边界 | 集成方式 |
|---|---|---|
| [归藏产品视频](https://github.com/op7418/guizang-product-video-skill) | 真实组件接入、影片方向、音效混音和审片；主体 AGPL-3.0，fallback 素材另有 BUSL-1.1 条款 | 完整 vendor、保持原样。由产品演示参考接入，默认使用产品自身素材 |
| [HyperFrames](https://github.com/heygen-com/hyperframes) | HTML 可定位时间轴、编辑预览、逐帧渲染、检查与抽帧；Apache-2.0 | vendor 四个核心技术 skills；运行时使用固定 npm 版本，本地 app 提供统一入口 |
| [宝玉 skills](https://github.com/JimLiu/baoyu-skills) | 信息图布局与风格、漫画分格与角色连续性；MIT | vendor 信息图和漫画两个目录及根许可证；自研 workflow 按需读取参考 |
| [Remotion 官方 skills](https://github.com/remotion-dev/skills) | React 视频、字幕与渲染知识 | 现有 Remotion 应用继续维护；本轮不另添重复自动发现入口，未复制该 skill 仓库 |
| [ai-video-skill](https://github.com/TimoteoAltobrando/ai-video-skill) | 覆盖原片剪辑、生成素材、音乐和多画幅；依赖多种外部服务，流程中有多轮固定确认 | 参考其任务覆盖范围；未复制源码，素材剪辑使用自研流程与本地工具 |
| [Opus video recipes](https://github.com/bilaldemirerr/opus-video-recipes) | 可查看提示词、工程及成片的案例集合 | 用于检验可编辑代码视频路线；案例不进入正式 workflow 依赖 |
| [Orbit](https://github.com/YvanKOB/orbit) | 原生录屏、光标与缩放编辑、录制接口 | 作为真实产品素材采集候选；未安装、未实测，不列为必需能力 |
| [fal 模型接口](https://fal.ai/models/fal-ai/heygen/v3/video-agent/api) | 提供远程生成视频的服务接口 | 按项目按需使用；不绑定账户、不新增默认付费后端 |

模型名称不进入工作流契约。创作判断由当前 Agent 完成，交付工程记录真实工具版本、素材来源和渲染参数。

## 源码与本地编排

新增上游副本设置 `discovery: false`，由自研入口按需加载。上游的安装方式、账号引导、输出目录和发布流程不自动成为工作区默认行为。这样可以保持源码与上游逐字一致，也让本地适配集中在 `skills/` 和 `apps/`。

- 直接 vendor：适合维护活跃、许可清楚且有可复用技术参考的项目。
- 自研流程：负责创作任务选择、资产边界和已有工具的衔接。
- 本地补丁：只在确有必要时使用；`localPatches` 标明文件与原因，同步工具拒绝覆盖。
- 云端服务与原生采集应用：通过素材或明确接口连接，不复制完整产品进入仓库。

新增上游源码共七个 skill 单元。HyperFrames 四个目录保持兄弟目录布局，保留相互引用；其他可选扩展未安装，只有任务需要时再评估。

## 维护与验证

```sh
python3 tools/workspace_doctor.py
python3 tools/sync_vendor_skills.py --check
python3 tools/sync_vendor_skills.py hyperframes hyperframes-cli hyperframes-registry media-use
python3 tools/sync_vendor_skills.py baoyu-infographic --locked
```

普通同步跟踪登记 ref，`--locked` 使用登记 commit。同步前检查本地摘要，已有改动或补丁会阻止替换。多个同源 skill 共用一次临时 checkout。根许可证通过 `extraFiles` 一并复制；仓库 `.git`、缓存和依赖目录不进入 vendor。

源码更新后运行本地测试、相应上游测试与真实样片验证，再检查 diff 和摘要并提交。图片创作参考的结构校验不代表具体生图质量，图片交付仍需逐字和视觉检查。

## 本轮验收

2026-10-23，在 macOS 上完成以下验证：

- 5 个新增或修改的自研 skill 通过 `quick_validate.py`。
- 8 项工作区工具测试、3 项视频入口测试、归藏上游的 18 项测试通过；覆盖版本恢复、同步失败回滚、补丁保护、路径边界与既有工程保护。
- 公众号应用构建完成，151 项回归测试通过。
- 6 秒基础动效与 12 秒真实公众号 Studio 演示均完成 MP4 导出；后者包含中文画面、镜头移动和 AAC 音轨。已检查解码抽帧、时长、画幅及音轨存在性。
- HyperFrames 编辑预览中能加载正确工程、显示画面和音轨时间线，并播放至片尾。

测试样片和报告保存在外部临时目录，未进入仓库。本轮未对 Windows、付费素材服务或图片生成后端做实测；音轨存在性已验证，听感保留为人工验收项。

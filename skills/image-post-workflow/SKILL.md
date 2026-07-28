---
name: image-post-workflow
description: 图片轮播和单图配文创作工作流。用于小红书图文、抖音图文、公众号贴图、社交媒体 carousel、数据卡片、产品截图帖和 AI 主视觉；不用于长文章或视频。按事实与视觉风险选择流程深度，避免为简单图文强制执行完整长文流程。
---

# 图文创作工作流

## 原则

先确定 `TOPIC_DIR` 并读取内容资产仓库根目录的 `AGENTS.md`。图文工作目录为：

```text
IMAGE_POST_DIR = TOPIC_DIR/image-post/
```

按内容风险裁剪流程。不要为了“流程完整”制造无用文档，也不要把同一正文和图片按平台复制多份。

## 风险分级

| 类型 | 例子 | 必需步骤 |
|---|---|---|
| 体验/氛围型 | 个人感受、AI 主视觉、单图故事 | 定位、文案、视觉检查 |
| 产品/证据型 | 工具发布、过程截图、实测记录 | 来源留档、隐私检查、证据与表述对应 |
| 数据/财经型 | 财富榜单、投资数据、对比图 | `research.md`、口径核对、逐项事实检查 |
| 多卡叙事型 | 观点轮播、教程、案例拆解 | `image-plan.md`、卡片顺序、缩略图可读性检查 |

高风险要求可以叠加。用户只要求修改一张图或一段文案时，直接执行局部任务。

## 流程

1. 在 `topic.md` 记录主题、目标读者、发布目的和渠道状态。
2. 按风险决定是否创建或补充根目录 `research.md`；原始证据放 `shared/`。
3. 写 `image-post/post.md`。标题、正文和标签可以放在同一文件中。
4. 多图时写 `image-post/image-plan.md`，明确每张图的作用、信息、证据和顺序；单图可以省略。
5. 收集、生成或编辑图片。表达性封面和插画优先直接生图；只有数据精确、表格对齐或文字必须完全可控时才使用程序化排版。
6. 将最终发布图放入 `image-post/images/`，生图原稿或只属于本次图文的中间素材放 `image-post/source/`。
7. 按 `references/quality-gates.md` 完成事实、视觉、隐私和发布检查。
8. 在 `topic.md` 记录各平台使用版本。只有发生实质差异时才创建 `image-post/xiaohongshu/`、`image-post/douyin/` 或 `image-post/wechat/`。

## 资产结构

```text
TOPIC_DIR/
├── topic.md
├── research.md                 # 按风险创建，可跨形态复用
├── shared/                     # 原始证据和跨形态素材
└── image-post/
    ├── post.md
    ├── image-plan.md           # 多图时可选
    ├── images/                 # 最终发布图
    ├── source/                 # 本次图文的原稿和中间素材
    ├── xiaohongshu/            # 仅保存平台差异
    ├── douyin/
    └── wechat/
```

不要保存 ZIP。不要覆盖原始素材。不要把 AI 生成的数字、引用或界面文字当作事实来源。

---
name: longform-workflow
description: 长文内容创作流水线。用于博客文章、微信公众号文章、小红书长文、深度稿件、文章研究、起草和审校，并按技术教程、产品评测、行业分析、观点评论、个人叙事等题材选择不同写法；不用于图片轮播、单图配短文或视频制作。自动检测长文阶段并执行对应角色。
---

# 长文创作流水线

## 流程

```text
原始想法 → 选题 → 研究 → 初稿 → 独立审校 → 终稿 → 渠道适配
```

图片编辑按需介入：文章已有图片素材时负责选图；计划发公众号时负责封面。

## 确定目录

先确定内容资产仓库中的主题目录 `TOPIC_DIR`：

```text
<内容仓库>/topics/YYYYMMDD-<slug>/
```

日期取首次立项日期。长文工作目录固定为：

```text
LONGFORM_DIR = TOPIC_DIR/longform/
```

读取内容仓库根目录的 `AGENTS.md`。不要把具体主题写入 `content-studio`，不要为平台复制整套内容，也不要保存 ZIP 传输包。

## 品牌上下文

从 `TOPIC_DIR` 向上定位内容资产仓库根目录 `CONTENT_ROOT`。开始选题表达、写作、渠道适配或制作图片前，必须读取 `CONTENT_ROOT/brand/BRAND.md`，用其中的定位、语气和事实边界约束成稿。品牌入口不提供固定封面模板；平台需要封面时按文章内容选择真实素材、图片模型、混合制作或确定性工具。

只使用 `BRAND.md` 明确列出的正式资产，不自动搜索或读取 `CONTENT_ROOT/research/`。命名讨论、Logo 探索和历史封面实验只有被人工确认并写入正式品牌入口后才生效。

## 文体路由

选题时先写明一个主要文体和一个读者任务。读者任务要说明读完以后需要理解、判断或完成什么，不能只写“了解这个主题”。

| 主要文体 | 适用任务 | 写作 profile |
|---|---|---|
| 技术教程 | 复现操作、理解实现、诊断故障 | `references/technical-tutorial.md` |
| 产品评测 | 判断产品效果、限制与适用人群 | `references/product-review.md` |
| 行业分析 | 理解变化、参与者、成本和影响 | `references/industry-analysis.md` |
| 观点评论 | 处理争议并形成有依据的判断 | `references/opinion-commentary.md` |
| 个人叙事 | 讲述真实经历、选择与认知变化 | `references/personal-narrative.md` |

选题、研究、写作和审校阶段必须完整读取主要文体的 profile。混合题材仍只选一个主要文体；只有次要文体会实质改变取材、结构或事实边界时，才再读取一份 profile。遇到表中未覆盖的文体，写成 `其他（具体名称）`，遵循通用指南，不要硬套最接近的模板。

## 阶段检测

| 已有文件 | 下一步 |
|---|---|
| 无 | 选题编辑 |
| `longform/topic-card.md` | 素材研究员 |
| `research.md` | 主笔 |
| `longform/draft.md` | 同行审校；有图片素材时可先做图片编辑 |
| `longform/review.md` | 主笔处理意见并生成 `longform/final.md` |
| `longform/final.md`，计划发公众号但无封面 | 图片编辑制作封面 |
| `longform/final.md` | 渠道适配 |

用户明确要求某个环节时，直接执行对应角色，不强制补跑无关阶段。

## 角色

- 选题编辑：`roles/topic-editor.md`
- 素材研究员：`roles/researcher.md`
- 主笔：`roles/writer.md`
- 同行审校：`roles/reviewer.md`
- 图片编辑：`roles/photo-editor.md`
- 渠道适配：`roles/publisher.md`

`roles/writing-guide.md` 只规定所有文体共享的写作标准。文体差异以本节列出的 profile 为准。

## 资产结构

```text
TOPIC_DIR/
├── topic.md
├── research.md
├── shared/
└── longform/
    ├── topic-card.md
    ├── draft.md
    ├── review.md
    ├── final.md
    ├── blog/
    └── wechat/
```

跨形态研究留在主题根目录。只属于长文的图片和渠道版本放进 `longform/`。

## 门禁

`longform/review.md` 中的 🔴 必须修改项全部处理后，才能进入渠道适配。创建平台草稿或公开发布仍需符合根目录 `AGENTS.md` 的外部副作用规则。

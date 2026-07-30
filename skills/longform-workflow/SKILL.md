---
name: longform-workflow
description: 长文内容创作流水线。用于博客文章、微信公众号文章、小红书长文、深度稿件、文章研究、起草和审校；不用于图片轮播、单图配短文或视频制作。自动检测长文阶段并执行对应角色。
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

从 `TOPIC_DIR` 向上定位内容资产仓库根目录 `CONTENT_ROOT`。开始选题表达、写作、渠道适配或制作封面前，必须读取 `CONTENT_ROOT/brand/BRAND.md`，用其中的定位、栏目、语气和事实边界约束成稿。

只使用 `BRAND.md` 明确列出的正式资产，不自动搜索或读取 `CONTENT_ROOT/research/`。命名讨论、Logo 探索和封面实验只有被人工确认并写入正式品牌入口后才生效。

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

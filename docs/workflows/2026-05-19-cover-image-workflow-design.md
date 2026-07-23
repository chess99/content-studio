# 封面图工作流重设计

> 历史设计文档：路径保留当时的 `blog/drafts` 约定。当前执行规范以
> `skills/content-workflow/` 为准。

**日期**：2026-05-19  
**状态**：待实现  

## 背景与问题

当前封面图生成由 `wx-publisher` 的 `wxp gen-cover` 命令处理：它从文章内容自动推导 prompt，然后生成图片。这导致职责错位——封面图的创意方向（logo 选取、风格、命令词）本质上是编辑决策，不应由发布工具自动化。

实际操作（2026-05-19）已验证：编辑主导 prompt 的封面图质量明显优于自动推导版本。

## 目标

- 封面图创作归编辑部，prompt 由编辑主导起草
- pixforge 作为纯粹的生图执行工具
- publisher 职责收窄为纯发布，不再涉及生成逻辑
- cover.jpg 作为持久内容资产提交到 git

## 工作区结构变更

```
drafts/YYYYMMDD-<slug>/
├── topic-card.md
├── research.md
├── draft.md
├── review.md
├── final.md
├── cover-candidates/    # pixforge 生成的候选图（临时，选完可删）
│   ├── cover-1.png
│   ├── cover-2.png
│   ├── cover-3.png
│   └── cover-4.png
└── cover.jpg            # 选定并裁剪到 900×383 的终稿封面（提交 git）
```

`source/images/<slug>/` 不变（文章内嵌图片，不带日期前缀）。

## 阶段检测更新（SKILL.md）

在原有阶段表中新增两行，插入 `final.md` 之后：

| 已有文件 | 当前阶段 | 下一步角色 |
|---------|---------|-----------|
| `final.md`（计划发公众号，无 cover.jpg） | 终稿完成 | 图片编辑（封面图） |
| `cover.jpg` | 封面完成 | 渠道适配 |

不发公众号的文章跳过封面图步骤，直接进渠道适配。

## 图片编辑 SOP 扩展

在现有 `photo-editor.md` 中新增"封面图"段落，与"文章插图"并列。

### 触发条件

- 原：草稿目录有原始图片素材时
- 新增：`final.md` 存在且文章计划发公众号时

### 封面图流程

**第一步：理解文章，起草 prompt**

读 `final.md`，提取：
- 文章主角工具/产品（如 Codex CLI、Claude Code）
- 官方品牌色（OpenAI：黑白；Anthropic Claude：橙白）
- 3-6 个最能代表文章内容的核心命令词

按以下模板起草 prompt（方向二风格）：

```
Official <品牌> logo (<颜色描述>) centered on a dark charcoal background,
below it a minimal terminal prompt showing '> <工具名>',
surrounded by floating command snippets in small monospace font
(<命令词1>, <命令词2>, <命令词3>, ...),
clean flat design, dark theme, <品牌色> and white accent colors,
16:9 aspect ratio, professional developer tool aesthetic, no people.
```

**关键原则**：prompt 由编辑主导，不自动推导。

**第二步：生成 4 张候选图**

```bash
# 候选阶段用 low quality（约 15s/张），快速筛选
for i in 1 2 3 4; do
  pixforge -p "<prompt>" \
    -o ~/code2/blog/drafts/YYYYMMDD-<slug>/cover-candidates/cover-$i.png \
    -W 1792 -H 1024 --quality low --no-open -q
done
```

选定候选后，用 `--quality high` 重新生成一张终稿（约 3 分钟，画质更好）：

```bash
pixforge -p "<prompt>" \
  -o ~/code2/blog/drafts/YYYYMMDD-<slug>/cover-candidates/cover-final.png \
  -W 1792 -H 1024 --quality high --no-open -q
```

需要 pixforge 已配置 OpenAI profile（`pixforge setup`）。

**STOP — 人工判断**：在 Finder 查看 cover-candidates/，选定一张，告知编号。

**第三步：裁剪到公众号标准尺寸**

```bash
# 缩放到宽 900（高约 507）
sips --resampleWidth 900 \
  cover-candidates/cover-<N>.png \
  --out cover.jpg

# 居中裁剪到 900×383
sips --cropToHeightWidth 383 900 cover.jpg
```

**第四步：存档**

`cover.jpg` 留在 `drafts/YYYYMMDD-<slug>/cover.jpg`，随文章一起提交 git。  
`cover-candidates/` 可以删除，也可以保留备查。

## publisher SOP 简化

### 公众号发布（改动后）

```bash
# 前置检查
[ ! -f ~/code2/blog/drafts/YYYYMMDD-<slug>/cover.jpg ] && \
  echo "❌ 缺少 cover.jpg，请先完成图片编辑（封面图）步骤" >&2 && exit 1

# 发布
wxp publish \
  --file ~/code2/blog/drafts/YYYYMMDD-<slug>/final.md \
  --cover ~/code2/blog/drafts/YYYYMMDD-<slug>/cover.jpg \
  --theme tech \
  --title "<标题>"
```

`wxp gen-cover` 不再被调用（命令保留在 wx-publisher 中，但编辑部流程不使用）。

## 工具依赖

| 工具 | 用途 | 安装 |
|------|------|------|
| pixforge | 生图执行 | `brew install GitAashishG/tap/pixforge` |
| sips | 裁剪/缩放 | macOS 内置 |
| wxp | 公众号发布 | 已有 `~/code2/wx-publisher` |

pixforge 初次使用需配置 OpenAI profile：

```bash
pixforge setup
# 选 openai，输入 OPENAI_API_KEY 环境变量名
```

## 需要修改的文件

1. `.claude/skills/blog-workflow/SKILL.md` — 阶段检测表新增封面图阶段
2. `.claude/skills/blog-workflow/roles/photo-editor.md` — 新增封面图流程
3. `.claude/skills/blog-workflow/roles/publisher.md` — 简化公众号步骤

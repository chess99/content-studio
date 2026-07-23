# Cover Image Workflow 实现计划

> 历史实施记录：路径和 skill 名称保留当时状态。当前执行规范以
> `skills/content-workflow/` 为准。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将封面图创作从 wx-publisher 解耦，归入 blog-workflow 编辑部，用 pixforge 替代 wxp gen-cover。

**Architecture:** 修改 3 个 SOP Markdown 文件。SKILL.md 新增封面图阶段到检测表；photo-editor.md 新增封面图流程段落；publisher.md 去掉 gen-cover 调用，改为前置检查 cover.jpg。无新文件，无代码变更。

**Tech Stack:** Markdown 文件编辑；pixforge（brew install）；sips（macOS 内置）

---

### Task 1：更新 SKILL.md — 阶段检测与工作区结构

**Files:**
- Modify: `.claude/skills/blog-workflow/SKILL.md`

- [ ] **Step 1：更新图片编辑触发条件说明（第 14 行）**

第 11 行的流程总览不变。只修改第 14 行的说明，从：

```
*图片编辑可选，有图片素材时介入。
```

改为：

```
*图片编辑可选，有图片素材时 **或** 文章计划发公众号时介入。
```

- [ ] **Step 2：更新阶段检测表，拆分 final.md 行，新增封面图阶段**

将原来的：

```markdown
| `final.md` | 终稿完成 | 渠道适配 |
```

改为：

```markdown
| `final.md`（计划发公众号，无 cover.jpg） | 终稿完成 | 图片编辑（封面图） |
| `final.md` + `cover.jpg` | 封面完成 | 渠道适配 |
| `final.md`（不发公众号） | 终稿完成 | 渠道适配 |
```

- [ ] **Step 3：更新工作区结构图，新增 cover-candidates/ 和 cover.jpg**

将工作区结构从：

```
drafts/YYYYMMDD-<slug>/     # 日期取创建当天，如 20260519-codex-cheatsheet
├── topic-card.md            # 选题卡
├── research.md              # 素材清单
├── draft.md                 # 初稿
├── review.md                # 审校意见
└── final.md                 # 终稿
```

改为：

```
drafts/YYYYMMDD-<slug>/
├── topic-card.md            # 选题卡
├── research.md              # 素材清单
├── draft.md                 # 初稿
├── review.md                # 审校意见
├── final.md                 # 终稿
├── cover-candidates/        # pixforge 候选图（临时，选完可删）
│   ├── cover-1.png
│   ├── cover-2.png
│   ├── cover-3.png
│   └── cover-4.png
└── cover.jpg                # 终稿封面，900×383，提交 git
```

- [ ] **Step 4：验证**

```bash
grep -n "cover\|图片编辑\|final.md" \
  ~/code2/blog/.claude/skills/blog-workflow/SKILL.md
```

预期输出包含：`cover.jpg`、`cover-candidates`、`计划发公众号` 这几个关键词。

- [ ] **Step 5：提交**

```bash
git add .claude/skills/blog-workflow/SKILL.md
git commit -m "feat(blog-workflow): add cover image stage to skill detection"
```

---

### Task 2：扩展 photo-editor.md — 新增封面图流程

**Files:**
- Modify: `.claude/skills/blog-workflow/roles/photo-editor.md`

- [ ] **Step 1：在文件末尾追加封面图段落**

在 `photo-editor.md` 末尾追加以下完整段落（不修改现有内容）：

````markdown

---

## 封面图（公众号）

以下流程仅在文章计划发公众号时执行。

### 输入

`drafts/YYYYMMDD-<slug>/final.md`

### 第一步：读文章，起草 prompt

读 `final.md`，提取：
- 主角工具/产品名（如 Codex CLI、Claude Code）
- 官方品牌色（OpenAI：黑白；Anthropic Claude：橙白）
- 3-6 个最能代表文章内容的核心命令词

按以下模板起草 prompt：

```
Official <品牌> logo (<颜色描述，如 "black circle with white swoosh">) centered on a dark charcoal background,
below it a minimal terminal prompt showing '> <工具名>',
surrounded by floating command snippets in small monospace font
(<命令词1>, <命令词2>, <命令词3>, ...),
clean flat design, dark theme, <品牌色> and white accent colors,
16:9 aspect ratio, professional developer tool aesthetic, no people.
```

**关键原则**：prompt 由编辑主导起草，不自动从文章推导。

### 第二步：生成 4 张候选图

确认 pixforge 已配置 OpenAI profile（首次使用运行 `pixforge setup`）。

```bash
SLUG="YYYYMMDD-article-slug"
PROMPT="<第一步起草的 prompt>"

mkdir -p ~/code2/blog/drafts/$SLUG/cover-candidates

for i in 1 2 3 4; do
  pixforge -p "$PROMPT" \
    -o ~/code2/blog/drafts/$SLUG/cover-candidates/cover-$i.png \
    -W 1792 -H 1024 --quality low --no-open -q
done
```

`--quality low` 约 15 秒/张，适合候选筛选。

**STOP — 人工判断**：在 Finder 查看 `cover-candidates/`，选定一张，告知编号 N。

### 第三步：生成高质量终稿

```bash
pixforge -p "$PROMPT" \
  -o ~/code2/blog/drafts/$SLUG/cover-candidates/cover-final.png \
  -W 1792 -H 1024 --quality high --no-open -q
```

约 3 分钟，画质更好。

### 第四步：裁剪到 900×383（公众号标准）

```bash
# 缩放到宽 900（高约 507）
sips --resampleWidth 900 \
  ~/code2/blog/drafts/$SLUG/cover-candidates/cover-final.png \
  --out ~/code2/blog/drafts/$SLUG/cover.jpg

# 居中裁剪到 900×383
sips --cropToHeightWidth 383 900 \
  ~/code2/blog/drafts/$SLUG/cover.jpg
```

### 第五步：验证并存档

```bash
sips -g pixelWidth -g pixelHeight \
  ~/code2/blog/drafts/$SLUG/cover.jpg
# 预期：pixelWidth: 900 / pixelHeight: 383
```

`cover.jpg` 与 `final.md` 一起提交 git，`cover-candidates/` 可删除。
````

- [ ] **Step 2：验证追加正确**

```bash
grep -n "封面图\|pixforge\|cover.jpg\|STOP" \
  ~/code2/blog/.claude/skills/blog-workflow/roles/photo-editor.md
```

预期输出：包含 `pixforge`、`cover.jpg`、`STOP — 人工判断` 等关键词，且原有内容（`tesseract`、`OCR`）未被删除。

- [ ] **Step 3：提交**

```bash
git add .claude/skills/blog-workflow/roles/photo-editor.md
git commit -m "feat(blog-workflow): add cover image workflow to photo-editor SOP"
```

---

### Task 3：简化 publisher.md — 去掉 gen-cover，前置 cover.jpg 检查

**Files:**
- Modify: `.claude/skills/blog-workflow/roles/publisher.md`

- [ ] **Step 1：替换公众号段落**

将 `publisher.md` 中的整个"### 公众号"段落：

````markdown
### 公众号

```bash
# 步骤 1：AI 生成候选封面图，写入文件夹，立即退出
wxp gen-cover \
  --file ~/code2/blog/drafts/<slug>/final.md \
  --output-dir ~/code2/blog/drafts/<slug>/covers/ \
  || { echo "封面图生成失败，发布终止" >&2; exit 1; }
# stdout JSON: { candidates: [...路径列表], prompt, output_dir }
# 人工在 Finder 查看 drafts/<slug>/covers/，挑选一张，记下路径
```

**STOP — 人工判断**：查看生成的候选图，选定一张，把路径告诉 Agent 继续。

```bash
# 步骤 2：发布（无交互，--cover 传入选定路径）
wxp publish \
  --file ~/code2/blog/drafts/<slug>/final.md \
  --theme tech \
  --title "<标题>" \
  --cover ~/code2/blog/drafts/<slug>/covers/<选定文件名>
```
````

替换为：

````markdown
### 公众号

封面图须由图片编辑（封面图流程）提前生成，存为 `drafts/YYYYMMDD-<slug>/cover.jpg`。

```bash
# 前置检查：cover.jpg 必须存在
[ ! -f ~/code2/blog/drafts/<slug>/cover.jpg ] && \
  echo "❌ 缺少 cover.jpg，请先完成图片编辑（封面图）步骤" >&2 && exit 1

# 发布
wxp publish \
  --file ~/code2/blog/drafts/<slug>/final.md \
  --cover ~/code2/blog/drafts/<slug>/cover.jpg \
  --theme tech \
  --title "<标题>"
```
````

- [ ] **Step 2：验证替换正确**

```bash
grep -n "gen-cover\|cover.jpg\|STOP\|前置检查" \
  ~/code2/blog/.claude/skills/blog-workflow/roles/publisher.md
```

预期：`gen-cover` 不再出现；`cover.jpg`、`前置检查` 出现；原有的 `STOP — 人工判断` 行消失。

- [ ] **Step 3：提交**

```bash
git add .claude/skills/blog-workflow/roles/publisher.md
git commit -m "feat(blog-workflow): simplify publisher SOP, remove gen-cover dependency"
```

---

### Task 4：配置 pixforge OpenAI profile（首次使用）

**Files:** 无（写入 `~/.config/pixforge/config.toml`）

- [ ] **Step 1：确认 pixforge 已安装**

```bash
pixforge --version
# 预期：pixforge 0.3.1
```

- [ ] **Step 2：确认 OPENAI_API_KEY 已配置**

```bash
echo $OPENAI_API_KEY | head -c 10
# 预期：sk-proj- 或 sk- 开头
```

如未设置，从 wx-publisher 配置里获取：

```bash
cat ~/.config/wx-publisher/config.json | grep -i api_key
```

- [ ] **Step 3：初始化 pixforge config**

```bash
pixforge init
# 生成 ~/.config/pixforge/config.toml 模板
```

编辑 `~/.config/pixforge/config.toml`，确认包含以下内容（api_key_env 存变量名，不存明文）：

```toml
default_profile = "openai"

[profiles.openai]
provider = "openai"
model = "gpt-image-1"
api_key_env = "OPENAI_API_KEY"
```

- [ ] **Step 4：验证连通性**

```bash
pixforge -p "a minimal test image, solid dark background" \
  -W 256 -H 256 --quality low --no-open -q
# 预期：输出一个 .png 文件路径，文件存在
```

- [ ] **Step 5：无需提交**（配置在 home 目录，不入仓库）

---

## 完成后验证

所有 task 完成后，走一遍最小验证路径：

```bash
# 1. 确认 SKILL.md 阶段表包含封面图行
grep "cover.jpg\|封面" \
  .claude/skills/blog-workflow/SKILL.md

# 2. 确认 photo-editor.md 包含封面图流程
grep "pixforge\|封面图" \
  .claude/skills/blog-workflow/roles/photo-editor.md

# 3. 确认 publisher.md 不再调用 gen-cover
grep "gen-cover" \
  .claude/skills/blog-workflow/roles/publisher.md
# 预期：无输出
```

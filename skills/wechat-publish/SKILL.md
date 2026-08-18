---
name: wechat-publish
description: 微信公众号排版、预览与草稿创建工具入口。用于把已完成的 Markdown 长文转换为微信兼容 HTML、预览主题、创建公众号文章草稿，或把一组图片创建为公众号贴图草稿；不负责选题、写作、图片创作或公开发布。
---

# 微信发布

使用 `apps/wx-publisher/`。先读取该目录的 `AGENTS.md`，再根据任务选择文章或贴图路径。

## 安全边界

- `convert`、`preview`、`themes` 和 `capabilities` 是本地操作，可以直接执行。
- `publish` 和 `publish-newspic` 只创建微信公众号草稿，但仍属于外部写操作；仅在用户明确要求创建草稿时执行。
- 工具不支持公开发布。不要把“草稿创建成功”记录成“已发布”。
- 不读取或输出 AppSecret、`.wxp.json` 和 token 缓存内容。

## 调用方式

开发态从 monorepo 根目录调用：

```powershell
npm --prefix apps/wx-publisher run dev -- capabilities
npm --prefix apps/wx-publisher run dev -- config get
```

### 长文预览

```powershell
npm --prefix apps/wx-publisher run dev -- preview `
  --file "<TOPIC_DIR>/longform/wechat/article.md"
```

### 创建文章草稿

先完成预览和封面检查，再执行：

```powershell
npm --prefix apps/wx-publisher run dev -- publish `
  --file "<TOPIC_DIR>/longform/wechat/article.md" `
  --cover "<TOPIC_DIR>/longform/wechat/cover.jpg" `
  --theme default `
  --title "<标题>" `
  --digest "<120字以内摘要>"
```

### 话题卡片

公众号渠道稿可以在目标位置单独写一行 `#话题名`，例如：

```markdown
开场已经交代清楚文章问题。

#AI创业

下面进入与该话题直接相关的正文。
```

`wxp convert`、`publish` 和 Studio 会识别这类行，并在结果中返回话题列表与人工转换提醒。公开草稿 API 不能替代后台完成话题搜索和内部绑定，因此工具只保留标记并提醒人工转换，不伪造卡片外观或链接。

创建草稿后必须：

1. 在公众号后台逐个点击独立的 `#话题名`。
2. 选择“设置为话题卡片”，核对真实话题及其浏览量、内容量。
3. 发布前确认所有标记都已转换或删除。

执行草稿写操作前，除标题、正文、封面和图片外，还要向用户展示检测到的话题名、所在行或章节，以及它们需要后台转换。

### 创建贴图草稿

每张图片重复传入一次 `--image`：

```powershell
npm --prefix apps/wx-publisher run dev -- publish-newspic `
  --title "<20字以内标题>" `
  --content "<描述>" `
  --image "<TOPIC_DIR>/image-post/images/01.png" `
  --image "<TOPIC_DIR>/image-post/images/02.png"
```

执行外部写操作前，向用户展示标题、正文或描述、封面、图片数量和顺序；有话题标记时同时展示话题与位置。草稿结果写入本地忽略的 `publish-status.md`，并记录仍待后台转换的话题。公开发布后才更新 `topic.md` 的发布记录。

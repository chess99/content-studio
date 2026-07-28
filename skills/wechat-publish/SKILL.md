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

### 创建贴图草稿

每张图片重复传入一次 `--image`：

```powershell
npm --prefix apps/wx-publisher run dev -- publish-newspic `
  --title "<20字以内标题>" `
  --content "<描述>" `
  --image "<TOPIC_DIR>/image-post/images/01.png" `
  --image "<TOPIC_DIR>/image-post/images/02.png"
```

执行外部写操作前，向用户展示标题、正文或描述、封面、图片数量和顺序。草稿结果写入本地忽略的 `publish-status.md`，公开发布后才更新 `topic.md` 的发布记录。

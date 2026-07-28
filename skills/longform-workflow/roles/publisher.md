# 渠道适配 SOP

## 角色定位

你是渠道适配编辑。拿到审校后的终稿，针对不同渠道的读者和格式要求，生成各渠道版本。

## 输入

`TOPIC_DIR/longform/final.md`（渠道无关的终稿，已处理审校意见）

## 渠道规格

同源多渠道，但每个渠道有独立发布文件。不要直接修改 `final.md` 来迎合某个平台。

### 博客

生成 `TOPIC_DIR/longform/blog/article.md`，需包含：
- 完整 front matter（title/date/tags/categories）
- `<!-- more -->` 控制首页摘要

确认后，再把该文件及所需图片复制到独立博客发布仓库。博客仓库中的文件是发布副本，不作为继续创作的来源。

### 内部知识库

内部知识库发布只保留渠道适配原则，不在仓库中记录具体系统、账号、父级目录、文档链接或发布命令。需要复用这些信息时，从本地配置或 agent memory 读取。

发布前先去掉 front matter 和 `<!-- more -->`，并把站内图片转换为该平台可访问的图片。发布状态、文档链接和图片上传映射只写入本地已忽略的 `TOPIC_DIR/longform/publish-status.md`，不要提交到 git。

### 公众号

封面图由图片编辑提前生成，确认 `TOPIC_DIR/longform/wechat/cover.jpg` 存在后创建草稿。

公众号不支持普通外部超链接。不要为兼容公众号改写渠道无关终稿；在渠道适配阶段单独生成 `TOPIC_DIR/longform/wechat/article.md`：

- 保留正文语义，把 Markdown 链接改成纯文本名称
- 文末增加「参考资料」，列出名称和完整 URL，便于读者复制
- 将站内图片路径改为本地绝对路径，交给 `wxp publish` 上传到微信素材库
- 去掉 front matter 和 `<!-- more -->`
- 准备 120 字以内摘要，通过 `--digest` 写入微信草稿；它会显示在转发卡片等位置，不要留空依赖默认截取正文

```bash
wxp publish \
  --file "<TOPIC_DIR>/longform/wechat/article.md" \
  --cover "<TOPIC_DIR>/longform/wechat/cover.jpg" \
  --theme warm-tech \
  --title "<标题>" \
  --digest "<120字以内摘要>"
```

发布命令详情见本地配置或 agent memory，不写入仓库。

## 质量标准

- 公众号版删改后，核心洞察不能丢失
- 各渠道版本发布后，在 `topic.md` 记录发布日期和公开链接；账号、内部文档链接等敏感信息写入本地已忽略的 `TOPIC_DIR/longform/publish-status.md`

# 同一源稿发布到 Hexo 与公众号

## 内容和视觉契约

正式源稿、图表规格与配图保存在调用方提供的 `TOPIC_DIR/longform/`。本应用只保存通用工具；博客只保存发布副本。延续现有 Hexo + NexT、微信技术简报主题，不引入另一套站点框架或编辑器。

源稿采用普通 Markdown，图片使用相对路径，YAML front matter 包含 `title`、`date`、`permalink`、`canonical_url`。`permalink` 为 `/posts/<slug>/`，`canonical_url` 为博客完整地址。源稿中的 `<!-- more -->` 用于 Hexo 摘要；`<!-- interactive:<id> -->` 是可选的渐进增强位置，必须在相邻正文中保留完整的静态解释。

博客与公众号使用相同的标题层级、精确数字、图片和强调色。图表使用白底、深灰文字与 `#0969da` 蓝色，不铺装饰卡片；微信复用已有 `github-readme` 主题。图中字号按 720 逻辑像素设计，输出宽度 1920 px；正文维持全主题共用的 16 px / 1.82 行高。窄屏表格控制为两到三列，长公式使用可换行的文本表达。

## 生成静态图

```sh
npm run build
node dist/cli/index.js figures --file "$TOPIC_DIR/longform/figures.json" --output "$TOPIC_DIR/longform/images"
```

`figures.json` 示例：

```json
{
  "figures": [
    {"id":"source-mix","kind":"bars","title":"示范信源构成","note":"配置快照，非线上统计","rows":[{"label":"机构","value":10},{"label":"媒体","value":5}]},
    {"id":"heat","kind":"decay","title":"参与方贡献衰减","note":"无新信号的理论值","halfLife":24,"window":48},
    {"id":"pipeline","kind":"flow","title":"内容处理流程","note":"按箭头读取","rows":[{"label":"采集","detail":"读取来源并判重"},{"label":"分析","detail":"评分与结构化"}]}
  ]
}
```

支持 `bars`、`decay`、`flow` 三种必要图形，分别生成 SVG 源和 PNG。`decay` 表示指数衰减叠加有限窗口，到达窗口即移除；它不是任意连续时间序列绘图器。SVG 留在内容资产库供编辑，公众号稿只引用 PNG。中文字体取决于运行环境；发布前检查生成图上的中文字形。

## 本地准备，不创建平台草稿

```sh
node dist/cli/index.js prepare \
  --file "$TOPIC_DIR/longform/article.md" \
  --output "$TOPIC_DIR/longform/wechat" \
  --blog-root /path/to/blog
```

输出包括：

- Hexo 发布副本：`source/_posts/YYYY/MM/YYYYMMDD-<slug>.md` 与 `source/images/<slug>/` 下的配图。
- `article.md`：微信静态稿，移除摘要标记、交互占位，保留图片、阈值表、公式、Prompt 和引用说明。
- `article.html`：可上传图片引用与已有内联排版。由发布器上传到微信后再替换为素材地址。
- `preview.html`：图片内嵌的离线手机预览，可以直接打开，无需公网图床或凭证。
- `manifest.json`：源稿与图片的 SHA-256、主题、原文链接和博客文件相对路径，可校验两个渠道是否来自同一版源稿。

本地图片必须在源稿目录内，支持 PNG/JPEG/WebP/GIF；外链需先归档，实际图片格式也会校验。缺图、越界软链接、未降级的 HTML/iframe、Mermaid/math 块和 Hexo 专有标签会使准备失败；代码块中的 HTML 示例仍作为文本保留。内容输入校验通过后才写文件。

相同输入可以重复执行。更新源稿后，工具通过博客副本中附带的内容散列回执（并兼容上次 manifest）确认副本未被独立改写，再同步更新；检测到博客侧独立编辑时停止覆盖，需要先把这次编辑并回源稿。旧散列命名图片不会自动删除，以免破坏其他文章引用；由内容维护者按仓库实际引用清理。

## 公众号能力边界

公众号正文不承载 JS 计算器、iframe、交互 SVG、外部样式或依赖复杂布局的网页。博客交互旁必须有静态阈值表和算例；图表采用上传后的 PNG，公式可用纯文本、代码块或预先渲染的图片。浏览器预览用于检查本地布局，不能等同于通过了微信后台清洗或真机验收。

正文外链会按既有转换策略变为带下划线文字。需要完整源码跳转与计算器时，通过文章的“阅读原文”进入博客。`prepare` 将博客地址写入微信稿的 `canonical_url`；`publish` 会自动读取并传给微信 `content_source_url`，也可用 `--source-url` 覆盖。原文页应先可公开访问，公众号再正式发布。

## 后续草稿步骤

仅在得到创建草稿的明确授权后执行：

```sh
node dist/cli/index.js publish \
  --file "$TOPIC_DIR/longform/wechat/article.md" \
  --theme github-readme \
  --cover /path/to/cover.png
```

需要有效的公众号凭证、接口权限和 IP 白名单；这一步会上传图片和创建草稿，不会公开群发。任一正文图片上传失败即停止创建草稿；此前已成功上传的素材可能留在素材库，工具不会自动删除。显式 `--no-upload-images` 仍交由调用方保证图片地址已可用。

窄屏表格固定布局、单元格断行和长 URL 换行在共享主题样式中实现，适用于转换、准备、预览和草稿创建。预览页不额外用样式掩盖文章本身的溢出问题。

本地 `prepare` 无网络副作用，不能验证公众号账号权限或真实编辑器行为。创建草稿后仍应在公众号后台检查图、表、代码块与“阅读原文”，再人工发布。

# 微信 HTML 踩坑记录

本文档记录 `wx-publisher` 在微信公众号后台编辑器中实际遇到的渲染问题，供开发迭代本工具时参考。**不面向内容写作 AI**，不会被自动载入内容创作流程。

最后更新：2026-08-19。

## 1. `&#x27;` HTML 实体不被解码

**现象**：标题（`<h1>`-`<h6>`）的 `style` 属性在公众号后台被清空（`style=""`），但外层 `<section>` 的样式正常。

**根因**：`rehype-stringify` 在序列化 HTML 属性时，将 `'`（单引号）编码为 `&#x27;`。微信公众号后台的 HTML 解析器**不解码属性值中的 HTML 实体**，导致 `font-family: 'PingFang SC'` 被解析为 `font-family: &#x27;PingFang SC&#x27;`——非法 CSS 值，整条 `style` 属性被丢弃。

**为什么只有标题受影响**：外层 wrapper `<section>` 的样式通过 `escapeAttr()` 手动拼接，不编码 `'`。而 HAST 树中所有元素的样式都经过 `rehype-stringify` 序列化，`'` 被编码为 `&#x27;`。标题是最显眼的受害者，但理论上所有通过 `rehype-stringify` 输出的含 `'` 的样式属性都有风险。

**修复**：在 `rehype-stringify` 输出后，将 `&#x27;` 全局替换回 `'`。

```typescript
// apps/wx-publisher/src/converter/index.ts
const inner = String(result).replace(/&#x27;/g, "'")
```

**防范**：为微信生成 HTML 时，`style` 属性值中不应出现任何 HTML 实体。如果必须使用带引号的字体名，确保最终输出是原始 `'` 而非 `&#x27;` 或 `&apos;`。

## 2. `word-break: break-word` 是已废弃值

**现象**：标题 `style` 被清空。

**根因**：`word-break: break-word` 是 CSS 的已废弃值（标准值为 `normal`、`break-all`、`keep-all`）。微信后台编辑器校验 CSS 合法性，遇到废弃值后拒绝整条 `style`。替代方案：`overflow-wrap: break-word` 或 `word-break: break-all`。

**修复**：从标题样式（h1-h6）和 `preCode` 中移除 `word-break: break-word`，保留已有的 `overflow-wrap: anywhere` 或 `white-space: pre-wrap`。

## 3. 非标准 `font-weight` 值

**现象**：标题样式异常。

**根因**：CSS 标准 `font-weight` 值为 100-900 的整百数。`750`、`720`、`650` 等非整百值虽然浏览器可以容错，但微信后台可能将其归一化或拒绝。旧代码使用 `font-weight: bold`（等价于 `700`）或 `font-weight: 600`，在微信中正常工作。

**修复**：统一使用标准整百值：`750` → `700`、`720` → `700`、`650` → `600`。

## 4. 列表渲染：ProseMirror 会重新处理 `<ul>/<ol>/<li>` 标签

**现象**：真实 `<ul>/<ol>/<li>` 标签被微信编辑器重新添加 marker（圆点/数字），导致双重 marker 或空行。

**根因**：微信后台编辑器基于 ProseMirror，其 schema 对 `<ul>`/`<ol>`/`<li>` 有内建处理逻辑，会忽略 `list-style` 并自动添加浏览器默认 marker。同时，remark 生成的 HAST 树中 `ul`/`ol` 的 children 包含 `\n` 文本节点，ProseMirror 会将其渲染为空 `<li>`。

**修复（三次迭代）**：

1. **初版**：将 `<ul>/<ol>/<li>` 展平为 `<p>` 标签，手动添加 `• ` 和 `1. ` 前缀。（commit `6bd40e3`）
2. **改进**：保留 `<ul>/<ol>/<li>` 结构，使用 `display:block` + `list-style:none` 消除默认行为，配合手动 bullet 前缀，并过滤 `\n` 文本节点。（commit `7f22739`）
3. **当前方案**：将 `<ul>/<ol>/<li>` 完全转换为 `<section data-wxp-list>` + `<section data-wxp-list-item>` 结构，用 `• ` 文本节点作为前缀。这是最彻底的方案，完全绕过 ProseMirror 的列表处理。

**关键代码位置**：`src/converter/index.ts` 中的 `renderListAsWechatSafeSections()` 函数。

## 5. inline code 样式必须用 raw 节点硬写

**现象**：`<code>` 标签的 inline style 被 ProseMirror 剥离，代码样式丢失。

**根因**：ProseMirror 的 schema 对 `<code>` 元素有特殊处理，通过 HAST 节点的 `properties.style` 设置的样式会被剥离。其他元素（如 `<strong>`、`<span>`）无此问题。

**修复**：将 `<code>` 节点转为 raw 节点，直接输出完整 HTML 字符串：

```typescript
node.type = "raw"
node.value = `<code class="inline-code" style="${styles.code}">${escaped}</code>`
```

同时添加 `class="inline-code"` 作为额外信号，帮助 ProseMirror 识别并保留样式。

**关键代码位置**：`src/converter/index.ts` 中 `case "code"` 分支。

## 6. 代码块需要 class + style 双写

**现象**：`<pre><code>` 的语法高亮颜色被 ProseMirror 剥离，文字内容丢失。

**根因**：只有 `style` 的 `<span>` 会被 ProseMirror 剥离文字内容。ProseMirror 需要识别 `class`（如 `hljs-keyword`）才会保留内容。

**修复**：使用 doocs/md 兼容结构：
- `<pre>` 添加 `class="hljs code__pre"` + inline style
- `<code>` 添加 `class="language-xxx"` + inline style
- 语法高亮的 `<span>` 保留 hljs 的 class（`hljs-keyword` 等）并同时加上 inline style

**额外注意**：代码块中的空格不应转为 `&nbsp;`（ProseMirror 能正确处理普通空格），只转文本节点（标签外）的空格。先转 tab 为 4 空格，再在标签外替换空格为 `&nbsp;`。

**关键代码位置**：`src/converter/index.ts` 中 `formatCodeForWechat()` 和 `convertHljsClassesToInlineStyles()`。

## 7. `<p>` 标签必须转为 `<section>` 以避开微信二次处理

**现象**：微信编辑器对 `<p>` 标签添加自己的段间距和样式，覆盖 inline style。

**根因**：微信 ProseMirror 编辑器对 `<p>` 有内建样式和行为，会重新处理 `<p>` 的 margin 和 line-height。曾尝试保留 `<p>` 标签（commit `a044ec6`），但后续发现微信仍会篡改，最终恢复为 section 方案。

**修复**：将 `<p>` 转为 `<section data-wxp-paragraph="true">` 并附加 inline style。这完全绕过 ProseMirror 的段落处理逻辑。

**注意**：`<blockquote>` 内的 `<p>` 同理，使用 `styles.blockquoteP` 样式。

**关键代码位置**：`src/converter/index.ts` 中 `case "p"` 分支。

## 8. 微信内容区有自己的水平内边距

**现象**：wrapper 设置 `padding:0 16px` 后，内容在微信后台显示时左右边距过宽。

**根因**：微信公众号内容区自身有 `padding`（约 8-16px），如果 wrapper 再加 `padding`，会叠加导致内容过窄。最大内容宽度 677px 已是微信内容区的硬限制。

**修复**：wrapper 使用 `padding:0`，让微信自己的边距生效。

**关键代码位置**：`src/converter/themes.ts` 中 `createStyles()` 的 `wrapper` 样式。commit `a81b36a`。

## 9. Windows 预览调用方式

**现象**：Windows 上 `start` 命令无法可靠打开浏览器预览 HTML 文件。

**根因**：`start` 命令在 Windows 上对含空格的路径支持不稳定，且 Node.js 的 `spawn` 调用 `start` 需要特殊的 `shell: true` 配置。

**修复**：使用 `rundll32.exe url.dll,FileProtocolHandler <path>` 替代 `start`。这是 Windows 上打开文件的标准 API，支持空格路径，不需要 shell。

**关键代码位置**：`src/cli/open-in-default-app.ts`。commit `f4cc413`。

## 检查清单

修改主题或样式生成逻辑后，验证以下项目：

- [ ] 最终 HTML 中不包含 `&#x27;`（在 `style` 属性值中）
- [ ] 所有 `font-weight` 为标准整百值（100, 200, …, 900）或关键字（`normal`, `bold`）
- [ ] 不使用 `word-break: break-word`（用 `overflow-wrap: break-word` 或 `word-break: break-all` 替代）
- [ ] 不使用真实 `<ul>/<ol>/<li>` 标签—已转为 `<section data-wxp-list>`
- [ ] 不使用真实 `<p>` 标签—已转为 `<section data-wxp-paragraph="true">`
- [ ] `<code>` 使用 raw 节点输出，不是通过 `applyStyle`
- [ ] 代码块 `<pre>` 有 `class="hljs code__pre"`，`<code>` 有 `class="language-xxx"`
- [ ] 在公众号后台草稿中检查标题、列表、代码块样式是否正常渲染
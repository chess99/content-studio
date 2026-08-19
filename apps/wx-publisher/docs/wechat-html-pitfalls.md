# 微信 HTML 踩坑记录

本文档记录 `wx-publisher` 在微信公众号后台编辑器中实际遇到的渲染问题，供开发迭代本工具时参考。**不面向内容写作 AI**，不会被自动载入内容创作流程。

最后更新：2026-08-19。

## 1. `&#x27;` HTML 实体不被解码

**现象**：标题（`<h1>`-`<h6>`）的 `style` 属性在公众号后台被清空（`style=""`），但外层 `<section>` 的样式正常。

**根因**：`rehype-stringify` 在序列化 HTML 属性时，将 `'`（单引号）编码为 `&#x27;`。微信公众号后台的 HTML 解析器**不解码属性值中的 HTML 实体**，导致 `font-family: 'PingFang SC'` 被解析为 `font-family: &#x27;PingFang SC&#x27;`——非法 CSS 值，整条 `style` 属性被丢弃。

**为什么只有标题受影响**：外层 wrapper `<section>` 的样式通过 `escapeAttr()` 手动拼接，不编码 `'`。而 HAST 树中所有元素（包括标题）的样式都经过 `rehype-stringify` 序列化，`'` 被编码为 `&#x27;`。标题是最显眼的受害者，但理论上所有通过 `rehype-stringify` 输出的含 `'` 的样式属性都有风险。

**修复**：在 `rehype-stringify` 输出后，将 `&#x27;` 全局替换回 `'`。

```typescript
// apps/wx-publisher/src/converter/index.ts
const inner = String(result).replace(/&#x27;/g, "'")
```

**防范**：为微信生成 HTML 时，`style` 属性值中不应出现任何 HTML 实体。如果必须使用带引号的字体名，确保最终输出是原始 `'` 而非 `&#x27;` 或 `&apos;`。

## 2. `word-break: break-word` 是已废弃值

**现象**：同上，标题 `style` 被清空。

**根因**：`word-break: break-word` 是 CSS 的已废弃值（标准值为 `normal`、`break-all`、`keep-all`）。微信后台编辑器可能校验 CSS 合法性，遇到废弃值后拒绝整条 `style`。替代方案：`overflow-wrap: break-word` 或 `word-break: break-all`。

**修复**：从标题样式（h1-h6）和 `preCode` 中移除 `word-break: break-word`，保留已有的 `overflow-wrap: anywhere` 或 `white-space: pre-wrap`。

## 3. 非标准 `font-weight` 值

**现象**：可能与上述问题叠加，导致标题样式异常。

**根因**：CSS 标准 `font-weight` 值为 100-900 的整百数。`750`、`720`、`650` 等非整百值虽然浏览器可以容错，但微信后台可能将其归一化或拒绝。旧代码使用 `font-weight: bold`（等价于 `700`）或 `font-weight: 600`，在微信中正常工作。

**修复**：统一使用标准整百值：
- `750` → `700`
- `720` → `700`
- `650` → `600`

## 检查清单

修改主题或样式生成逻辑后，验证以下项目：

- [ ] 最终 HTML 中不包含 `&#x27;`（在 `style` 属性值中）
- [ ] 所有 `font-weight` 为标准整百值（100, 200, …, 900）或关键字（`normal`, `bold`）
- [ ] 不使用 `word-break: break-word`（用 `overflow-wrap: break-word` 或 `word-break: break-all` 替代）
- [ ] 在公众号后台草稿中检查标题样式是否正常渲染
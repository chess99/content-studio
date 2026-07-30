# 主题与配色参考

本文档说明 `wxp themes` 暴露的产品主题目录。运行时实现位于 `src/converter/themes.ts`，`docs/theme-palette-reference.json` 是供脚本和 AI 调用方读取的完整机器参考。

## 产品原则

- `default` 是纯白背景、中性黑灰配色的基础主题，不承载特定情绪。
- 暖色、纸张色、品牌色和高视觉装饰都必须由用户主动选择。
- 普通正文保持统一阅读基线；主题主要改变标题、强调、代码、引用、表格和高级模块。
- Studio 先展示少量推荐主题，再用“版式 × 颜色”组合生成系列主题，不平铺整个目录。
- 主题目录服务产品选型，不受外部项目的主题数量或命名约束。

最后更新：2026-07-30。

## 使用方式

- CLI 和 API 使用主题 ID，例如 `--theme default`、`--theme github-readme`。
- `wxp themes` 返回中文展示名、系列、适用场景、密度、对比度和强调色。
- 需要完整调色板时读取 `docs/theme-palette-reference.json`。
- 修改目录时同步更新运行时代码、JSON 参考、本文档和主题测试。

## 推荐主题

| ID | 展示名 | 适用场景 | 视觉方向 |
| --- | --- | --- | --- |
| `default` | 基础白 | 通用知识、运营和长文 | 中性、干净、白底 |
| `wechat-native` | 微信公众号原生 | 稳妥的公众号内容 | 熟悉、保守 |
| `github-readme` | GitHub | 技术教程和开发文档 | 结构化、技术感 |
| `nyt-classic` | NYT | 报告、评论和严肃长文 | 报刊、编辑感 |
| `ink-minimal` | 水墨 | 文字密集的知识和专题内容 | 黑白、克制 |
| `bold-red` | 醒目 · 中国红 | 活动、专题和转化内容 | 强调、传播 |

## 版式矩阵

组合主题由四种版式和八种强调色组成。

| 版式 | ID 前缀 | 说明 |
| --- | --- | --- |
| 简约 | `minimal-*` | 最低干扰，内容优先 |
| 聚焦 | `focus-*` | 居中强调，节奏清楚 |
| 编辑 | `elegant-*` | 层次丰富，适合品牌长文 |
| 醒目 | `bold-*` | 强标题，适合活动与转化 |

可用颜色：`gold`、`green`、`blue`、`orange`、`red`、`navy`、`gray`、`sky`。

## 其他风格预设

- 产品与现代内容：`bytedance`、`apple`、`sports`、`cyber`
- 经典与媒体：`sspai-red`、`mint-fresh`、`sunset-amber`
- 特色风格：`warm-editorial`、`chinese`、`lavender-dream`、`coffee-house`、`bauhaus-primary`

其中 `warm-editorial` 保存原来的暖色编辑方向，但不再作为默认主题。

## 阅读基线

- 正文：`16px`、`line-height:1.82`、段后 `16px`
- 列表：与正文同字号、同行高
- 字体：系统字体优先
- 中文正文默认不增加字间距
- 默认画布：`#ffffff`

## 维护检查

- 所有主题 ID 必须唯一，并与 `src/converter/themes.ts` 顺序一致。
- 组合主题必须保持四种版式 × 八种颜色完整。
- JSON 中的颜色统一使用六位十六进制。
- 默认主题不得引入有色画布、实色标题底或只针对 `default` 的私有样式分支。

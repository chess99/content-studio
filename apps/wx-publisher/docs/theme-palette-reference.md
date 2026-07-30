# 主题系统参考

`wx-publisher` 的主题系统分成两个层级：少量完整预设用于快速选择，版式与调色板用于按需自定义。组合不会被包装成几十个需要记忆的“主题”。机器可读目录见 [`theme-palette-reference.json`](./theme-palette-reference.json)。

最后更新：2026-07-30。

## 产品原则

- 默认主题是纯白画布、中性黑灰、无装饰底色。
- 完整预设必须有清楚且独特的使用理由，不能只是颜色排列组合。
- 自定义只暴露两个高价值决策：信息结构选“版式”，视觉语气选“调色板”。
- 正文统一使用 `16px`、`line-height: 1.82`、段后 `16px` 的阅读基线；主题重点影响标题、强调、引用、代码、表格与高级模块。
- 暖色纸张、品牌色和高对比装饰都必须由用户主动选择。

## 九个完整预设

| ID | 展示名 | 定位 |
| --- | --- | --- |
| `default` | 基础白 | 最低干扰的通用默认方案 |
| `wechat-native` | 微信原生 | 熟悉稳妥的公众号气质 |
| `github-readme` | GitHub | 技术教程与开发文档 |
| `nyt-classic` | 报刊经典 | 深度报道、评论与长文 |
| `ink-minimal` | 水墨极简 | 文字密集、黑白克制 |
| `warm-editorial` | 暖色编辑 | 叙事、人物与生活方式 |
| `chinese` | 中国风 | 文化、节气与传统题材 |
| `bauhaus-primary` | Bauhaus | 活动、发布与视觉专栏 |
| `cyber` | 赛博朋克 | 视觉科技与实验专题 |

前六个属于核心预设，Studio 直接展示；后三个属于实验风格，默认折叠。

## 自定义主题

四种版式：

| ID | 展示名 | 结构特征 |
| --- | --- | --- |
| `clean` | 清爽 | 无底色标题与细分隔线 |
| `centered` | 居中 | 居中标题与上下分隔线 |
| `editorial` | 刊物 | 左竖线与浅色标题块 |
| `poster` | 海报 | 实色标题块与高对比强调 |

六套调色板：`neutral` 中性黑、`blue` 品牌蓝、`green` 自然绿、`red` 强调红、`warm` 暖橙、`purple` 情绪紫。

## 使用方式

CLI 的完整预设仍使用单一参数；自定义组合使用两个显式参数：

```bash
wxp convert --file article.md --theme github-readme
wxp convert --file article.md --layout editorial --palette blue
```

REST API 与 Studio 使用结构化选择，字符串主题不再接受：

```json
{ "theme": { "preset": "default" } }
```

```json
{ "theme": { "layout": "poster", "palette": "red" } }
```

`wxp themes` 分别返回 `presets`、`layouts`、`palettes` 和各自数量。外部主题 JSON 文件仍作为专家级入口存在，但不属于内置主题目录。

## 维护检查

- 预设、版式和调色板 ID 必须唯一，并与运行时顺序一致。
- 默认主题不得引入有色画布、实色标题底或私有特例。
- JSON 中颜色统一使用六位十六进制。
- 修改主题系统时同步更新运行时、Studio、CLI、REST API、静态画廊、机器参考和测试。

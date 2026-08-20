---
name: "chatgpt-imagegen"
description: "通过普通 ChatGPT 网页 Chat 配额或兼容的 Codex 订阅端点生成并保存图片。用户提到 Chat 模式额度、Web 生图、避免 Work/Codex 额度，或在没有原生生图工具的环境中显式要求 chatgpt-imagegen 时使用。"
---

# ChatGPT 生图

按用户希望使用的额度池选择后端。不得在失败后静默切换后端。

## 后端路由

| 后端 | 额度 | 使用场景 |
| --- | --- | --- |
| `chat-web` | 普通 ChatGPT Web Chat | 用户明确要求使用 Chat 模式额度，且运行环境能控制已登录的 ChatGPT 网页 |
| 原生生图 | Codex 通用额度 | Codex 提供原生生图能力，且用户没有要求 Chat 模式额度 |
| `codex-legacy` | Work/Codex | Claude Code 等没有原生生图能力的环境，或用户明确要求兼容 CLI |
| 官方图片 API | API 独立计费 | 用户提供 `OPENAI_API_KEY`，或需要稳定程序化批量生成、高质量、透明背景 |

用户要求 Chat 模式时，只能使用 `chat-web`。网页不可用、未登录或生成失败时停止并说明原因，不得回退到原生生图、`codex-legacy` 或 API。

## `chat-web` 后端

### 前提

- 使用 Browser 或 Chrome 控制能力操作已登录的 `https://chatgpt.com/`。
- 实际提交提示词会创建 ChatGPT 对话并消耗 Chat 生图额度；仅在用户已经授权生图时提交。
- 不读取浏览器 Cookie、Local Storage、Profile、OAuth token 或内部接口请求。
- 不直接请求 ChatGPT 私有后端，也不导航到带签名的图片资源 URL。

### 工作流

1. 确定提示词、输出尺寸意图、格式和工作区内的目标路径。没有明确目录时使用调用方项目中合理的资源目录。
2. 按浏览器控制 skill 连接浏览器，打开或接管 ChatGPT 首页。
3. 检查 `Select chat surface`：必须看到 `Chat` 已选中。若 `Work` 已选中，切换到 `Chat` 后重新检查；无法确认时停止。
4. 新建普通 Chat 对话。提示词写清主体、构图、风格、约束，并明确“只生成图片”。
5. 如需上传参考图，先读取浏览器控制 skill 的文件上传说明，再通过网页选择器上传用户指定的文件；不要上传其他文件。
6. 提交提示词，等待生成完成。以结果区出现 `Generated image` 图片且生成/停止按钮消失为完成信号；不要用固定长时间盲等。
7. 用当前标签页的 `pageAssets` 能力列出资源，将结果图片元素的 `src` 与资源清单匹配，只打包对应的图片 `assetId`。不要直接抓取资源 URL。
8. 用保存脚本把浏览器导出的文件落到目标路径：

```powershell
python "$CLAUDE_SKILL_DIR/scripts/save-chat-web-image.py" `
  "<pageAssets bundle path>" `
  -o "<workspace output path>" `
  --format auto
```

优先使用运行环境提供的 `$CLAUDE_SKILL_DIR`。如果没有该变量，从 skill 目录定位信息解析本 skill 的绝对路径后再调用脚本，不要依赖脚本已加入 `PATH`。

9. 查看保存后的图片。若明显不符合要求，只做一次有针对性的提示词调整；不得盲目生成变体。
10. 返回最终文件路径、实际提示词和 ChatGPT 对话 URL，并说明使用了普通 Chat 模式。

`save-chat-web-image.py` 会识别没有扩展名的 PNG/JPEG/WebP，按目标扩展名转换格式，并默认拒绝覆盖已有文件。只有用户明确要求覆盖时才传 `--force`。

### 额度验证

用户要求验证额度池时：

1. 生成前记录 Codex/Work Analytics 页面显示的剩余额度和重置时间。
2. 在普通 `Chat` 已选中的页面只生成一张最小测试图。
3. 生成后刷新 Analytics 页面并记录同一指标。
4. 百分比可能取整，因此“数值未变”是支持证据而非单独的绝对证明；同时报告页面模式、对话 URL 和官方文档的额度边界。

验证期间不得调用 `codex-legacy` 或原生生图，否则会污染对比结果。

### 限制

- `chat-web` 是网页工作流，不是稳定的公开 API。网页结构变化时应基于可见 DOM 重新定位，不得猜测私有接口。
- ChatGPT Web 决定实际图片模型、质量和原始尺寸；尺寸提示属于意图，不能承诺像素级输出。
- 不做无人值守批量生成。超过 10 张或持续生成前取得用户明确许可。
- 生成结果通常是 PNG；JPEG/WebP 由保存脚本在本地转换。

## `codex-legacy` 兼容 CLI

此路径会消耗 Work/Codex 额度，不是 Chat 模式。

### 前提

用户需要执行一次：

```bash
npm i -g @openai/codex
codex login
```

脚本只读取 `~/.codex/auth.json` 中 `codex login` 写入的 ChatGPT OAuth token，不使用 `OPENAI_API_KEY`。

### 调用

```bash
python "$CLAUDE_SKILL_DIR/scripts/chatgpt-imagegen.py" "<prompt>" \
  -o "<workspace path>" \
  --size 1024x1024 \
  --format png \
  --quiet
```

可重复传入最多五个 `--ref PATH`。常用尺寸包括 `1024x1024`、`1536x1024`、`1024x1536` 和 `1792x1024`；其他尺寸由后端决定是否接受。

兼容脚本固定请求 `https://chatgpt.com/backend-api/codex/responses`，请求头使用 `originator: codex_cli_rs`，并启用 `image_generation` 工具。因此 `--model` 只改变编排模型，不会改变额度池。

### 常见错误

| 现象 | 处理 |
| --- | --- |
| 找不到 OAuth token | 运行 `codex login`，API key 不能替代 |
| HTTP 400 要求新版 Codex | 运行 `npm i -g @openai/codex@latest` |
| refresh token 失效 | 重新运行 `codex login` |
| HTTP 429 | Work/Codex 被限流；不要循环重试，也不要假装这是 Chat 额度 |
| 流超时 | 最多重试一次并传 `--timeout 300` |
| 没有返回图片 | 明确要求模型调用 `image_generation` 工具后重试一次 |

## 官方图片 API

需要稳定的程序化调用、明确质量、透明背景或大批量生成时，使用官方图片 API 和用户自己的 `OPENAI_API_KEY`。API 独立计费，不使用 Chat 或 Work/Codex 订阅额度。

## 保存规则

- 正式产物保存到调用方工作区，不放入临时目录、用户主目录或本 skill 的示例目录。
- 不覆盖已有文件，除非用户明确要求。
- 完成后返回绝对路径；能查看图片时先做一次视觉检查。

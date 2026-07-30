# 外部服务适配层

当前已实现四个中文 TTS 路径：

- Fish Audio：正式默认路径；逐场景生成，配置来自项目 `config.json`，密钥只从 app 根目录 `.env` 读取。
- Qwen3-TTS 0.6B：离线、零调用费兜底；通过独立 `.venv-qwen` 环境运行。
- Edge Neural TTS：快速工程预览路径，无需账号，需联网；通过项目 `.venv` 隔离安装。
- Windows SAPI：最低依赖的离线预览回退；是否可用取决于本机语音组件。

Fish 和 Qwen 必须先分别运行 `scripts/generate-fish-project.py` 或 `scripts/generate-qwen-project-local.py`，再由 `scripts/prepare-project.mjs` 读取预生成音频。Edge 与 SAPI 可由准备脚本按需生成；SAPI 适配脚本是 `scripts/generate-sapi.ps1`。

任何云端生成都必须在脚本人工确认后执行。Fish 的公开声线 ID 只作为已验证候选，商用前核实授权并优先替换为权属明确的品牌声线。

建议统一返回：音频路径、真实时长、词级时间戳、服务请求 ID、成本信息和可复现参数。密钥从环境变量读取。

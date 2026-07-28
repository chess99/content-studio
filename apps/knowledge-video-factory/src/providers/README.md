# 外部服务适配层

当前已实现两个中文 TTS 路径：

- Edge Neural TTS：默认路径，无需账号，需联网；通过项目 `.venv` 隔离安装。
- Windows SAPI：离线回退路径；是否可用取决于本机语音组件。

配音编排在 `scripts/prepare-project.mjs`，SAPI 适配脚本是 `scripts/generate-sapi.ps1`。

建议统一返回：音频路径、真实时长、词级时间戳、服务请求 ID、成本信息和可复现参数。密钥从环境变量读取。

# 中文知识视频配音方案（2026-07）

## 结论

正式品牌声线不再使用 Edge TTS。Edge 只保留为零成本工程预览。

当前试播片使用 `Qwen3-TTS-12Hz-0.6B-CustomVoice / Dylan`。Dylan 是带北京口音的年轻男声，用户听到京津腔属于音色特征，不是异常。当前项目通过 `voice.playbackRate: 1.08` 加快播放；建议调节区间为 1.04—1.12，超过 1.12 必须重新试听齿音、尾音和数字清晰度。

它是“RTX 4060 Ti 8GB、本地零调用费、已经跑通”条件下的最佳折中，不是所有服务中的绝对最佳。正式主声线仍应由同稿盲听决定。

## Fish Audio 实测（2026-07-27）

- `s2.1-pro-free` 已通过正式 `/v1/tts` 接口验证，可与 `s2.1-pro` 使用同一调用协议。
- 采用公开声线“自然流男”，API 语速 `1.05`；8 个场景全部返回有效 MP3，没有覆盖本地 Qwen 音频。
- 8 段口播合计约 79 秒，加入场景留白后成片为 85.07 秒；同稿 Qwen Dylan 版本为 116.23 秒。
- 技术质检通过：1080×1920、H.264 + AAC、平均音量约 -19 dB、峰值约 -1.5 dB。
- 免费模型适合评估和小规模开发，但没有生产级 TTFA 与 DPA 保证；正式发布前仍需人工试听数字、英文缩写和句尾停顿。

推荐按以下顺序试听：

1. **Fish Audio S2.1 Pro**：商业 API 主选。中文自然度、语气控制和专业词发音控制最符合财经口播；官方提供同品质的 `s2.1-pro-free` 开发模型。
2. **Azure Speech Dragon HD**：企业稳定性备选。它与 Edge 普通 Neural 音色不是同一质量档，Dragon HD 基于大模型理解语义并自动调整情绪和语调。
3. **Qwen3-TTS 0.6B CustomVoice**：本地备选。本机 RTX 4060 Ti 8GB 可尝试运行，后续没有调用费，但首次部署、模型下载和推理速度不如 API 省心。
4. **ElevenLabs Multilingual v2 / v3**：国际化与长音频备选。官方将 Multilingual v2 定位为内容创作、视频旁白和有声书高保真模型，但中文专业词的逐字控制和国内网络体验需要实测。

MiniMax、火山引擎/豆包、CosyVoice、IndexTTS 继续保留为候选，不在没有同稿试听的情况下凭宣传定主声线。

## 对比

| 方案 | 中文自然度预期 | 专业词控制 | 时间戳 | 成本与接入 | 当前用途 |
|---|---|---|---|---|---|
| Fish Audio S2.1 Pro | 高 | 中文 tone3 拼音逐字控制；自然语言语气标签 | 需对齐或使用返回时序能力验证 | 免费开发模型；正式版按 UTF-8 字节计费，无月费门槛 | 主选 |
| Azure Dragon HD | 高 | SSML、词典、语速和风格；中文男女声丰富 | Azure 可输出 viseme/word boundary 事件 | 需要 Azure 账号、资源与区域配置 | 企业备选 |
| Qwen3-TTS 0.6B | 中高，需选声 | 自然语言语气；中文原生；可扩展克隆 | 需 Whisper/强制对齐 | 本地免费，消耗显存和部署时间 | 本地备选 |
| ElevenLabs Multilingual v2/v3 | 高，中文需实测 | 发音词典、文本规范化、语速/风格 | 可配 Forced Alignment | 账号套餐/按量付费 | 国际化备选 |
| Edge Neural | 中 | 只适合基础语速、音高 | 可生成字词边界 | 免费、稳定 | 工程预览 |

## 为什么 Fish Audio 排第一

- 官方 `s2.1-pro` 支持 83 种语言和自然语言表达控制。
- `s2.1-pro-free` 与正式模型质量一致，适合先试听和小规模开发。
- 中文可用带声调数字的拼音标签逐字纠正多音字、人名和专业术语。
- 正式 API 当前标价为 15 美元 / 百万 UTF-8 字节，无订阅费和月度最低消费。
- 财经口播需要的是“严肃但不播音腔、数字清楚、停顿自然”，比夸张情绪更依赖可控韵律和发音。

## 样音测试协议

所有服务必须使用同一段文本、同一响度和同一剪辑边界：

> 现在的 A 股，到底贵不贵？世界银行序列显示，二零零七年超过百分之一百二十；而二零二五年，大约回到百分之七十九点五。高位，不等于极端。

评分维度：

- “A 股”“世界银行”“79.5%”是否清楚、自然；
- 逗号和分号是否形成像真人思考的停顿；
- 是否存在句尾机械下坠、每字等长或统一播音腔；
- 1.0 倍和 0.96 倍语速下是否仍自然；
- 同一音色跨场景的一致性。

## 账号与密钥

- Fish Audio：注册账号并创建 API key；先用免费开发模型，不需要先充值。
- Azure Dragon HD：需要 Azure 订阅、Speech 资源的 key 和 region。
- ElevenLabs：注册账号并创建 API key；免费额度能否覆盖 v3/高质量模型以账号页面为准。
- 本地 Qwen3-TTS：不需要账号，但需要下载数 GB 模型权重。

密钥只写入本机 `.env`，不得写进 Git、日志、口播稿或发布包。

## 官方资料

- Fish Audio 模型：https://docs.fish.audio/developer-guide/models-pricing/models-overview
- Fish Audio 价格：https://docs.fish.audio/developer-guide/models-pricing/pricing-and-rate-limits
- Fish Audio 中文发音控制：https://docs.fish.audio/developer-guide/core-features/fine-grained-control/chinese
- Azure 中文与 Dragon HD 音色：https://learn.microsoft.com/azure/ai-services/speech-service/language-support?tabs=tts
- ElevenLabs 模型：https://elevenlabs.io/docs/overview/models
- Qwen3-TTS：https://github.com/QwenLM/Qwen3-TTS

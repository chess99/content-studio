# 渲染器适配层

当前主渲染引擎是 Remotion 4。入口为 `src/video/index.ts`，统一合成组件为 `KnowledgeVideo`，`scripts/render-project.mjs` 负责低清、正式版、封面和响度标准化。

上层只传入结构化时间线、音频、字幕、品牌配置和输出参数。新增渲染后端时应保持该输入协议，不让项目脚本直接依赖画面组件内部实现。

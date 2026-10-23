# Content Studio 项目说明

本仓库是本地优先的内容创作 monorepo，用于维护创作 skills、确定性工具、发布器、视频生产应用和实验项目。

## 边界

- 不保存具体选题、草稿、图片、视频成片或发布状态；这些内容属于独立的内容资产仓库 `CONTENT_ROOT`。
- 不保存 Hexo 文章副本、站点配置或部署脚本；这些内容属于独立的博客仓库。
- 工作流通过调用方提供的 `TOPIC_DIR` 读写内容资产；工具不得把正式产物留在自己的示例或缓存目录。
- 路径优先使用调用方提供的 `CONTENT_ROOT`、`TOPIC_DIR` 与博客目录；未提供时可定位同级 `../content`、`../blog`。资产组织规范以实际内容仓库的 `AGENTS.md` 为唯一来源；执行任务前读取并遵循，不在本仓库复制维护另一套规则。
- `skills/` 只保存本仓库自主开发的流程编排和面向 Agent 的工具入口。
- `vendor/` 保存第三方 skill 的可审计源码副本；来源、跟踪 ref、精确 commit 和目标目录统一登记在 `vendor/skills.json`，通过 `tools/sync_vendor_skills.py` 同步上游。
- `apps/` 保存可独立构建、测试和运行的确定性应用；目录内存在 `AGENTS.md` 时同时遵循其局部规则。
- `labs/` 保存尚未达到稳定调用契约的探索项目，不得被正式 workflow 当作必需依赖。
- `tools/` 保存不值得单独建应用的小型通用工具。
- 新增任务优先从 `skills/content-producer/` 的任务映射选择入口；已有明确形态的请求直接使用对应工作流。
- 第三方条目设置 `discovery: false` 时只通过自研工作流按需读取，不加入自动发现入口。
- `.agents/skills/` 是 Agent skill 的聚合入口，目录内使用软链连接自研与第三方 skill；`.claude/skills` 和 `.catpaw/skills` 复用这个入口。

## 外部副作用

- 本地转换、校验和预览可以直接执行。
- 创建平台草稿只在用户明确要求准备或创建草稿时执行。
- 公开发布、评论、回复、删除登录态等动作必须取得本次任务中的明确授权。
- 发布工具优先提供 `validate → preview → stage → confirm → publish → record` 中能够安全支持的阶段，不伪装不存在的平台能力。

## 开发要求

- 文档主语言使用中文。
- 修改脚本后至少执行语法检查；有测试时执行相关测试。
- 账号凭证、Cookie、浏览器 profile、`.env`、`.wxp.json` 和 token 缓存不得进入 Git。
- 新增或修改自研 skill 时运行 `skill-creator` 的 `quick_validate.py`；复杂 workflow 应使用真实样例做前向验证。
- 第三方 skill 默认保持上游源码原样。需要本地补丁时，必须在清单或相邻文档中说明原因，并确认后续同步不会静默覆盖。
- 每个完整迭代只提交本次修改，提交前检查暂存区。

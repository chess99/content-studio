# 知识漫画

用人物的任务串联知识。每格明确人物在做什么、发生了什么变化、读者因此理解什么。技术概念拟人化时保留真实机制，不让比喻替代因果。

上游参考目录：`vendor/JimLiu/baoyu-skills/baoyu-comic/references/`。

- 角色一致性：`character-template.md`，仅保留本次必要的识别特征、服装、比例和道具。
- 分格：`layouts/four-panel.md`、`layouts/standard.md`、`layouts/webtoon.md`，按阅读介质选择。
- 知识故事：`presets/concept-story.md`、`presets/ohmsha.md`，按题材读取。

角色首次定稿后，后续生成尽量使用同一参考图。每格画面提示词包含人物位置、动作、景别、场景、气泡逐字文案和阅读顺序。长对白拆格；气泡不能遮挡承担解释作用的动作或道具。

先验证开场、知识转折和结尾的连续性，再补中间格。审查视线、动作方向、道具位置、角色身份以及解释是否成立。使用有授权的自有角色；风格选择用视觉特征描述。

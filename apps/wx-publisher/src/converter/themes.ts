/**
 * 微信公众号排版主题
 *
 * 运行时主题只暴露 48 个对齐主题。主题选择信息保留在 Theme
 * 元数据中，方便 CLI、Studio 和 AI 调用方按场景挑选。
 */

export interface Theme {
  name: string
  description: string
  styles: NodeStyles
  collection?: string
  displayName?: string
  bestFor?: string
  density?: "low" | "medium" | "high"
  contrast?: "low" | "medium" | "high"
  accent?: string
  advancedPalette?: ThemeAdvancedPalette
  sourceUpdatedAt?: string
}

export interface ThemeAdvancedPalette {
  background: string
  surface: string
  surfaceAlt: string
  accentSoft: string
  accentSofter: string
  accentDark: string
  border: string
  muted: string
  text: string
  textStrong: string
  mutedBorder?: string
}

export interface ThemeReference {
  name: string
  description: string
  collection: string
  displayName: string
  bestFor: string
  density: "low" | "medium" | "high"
  contrast: "low" | "medium" | "high"
  accent: string
}

export interface NodeStyles {
  wrapper: string
  h1: string
  h2: string
  h3: string
  h4: string
  h5?: string
  h6?: string
  p: string
  strong: string
  em: string
  code: string
  codespan?: string
  pre: string
  preCode: string
  codePre?: string
  blockquote: string
  blockquoteP?: string
  blockquoteNote?: string
  blockquoteTip?: string
  blockquoteImportant?: string
  blockquoteWarning?: string
  blockquoteCaution?: string
  blockquoteTitle?: string
  blockquoteTitleNote?: string
  blockquoteTitleTip?: string
  blockquoteTitleImportant?: string
  blockquoteTitleWarning?: string
  blockquoteTitleCaution?: string
  blockquotePNote?: string
  blockquotePTip?: string
  blockquotePImportant?: string
  blockquotePWarning?: string
  blockquotePCaution?: string
  ul: string
  ol: string
  li: string
  hr: string
  img: string
  figure?: string
  figcaption?: string
  a: string
  wxLink?: string
  footnotes?: string
  footnoteItem?: string
  galleryContainer?: string
  galleryImageContainer?: string
  galleryCaption?: string
  longimageContainer?: string
  longimageImageContainer?: string
  longimageCaption?: string
  dialogueContainer?: string
  dialogueTitle?: string
  dialogueItem?: string
  dialogueAvatarLeft?: string
  dialogueAvatarRight?: string
  dialogueBubbleLeft?: string
  dialogueBubbleRight?: string
  dialogueItemLeft?: string
  dialogueItemRight?: string
  table: string
  th: string
  td: string
}

type ThemeCollection = "built-in" | "classic" | "modern" | "extra" | "minimal" | "focus" | "elegant" | "bold"

interface ThemeSpec {
  name: string
  collection: ThemeCollection
  displayName: string
  accent: string
  background: string
  surface: string
  text: string
  muted: string
  border: string
  codeBackground: string
  description: string
  bestFor: string
  density: "low" | "medium" | "high"
  contrast: "low" | "medium" | "high"
}

const SOURCE_UPDATED_AT = "2026-06-03"

const READING_FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'PingFang SC','Helvetica Neue',Arial,sans-serif"
const READING_PARAGRAPH = "font-size:16px;line-height:1.82;margin:0 0 16px 0;"
const READING_LIST = "list-style:none;padding-left:0;margin:0 0 16px 0;"
const READING_LIST_ITEM = "display:block;margin:0.22em 8px;font-size:16px;line-height:1.82;"

const NAMED_THEME_SPECS: ThemeSpec[] = [
  named("default", "built-in", "Reference Warm", "#a34e2e", "#faf9f5", "#f7f7f7", "#222222", "#737373", "#e3c6b9", "#f1e6df", "暖色技术长文基线，适合代码和判断密集的文章", "technical essays, code-heavy notes, structured long-form writing", "medium", "medium"),
  named("bytedance", "built-in", "Product Blue", "#1677ff", "#ffffff", "#f2f3f5", "#4e5969", "#717782", "#b4d2fb", "#e3eefd", "产品蓝，现代清晰", "product updates, efficient business writing, modern operations", "medium", "medium"),
  named("apple", "built-in", "Polished Blue", "#007aff", "#ffffff", "#fafafa", "#333333", "#767676", "#add2fa", "#e0eefd", "精致系统蓝，留白充足", "brand stories, product writing, polished launches", "low", "medium"),
  named("sports", "built-in", "Energy Green", "#00a968", "#ffffff", "#f8f8f8", "#2c2c2c", "#767676", "#afd9cc", "#e1f1ec", "活力绿，节奏强", "events, campaigns, launches, time-sensitive updates", "medium", "high"),
  named("chinese", "built-in", "Classic Red", "#8b1e22", "#f8f4e9", "#f5eee3", "#333333", "#70706f", "#d5b0a9", "#ebdad1", "中式红，书卷气", "culture, seasonal writing, traditional editorial pieces", "medium", "medium"),
  named("cyber", "built-in", "Cyber Pink", "#f472b6", "#ffffff", "#fef8fb", "#333333", "#767676", "#d8caf9", "#f0ebfd", "赛博粉紫，高对比", "visual technology, experiments, campaigns", "high", "high"),
  named("wechat-native", "classic", "Classic Green", "#07c160", "#ffffff", "#f6fbfa", "#333333", "#767676", "#afd9c3", "#e1f1e9", "公众号原生绿，熟悉保守", "public-account style posts, conservative knowledge writing", "medium", "medium"),
  named("nyt-classic", "classic", "Newsprint Blue", "#326891", "#fdfaf6", "#f7f3ee", "#000000", "#757372", "#bccbd6", "#e5e8ea", "新闻纸蓝，严肃长文", "long-form reports, essays, opinion columns", "high", "medium"),
  named("github-readme", "modern", "Developer Blue", "#0969da", "#ffffff", "#f6f8fa", "#1f2328", "#75767a", "#b0cff3", "#e1edfb", "开发者蓝，README 气质", "technical guides, API notes, developer documentation", "medium", "medium"),
  named("sspai-red", "modern", "Media Red", "#d71a1b", "#ffffff", "#f6fbfa", "#333333", "#767676", "#f2b6b6", "#fae4e4", "媒体红，利落醒目", "productivity posts, media-style reviews, creator content", "medium", "high"),
  named("mint-fresh", "modern", "Fresh Mint", "#1a7a5a", "#f0faf5", "#e1f5ec", "#2d4a3e", "#63766f", "#acd1c3", "#d6ebe2", "清新薄荷，轻运营", "lifestyle, health, light operations content", "low", "medium"),
  named("sunset-amber", "modern", "Sunset Amber", "#c0582a", "#fdf6ee", "#f9ecda", "#3d2c1e", "#7c6f64", "#e7c2af", "#f5e3d6", "落日琥珀，叙事温暖", "travel, narrative essays, story-driven columns", "medium", "medium"),
  named("ink-minimal", "extra", "Ink Minimal", "#111111", "#ffffff", "#fafafa", "#111111", "#767676", "#b3b3b3", "#e2e2e2", "黑白墨色，低干扰", "text-heavy essays, notes, minimal editorial writing", "low", "medium"),
  named("lavender-dream", "extra", "Lavender Dream", "#6b4c9a", "#f5f0ff", "#ece4ff", "#3d3155", "#746a87", "#c9bcdf", "#e4dcf3", "柔紫梦境，品牌情绪", "brand mood, inspiration writing, soft visual stories", "low", "medium"),
  named("coffee-house", "extra", "Coffee House", "#6d4c41", "#f5efe6", "#ece3d5", "#3e2723", "#7b6963", "#c9bbb1", "#e5dbd2", "咖啡暖棕，人物访谈", "interviews, human-centered columns, essays", "medium", "medium"),
  named("bauhaus-primary", "extra", "Primary Bauhaus", "#004d9f", "#ffffff", "#f6fbfa", "#1a1a1a", "#767676", "#adc6e0", "#e0eaf3", "包豪斯主色，图形感强", "campaigns, launches, visual columns", "high", "high"),
]

const COLOR_VARIANTS = [
  { key: "gold", accent: "#C8A062", label: "古铜金" },
  { key: "green", accent: "#2BAE85", label: "翡翠绿" },
  { key: "blue", accent: "#4B6EF5", label: "宝石蓝" },
  { key: "orange", accent: "#F89A3A", label: "暖阳橙" },
  { key: "red", accent: "#F25C54", label: "中国红" },
  { key: "navy", accent: "#1F4F8A", label: "深海蓝" },
  { key: "gray", accent: "#4E5969", label: "石墨灰" },
  { key: "sky", accent: "#3A7FD5", label: "天空蓝" },
] as const

const MATRIX_THEME_SPECS: ThemeSpec[] = [
  ...themeSeries("minimal", "Minimal", "minimal", "低干扰极简，内容优先", "clean repeatable output, low-friction templates", "low", "medium"),
  ...themeSeries("focus", "Focus", "focus", "居中强调，节奏清晰", "centered rhythm, key-point emphasis, structured reading", "medium", "medium"),
  ...themeSeries("elegant", "Elegant", "elegant", "层次丰富，编辑感强", "brand-led articles, editorial writing, aesthetic long-form", "medium", "medium"),
  ...themeSeries("bold", "Bold", "bold", "强视觉标题，强调转化", "launches, campaigns, high-impact announcements", "medium", "high"),
]

const THEME_DISPLAY_METADATA: Record<string, { displayName: string; bestFor: string }> = {
  "default": { displayName: "默认主题", bestFor: "适合运营、知识内容，气质偏熟悉、微信原生。" },
  "bytedance": { displayName: "字节范", bestFor: "适合产品、品牌内容，气质偏科技、效率。" },
  "apple": { displayName: "苹果范", bestFor: "适合品牌、产品内容，气质偏精致、未来感。" },
  "sports": { displayName: "运动风", bestFor: "适合运营、专题内容，气质偏动感、活力。" },
  "chinese": { displayName: "中国风", bestFor: "适合专题、品牌内容，气质偏古典、文化。" },
  "cyber": { displayName: "赛博朋克", bestFor: "适合专题、产品内容，气质偏赛博、实验性。" },
  "wechat-native": { displayName: "微信公众号原生", bestFor: "适合运营、知识内容，气质偏熟悉、稳妥。" },
  "nyt-classic": { displayName: "NYT", bestFor: "适合知识、专题内容，气质偏报刊、严肃。" },
  "github-readme": { displayName: "GitHub", bestFor: "适合产品、知识内容，气质偏技术、结构化。" },
  "sspai-red": { displayName: "少数派", bestFor: "适合产品、品牌内容，气质偏媒体感、中文科技。" },
  "mint-fresh": { displayName: "薄荷", bestFor: "适合品牌、运营内容，气质偏清新、生活方式。" },
  "sunset-amber": { displayName: "日落", bestFor: "适合专题、品牌内容，气质偏叙事、温暖。" },
  "ink-minimal": { displayName: "水墨", bestFor: "适合知识、专题内容，气质偏黑白、克制。" },
  "lavender-dream": { displayName: "薰衣草", bestFor: "适合品牌、专题内容，气质偏柔和、浪漫。" },
  "coffee-house": { displayName: "咖啡", bestFor: "适合专题、品牌内容，气质偏温暖、人文。" },
  "bauhaus-primary": { displayName: "Bauhaus", bestFor: "适合专题、品牌、产品内容，气质偏现代主义、实验。" },
  "minimal-gold": { displayName: "简约 · 古铜金", bestFor: "适合知识、运营内容，气质偏克制、整洁、温润、沉稳。" },
  "minimal-green": { displayName: "简约 · 翡翠绿", bestFor: "适合知识、运营内容，气质偏克制、整洁、清新、自然。" },
  "minimal-blue": { displayName: "简约 · 宝石蓝", bestFor: "适合知识、运营内容，气质偏克制、整洁、专业、科技。" },
  "minimal-orange": { displayName: "简约 · 暖阳橙", bestFor: "适合知识、运营内容，气质偏克制、整洁、明快、亲和。" },
  "minimal-red": { displayName: "简约 · 中国红", bestFor: "适合知识、运营内容，气质偏克制、整洁、强调、传播。" },
  "minimal-navy": { displayName: "简约 · 深海蓝", bestFor: "适合知识、运营内容，气质偏克制、整洁、可信、理性。" },
  "minimal-gray": { displayName: "简约 · 石墨灰", bestFor: "适合知识、运营内容，气质偏克制、整洁、中性。" },
  "minimal-sky": { displayName: "简约 · 天空蓝", bestFor: "适合知识、运营内容，气质偏克制、整洁、通透、轻盈。" },
  "focus-gold": { displayName: "聚焦 · 古铜金", bestFor: "适合知识、品牌内容，气质偏聚焦、秩序、温润、沉稳。" },
  "focus-green": { displayName: "聚焦 · 翡翠绿", bestFor: "适合知识、品牌内容，气质偏聚焦、秩序、清新、自然。" },
  "focus-blue": { displayName: "聚焦 · 宝石蓝", bestFor: "适合知识、品牌内容，气质偏聚焦、秩序、专业、科技。" },
  "focus-orange": { displayName: "聚焦 · 暖阳橙", bestFor: "适合知识、品牌内容，气质偏聚焦、秩序、明快、亲和。" },
  "focus-red": { displayName: "聚焦 · 中国红", bestFor: "适合知识、品牌内容，气质偏聚焦、秩序、强调、传播。" },
  "focus-navy": { displayName: "聚焦 · 深海蓝", bestFor: "适合知识、品牌内容，气质偏聚焦、秩序、可信、理性。" },
  "focus-gray": { displayName: "聚焦 · 石墨灰", bestFor: "适合知识、品牌内容，气质偏聚焦、秩序、克制、中性。" },
  "focus-sky": { displayName: "聚焦 · 天空蓝", bestFor: "适合知识、品牌内容，气质偏聚焦、秩序、通透、轻盈。" },
  "elegant-gold": { displayName: "精致 · 古铜金", bestFor: "适合品牌、运营内容，气质偏精致、雅致、温润、沉稳。" },
  "elegant-green": { displayName: "精致 · 翡翠绿", bestFor: "适合品牌、运营内容，气质偏精致、雅致、清新、自然。" },
  "elegant-blue": { displayName: "精致 · 宝石蓝", bestFor: "适合品牌、运营内容，气质偏精致、雅致、专业、科技。" },
  "elegant-orange": { displayName: "精致 · 暖阳橙", bestFor: "适合品牌、运营内容，气质偏精致、雅致、明快、亲和。" },
  "elegant-red": { displayName: "精致 · 中国红", bestFor: "适合品牌、运营内容，气质偏精致、雅致、强调、传播。" },
  "elegant-navy": { displayName: "精致 · 深海蓝", bestFor: "适合品牌、运营内容，气质偏精致、雅致、可信、理性。" },
  "elegant-gray": { displayName: "精致 · 石墨灰", bestFor: "适合品牌、运营内容，气质偏精致、雅致、克制、中性。" },
  "elegant-sky": { displayName: "精致 · 天空蓝", bestFor: "适合品牌、运营内容，气质偏精致、雅致、通透、轻盈。" },
  "bold-gold": { displayName: "醒目 · 古铜金", bestFor: "适合专题、品牌、运营内容，气质偏醒目、宣传、温润、沉稳。" },
  "bold-green": { displayName: "醒目 · 翡翠绿", bestFor: "适合专题、品牌、运营内容，气质偏醒目、宣传、清新、自然。" },
  "bold-blue": { displayName: "醒目 · 宝石蓝", bestFor: "适合专题、品牌、运营内容，气质偏醒目、宣传、专业、科技。" },
  "bold-orange": { displayName: "醒目 · 暖阳橙", bestFor: "适合专题、品牌、运营内容，气质偏醒目、宣传、明快、亲和。" },
  "bold-red": { displayName: "醒目 · 中国红", bestFor: "适合专题、品牌、运营内容，气质偏醒目、宣传、强调、传播。" },
  "bold-navy": { displayName: "醒目 · 深海蓝", bestFor: "适合专题、品牌、运营内容，气质偏醒目、宣传、可信、理性。" },
  "bold-gray": { displayName: "醒目 · 石墨灰", bestFor: "适合专题、品牌、运营内容，气质偏醒目、宣传、克制、中性。" },
  "bold-sky": { displayName: "醒目 · 天空蓝", bestFor: "适合专题、品牌、运营内容，气质偏醒目、宣传、通透、轻盈。" },
}

const GALLERY_ADVANCED_PALETTES: Record<string, ThemeAdvancedPalette> = {
  "default": { background: "#faf9f5", surface: "#faf9f5", surfaceAlt: "#f7f7f7", accentSoft: "#f1e6df", accentSofter: "#ecd9d0", accentDark: "#b3593b", border: "#e3c6b9", muted: "#737373", text: "#555555", textStrong: "#222222", mutedBorder: "rgba(202, 202, 199, 0.18)" },
  "bytedance": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f2f3f5", accentSoft: "#e3eefd", accentSofter: "#d0e3fc", accentDark: "#1571f1", border: "#b4d2fb", muted: "#717782", text: "#1d2129", textStrong: "#4e5969" },
  "apple": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fafafa", accentSoft: "#e0eefd", accentSofter: "#cce3fc", accentDark: "#0072ef", border: "#add2fa", muted: "#767676", text: "#595959", textStrong: "#333333" },
  "sports": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f8f8f8", accentSoft: "#e1f1ec", accentSofter: "#cde7df", accentDark: "#05875f", border: "#afd9cc", muted: "#767676", text: "#595959", textStrong: "#2c2c2c" },
  "chinese": { background: "#f8f4e9", surface: "#f8f4e9", surfaceAlt: "#f5eee3", accentSoft: "#ebdad1", accentSofter: "#e2c9c1", accentDark: "#8b1e22", border: "#d5b0a9", muted: "#70706f", text: "#8b1e22", textStrong: "#333333" },
  "cyber": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fef8fb", accentSoft: "#f0ebfd", accentSofter: "#e7defb", accentDark: "#8659ed", border: "#d8caf9", muted: "#767676", text: "#595959", textStrong: "#333333" },
  "wechat-native": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f6fbfa", accentSoft: "#e1f1e9", accentSofter: "#cde7da", accentDark: "#058844", border: "#afd9c3", muted: "#767676", text: "#163325", textStrong: "#333333" },
  "nyt-classic": { background: "#fdfaf6", surface: "#fdfaf6", surfaceAlt: "#f7f3ee", accentSoft: "#e5e8ea", accentSofter: "#d4dde2", accentDark: "#326891", border: "#bccbd6", muted: "#757372", text: "#111111", textStrong: "#000000" },
  "github-readme": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f6f8fa", accentSoft: "#e1edfb", accentSofter: "#cee1f8", accentDark: "#0969da", border: "#b0cff3", muted: "#75767a", text: "#1f2328", textStrong: "#1f2328" },
  "sspai-red": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f6fbfa", accentSoft: "#fae4e4", accentSofter: "#f7d1d1", accentDark: "#d71a1b", border: "#f2b6b6", muted: "#767676", text: "#2d2d2d", textStrong: "#333333" },
  "mint-fresh": { background: "#f0faf5", surface: "#f0faf5", surfaceAlt: "#e1f5ec", accentSoft: "#d6ebe2", accentSofter: "#c5e0d6", accentDark: "#1a7a5a", border: "#acd1c3", muted: "#63766f", text: "#1d5e49", textStrong: "#2d4a3e" },
  "sunset-amber": { background: "#fdf6ee", surface: "#fdf6ee", surfaceAlt: "#f9ecda", accentSoft: "#f5e3d6", accentSofter: "#efd6c6", accentDark: "#b85428", border: "#e7c2af", muted: "#7c6f64", text: "#7f452a", textStrong: "#3d2c1e" },
  "ink-minimal": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fafafa", accentSoft: "#e2e2e2", accentSofter: "#cfcfcf", accentDark: "#111111", border: "#b3b3b3", muted: "#767676", text: "#000000", textStrong: "#111111" },
  "lavender-dream": { background: "#f5f0ff", surface: "#f5f0ff", surfaceAlt: "#ece4ff", accentSoft: "#e4dcf3", accentSofter: "#d9cfeb", accentDark: "#6b4c9a", border: "#c9bcdf", muted: "#746a87", text: "#5e4587", textStrong: "#3d3155" },
  "coffee-house": { background: "#f5efe6", surface: "#f5efe6", surfaceAlt: "#ece3d5", accentSoft: "#e5dbd2", accentSofter: "#dacec5", accentDark: "#6d4c41", border: "#c9bbb1", muted: "#7b6963", text: "#4a302a", textStrong: "#3e2723" },
  "bauhaus-primary": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f6fbfa", accentSoft: "#e0eaf3", accentSofter: "#ccdbec", accentDark: "#004d9f", border: "#adc6e0", muted: "#767676", text: "#595959", textStrong: "#1a1a1a" },
  "minimal-gold": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f9fafb", accentSoft: "#f2eee9", accentSofter: "#e9e3da", accentDark: "#8f7246", border: "#dbd2c4", muted: "#767676", text: "#6b5534", textStrong: "#2c2c2c" },
  "minimal-green": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f9fafb", accentSoft: "#e4f0ed", accentSofter: "#d3e7e0", accentDark: "#218666", border: "#b8d8ce", muted: "#767676", text: "#19644d", textStrong: "#2c2c2c" },
  "minimal-blue": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f9fafb", accentSoft: "#e9edfd", accentSofter: "#dbe1fc", accentDark: "#496bef", border: "#c5d0fa", muted: "#767676", text: "#3751b4", textStrong: "#2c2c2c" },
  "minimal-orange": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f9fafb", accentSoft: "#f4ede5", accentSofter: "#ede1d4", accentDark: "#a76827", border: "#e3cfba", muted: "#767676", text: "#7e4e1e", textStrong: "#2c2c2c" },
  "minimal-red": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f9fafb", accentSoft: "#f9eae9", accentSofter: "#f4dbda", accentDark: "#ca4d46", border: "#eec6c4", muted: "#767676", text: "#983a35", textStrong: "#2c2c2c" },
  "minimal-navy": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f9fafb", accentSoft: "#e4eaf1", accentSofter: "#d2dce8", accentDark: "#1f4f8a", border: "#b7c7da", muted: "#767676", text: "#1f4f8a", textStrong: "#2c2c2c" },
  "minimal-gray": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f9fafb", accentSoft: "#eaebed", accentSofter: "#dcdee1", accentDark: "#4e5969", border: "#c6cacf", muted: "#767676", text: "#4e5969", textStrong: "#2c2c2c" },
  "minimal-sky": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f9fafb", accentSoft: "#e7eff8", accentSofter: "#d7e4f4", accentDark: "#3777c8", border: "#bfd3ed", muted: "#767676", text: "#295a96", textStrong: "#2c2c2c" },
  "focus-gold": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fcfaf7", accentSoft: "#f2eee9", accentSofter: "#e9e3da", accentDark: "#8f7246", border: "#dbd2c4", muted: "#767676", text: "#6b5534", textStrong: "#2c2c2c" },
  "focus-green": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f4fbf9", accentSoft: "#e4f0ed", accentSofter: "#d3e7e0", accentDark: "#218666", border: "#b8d8ce", muted: "#767676", text: "#19644d", textStrong: "#2c2c2c" },
  "focus-blue": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f6f8ff", accentSoft: "#e9edfd", accentSofter: "#dbe1fc", accentDark: "#496bef", border: "#c5d0fa", muted: "#767676", text: "#3751b4", textStrong: "#2c2c2c" },
  "focus-orange": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fffaf5", accentSoft: "#f4ede5", accentSofter: "#ede1d4", accentDark: "#a76827", border: "#e3cfba", muted: "#767676", text: "#7e4e1e", textStrong: "#2c2c2c" },
  "focus-red": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fef7f6", accentSoft: "#f9eae9", accentSofter: "#f4dbda", accentDark: "#ca4d46", border: "#eec6c4", muted: "#767676", text: "#983a35", textStrong: "#2c2c2c" },
  "focus-navy": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f4f6f9", accentSoft: "#e4eaf1", accentSofter: "#d2dce8", accentDark: "#1f4f8a", border: "#b7c7da", muted: "#767676", text: "#1f4f8a", textStrong: "#2c2c2c" },
  "focus-gray": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f6f7f8", accentSoft: "#eaebed", accentSofter: "#dcdee1", accentDark: "#4e5969", border: "#c6cacf", muted: "#767676", text: "#4e5969", textStrong: "#2c2c2c" },
  "focus-sky": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f5f9fd", accentSoft: "#e7eff8", accentSofter: "#d7e4f4", accentDark: "#3777c8", border: "#bfd3ed", muted: "#767676", text: "#295a96", textStrong: "#2c2c2c" },
  "elegant-gold": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fcfaf7", accentSoft: "#f2eee9", accentSofter: "#e9e3da", accentDark: "#8f7246", border: "#dbd2c4", muted: "#767676", text: "#6b5534", textStrong: "#2c2c2c" },
  "elegant-green": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f4fbf9", accentSoft: "#e4f0ed", accentSofter: "#d3e7e0", accentDark: "#218666", border: "#b8d8ce", muted: "#767676", text: "#19644d", textStrong: "#2c2c2c" },
  "elegant-blue": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f6f8ff", accentSoft: "#e9edfd", accentSofter: "#dbe1fc", accentDark: "#496bef", border: "#c5d0fa", muted: "#767676", text: "#3751b4", textStrong: "#2c2c2c" },
  "elegant-orange": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fffaf5", accentSoft: "#f4ede5", accentSofter: "#ede1d4", accentDark: "#a76827", border: "#e3cfba", muted: "#767676", text: "#7e4e1e", textStrong: "#2c2c2c" },
  "elegant-red": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fef7f6", accentSoft: "#f9eae9", accentSofter: "#f4dbda", accentDark: "#ca4d46", border: "#eec6c4", muted: "#767676", text: "#983a35", textStrong: "#2c2c2c" },
  "elegant-navy": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f4f6f9", accentSoft: "#e4eaf1", accentSofter: "#d2dce8", accentDark: "#1f4f8a", border: "#b7c7da", muted: "#767676", text: "#1f4f8a", textStrong: "#2c2c2c" },
  "elegant-gray": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f6f7f8", accentSoft: "#eaebed", accentSofter: "#dcdee1", accentDark: "#4e5969", border: "#c6cacf", muted: "#767676", text: "#4e5969", textStrong: "#2c2c2c" },
  "elegant-sky": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f5f9fd", accentSoft: "#e7eff8", accentSofter: "#d7e4f4", accentDark: "#3777c8", border: "#bfd3ed", muted: "#767676", text: "#295a96", textStrong: "#2c2c2c" },
  "bold-gold": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fcfaf7", accentSoft: "#f2eee9", accentSofter: "#e9e3da", accentDark: "#8f7246", border: "#dbd2c4", muted: "#767676", text: "#595959", textStrong: "#2c2c2c" },
  "bold-green": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f4fbf9", accentSoft: "#e4f0ed", accentSofter: "#d3e7e0", accentDark: "#218666", border: "#b8d8ce", muted: "#767676", text: "#595959", textStrong: "#2c2c2c" },
  "bold-blue": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f6f8ff", accentSoft: "#e9edfd", accentSofter: "#dbe1fc", accentDark: "#496bef", border: "#c5d0fa", muted: "#767676", text: "#595959", textStrong: "#2c2c2c" },
  "bold-orange": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fffaf5", accentSoft: "#f4ede5", accentSofter: "#ede1d4", accentDark: "#a76827", border: "#e3cfba", muted: "#767676", text: "#595959", textStrong: "#2c2c2c" },
  "bold-red": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fef7f6", accentSoft: "#f9eae9", accentSofter: "#f4dbda", accentDark: "#ca4d46", border: "#eec6c4", muted: "#767676", text: "#595959", textStrong: "#2c2c2c" },
  "bold-navy": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f4f6f9", accentSoft: "#e4eaf1", accentSofter: "#d2dce8", accentDark: "#1f4f8a", border: "#b7c7da", muted: "#767676", text: "#595959", textStrong: "#2c2c2c" },
  "bold-gray": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f6f7f8", accentSoft: "#eaebed", accentSofter: "#dcdee1", accentDark: "#4e5969", border: "#c6cacf", muted: "#767676", text: "#595959", textStrong: "#2c2c2c" },
  "bold-sky": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f5f9fd", accentSoft: "#e7eff8", accentSofter: "#d7e4f4", accentDark: "#3777c8", border: "#bfd3ed", muted: "#767676", text: "#595959", textStrong: "#2c2c2c" },
}

const MD2_NAMED_RAW_STYLES = {
  "default": {
    "container": "max-width: 677px; margin: 0 auto; padding: 8px; background-color: rgb(250, 249, 245); font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif; color: rgb(34, 34, 34); line-height: 1.75; font-size: 15px; border-radius: 12px;",
    "h1": "margin: 1.5em 8px 0.75em 0px; padding: 0.8em 1.5em; background: rgb(200, 100, 66); font-size: 22px; font-weight: bold; line-height: 1.2; color: #ffffff; text-align: center; border-radius: 8px; box-shadow: 0 2px 8px rgba(200, 100, 66, 0.2);",
    "h2": "margin: 2em 8px 0.75em 0px; padding: 0px 0px 0.5em 12px; border-left: 4px solid rgb(200, 100, 66); border-bottom: 1px dashed rgb(200, 100, 66); font-size: 20px; font-weight: bold; line-height: 1.2; color: rgb(63, 63, 63);",
    "h3": "margin: 2em 8px 0.75em 0px; padding: 0px 0px 0.4em 12px; font-size: 18px; font-weight: bold; line-height: 1.2; color: rgb(63, 63, 63); border-left: 4px solid rgb(200, 100, 66); border-bottom: 1px dashed rgb(200, 100, 66);",
    "h4": "margin: 1.5em 8px 0.5em 0px; padding-left: 12px; font-size: 16px; font-weight: bold; line-height: 1.2; color: rgb(63, 63, 63); border-left: 4px solid rgb(200, 100, 66);",
    "h5": "margin: 1.2em 8px 0.4em 0px; padding-left: 8px; font-size: 15px; font-weight: bold; line-height: 1.2; color: rgb(63, 63, 63); border-left: 3px solid rgb(200, 100, 66);",
    "h6": "margin: 1em 8px 0.3em 0px; padding-left: 6px; font-size: 14px; font-weight: bold; line-height: 1.2; color: rgb(63, 63, 63); border-left: 2px solid rgb(200, 100, 66);",
    "p": "margin: 1.2em 8px; text-align: justify; line-height: 1.75; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif; font-size: 15px; letter-spacing: 0.1em; color: rgb(34, 34, 34); overflow-wrap: break-word;",
    "image": "display: block; max-width: 100%; margin: 0.1em auto 0.5em; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 8px;",
    "figure": "margin: 1.5em 8px; text-align: left; line-height: 1.75; font-size: 15px; color: rgb(63, 63, 63);",
    "figcaption": "text-align: center; line-height: 1.75; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif; font-size: 0.8em; color: rgb(136, 136, 136);",
    "blockquote": "margin: 1.5em 0 2em; padding: 1em 1em 1em 2em; border-width: 0px 0px 0px 4px; border-style: solid; border-color: rgb(229, 229, 229) rgb(229, 229, 229) rgb(229, 229, 229) rgb(200, 100, 66); border-radius: 6px; background: rgb(247, 247, 247); color: rgba(0, 0, 0, 0.6); font-style: italic; box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 6px;",
    "blockquote_p": "margin: 0px; text-align: left; line-height: 1.75; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif; font-size: 1em; display: block; letter-spacing: 0.1em; color: rgb(63, 63, 63); font-style: normal; background: rgb(246, 246, 244);",
    "blockquote_note": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #478be6; background: linear-gradient(135deg, rgba(71, 139, 230, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(71, 139, 230, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_tip": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #57ab5a; background: linear-gradient(135deg, rgba(87, 171, 90, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(87, 171, 90, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_important": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #a855f7; background: linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_warning": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #f59e0b; background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_caution": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #ef4444; background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_title": "font-weight: 600; margin-bottom: 0.8em; font-size: 1.05em; letter-spacing: 0.02em;",
    "blockquote_title_note": "color: #478be6;",
    "blockquote_title_tip": "color: #57ab5a;",
    "blockquote_title_important": "color: #a855f7;",
    "blockquote_title_warning": "color: #f59e0b;",
    "blockquote_title_caution": "color: #ef4444;",
    "blockquote_p_note": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_tip": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_important": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_warning": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_caution": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "codespan": "display: inline-block; background: linear-gradient(180deg, rgba(200, 100, 66, 0.14), rgba(200, 100, 66, 0.08)); color: #9f452c; font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; padding: 2px 7px; border-radius: 999px; border: 1px solid rgba(200, 100, 66, 0.18); font-size: 90%; line-height: 1.4;",
    "code_pre": "display: block; box-sizing: border-box; margin: 1.5em 8px; padding: 1.15em 1.2em 1.2em; background: linear-gradient(180deg, rgba(200, 100, 66, 0.14) 0px, rgba(200, 100, 66, 0.14) 12px, rgba(250, 250, 249, 0.98) 12px, rgba(250, 250, 249, 0.98) 100%); border: 1px solid rgba(200, 100, 66, 0.18); border-radius: 14px; overflow-x: auto; font-size: 14px; line-height: 1.6; box-shadow: 0 8px 20px rgba(200, 100, 66, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.85); white-space: pre; word-break: normal; overflow-wrap: normal; -webkit-overflow-scrolling: touch; tab-size: 2;",
    "code": "background: none; padding: 0; font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; font-size: 14px; color: #3b342f; line-height: 1.6;",
    "ul": "list-style: none; margin: 0em 8px 1.5em; padding: 0px; text-align: left; line-height: 1.75; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif; font-size: 15px; color: rgb(63, 63, 63);",
    "ol": "list-style: none; margin: 0em 8px 1.5em; padding: 0px; text-align: left; line-height: 1.75; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif; font-size: 15px; color: rgb(63, 63, 63);",
    "listitem": "margin: 0.5em 0px; padding: 0px; text-align: left; line-height: 1.75; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif; font-size: 15px; color: rgb(63, 63, 63);",
    "strong": "font-weight: bold; color: rgb(200, 100, 66);",
    "em": "font-style: italic; color: rgb(102, 102, 102);",
    "link": "color: rgb(200, 100, 66); text-decoration: none; border-bottom: 1px solid rgba(200, 100, 66, 0.3);",
    "wx_link": "color: rgb(200, 100, 66); text-decoration: none;",
    "hr": "border: none; height: 1px; margin: 2em 0px; background: linear-gradient(to right, rgba(200, 100, 66, 0), rgba(200, 100, 66, 0.6), rgba(200, 100, 66, 0));",
    "inline_katex": "background-color: rgb(246, 246, 244); padding: 2px 4px; border-radius: 3px; font-family: 'KaTeX_Main', 'Times New Roman', serif;",
    "block_katex": "margin: 16px 8px; padding: 16px; background-color: rgb(246, 246, 244); border-radius: 6px; text-align: center; overflow-x: auto;",
    "table": "width: 100%; margin: 16px 8px; border-collapse: collapse; font-size: 15px;",
    "th": "padding: 8px 12px; border: 1px solid rgb(229, 229, 229); background-color: rgb(246, 246, 244); font-weight: bold; text-align: left;",
    "td": "padding: 8px 12px; border: 1px solid rgb(229, 229, 229);",
    "footnotes": "margin-top: 2em; padding-top: 1.5em; border-top: 1px solid #e5e5e5;",
    "footnote_item": "font-size: 0.9em; color: #666; line-height: 1.6; margin-bottom: 0.3em;",
    "gallery_container": "margin: 1.5em 8px 2em; padding: 16px; background: linear-gradient(135deg, rgba(200, 100, 66, 0.02), rgba(250, 249, 245, 0.95)); border: 1px solid rgba(200, 100, 66, 0.15); border-radius: 12px; box-shadow: 0 3px 12px rgba(200, 100, 66, 0.08); position: relative; overflow: hidden; backdrop-filter: blur(8px);",
    "gallery_image_container": "background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(200, 100, 66, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8); border: 1px solid rgba(200, 100, 66, 0.08); padding: 8px; margin-bottom: 12px;",
    "gallery_caption": "text-align: center; font-size: 12px; color: rgba(200, 100, 66, 0.9); margin: 12px 0 0; padding: 10px 16px; background: linear-gradient(135deg, rgba(200, 100, 66, 0.06), rgba(200, 100, 66, 0.12)); border: 1px solid rgba(200, 100, 66, 0.25); border-radius: 12px; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif; font-weight: 500; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(200, 100, 66, 0.1); backdrop-filter: blur(6px);",
    "longimage_container": "margin: 1.5em 8px 2em; padding: 16px; background: linear-gradient(135deg, rgba(200, 100, 66, 0.02), rgba(250, 249, 245, 0.95)); border: 1px solid rgba(200, 100, 66, 0.15); border-radius: 12px; box-shadow: 0 3px 12px rgba(200, 100, 66, 0.08); position: relative; overflow: hidden; backdrop-filter: blur(8px);",
    "longimage_image_container": "max-height: 420px; overflow-y: auto; border-radius: 8px; background: #ffffff; box-shadow: 0 2px 8px rgba(200, 100, 66, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8); border: 1px solid rgba(200, 100, 66, 0.08); padding: 4px; scrollbar-width: thin; scrollbar-color: rgba(200, 100, 66, 0.3) transparent;",
    "longimage_caption": "text-align: center; font-size: 12px; color: rgba(200, 100, 66, 0.9); margin: 12px 0 0; padding: 10px 16px; background: linear-gradient(135deg, rgba(200, 100, 66, 0.06), rgba(200, 100, 66, 0.12)); border: 1px solid rgba(200, 100, 66, 0.25); border-radius: 12px; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif; font-weight: 500; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(200, 100, 66, 0.1); backdrop-filter: blur(6px);",
    "dialogue_container": "margin: 1.5em 8px 2em; padding: 1.2em; background: linear-gradient(135deg, rgba(200, 100, 66, 0.02), rgba(250, 249, 245, 0.8)); border: 1px solid rgba(200, 100, 66, 0.15); border-radius: 12px; box-shadow: 0 3px 12px rgba(200, 100, 66, 0.08); position: relative; overflow: hidden;",
    "dialogue_title": "text-align: center; font-size: 16px; font-weight: 600; color: rgb(200, 100, 66); margin-bottom: 1em; padding-bottom: 0.8em; border-bottom: 1px solid rgba(200, 100, 66, 0.2); letter-spacing: 0.5px; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif;",
    "dialogue_item": "margin: 0.8em 0; display: flex; align-items: flex-start; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif;",
    "dialogue_avatar_left": "width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, rgb(200, 100, 66), rgba(200, 100, 66, 0.8)); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-right: 0.8em; flex-shrink: 0; box-shadow: 0 2px 6px rgba(200, 100, 66, 0.3);",
    "dialogue_avatar_right": "width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, rgba(100, 100, 100, 0.9), rgba(80, 80, 80, 0.8)); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-left: 0.8em; flex-shrink: 0; box-shadow: 0 2px 6px rgba(100, 100, 100, 0.3);",
    "dialogue_bubble_left": "background: linear-gradient(135deg, rgba(200, 100, 66, 0.08), rgba(200, 100, 66, 0.05)); border: 1px solid rgba(200, 100, 66, 0.15); border-radius: 12px 12px 12px 4px; padding: 0.8em 1em; max-width: 75%; color: rgb(63, 63, 63); line-height: 1.6; font-size: 14px; position: relative; box-shadow: 0 1px 3px rgba(200, 100, 66, 0.1);",
    "dialogue_bubble_right": "background: linear-gradient(135deg, rgba(246, 246, 244, 0.9), rgba(246, 246, 244, 0.7)); border: 1px solid rgba(200, 100, 66, 0.1); border-radius: 12px 12px 4px 12px; padding: 0.8em 1em; max-width: 75%; color: rgb(63, 63, 63); line-height: 1.6; font-size: 14px; margin-left: auto; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);",
    "dialogue_item_left": "margin: 0.8em 0; display: flex; align-items: flex-start; justify-content: flex-start;",
    "dialogue_item_right": "margin: 0.8em 0; display: flex; align-items: flex-start; justify-content: flex-end; flex-direction: row-reverse;"
  },
  "bytedance": {
    "container": "max-width: 677px; margin: 0 auto; padding: 8px; background-color: #ffffff; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif; color: #1d2129; line-height: 1.8; font-size: 15px; border-radius: 12px;",
    "h1": "padding: 0.6em 1.5em; margin: 1.5em 0 1.5em; color: #1d2129; font-size: 22px; font-weight: 600; text-align: center; background: linear-gradient(to right, rgba(22,119,255,0.02), rgba(5,212,205,0.05), rgba(22,119,255,0.02)); border-radius: 4px; border-top: 3px solid #1677ff; border-bottom: 1px solid rgba(5,212,205,0.5);",
    "h2": "padding: 0.4em 1.4em; margin: 3em 0 1.5em; color: #fff; background: linear-gradient(135deg, #1677ff, #05d4cd); font-size: 20px; font-weight: 600; text-align: center; border-radius: 8px 24px 8px 24px; box-shadow: 0 4px 12px rgba(5,212,205,0.15); letter-spacing: 0.1em;",
    "h3": "padding: 0.5em 1em 0.5em 12px; font-size: 18px; border-radius: 6px; line-height: 1.6; border-left: 4px solid #1677ff; border-right: 1px solid rgba(22,119,255,0.1); border-bottom: 1px solid rgba(22,119,255,0.1); border-top: 1px solid rgba(22,119,255,0.1); background: linear-gradient(to right, rgba(22,119,255,0.08), rgba(5,212,205,0.03)); color: #1677ff; margin: 2em 0 0.75em; font-weight: 600;",
    "h4": "margin: 2em 0 0.5em; color: #05d4cd; font-size: 16px; font-weight: 500; border-radius: 6px; padding: 0.3em 0 0.3em 8px; border-left: 3px solid #05d4cd; border-bottom: 1px dashed rgba(5,212,205,0.3); background: linear-gradient(to right, rgba(5,212,205,0.06), rgba(22,119,255,0.02));",
    "h5": "margin: 1.5em 0 0.5em; color: #1677ff; font-size: 15px; font-weight: 600; padding: 0.2em 0 0.2em 6px; border-left: 2px solid rgba(22,119,255,0.7); background: linear-gradient(to right, rgba(22,119,255,0.04), rgba(5,212,205,0.01));",
    "h6": "margin: 1.5em 0 0.5em; color: #4e5969; font-size: 14px; font-weight: 600; padding: 0.1em 0 0.1em 4px; border-left: 2px solid rgba(5,212,205,0.5); background: linear-gradient(to right, rgba(5,212,205,0.03), rgba(22,119,255,0.01));",
    "p": "margin: 1.2em 0; letter-spacing: 0.1em; color: #4e5969; text-align: justify; line-height: 1.8; font-size: 15px;",
    "image": "max-width: 100%; border-radius: 8px; margin: 1.5em auto; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid rgba(5,212,205,0.1);",
    "figure": "margin: 1.5em 0; text-align: left; line-height: 1.8; font-size: 15px; color: #4e5969;",
    "figcaption": "text-align: center; font-size: 0.9em; color: #8a919f;",
    "blockquote": "font-style: normal; padding: 1em 1em 1em 2em; border-left: 4px solid #05d4cd; border-radius: 6px; color: #4e5969; background: #f2f3f5; margin: 1.5em 0; border-bottom: 0.2px solid rgba(5,212,205,0.1); border-top: 0.2px solid rgba(5,212,205,0.1); border-right: 0.2px solid rgba(5,212,205,0.1);",
    "blockquote_p": "margin: 0; color: #4e5969; line-height: 1.8;",
    "blockquote_note": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #1677ff; background: linear-gradient(135deg, rgba(22, 119, 255, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(22, 119, 255, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_tip": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #05d4cd; background: linear-gradient(135deg, rgba(5, 212, 205, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(5, 212, 205, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_important": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #8e44ad; background: linear-gradient(135deg, rgba(142, 68, 173, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(142, 68, 173, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_warning": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #ff9800; background: linear-gradient(135deg, rgba(255, 152, 0, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(255, 152, 0, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_caution": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #e74c3c; background: linear-gradient(135deg, rgba(231, 76, 60, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(231, 76, 60, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_title": "font-weight: 600; margin-bottom: 0.8em; font-size: 1.05em; letter-spacing: 0.5px;",
    "blockquote_title_note": "color: #1677ff;",
    "blockquote_title_tip": "color: #05d4cd;",
    "blockquote_title_important": "color: #8e44ad;",
    "blockquote_title_warning": "color: #ff9800;",
    "blockquote_title_caution": "color: #e74c3c;",
    "blockquote_p_note": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_tip": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_important": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_warning": "margin: 0; color: #4e5969; line-height: 1.8;",
    "blockquote_p_caution": "margin: 0; color: #4e5969; line-height: 1.8;",
    "codespan": "display: inline-block; font-size: 90%; color: #1677ff; background: linear-gradient(135deg, rgba(22, 119, 255, 0.12), rgba(5, 212, 205, 0.12)); padding: 2px 7px; border-radius: 999px; border: 1px solid rgba(22, 119, 255, 0.16); font-family: 'SFMono-Regular', Consolas, Menlo, monospace; line-height: 1.4;",
    "code_pre": "display: block; box-sizing: border-box; font-size: 14px; overflow-x: auto; border-radius: 12px 24px 12px 24px; padding: 1.15em 1.2em 1.2em; line-height: 1.6; margin: 1.5em 0; background: linear-gradient(180deg, rgba(22, 119, 255, 0.14) 0px, rgba(5, 212, 205, 0.12) 14px, #f7f8fa 14px, #f7f8fa 100%); border: 1px solid rgba(22, 119, 255, 0.14); border-bottom: 2px solid rgba(5, 212, 205, 0.24); box-shadow: 0 10px 24px rgba(22, 119, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.85); white-space: pre; word-break: normal; overflow-wrap: normal; -webkit-overflow-scrolling: touch; tab-size: 2;",
    "code": "background: none; padding: 0; font-family: 'SFMono-Regular', Consolas, Menlo, monospace; font-size: 14px; color: #1d2129; line-height: 1.6;",
    "ul": "list-style: none; padding: 0; margin: 1.5em 0; color: #4e5969; font-size: 15px;",
    "ol": "list-style: none; padding: 0; margin: 1.5em 0; color: #4e5969; font-size: 15px;",
    "listitem": "margin: 0.5em 0; padding: 0; line-height: 1.6; font-size: 15px;",
    "strong": "color: #1677ff; font-weight: 600;",
    "em": "color: #05d4cd; font-style: italic;",
    "link": "color: #1677ff; text-decoration: none; border-bottom: 1px solid; border-image: linear-gradient(to right, rgba(22, 119, 255, 0), #1677ff, #05d4cd, rgba(5, 212, 205, 0)) 1;",
    "wx_link": "color: #1677ff; text-decoration: none;",
    "hr": "height: 2px; border: none; margin: 2.5em 0; background: linear-gradient(to right, rgba(22, 119, 255, 0), #1677ff, #05d4cd, rgba(5, 212, 205, 0));",
    "table": "width: 100%; border-collapse: collapse; margin: 1.5em 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);",
    "th": "padding: 12px 16px; text-align: left; font-weight: 600; color: #1677ff; border-bottom: 1px solid rgba(5,212,205,0.1); background: linear-gradient(to right, rgba(22,119,255,0.05), rgba(5,212,205,0.05));",
    "td": "padding: 10px 16px; border-bottom: 1px solid rgba(0,0,0,0.05); color: #4e5969;",
    "footnotes": "margin-top: 2em; padding-top: 1.5em; border-top: 1px solid #e5e5e5;",
    "footnote_item": "font-size: 0.9em; color: #8a919f; line-height: 1.6; margin-bottom: 0.3em;",
    "gallery_container": "margin: 1.5em 0 2em; padding: 16px; background: linear-gradient(135deg, rgba(22, 119, 255, 0.02), rgba(255, 255, 255, 0.98)); border: 1px solid rgba(22, 119, 255, 0.15); border-radius: 12px; box-shadow: 0 4px 16px rgba(22, 119, 255, 0.12); position: relative; border-bottom: 3px solid rgba(5, 212, 205, 0.3); backdrop-filter: blur(10px);",
    "gallery_image_container": "background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(22, 119, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9); border: 1px solid rgba(22, 119, 255, 0.08); padding: 8px; margin-bottom: 12px;",
    "gallery_caption": "text-align: center; font-size: 12px; color: #1677ff; margin: 12px 0 0; padding: 10px 16px; background: linear-gradient(135deg, rgba(22, 119, 255, 0.08), rgba(5, 212, 205, 0.06)); border: 1px solid rgba(22, 119, 255, 0.3); border-radius: 8px; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif; font-weight: 600; letter-spacing: 0.8px; box-shadow: 0 3px 12px rgba(22, 119, 255, 0.15); border-bottom: 2px solid rgba(5, 212, 205, 0.4); backdrop-filter: blur(8px);",
    "longimage_container": "margin: 1.5em 0 2em; padding: 16px; background: linear-gradient(135deg, rgba(22, 119, 255, 0.02), rgba(255, 255, 255, 0.98)); border: 1px solid rgba(22, 119, 255, 0.15); border-radius: 12px; box-shadow: 0 4px 16px rgba(22, 119, 255, 0.12); position: relative; border-bottom: 3px solid rgba(5, 212, 205, 0.3); backdrop-filter: blur(10px);",
    "longimage_image_container": "max-height: 420px; overflow-y: auto; border-radius: 8px; background: #ffffff; box-shadow: 0 2px 8px rgba(22, 119, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9); border: 1px solid rgba(22, 119, 255, 0.08); padding: 4px; scrollbar-width: thin; scrollbar-color: rgba(22, 119, 255, 0.4) rgba(5, 212, 205, 0.1);",
    "longimage_caption": "text-align: center; font-size: 12px; color: #1677ff; margin: 12px 0 0; padding: 10px 16px; background: linear-gradient(135deg, rgba(22, 119, 255, 0.08), rgba(5, 212, 205, 0.06)); border: 1px solid rgba(22, 119, 255, 0.3); border-radius: 8px; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif; font-weight: 600; letter-spacing: 0.8px; box-shadow: 0 3px 12px rgba(22, 119, 255, 0.15); border-bottom: 2px solid rgba(5, 212, 205, 0.4); backdrop-filter: blur(8px);",
    "dialogue_container": "margin: 1.5em 0 2em; padding: 1.2em; background: linear-gradient(135deg, rgba(22, 119, 255, 0.02), rgba(255, 255, 255, 0.9)); border: 1px solid rgba(22, 119, 255, 0.15); border-radius: 12px; box-shadow: 0 4px 16px rgba(22, 119, 255, 0.12); position: relative; border-bottom: 3px solid rgba(5, 212, 205, 0.3);",
    "dialogue_title": "text-align: center; font-size: 16px; font-weight: 600; color: #1677ff; margin-bottom: 1em; padding-bottom: 0.8em; border-bottom: 1px solid rgba(22, 119, 255, 0.2); letter-spacing: 0.8px; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif;",
    "dialogue_item": "margin: 0.8em 0; display: flex; align-items: flex-start; font-family: 'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif;",
    "dialogue_avatar_left": "width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #1677ff, rgba(22, 119, 255, 0.8)); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-right: 0.8em; flex-shrink: 0; box-shadow: 0 3px 8px rgba(22, 119, 255, 0.4);",
    "dialogue_avatar_right": "width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #05d4cd, rgba(5, 212, 205, 0.8)); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-left: 0.8em; flex-shrink: 0; box-shadow: 0 3px 8px rgba(5, 212, 205, 0.4);",
    "dialogue_bubble_left": "background: linear-gradient(135deg, rgba(22, 119, 255, 0.08), rgba(22, 119, 255, 0.05)); border: 1px solid rgba(22, 119, 255, 0.15); border-radius: 12px 12px 12px 4px; padding: 0.8em 1em; max-width: 75%; color: #1d2129; line-height: 1.6; font-size: 14px; position: relative; box-shadow: 0 2px 6px rgba(22, 119, 255, 0.1);",
    "dialogue_bubble_right": "background: linear-gradient(135deg, rgba(5, 212, 205, 0.08), rgba(5, 212, 205, 0.05)); border: 1px solid rgba(5, 212, 205, 0.15); border-radius: 12px 12px 4px 12px; padding: 0.8em 1em; max-width: 75%; color: #1d2129; line-height: 1.6; font-size: 14px; margin-left: auto; box-shadow: 0 2px 6px rgba(5, 212, 205, 0.1);",
    "dialogue_item_left": "margin: 0.8em 0; display: flex; align-items: flex-start; justify-content: flex-start;",
    "dialogue_item_right": "margin: 0.8em 0; display: flex; align-items: flex-start; justify-content: flex-end; flex-direction: row-reverse;"
  },
  "apple": {
    "container": "max-width: 677px; margin: 0 auto; padding: 16px; background-color: #ffffff; font-family: 'SF Pro Display', 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif; color: #1d1d1f; line-height: 1.7; font-size: 15px; border-radius: 12px;",
    "h1": "padding: 0.8em 1.5em; margin: 1.4em 0 1em; font-size: 22px; font-weight: 700; text-align: center; letter-spacing: 0.1em; line-height: 1.2; background: linear-gradient(135deg, #007aff 0%, #5856d6 50%, #ff2d55 100%); color: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,122,255,0.2);",
    "h2": "padding: 0.4em 0 0.5em 0.8em; margin: 1.8em 0 1em; color: #1d1d1f; font-size: 20px; font-weight: 600; text-align: left; border-left: 3px solid; border-image: linear-gradient(to bottom, #007aff, #5856d6) 1;",
    "h3": "padding: 0.3em 0 0.4em 0.7em; margin: 1.6em 0 0.8em; color: #1d1d1f; font-size: 18px; font-weight: 600; text-align: left; border-left: 2px solid; border-image: linear-gradient(to bottom, #34c759, #5856d6) 1;",
    "h4": "padding: 0.2em 0 0.2em 0.6em; margin: 1.5em 0 0.8em; color: #1d1d1f; font-size: 16px; font-weight: 600; text-align: left; border-left: 2px solid #ffcc00;",
    "h5": "padding: 0.1em 0 0.1em 0.5em; margin: 1.2em 0 0.6em; color: #333333; font-size: 15px; font-weight: 600; text-align: left; border-left: 2px solid #ff9500;",
    "h6": "padding: 0.1em 0 0.1em 0.5em; margin: 1em 0 0.5em; color: #666666; font-size: 14px; font-weight: 600; text-align: left; border-left: 2px solid #8e8e93;",
    "p": "margin: 1.2em 0; letter-spacing: 0.1em; color: #333333; text-align: justify; line-height: 1.8; font-size: 15px;",
    "image": "max-width: 100%; border-radius: 8px; margin: 1.5em auto; display: block; box-shadow: 0 8px 25px rgba(0,0,0,0.1);",
    "figure": "margin: 1.5em 0; text-align: center; line-height: 1.6; font-size: 15px; color: #555555;",
    "figcaption": "text-align: center; font-size: 0.9em; color: #888888; margin-top: 0.8em;",
    "blockquote": "font-style: normal; padding: 1em 1.2em; border-left: 4px solid; border-image: linear-gradient(to bottom, #007aff, #5856d6, #ff2d55) 1; color: #333333; background: rgba(0,0,0,0.02); border-radius: 8px; margin: 1.5em 0;",
    "blockquote_p": "margin: 0; color: #333333; line-height: 1.7;",
    "blockquote_note": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(0, 122, 255, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #007aff; border: 1px solid rgba(0, 122, 255, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_tip": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(52, 199, 89, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #34c759; border: 1px solid rgba(52, 199, 89, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_important": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(88, 86, 214, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #5856d6; border: 1px solid rgba(88, 86, 214, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_warning": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(255, 149, 0, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #ff9500; border: 1px solid rgba(255, 149, 0, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_caution": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(255, 45, 85, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #ff2d55; border: 1px solid rgba(255, 45, 85, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_title": "font-weight: 600; margin-bottom: 0.8em; font-size: 1.05em; letter-spacing: -0.01em;",
    "blockquote_title_note": "color: #007aff;",
    "blockquote_title_tip": "color: #34c759;",
    "blockquote_title_important": "color: #5856d6;",
    "blockquote_title_warning": "color: #ff9500;",
    "blockquote_title_caution": "color: #ff2d55;",
    "blockquote_p_note": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_tip": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_important": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_warning": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_caution": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "codespan": "display: inline-block; font-size: 90%; color: #4f46cf; background: linear-gradient(180deg, rgba(88, 86, 214, 0.12), rgba(255, 255, 255, 0.9)); padding: 2px 7px; border-radius: 999px; border: 1px solid rgba(88, 86, 214, 0.14); font-family: 'SFMono-Regular', Consolas, Menlo, monospace; line-height: 1.4; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);",
    "code_pre": "display: block; box-sizing: border-box; font-size: 14px; overflow-x: auto; border-radius: 18px; padding: 1.15em 1.2em 1.2em; line-height: 1.6; margin: 1.5em 0; background: linear-gradient(180deg, rgba(0, 122, 255, 0.1) 0px, rgba(88, 86, 214, 0.08) 12px, rgba(251, 251, 253, 0.94) 12px, rgba(251, 251, 253, 0.98) 100%); border: 1px solid rgba(255, 255, 255, 0.92); box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(88, 86, 214, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.92); white-space: pre; word-break: normal; overflow-wrap: normal; -webkit-overflow-scrolling: touch; tab-size: 2; backdrop-filter: blur(18px);",
    "code": "background: none; padding: 0; font-family: 'SFMono-Regular', Consolas, Menlo, monospace; font-size: 14px; color: #111827; line-height: 1.6;",
    "ul": "list-style: none; padding: 0; margin: 1.2em 0; color: #333333; font-size: 15px;",
    "ol": "list-style: none; padding: 0; margin: 1.2em 0; color: #333333; font-size: 15px;",
    "listitem": "margin: 0.4em 0; padding: 0; line-height: 1.7; font-size: 15px;",
    "strong": "font-weight: 600; background-image: linear-gradient(135deg, #007aff, #5856d6); -webkit-background-clip: text; background-clip: text; color: transparent;",
    "em": "color: #333333; font-style: italic;",
    "link": "color: #007aff; text-decoration: none; border-bottom: 1px solid; border-image: linear-gradient(to right, rgba(0, 122, 255, 0), #007aff, #5856d6, #ff2d55, rgba(255, 45, 85, 0)) 1; transition: color 0.3s ease;",
    "wx_link": "color: #007aff; text-decoration: none;",
    "hr": "height: 2px; border: none; margin: 2.5em 0; background-image: linear-gradient(to right, rgba(0, 122, 255, 0), #007aff, #5856d6, #ff2d55, rgba(255, 45, 85, 0));",
    "table": "width: 100%; border-collapse: collapse; margin: 1.5em 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);",
    "th": "padding: 12px 15px; text-align: left; font-weight: 600; color: #1d1d1f; border-bottom: 1.5px solid rgba(0,0,0,0.1); background: #fbfbfd;",
    "td": "padding: 10px 15px; border-bottom: 1px solid rgba(0,0,0,0.05); color: #333333;",
    "footnotes": "margin-top: 2.5em; padding-top: 1.8em; border-top: 1px solid #e5e5e5;",
    "footnote_item": "font-size: 0.85em; color: #888888; line-height: 1.6; margin-bottom: 0.3em;",
    "gallery_container": "margin: 1.5em 0 2em; padding: 16px; background: linear-gradient(135deg, rgba(0, 122, 255, 0.02), rgba(255, 255, 255, 0.98)); border: 1px solid rgba(0, 122, 255, 0.1); border-radius: 16px; box-shadow: 0 8px 25px rgba(0, 122, 255, 0.08), 0 3px 8px rgba(88, 86, 214, 0.06); position: relative; backdrop-filter: blur(20px);",
    "gallery_image_container": "background: #fbfbfd; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 122, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9); border: 1px solid rgba(0, 122, 255, 0.06); padding: 8px; margin-bottom: 14px;",
    "gallery_caption": "text-align: center; font-size: 12px; color: #ffffff; margin: 14px 0 0; padding: 12px 20px; background: linear-gradient(135deg, #007aff 0%, #5856d6 50%, #ff2d55 100%); border: none; border-radius: 16px; font-weight: 700; box-shadow: 0 6px 20px rgba(0, 122, 255, 0.25), 0 2px 6px rgba(88, 86, 214, 0.15); font-family: 'SF Pro Display', 'Helvetica Neue', 'PingFang SC', sans-serif; letter-spacing: 0.6px; backdrop-filter: blur(20px);",
    "longimage_container": "margin: 1.5em 0 2em; padding: 16px; background: linear-gradient(135deg, rgba(0, 122, 255, 0.02), rgba(255, 255, 255, 0.98)); border: 1px solid rgba(0, 122, 255, 0.1); border-radius: 16px; box-shadow: 0 8px 25px rgba(0, 122, 255, 0.08), 0 3px 8px rgba(88, 86, 214, 0.06); position: relative; backdrop-filter: blur(20px);",
    "longimage_image_container": "max-height: 420px; overflow-y: auto; border-radius: 12px; background: #fbfbfd; box-shadow: 0 4px 15px rgba(0, 122, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9); border: 1px solid rgba(0, 122, 255, 0.06); padding: 6px; scrollbar-width: thin; scrollbar-color: rgba(0, 122, 255, 0.3) rgba(251, 251, 253, 0.5);",
    "longimage_caption": "text-align: center; font-size: 12px; color: #ffffff; margin: 14px 0 0; padding: 12px 20px; background: linear-gradient(135deg, #007aff 0%, #5856d6 50%, #ff2d55 100%); border: none; border-radius: 16px; font-weight: 700; box-shadow: 0 6px 20px rgba(0, 122, 255, 0.25), 0 2px 6px rgba(88, 86, 214, 0.15); font-family: 'SF Pro Display', 'Helvetica Neue', 'PingFang SC', sans-serif; letter-spacing: 0.6px; backdrop-filter: blur(20px);",
    "dialogue_container": "margin: 1.5em 0 2em; padding: 1.2em; background: linear-gradient(135deg, rgba(0, 122, 255, 0.02), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(0, 122, 255, 0.1); border-radius: 16px; box-shadow: 0 8px 25px rgba(0, 122, 255, 0.08), 0 3px 8px rgba(88, 86, 214, 0.06); position: relative; backdrop-filter: blur(20px);",
    "dialogue_title": "text-align: center; font-size: 16px; font-weight: 700; background: linear-gradient(135deg, #007aff, #5856d6); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 1em; padding-bottom: 0.8em; border-bottom: 1px solid rgba(0, 122, 255, 0.15); letter-spacing: -0.01em; font-family: 'SF Pro Display', 'Helvetica Neue', 'PingFang SC', sans-serif;",
    "dialogue_item": "margin: 0.8em 0; display: flex; align-items: flex-start; font-family: 'SF Pro Display', 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;",
    "dialogue_avatar_left": "width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #007aff, #5856d6); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-right: 0.8em; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);",
    "dialogue_avatar_right": "width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #5856d6, #ff2d55); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-left: 0.8em; flex-shrink: 0; box-shadow: 0 4px 12px rgba(88, 86, 214, 0.4);",
    "dialogue_bubble_left": "background: linear-gradient(135deg, rgba(0, 122, 255, 0.06), rgba(0, 122, 255, 0.03)); border: 1px solid rgba(0, 122, 255, 0.12); border-radius: 16px 16px 16px 4px; padding: 0.8em 1em; max-width: 75%; color: #1d1d1f; line-height: 1.7; font-size: 14px; position: relative; box-shadow: 0 2px 8px rgba(0, 122, 255, 0.08); backdrop-filter: blur(10px);",
    "dialogue_bubble_right": "background: linear-gradient(135deg, rgba(251, 251, 253, 0.9), rgba(251, 251, 253, 0.7)); border: 1px solid rgba(0, 122, 255, 0.08); border-radius: 16px 16px 4px 16px; padding: 0.8em 1em; max-width: 75%; color: #1d1d1f; line-height: 1.7; font-size: 14px; margin-left: auto; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); backdrop-filter: blur(10px);",
    "dialogue_item_left": "margin: 0.8em 0; display: flex; align-items: flex-start; justify-content: flex-start;",
    "dialogue_item_right": "margin: 0.8em 0; display: flex; align-items: flex-start; justify-content: flex-end; flex-direction: row-reverse;"
  },
  "sports": {
    "container": "max-width: 677px; margin: 0 auto; padding: 12px; background-color: #ffffff; font-family: 'Titillium Web', 'SF Pro Display', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif; color: #2c2c2c; line-height: 1.7; font-size: 15px; border-radius: 16px;",
    "h1": "padding: 0.6em 1.5em; margin: 2.2em 0 1.2em; color: #ffffff; font-size: 22px; font-weight: 700; text-align: center; letter-spacing: 0.12em; line-height: 1.4; background: linear-gradient(120deg, #00A968, #008A56, #00A968, #00A968); border-radius: 50px; box-shadow: 0 8px 20px rgba(0, 169, 104, 0.3); text-transform: uppercase; font-family: 'Titillium Web', sans-serif;",
    "h2": "padding: 0.4em 1em 0.5em 1em; margin: 1.6em 0 0.8em; font-size: 20px; font-weight: 600; text-align: left; letter-spacing: 0.06em; line-height: 1.4; color: #00A968; background: linear-gradient(to right, rgba(0, 169, 104, 0.05), rgba(56, 198, 244, 0.05)); border-left: 4px solid; border-image: linear-gradient(to bottom, #FF6600, #00A968, #38C6F4) 1; border-radius: 0 12px 12px 0; box-shadow: 0 3px 8px rgba(0, 169, 104, 0.12); text-transform: uppercase; font-family: 'Titillium Web', sans-serif;",
    "h3": "padding: 0.4em 1.2em; margin: 1.8em 0 1em; color: #00A968; font-size: 18px; font-weight: 600; text-align: left; letter-spacing: 0.08em; border-left: 4px solid; border-image: linear-gradient(to bottom, #FF6600, #00A968, #38C6F4) 1; background: linear-gradient(to right, rgba(255, 102, 0, 0.05), rgba(0, 169, 104, 0.05)); border-radius: 0 25px 25px 0; font-family: 'Titillium Web', sans-serif;",
    "h4": "padding: 0.3em 1em; margin: 1.6em 0 0.8em; color: #00A968; font-size: 16px; font-weight: 600; text-align: left; letter-spacing: 0.06em; border-left: 3px solid; border-image: linear-gradient(to bottom, #FF6600, #00A968, #38C6F4) 1; background: rgba(56, 198, 244, 0.08); border-radius: 0 20px 20px 0; font-family: 'Titillium Web', sans-serif;",
    "h5": "padding: 0.2em 0.8em; margin: 1.4em 0 0.6em; color: #00A968; font-size: 15px; font-weight: 600; text-align: left; letter-spacing: 0.04em; border-left: 2px solid; border-image: linear-gradient(to bottom, #FF6600, #00A968, #38C6F4) 1; font-family: 'Titillium Web', sans-serif;",
    "h6": "padding: 0.1em 0.6em; margin: 1.2em 0 0.5em; color: #00A968; font-size: 14px; font-weight: 600; text-align: left; border-left: 2px solid; border-image: linear-gradient(to bottom, #FF6600, #00A968, #38C6F4) 1; font-family: 'Titillium Web', sans-serif;",
    "p": "margin: 1.3em 0; letter-spacing: 0.02em; color: #2c2c2c; text-align: justify; line-height: 1.8; font-size: 15px;",
    "image": "max-width: 100%; border-radius: 16px; margin: 1.8em auto; display: block; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(255, 102, 0, 0.1); border: 2px solid transparent; background: linear-gradient(white, white) padding-box, linear-gradient(135deg, #FF6600, #00A968, #38C6F4) border-box;",
    "figure": "margin: 1.8em 0; text-align: center; line-height: 1.6; font-size: 15px; color: #555555;",
    "figcaption": "text-align: center; font-size: 0.9em; color: #777777; margin-top: 1em; font-style: italic;",
    "blockquote": "font-style: normal; padding: 1.2em 1.5em; border-left: 5px solid; border-image: linear-gradient(to bottom, #FF6600, #00A968, #38C6F4) 1; color: #3c3c3e; background: #f8f8f8; border-radius: 0 8px 8px 0; margin: 1.8em 0;",
    "blockquote_p": "margin: 0; color: #3c3c3e; line-height: 1.8;",
    "blockquote_note": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(56, 198, 244, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #38C6F4; border: 1px solid rgba(56, 198, 244, 0.3); border-radius: 0 12px 12px 0; color: rgb(60, 60, 60);",
    "blockquote_tip": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(0, 169, 104, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #00A968; border: 1px solid rgba(0, 169, 104, 0.3); border-radius: 0 12px 12px 0; color: rgb(60, 60, 60);",
    "blockquote_important": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(255, 102, 0, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid; border-image: linear-gradient(to bottom, #FF6600, #00A968) 1; border-radius: 0 12px 12px 0; color: rgb(60, 60, 60);",
    "blockquote_warning": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(255, 102, 0, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #FF6600; border: 1px solid rgba(255, 102, 0, 0.3); border-radius: 0 12px 12px 0; color: rgb(60, 60, 60);",
    "blockquote_caution": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(255, 102, 0, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #FF6600; border: 1px solid rgba(255, 102, 0, 0.3); border-radius: 0 12px 12px 0; color: rgb(60, 60, 60);",
    "blockquote_title": "font-weight: 700; margin-bottom: 0.8em; font-size: 1.08em; letter-spacing: 0.06em; text-transform: uppercase; font-family: 'Titillium Web', sans-serif;",
    "blockquote_title_note": "color: #38C6F4;",
    "blockquote_title_tip": "color: #00A968;",
    "blockquote_title_important": "color: #00A968;",
    "blockquote_title_warning": "color: #FF6600;",
    "blockquote_title_caution": "color: #FF6600;",
    "blockquote_p_note": "margin: 0; color: rgb(60, 60, 60); line-height: 1.8;",
    "blockquote_p_tip": "margin: 0; color: rgb(60, 60, 60); line-height: 1.8;",
    "blockquote_p_important": "margin: 0; color: rgb(60, 60, 60); line-height: 1.8;",
    "blockquote_p_warning": "margin: 0; color: rgb(60, 60, 60); line-height: 1.8;",
    "blockquote_p_caution": "margin: 0; color: rgb(60, 60, 60); line-height: 1.8;",
    "codespan": "display: inline-block; font-size: 90%; color: #008a56; background: linear-gradient(135deg, rgba(255, 102, 0, 0.12), rgba(0, 169, 104, 0.12), rgba(56, 198, 244, 0.12)); padding: 2px 8px; border-radius: 999px; border: 1px solid rgba(0, 169, 104, 0.16); font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, Menlo, monospace; line-height: 1.4; font-weight: 600;",
    "code_pre": "display: block; box-sizing: border-box; font-size: 14px; overflow-x: auto; border-radius: 18px 28px 18px 28px; padding: 1.15em 1.2em 1.2em; line-height: 1.65; margin: 1.5em 0; background: linear-gradient(135deg, rgba(255, 102, 0, 0.16) 0px, rgba(0, 169, 104, 0.14) 16px, rgba(56, 198, 244, 0.12) 32px, #ffffff 32px, #ffffff 100%); border: 1px solid rgba(0, 169, 104, 0.16); box-shadow: 0 14px 30px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.9); white-space: pre; word-break: normal; overflow-wrap: normal; -webkit-overflow-scrolling: touch; tab-size: 2;",
    "code": "background: none; padding: 0; font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, Menlo, monospace; font-size: 14px; color: #1f2937; line-height: 1.65;",
    "ul": "list-style: none; padding: 0; margin: 1.5em 0; color: #2c2c2c; font-size: 15px;",
    "ol": "list-style: none; padding: 0; margin: 1.5em 0; color: #2c2c2c; font-size: 15px;",
    "listitem": "margin: 0.6em 0; padding: 0; line-height: 1.8; font-size: 15px;",
    "strong": "font-weight: 700; background: linear-gradient(135deg, #00A968, #008A56, #00A968, #00A968); -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: none;",
    "em": "color: #00A968; font-style: italic; font-weight: 500;",
    "link": "background: linear-gradient(135deg, #00A968, #008A56, #00A968, #00A968); -webkit-background-clip: text; background-clip: text; color: transparent; text-decoration: none; border-bottom: 1px solid; border-image: linear-gradient(to right, rgba(255, 102, 0, 0), #FF6600, #00A968, #38C6F4, rgba(56, 198, 244, 0)) 1; transition: all 0.3s ease;",
    "wx_link": "color: #00A968; text-decoration: none;",
    "hr": "height: 3px; border: none; margin: 3em 0; background-image: linear-gradient(to right, rgba(255, 102, 0, 0), #FF6600, #00A968, #38C6F4, rgba(56, 198, 244, 0));",
    "table": "width: 100%; border-collapse: collapse; margin: 1.8em 0; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); border: 2px solid transparent; background: linear-gradient(white, white) padding-box, linear-gradient(135deg, #FF6600, #00A968, #38C6F4) border-box;",
    "th": "padding: 12px 16px; text-align: left; font-weight: 700; background: linear-gradient(135deg, rgba(255, 102, 0, 0.1), rgba(0, 169, 104, 0.1)); color: #00A968; border-bottom: 2px solid rgba(255, 102, 0, 0.2); font-family: 'Titillium Web', sans-serif; text-transform: uppercase; letter-spacing: 0.04em;",
    "td": "padding: 10px 16px; border-bottom: 1px solid rgba(0, 0, 0, 0.08); color: #2c2c2c;",
    "footnotes": "margin-top: 2.5em; padding-top: 1.8em; border-top: 2px solid transparent; border-image: linear-gradient(to right, #FF6600, #00A968, #38C6F4) 1;",
    "footnote_item": "font-size: 0.9em; color: #00A968; line-height: 1.6; margin-bottom: 0.4em;",
    "gallery_container": "margin: 1.5em 0 2em; padding: 16px; background: linear-gradient(135deg, rgba(255, 102, 0, 0.02), rgba(255, 255, 255, 0.98)); border: 2px solid transparent; border-radius: 16px; box-shadow: 0 8px 25px rgba(255, 102, 0, 0.12), 0 4px 12px rgba(0, 169, 104, 0.08); position: relative; background-clip: padding-box; background-image: linear-gradient(white, white), linear-gradient(135deg, #FF6600, #00A968, #38C6F4); background-origin: border-box;",
    "gallery_image_container": "background: #ffffff; border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9); border: 2px solid transparent; padding: 8px; margin-bottom: 14px; background-clip: padding-box; background-image: linear-gradient(white, white), linear-gradient(135deg, #FF6600, #00A968, #38C6F4); background-origin: border-box;",
    "gallery_caption": "text-align: center; font-size: 12px; color: #ffffff; margin: 14px 0 0; padding: 14px 20px; background: linear-gradient(135deg, #FF6600 0%, #00A968 50%, #38C6F4 100%); border: none; border-radius: 50px; font-weight: 700; box-shadow: 0 8px 25px rgba(255, 102, 0, 0.3), 0 4px 12px rgba(0, 169, 104, 0.2); font-family: 'Titillium Web', sans-serif; letter-spacing: 0.08em; text-transform: uppercase; backdrop-filter: blur(10px);",
    "longimage_container": "margin: 1.5em 0 2em; padding: 16px; background: linear-gradient(135deg, rgba(255, 102, 0, 0.02), rgba(255, 255, 255, 0.98)); border: 2px solid transparent; border-radius: 16px; box-shadow: 0 8px 25px rgba(255, 102, 0, 0.12), 0 4px 12px rgba(0, 169, 104, 0.08); position: relative; background-clip: padding-box; background-image: linear-gradient(white, white), linear-gradient(135deg, #FF6600, #00A968, #38C6F4); background-origin: border-box;",
    "longimage_image_container": "max-height: 420px; overflow-y: auto; border-radius: 12px; background: #ffffff; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9); border: 2px solid transparent; padding: 6px; background-clip: padding-box; background-image: linear-gradient(white, white), linear-gradient(135deg, #FF6600, #00A968, #38C6F4); background-origin: border-box; scrollbar-width: thin; scrollbar-color: rgba(255, 102, 0, 0.4) rgba(0, 169, 104, 0.1);",
    "longimage_caption": "text-align: center; font-size: 12px; color: #ffffff; margin: 14px 0 0; padding: 14px 20px; background: linear-gradient(135deg, #FF6600 0%, #00A968 50%, #38C6F4 100%); border: none; border-radius: 50px; font-weight: 700; box-shadow: 0 8px 25px rgba(255, 102, 0, 0.3), 0 4px 12px rgba(0, 169, 104, 0.2); font-family: 'Titillium Web', sans-serif; letter-spacing: 0.08em; text-transform: uppercase; backdrop-filter: blur(10px);",
    "dialogue_container": "margin: 1.5em 0 2em; padding: 16px; background: linear-gradient(135deg, rgba(255, 102, 0, 0.02), rgba(255, 255, 255, 0.98)); border: 2px solid transparent; border-radius: 16px; box-shadow: 0 8px 25px rgba(255, 102, 0, 0.12), 0 4px 12px rgba(0, 169, 104, 0.08); position: relative; background-clip: padding-box; background-image: linear-gradient(white, white), linear-gradient(135deg, #FF6600, #00A968, #38C6F4); background-origin: border-box;",
    "dialogue_title": "text-align: center; font-size: 16px; font-weight: 700; background: linear-gradient(135deg, #FF6600, #00A968, #38C6F4); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 1em; padding-bottom: 0.8em; border-bottom: 2px solid transparent; border-image: linear-gradient(to right, #FF6600, #00A968, #38C6F4) 1; letter-spacing: 0.06em; text-transform: uppercase; font-family: 'Titillium Web', sans-serif;",
    "dialogue_item": "margin: 0.8em 0; display: flex; align-items: flex-start; font-family: 'Titillium Web', 'SF Pro Display', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;",
    "dialogue_avatar_left": "width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #FF6600, #00A968); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-right: 0.8em; flex-shrink: 0; box-shadow: 0 4px 15px rgba(255, 102, 0, 0.4); border: 2px solid rgba(255, 255, 255, 0.3);",
    "dialogue_avatar_right": "width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #00A968, #38C6F4); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-left: 0.8em; flex-shrink: 0; box-shadow: 0 4px 15px rgba(0, 169, 104, 0.4); border: 2px solid rgba(255, 255, 255, 0.3);",
    "dialogue_bubble_left": "background: linear-gradient(135deg, rgba(255, 102, 0, 0.08), rgba(255, 102, 0, 0.04)); border: 1px solid rgba(255, 102, 0, 0.2); border-radius: 16px 16px 16px 4px; padding: 0.8em 1em; max-width: 75%; color: #1a1a1a; line-height: 1.8; font-size: 14px; position: relative; box-shadow: 0 3px 10px rgba(255, 102, 0, 0.15);",
    "dialogue_bubble_right": "background: linear-gradient(135deg, rgba(0, 169, 104, 0.08), rgba(56, 198, 244, 0.04)); border: 1px solid rgba(0, 169, 104, 0.2); border-radius: 16px 16px 4px 16px; padding: 0.8em 1em; max-width: 75%; color: #1a1a1a; line-height: 1.8; font-size: 14px; margin-left: auto; box-shadow: 0 3px 10px rgba(0, 169, 104, 0.15);",
    "dialogue_item_left": "margin: 0.8em 0; display: flex; align-items: flex-start; justify-content: flex-start;",
    "dialogue_item_right": "margin: 0.8em 0; display: flex; align-items: flex-start; justify-content: flex-end; flex-direction: row-reverse;"
  },
  "chinese": {
    "container": "max-width: 677px; margin: 0 auto; padding: 8px; background-color: #f8f4e9; font-family: 'KaiTi', 'STKaiti', 'SimSun', serif; color: #333; line-height: 2; font-size: 15px;",
    "h1": "display: block; padding: 0.8em 1.5em; margin: 1.5em auto 1.5em; color: #8b1e22; font-size: 22px; font-weight: bold; text-align: center; letter-spacing: 0.1em; line-height: 1.2; width: 80%; background-image: repeating-linear-gradient(45deg, rgba(139,30,34,0.03), rgba(139,30,34,0.03) 2px, transparent 2px, transparent 8px); border-top: 2px solid #8b1e22; border-bottom: 2px solid #8b1e22;",
    "h2": "margin: 2em 0 0.75em 0px; padding: 0px 0px 0.5em 12px; border-left: 4px solid #8b1e22; border-bottom: 1px dashed rgba(139,30,34,0.4); font-size: 20px; font-weight: bold; line-height: 1.2; color: #8b1e22; letter-spacing: 0.1em; font-family: 'KaiTi', 'STKaiti', 'SimSun', serif;",
    "h3": "padding: 0px 0px 0.4em 12px; font-size: 18px; line-height: 1.6; margin: 2em 0 0.75em; font-weight: 600; color: #8b1e22; text-shadow: 1px 1px 1px rgba(255,255,255,0.7); border-left: 4px solid #8b1e22; border-bottom: 1px dashed rgba(139,30,34,0.4);",
    "h4": "margin: 1.5em 0 0.8em; color: #8b1e22; font-size: 16px; font-weight: bold; padding: 0.3em 0 0.3em 12px; letter-spacing: 0.1em; font-family: 'KaiTi', 'STKaiti', serif; border-left: 4px solid #8b1e22; border-bottom: 1px dashed rgba(139,30,34,0.3);",
    "h5": "margin: 1.5em 0 0.5em; color: #8b1e22; font-size: 15px; font-weight: bold; font-family: 'KaiTi', 'STKaiti', serif; padding-left: 8px; border-left: 3px solid #8b1e22;",
    "h6": "margin: 1.5em 0 0.5em; color: #8b1e22; font-size: 14px; font-weight: bold; font-family: 'KaiTi', 'STKaiti', serif; padding-left: 6px; border-left: 2px solid #8b1e22;",
    "p": "margin: 1.2em 0; letter-spacing: 0.1em; color: #333; text-align: justify; line-height: 2; font-size: 15px;",
    "image": "max-width: 100%; margin: 1.5em auto; display: block; border: 8px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);",
    "figure": "margin: 1.5em 0;",
    "figcaption": "text-align: center; font-size: 0.9em; color: #666; font-family: 'KaiTi', 'STKaiti', serif;",
    "blockquote": "font-style: normal; padding: 0.5em 1em; border-left: 4px solid #891e22; color: #666; background: rgba(139, 30, 34, 0.03); margin: 1.2em 0;",
    "blockquote_p": "margin: 0; color: #666; line-height: 2; text-indent: 0;",
    "codespan": "display: inline-block; font-size: 90%; color: #8b1e22; background: linear-gradient(180deg, rgba(139, 30, 34, 0.1), rgba(248, 244, 233, 0.88)); padding: 2px 7px; border-radius: 6px; border: 1px solid rgba(139, 30, 34, 0.16); font-family: 'Source Code Pro', monospace; line-height: 1.4;",
    "code_pre": "display: block; box-sizing: border-box; background: repeating-linear-gradient(45deg, rgba(139, 30, 34, 0.015) 0px, rgba(139, 30, 34, 0.015) 6px, transparent 6px, transparent 14px), linear-gradient(180deg, rgba(139, 30, 34, 0.1) 0px, rgba(139, 30, 34, 0.1) 12px, #faf8f5 12px, #faf8f5 100%); border: 1px solid rgba(139, 30, 34, 0.18); border-radius: 14px; padding: 1.15em 1.2em 1.2em; margin: 1.5em 0; overflow-x: auto; font-size: 14px; line-height: 1.65; font-family: 'Source Code Pro', monospace; box-shadow: 0 8px 20px rgba(139, 30, 34, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.75); white-space: pre; word-break: normal; overflow-wrap: normal; -webkit-overflow-scrolling: touch; tab-size: 2;",
    "code": "background: none; padding: 0; font-family: 'Source Code Pro', monospace; font-size: 14px; color: #302826; line-height: 1.65;",
    "ul": "list-style: none; padding: 0; margin: 1em 0; font-size: 15px;",
    "ol": "list-style: none; padding: 0; margin: 1em 0; font-size: 15px;",
    "listitem": "margin: 0.5em 0; padding: 0; line-height: 1.8; font-size: 15px;",
    "strong": "color: #8b1e22; font-weight: bold;",
    "em": "color: #555; font-style: italic; font-family: 'KaiTi', 'STKaiti', serif;",
    "link": "color: #8b1e22; text-decoration: none; border-bottom: 1px solid rgba(139,30,34,0.3);",
    "wx_link": "color: #8b1e22; text-decoration: none;",
    "hr": "height: 1px; border: none; margin: 2.5em auto; background: linear-gradient(to right, rgba(139,30,34,0), rgba(139,30,34,0.5), rgba(139,30,34,0)); width: 80%; text-align: center; color: #8b1e22; font-size: 1.2em;",
    "table": "width: 100%; border-collapse: collapse; margin: 1.5em 0; border: 1px solid rgba(139,30,34,0.3);",
    "th": "background: linear-gradient(to bottom, rgba(139,30,34,0.15), rgba(139,30,34,0.05)); padding: 0.8em; text-align: left; font-weight: bold; border-bottom: 2px solid rgba(139,30,34,0.5);",
    "td": "padding: 0.8em; border-bottom: 1px solid rgba(139,30,34,0.1);",
    "footnotes": "margin-top: 2em; padding-top: 1.5em; border-top: 1px solid rgba(139,30,34,0.2);",
    "footnote_item": "font-size: 0.9em; color: #666; line-height: 1.6; margin-bottom: 0.3em;",
    "blockquote_note": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #8b1e22; background: linear-gradient(135deg, rgba(139, 30, 34, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(139, 30, 34, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_tip": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #5c8a3a; background: linear-gradient(135deg, rgba(92, 138, 58, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(92, 138, 58, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_important": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #9c4221; background: linear-gradient(135deg, rgba(156, 66, 33, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(156, 66, 33, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_warning": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #c5722e; background: linear-gradient(135deg, rgba(197, 114, 46, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(197, 114, 46, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_caution": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; border-left: 4px solid #d74545; background: linear-gradient(135deg, rgba(215, 69, 69, 0.08), rgba(255, 255, 255, 0.95)); border: 1px solid rgba(215, 69, 69, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_title": "font-weight: 600; margin-bottom: 0.8em; font-size: 1.05em; letter-spacing: 0.1em; font-family: 'KaiTi', 'STKaiti', 'SimSun', serif;",
    "blockquote_title_note": "color: #8b1e22;",
    "blockquote_title_tip": "color: #5c8a3a;",
    "blockquote_title_important": "color: #9c4221;",
    "blockquote_title_warning": "color: #c5722e;",
    "blockquote_title_caution": "color: #d74545;",
    "blockquote_p_note": "margin: 0; color: rgb(60, 60, 60); line-height: 1.8;",
    "blockquote_p_tip": "margin: 0; color: rgb(60, 60, 60); line-height: 1.8;",
    "blockquote_p_important": "margin: 0; color: rgb(60, 60, 60); line-height: 1.8;",
    "blockquote_p_warning": "margin: 0; color: rgb(60, 60, 60); line-height: 1.8;",
    "blockquote_p_caution": "margin: 0; color: rgb(60, 60, 60); line-height: 1.8;",
    "gallery_container": "margin: 1.5em 0 2em; padding: 18px; background: linear-gradient(135deg, rgba(139, 30, 34, 0.02), rgba(248, 244, 233, 0.95)); border: 2px solid rgba(139, 30, 34, 0.2); border-radius: 8px; box-shadow: 0 4px 16px rgba(139, 30, 34, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5); position: relative; background-image: repeating-linear-gradient(45deg, rgba(139,30,34,0.01), rgba(139,30,34,0.01) 1px, transparent 1px, transparent 12px);",
    "gallery_image_container": "background: #ffffff; border-radius: 6px; box-shadow: 0 2px 8px rgba(139, 30, 34, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8); border: 4px solid #ffffff; padding: 8px; margin-bottom: 15px; position: relative;",
    "gallery_caption": "text-align: center; font-size: 12px; color: #8b1e22; margin: 15px 0 0; padding: 12px 18px; background: linear-gradient(135deg, rgba(139, 30, 34, 0.04), rgba(248, 244, 233, 0.9)); border: 3px solid #ffffff; border-radius: 6px; letter-spacing: 0.2em; font-family: 'KaiTi', 'STKaiti', 'SimSun', serif; font-weight: bold; box-shadow: 0 4px 16px rgba(139, 30, 34, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.7); background-image: repeating-linear-gradient(45deg, rgba(139,30,34,0.02), rgba(139,30,34,0.02) 1px, transparent 1px, transparent 6px);",
    "longimage_container": "margin: 1.5em 0 2em; padding: 18px; background: linear-gradient(135deg, rgba(139, 30, 34, 0.02), rgba(248, 244, 233, 0.95)); border: 2px solid rgba(139, 30, 34, 0.2); border-radius: 8px; box-shadow: 0 4px 16px rgba(139, 30, 34, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5); position: relative; background-image: repeating-linear-gradient(45deg, rgba(139,30,34,0.01), rgba(139,30,34,0.01) 1px, transparent 1px, transparent 12px);",
    "longimage_image_container": "max-height: 420px; overflow-y: auto; border-radius: 6px; background: #ffffff; box-shadow: 0 2px 8px rgba(139, 30, 34, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8); border: 4px solid #ffffff; padding: 6px; position: relative; scrollbar-width: thin; scrollbar-color: rgba(139, 30, 34, 0.4) rgba(248, 244, 233, 0.3);",
    "longimage_caption": "text-align: center; font-size: 12px; color: #8b1e22; margin: 15px 0 0; padding: 12px 18px; background: linear-gradient(135deg, rgba(139, 30, 34, 0.04), rgba(248, 244, 233, 0.9)); border: 3px solid #ffffff; border-radius: 6px; letter-spacing: 0.2em; font-family: 'KaiTi', 'STKaiti', 'SimSun', serif; font-weight: bold; box-shadow: 0 4px 16px rgba(139, 30, 34, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.7); background-image: repeating-linear-gradient(45deg, rgba(139,30,34,0.02), rgba(139,30,34,0.02) 1px, transparent 1px, transparent 6px);",
    "dialogue_container": "margin: 1.5em 0 2em; padding: 1.2em; background: linear-gradient(135deg, rgba(139, 30, 34, 0.02), rgba(248, 244, 233, 0.9)); border: 2px solid rgba(139, 30, 34, 0.2); border-radius: 8px; box-shadow: 0 4px 16px rgba(139, 30, 34, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4); position: relative; background-image: repeating-linear-gradient(45deg, rgba(139,30,34,0.01), rgba(139,30,34,0.01) 1px, transparent 1px, transparent 12px);",
    "dialogue_title": "text-align: center; font-size: 16px; font-weight: bold; color: #8b1e22; margin-bottom: 1em; padding-bottom: 0.8em; border-bottom: 1px solid rgba(139, 30, 34, 0.3); letter-spacing: 0.2em; font-family: 'KaiTi', 'STKaiti', 'SimSun', serif;",
    "dialogue_item": "margin: 0.8em 0; display: flex; align-items: flex-start; font-family: 'KaiTi', 'STKaiti', 'SimSun', serif;",
    "dialogue_avatar_left": "width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #8b1e22, rgba(139, 30, 34, 0.8)); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 0.8em; flex-shrink: 0; box-shadow: 0 3px 8px rgba(139, 30, 34, 0.4); border: 2px solid #ffffff;",
    "dialogue_avatar_right": "width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #5c8a3a, rgba(92, 138, 58, 0.8)); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-left: 0.8em; flex-shrink: 0; box-shadow: 0 3px 8px rgba(92, 138, 58, 0.4); border: 2px solid #ffffff;",
    "dialogue_bubble_left": "background: linear-gradient(135deg, rgba(139, 30, 34, 0.06), rgba(139, 30, 34, 0.03)); border: 1px solid rgba(139, 30, 34, 0.2); border-radius: 8px 8px 8px 2px; padding: 0.8em 1em; max-width: 75%; color: #2c2c2c; line-height: 1.8; font-size: 14px; position: relative; box-shadow: 0 2px 6px rgba(139, 30, 34, 0.15); letter-spacing: 0.1em;",
    "dialogue_bubble_right": "background: linear-gradient(135deg, rgba(248, 244, 233, 0.9), rgba(248, 244, 233, 0.7)); border: 1px solid rgba(139, 30, 34, 0.15); border-radius: 8px 8px 2px 8px; padding: 0.8em 1em; max-width: 75%; color: #2c2c2c; line-height: 1.8; font-size: 14px; margin-left: auto; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08); letter-spacing: 0.1em;",
    "dialogue_item_left": "margin: 0.8em 0; display: flex; align-items: flex-start; justify-content: flex-start;",
    "dialogue_item_right": "margin: 0.8em 0; display: flex; align-items: flex-start; justify-content: flex-end; flex-direction: row-reverse;"
  },
  "cyber": {
    "container": "max-width: 677px; margin: 0 auto; padding: 16px; background: linear-gradient(135deg, #fafbff 0%, #f8f9fe 50%, #f5f7fd 100%); font-family: 'SF Pro Display', 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif; color: #1d1d1f; line-height: 1.7; font-size: 15px; border-radius: 12px; position: relative; box-shadow: 0 2px 20px rgba(168, 85, 247, 0.08);",
    "h1": "padding: 0.8em 1.5em; margin: 1.4em 0 1em; font-size: 22px; font-weight: 700; text-align: center; letter-spacing: 0.1em; line-height: 1.2; background: linear-gradient(135deg, #f472b6 0%, #8b5cf6 50%, #60a5fa 100%); color: #ffffff; border-radius: 16px; box-shadow: 0 6px 20px rgba(244, 114, 182, 0.25), 0 2px 8px rgba(139, 92, 246, 0.15); backdrop-filter: blur(10px); position: relative; overflow: hidden;",
    "h2": "margin: 2em 8px 0.75em 0px; padding: 0.5em 0.5em 0.5em 15px; position: relative; border-bottom: 1px dashed #8b5cf6; font-size: 20px; font-weight: 600; line-height: 1.2; color: #1d1d1f; background: radial-gradient(80.23% 80.23% at 50% 88.37%, rgba(174, 78, 245, 0.22) 0%, rgba(174, 78, 245, 0.22) 0.01%, rgba(174, 78, 245, 0) 100%); border-radius: 4px; box-shadow: 0 0 15px rgba(174, 78, 245, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 3px 0 0 0 #f472b6, inset 2px 0 0 0 #8b5cf6, inset 1px 0 0 0 #60a5fa;",
    "h3": "margin: 2em 8px 0.75em 0px; padding: 0.4em 0.4em 0.4em 13px; position: relative; border-bottom: 1px dashed #60a5fa; font-size: 18px; font-weight: 600; line-height: 1.2; color: #1d1d1f; background: radial-gradient(80.23% 80.23% at 50% 88.37%, rgba(139, 92, 246, 0.18) 0%, rgba(139, 92, 246, 0.18) 0.01%, rgba(139, 92, 246, 0) 100%); border-radius: 3px; box-shadow: 0 0 12px rgba(139, 92, 246, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 2.5px 0 0 0 #8b5cf6, inset 1.5px 0 0 0 #60a5fa;",
    "h4": "margin: 1.5em 8px 0.5em 0px; padding: 0.3em 0.3em 0.3em 11px; position: relative; font-size: 16px; font-weight: 600; line-height: 1.2; color: #1d1d1f; background: radial-gradient(80.23% 80.23% at 50% 88.37%, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.15) 0.01%, rgba(168, 85, 247, 0) 100%); border-radius: 2px; box-shadow: 0 0 10px rgba(168, 85, 247, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.06), inset 2px 0 0 0 #a855f7, inset 1px 0 0 0 #f472b6;",
    "h5": "margin: 1.2em 8px 0.4em 0px; padding: 0.25em 0.25em 0.25em 9px; position: relative; font-size: 15px; font-weight: 600; line-height: 1.2; color: #333333; background: radial-gradient(80.23% 80.23% at 50% 88.37%, rgba(244, 114, 182, 0.12) 0%, rgba(244, 114, 182, 0.12) 0.01%, rgba(244, 114, 182, 0) 100%); border-radius: 2px; box-shadow: 0 0 8px rgba(244, 114, 182, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 1.5px 0 0 0 #f472b6;",
    "h6": "margin: 1em 8px 0.3em 0px; padding: 0.2em 0.2em 0.2em 7px; position: relative; font-size: 14px; font-weight: 600; line-height: 1.2; color: #666666; background: radial-gradient(80.23% 80.23% at 50% 88.37%, rgba(96, 165, 250, 0.1) 0%, rgba(96, 165, 250, 0.1) 0.01%, rgba(96, 165, 250, 0) 100%); border-radius: 1px; box-shadow: 0 0 6px rgba(96, 165, 250, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.04), inset 1px 0 0 0 #60a5fa;",
    "p": "margin: 1.2em 0; letter-spacing: 0.1em; color: #333333; text-align: justify; line-height: 1.8; font-size: 15px;",
    "image": "max-width: 100%; border-radius: 8px; margin: 1.5em auto; display: block; box-shadow: 0 8px 25px rgba(168, 85, 247, 0.12);",
    "figure": "margin: 1.5em 0; text-align: center; line-height: 1.6; font-size: 15px; color: #555555;",
    "figcaption": "text-align: center; font-size: 0.9em; color: #888888; margin-top: 0.8em;",
    "blockquote": "font-style: normal; padding: 1em 1.2em; border-left: 4px solid transparent; border-image: linear-gradient(to bottom, #f472b6, #8b5cf6, #60a5fa) 1; color: #333333; background: linear-gradient(135deg, rgba(244, 114, 182, 0.05), rgba(168, 85, 247, 0.02)); border-radius: 8px; margin: 1.5em 0;",
    "blockquote_p": "margin: 0; color: #333333; line-height: 1.7;",
    "codespan": "display: inline-block; font-size: 90%; color: #7c3aed; background: linear-gradient(135deg, rgba(244, 114, 182, 0.14), rgba(139, 92, 246, 0.14), rgba(96, 165, 250, 0.12)); padding: 2px 7px; border-radius: 999px; border: 1px solid rgba(139, 92, 246, 0.18); font-family: 'SFMono-Regular', Consolas, Menlo, monospace; line-height: 1.4;",
    "code_pre": "display: block; box-sizing: border-box; font-size: 14px; overflow-x: auto; border-radius: 16px; padding: 1.15em 1.2em 1.2em; line-height: 1.6; margin: 1.5em 0; background: radial-gradient(circle at top right, rgba(244, 114, 182, 0.16), rgba(244, 114, 182, 0) 30%), linear-gradient(180deg, rgba(139, 92, 246, 0.16) 0px, rgba(96, 165, 250, 0.12) 14px, #fbfbfd 14px, #fbfbfd 100%); border: 1px solid rgba(139, 92, 246, 0.22); box-shadow: 0 12px 32px rgba(168, 85, 247, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.85); white-space: pre; word-break: normal; overflow-wrap: normal; -webkit-overflow-scrolling: touch; tab-size: 2;",
    "code": "background: none; padding: 0; font-family: 'SFMono-Regular', Consolas, Menlo, monospace; font-size: 14px; color: #17172a; line-height: 1.6;",
    "ul": "list-style: none; padding: 0; margin: 1.2em 0; color: #333333; font-size: 15px;",
    "ol": "list-style: none; padding: 0; margin: 1.2em 0; color: #333333; font-size: 15px;",
    "listitem": "margin: 0.4em 0; padding: 0; line-height: 1.7; font-size: 15px;",
    "strong": "font-weight: 600; background: linear-gradient(81.02deg, #f472b6 -23.47%, #8b5cf6 45.52%, #60a5fa 114.8%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;",
    "em": "background: linear-gradient(135deg, #f472b6 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-style: italic;",
    "link": "color: #8b5cf6; text-decoration: none; border-bottom: 1px solid transparent; border-image: linear-gradient(to right, rgba(139, 92, 246, 0), #8b5cf6, rgba(139, 92, 246, 0)) 1; transition: all 0.3s ease;",
    "wx_link": "color: #8b5cf6; text-decoration: none;",
    "hr": "height: 2px; border: none; margin: 2.5em 0; background: linear-gradient(to right, rgba(244, 114, 182, 0), #f472b6, #8b5cf6, #60a5fa, rgba(96, 165, 250, 0));",
    "table": "width: 100%; border-collapse: collapse; margin: 1.5em 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.08);",
    "th": "padding: 12px 15px; text-align: left; font-weight: 600; color: #1d1d1f; border-bottom: 1.5px solid rgba(168, 85, 247, 0.1); background: linear-gradient(135deg, rgba(244, 114, 182, 0.03), rgba(168, 85, 247, 0.02));",
    "td": "padding: 10px 15px; border-bottom: 1px solid rgba(168, 85, 247, 0.05); color: #333333;",
    "footnotes": "margin-top: 2.5em; padding-top: 1.8em; border-top: 1px solid rgba(168, 85, 247, 0.15);",
    "footnote_item": "font-size: 0.85em; color: #888888; line-height: 1.6; margin-bottom: 0.3em;",
    "blockquote_note": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(96, 165, 250, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #60a5fa; border: 1px solid rgba(96, 165, 250, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_tip": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_important": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #a855f7; border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_warning": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(244, 114, 182, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #f472b6; border: 1px solid rgba(244, 114, 182, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_caution": "margin: 1.5em 0 2em; padding: 1.2em 1.5em; background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(255, 255, 255, 0.95)); border-left: 4px solid #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; color: rgb(60, 60, 60);",
    "blockquote_title": "font-weight: 600; margin-bottom: 0.8em; font-size: 1.05em; letter-spacing: -0.01em;",
    "blockquote_title_note": "color: #60a5fa;",
    "blockquote_title_tip": "color: #22c55e;",
    "blockquote_title_important": "color: #a855f7;",
    "blockquote_title_warning": "color: #f472b6;",
    "blockquote_title_caution": "color: #ef4444;",
    "blockquote_p_note": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_tip": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_important": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_warning": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "blockquote_p_caution": "margin: 0; color: rgb(60, 60, 60); line-height: 1.7;",
    "gallery_container": "margin: 1.5em 0 2em; padding: 18px; background: radial-gradient(80.23% 80.23% at 50% 88.37%, rgba(174, 78, 245, 0.08) 0%, rgba(174, 78, 245, 0.02) 100%); border: 2px solid rgba(168, 85, 247, 0.3); border-radius: 12px; box-shadow: 0 8px 32px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1); position: relative;",
    "gallery_image_container": "background: rgba(0, 0, 0, 0.4); border-radius: 8px; box-shadow: 0 4px 20px rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1); border: 1px solid rgba(168, 85, 247, 0.2); padding: 8px; margin-bottom: 15px;",
    "gallery_caption": "text-align: center; font-size: 12px; color: #f8fafc; margin: 15px 0 0; padding: 12px 18px; background: linear-gradient(81.02deg, #f472b6 -23.47%, #8b5cf6 45.52%, #60a5fa 114.8%); border-radius: 8px; font-weight: 600; box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);",
    "longimage_container": "margin: 1.5em 0 2em; padding: 18px; background: radial-gradient(80.23% 80.23% at 50% 88.37%, rgba(174, 78, 245, 0.08) 0%, rgba(174, 78, 245, 0.02) 100%); border: 2px solid rgba(168, 85, 247, 0.3); border-radius: 12px; box-shadow: 0 8px 32px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);",
    "longimage_image_container": "max-height: 420px; overflow-y: auto; border-radius: 8px; background: rgba(0, 0, 0, 0.4); box-shadow: 0 4px 20px rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1); border: 1px solid rgba(168, 85, 247, 0.2); padding: 6px; scrollbar-width: thin; scrollbar-color: rgba(168, 85, 247, 0.6) rgba(0, 0, 0, 0.3);",
    "longimage_caption": "text-align: center; font-size: 12px; color: #f8fafc; margin: 15px 0 0; padding: 12px 18px; background: linear-gradient(81.02deg, #f472b6 -23.47%, #8b5cf6 45.52%, #60a5fa 114.8%); border-radius: 8px; font-weight: 600; box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);",
    "dialogue_container": "margin: 1.5em 0 2em; padding: 1.2em; background: radial-gradient(80.23% 80.23% at 50% 88.37%, rgba(174, 78, 245, 0.06) 0%, rgba(174, 78, 245, 0.01) 100%); border: 2px solid rgba(168, 85, 247, 0.2); border-radius: 12px; box-shadow: 0 8px 32px rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05);",
    "dialogue_title": "text-align: center; font-size: 16px; font-weight: 600; color: #f8fafc; margin-bottom: 1em; padding-bottom: 0.8em; border-bottom: 1px solid rgba(168, 85, 247, 0.3); text-shadow: 0 0 10px rgba(168, 85, 247, 0.6);",
    "dialogue_item": "margin: 0.8em 0; display: flex; align-items: flex-start;",
    "dialogue_avatar_left": "width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #f472b6, #8b5cf6); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-right: 0.8em; flex-shrink: 0; box-shadow: 0 0 15px rgba(244, 114, 182, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3); border: 2px solid rgba(255, 255, 255, 0.2);",
    "dialogue_avatar_right": "width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #60a5fa, #a855f7); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-left: 0.8em; flex-shrink: 0; box-shadow: 0 0 15px rgba(96, 165, 250, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3); border: 2px solid rgba(255, 255, 255, 0.2);",
    "dialogue_bubble_left": "background: rgba(244, 114, 182, 0.1); border: 1px solid rgba(244, 114, 182, 0.3); border-radius: 16px 16px 16px 4px; padding: 0.8em 1em; max-width: 75%; color: #e2e8f0; line-height: 1.7; font-size: 14px; position: relative; box-shadow: 0 4px 15px rgba(244, 114, 182, 0.2);",
    "dialogue_bubble_right": "background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 16px 16px 4px 16px; padding: 0.8em 1em; max-width: 75%; color: #e2e8f0; line-height: 1.7; font-size: 14px; margin-left: auto; box-shadow: 0 4px 15px rgba(96, 165, 250, 0.2);",
    "dialogue_item_left": "margin: 0.8em 0; display: flex; align-items: flex-start; justify-content: flex-start;",
    "dialogue_item_right": "margin: 0.8em 0; display: flex; align-items: flex-start; justify-content: flex-end; flex-direction: row-reverse;"
  },
  "wechat-native": {
    "container": "max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif; font-size: 16px; line-height: 1.7 !important; color: #333333 !important; background-color: #ffffff !important; word-wrap: break-word;",
    "h1": "display: block; font-size: 29px; font-weight: 700; color: #163325 !important; line-height: 1.32 !important; margin: 36px 0 16px; letter-spacing: -0.015em; padding: 12px 16px 10px 16px; background: linear-gradient(180deg, rgba(7,193,96,0.08) 0%, rgba(7,193,96,0.03) 100%) !important; border-left: 5px solid #07c160; border-bottom: 1px dashed rgba(22,51,37,0.2); border-radius: 12px; box-shadow: 0 6px 14px rgba(7,193,96,0.05);",
    "h2": "display: block; font-size: 23px; font-weight: 700; color: #067647 !important; line-height: 1.4 !important; margin: 34px 0 18px; padding: 10px 14px; background: linear-gradient(90deg, rgba(7,193,96,0.12) 0%, rgba(7,193,96,0.03) 70%, rgba(7,193,96,0) 100%) !important; border-left: 4px solid #07c160; border-radius: 12px;",
    "h3": "font-size: 19px; font-weight: 600; color: #1f3d2d !important; line-height: 1.45 !important; margin: 28px 0 14px; padding: 0 0 6px 12px; border-left: 3px solid rgba(7,193,96,0.9); border-bottom: 1px dashed rgba(7,193,96,0.32);",
    "h4": "font-size: 15px; font-weight: 700; color: #2f4f3d !important; line-height: 1.5 !important; margin: 22px 0 12px; padding: 0 0 4px 2px; letter-spacing: 0.04em; border-bottom: 1px solid rgba(7,193,96,0.24);",
    "p": "margin: 18px 0 !important; line-height: 1.7 !important; color: #333333 !important;",
    "strong": "font-weight: 700; color: #067647 !important; background: linear-gradient(180deg, rgba(7,193,96,0) 0%, rgba(7,193,96,0) 58%, rgba(7,193,96,0.16) 58%, rgba(7,193,96,0.16) 100%); padding: 0 3px;",
    "em": "font-style: italic; color: #666 !important;",
    "a": "color: #07c160 !important; text-decoration: none; border-bottom: 1px solid #07c160; padding-bottom: 1px;",
    "ul": "margin: 16px 0; padding-left: 28px;",
    "ol": "margin: 16px 0; padding-left: 28px;",
    "li": "margin: 8px 0; line-height: 1.7 !important; color: #333333 !important;",
    "blockquote": "margin: 24px 0; padding: 16px 18px; background: linear-gradient(135deg, #f0f7f2 0%, #f8fcf9 100%) !important; border-left: 4px solid #07c160; color: #4f6057 !important; border-radius: 10px; box-shadow: inset 0 0 12px rgba(7,193,96,0.06);",
    "code": "font-family: \"SF Mono\", Consolas, monospace; padding: 3px 6px; background-color: #f0f7f2 !important; color: #07c160 !important; border-radius: 4px; font-size: 12px !important; line-height: 1.5 !important;",
    "pre": "margin: 24px 0; padding: 20px; background-color: #f0f7f2 !important; border-radius: 8px; overflow-x: auto; font-size: 12px !important; line-height: 1.5 !important;",
    "hr": "margin: 36px auto; border: none; height: 2px; width: 62%; background: linear-gradient(90deg, rgba(7,193,96,0) 0%, rgba(7,193,96,0.22) 20%, rgba(7,193,96,0.68) 50%, rgba(7,193,96,0.22) 80%, rgba(7,193,96,0) 100%) !important;",
    "img": "max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 4px;",
    "table": "width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;",
    "th": "background-color: #f0f7f2 !important; padding: 12px 16px; text-align: left; font-weight: 600; color: #333333 !important; border: 1px solid #d8e8dc;",
    "td": "padding: 12px 16px; border: 1px solid #d8e8dc; color: #333333 !important;",
    "tr": "border: none;"
  },
  "nyt-classic": {
    "container": "max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: Georgia, \"Times New Roman\", Times, serif; font-size: 16px; line-height: 1.7 !important; color: #000000 !important; background-color: #fdfaf6 !important; word-wrap: break-word;",
    "h1": "display: block; font-size: 29px; font-weight: 700; color: #111 !important; line-height: 1.3 !important; margin: 38px 0 16px; letter-spacing: -0.015em; padding: 10px 0 9px; border-top: 2px solid #111; border-bottom: 1px solid #111; text-align: left;",
    "h2": "display: block; font-size: 19px; font-weight: 700; color: #111 !important; line-height: 1.5 !important; margin: 38px 0 18px; padding: 10px 0; text-transform: uppercase; letter-spacing: 0.12em; text-align: center; border-top: 1px solid rgba(17,17,17,0.85); border-bottom: 1px solid rgba(17,17,17,0.85);",
    "h3": "font-size: 18px; font-weight: 700; color: #111 !important; line-height: 1.45 !important; margin: 28px 0 14px; padding-bottom: 6px; border-bottom: 1px solid #d5cfc5; letter-spacing: 0.04em;",
    "h4": "font-size: 13px; font-weight: 700; color: #326891 !important; line-height: 1.5 !important; margin: 22px 0 12px; text-transform: uppercase; letter-spacing: 0.14em; padding-bottom: 4px; border-bottom: 1px dashed rgba(50,104,145,0.35);",
    "p": "margin: 18px 0 !important; line-height: 1.7 !important; color: #000000 !important;",
    "strong": "font-weight: 700; color: #111 !important; background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 62%, rgba(50,104,145,0.1) 62%, rgba(50,104,145,0.1) 100%);",
    "em": "font-style: italic; color: #666 !important;",
    "a": "color: #326891 !important; text-decoration: none; border-bottom: 1px solid #326891; padding-bottom: 1px;",
    "ul": "margin: 16px 0; padding-left: 28px;",
    "ol": "margin: 16px 0; padding-left: 28px;",
    "li": "margin: 8px 0; line-height: 1.7 !important; color: #000000 !important;",
    "blockquote": "margin: 24px 0; padding: 18px 20px; background-color: #f7f3ee !important; border-left: 0; border-top: 1px solid #d5cfc5; border-bottom: 1px solid #d5cfc5; color: #555 !important; border-radius: 0; font-style: italic; box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);",
    "code": "font-family: \"SF Mono\", Consolas, monospace; padding: 3px 6px; background-color: #f0ede8 !important; color: #326891 !important; border-radius: 4px; font-size: 12px !important; line-height: 1.5 !important;",
    "pre": "margin: 24px 0; padding: 20px; background-color: #f0ede8 !important; border-radius: 8px; overflow-x: auto; font-size: 12px !important; line-height: 1.5 !important;",
    "hr": "margin: 40px auto; border: none; height: 1px; background: linear-gradient(90deg, rgba(213,207,197,0) 0%, rgba(17,17,17,0.9) 26%, rgba(17,17,17,0.9) 74%, rgba(213,207,197,0) 100%) !important; width: 38%;",
    "img": "max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 4px;",
    "table": "width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;",
    "th": "background-color: #f0ede8 !important; padding: 12px 16px; text-align: left; font-weight: 600; color: #000000 !important; border: 1px solid #d5cfc5;",
    "td": "padding: 12px 16px; border: 1px solid #d5cfc5; color: #000000 !important;",
    "tr": "border: none;"
  },
  "github-readme": {
    "container": "max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6 !important; color: #1f2328 !important; background-color: #ffffff !important; word-wrap: break-word;",
    "h1": "display: block; font-size: 29px; font-weight: 700; color: #1f2328 !important; line-height: 1.26 !important; margin: 36px 0 18px; padding: 12px 16px 11px; border: 1px solid #d8dee4; border-left: 5px solid #0969da; border-radius: 10px; background: linear-gradient(180deg, #f8fbff 0%, #f6f8fa 100%) !important; box-shadow: 0 1px 0 rgba(31,35,40,0.04);",
    "h2": "display: block; font-size: 23px; font-weight: 700; color: #1f2328 !important; line-height: 1.35 !important; margin: 34px 0 18px; padding: 0 0 10px 0; border-bottom: 2px solid #d8dee4; box-shadow: inset 0 -2px 0 #0969da;",
    "h3": "display: block; font-size: 18px; font-weight: 600; color: #1f2328 !important; line-height: 1.4 !important; margin: 28px 0 14px; padding-left: 12px; border-left: 3px solid #218bff; letter-spacing: 0.01em;",
    "h4": "display: block; width: fit-content; font-size: 13px; font-weight: 700; color: #57606a !important; line-height: 1.4 !important; margin: 22px 0 12px; padding: 4px 10px; background-color: #f6f8fa !important; border: 1px solid #d8dee4; border-radius: 999px; letter-spacing: 0.08em; text-transform: uppercase;",
    "p": "margin: 16px 0 !important; line-height: 1.6 !important; color: #1f2328 !important;",
    "strong": "font-weight: 600; color: #0550ae !important; background: linear-gradient(180deg, rgba(9,105,218,0) 0%, rgba(9,105,218,0) 58%, rgba(9,105,218,0.14) 58%, rgba(9,105,218,0.14) 100%); padding: 0 2px;",
    "em": "font-style: italic; color: #1f2328 !important;",
    "a": "color: #0969da !important; text-decoration: underline; text-underline-offset: 2px;",
    "ul": "margin: 16px 0; padding-left: 28px;",
    "ol": "margin: 16px 0; padding-left: 28px;",
    "li": "margin: 4px 0; line-height: 1.6 !important; color: #1f2328 !important;",
    "blockquote": "margin: 18px 0; padding: 14px 16px; background-color: #f6f8fa !important; border: 1px solid #d8dee4; border-left: 4px solid #218bff; color: #57606a !important; border-radius: 10px;",
    "code": "font-family: \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace; padding: 3px 6px; background-color: rgba(175,184,193,0.2) !important; color: #1f2328 !important; border-radius: 6px; font-size: 13px !important; line-height: 1.5 !important;",
    "pre": "margin: 16px 0; padding: 16px; background-color: #f6f8fa !important; border-radius: 6px; overflow-x: auto; font-size: 13px !important; line-height: 1.45 !important;",
    "hr": "margin: 34px auto; border: none; height: 1px; background: linear-gradient(90deg, rgba(209,217,224,0) 0%, rgba(209,217,224,1) 16%, rgba(9,105,218,1) 50%, rgba(209,217,224,1) 84%, rgba(209,217,224,0) 100%) !important; width: 100%;",
    "img": "max-width: 100%; height: auto; display: block; margin: 16px auto; border-radius: 6px;",
    "table": "width: 100%; margin: 16px 0; border-collapse: collapse; font-size: 15px;",
    "th": "background-color: #f6f8fa !important; padding: 8px 16px; text-align: left; font-weight: 600; color: #1f2328 !important; border: 1px solid #d1d9e0;",
    "td": "padding: 8px 16px; border: 1px solid #d1d9e0; color: #1f2328 !important;",
    "tr": "border: none;"
  },
  "sspai-red": {
    "container": "max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif; font-size: 16px; line-height: 1.8 !important; color: #333333 !important; background-color: #ffffff !important; word-wrap: break-word;",
    "h1": "display: block; font-size: 29px; font-weight: 700; color: #2d2d2d !important; line-height: 1.32 !important; margin: 36px 0 18px; letter-spacing: -0.015em; padding: 11px 16px 10px; border-top: 3px solid #d71a1b; border-bottom: 1px solid #e8dede; background: linear-gradient(180deg, rgba(215,26,27,0.05) 0%, rgba(255,255,255,1) 100%) !important;",
    "h2": "display: block; font-size: 21px; font-weight: 700; color: #2d2d2d !important; line-height: 1.45 !important; margin: 34px 0 18px; padding: 8px 0 8px 14px; border-left: 4px solid #d71a1b; letter-spacing: 0.01em;",
    "h3": "display: block; font-size: 17px; font-weight: 700; color: #444 !important; line-height: 1.45 !important; margin: 28px 0 14px; padding-bottom: 6px; border-bottom: 1px solid rgba(215,26,27,0.18);",
    "h4": "display: block; width: fit-content; font-size: 13px; font-weight: 700; color: #d71a1b !important; line-height: 1.45 !important; margin: 22px 0 12px; padding: 3px 0; letter-spacing: 0.08em; text-transform: uppercase; border-bottom: 1px solid rgba(215,26,27,0.28);",
    "p": "margin: 20px 0 !important; line-height: 1.8 !important; color: #333333 !important;",
    "strong": "font-weight: 700; color: #c51718 !important; background: linear-gradient(180deg, rgba(215,26,27,0) 0%, rgba(215,26,27,0) 60%, rgba(215,26,27,0.14) 60%, rgba(215,26,27,0.14) 100%); padding: 0 2px;",
    "em": "font-style: italic; color: #666 !important;",
    "a": "color: #d71a1b !important; text-decoration: none; border-bottom: 1px solid rgba(215,26,27,0.3); padding-bottom: 1px;",
    "ul": "margin: 16px 0; padding-left: 28px;",
    "ol": "margin: 16px 0; padding-left: 28px;",
    "li": "margin: 8px 0; line-height: 1.8 !important; color: #333333 !important;",
    "blockquote": "margin: 24px 0; padding: 16px 20px; background: linear-gradient(180deg, #fff8f8 0%, #fffdfd 100%) !important; border-left: 4px solid #d71a1b; border-right: 1px solid #f0e0e0; color: #5b5555 !important; border-radius: 10px;",
    "code": "font-family: \"SF Mono\", Consolas, monospace; padding: 3px 6px; background-color: #fff5f5 !important; color: #d71a1b !important; border-radius: 4px; font-size: 13px !important; line-height: 1.5 !important;",
    "pre": "margin: 24px 0; padding: 20px; background-color: #fafafa !important; border-radius: 8px; overflow-x: auto; font-size: 13px !important; line-height: 1.5 !important; border: 1px solid #f0f0f0;",
    "hr": "margin: 38px auto; border: none; height: 1px; background: linear-gradient(90deg, rgba(238,238,238,0) 0%, rgba(215,26,27,0.22) 18%, rgba(215,26,27,0.78) 50%, rgba(215,26,27,0.22) 82%, rgba(238,238,238,0) 100%) !important; width: 62%;",
    "img": "max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 8px;",
    "table": "width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;",
    "th": "background-color: #fef7f7 !important; padding: 12px 16px; text-align: left; font-weight: 600; color: #333 !important; border: 1px solid #f0e0e0;",
    "td": "padding: 12px 16px; border: 1px solid #f0e0e0; color: #333333 !important;",
    "tr": "border: none;"
  },
  "mint-fresh": {
    "container": "max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif; font-size: 16px; line-height: 1.7 !important; color: #2d4a3e !important; background-color: #f0faf5 !important; word-wrap: break-word;",
    "h1": "display: block; font-size: 29px; font-weight: 700; color: #1d5e49 !important; line-height: 1.32 !important; margin: 36px 0 18px; letter-spacing: -0.015em; padding: 12px 16px 11px; background: linear-gradient(180deg, rgba(224,245,236,0.95) 0%, rgba(240,250,245,0.95) 100%) !important; border: 1px solid rgba(26,122,90,0.18); border-left: 5px solid #1a7a5a; border-radius: 13px;",
    "h2": "display: block; width: fit-content; font-size: 21px; font-weight: 700; color: #1a7a5a !important; line-height: 1.4 !important; margin: 34px 0 18px; padding: 6px 14px; background-color: rgba(224,245,236,0.95) !important; border: 1px solid rgba(26,122,90,0.16); border-radius: 999px;",
    "h3": "display: block; font-size: 18px; font-weight: 600; color: #2d4a3e !important; line-height: 1.45 !important; margin: 28px 0 14px; padding-left: 12px; border-left: 3px solid rgba(26,122,90,0.75);",
    "h4": "display: block; width: fit-content; font-size: 13px; font-weight: 700; color: #3f6756 !important; line-height: 1.45 !important; margin: 22px 0 12px; padding: 4px 10px; background-color: rgba(255,255,255,0.7) !important; border: 1px solid rgba(26,122,90,0.18); border-radius: 999px; letter-spacing: 0.04em;",
    "p": "margin: 18px 0 !important; line-height: 1.7 !important; color: #2d4a3e !important;",
    "strong": "font-weight: 700; color: #1a7a5a !important; background: linear-gradient(180deg, rgba(26,122,90,0) 0%, rgba(26,122,90,0) 58%, rgba(26,122,90,0.14) 58%, rgba(26,122,90,0.14) 100%); padding: 0 2px;",
    "em": "font-style: italic; color: #5a8a72 !important;",
    "a": "color: #1a7a5a !important; text-decoration: none; border-bottom: 1px solid rgba(26,122,90,0.3); padding-bottom: 1px;",
    "ul": "margin: 16px 0; padding-left: 28px;",
    "ol": "margin: 16px 0; padding-left: 28px;",
    "li": "margin: 8px 0; line-height: 1.7 !important; color: #2d4a3e !important;",
    "blockquote": "margin: 24px 0; padding: 16px 20px; background: linear-gradient(180deg, rgba(224,245,236,0.96) 0%, rgba(240,250,245,0.96) 100%) !important; border-left: 4px solid #1a7a5a; color: #3d5a4e !important; border-radius: 12px;",
    "code": "font-family: \"SF Mono\", Consolas, monospace; padding: 3px 6px; background-color: #e0f5ec !important; color: #1a7a5a !important; border-radius: 4px; font-size: 12px !important; line-height: 1.5 !important;",
    "pre": "margin: 24px 0; padding: 20px; background-color: #e0f5ec !important; border-radius: 8px; overflow-x: auto; font-size: 12px !important; line-height: 1.5 !important;",
    "hr": "margin: 36px auto; border: none; height: 2px; width: 58%; background: linear-gradient(90deg, rgba(200,230,216,0) 0%, rgba(26,122,90,0.18) 18%, rgba(26,122,90,0.62) 50%, rgba(26,122,90,0.18) 82%, rgba(200,230,216,0) 100%) !important;",
    "img": "max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 8px;",
    "table": "width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;",
    "th": "background-color: #e0f5ec !important; padding: 12px 16px; text-align: left; font-weight: 600; color: #2d4a3e !important; border: 1px solid #c8e6d8;",
    "td": "padding: 12px 16px; border: 1px solid #c8e6d8; color: #2d4a3e !important;",
    "tr": "border: none;"
  },
  "sunset-amber": {
    "container": "max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: Georgia, \"Times New Roman\", Times, serif; font-size: 16px; line-height: 1.8 !important; color: #3d2c1e !important; background-color: #fdf6ee !important; word-wrap: break-word;",
    "h1": "display: block; font-size: 29px; font-weight: 700; color: #8d4d2e !important; line-height: 1.32 !important; margin: 36px 0 18px; letter-spacing: -0.015em; padding: 12px 16px 11px; background: linear-gradient(180deg, rgba(255,243,227,0.94) 0%, rgba(248,228,201,0.8) 100%) !important; border: 1px solid rgba(224,174,112,0.4); border-left: 5px solid #d37a45; border-radius: 13px; box-shadow: 0 6px 16px rgba(166,102,56,0.06);",
    "h2": "display: block; font-size: 23px; font-weight: 700; color: #a45a33 !important; line-height: 1.4 !important; margin: 34px 0 18px; padding: 10px 14px; background: linear-gradient(90deg, rgba(236,191,132,0.24) 0%, rgba(236,191,132,0.08) 72%, rgba(236,191,132,0) 100%) !important; border-left: 3px solid #d78a54; border-radius: 12px;",
    "h3": "display: block; font-size: 18px; font-weight: 600; color: #5c402b !important; line-height: 1.5 !important; margin: 28px 0 14px; padding: 0 0 6px 12px; border-left: 3px solid rgba(215,138,84,0.9); border-bottom: 1px solid rgba(215,138,84,0.24);",
    "h4": "display: block; width: fit-content; font-size: 14px; font-weight: 700; color: #7a5035 !important; line-height: 1.5 !important; margin: 22px 0 12px; padding: 3px 10px; background-color: rgba(245,230,208,0.92) !important; border: 1px solid rgba(215,138,84,0.3); border-radius: 999px; letter-spacing: 0.06em;",
    "p": "margin: 20px 0 !important; line-height: 1.8 !important; color: #3d2c1e !important;",
    "strong": "font-weight: 700; color: #a45a33 !important; background: linear-gradient(180deg, rgba(212,122,69,0) 0%, rgba(212,122,69,0) 60%, rgba(236,191,132,0.35) 60%, rgba(236,191,132,0.35) 100%); padding: 0 2px;",
    "em": "font-style: italic; color: #8a6d4b !important;",
    "a": "color: #c0582a !important; text-decoration: none; border-bottom: 1px solid rgba(192,88,42,0.3); padding-bottom: 1px;",
    "ul": "margin: 16px 0; padding-left: 28px;",
    "ol": "margin: 16px 0; padding-left: 28px;",
    "li": "margin: 8px 0; line-height: 1.8 !important; color: #3d2c1e !important;",
    "blockquote": "margin: 24px 0; padding: 18px 20px; background: linear-gradient(180deg, rgba(249,236,217,0.96) 0%, rgba(247,228,204,0.88) 100%) !important; border-left: 4px solid #d78a54; color: #6a4c38 !important; border-radius: 12px; font-style: italic; box-shadow: inset 0 0 12px rgba(215,138,84,0.06);",
    "code": "font-family: \"SF Mono\", Consolas, monospace; padding: 3px 6px; background-color: #f5e6d0 !important; color: #c0582a !important; border-radius: 4px; font-size: 12px !important; line-height: 1.5 !important;",
    "pre": "margin: 24px 0; padding: 20px; background-color: #f5e6d0 !important; border-radius: 8px; overflow-x: auto; font-size: 12px !important; line-height: 1.5 !important;",
    "hr": "margin: 38px auto; border: none; height: 2px; width: 58%; background: linear-gradient(90deg, rgba(232,212,184,0) 0%, rgba(215,138,84,0.22) 20%, rgba(215,138,84,0.75) 50%, rgba(215,138,84,0.22) 80%, rgba(232,212,184,0) 100%) !important;",
    "img": "max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 4px;",
    "table": "width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;",
    "th": "background-color: #f5e6d0 !important; padding: 12px 16px; text-align: left; font-weight: 600; color: #3d2c1e !important; border: 1px solid #e8d4b8;",
    "td": "padding: 12px 16px; border: 1px solid #e8d4b8; color: #3d2c1e !important;",
    "tr": "border: none;"
  },
  "ink-minimal": {
    "container": "max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: Georgia, \"Times New Roman\", Times, serif; font-size: 16px; line-height: 1.8 !important; color: #111111 !important; background-color: #ffffff !important; word-wrap: break-word;",
    "h1": "display: block; font-size: 29px; font-weight: 700; color: #000000 !important; line-height: 1.3 !important; margin: 36px 0 18px; letter-spacing: -0.02em; padding: 0 0 10px; border-bottom: 2px solid #000000;",
    "h2": "display: block; font-size: 22px; font-weight: 700; color: #111111 !important; line-height: 1.45 !important; margin: 34px 0 18px; padding-left: 12px; border-left: 3px solid #000000;",
    "h3": "display: block; font-size: 18px; font-weight: 600; color: #222222 !important; line-height: 1.45 !important; margin: 28px 0 14px; padding-bottom: 6px; border-bottom: 1px solid rgba(0,0,0,0.14);",
    "h4": "display: block; width: fit-content; font-size: 13px; font-weight: 700; color: #444444 !important; line-height: 1.45 !important; margin: 22px 0 12px; letter-spacing: 0.08em; text-transform: uppercase;",
    "p": "margin: 20px 0 !important; line-height: 1.8 !important; color: #111111 !important;",
    "strong": "font-weight: 700; color: #000000 !important;",
    "em": "font-style: italic; color: #555555 !important;",
    "a": "color: #111111 !important; text-decoration: underline; text-underline-offset: 3px;",
    "ul": "margin: 16px 0; padding-left: 28px;",
    "ol": "margin: 16px 0; padding-left: 28px;",
    "li": "margin: 8px 0; line-height: 1.8 !important; color: #111111 !important;",
    "blockquote": "margin: 24px 0; padding: 16px 18px; background-color: #fafafa !important; border-left: 3px solid #000000; color: #333333 !important; border-radius: 0;",
    "code": "font-family: \"SF Mono\", Consolas, monospace; padding: 3px 6px; background-color: #f0f0f0 !important; color: #000000 !important; border-radius: 2px; font-size: 13px !important; line-height: 1.5 !important;",
    "pre": "margin: 24px 0; padding: 20px; background-color: #f5f5f5 !important; border-radius: 2px; overflow-x: auto; font-size: 13px !important; line-height: 1.5 !important; border: 1px solid #e0e0e0;",
    "hr": "margin: 38px auto; border: none; height: 1px; background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.88) 28%, rgba(0,0,0,0.88) 72%, rgba(0,0,0,0) 100%) !important; width: 34%;",
    "img": "max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 0;",
    "table": "width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;",
    "th": "background-color: #f5f5f5 !important; padding: 12px 16px; text-align: left; font-weight: 700; color: #000000 !important; border: 1px solid #cccccc;",
    "td": "padding: 12px 16px; border: 1px solid #cccccc; color: #111111 !important;",
    "tr": "border: none;"
  },
  "lavender-dream": {
    "container": "max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif; font-size: 16px; line-height: 1.75 !important; color: #3d3155 !important; background-color: #f5f0ff !important; word-wrap: break-word;",
    "h1": "display: block; font-size: 29px; font-weight: 700; color: #5f4688 !important; line-height: 1.32 !important; margin: 36px 0 18px; letter-spacing: -0.015em; padding: 12px 16px 11px; background: linear-gradient(180deg, rgba(236,228,255,0.98) 0%, rgba(245,240,255,0.98) 100%) !important; border: 1px solid rgba(155,127,212,0.22); border-left: 5px solid #9b7fd4; border-radius: 13px;",
    "h2": "display: block; font-size: 22px; font-weight: 700; color: #6b4c9a !important; line-height: 1.4 !important; margin: 34px 0 18px; padding: 9px 14px; background: linear-gradient(90deg, rgba(236,228,255,0.94) 0%, rgba(236,228,255,0.2) 74%, rgba(236,228,255,0) 100%) !important; border-left: 3px solid #9b7fd4; border-radius: 12px;",
    "h3": "display: block; font-size: 18px; font-weight: 600; color: #4a3c67 !important; line-height: 1.45 !important; margin: 28px 0 14px; padding-left: 12px; border-left: 2px solid rgba(155,127,212,0.6);",
    "h4": "display: block; width: fit-content; font-size: 13px; font-weight: 700; color: #7a5aa9 !important; line-height: 1.45 !important; margin: 22px 0 12px; padding: 4px 10px; background-color: rgba(236,228,255,0.9) !important; border: 1px solid rgba(155,127,212,0.22); border-radius: 999px; letter-spacing: 0.05em;",
    "p": "margin: 18px 0 !important; line-height: 1.75 !important; color: #3d3155 !important;",
    "strong": "font-weight: 700; color: #6b4c9a !important; background: linear-gradient(180deg, rgba(107,76,154,0) 0%, rgba(107,76,154,0) 58%, rgba(155,127,212,0.2) 58%, rgba(155,127,212,0.2) 100%); padding: 0 2px;",
    "em": "font-style: italic; color: #8a6dba !important;",
    "a": "color: #6b4c9a !important; text-decoration: none; border-bottom: 1px solid rgba(107,76,154,0.3); padding-bottom: 1px;",
    "ul": "margin: 16px 0; padding-left: 28px;",
    "ol": "margin: 16px 0; padding-left: 28px;",
    "li": "margin: 8px 0; line-height: 1.75 !important; color: #3d3155 !important;",
    "blockquote": "margin: 24px 0; padding: 16px 20px; background: linear-gradient(180deg, rgba(236,228,255,0.98) 0%, rgba(245,240,255,0.9) 100%) !important; border-left: 4px solid #9b7fd4; color: #5a4570 !important; border-radius: 12px;",
    "code": "font-family: \"SF Mono\", Consolas, monospace; padding: 3px 6px; background-color: #ece4ff !important; color: #6b4c9a !important; border-radius: 4px; font-size: 12px !important; line-height: 1.5 !important;",
    "pre": "margin: 24px 0; padding: 20px; background-color: #ece4ff !important; border-radius: 12px; overflow-x: auto; font-size: 12px !important; line-height: 1.5 !important;",
    "hr": "margin: 36px auto; border: none; height: 2px; width: 56%; background: linear-gradient(90deg, rgba(221,208,240,0) 0%, rgba(155,127,212,0.2) 20%, rgba(155,127,212,0.65) 50%, rgba(155,127,212,0.2) 80%, rgba(221,208,240,0) 100%) !important;",
    "img": "max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 12px;",
    "table": "width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;",
    "th": "background-color: #ece4ff !important; padding: 12px 16px; text-align: left; font-weight: 600; color: #3d3155 !important; border: 1px solid #ddd0f0;",
    "td": "padding: 12px 16px; border: 1px solid #ddd0f0; color: #3d3155 !important;",
    "tr": "border: none;"
  },
  "coffee-house": {
    "container": "max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: Georgia, \"Times New Roman\", Times, serif; font-size: 16px; line-height: 1.75 !important; color: #3e2723 !important; background-color: #f5efe6 !important; background-image: radial-gradient(circle at center, #f5efe6 0%, #ebe2d3 100%); word-wrap: break-word;",
    "h1": "display: block; font-size: 29px; font-weight: 700; color: #4a302a !important; line-height: 1.32 !important; margin: 36px 0 18px; letter-spacing: -0.015em; padding: 12px 16px 11px; background: linear-gradient(180deg, rgba(236,226,212,0.92) 0%, rgba(245,239,230,0.94) 100%) !important; border: 1px solid rgba(161,136,127,0.3); border-left: 5px solid #8d6e63; border-radius: 12px;",
    "h2": "display: block; font-size: 22px; font-weight: 700; color: #5d4037 !important; line-height: 1.45 !important; margin: 34px 0 18px; padding: 0 0 8px; border-bottom: 1px solid rgba(161,136,127,0.36);",
    "h3": "display: block; font-size: 18px; font-weight: 600; color: #4e342e !important; line-height: 1.45 !important; margin: 28px 0 14px; padding-left: 12px; border-left: 3px solid rgba(141,110,99,0.7);",
    "h4": "display: block; width: fit-content; font-size: 13px; font-weight: 700; color: #795548 !important; line-height: 1.45 !important; margin: 22px 0 12px; padding: 3px 10px; background-color: rgba(236,226,212,0.92) !important; border-radius: 999px; letter-spacing: 0.05em;",
    "p": "margin: 18px 0 !important; line-height: 1.75 !important; color: #3e2723 !important;",
    "strong": "font-weight: 700; color: #5d4037 !important; background: linear-gradient(180deg, rgba(93,64,55,0) 0%, rgba(93,64,55,0) 58%, rgba(161,136,127,0.22) 58%, rgba(161,136,127,0.22) 100%); padding: 0 2px;",
    "em": "font-style: italic; color: #795548 !important;",
    "a": "color: #6d4c41 !important; text-decoration: none; border-bottom: 1px solid rgba(109,76,65,0.3); padding-bottom: 1px;",
    "ul": "margin: 16px 0; padding-left: 28px;",
    "ol": "margin: 16px 0; padding-left: 28px;",
    "li": "margin: 8px 0; line-height: 1.75 !important; color: #3e2723 !important;",
    "blockquote": "margin: 24px 0; padding: 18px 20px; background: linear-gradient(180deg, rgba(236,226,212,0.96) 0%, rgba(245,239,230,0.96) 100%) !important; border-left: 4px solid #8d6e63; color: #5d4037 !important; border-radius: 12px;",
    "code": "font-family: \"SF Mono\", Consolas, monospace; padding: 3px 6px; background-color: #ece2d4 !important; color: #6d4c41 !important; border-radius: 4px; font-size: 12px !important; line-height: 1.5 !important;",
    "pre": "margin: 24px 0; padding: 20px; background-color: #ece2d4 !important; border-radius: 8px; overflow-x: auto; font-size: 12px !important; line-height: 1.5 !important;",
    "hr": "margin: 38px auto; border: none; height: 2px; width: 54%; background: linear-gradient(90deg, rgba(215,204,200,0) 0%, rgba(141,110,99,0.2) 18%, rgba(141,110,99,0.64) 50%, rgba(141,110,99,0.2) 82%, rgba(215,204,200,0) 100%) !important;",
    "img": "max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 4px;",
    "table": "width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;",
    "th": "background-color: #ece2d4 !important; padding: 12px 16px; text-align: left; font-weight: 600; color: #3e2723 !important; border: 1px solid #d7ccc8;",
    "td": "padding: 12px 16px; border: 1px solid #d7ccc8; color: #3e2723 !important;",
    "tr": "border: none;"
  },
  "bauhaus-primary": {
    "container": "max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.65 !important; color: #1a1a1a !important; background-color: #ffffff !important; word-wrap: break-word;",
    "h1": "display: block; font-size: 31px; font-weight: 900; color: #ffffff !important; line-height: 1.16 !important; margin: 36px 0 18px; letter-spacing: -0.02em; text-transform: uppercase; padding: 10px 14px 9px; background: linear-gradient(90deg, #e30613 0%, #e30613 64%, #004d9f 64%, #004d9f 86%, #f5a623 86%, #f5a623 100%) !important; border: 3px solid #1a1a1a; box-shadow: 6px 6px 0 #1a1a1a;",
    "h2": "display: block; width: fit-content; font-size: 22px; font-weight: 800; color: #1a1a1a !important; line-height: 1.35 !important; margin: 34px 0 18px; padding: 8px 16px; background: linear-gradient(90deg, #f5a623 0%, #f5a623 68%, #ffffff 68%, #ffffff 100%) !important; border-left: 10px solid #004d9f; border-top: 3px solid #1a1a1a; border-bottom: 3px solid #1a1a1a; text-transform: uppercase; letter-spacing: 0.08em;",
    "h3": "display: block; width: fit-content; font-size: 17px; font-weight: 700; color: #1a1a1a !important; line-height: 1.45 !important; margin: 28px 0 14px; padding: 6px 12px; background-color: #ffffff !important; border-left: 8px solid #e30613; border-bottom: 3px solid #004d9f; letter-spacing: 0.05em; text-transform: uppercase;",
    "h4": "display: block; width: fit-content; font-size: 13px; font-weight: 700; color: #1a1a1a !important; line-height: 1.45 !important; margin: 22px 0 12px; padding: 3px 10px; background-color: rgba(245,166,35,0.22) !important; border: 2px solid #1a1a1a; letter-spacing: 0.06em;",
    "p": "margin: 18px 0 !important; line-height: 1.65 !important; color: #1a1a1a !important;",
    "strong": "font-weight: 900; color: #ffffff !important; background-color: #e30613 !important; padding: 0 6px;",
    "em": "font-style: italic; color: #555 !important;",
    "a": "color: #004d9f !important; text-decoration: none; border-bottom: 2px solid #f5a623; padding-bottom: 1px;",
    "ul": "margin: 16px 0; padding-left: 28px;",
    "ol": "margin: 16px 0; padding-left: 28px;",
    "li": "margin: 8px 0; line-height: 1.65 !important; color: #1a1a1a !important;",
    "blockquote": "margin: 24px 0; padding: 16px 20px; background: linear-gradient(135deg, #fff4d6 0%, #fff8ea 100%) !important; border-left: 6px solid #f5a623; border-right: 2px solid #004d9f; border-top: 2px solid #1a1a1a; color: #333 !important; border-radius: 0;",
    "code": "font-family: \"SF Mono\", Consolas, monospace; padding: 3px 6px; background-color: #f0f0f0 !important; color: #004d9f !important; border-radius: 0; font-size: 13px !important; line-height: 1.5 !important;",
    "pre": "margin: 24px 0; padding: 20px; background-color: #f0f0f0 !important; border-radius: 0; overflow-x: auto; font-size: 13px !important; line-height: 1.5 !important; border-left: 6px solid #e30613;",
    "hr": "margin: 36px auto; border: none; height: 6px; background: linear-gradient(90deg, #e30613 0%, #e30613 33.33%, #004d9f 33.33%, #004d9f 66.66%, #f5a623 66.66%, #f5a623 100%) !important; width: 100%;",
    "img": "max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 0;",
    "table": "width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;",
    "th": "background-color: #004d9f !important; padding: 16px 16px; text-align: left; font-weight: 700; color: #ffffff !important; border: 3px solid #1a1a1a;",
    "td": "padding: 16px 16px; border: 3px solid #1a1a1a; color: #1a1a1a !important; font-weight: 500;",
    "tr": "border: none;"
  }
} as const

const THEME_SPECS: ThemeSpec[] = [
  ...NAMED_THEME_SPECS,
  ...MATRIX_THEME_SPECS,
]

export const themes: Record<string, Theme> = Object.fromEntries(
  THEME_SPECS.map(spec => [spec.name, createTheme(spec)]),
)

function named(
  name: string,
  collection: ThemeCollection,
  displayName: string,
  accent: string,
  background: string,
  surface: string,
  text: string,
  muted: string,
  border: string,
  codeBackground: string,
  description: string,
  bestFor: string,
  density: "low" | "medium" | "high",
  contrast: "low" | "medium" | "high",
): ThemeSpec {
  return { name, collection, displayName, accent, background, surface, text, muted, border, codeBackground, description, bestFor, density, contrast }
}

function themeSeries(
  prefix: "minimal" | "focus" | "elegant" | "bold",
  label: string,
  collection: ThemeCollection,
  description: string,
  bestFor: string,
  density: "low" | "medium" | "high",
  contrast: "low" | "medium" | "high",
): ThemeSpec[] {
  return COLOR_VARIANTS.map(color => named(
    `${prefix}-${color.key}`,
    collection,
    `${label} ${color.label}`,
    color.accent,
    "#ffffff",
    colorMix(color.accent, 0.08),
    "#2c2c2c",
    "#767676",
    colorMix(color.accent, 0.28),
    colorMix(color.accent, 0.10),
    `${color.label} ${description}`,
    bestFor,
    density,
    contrast,
  ))
}

function createTheme(spec: ThemeSpec): Theme {
  const metadata = THEME_DISPLAY_METADATA[spec.name]
  return {
    name: spec.name,
    description: spec.description,
    styles: createStyles(spec),
    collection: spec.collection,
    displayName: metadata?.displayName ?? spec.displayName,
    bestFor: metadata?.bestFor ?? spec.bestFor,
    density: spec.density,
    contrast: spec.contrast,
    accent: spec.accent,
    advancedPalette: GALLERY_ADVANCED_PALETTES[spec.name],
    sourceUpdatedAt: SOURCE_UPDATED_AT,
  }
}

function createStyles(spec: ThemeSpec): NodeStyles {
  const raw = MD2_NAMED_RAW_STYLES[spec.name as keyof typeof MD2_NAMED_RAW_STYLES]
  const styles = raw ? createStylesFromMd2Raw(spec, raw) : createTemplateStyles(spec)
  return withReadingBaseline(spec, styles)
}

function createStylesFromMd2Raw(spec: ThemeSpec, raw: Record<string, string>): NodeStyles {
  const accent = spec.accent
  const border = spec.border
  const soft = colorMix(accent, 0.10)
  const inlineCode = raw.codespan ?? raw.code ?? defaultInlineCode(accent, border, spec.codeBackground)
  const pre = raw.code_pre ?? raw.pre ?? defaultPre(spec, soft)
  const blockquote = raw.blockquote ?? defaultBlockquote(spec, soft)
  const blockquoteP = raw.blockquote_p ?? `margin:0;color:${spec.muted};font-size:15px;line-height:1.82;background: transparent;`
  const figure = raw.figure ?? "margin:18px 0;text-align:center;"
  const figcaption = raw.figcaption ?? `margin:8px 0 0;color:${spec.muted};font-size:13px;line-height:1.6;text-align:center;`
  const link = ensureCssDeclaration(raw.link ?? raw.a ?? defaultLink(accent, border), "word-break", "break-all")
  const wxLink = `${ensureCssDeclaration(raw.wx_link ?? link, "word-break", "break-all")};border-bottom:none;`

  return {
    wrapper: raw.container ?? `font-family:${READING_FONT_FAMILY};max-width:677px;margin:0 auto;padding:0 16px;background:${spec.background};color:${spec.text};`,
    h1: raw.h1 ?? templateH1(spec),
    h2: raw.h2 ?? templateH2(spec),
    h3: raw.h3 ?? `font-size:18px;font-weight:750;color:${accent};margin:22px 0 9px;line-height:1.42;`,
    h4: raw.h4 ?? `font-size:16px;font-weight:700;color:${spec.text};margin:18px 0 7px;line-height:1.4;border-left:3px solid ${accent};padding-left:8px;`,
    h5: raw.h5 ?? deriveHeadingStyle(raw.h4, "16px", `font-size:16px;font-weight:600;color:${spec.text};margin:16px 0 6px;line-height:1.45;`),
    h6: raw.h6 ?? deriveHeadingStyle(raw.h4, "15px", `font-size:15px;font-weight:600;color:${spec.muted};margin:14px 0 6px;line-height:1.45;`),
    p: raw.p ?? `${READING_PARAGRAPH}color:${spec.text};`,
    strong: raw.strong ?? `font-weight:700;color:${accent};`,
    em: raw.em ?? `font-style:italic;color:${spec.muted};`,
    code: inlineCode,
    codespan: inlineCode,
    pre,
    codePre: pre,
    preCode: defaultPreCode(spec),
    blockquote,
    blockquoteP,
    ...alertStyles(spec, raw),
    ul: raw.ul ?? READING_LIST,
    ol: raw.ol ?? READING_LIST,
    li: raw.li ?? `${READING_LIST_ITEM}color:${spec.text};`,
    hr: raw.hr ?? `border:none;border-top:1px dashed ${border};margin:26px 0;`,
    img: raw.img ?? defaultImage(spec),
    figure,
    figcaption,
    a: link,
    wxLink,
    footnotes: raw.footnotes ?? `margin-top:2em;padding-top:1.5em;border-top:1px solid ${border};`,
    footnoteItem: raw.footnote_item ?? `margin:0 0 8px;color:${spec.muted};font-size:14px;line-height:1.7;`,
    ...mediaModuleStyles(spec, raw),
    table: raw.table ?? `width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;background:${spec.surface};`,
    th: raw.th ?? `background:${soft};font-weight:800;padding:9px 12px;border:1px solid ${border};text-align:left;color:${accent};`,
    td: raw.td ?? `padding:9px 12px;border:1px solid ${border};color:${spec.text};`,
  }
}

function createTemplateStyles(spec: ThemeSpec): NodeStyles {
  const accent = spec.accent
  const border = spec.border
  const soft = colorMix(accent, 0.10)
  const softer = colorMix(accent, 0.16)
  return {
    wrapper: `font-family:${READING_FONT_FAMILY};max-width:677px;margin:0 auto;padding:0 16px;background:${spec.background};color:${spec.text};`,
    h1: templateH1(spec),
    h2: templateH2(spec),
    h3: `font-size:19px;font-weight:700;color:${accent};line-height:1.4;margin-top:0;margin-bottom:18px;word-break:break-all;`,
    h4: `font-size:17px;font-weight:700;color:${spec.text};line-height:1.45;margin-top:0;margin-bottom:14px;word-break:break-all;`,
    h5: `font-size:16px;font-weight:600;color:${spec.text};line-height:1.45;margin-top:0;margin-bottom:12px;word-break:break-all;`,
    h6: `font-size:15px;font-weight:600;color:${spec.muted};line-height:1.45;margin-top:0;margin-bottom:10px;word-break:break-all;`,
    p: `${READING_PARAGRAPH}color:${spec.text};`,
    strong: `font-weight:700;color:${accent};`,
    em: `font-style:italic;color:${spec.muted};`,
    code: defaultInlineCode(accent, border, spec.codeBackground),
    codespan: defaultInlineCode(accent, border, spec.codeBackground),
    pre: defaultPre(spec, soft),
    codePre: defaultPre(spec, soft),
    preCode: defaultPreCode(spec),
    blockquote: defaultBlockquote(spec, soft),
    blockquoteP: `margin:0;color:${spec.muted};font-size:15px;line-height:1.82;background: transparent;`,
    ...alertStyles(spec),
    ul: READING_LIST,
    ol: READING_LIST,
    li: `${READING_LIST_ITEM}color:${spec.text};`,
    hr: `border:none;border-top:1px dashed ${border};margin:26px 0;`,
    img: defaultImage(spec),
    figure: "margin:18px 0;text-align:center;",
    figcaption: `margin:8px 0 0;color:${spec.muted};font-size:13px;line-height:1.6;text-align:center;`,
    a: defaultLink(accent, border),
    wxLink: `${defaultLink(accent, border)};border-bottom:none;`,
    footnotes: `margin-top:2em;padding-top:1.5em;border-top:1px solid ${border};`,
    footnoteItem: `margin:0 0 8px;color:${spec.muted};font-size:14px;line-height:1.7;`,
    ...mediaModuleStyles(spec),
    table: `width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;background:${spec.surface};`,
    th: `background:${softer};font-weight:800;padding:9px 12px;border:1px solid ${border};text-align:left;color:${accent};`,
    td: `padding:9px 12px;border:1px solid ${border};color:${spec.text};`,
  }
}

function withReadingBaseline(spec: ThemeSpec, styles: NodeStyles): NodeStyles {
  return {
    ...styles,
    wrapper: ensureCssDeclaration(styles.wrapper, "font-family", READING_FONT_FAMILY),
    p: `${READING_PARAGRAPH}color:${spec.text};`,
    ul: READING_LIST,
    ol: READING_LIST,
    li: `${READING_LIST_ITEM}color:${spec.text};`,
  }
}

function templateH1(spec: ThemeSpec): string {
  const primary = spec.accent
  const rgb = rgbTriplet(primary)
  switch (spec.collection) {
    case "minimal":
      return `font-size: 28px; font-weight: 800; color: ${primary}; margin-top: 0; margin-bottom: 28px; line-height: 1.4em; word-break: break-all; letter-spacing: -0.03em; font-family: ${READING_FONT_FAMILY};`
    case "focus":
      return `font-size: 26px; font-weight: 700; color: ${primary}; line-height: 1.4; margin-top: 0; margin-bottom: 28px; word-break: break-all; padding: 16px 0; text-align: center; background-image: linear-gradient(to right, transparent, ${primary}, transparent), linear-gradient(to right, transparent, ${primary}, transparent); background-size: 100% 1px, 100% 1px; background-position: center top, center bottom; background-repeat: no-repeat; font-family: ${READING_FONT_FAMILY};`
    case "elegant":
      return `font-size: 26px; font-weight: 700; color: ${primary}; margin-top: 0; margin-bottom: 28px; line-height: 1.4em; word-break: break-all; padding-left: 8px; padding-bottom: 4px; letter-spacing: 0.5px; border-left: 5px solid ${primary}; border-bottom: 1px solid ${primary}; font-family: ${READING_FONT_FAMILY};`
    case "bold":
      return `font-size: 26px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 28px; line-height: 1.4em; word-break: break-all; background-color: ${primary}; padding: 16px 24px; border-radius: 16px; box-shadow: 0 4px 12px rgba(${rgb}, 0.25); font-family: ${READING_FONT_FAMILY};`
    default:
      return `margin: 1.5em 8px 0.75em 0px; padding: 0.8em 1.5em; background: ${primary}; font-size: 22px; font-weight: bold; line-height: 1.2; color: #ffffff; text-align: center; border-radius: 8px; box-shadow: 0 2px 8px ${colorMix(primary, 0.2)};`
  }
}

function templateH2(spec: ThemeSpec): string {
  const primary = spec.accent
  switch (spec.collection) {
    case "minimal":
      return `font-size: 22px; font-weight: 700; color: ${primary}; margin-top: 0; margin-bottom: 22px; line-height: 1.45; word-break: break-all; border-bottom: 1px solid ${colorMix(primary, 0.28)}; padding-bottom: 6px;`
    case "focus":
      return `font-size: 22px; font-weight: 700; color: ${primary}; margin-top: 0; margin-bottom: 22px; line-height: 1.45; text-align: center; word-break: break-all;`
    case "elegant":
      return `font-size: 22px; font-weight: 700; color: ${spec.text}; margin-top: 0; margin-bottom: 22px; line-height: 1.45; padding: 8px 12px; border-left: 4px solid ${primary}; background: ${colorMix(primary, 0.08)};`
    case "bold":
      return `font-size: 22px; font-weight: 700; color: ${primary}; margin-top: 0; margin-bottom: 22px; line-height: 1.45; word-break: break-all; border-bottom: 3px solid ${primary}; padding-bottom: 4px;`
    default:
      return `margin:2em 8px 0.75em 0;padding:0 0 0.5em 12px;border-left:4px solid ${primary};border-bottom:1px dashed ${primary};font-size:20px;font-weight:800;line-height:1.25;color:${spec.text};`
  }
}

function defaultInlineCode(accent: string, border: string, background: string): string {
  return `font-family:Menlo,Monaco,Consolas,'Courier New',monospace;font-size:90%;line-height:1.4;background:${background};padding:2px 7px;border-radius:6px;color:${accent};border:1px solid ${border};`
}

function defaultPre(spec: ThemeSpec, soft: string): string {
  return `display:block;box-sizing:border-box;background:${spec.surface};border-radius:12px;padding:16px 18px;margin:18px 0;overflow-x:auto;border:1px solid ${spec.border};border-top:3px solid ${spec.accent};box-shadow:0 6px 18px ${soft};-webkit-overflow-scrolling:touch;tab-size:2;`
}

function defaultPreCode(spec: ThemeSpec): string {
  return `font-family:Menlo,Monaco,Consolas,'Courier New',monospace;font-size:14px;color:${spec.text};background:none;padding:0;border-radius:0;display:block;line-height:1.6;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;`
}

function defaultBlockquote(spec: ThemeSpec, soft: string): string {
  return `border-left:4px solid ${spec.accent};margin:18px 0;padding:12px 16px;background:${soft};color:${spec.muted};font-size:15px;line-height:1.82;border-radius:0 8px 8px 0;`
}

function defaultImage(spec: ThemeSpec): string {
  const radius = spec.collection === "minimal" || spec.name === "ink-minimal" ? "2px" : "8px"
  const shadow = spec.collection === "bold" || spec.collection === "elegant" ? `box-shadow:0 6px 18px ${colorMix(spec.accent, 0.10)};` : ""
  return `max-width:100%;border-radius:${radius};display:block;margin:0 auto;${shadow}`
}

function defaultLink(accent: string, border: string): string {
  return `color:${accent};text-decoration:none;font-weight:700;border-bottom:1px solid ${border};word-break:break-all;overflow-wrap:anywhere;white-space:normal;`
}

function alertStyles(spec: ThemeSpec, raw?: Record<string, string>): Partial<NodeStyles> {
  const note = spec.accent
  const tip = "#57ab5a"
  const important = "#a855f7"
  const warning = "#f59e0b"
  const caution = "#ef4444"
  return {
    blockquoteNote: raw?.blockquote_note ?? alertBox(note),
    blockquoteTip: raw?.blockquote_tip ?? alertBox(tip),
    blockquoteImportant: raw?.blockquote_important ?? alertBox(important),
    blockquoteWarning: raw?.blockquote_warning ?? alertBox(warning),
    blockquoteCaution: raw?.blockquote_caution ?? alertBox(caution),
    blockquoteTitle: raw?.blockquote_title ?? "margin:0 0 8px;font-size:15px;font-weight:800;line-height:1.5;",
    blockquoteTitleNote: raw?.blockquote_title_note ?? `color:${note};`,
    blockquoteTitleTip: raw?.blockquote_title_tip ?? `color:${tip};`,
    blockquoteTitleImportant: raw?.blockquote_title_important ?? `color:${important};`,
    blockquoteTitleWarning: raw?.blockquote_title_warning ?? `color:${warning};`,
    blockquoteTitleCaution: raw?.blockquote_title_caution ?? `color:${caution};`,
    blockquotePNote: raw?.blockquote_p_note ?? alertParagraph(),
    blockquotePTip: raw?.blockquote_p_tip ?? alertParagraph(),
    blockquotePImportant: raw?.blockquote_p_important ?? alertParagraph(),
    blockquotePWarning: raw?.blockquote_p_warning ?? alertParagraph(),
    blockquotePCaution: raw?.blockquote_p_caution ?? alertParagraph(),
  }
}

function alertBox(color: string): string {
  return `margin:1.5em 0 2em;padding:1.2em 1.5em;border-left:4px solid ${color};background:linear-gradient(135deg, ${colorMix(color, 0.08)}, rgba(255,255,255,0.95));border:1px solid ${colorMix(color, 0.2)};border-radius:8px;color:rgb(60,60,60);`
}

function alertParagraph(): string {
  return "margin:0 0 8px;font-size:15px;line-height:1.7;color:rgb(60,60,60);"
}

function mediaModuleStyles(spec: ThemeSpec, raw?: Record<string, string>): Partial<NodeStyles> {
  const accent = spec.accent
  const border = spec.border
  const soft = colorMix(accent, 0.08)
  return {
    galleryContainer: raw?.gallery_container ?? `margin:18px 0;padding:10px;border:1px solid ${border};background:${spec.surface};border-radius:10px;`,
    galleryImageContainer: raw?.gallery_image_container ?? "margin:0 0 10px;overflow:hidden;border-radius:8px;",
    galleryCaption: raw?.gallery_caption ?? `margin:6px 0 0;color:${spec.muted};font-size:13px;line-height:1.6;text-align:center;`,
    longimageContainer: raw?.longimage_container ?? `margin:18px 0;padding:10px;border:1px solid ${border};background:${soft};border-radius:10px;`,
    longimageImageContainer: raw?.longimage_image_container ?? "margin:0;overflow:hidden;border-radius:8px;",
    longimageCaption: raw?.longimage_caption ?? `margin:8px 0 0;color:${spec.muted};font-size:13px;line-height:1.6;text-align:center;`,
    dialogueContainer: raw?.dialogue_container ?? `margin:18px 0;padding:14px;background:${spec.surface};border:1px solid ${border};border-radius:10px;`,
    dialogueTitle: raw?.dialogue_title ?? `margin:0 0 12px;color:${accent};font-size:16px;font-weight:800;line-height:1.4;`,
    dialogueItem: raw?.dialogue_item ?? "display:flex;margin:10px 0;gap:8px;align-items:flex-start;",
    dialogueItemLeft: raw?.dialogue_item_left ?? "justify-content:flex-start;",
    dialogueItemRight: raw?.dialogue_item_right ?? "justify-content:flex-end;",
    dialogueAvatarLeft: raw?.dialogue_avatar_left ?? `flex:0 0 auto;width:28px;height:28px;border-radius:50%;background:${accent};color:#fff;text-align:center;line-height:28px;font-size:12px;font-weight:700;`,
    dialogueAvatarRight: raw?.dialogue_avatar_right ?? `flex:0 0 auto;width:28px;height:28px;border-radius:50%;background:${spec.text};color:#fff;text-align:center;line-height:28px;font-size:12px;font-weight:700;`,
    dialogueBubbleLeft: raw?.dialogue_bubble_left ?? `max-width:82%;padding:9px 12px;background:${soft};border-radius:10px;color:${spec.text};font-size:15px;line-height:1.7;`,
    dialogueBubbleRight: raw?.dialogue_bubble_right ?? `max-width:82%;padding:9px 12px;background:${accent};border-radius:10px;color:#fff;font-size:15px;line-height:1.7;`,
  }
}

function deriveHeadingStyle(source: string | undefined, fontSize: string, fallback: string): string {
  if (!source) return fallback
  const withoutSize = source.replace(/font-size\s*:\s*[^;]+;?/i, "")
  const withoutWeight = withoutSize.replace(/font-weight\s*:\s*[^;]+;?/i, "")
  return `font-size:${fontSize};font-weight:600;${withoutWeight}`
}

function ensureCssDeclaration(style: string, property: string, value: string): string {
  if (hasCssDeclarationText(style, property)) return style
  return `${property}:${value};${style}`
}

function hasCssDeclarationText(style: string, property: string): boolean {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`(?:^|;)\\s*${escaped}\\s*:`, "i").test(style)
}

function rgbTriplet(color: string): string {
  const hex = color.replace("#", "")
  const normalized = hex.length === 3 ? hex.split("").map(char => char + char).join("") : hex.slice(0, 6)
  const n = Number.parseInt(normalized, 16)
  if (Number.isNaN(n)) return "0,0,0"
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}
function colorMix(color: string, alpha: number): string {
  if (color.startsWith("rgba(")) return color
  if (color.startsWith("rgb(")) return color.replace("rgb(", "rgba(").replace(")", `,${alpha})`)
  const hex = color.replace("#", "")
  const normalized = hex.length === 3 ? hex.split("").map(char => char + char).join("") : hex.slice(0, 6)
  const n = Number.parseInt(normalized, 16)
  if (Number.isNaN(n)) return `rgba(7,193,96,${alpha})`
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r},${g},${b},${alpha})`
}

export function getTheme(name: string): Theme {
  return themes[name] ?? themes.default
}

export function hasTheme(name: string): boolean {
  return Object.hasOwn(themes, name)
}

export function listThemes(): string[] {
  return THEME_SPECS.map(spec => spec.name)
}

export function listThemeReferences(): ThemeReference[] {
  return THEME_SPECS.map(spec => ({
    name: spec.name,
    description: spec.description,
    collection: spec.collection,
    displayName: THEME_DISPLAY_METADATA[spec.name]?.displayName ?? spec.displayName,
    bestFor: THEME_DISPLAY_METADATA[spec.name]?.bestFor ?? spec.bestFor,
    density: spec.density,
    contrast: spec.contrast,
    accent: spec.accent,
  }))
}

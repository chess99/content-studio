/**
 * 微信公众号排版主题
 *
 * 运行时只注册少量完整预设；自定义方向通过“版式 + 调色板”按需生成，
 * 不再把排列组合伪装成几十个独立主题。
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

export type ThemeLayout = "clean" | "centered" | "editorial" | "poster"
export type ThemePaletteName = "neutral" | "blue" | "green" | "red" | "warm" | "purple"

export interface ThemeLayoutReference {
  name: ThemeLayout
  displayName: string
  description: string
  bestFor: string
}

export interface ThemePaletteReference {
  name: ThemePaletteName
  displayName: string
  description: string
  accent: string
}

export type ThemeSelection =
  | { preset: string }
  | { layout: ThemeLayout; palette: ThemePaletteName }

export interface ResolvedThemeSelection {
  theme: Theme
  selection: ThemeSelection
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

export type ThemeCollection = "essential" | "expressive" | "custom"

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
  layout: ThemeLayout
}

const SOURCE_UPDATED_AT = "2026-07-30"

const READING_FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'PingFang SC','Helvetica Neue',Arial,sans-serif"
const READING_PARAGRAPH = "font-size:16px;line-height:1.82;margin:0 0 16px 0;"
const READING_LIST = "list-style:none;padding-left:0;margin:0 0 16px 0;"
const READING_LIST_ITEM = "display:block;margin:0.22em 8px;font-size:16px;line-height:1.82;"

const NAMED_THEME_SPECS: ThemeSpec[] = [
  named("default", "essential", "基础白", "#111827", "#ffffff", "#f8fafc", "#1f2937", "#667085", "#d0d5dd", "#f3f4f6", "中性白底基础排版，适合绝大多数文章", "知识文章、教程和通用长文", "low", "medium", "clean"),
  named("wechat-native", "essential", "微信原生", "#07c160", "#ffffff", "#f6fbfa", "#333333", "#767676", "#afd9c3", "#e1f1e9", "公众号原生绿，熟悉稳妥", "公众号运营与常规知识内容", "medium", "medium", "editorial"),
  named("github-readme", "essential", "GitHub", "#0969da", "#ffffff", "#f6f8fa", "#1f2328", "#75767a", "#b0cff3", "#e1edfb", "开发者蓝，README 气质", "技术教程、API 笔记与开发文档", "medium", "medium", "editorial"),
  named("nyt-classic", "essential", "报刊经典", "#326891", "#fdfaf6", "#f7f3ee", "#000000", "#757372", "#bccbd6", "#e5e8ea", "新闻纸蓝，严肃长文", "深度报道、评论与观点文章", "high", "medium", "centered"),
  named("ink-minimal", "essential", "水墨极简", "#111111", "#ffffff", "#fafafa", "#111111", "#767676", "#b3b3b3", "#e2e2e2", "黑白墨色，低干扰", "文字密集的随笔、札记与专栏", "low", "medium", "clean"),
  named("warm-editorial", "essential", "暖色编辑", "#a34e2e", "#faf9f5", "#f7f7f7", "#222222", "#737373", "#e3c6b9", "#f1e6df", "暖色刊物风，保留明确的人文气质", "叙事、人物、访谈与生活方式内容", "medium", "medium", "poster"),
  named("chinese", "expressive", "中国风", "#8b1e22", "#f8f4e9", "#f5eee3", "#333333", "#70706f", "#d5b0a9", "#ebdad1", "中式红与书卷气", "文化、节气与传统题材", "medium", "medium", "editorial"),
  named("bauhaus-primary", "expressive", "Bauhaus", "#004d9f", "#ffffff", "#f6fbfa", "#1a1a1a", "#767676", "#adc6e0", "#e0eaf3", "包豪斯主色，图形感强", "活动、发布与视觉专栏", "high", "high", "poster"),
  named("cyber", "expressive", "赛博朋克", "#f472b6", "#ffffff", "#fef8fb", "#333333", "#767676", "#d8caf9", "#f0ebfd", "赛博粉紫，高对比", "视觉科技、实验内容与活动专题", "high", "high", "poster"),
]

const THEME_LAYOUTS: ThemeLayoutReference[] = [
  { name: "clean", displayName: "清爽", description: "无底色标题与细分隔线，内容优先", bestFor: "知识文章、教程和通用长文" },
  { name: "centered", displayName: "居中", description: "标题居中并用上下线组织节奏", bestFor: "观点文章、章节清晰的长文" },
  { name: "editorial", displayName: "刊物", description: "左侧竖线与浅色标题块，层次更强", bestFor: "品牌故事、访谈和专题文章" },
  { name: "poster", displayName: "海报", description: "实色大标题与高对比强调", bestFor: "活动通知、发布与转化内容" },
]

const THEME_PALETTES: ThemePaletteReference[] = [
  { name: "neutral", displayName: "中性黑", description: "克制、通用", accent: "#344054" },
  { name: "blue", displayName: "品牌蓝", description: "专业、可信", accent: "#2563EB" },
  { name: "green", displayName: "自然绿", description: "清新、稳健", accent: "#168A67" },
  { name: "red", displayName: "强调红", description: "醒目、传播", accent: "#D64545" },
  { name: "warm", displayName: "暖橙", description: "亲和、叙事", accent: "#C87832" },
  { name: "purple", displayName: "情绪紫", description: "柔和、创意", accent: "#7C5CC4" },
]

const GALLERY_ADVANCED_PALETTES: Record<string, ThemeAdvancedPalette> = {
  "default": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f8fafc", accentSoft: "#f3f4f6", accentSofter: "#e5e7eb", accentDark: "#111827", border: "#d0d5dd", muted: "#667085", text: "#344054", textStrong: "#101828", mutedBorder: "rgba(152, 162, 179, 0.18)" },
  "warm-editorial": { background: "#faf9f5", surface: "#faf9f5", surfaceAlt: "#f7f7f7", accentSoft: "#f1e6df", accentSofter: "#ecd9d0", accentDark: "#b3593b", border: "#e3c6b9", muted: "#737373", text: "#555555", textStrong: "#222222", mutedBorder: "rgba(202, 202, 199, 0.18)" },
  "chinese": { background: "#f8f4e9", surface: "#f8f4e9", surfaceAlt: "#f5eee3", accentSoft: "#ebdad1", accentSofter: "#e2c9c1", accentDark: "#8b1e22", border: "#d5b0a9", muted: "#70706f", text: "#8b1e22", textStrong: "#333333" },
  "cyber": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fef8fb", accentSoft: "#f0ebfd", accentSofter: "#e7defb", accentDark: "#8659ed", border: "#d8caf9", muted: "#767676", text: "#595959", textStrong: "#333333" },
  "wechat-native": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f6fbfa", accentSoft: "#e1f1e9", accentSofter: "#cde7da", accentDark: "#058844", border: "#afd9c3", muted: "#767676", text: "#163325", textStrong: "#333333" },
  "nyt-classic": { background: "#fdfaf6", surface: "#fdfaf6", surfaceAlt: "#f7f3ee", accentSoft: "#e5e8ea", accentSofter: "#d4dde2", accentDark: "#326891", border: "#bccbd6", muted: "#757372", text: "#111111", textStrong: "#000000" },
  "github-readme": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f6f8fa", accentSoft: "#e1edfb", accentSofter: "#cee1f8", accentDark: "#0969da", border: "#b0cff3", muted: "#75767a", text: "#1f2328", textStrong: "#1f2328" },
  "ink-minimal": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#fafafa", accentSoft: "#e2e2e2", accentSofter: "#cfcfcf", accentDark: "#111111", border: "#b3b3b3", muted: "#767676", text: "#000000", textStrong: "#111111" },
  "bauhaus-primary": { background: "#ffffff", surface: "#ffffff", surfaceAlt: "#f6fbfa", accentSoft: "#e0eaf3", accentSofter: "#ccdbec", accentDark: "#004d9f", border: "#adc6e0", muted: "#767676", text: "#595959", textStrong: "#1a1a1a" },
}

const MD2_NAMED_RAW_STYLES = {
  "warm-editorial": {
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

const THEME_SPECS: ThemeSpec[] = NAMED_THEME_SPECS

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
  layout: ThemeLayout = "clean",
): ThemeSpec {
  return { name, collection, displayName, accent, background, surface, text, muted, border, codeBackground, description, bestFor, density, contrast, layout }
}

function createTheme(spec: ThemeSpec): Theme {
  return {
    name: spec.name,
    description: spec.description,
    styles: createStyles(spec),
    collection: spec.collection,
    displayName: spec.displayName,
    bestFor: spec.bestFor,
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
  switch (spec.layout) {
    case "clean":
      return `font-size: 28px; font-weight: 800; color: ${primary}; margin-top: 0; margin-bottom: 28px; line-height: 1.4em; word-break: break-all; letter-spacing: -0.03em; font-family: ${READING_FONT_FAMILY};`
    case "centered":
      return `font-size: 26px; font-weight: 700; color: ${primary}; line-height: 1.4; margin-top: 0; margin-bottom: 28px; word-break: break-all; padding: 16px 0; text-align: center; background-image: linear-gradient(to right, transparent, ${primary}, transparent), linear-gradient(to right, transparent, ${primary}, transparent); background-size: 100% 1px, 100% 1px; background-position: center top, center bottom; background-repeat: no-repeat; font-family: ${READING_FONT_FAMILY};`
    case "editorial":
      return `font-size: 26px; font-weight: 700; color: ${primary}; margin-top: 0; margin-bottom: 28px; line-height: 1.4em; word-break: break-all; padding-left: 8px; padding-bottom: 4px; letter-spacing: 0.5px; border-left: 5px solid ${primary}; border-bottom: 1px solid ${primary}; font-family: ${READING_FONT_FAMILY};`
    case "poster":
      return `font-size: 26px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 28px; line-height: 1.4em; word-break: break-all; background-color: ${primary}; padding: 16px 24px; border-radius: 16px; box-shadow: 0 4px 12px rgba(${rgb}, 0.25); font-family: ${READING_FONT_FAMILY};`
    default:
      return `margin: 1.5em 8px 0.75em 0px; padding: 0.8em 1.5em; background: ${primary}; font-size: 22px; font-weight: bold; line-height: 1.2; color: #ffffff; text-align: center; border-radius: 8px; box-shadow: 0 2px 8px ${colorMix(primary, 0.2)};`
  }
}

function templateH2(spec: ThemeSpec): string {
  const primary = spec.accent
  switch (spec.layout) {
    case "clean":
      return `font-size: 22px; font-weight: 700; color: ${primary}; margin-top: 0; margin-bottom: 22px; line-height: 1.45; word-break: break-all; border-bottom: 1px solid ${colorMix(primary, 0.28)}; padding-bottom: 6px;`
    case "centered":
      return `font-size: 22px; font-weight: 700; color: ${primary}; margin-top: 0; margin-bottom: 22px; line-height: 1.45; text-align: center; word-break: break-all;`
    case "editorial":
      return `font-size: 22px; font-weight: 700; color: ${spec.text}; margin-top: 0; margin-bottom: 22px; line-height: 1.45; padding: 8px 12px; border-left: 4px solid ${primary}; background: ${colorMix(primary, 0.08)};`
    case "poster":
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
  const radius = spec.layout === "clean" || spec.name === "ink-minimal" ? "2px" : "8px"
  const shadow = spec.layout === "poster" || spec.layout === "editorial" ? `box-shadow:0 6px 18px ${colorMix(spec.accent, 0.10)};` : ""
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

export function createCustomTheme(layoutName: string, paletteName: string): Theme {
  const layout = THEME_LAYOUTS.find(item => item.name === layoutName)
  if (!layout) throw new Error(`未知版式: ${layoutName}`)
  const palette = THEME_PALETTES.find(item => item.name === paletteName)
  if (!palette) throw new Error(`未知调色板: ${paletteName}`)

  const spec = named(
    `custom:${layout.name}:${palette.name}`,
    "custom",
    `${layout.displayName} · ${palette.displayName}`,
    palette.accent,
    "#ffffff",
    "#ffffff",
    "#2c2c2c",
    "#667085",
    colorMix(palette.accent, 0.28),
    colorMix(palette.accent, 0.10),
    `${layout.description}；${palette.description}`,
    layout.bestFor,
    layout.name === "clean" ? "low" : "medium",
    layout.name === "poster" ? "high" : "medium",
    layout.name,
  )
  return createTheme(spec)
}

export function hasThemeLayout(name: string): name is ThemeLayout {
  return THEME_LAYOUTS.some(item => item.name === name)
}

export function hasThemePalette(name: string): name is ThemePaletteName {
  return THEME_PALETTES.some(item => item.name === name)
}

export function resolveThemeSelection(value: unknown, defaultPreset = "default"): ResolvedThemeSelection {
  if (value === undefined || value === null) {
    if (!hasTheme(defaultPreset)) throw new Error(`未知主题预设: ${defaultPreset}`)
    return { theme: getTheme(defaultPreset), selection: { preset: defaultPreset } }
  }
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("theme 必须是 { preset } 或 { layout, palette }")
  }

  const input = value as Record<string, unknown>
  const preset = typeof input.preset === "string" ? input.preset.trim() : ""
  const layout = typeof input.layout === "string" ? input.layout.trim() : ""
  const palette = typeof input.palette === "string" ? input.palette.trim() : ""

  if (preset && !layout && !palette) {
    if (!hasTheme(preset)) throw new Error(`未知主题预设: ${preset}`)
    return { theme: getTheme(preset), selection: { preset } }
  }
  if (!preset && layout && palette) {
    if (!hasThemeLayout(layout)) throw new Error(`未知版式: ${layout}`)
    if (!hasThemePalette(palette)) throw new Error(`未知调色板: ${palette}`)
    return {
      theme: createCustomTheme(layout, palette),
      selection: { layout, palette },
    }
  }
  throw new Error("theme 必须只提供 preset，或同时提供 layout 和 palette")
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
    displayName: spec.displayName,
    bestFor: spec.bestFor,
    density: spec.density,
    contrast: spec.contrast,
    accent: spec.accent,
  }))
}

export function listThemeLayouts(): ThemeLayoutReference[] {
  return THEME_LAYOUTS.map(item => ({ ...item }))
}

export function listThemePalettes(): ThemePaletteReference[] {
  return THEME_PALETTES.map(item => ({ ...item }))
}

/**
 * 微信公众号排版主题
 *
 * 公众号正文嵌在平台固定的白色标题区和页面边距之中，因此主题不使用整页底色
 * 建立辨识度。所有预设共享纯白画布与正文阅读基线，只通过标题结构、字体气质、
 * 规则线、局部强调、引用、代码和表格表达差异。
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

export type ThemeCollection = "essential" | "custom"

type HeadingFont = "sans" | "serif"
type Shape = "square" | "soft"

interface ThemeSpec {
  name: string
  collection: ThemeCollection
  displayName: string
  accent: string
  accentText: string
  background: "#ffffff"
  surface: "#ffffff"
  surfaceAlt: string
  text: string
  textStrong: string
  muted: string
  border: string
  codeBackground: string
  description: string
  bestFor: string
  density: "low" | "medium" | "high"
  contrast: "low" | "medium" | "high"
  layout: ThemeLayout
  headingFont: HeadingFont
  shape: Shape
}

const SOURCE_UPDATED_AT = "2026-08-18"
const READING_FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'PingFang SC','Helvetica Neue',Arial,sans-serif"
const SERIF_HEADING_FAMILY = "'Songti SC','Noto Serif CJK SC','Source Han Serif SC',Georgia,'Times New Roman',serif"
const READING_PARAGRAPH = "font-size:16px;line-height:1.82;margin:0 0 16px 0;"
const READING_LIST = "list-style:none;padding-left:0;margin:0 0 16px 0;"
const READING_LIST_ITEM = "display:block;margin:0.22em 8px;font-size:16px;line-height:1.82;"

const NAMED_THEME_SPECS: ThemeSpec[] = [
  {
    name: "default",
    collection: "essential",
    displayName: "基础白",
    accent: "#111827",
    accentText: "#111827",
    background: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: "#f7f8fa",
    text: "#2b2f36",
    textStrong: "#171a1f",
    muted: "#667085",
    border: "#d9dee7",
    codeBackground: "#f6f8fa",
    description: "纯白画布与中性黑灰，用细线建立稳定层级",
    bestFor: "知识文章、教程和绝大多数通用长文",
    density: "low",
    contrast: "medium",
    layout: "clean",
    headingFont: "sans",
    shape: "soft",
  },
  {
    name: "wechat-native",
    collection: "essential",
    displayName: "微信原生",
    accent: "#07c160",
    accentText: "#067647",
    background: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: "#f7faf8",
    text: "#2b2f36",
    textStrong: "#1f2937",
    muted: "#667085",
    border: "#c7ddd2",
    codeBackground: "#f3f8f5",
    description: "保留熟悉的微信绿，只用于标记线和关键动作",
    bestFor: "公众号运营、服务说明与常规知识内容",
    density: "medium",
    contrast: "medium",
    layout: "editorial",
    headingFont: "sans",
    shape: "soft",
  },
  {
    name: "github-readme",
    collection: "essential",
    displayName: "技术简报",
    accent: "#0969da",
    accentText: "#0550ae",
    background: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: "#f7f9fc",
    text: "#24292f",
    textStrong: "#111827",
    muted: "#667085",
    border: "#c9d7ee",
    codeBackground: "#f6f8fa",
    description: "蓝色导航标记、紧凑标题和清晰代码结构",
    bestFor: "技术教程、产品说明、API 笔记与开发文档",
    density: "medium",
    contrast: "medium",
    layout: "editorial",
    headingFont: "sans",
    shape: "square",
  },
  {
    name: "nyt-classic",
    collection: "essential",
    displayName: "深度阅读",
    accent: "#326891",
    accentText: "#1d4f73",
    background: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: "#f8f8f7",
    text: "#242424",
    textStrong: "#111111",
    muted: "#6b6b6b",
    border: "#cdd3da",
    codeBackground: "#f5f6f7",
    description: "宋体标题、居中规则线与冷静的报刊节奏",
    bestFor: "深度报道、评论、研究与长篇观点文章",
    density: "high",
    contrast: "medium",
    layout: "centered",
    headingFont: "serif",
    shape: "square",
  },
  {
    name: "ink-minimal",
    collection: "essential",
    displayName: "墨线札记",
    accent: "#111111",
    accentText: "#111111",
    background: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: "#fafafa",
    text: "#222222",
    textStrong: "#0a0a0a",
    muted: "#666666",
    border: "#d4d4d4",
    codeBackground: "#f5f5f5",
    description: "黑白、宋体标题与克制墨线，几乎不使用色彩",
    bestFor: "随笔、札记、书评与文字密集型专栏",
    density: "low",
    contrast: "medium",
    layout: "clean",
    headingFont: "serif",
    shape: "square",
  },
  {
    name: "warm-editorial",
    collection: "essential",
    displayName: "人文暖调",
    accent: "#a34e2e",
    accentText: "#8a3d28",
    background: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: "#fbf8f6",
    text: "#2d2926",
    textStrong: "#1e1b19",
    muted: "#726760",
    border: "#ddcfc8",
    codeBackground: "#f8f5f3",
    description: "陶土色规则线与温和黑灰，保留人文气质而不染画布",
    bestFor: "人物、访谈、叙事与生活方式内容",
    density: "medium",
    contrast: "medium",
    layout: "poster",
    headingFont: "sans",
    shape: "soft",
  },
]

const THEME_LAYOUTS: ThemeLayoutReference[] = [
  { name: "clean", displayName: "清爽", description: "标题下细线，最少视觉干预", bestFor: "知识文章、教程和通用长文" },
  { name: "centered", displayName: "居中", description: "居中标题与上下规则线", bestFor: "观点文章、序言和章节清晰的长文" },
  { name: "editorial", displayName: "刊物", description: "左侧标记线与明确层级", bestFor: "技术、品牌故事、访谈和专题" },
  { name: "poster", displayName: "信号", description: "顶部粗线与大字标题，不使用实色底", bestFor: "活动通知、发布与重点内容" },
]

const THEME_PALETTES: ThemePaletteReference[] = [
  { name: "neutral", displayName: "中性黑", description: "克制、通用", accent: "#344054" },
  { name: "blue", displayName: "专业蓝", description: "专业、可信", accent: "#175cd3" },
  { name: "green", displayName: "稳健绿", description: "清新、稳定", accent: "#087a45" },
  { name: "red", displayName: "信号红", description: "醒目、明确", accent: "#b42318" },
  { name: "warm", displayName: "陶土", description: "亲和、叙事", accent: "#9a442c" },
  { name: "purple", displayName: "编辑紫", description: "柔和、创意", accent: "#6941c6" },
]

const THEME_SPECS: ThemeSpec[] = NAMED_THEME_SPECS

export const themes: Record<string, Theme> = Object.fromEntries(
  THEME_SPECS.map(spec => [spec.name, createTheme(spec)]),
)

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
    advancedPalette: createAdvancedPalette(spec),
    sourceUpdatedAt: SOURCE_UPDATED_AT,
  }
}

function createAdvancedPalette(spec: ThemeSpec): ThemeAdvancedPalette {
  return {
    background: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: spec.surfaceAlt,
    accentSoft: colorMix(spec.accent, 0.06),
    accentSofter: colorMix(spec.accent, 0.12),
    accentDark: spec.accentText,
    border: spec.border,
    muted: spec.muted,
    text: spec.text,
    textStrong: spec.textStrong,
    mutedBorder: colorMix(spec.text, 0.12),
  }
}

function createStyles(spec: ThemeSpec): NodeStyles {
  const radius = spec.shape === "soft" ? "8px" : "2px"
  const soft = colorMix(spec.accent, 0.06)
  const inlineCode = defaultInlineCode(spec, radius)
  const pre = defaultPre(spec, radius)
  const link = defaultLink(spec)

  return {
    wrapper: `font-family:${READING_FONT_FAMILY};max-width:677px;margin:0 auto;padding:0;background:#ffffff;color:${spec.text};`,
    h1: themeH1(spec),
    h2: themeH2(spec),
    h3: `font-family:${headingFamily(spec)};font-size:19px;font-weight:700;color:${spec.textStrong};line-height:1.48;margin:28px 0 14px;word-break:break-word;`,
    h4: `font-family:${headingFamily(spec)};font-size:17px;font-weight:700;color:${spec.accentText};line-height:1.5;margin:24px 0 12px;word-break:break-word;`,
    h5: `font-size:16px;font-weight:650;color:${spec.textStrong};line-height:1.5;margin:20px 0 10px;word-break:break-word;`,
    h6: `font-size:15px;font-weight:650;color:${spec.muted};line-height:1.5;margin:18px 0 8px;word-break:break-word;`,
    p: `${READING_PARAGRAPH}color:${spec.text};`,
    strong: `font-weight:700;color:${spec.accentText};`,
    em: `font-style:italic;color:${spec.muted};`,
    code: inlineCode,
    codespan: inlineCode,
    pre,
    codePre: pre,
    preCode: defaultPreCode(spec),
    blockquote: `margin:22px 0;padding:12px 0 12px 16px;background:#ffffff;border-left:3px solid ${spec.accent};border-top:1px solid ${soft};border-bottom:1px solid ${soft};color:${spec.muted};font-size:15px;line-height:1.82;`,
    blockquoteP: `margin:0;color:${spec.muted};font-size:15px;line-height:1.82;background:transparent;`,
    ...alertStyles(spec),
    ul: READING_LIST,
    ol: READING_LIST,
    li: `${READING_LIST_ITEM}color:${spec.text};`,
    hr: `border:none;border-top:1px solid ${spec.border};width:32%;margin:32px auto;`,
    img: `max-width:100%;height:auto;display:block;margin:0 auto;border-radius:${spec.shape === "soft" ? "6px" : "0"};`,
    figure: "margin:20px 0;text-align:center;",
    figcaption: `margin:8px 0 0;color:${spec.muted};font-size:13px;line-height:1.6;text-align:center;`,
    a: link,
    wxLink: `${link}border-bottom:none;`,
    footnotes: `margin-top:2em;padding-top:1.5em;border-top:1px solid ${spec.border};`,
    footnoteItem: `margin:0 0 8px;color:${spec.muted};font-size:14px;line-height:1.7;`,
    ...mediaModuleStyles(spec, radius),
    table: "width:100%;border-collapse:collapse;margin:18px 0;font-size:14px;background:#ffffff;",
    th: `background:${spec.surfaceAlt};font-weight:750;padding:9px 12px;border:1px solid ${spec.border};text-align:left;color:${spec.textStrong};`,
    td: `padding:9px 12px;border:1px solid ${spec.border};color:${spec.text};background:#ffffff;`,
  }
}

function headingFamily(spec: ThemeSpec): string {
  return spec.headingFont === "serif" ? SERIF_HEADING_FAMILY : READING_FONT_FAMILY
}

function themeH1(spec: ThemeSpec): string {
  const common = `font-family:${headingFamily(spec)};font-size:26px;font-weight:750;color:${spec.textStrong};line-height:1.42;margin:34px 0 26px;word-break:break-word;`
  switch (spec.layout) {
    case "centered":
      return `${common}padding:12px 0 14px;text-align:center;border-top:1px solid ${spec.accent};border-bottom:1px solid ${spec.accent};`
    case "editorial":
      return `${common}padding:1px 0 2px 12px;border-left:3px solid ${spec.accent};`
    case "poster":
      return `${common}padding:12px 0 10px;border-top:6px solid ${spec.accent};border-bottom:1px solid ${spec.border};`
    case "clean":
    default:
      return `${common}padding-bottom:10px;border-bottom:2px solid ${spec.accent};`
  }
}

function themeH2(spec: ThemeSpec): string {
  const common = `font-family:${headingFamily(spec)};font-size:22px;font-weight:720;color:${spec.textStrong};line-height:1.5;margin:32px 0 18px;word-break:break-word;`
  switch (spec.layout) {
    case "centered":
      return `${common}text-align:center;color:${spec.accentText};`
    case "editorial":
      return `${common}padding-left:10px;border-left:3px solid ${spec.accent};`
    case "poster":
      return `${common}padding-top:8px;border-top:3px solid ${spec.accent};`
    case "clean":
    default:
      return `${common}padding-bottom:6px;border-bottom:1px solid ${spec.border};`
  }
}

function defaultInlineCode(spec: ThemeSpec, radius: string): string {
  return `font-family:Menlo,Monaco,Consolas,'Courier New',monospace;font-size:90%;line-height:1.4;background:${spec.codeBackground};padding:2px 6px;border-radius:${radius};color:${spec.accentText};border:1px solid ${spec.border};`
}

function defaultPre(spec: ThemeSpec, radius: string): string {
  return `display:block;box-sizing:border-box;background:${spec.codeBackground};border-radius:${radius};padding:16px 18px;margin:20px 0;overflow-x:auto;border:1px solid ${spec.border};border-left:3px solid ${spec.accent};box-shadow:none;-webkit-overflow-scrolling:touch;tab-size:2;`
}

function defaultPreCode(spec: ThemeSpec): string {
  return `font-family:Menlo,Monaco,Consolas,'Courier New',monospace;font-size:14px;color:${spec.text};background:none;padding:0;border-radius:0;display:block;line-height:1.62;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;`
}

function defaultLink(spec: ThemeSpec): string {
  return `color:${spec.accentText};text-decoration:none;font-weight:650;border-bottom:1px solid ${spec.border};word-break:break-all;overflow-wrap:anywhere;white-space:normal;`
}

function alertStyles(spec: ThemeSpec): Partial<NodeStyles> {
  const note = spec.accentText
  const tip = "#217a4d"
  const important = "#6941c6"
  const warning = "#a15c00"
  const caution = "#b42318"
  return {
    blockquoteNote: alertBox(note),
    blockquoteTip: alertBox(tip),
    blockquoteImportant: alertBox(important),
    blockquoteWarning: alertBox(warning),
    blockquoteCaution: alertBox(caution),
    blockquoteTitle: "margin:0 0 8px;font-size:15px;font-weight:750;line-height:1.5;",
    blockquoteTitleNote: `color:${note};`,
    blockquoteTitleTip: `color:${tip};`,
    blockquoteTitleImportant: `color:${important};`,
    blockquoteTitleWarning: `color:${warning};`,
    blockquoteTitleCaution: `color:${caution};`,
    blockquotePNote: alertParagraph(),
    blockquotePTip: alertParagraph(),
    blockquotePImportant: alertParagraph(),
    blockquotePWarning: alertParagraph(),
    blockquotePCaution: alertParagraph(),
  }
}

function alertBox(color: string): string {
  const rule = colorMix(color, 0.22)
  return `margin:22px 0;padding:12px 0 12px 16px;background:#ffffff;border-left:3px solid ${color};border-top:1px solid ${rule};border-bottom:1px solid ${rule};color:#3c3c3c;`
}

function alertParagraph(): string {
  return "margin:0 0 8px;font-size:15px;line-height:1.72;color:#3c3c3c;background:transparent;"
}

function mediaModuleStyles(spec: ThemeSpec, radius: string): Partial<NodeStyles> {
  const soft = colorMix(spec.accent, 0.06)
  return {
    galleryContainer: `margin:20px 0;padding:10px 0;border-top:1px solid ${spec.border};border-bottom:1px solid ${spec.border};background:#ffffff;`,
    galleryImageContainer: `margin:0 0 10px;overflow:hidden;border-radius:${radius};`,
    galleryCaption: `margin:6px 0 0;color:${spec.muted};font-size:13px;line-height:1.6;text-align:center;`,
    longimageContainer: `margin:20px 0;padding:10px;border:1px solid ${spec.border};background:#ffffff;border-radius:${radius};`,
    longimageImageContainer: `margin:0;overflow:hidden;border-radius:${radius};`,
    longimageCaption: `margin:8px 0 0;color:${spec.muted};font-size:13px;line-height:1.6;text-align:center;`,
    dialogueContainer: `margin:20px 0;padding:14px 0;background:#ffffff;border-top:1px solid ${spec.border};border-bottom:1px solid ${spec.border};`,
    dialogueTitle: `margin:0 0 12px;color:${spec.accentText};font-size:16px;font-weight:750;line-height:1.4;`,
    dialogueItem: "display:flex;margin:10px 0;gap:8px;align-items:flex-start;",
    dialogueItemLeft: "justify-content:flex-start;",
    dialogueItemRight: "justify-content:flex-end;",
    dialogueAvatarLeft: `flex:0 0 auto;width:28px;height:28px;border-radius:50%;background:${spec.accentText};color:#fff;text-align:center;line-height:28px;font-size:12px;font-weight:700;`,
    dialogueAvatarRight: `flex:0 0 auto;width:28px;height:28px;border-radius:50%;background:${spec.text};color:#fff;text-align:center;line-height:28px;font-size:12px;font-weight:700;`,
    dialogueBubbleLeft: `max-width:82%;padding:9px 12px;background:${spec.surfaceAlt};border:1px solid ${spec.border};border-radius:${radius};color:${spec.text};font-size:15px;line-height:1.7;`,
    dialogueBubbleRight: `max-width:82%;padding:9px 12px;background:${soft};border-left:3px solid ${spec.accent};border-radius:${radius};color:${spec.text};font-size:15px;line-height:1.7;`,
  }
}

function colorMix(color: string, alpha: number): string {
  if (color.startsWith("rgba(")) return color
  if (color.startsWith("rgb(")) return color.replace("rgb(", "rgba(").replace(")", `,${alpha})`)
  const hex = color.replace("#", "")
  const normalized = hex.length === 3 ? hex.split("").map(char => char + char).join("") : hex.slice(0, 6)
  const n = Number.parseInt(normalized, 16)
  if (Number.isNaN(n)) return `rgba(7,193,96,${alpha})`
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`
}

export function createCustomTheme(layoutName: string, paletteName: string): Theme {
  const layout = THEME_LAYOUTS.find(item => item.name === layoutName)
  if (!layout) throw new Error(`未知版式: ${layoutName}`)
  const palette = THEME_PALETTES.find(item => item.name === paletteName)
  if (!palette) throw new Error(`未知调色板: ${paletteName}`)

  return createTheme({
    name: `custom:${layout.name}:${palette.name}`,
    collection: "custom",
    displayName: `${layout.displayName} · ${palette.displayName}`,
    accent: palette.accent,
    accentText: palette.accent,
    background: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: "#f8f9fb",
    text: "#2c2c2c",
    textStrong: "#171a1f",
    muted: "#667085",
    border: colorMix(palette.accent, 0.28),
    codeBackground: colorMix(palette.accent, 0.05),
    description: `${layout.description}；${palette.description}`,
    bestFor: layout.bestFor,
    density: layout.name === "clean" ? "low" : "medium",
    contrast: layout.name === "poster" ? "high" : "medium",
    layout: layout.name,
    headingFont: layout.name === "centered" ? "serif" : "sans",
    shape: layout.name === "centered" ? "square" : "soft",
  })
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

import { describe, expect, it } from "vitest"
import { convertMarkdown } from "../src/converter/index.js"
import {
  createCustomTheme,
  getTheme,
  listThemeLayouts,
  listThemePalettes,
  listThemes,
  resolveThemeSelection,
} from "../src/converter/themes.js"
import { getAdvancedPalette } from "../src/converter/advanced-layout/styles.js"

const PRESETS = [
  "default",
  "wechat-native",
  "github-readme",
  "nyt-classic",
  "ink-minimal",
  "warm-editorial",
]

describe("curated theme system", () => {
  it("keeps six purposeful presets instead of decorative variants", () => {
    expect(listThemes()).toEqual(PRESETS)
    expect(listThemes()).toHaveLength(6)
    expect(listThemes()).not.toContain("bold-red")
    expect(listThemes()).not.toContain("cyber")
  })

  it("exposes four layouts and six palettes as customization parameters", () => {
    expect(listThemeLayouts().map(item => item.name)).toEqual(["clean", "centered", "editorial", "poster"])
    expect(listThemePalettes().map(item => item.name)).toEqual(["neutral", "blue", "green", "red", "warm", "purple"])
  })

  it("keeps the default theme neutral, white, and free of decorative backgrounds", () => {
    const theme = getTheme("default")

    expect(theme.accent).toBe("#111827")
    expect(theme.styles.wrapper).toContain("background:#ffffff")
    expect(theme.styles.h1).not.toContain("background")
    expect(theme.styles.h1).not.toContain("border-left")
    expect(theme.styles.h2).toContain("border-bottom:1px solid")
    expect(theme.styles.p).toContain("font-size:16px")
    expect(theme.styles.p).toContain("line-height:1.82")
  })

  it("creates genuinely different layout structures from the same palette", () => {
    const clean = createCustomTheme("clean", "blue")
    const centered = createCustomTheme("centered", "blue")
    const editorial = createCustomTheme("editorial", "blue")
    const poster = createCustomTheme("poster", "blue")

    expect(clean.name).toBe("custom:clean:blue")
    expect(clean.styles.h1).not.toContain("background")
    expect(centered.styles.h1).toContain("text-align:center")
    expect(centered.styles.h1).toContain("border-top:1px solid")
    expect(editorial.styles.h1).toContain("border-left:3px")
    expect(editorial.styles.h2).not.toContain("background")
    expect(poster.styles.h1).toContain("border-top:6px solid")
    expect(poster.styles.h1).not.toContain("background")
  })

  it("uses a strict structured selection contract for API callers", () => {
    expect(resolveThemeSelection({ preset: "github-readme" }).selection).toEqual({ preset: "github-readme" })
    expect(resolveThemeSelection({ layout: "editorial", palette: "blue" }).selection).toEqual({ layout: "editorial", palette: "blue" })
    expect(() => resolveThemeSelection("github-readme")).toThrow("theme 必须是 { preset } 或 { layout, palette }")
    expect(() => resolveThemeSelection({ preset: "archived-theme" })).toThrow("未知主题预设: archived-theme")
    expect(() => resolveThemeSelection({ layout: "editorial" })).toThrow("同时提供 layout 和 palette")
  })

  it("keeps product metadata concise and grouped by decision importance", () => {
    expect(getTheme("default")).toMatchObject({ displayName: "基础白", collection: "essential", accent: "#111827" })
    expect(getTheme("github-readme").displayName).toBe("技术简报")
    expect(getTheme("nyt-classic").displayName).toBe("深度阅读")
    expect(getTheme("github-readme").bestFor).toContain("技术教程")
    expect(getTheme("warm-editorial").displayName).toBe("人文暖调")
  })

  it("keeps every preset on a white canvas with no filled heading or heading shadow", () => {
    for (const name of PRESETS) {
      const theme = getTheme(name)
      const palette = getAdvancedPalette(theme)

      expect(theme.styles.wrapper).toContain("background:#ffffff")
      expect(theme.styles.wrapper).toContain("padding:0;")
      expect(theme.styles.wrapper).not.toContain("padding:0 16px")
      expect(theme.styles.h1).not.toMatch(/background|box-shadow/)
      expect(theme.styles.h2).not.toMatch(/background|box-shadow/)
      expect(palette.background).toBe("#ffffff")
      expect(palette.surface).toBe("#ffffff")
    }
  })

  it("uses text accents that meet WCAG AA contrast on white", () => {
    for (const name of PRESETS) {
      const accentText = getAdvancedPalette(getTheme(name)).accentDark
      expect(contrastRatio(accentText, "#ffffff")).toBeGreaterThanOrEqual(4.5)
    }
  })

  it("converts ordinary content and advanced modules with every preset and custom combination", async () => {
    const markdown = [
      "# 标题",
      "",
      "正文包含 **重点** 和 `code`。",
      "",
      "- 无序一",
      "- 无序二",
      "",
      ":::callout[提示]",
      "类型 | 标题 | 内容",
      ":::",
    ].join("\n")
    const themes = [
      ...PRESETS.map(getTheme),
      ...listThemeLayouts().flatMap(layout => listThemePalettes().map(palette => createCustomTheme(layout.name, palette.name))),
    ]

    for (const theme of themes) {
      const result = await convertMarkdown(markdown, { themeDefinition: theme, stripLinks: false })
      expect(result.html).toContain("标题")
      expect(result.html).toContain('data-mpa-action-id="callout"')
      expect(result.html).toContain('data-wxp-list="unordered"')
      expect(result.html).not.toMatch(/<(ul|ol|li)\b/)
      expect(result.html).not.toContain("linear-gradient(")
      expect(result.html).not.toMatch(/box-shadow:(?!none)/)
    }
  })

  it("preserves extended headings, links, figures, and safe wrapping", async () => {
    const markdown = [
      "# 标题",
      "",
      "##### 五级标题",
      "",
      "> 引用段落",
      "",
      "正文包含 `inline`、[普通链接](https://example.com) 和 [微信链接](https://mp.weixin.qq.com/s/demo)。",
      "",
      "![图片说明](https://example.com/a.png)",
    ].join("\n")
    const result = await convertMarkdown(markdown, { theme: "github-readme", stripLinks: false })

    expect(result.html).toContain("<h5")
    expect(result.html).toContain('class="inline-code"')
    expect(result.html).toContain("word-break:break-all")
    expect(result.html).toContain("border-bottom:none")
    expect(result.html).toContain("<figure")
    expect(result.html).toContain("<figcaption")
  })
})

function contrastRatio(foreground: string, background: string): number {
  const values = [foreground, background].map(relativeLuminance)
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05)
}

function relativeLuminance(color: string): number {
  const hex = color.replace("#", "")
  const channels = [0, 2, 4].map(index => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
  const [r, g, b] = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

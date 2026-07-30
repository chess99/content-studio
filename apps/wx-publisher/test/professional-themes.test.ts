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

const PRESETS = [
  "default",
  "wechat-native",
  "github-readme",
  "nyt-classic",
  "ink-minimal",
  "warm-editorial",
  "chinese",
  "bauhaus-primary",
  "cyber",
]

describe("curated theme system", () => {
  it("exposes nine memorable presets instead of a generated theme matrix", () => {
    expect(listThemes()).toEqual(PRESETS)
    expect(listThemes()).toHaveLength(9)
    expect(listThemes()).not.toContain("bold-red")
    expect(listThemes()).not.toContain("minimal-blue")
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
    expect(theme.styles.h2).toContain("border-bottom: 1px solid")
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
    expect(centered.styles.h1).toContain("text-align: center")
    expect(centered.styles.h1).toContain("background-position: center top, center bottom")
    expect(editorial.styles.h1).toContain("border-left: 5px")
    expect(editorial.styles.h2).toContain("background: rgba(37,99,235,0.08)")
    expect(poster.styles.h1).toContain("background-color: #2563EB")
    expect(poster.styles.h1).toContain("color: #ffffff")
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
    expect(getTheme("github-readme").bestFor).toContain("技术教程")
    expect(getTheme("chinese")).toMatchObject({ displayName: "中国风", collection: "expressive" })
    expect(getTheme("bauhaus-primary").contrast).toBe("high")
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

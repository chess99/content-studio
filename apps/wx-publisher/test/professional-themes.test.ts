import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { convertMarkdown } from "../src/converter/index.js"
import { getTheme, listThemes } from "../src/converter/themes.js"

const THEMES_SOURCE = new URL("../src/converter/themes.ts", import.meta.url)

const PROFESSIONAL_THEMES = [
  "default",
  "warm-editorial",
  "bytedance",
  "apple",
  "sports",
  "chinese",
  "cyber",
  "wechat-native",
  "nyt-classic",
  "github-readme",
  "sspai-red",
  "mint-fresh",
  "sunset-amber",
  "ink-minimal",
  "lavender-dream",
  "coffee-house",
  "bauhaus-primary",
  "minimal-gold",
  "minimal-green",
  "minimal-blue",
  "minimal-orange",
  "minimal-red",
  "minimal-navy",
  "minimal-gray",
  "minimal-sky",
  "focus-gold",
  "focus-green",
  "focus-blue",
  "focus-orange",
  "focus-red",
  "focus-navy",
  "focus-gray",
  "focus-sky",
  "elegant-gold",
  "elegant-green",
  "elegant-blue",
  "elegant-orange",
  "elegant-red",
  "elegant-navy",
  "elegant-gray",
  "elegant-sky",
  "bold-gold",
  "bold-green",
  "bold-blue",
  "bold-orange",
  "bold-red",
  "bold-navy",
  "bold-gray",
  "bold-sky",
]

describe("professional theme matrix", () => {
  it("exposes the curated product theme catalog", () => {
    const themes = listThemes()

    expect(themes).toEqual(PROFESSIONAL_THEMES)
    for (const theme of PROFESSIONAL_THEMES) {
      expect(themes).toContain(theme)
    }
    expect(themes).toHaveLength(49)
  })

  it("converts plain markdown, safe lists, and advanced modules with every professional theme", async () => {
    const markdown = [
      "# 标题",
      "",
      "正文包含 **重点** 和 `code`。",
      "",
      "- 无序一",
      "- 无序二",
      "",
      "1. 有序一",
      "2. 有序二",
      "",
      ":::callout[提示]",
      "类型 | 标题 | 内容",
      ":::",
      "",
    ].join("\n")

    for (const theme of PROFESSIONAL_THEMES) {
      const result = await convertMarkdown(markdown, { theme, stripLinks: false })
      expect(result.html).toContain("标题")
      expect(result.html).toContain('data-mpa-action-id="callout"')
      expect(result.html).toContain('data-wxp-list="unordered"')
      expect(result.html).toContain('data-wxp-list="ordered"')
      expect(result.html).not.toMatch(/<(ul|ol|li)\b/)
    }
  })

  it("applies distinct family visual rules", () => {
    const defaultStyles = getTheme("default").styles
    const bytedanceStyles = getTheme("bytedance").styles
    expect(getTheme("default").accent).toBe("#111827")
    expect(defaultStyles.wrapper).toContain("background:#ffffff")
    expect(defaultStyles.wrapper).toContain("color:#1f2937")
    expect(defaultStyles.p).toContain("font-size:16px")
    expect(defaultStyles.p).toContain("line-height:1.82")
    expect(defaultStyles.p).not.toContain("letter-spacing")
    expect(defaultStyles.h1).toContain("font-size: 28px")
    expect(defaultStyles.h1).toContain("color: #111827")
    expect(defaultStyles.h1).not.toContain("background")
    expect(defaultStyles.h1).not.toContain("border-left")
    expect(defaultStyles.h1).not.toContain("border-bottom:1px dashed")
    expect(defaultStyles.h2).toContain("border-bottom: 1px solid rgba(17,24,39,0.28)")
    expect(defaultStyles.h2).toContain("#111827")
    expect(bytedanceStyles.h1).toContain("text-align: center")
    expect(bytedanceStyles.h1).toContain("linear-gradient(to right")
    expect(bytedanceStyles.h1).not.toContain("border-left")
    expect(bytedanceStyles.h2).toContain("linear-gradient(135deg, #1677ff, #05d4cd)")
    expect(bytedanceStyles.h2).toContain("#1677ff")
    expect(defaultStyles.code).toContain("border-radius:6px")
    expect(bytedanceStyles.code).toContain("border-radius: 999px")
    expect(defaultStyles.pre).toContain("background:#f8fafc")
    expect(getTheme("warm-editorial").styles.h1).toContain("background: rgb(200, 100, 66)")
    expect(bytedanceStyles.pre).toContain("rgba(22, 119, 255")
    expect(defaultStyles.preCode).toContain("overflow-wrap:anywhere")
    expect(bytedanceStyles.preCode).toContain("overflow-wrap:anywhere")

    expect(getTheme("bytedance").accent).toBe("#1677ff")
    expect(getTheme("apple").accent).toBe("#007aff")
    expect(getTheme("sports").accent).toBe("#00a968")
    expect(getTheme("cyber").accent).toBe("#f472b6")
    expect(getTheme("bauhaus-primary").accent).toBe("#004d9f")
    expect(getTheme("minimal-gold").styles.h1).toContain("#C8A062")
    expect(getTheme("focus-blue").styles.h1).toContain("text-align: center")
    expect(getTheme("elegant-green").styles.h1).toContain("border-left: 5px")
    expect(getTheme("bold-red").styles.h1).toContain("color: #ffffff")
    expect(getTheme("github-readme").styles.h1).toContain("#0969da")
    expect(getTheme("nyt-classic").styles.wrapper).toContain("#fdfaf6")
    expect(getTheme("wechat-native").styles.a).toContain("#07c160")
  })

  it("keeps representative h1 styles distinct across product themes", () => {
    expect(getTheme("default").styles.h1).not.toContain("background")
    expect(getTheme("default").styles.h1).toContain("font-size: 28px")
    expect(getTheme("warm-editorial").styles.h1).toContain("background: rgb(200, 100, 66)")
    expect(getTheme("bytedance").styles.h1).toContain("linear-gradient(to right")
    expect(getTheme("bytedance").styles.h1).toContain("border-bottom: 1px solid rgba(5,212,205,0.5)")
    expect(getTheme("github-readme").styles.h1).toContain("font-size: 29px")
    expect(getTheme("github-readme").styles.h1).toContain("border-left: 5px solid #0969da")
    expect(getTheme("github-readme").styles.h1).toContain("background: linear-gradient(180deg, #f8fbff 0%, #f6f8fa 100%)")
    expect(getTheme("nyt-classic").styles.h1).toContain("border-top: 2px solid #111")
    expect(getTheme("nyt-classic").styles.h1).toContain("border-bottom: 1px solid #111")
    expect(getTheme("wechat-native").styles.h1).toContain("border-left: 5px solid #07c160")
    expect(getTheme("wechat-native").styles.h1).toContain("border-bottom: 1px dashed rgba(22,51,37,0.2)")
    expect(getTheme("bauhaus-primary").styles.h1).toContain("text-transform: uppercase")
    expect(getTheme("bauhaus-primary").styles.h1).toContain("background: linear-gradient(90deg, #e30613 0%, #e30613 64%, #004d9f 64%, #004d9f 86%, #f5a623 86%, #f5a623 100%)")
    expect(getTheme("minimal-gold").styles.h1).toContain("font-size: 28px")
    expect(getTheme("minimal-gold").styles.h1).toContain("color: #C8A062")
    expect(getTheme("focus-blue").styles.h1).toContain("text-align: center")
    expect(getTheme("focus-blue").styles.h1).toContain("background-position: center top, center bottom")
    expect(getTheme("elegant-green").styles.h1).toContain("border-left: 5px solid #2BAE85")
    expect(getTheme("elegant-green").styles.h1).toContain("border-bottom: 1px solid #2BAE85")
    expect(getTheme("bold-red").styles.h1).toContain("background-color: #F25C54")
    expect(getTheme("bold-red").styles.h1).toContain("border-radius: 16px")
  })

  it("generates default through the shared theme factory", () => {
    const source = readFileSync(THEMES_SOURCE, "utf8")

    expect(source).not.toContain('if (spec.name === "default") return')
    expect(source).not.toContain("createDefaultReferenceStyles")
  })

  it("keeps theme selection metadata available for AI callers", () => {
    expect(getTheme("default").displayName).toBe("基础白")
    expect(getTheme("default").collection).toBe("base")
    expect(getTheme("warm-editorial").displayName).toBe("暖色编辑")
    expect(getTheme("elegant-blue").displayName).toBe("编辑 · 宝石蓝")
    expect(getTheme("github-readme").displayName).toBe("GitHub")
    expect(getTheme("bold-red").displayName).toBe("醒目 · 中国红")
    expect(getTheme("github-readme").bestFor).toContain("适合产品、知识内容")
    expect(getTheme("github-readme").collection).toBe("modern")
    expect(getTheme("bold-red").bestFor).toContain("适合专题、品牌、运营内容")
    expect(getTheme("bold-red").density).toBe("medium")
    expect(getTheme("nyt-classic").contrast).toBe("medium")
  })

  it("uses the shared reading baseline for paragraphs and lists", async () => {
    const markdown = [
      "第一段连续正文。",
      "",
      "- 无序列表",
      "",
      "1. 有序列表",
      "",
      "第二段应该保留段距。",
    ].join("\n")

    for (const theme of ["default", "github-readme"]) {
      const result = await convertMarkdown(markdown, { theme })

      expect(result.html).toContain('data-wxp-paragraph="true"')
      expect(result.html).toContain("font-size:16px")
      expect(result.html).toContain("line-height:1.82")
      expect(result.html).toContain("margin:0 0 16px 0")
      expect(result.html).not.toContain("letter-spacing:0.1em")
      expect(result.html).toContain('data-wxp-list="unordered"')
      expect(result.html).toContain('data-wxp-list="ordered"')
      expect(result.html).not.toMatch(/<(ul|ol|li)\b/)
    }
  })

  it("renders md2wechat-style extended theme fields", async () => {
    const markdown = [
      "# 标题",
      "",
      "##### 五级标题",
      "",
      "###### 六级标题",
      "",
      "> 引用段落",
      "",
      "正文包含 `inline`、[普通链接](https://example.com) 和 [微信链接](https://mp.weixin.qq.com/s/demo)。",
      "",
      "![图片说明](https://example.com/a.png)",
    ].join("\n")

    const result = await convertMarkdown(markdown, { theme: "github-readme", stripLinks: false })

    expect(result.html).toContain("<h5")
    expect(result.html).toContain("<h6")
    expect(result.html).toContain("font-size:16px;font-weight:600")
    expect(result.html).toContain("font-size:15px;font-weight:600")
    expect(result.html).toContain("background: transparent")
    expect(result.html).toContain('class="inline-code"')
    expect(result.html).toContain("rgba(175,184,193,0.2)")
    expect(result.html).toContain("word-break:break-all")
    expect(result.html).toContain("https://mp.weixin.qq.com/s/demo")
    expect(result.html).toContain("border-bottom:none")
    expect(result.html).toContain("<figure")
    expect(result.html).toContain("<figcaption")
    expect(result.html).toContain("图片说明")
  })

  it("converts default theme content against the local reference baseline", async () => {
    const markdown = [
      "## 我会怎么写 `/goal`",
      "",
      "正文包含 `AGENTS.md` 和 `docs/plan.md`。",
      "",
      "```text",
      "/goal line one",
      "/goal line two",
      "```",
      "",
      "- 列表一",
      "- 列表二",
      "",
      ":::verdict",
      "eyebrow: 判断",
      "title: 默认主题基线",
      "body: 高级模块应跟随默认主题。",
      ":::",
      "",
      "## 参考资料",
      "",
      "1. Example：https://example.com/a/very/long/path",
    ].join("\n")

    const result = await convertMarkdown(markdown, { theme: "default", stripLinks: false })

    expect(result.html).toContain("background:#ffffff")
    expect(result.html).toContain("font-size:16px;line-height:1.82")
    expect(result.html).not.toContain("letter-spacing:0.1em")
    expect(result.html).toContain("border-bottom: 1px solid rgba(17,24,39,0.28)")
    expect(result.html).toContain('class="inline-code"')
    expect(result.html).toContain("border-radius:6px")
    expect(result.html).toContain("<br>/goal")
    expect(result.html).not.toContain("white-space:nowrap;overflow-x:auto;;white-space:nowrap")
    expect(result.html).toContain("overflow-wrap:anywhere")
    expect(result.html).toContain('data-wxp-list="unordered"')
    expect(result.html).toContain('data-wxp-list="ordered"')
    expect(result.html).not.toMatch(/<(ul|ol|li)\b/)
    expect(result.html).toContain('data-mpa-action-id="verdict"')
    expect(result.html).toContain("background:linear-gradient(135deg, #f3f4f6 0%, #ffffff 48%, #f8fafc 100%)")
    expect(result.html).toContain("word-break:break-all")
    expect(result.html).toContain("overflow-wrap:anywhere")
  })
})

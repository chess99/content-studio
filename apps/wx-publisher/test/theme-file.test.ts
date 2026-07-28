import { describe, expect, it } from "vitest"
import { resolve } from "path"
import {
  getThemeFileSchema,
  loadThemeFile,
  validateThemeObject,
  THEME_STYLE_KEYS,
  OPTIONAL_THEME_STYLE_KEYS,
} from "../src/converter/theme-file.js"
import { convertMarkdown } from "../src/converter/index.js"

const fixture = (name: string) => resolve("test", "fixtures", name)

describe("external theme files", () => {
  it("exports a schema containing every NodeStyles key", () => {
    const schema = getThemeFileSchema()
    expect(schema.required).toEqual(["name", "description", "styles"])
    for (const key of THEME_STYLE_KEYS) {
      expect(schema.properties.styles.required).toContain(key)
    }
    for (const key of OPTIONAL_THEME_STYLE_KEYS) {
      expect(schema.properties.styles.required).not.toContain(key)
      expect(schema.properties.styles.properties[key]).toEqual({ type: "string" })
    }
  })

  it("loads a valid external theme", () => {
    const result = loadThemeFile(fixture("external-theme-valid.json"))
    expect(result.theme.name).toBe("fixture-theme")
    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual([])
    expect(result.theme.styles.h2).toContain("border-left")
  })

  it("accepts optional md2wechat extension style fields", async () => {
    const base = loadThemeFile(fixture("external-theme-valid.json")).theme
    const result = validateThemeObject({
      name: "extended-theme",
      description: "fixture with optional md2wechat fields",
      styles: {
        ...base.styles,
        codespan: "background:#123456;color:#fff;",
        figure: "margin:20px 0;text-align:center;",
        figcaption: "font-size:12px;color:#666;",
      },
    })

    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual([])
    expect(result.theme?.styles.codespan).toContain("#123456")

    const converted = await convertMarkdown("`x`\n\n![说明](https://example.com/a.png)", {
      themeDefinition: result.theme,
    })
    expect(converted.html).toContain("background:#123456")
    expect(converted.html).toContain("<figure")
    expect(converted.html).toContain("<figcaption")
    expect(converted.html).toContain("说明")
  })

  it("rejects missing required style keys", () => {
    const result = loadThemeFile(fixture("external-theme-missing-style.json"))
    expect(result.theme).toBeNull()
    expect(result.errors).toContain("styles.td is required")
  })

  it("rejects dangerous style content", () => {
    const result = loadThemeFile(fixture("external-theme-dangerous.json"))
    expect(result.theme).toBeNull()
    expect(result.errors.join("\n")).toContain("styles.img contains forbidden content: javascript:")
  })

  it("returns warnings for unknown fields and risky CSS", () => {
    const result = loadThemeFile(fixture("external-theme-warning.json"))
    expect(result.theme?.name).toBe("warning-theme")
    expect(result.errors).toEqual([])
    expect(result.warnings).toContain("unknown top-level field: extra")
    expect(result.warnings.join("\n")).toContain("styles.wrapper uses position:fixed")
    expect(result.warnings.join("\n")).toContain("styles.h1 uses animation")
    expect(result.warnings.join("\n")).toContain("styles.wrapper uses a fixed width greater than 677px")
  })

  it("rejects non-object input", () => {
    const result = validateThemeObject("not object")
    expect(result.theme).toBeNull()
    expect(result.errors).toContain("theme file must contain a JSON object")
  })
})

import { describe, expect, it } from "vitest"
import { deriveStudioTheme } from "../src/studio/theme-settings.js"
import { getTheme } from "../src/converter/themes.js"
import { getAdvancedPalette } from "../src/converter/advanced-layout/styles.js"

describe("deriveStudioTheme", () => {
  it("applies reading settings without mutating the base theme or its palette", () => {
    const base = getTheme("github-readme")
    const derived = deriveStudioTheme(base, {
      fontSize: 17,
      fontFamily: "serif",
      codeBlockStyle: "light",
    })

    expect(derived.name).toBe("github-readme-studio")
    expect(derived.styles.h2).toBe(base.styles.h2)
    expect(derived.styles.h3).toBe(base.styles.h3)
    expect(derived.styles.a).toBe(base.styles.a)
    expect(derived.styles.p).toContain("font-size:17px")
    expect(derived.styles.li).toContain("font-size:17px")
    expect(derived.styles.wrapper).toContain("Georgia")
    expect(derived.styles.pre).toContain("background:#f6f8fa")
    expect(derived.styles.preCode).toContain("color:#24292f")
    expect(getAdvancedPalette(derived).accent).toBe("#0969da")
    expect(getAdvancedPalette(derived).accentSoft).toBe("#e1edfb")

    expect(base.styles.p).not.toContain("font-size:17px")
  })

  it("returns the original theme styles when no Studio overrides are provided", () => {
    const base = getTheme("default")
    const derived = deriveStudioTheme(base, {})

    expect(derived.name).toBe("default-studio")
    expect(derived.styles).toEqual(base.styles)
    expect(derived.styles).not.toBe(base.styles)
  })

  it("uses the gallery advanced palette when Studio keeps the base accent", () => {
    const derived = deriveStudioTheme(getTheme("github-readme"), {})
    expect(getAdvancedPalette(derived).accent).toBe("#0969da")
    expect(getAdvancedPalette(derived).accentSoft).toBe("#e1edfb")
  })
})

import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { listThemeLayouts, listThemePalettes, listThemeReferences } from "../src/converter/themes.js"

const palettePath = resolve(process.cwd(), "docs/theme-palette-reference.json")

interface ThemeSystemReference {
  version: number
  usage: string
  sourceUpdatedAt: string
  decisionNote: string
  presets: Array<{ id: string; displayName: string; collection: string; accent: string; background: string }>
  layouts: Array<{ id: string; displayName: string; description: string }>
  palettes: Array<{ id: string; displayName: string; accent: string }>
}

function readReference(): ThemeSystemReference {
  return JSON.parse(readFileSync(palettePath, "utf8")) as ThemeSystemReference
}

describe("theme system reference", () => {
  it("documents presets, layouts, and palettes as separate product concepts", () => {
    const reference = readReference()

    expect(reference).toMatchObject({ version: 4, usage: "theme-system-reference", sourceUpdatedAt: "2026-07-30" })
    expect(reference.decisionNote).toContain("组合不计为独立主题")
    expect(reference.presets).toHaveLength(9)
    expect(reference.layouts).toHaveLength(4)
    expect(reference.palettes).toHaveLength(6)
  })

  it("stays synchronized with the runtime catalog", () => {
    const reference = readReference()

    expect(reference.presets.map(item => item.id)).toEqual(listThemeReferences().map(item => item.name))
    expect(reference.layouts.map(item => item.id)).toEqual(listThemeLayouts().map(item => item.name))
    expect(reference.palettes.map(item => item.id)).toEqual(listThemePalettes().map(item => item.name))
  })

  it("keeps the default white and every documented color in six-digit hex", () => {
    const reference = readReference()
    const defaultPreset = reference.presets.find(item => item.id === "default")

    expect(defaultPreset).toMatchObject({ accent: "#111827", background: "#ffffff", collection: "essential" })
    for (const preset of reference.presets) {
      expect(preset.accent).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(preset.background).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
    for (const palette of reference.palettes) expect(palette.accent).toMatch(/^#[0-9a-fA-F]{6}$/)
  })
})

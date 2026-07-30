import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const root = process.cwd()
const palettePath = resolve(root, "docs/theme-palette-reference.json")

const namedPaletteIds = [
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
]

const matrixFamilies = ["minimal", "focus", "elegant", "bold"]
const matrixColors = ["gold", "green", "blue", "orange", "red", "navy", "gray", "sky"]

const expectedPaletteIds = [
  ...namedPaletteIds,
  ...matrixFamilies.flatMap(family => matrixColors.map(color => `${family}-${color}`)),
]

const colorFields = [
  "accent",
  "renderAccent",
  "background",
  "surface",
  "surfaceAlt",
  "accentSoft",
  "accentSofter",
  "text",
  "headingText",
  "muted",
  "border",
  "codeBackground",
]

interface PaletteReference {
  version: number
  usage: string
  sourceUpdatedAt: string
  palettes: Array<Record<string, string>>
}

function readPaletteReference(): PaletteReference {
  return JSON.parse(readFileSync(palettePath, "utf8")) as PaletteReference
}

describe("theme palette reference", () => {
  it("keeps the product theme catalog complete and ordered", () => {
    const reference = readPaletteReference()

    expect(reference.version).toBe(3)
    expect(reference.usage).toBe("runtime-theme-catalog")
    expect(reference.sourceUpdatedAt).toBe("2026-07-30")
    expect(reference.palettes).toHaveLength(49)

    const actualIds = reference.palettes.map(palette => palette.id)
    expect(new Set(actualIds).size).toBe(actualIds.length)
    expect(actualIds).toEqual(expectedPaletteIds)
  })

  it("keeps every palette color in six-digit hex format", () => {
    const reference = readPaletteReference()

    for (const palette of reference.palettes) {
      for (const field of colorFields) {
        expect(palette[field], `${palette.id}.${field}`).toMatch(/^#[0-9a-fA-F]{6}$/)
      }
    }
  })

  it("keeps each template family complete", () => {
    const reference = readPaletteReference()
    const ids = new Set(reference.palettes.map(palette => palette.id))

    for (const family of matrixFamilies) {
      for (const color of matrixColors) {
        expect(ids.has(`${family}-${color}`)).toBe(true)
      }
    }
  })

  it("keeps the neutral default and representative palette colors", () => {
    const reference = readPaletteReference()
    const palettes = new Map(reference.palettes.map(palette => [palette.id, palette]))

    expect(palettes.get("default")?.group).toBe("base")
    expect(palettes.get("default")?.accent).toBe("#111827")
    expect(palettes.get("default")?.background).toBe("#ffffff")
    expect(palettes.get("warm-editorial")?.accent).toBe("#a34e2e")
    expect(palettes.get("bytedance")?.accent).toBe("#1677ff")
    expect(palettes.get("apple")?.accent).toBe("#007aff")
    expect(palettes.get("sports")?.accent).toBe("#00a968")
    expect(palettes.get("minimal-orange")?.accent).toBe("#f89a3a")
  })
})

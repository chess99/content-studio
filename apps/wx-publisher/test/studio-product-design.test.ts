import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const mainSource = readFileSync(new URL("../studio-app/src/main.ts", import.meta.url), "utf8")
const styleSource = readFileSync(new URL("../studio-app/src/styles.css", import.meta.url), "utf8")

describe("Studio product structure", () => {
  it("separates reliable recommendations from structured customization", () => {
    expect(mainSource).toContain("RECOMMENDED_THEME_IDS")
    expect(mainSource).toContain('data-theme-list="recommended"')
    expect(mainSource).toContain("data-theme-layouts")
    expect(mainSource).toContain("data-theme-palettes")
    expect(mainSource).not.toContain('data-theme-list="presets"')
    expect(mainSource).toContain("layoutPreview")
    expect(mainSource).not.toContain("MATRIX_FAMILIES")
    expect(mainSource).not.toContain("MATRIX_COLORS")
  })

  it("keeps appearance and publishing as separate settings views", () => {
    expect(mainSource).toContain('data-view="appearance"')
    expect(mainSource).toContain('data-view="publish"')
    expect(mainSource).toContain('data-settings-view="appearance"')
    expect(mainSource).toContain('data-settings-view="publish"')
  })

  it("does not expose the removed accent override or old warm shell colors", () => {
    expect(mainSource).not.toContain("primaryColor")
    expect(mainSource).not.toContain("SWATCHES")
    expect(styleSource).not.toMatch(/#faf9f5|#f1e6df/i)
    expect(styleSource).toContain(".layout-preview-editorial")
    expect(styleSource).toContain(".layout-preview-poster")
  })

  it("ignores stale conversion responses during rapid theme changes", () => {
    expect(mainSource).toContain("let conversionVersion = 0")
    expect(mainSource).toContain("const version = ++conversionVersion")
    expect(mainSource.match(/if \(version !== conversionVersion\) return/g)).toHaveLength(2)
  })

  it("preserves preview space on medium screens and uses a full-screen mobile panel", () => {
    expect(styleSource).toMatch(
      /\.editor-pane,\s*\.preview-pane,\s*\.settings-panel\s*\{[\s\S]*?height: calc\(100vh - 116px\);/,
    )
    expect(styleSource).toMatch(/\.settings-panel\s*\{\s*overflow: auto;/)
    expect(styleSource).toMatch(
      /@media \(max-width: 1180px\)[\s\S]*?\.studio-shell:not\(\.settings-closed\) \.editor-pane\s*\{\s*display: none;/,
    )
    expect(styleSource).toMatch(
      /@media \(max-width: 720px\)[\s\S]*?\.settings-panel\s*\{[\s\S]*?position: fixed;[\s\S]*?inset: 0;[\s\S]*?height: auto;/,
    )
    expect(styleSource).toMatch(
      /@media \(max-width: 720px\)[\s\S]*?\.studio-shell:not\(\.settings-closed\)\s*\{[\s\S]*?height: 100vh;[\s\S]*?overflow: hidden;/,
    )
    expect(styleSource).toContain("repeat(2, minmax(0, 1fr))")
  })
})

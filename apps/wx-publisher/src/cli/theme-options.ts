import { resolve } from "path"
import type { Theme } from "../converter/themes.js"
import { createCustomTheme, hasTheme } from "../converter/themes.js"
import { loadThemeFile } from "../converter/theme-file.js"

export interface ThemeCliOptions {
  theme?: string
  themeFile?: string
  layout?: string
  palette?: string
}

export interface ResolvedThemeOption {
  themeName: string
  themeDefinition?: Theme
  warnings?: string[]
}

export function resolveThemeOption(
  opts: ThemeCliOptions,
  defaultTheme: string,
): ResolvedThemeOption {
  const hasCustomSelection = Boolean(opts.layout || opts.palette)
  if (opts.themeFile && (opts.theme || hasCustomSelection)) {
    throw new Error("--theme-file cannot be combined with --theme, --layout, or --palette")
  }
  if (opts.theme && hasCustomSelection) {
    throw new Error("--theme cannot be combined with --layout or --palette")
  }
  if (Boolean(opts.layout) !== Boolean(opts.palette)) {
    throw new Error("--layout and --palette must be provided together")
  }

  if (opts.layout && opts.palette) {
    const themeDefinition = createCustomTheme(opts.layout, opts.palette)
    return {
      themeName: themeDefinition.name,
      themeDefinition,
    }
  }

  if (!opts.themeFile) {
    const themeName = (opts.theme || defaultTheme || "default").trim() || "default"
    if (!hasTheme(themeName)) {
      throw new Error(`未知主题: ${themeName}`)
    }
    return {
      themeName,
      themeDefinition: undefined,
    }
  }

  const result = loadThemeFile(resolve(opts.themeFile))

  if (!result.theme) {
    throw new Error(result.errors.join("\n"))
  }

  return {
    themeName: result.theme.name,
    themeDefinition: result.theme,
    warnings: result.warnings,
  }
}

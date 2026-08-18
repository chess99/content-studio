import "./styles.css"

type ThemeOption = {
  name: string
  description: string
  collection: string
  displayName: string
  bestFor: string
  density: "low" | "medium" | "high"
  contrast: "low" | "medium" | "high"
  accent: string
}

type ThemeLayoutOption = {
  name: "clean" | "centered" | "editorial" | "poster"
  displayName: string
  description: string
  bestFor: string
}

type ThemePaletteOption = {
  name: "neutral" | "blue" | "green" | "red" | "warm" | "purple"
  displayName: string
  description: string
  accent: string
}

type ThemeSelection =
  | { preset: string }
  | { layout: ThemeLayoutOption["name"]; palette: ThemePaletteOption["name"] }

type StudioState = {
  article: {
    path: string
    name: string
    markdown: string
  }
  themes: ThemeOption[]
  layouts: ThemeLayoutOption[]
  palettes: ThemePaletteOption[]
  advancedModules: {
    public: string[]
    enhanced: string[]
    total: number
  }
  config: {
    wechat_appid: string
    wechat_secret_configured: boolean
    default_theme: string
  }
}

type StudioThemeSettings = {
  fontSize?: number
  fontFamily?: "system" | "serif" | "mono"
  codeBlockStyle?: "dark" | "light"
}

type ConvertResult = {
  html: string
  externalImages: string[]
  localImages: string[]
}

type JsonEnvelope<T> = {
  success: boolean
  data?: T
  error?: string
  details?: unknown
  hint?: string
}

type SettingsView = "appearance" | "publish"

const RECOMMENDED_THEME_IDS = [
  "default",
  "wechat-native",
  "github-readme",
  "nyt-classic",
  "ink-minimal",
  "warm-editorial",
]

const app = document.querySelector<HTMLDivElement>("#app")
if (!app) throw new Error("missing #app")

const state = {
  markdown: "",
  html: "",
  themeSelection: { preset: "default" } as ThemeSelection,
  themeSettings: {
    fontSize: 16,
    fontFamily: "system",
    codeBlockStyle: "dark",
  } as StudioThemeSettings,
  settingsOpen: false,
  settingsView: "appearance" as SettingsView,
  themes: [] as ThemeOption[],
  layouts: [] as ThemeLayoutOption[],
  palettes: [] as ThemePaletteOption[],
  advancedModules: {
    public: [] as string[],
    enhanced: [] as string[],
    total: 0,
  },
  articleName: "",
  articlePath: "",
  config: {
    wechat_appid: "(未设置)",
    wechat_secret_configured: false,
    default_theme: "default",
  } as StudioState["config"],
  images: {
    external: [] as string[],
    local: [] as string[],
  },
}

const root = document.createElement("div")
root.className = "studio-shell settings-closed"
root.innerHTML = `
  <header class="topbar">
    <div class="brand">
      <div class="brand-mark">W</div>
      <div class="brand-copy">
        <strong>wxp Studio</strong>
        <span class="file-name">加载中</span>
      </div>
    </div>
    <div class="toolbar" aria-label="文章操作">
      <button class="ghost-button" data-action="copy-html" title="复制 HTML">复制 HTML</button>
      <button class="ghost-button" data-action="copy-rich" title="复制富文本">复制富文本</button>
      <button class="ghost-button" data-action="export-html" title="导出 HTML">导出 HTML</button>
      <button class="primary-button" data-action="open-settings" title="打开排版设置">排版与发布</button>
    </div>
  </header>

  <main class="workspace">
    <section class="editor-pane">
      <div class="pane-head">
        <div>
          <span class="eyebrow">MARKDOWN</span>
          <h2>编辑</h2>
        </div>
        <span class="status-pill" data-bind="word-count">0 字</span>
      </div>
      <textarea class="markdown-editor" spellcheck="false" placeholder="输入 Markdown"></textarea>
    </section>

    <section class="preview-pane">
      <div class="pane-head">
        <div>
          <span class="eyebrow">WECHAT PREVIEW</span>
          <h2>公众号预览</h2>
        </div>
        <span class="status-pill" data-bind="image-count">0 图</span>
      </div>
      <div class="phone-frame">
        <div class="phone-speaker"></div>
        <article class="preview-content"></article>
      </div>
    </section>

    <button class="drawer-backdrop" data-action="close-settings" aria-label="关闭设置"></button>
    <aside class="settings-panel" aria-label="排版与发布设置">
      <div class="panel-title">
        <div>
          <span class="eyebrow">STYLE & PUBLISH</span>
          <h2>排版与发布</h2>
        </div>
        <button class="icon-button" data-action="close-settings" title="收起设置" aria-label="收起设置">×</button>
      </div>

      <div class="settings-tabs" role="tablist" aria-label="设置类别">
        <button class="settings-tab active" data-action="show-settings-view" data-view="appearance" role="tab" aria-selected="true">排版</button>
        <button class="settings-tab" data-action="show-settings-view" data-view="publish" role="tab" aria-selected="false">发布</button>
      </div>

      <div class="settings-view" data-settings-view="appearance">
        <section class="active-theme-summary" aria-live="polite">
          <span class="active-theme-swatch"></span>
          <div>
            <span class="summary-label">当前主题</span>
            <strong data-bind="active-theme-name">基础白</strong>
            <small data-bind="active-theme-description">中性、干净，适合绝大多数文章</small>
          </div>
        </section>

        <section class="setting-group">
          <div class="group-heading">
            <div>
              <h3>推荐主题</h3>
              <p>先从少量可靠方案开始，再按需要深入调整。</p>
            </div>
          </div>
          <div class="theme-grid" data-theme-list="recommended"></div>
        </section>

        <details class="custom-theme-builder setting-group">
          <summary>
            <span>自定义主题</span>
            <small>4 种版式 · 6 套调色板</small>
          </summary>
          <div class="custom-builder-content">
            <div class="group-heading">
              <div>
                <h3>选择版式</h3>
                <p>版式决定标题结构，正文始终保持纯白背景。</p>
              </div>
            </div>
            <div class="family-grid" data-theme-layouts></div>
            <div class="group-heading palette-heading">
              <div>
                <h3>选择调色板</h3>
                <p>一套颜色会同步应用到强调、引用、代码和高级模块。</p>
              </div>
            </div>
            <div class="color-grid" data-theme-palettes></div>
          </div>
        </details>

        <section class="setting-group typography-settings">
          <div class="group-heading">
            <div>
              <h3>阅读设置</h3>
              <p>这些设置只改变阅读基线，不破坏主题配色。</p>
            </div>
          </div>
          <label class="range-setting">
            <span>正文字号 <output data-bind="font-size">16px</output></span>
            <input type="range" min="14" max="20" step="1" value="16" data-setting="font-size" />
          </label>
          <div class="compact-grid">
            <label>
              字体
              <select class="setting-input" data-setting="font-family">
                <option value="system">系统无衬线</option>
                <option value="serif">衬线正文</option>
                <option value="mono">等宽字体</option>
              </select>
            </label>
            <label>
              代码块
              <select class="setting-input" data-setting="code-style">
                <option value="dark">跟随主题</option>
                <option value="light">统一浅色</option>
              </select>
            </label>
          </div>
        </section>

        <details class="module-library setting-group">
          <summary>
            <span>高级模块</span>
            <small data-bind="module-count">读取中</small>
          </summary>
          <div class="module-tags"></div>
        </details>
      </div>

      <div class="settings-view" data-settings-view="publish" hidden>
        <section class="setting-group publish-intro">
          <h3>创建公众号草稿</h3>
          <p>这里只创建草稿，不会公开发布。创建后请到公众号后台检查。</p>
        </section>
        <section class="setting-group publish-fields">
          <label>
            标题
            <input class="setting-input" data-publish="title" placeholder="默认读取文章 H1" />
          </label>
          <label>
            作者
            <input class="setting-input" data-publish="author" placeholder="可选" />
          </label>
          <label>
            摘要
            <textarea class="setting-input digest-input" data-publish="digest" maxlength="120" placeholder="不超过 120 字"></textarea>
          </label>
          <label>
            封面
            <select class="setting-input" data-publish="cover-type">
              <option value="placeholder">暂用占位封面</option>
              <option value="path">本地封面路径</option>
              <option value="url">公网封面 URL</option>
            </select>
          </label>
          <input class="setting-input" data-publish="cover-value" placeholder="/path/to/cover.jpg 或 https://..." />
          <div class="config-note"></div>
          <button class="primary-button publish-button" data-action="publish">创建微信公众号草稿</button>
        </section>
        <section class="setting-group">
          <h3>操作状态</h3>
          <pre class="result-box" data-bind="result">等待操作</pre>
        </section>
      </div>
    </aside>
  </main>
`
app.append(root)

const markdownEditor = root.querySelector<HTMLTextAreaElement>(".markdown-editor")!
const preview = root.querySelector<HTMLElement>(".preview-content")!
const resultBox = root.querySelector<HTMLElement>('[data-bind="result"]')!

void boot()

async function boot(): Promise<void> {
  try {
    const payload = await request<StudioState>("/api/state")
    if (!payload.data) throw new Error(payload.error ?? "加载失败")

    state.markdown = payload.data.article.markdown
    state.articleName = payload.data.article.name
    state.articlePath = payload.data.article.path
    state.themes = payload.data.themes
    state.layouts = payload.data.layouts
    state.palettes = payload.data.palettes
    state.advancedModules = payload.data.advancedModules
    state.config = payload.data.config
    state.themeSelection = {
      preset: findTheme(payload.data.config.default_theme)?.name ?? payload.data.themes[0]?.name ?? "default",
    }

    markdownEditor.value = state.markdown
    root.querySelector(".file-name")!.textContent = payload.data.article.name
    renderThemePicker()
    renderAdvancedModules()
    syncControls()
    bindEvents()
    await convertNow()
  } catch (error) {
    setResult({ success: false, error: "Studio 初始化失败", details: String(error) })
  }
}

function bindEvents(): void {
  markdownEditor.addEventListener("input", () => {
    state.markdown = markdownEditor.value
    updateStats()
    debounceConvert()
  })

  root.addEventListener("click", event => {
    const target = event.target as HTMLElement
    const actionTarget = target.closest<HTMLElement>("[data-action]")
    const action = actionTarget?.dataset.action
    if (!action || !actionTarget) return

    if (action === "open-settings") openSettings("appearance")
    if (action === "close-settings") closeSettings()
    if (action === "copy-html") void copyHtml()
    if (action === "copy-rich") void copyRich()
    if (action === "export-html") exportHtml()
    if (action === "publish") void publishDraft()
    if (action === "show-settings-view") showSettingsView(actionTarget.dataset.view === "publish" ? "publish" : "appearance")
    if (action === "select-theme" && actionTarget.dataset.theme) selectPreset(actionTarget.dataset.theme)
    if (action === "select-layout" && actionTarget.dataset.layout) {
      const current = customSelection()
      selectCustom(actionTarget.dataset.layout as ThemeLayoutOption["name"], current.palette)
    }
    if (action === "select-palette" && actionTarget.dataset.palette) {
      const current = customSelection()
      selectCustom(current.layout, actionTarget.dataset.palette as ThemePaletteOption["name"])
    }
  })

  root.querySelector<HTMLInputElement>('[data-setting="font-size"]')?.addEventListener("input", event => {
    state.themeSettings.fontSize = Number((event.target as HTMLInputElement).value)
    syncFontSizeLabel()
    debounceConvert()
  })
  root.querySelector<HTMLSelectElement>('[data-setting="font-family"]')?.addEventListener("change", event => {
    state.themeSettings.fontFamily = (event.target as HTMLSelectElement).value as StudioThemeSettings["fontFamily"]
    debounceConvert()
  })
  root.querySelector<HTMLSelectElement>('[data-setting="code-style"]')?.addEventListener("change", event => {
    state.themeSettings.codeBlockStyle = (event.target as HTMLSelectElement).value as StudioThemeSettings["codeBlockStyle"]
    debounceConvert()
  })
}

function renderThemePicker(): void {
  const recommended = RECOMMENDED_THEME_IDS.map(findTheme).filter((theme): theme is ThemeOption => Boolean(theme))
  const recommendedContainer = root.querySelector<HTMLElement>('[data-theme-list="recommended"]')!
  recommendedContainer.innerHTML = recommended.map(themeCard).join("")

  const custom = customSelection()
  const layoutContainer = root.querySelector<HTMLElement>("[data-theme-layouts]")!
  layoutContainer.innerHTML = state.layouts.map(layout => `
    <button class="family-card ${layout.name === custom.layout && isCustomSelection() ? "active" : ""}" data-action="select-layout" data-layout="${layout.name}" aria-pressed="${layout.name === custom.layout && isCustomSelection()}">
      ${layoutPreview(layout.name, currentAccent())}
      <span class="family-copy">
        <strong>${escapeHtml(layout.displayName)}</strong>
        <small>${escapeHtml(layout.description)}</small>
      </span>
    </button>
  `).join("")

  const paletteContainer = root.querySelector<HTMLElement>("[data-theme-palettes]")!
  paletteContainer.innerHTML = state.palettes.map(palette => `
    <button class="color-choice ${palette.name === custom.palette && isCustomSelection() ? "active" : ""}" data-action="select-palette" data-palette="${palette.name}" title="${escapeHtml(palette.displayName)}" aria-label="${escapeHtml(palette.displayName)}" aria-pressed="${palette.name === custom.palette && isCustomSelection()}">
      <span style="--choice-color:${safeColor(palette.accent)}"></span>
      <small>${escapeHtml(palette.displayName)}</small>
    </button>
  `).join("")

  renderActiveThemeSummary()
  root.querySelector<HTMLDetailsElement>(".custom-theme-builder")!.open = isCustomSelection()
}

function themeCard(theme: ThemeOption): string {
  const active = "preset" in state.themeSelection && theme.name === state.themeSelection.preset
  const layout = presetLayout(theme.name)
  return `
    <button class="theme-card ${active ? "active" : ""}" data-action="select-theme" data-theme="${escapeHtml(theme.name)}" style="--theme-accent:${safeColor(theme.accent)}" aria-pressed="${active}">
      ${layoutPreview(layout, theme.accent, "theme-preview")}
      <span class="theme-copy">
        <strong>${escapeHtml(theme.displayName)}</strong>
        <small>${escapeHtml(theme.bestFor)}</small>
        <code>${escapeHtml(theme.name)}</code>
      </span>
    </button>
  `
}

function renderActiveThemeSummary(): void {
  const name = root.querySelector<HTMLElement>('[data-bind="active-theme-name"]')!
  const description = root.querySelector<HTMLElement>('[data-bind="active-theme-description"]')!
  const swatch = root.querySelector<HTMLElement>(".active-theme-swatch")!

  if ("preset" in state.themeSelection) {
    const theme = findTheme(state.themeSelection.preset)
    if (!theme) return
    name.textContent = theme.displayName
    description.textContent = theme.bestFor
    swatch.style.backgroundColor = safeColor(theme.accent)
    return
  }

  const layout = state.layouts.find(item => item.name === state.themeSelection.layout)
  const palette = state.palettes.find(item => item.name === state.themeSelection.palette)
  if (!layout || !palette) return
  name.textContent = `${layout.displayName} · ${palette.displayName}`
  description.textContent = `${layout.bestFor}；${palette.description}`
  swatch.style.backgroundColor = safeColor(palette.accent)
}

function renderAdvancedModules(): void {
  const tags = root.querySelector<HTMLElement>(".module-tags")!
  const moduleCount = root.querySelector<HTMLElement>('[data-bind="module-count"]')!
  const featured = [...state.advancedModules.public.slice(0, 8), ...state.advancedModules.enhanced]
  moduleCount.textContent = `${state.advancedModules.total} 个可用`
  tags.innerHTML = featured.map(name => `<span>${escapeHtml(name)}</span>`).join("")
}

function selectPreset(themeName: string): void {
  const theme = findTheme(themeName)
  if (!theme) return
  state.themeSelection = { preset: theme.name }
  renderThemePicker()
  void convertNow()
}

function selectCustom(layout: ThemeLayoutOption["name"], palette: ThemePaletteOption["name"]): void {
  if (!state.layouts.some(item => item.name === layout) || !state.palettes.some(item => item.name === palette)) return
  state.themeSelection = { layout, palette }
  renderThemePicker()
  void convertNow()
}

function isCustomSelection(): boolean {
  return "layout" in state.themeSelection
}

function customSelection(): { layout: ThemeLayoutOption["name"]; palette: ThemePaletteOption["name"] } {
  return "layout" in state.themeSelection
    ? state.themeSelection
    : { layout: "clean", palette: "neutral" }
}

function currentAccent(): string {
  if ("layout" in state.themeSelection) {
    return state.palettes.find(item => item.name === state.themeSelection.palette)?.accent ?? "#344054"
  }
  return "#344054"
}

function presetLayout(themeName: string): ThemeLayoutOption["name"] {
  if (["wechat-native", "github-readme"].includes(themeName)) return "editorial"
  if (themeName === "nyt-classic") return "centered"
  if (themeName === "warm-editorial") return "poster"
  return "clean"
}

function layoutPreview(layout: ThemeLayoutOption["name"], accent: string, className = "layout-preview"): string {
  return `
    <span class="${className} layout-preview-${layout}" style="--preview-accent:${safeColor(accent)}" aria-hidden="true">
      <i class="preview-heading"></i>
      <i class="preview-line preview-line-long"></i>
      <i class="preview-line preview-line-medium"></i>
      <i class="preview-line preview-line-short"></i>
    </span>
  `
}

function findTheme(name: string): ThemeOption | undefined {
  return state.themes.find(theme => theme.name === name)
}

function syncControls(): void {
  root.querySelector<HTMLInputElement>('[data-setting="font-size"]')!.value = String(state.themeSettings.fontSize ?? 16)
  root.querySelector<HTMLSelectElement>('[data-setting="font-family"]')!.value = state.themeSettings.fontFamily ?? "system"
  root.querySelector<HTMLSelectElement>('[data-setting="code-style"]')!.value = state.themeSettings.codeBlockStyle ?? "dark"
  root.querySelector<HTMLElement>(".config-note")!.textContent = state.config.wechat_secret_configured
    ? `已读取公众号配置：${state.config.wechat_appid}`
    : "未检测到完整公众号配置。创建草稿前请先执行 wxp config set。"
  syncFontSizeLabel()
  updateStats()
}

function syncFontSizeLabel(): void {
  root.querySelector<HTMLOutputElement>('[data-bind="font-size"]')!.textContent = `${state.themeSettings.fontSize ?? 16}px`
}

let convertTimer = 0
let conversionVersion = 0
function debounceConvert(): void {
  window.clearTimeout(convertTimer)
  convertTimer = window.setTimeout(() => void convertNow(), 220)
}

async function convertNow(): Promise<void> {
  const version = ++conversionVersion
  try {
    const payload = await request<ConvertResult>("/api/convert", {
      markdown: state.markdown,
      theme: state.themeSelection,
      themeSettings: state.themeSettings,
    })
    if (version !== conversionVersion) return
    if (!payload.success || !payload.data) throw new Error(payload.error ?? "转换失败")
    state.html = payload.data.html
    state.images.external = payload.data.externalImages
    state.images.local = payload.data.localImages
    preview.innerHTML = state.html
    updateStats()
  } catch (error) {
    if (version !== conversionVersion) return
    setResult({ success: false, error: "转换失败", details: String(error) })
  }
}

async function publishDraft(): Promise<void> {
  const coverType = root.querySelector<HTMLSelectElement>('[data-publish="cover-type"]')!.value
  const coverValue = root.querySelector<HTMLInputElement>('[data-publish="cover-value"]')!.value.trim()
  setResult({ success: true, data: { message: "正在创建草稿..." } })
  const payload = await request<unknown>("/api/publish", {
    markdown: state.markdown,
    theme: state.themeSelection,
    themeSettings: state.themeSettings,
    title: root.querySelector<HTMLInputElement>('[data-publish="title"]')!.value.trim(),
    author: root.querySelector<HTMLInputElement>('[data-publish="author"]')!.value.trim(),
    digest: root.querySelector<HTMLTextAreaElement>('[data-publish="digest"]')!.value.trim(),
    cover: { type: coverType, value: coverValue },
  })
  setResult(payload)
}

async function copyHtml(): Promise<void> {
  setResult({ success: true, data: { message: "正在复制 HTML..." } })
  try {
    await navigator.clipboard.writeText(state.html)
    setResult({ success: true, data: { message: "HTML 已复制" } })
  } catch (error) {
    setResult({ success: false, error: "复制 HTML 失败", details: String(error) })
  }
}

async function copyRich(): Promise<void> {
  setResult({ success: true, data: { message: "正在复制富文本..." } })
  try {
    const ClipboardItemCtor = globalThis.ClipboardItem
    if (!ClipboardItemCtor) throw new Error("ClipboardItem unavailable")
    await navigator.clipboard.write([
      new ClipboardItemCtor({
        "text/html": new Blob([state.html], { type: "text/html" }),
        "text/plain": new Blob([preview.textContent ?? ""], { type: "text/plain" }),
      }),
    ])
    setResult({ success: true, data: { message: "富文本已复制，可粘贴到公众号后台" } })
  } catch (error) {
    setResult({ success: false, error: "复制富文本失败，已保留 HTML 可手动复制", details: String(error) })
  }
}

function exportHtml(): void {
  const blob = new Blob([state.html], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${state.articleName.replace(/\.md$/i, "") || "wxp-article"}.html`
  link.click()
  URL.revokeObjectURL(url)
  setResult({ success: true, data: { message: "HTML 已导出" } })
}

async function request<T>(path: string, body?: unknown): Promise<JsonEnvelope<T>> {
  const response = await fetch(path, body === undefined ? undefined : {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  return await response.json() as JsonEnvelope<T>
}

function openSettings(view: SettingsView): void {
  state.settingsOpen = true
  root.classList.remove("settings-closed")
  showSettingsView(view)
}

function closeSettings(): void {
  state.settingsOpen = false
  root.classList.add("settings-closed")
}

function showSettingsView(view: SettingsView): void {
  state.settingsView = view
  root.querySelectorAll<HTMLElement>("[data-settings-view]").forEach(panel => {
    panel.hidden = panel.dataset.settingsView !== view
  })
  root.querySelectorAll<HTMLButtonElement>(".settings-tab").forEach(tab => {
    const active = tab.dataset.view === view
    tab.classList.toggle("active", active)
    tab.setAttribute("aria-selected", String(active))
  })
}

function updateStats(): void {
  root.querySelector('[data-bind="word-count"]')!.textContent = `${state.markdown.length} 字`
  const imageCount = state.images.external.length + state.images.local.length
  root.querySelector('[data-bind="image-count"]')!.textContent = `${imageCount} 图`
}

function setResult(payload: unknown): void {
  resultBox.textContent = JSON.stringify(payload, null, 2)
}

function safeColor(value: string): string {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : "#111827"
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

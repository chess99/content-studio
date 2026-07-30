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

type StudioState = {
  article: {
    path: string
    name: string
    markdown: string
  }
  themes: ThemeOption[]
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
  "bold-red",
]

const MATRIX_FAMILIES = [
  { key: "minimal", label: "简约", description: "最低干扰，内容优先" },
  { key: "focus", label: "聚焦", description: "居中强调，节奏清楚" },
  { key: "elegant", label: "编辑", description: "层次丰富，适合品牌长文" },
  { key: "bold", label: "醒目", description: "强标题，适合活动与转化" },
] as const

const MATRIX_COLORS = [
  { key: "gold", label: "古铜金", color: "#C8A062" },
  { key: "green", label: "翡翠绿", color: "#2BAE85" },
  { key: "blue", label: "宝石蓝", color: "#4B6EF5" },
  { key: "orange", label: "暖阳橙", color: "#F89A3A" },
  { key: "red", label: "中国红", color: "#F25C54" },
  { key: "navy", label: "深海蓝", color: "#1F4F8A" },
  { key: "gray", label: "石墨灰", color: "#4E5969" },
  { key: "sky", label: "天空蓝", color: "#3A7FD5" },
] as const

const COLLECTION_LABELS: Record<string, string> = {
  base: "基础主题",
  "built-in": "风格预设",
  classic: "经典排版",
  modern: "现代内容",
  extra: "特色风格",
}

const app = document.querySelector<HTMLDivElement>("#app")
if (!app) throw new Error("missing #app")

const state = {
  markdown: "",
  html: "",
  activeTheme: "default",
  themeSettings: {
    fontSize: 16,
    fontFamily: "system",
    codeBlockStyle: "dark",
  } as StudioThemeSettings,
  settingsOpen: false,
  settingsView: "appearance" as SettingsView,
  matrixFamily: "minimal",
  matrixColor: "gray",
  themes: [] as ThemeOption[],
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

        <section class="setting-group">
          <div class="group-heading">
            <div>
              <h3>组合主题</h3>
              <p>先选版式，再选强调色；正文始终保持白底。</p>
            </div>
          </div>
          <div class="family-grid" data-theme-families></div>
          <div class="color-grid" data-theme-colors></div>
        </section>

        <details class="preset-library setting-group">
          <summary>
            <span>更多风格预设</span>
            <small>按内容气质选择</small>
          </summary>
          <div data-theme-list="presets"></div>
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
    state.advancedModules = payload.data.advancedModules
    state.config = payload.data.config
    state.activeTheme = findTheme(payload.data.config.default_theme)?.name ?? payload.data.themes[0]?.name ?? "default"
    syncMatrixSelection(state.activeTheme)

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
    if (action === "select-theme" && actionTarget.dataset.theme) selectTheme(actionTarget.dataset.theme)
    if (action === "select-family" && actionTarget.dataset.family) {
      state.matrixFamily = actionTarget.dataset.family
      selectTheme(`${state.matrixFamily}-${state.matrixColor}`)
    }
    if (action === "select-color" && actionTarget.dataset.color) {
      state.matrixColor = actionTarget.dataset.color
      selectTheme(`${state.matrixFamily}-${state.matrixColor}`)
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

  const familyContainer = root.querySelector<HTMLElement>("[data-theme-families]")!
  familyContainer.innerHTML = MATRIX_FAMILIES.map(family => `
    <button class="family-card ${family.key === state.matrixFamily ? "active" : ""}" data-action="select-family" data-family="${family.key}" aria-pressed="${family.key === state.matrixFamily}">
      <strong>${family.label}</strong>
      <small>${family.description}</small>
    </button>
  `).join("")

  const colorContainer = root.querySelector<HTMLElement>("[data-theme-colors]")!
  colorContainer.innerHTML = MATRIX_COLORS.map(color => `
    <button class="color-choice ${color.key === state.matrixColor ? "active" : ""}" data-action="select-color" data-color="${color.key}" title="${color.label}" aria-label="${color.label}" aria-pressed="${color.key === state.matrixColor}">
      <span style="--choice-color:${color.color}"></span>
      <small>${color.label}</small>
    </button>
  `).join("")

  renderPresetLibrary()
  renderActiveThemeSummary()
}

function renderPresetLibrary(): void {
  const container = root.querySelector<HTMLElement>('[data-theme-list="presets"]')!
  const matrixCollections = new Set(["minimal", "focus", "elegant", "bold"])
  const themes = state.themes.filter(theme => !matrixCollections.has(theme.collection) && !RECOMMENDED_THEME_IDS.includes(theme.name))
  const grouped = new Map<string, ThemeOption[]>()
  for (const theme of themes) {
    const list = grouped.get(theme.collection) ?? []
    list.push(theme)
    grouped.set(theme.collection, list)
  }
  container.innerHTML = Array.from(grouped.entries()).map(([collection, items]) => `
    <section class="preset-group">
      <h4>${escapeHtml(COLLECTION_LABELS[collection] ?? "更多主题")}</h4>
      <div class="theme-grid compact-theme-grid">${items.map(themeCard).join("")}</div>
    </section>
  `).join("")
}

function themeCard(theme: ThemeOption): string {
  const active = theme.name === state.activeTheme
  return `
    <button class="theme-card ${active ? "active" : ""}" data-action="select-theme" data-theme="${escapeHtml(theme.name)}" style="--theme-accent:${safeColor(theme.accent)}" aria-pressed="${active}">
      <span class="theme-preview" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="theme-copy">
        <strong>${escapeHtml(theme.displayName)}</strong>
        <small>${escapeHtml(theme.bestFor)}</small>
        <code>${escapeHtml(theme.name)}</code>
      </span>
    </button>
  `
}

function renderActiveThemeSummary(): void {
  const theme = findTheme(state.activeTheme)
  if (!theme) return
  root.querySelector<HTMLElement>('[data-bind="active-theme-name"]')!.textContent = theme.displayName
  root.querySelector<HTMLElement>('[data-bind="active-theme-description"]')!.textContent = theme.bestFor
  root.querySelector<HTMLElement>(".active-theme-swatch")!.style.backgroundColor = safeColor(theme.accent)
}

function renderAdvancedModules(): void {
  const tags = root.querySelector<HTMLElement>(".module-tags")!
  const moduleCount = root.querySelector<HTMLElement>('[data-bind="module-count"]')!
  const featured = [...state.advancedModules.public.slice(0, 8), ...state.advancedModules.enhanced]
  moduleCount.textContent = `${state.advancedModules.total} 个可用`
  tags.innerHTML = featured.map(name => `<span>${escapeHtml(name)}</span>`).join("")
}

function selectTheme(themeName: string): void {
  const theme = findTheme(themeName)
  if (!theme) return
  state.activeTheme = theme.name
  syncMatrixSelection(theme.name)
  renderThemePicker()
  void convertNow()
}

function syncMatrixSelection(themeName: string): void {
  const match = /^(minimal|focus|elegant|bold)-(gold|green|blue|orange|red|navy|gray|sky)$/.exec(themeName)
  if (!match) return
  state.matrixFamily = match[1]
  state.matrixColor = match[2]
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
      theme: state.activeTheme,
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
    theme: state.activeTheme,
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

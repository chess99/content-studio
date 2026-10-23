#!/usr/bin/env node
/**
 * wx-publisher CLI
 * 命令行入口，默认输出 JSON，方便脚本解析
 *
 * 用法：
 *   wxp publish --file article.md [--theme github-readme] [--cover /path/to/cover.jpg]
 *   wxp convert --file article.md [--theme github-readme]
 *   wxp config set wechat_appid wx123...
 *   wxp config get
 *   wxp themes
 */

import { program } from "commander"
import { renderFigures } from "../publication/figures.js"
import { preparePublication, validateSourceUrl, extractSourceUrl } from "../publication/prepare.js"
import { readFileSync, writeFileSync, unlinkSync, writeSync } from "fs"
import { dirname, isAbsolute, resolve } from "path"
import { tmpdir } from "os"
import { randomUUID } from "crypto"
import { createServer, type IncomingMessage, type ServerResponse } from "http"
import type { AddressInfo } from "net"
import { convertMarkdown } from "../converter/index.js"
import { generatePreviewHtml, shellQuote, type ThemePreviewResult } from "../converter/preview-html.js"
import { buildNewspicDraftArticle, WechatClient, type UploadResult } from "../wechat/client.js"
import { loadConfig, saveConfig, getConfigPath, validateConfig } from "../config/index.js"
import { getTheme, listThemeLayouts, listThemePalettes, listThemeReferences, listThemes, resolveThemeSelection, type Theme } from "../converter/themes.js"
import { getPlaceholderCoverBase64 } from "../converter/placeholder-cover.js"
import { formatCliError } from "./errors.js"
import { tryOpenInDefaultApp } from "./open-in-default-app.js"
import { resolveThemeOption } from "./theme-options.js"
import { getThemeFileSchema, loadThemeFile } from "../converter/theme-file.js"
import { createStudioServer } from "../studio/server.js"
import { ENHANCED_ADVANCED_MODULES, PUBLIC_ADVANCED_MODULES } from "../converter/advanced-layout/parser.js"
import { summarizeWechatTopicCards } from "../converter/wechat-topics.js"

// ─── 输出格式 ─────────────────────────────────────────────────────────────────

function ok(data: unknown): never {
  writeAllSync(1, `${JSON.stringify({ success: true, data }, null, 2)}\n`)
  process.exit(0)
}

function fail(message: string, details?: unknown): never {
  writeAllSync(2, `${JSON.stringify(formatCliError(message, details), null, 2)}\n`)
  process.exit(1)
}

function writeAllSync(fd: number, text: string): void {
  const buffer = Buffer.from(text)
  let offset = 0
  while (offset < buffer.length) {
    try {
      const written = writeSync(fd, buffer, offset, buffer.length - offset)
      if (written === 0) {
        sleepSync(5)
      } else {
        offset += written
      }
    } catch (error) {
      if (isWriteAgain(error)) {
        sleepSync(5)
        continue
      }
      throw error
    }
  }
}

function isWriteAgain(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "EAGAIN"
}

function sleepSync(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

// ─── CLI 定义 ─────────────────────────────────────────────────────────────────

program
  .name("wxp")
  .description("Markdown → 微信公众号草稿，无需第三方 API Key")
  .version("0.1.0")

program
  .command("figures")
  .description("将研究图表 JSON 渲染为可编辑 SVG 与高清 PNG")
  .requiredOption("-f, --file <path>", "图表 JSON")
  .requiredOption("-o, --output <dir>", "图片目录")
  .action(async opts => {
    try { ok(await renderFigures(opts.file, opts.output)) }
    catch (error) { fail("图表渲染失败", String(error)) }
  })

program
  .command("prepare")
  .description("从单一源稿准备博客副本、微信静态稿与离线预览，不访问平台")
  .requiredOption("-f, --file <path>", "含 front matter 和本地图片的 Markdown 源稿")
  .requiredOption("-o, --output <dir>", "公众号渠道产物目录")
  .option("--blog-root <path>", "同步到现有 Hexo 仓库")
  .option("--theme <name>", "微信主题", "github-readme")
  .action(async opts => {
    try { ok(await preparePublication({ file: opts.file, outputDir: opts.output, blogRoot: opts.blogRoot, theme: opts.theme })) }
    catch (error) { fail("双渠道准备失败", String(error)) }
  })

// ── publish：完整流程（转换 + 上传图片 + 创建草稿） ──────────────────────────

program
  .command("publish")
  .description("将 Markdown 文件发布到微信公众号草稿箱")
  .requiredOption("-f, --file <path>", "Markdown 文件路径")
  .option("-t, --theme <name>", "完整主题预设（默认读配置，fallback: default）")
  .option("--layout <name>", "自定义版式（必须与 --palette 同时使用）")
  .option("--palette <name>", "自定义调色板（必须与 --layout 同时使用）")
  .option("--theme-file <path>", "外部主题 JSON 文件路径（不能与其他主题参数同时使用）")
  .option("-c, --cover <path>", "封面图本地路径（不提供则使用内置占位图）")
  .option("--cover-url <url>", "封面图 URL（与 --cover 二选一）")
  .option("--title <title>", "文章标题（默认从 Markdown h1 提取）")
  .option("--source-url <url>", "阅读原文链接（HTTP(S)，写入 content_source_url）")
  .option("--author <author>", "作者名")
  .option("--digest <text>", "文章摘要（120 字以内，显示在转发卡片等位置）")
  .option("--no-upload-images", "不自动上传文章中的外链图片")
  .action(async (opts) => {
    let sourceUrl: string | undefined
    try { sourceUrl = opts.sourceUrl ? validateSourceUrl(opts.sourceUrl) : undefined }
    catch (error) { fail("原文链接无效", String(error)) }
    const config = loadConfig()
    const errors = validateConfig(config)
    if (errors.length > 0) fail("配置不完整", errors)

    // 读取 Markdown
    let markdown: string
    const articlePath = resolve(opts.file)
    const articleDir = dirname(articlePath)
    try {
      markdown = readFileSync(articlePath, "utf-8")
    } catch (e) {
      fail(`读取文件失败: ${opts.file}`, String(e))
    }
    try { sourceUrl ??= extractSourceUrl(markdown) }
    catch (error) { fail("源稿中的原文链接无效", String(error)) }

    let themeOption: ReturnType<typeof resolveThemeOption>
    try {
      themeOption = resolveThemeOption({ theme: opts.theme, themeFile: opts.themeFile, layout: opts.layout, palette: opts.palette }, config.default_theme)
    } catch (e) {
      fail("主题参数冲突或主题文件无效", String(e))
    }
    if (themeOption.warnings?.length) {
      console.error(JSON.stringify({ warnings: themeOption.warnings }))
    }
    const theme = themeOption.themeName
    const client = new WechatClient({ appid: config.wechat_appid, secret: config.wechat_secret })

    // 转换 Markdown
    const { html, externalImages, localImages, wechatTopics } = await convertMarkdown(markdown, {
      theme,
      themeDefinition: themeOption.themeDefinition,
    })
    const topicCardSummary = summarizeWechatTopicCards(wechatTopics)

    // 提取标题（从 Markdown 第一个 h1，或用文件名）
    const title = opts.title ?? extractTitle(markdown) ?? opts.file
    const digest = typeof opts.digest === "string" && opts.digest.trim() ? opts.digest.trim() : undefined
    if (digest && Array.from(digest).length > 120) {
      fail("摘要不能超过 120 个字符", { length: Array.from(digest).length, max: 120 })
    }

    // 处理封面图
    let thumbMediaId: string
    let usedPlaceholderCover = false
    if (opts.cover) {
      const result = await client.uploadImage(resolve(opts.cover)).catch(e => fail(`上传封面图失败`, String(e)))
      thumbMediaId = result.media_id
    } else if (opts.coverUrl) {
      const result = await client.uploadImageFromUrl(opts.coverUrl).catch(e => fail(`下载并上传封面图失败`, String(e)))
      thumbMediaId = result.media_id
    } else {
      // 未提供封面图，使用内置占位图
      const tmpPath = resolve(tmpdir(), `wx-publisher-placeholder-${randomUUID()}.png`)
      writeFileSync(tmpPath, Buffer.from(getPlaceholderCoverBase64(), "base64"))
      try {
        const result = await client.uploadImage(tmpPath).catch(e => fail(`上传占位封面图失败`, String(e)))
        thumbMediaId = result.media_id
        usedPlaceholderCover = true
      } finally {
        try { unlinkSync(tmpPath) } catch {}
      }
    }

    // 上传文章内图片，替换为微信素材 URL
    let finalHtml = html
    const imageCount = externalImages.length + localImages.length
    let uploadedImageCount = 0
    if (opts.uploadImages !== false && imageCount > 0) {
      const imageMap = new Map<string, string>()
      for (const imgUrl of externalImages) {
        try {
          const result = await client.uploadImageFromUrl(imgUrl)
          imageMap.set(imgUrl, result.url)
        } catch (e) {
          fail(`正文图片上传失败，未创建草稿: ${imgUrl}`, String(e))
        }
      }
      for (const imgPath of localImages) {
        const absPath = isAbsolute(imgPath) ? imgPath : resolve(articleDir, imgPath)
        try {
          const result = await client.uploadImage(absPath)
          imageMap.set(imgPath, result.url)
        } catch (e) {
          fail(`正文图片上传失败，未创建草稿: ${imgPath}`, String(e))
        }
      }
      // 替换 HTML 中的图片 URL
      for (const [original, wxUrl] of imageMap) {
        finalHtml = finalHtml.replaceAll(original, wxUrl)
      }
      uploadedImageCount = imageMap.size
    }

    // 创建草稿
    const draft = await client.createDraft([
      {
        article_type: "news",
        title,
        content: finalHtml,
        thumb_media_id: thumbMediaId,
        author: opts.author,
        digest,
        ...(sourceUrl ? { content_source_url: sourceUrl } : {}),
        show_cover_pic: 1,
        need_open_comment: 0,
      },
    ]).catch(e => fail(`创建草稿失败`, String(e)))

    const warnings = [
      ...(topicCardSummary ? [topicCardSummary.instruction] : []),
      ...(usedPlaceholderCover ? ["未提供封面图，已使用内置占位图。建议用 --cover 或 --cover-url 指定真实封面图后重新发布。"] : []),
    ]

    ok({
      media_id: draft.media_id,
      title,
      digest,
      ...(sourceUrl ? { content_source_url: sourceUrl } : {}),
      theme,
      images_detected: imageCount,
      images_uploaded: uploadedImageCount,
      external_images: externalImages,
      local_images: localImages,
      message: "草稿已创建，请在微信公众号后台发布",
      used_placeholder_cover: usedPlaceholderCover,
      ...(topicCardSummary && { wechat_topic_cards: topicCardSummary }),
      ...(warnings.length > 0 && { warnings }),
      ...(warnings.length > 0 && { warning: warnings.join(" ") }),
    })
  })

// ── publish-newspic：上传图片 + 创建贴图草稿 ───────────────────────────────

program
  .command("publish-newspic")
  .description("创建微信公众号贴图草稿")
  .requiredOption("--title <title>", "贴图标题，最多 20 个字符")
  .option("--content <text>", "贴图描述")
  .option("--image <path-or-url>", "贴图图片，可重复传入", collectOption, [] as string[])
  .option("--open-comment", "开启留言")
  .option("--only-fans-can-comment", "仅粉丝可留言")
  .action(async (opts) => {
    const title = String(opts.title ?? "").trim()
    validateNewspicTitleOrFail(title)
    const imageSources = normalizeImageInputs(opts.image)
    if (imageSources.length === 0) fail("images must be a non-empty array")

    const config = loadConfig()
    const errors = validateConfig(config)
    if (errors.length > 0) fail("配置不完整", errors)

    const client = new WechatClient({ appid: config.wechat_appid, secret: config.wechat_secret })
    const uploads = await uploadNewspicImages(imageSources, client)
    const draft = await client.createDraft([
      buildNewspicDraftArticle({
        title,
        content: typeof opts.content === "string" ? opts.content : undefined,
        images: uploads,
        needOpenComment: Boolean(opts.openComment),
        onlyFansCanComment: Boolean(opts.onlyFansCanComment),
      }),
    ]).catch(e => fail("创建贴图草稿失败", String(e)))

    ok({
      media_id: draft.media_id,
      title,
      type: "newspic",
      images_uploaded: uploads.length,
      images: uploads.map((upload, index) => ({ source: imageSources[index], ...upload })),
      message: "贴图草稿已创建，请在微信公众号后台发布",
    })
  })

// ── convert：仅转换，不发布 ───────────────────────────────────────────────────

program
  .command("convert")
  .description("将 Markdown 转换为微信 HTML（不发布）")
  .requiredOption("-f, --file <path>", "Markdown 文件路径")
  .option("-t, --theme <name>", "完整主题预设")
  .option("--layout <name>", "自定义版式（必须与 --palette 同时使用）")
  .option("--palette <name>", "自定义调色板（必须与 --layout 同时使用）")
  .option("--theme-file <path>", "外部主题 JSON 文件路径（不能与其他主题参数同时使用）")
  .option("-o, --output <path>", "输出 HTML 文件路径（不指定则输出到 stdout）")
  .action(async (opts) => {
    let markdown: string
    try {
      markdown = readFileSync(resolve(opts.file), "utf-8")
    } catch (e) {
      fail(`读取文件失败: ${opts.file}`, String(e))
    }

    const config = loadConfig()
    let themeOption: ReturnType<typeof resolveThemeOption>
    try {
      themeOption = resolveThemeOption({ theme: opts.theme, themeFile: opts.themeFile, layout: opts.layout, palette: opts.palette }, config.default_theme)
    } catch (e) {
      fail("主题参数冲突或主题文件无效", String(e))
    }
    if (themeOption.warnings?.length) {
      console.error(JSON.stringify({ warnings: themeOption.warnings }))
    }
    const theme = themeOption.themeName
    const { html, externalImages, localImages, wechatTopics } = await convertMarkdown(markdown, {
      theme,
      themeDefinition: themeOption.themeDefinition,
    })
    const topicCardSummary = summarizeWechatTopicCards(wechatTopics)

    if (opts.output) {
      const { writeFileSync } = await import("fs")
      writeFileSync(resolve(opts.output), html, "utf-8")
      ok({
        output: opts.output,
        theme,
        external_images: externalImages,
        local_images: localImages,
        ...(topicCardSummary && { wechat_topic_cards: topicCardSummary }),
      })
    } else {
      // 直接输出 HTML（不包 JSON），方便 pipe
      process.stdout.write(html)
      process.exit(0)
    }
  })

// ── config ────────────────────────────────────────────────────────────────────

const configCmd = program.command("config").description("管理配置")

configCmd
  .command("set <key> <value>")
  .description("设置配置项（wechat_appid / wechat_secret / default_theme）")
  .action((key, value) => {
    const allowed = ["wechat_appid", "wechat_secret", "default_theme"]
    if (!allowed.includes(key)) {
      fail(`未知配置项: ${key}`, { allowed })
    }
    saveConfig({ [key]: value } as never)
    ok({ key, value: key.includes("secret") ? "***" : value })
  })

configCmd
  .command("get")
  .description("查看当前配置（secret 脱敏）")
  .action(() => {
    const config = loadConfig()
    ok({
      wechat_appid:       config.wechat_appid || "(未设置)",
      wechat_secret:      config.wechat_secret ? "***" : "(未设置)",
      default_theme:      config.default_theme,
      config_path:        getConfigPath(),
    })
  })

configCmd
  .command("path")
  .description("输出配置文件路径")
  .action(() => {
    ok({ path: getConfigPath() })
  })

// ── themes ────────────────────────────────────────────────────────────────────

program
  .command("themes")
  .description("列出完整预设、自定义版式和调色板")
  .option("--verbose", "显示详细样式信息")
  .action((opts) => {
    const names = listThemes()
    const themes = names.map(name => {
      const t = getTheme(name)
      const summary = {
        name: t.name,
        description: t.description,
        collection: t.collection,
        displayName: t.displayName,
        bestFor: t.bestFor,
        density: t.density,
        contrast: t.contrast,
        accent: t.accent,
      }
      return opts.verbose ? { ...summary, styles: t.styles } : summary
    })
    ok({
      presets: themes,
      layouts: listThemeLayouts(),
      palettes: listThemePalettes(),
      counts: {
        presets: themes.length,
        layouts: listThemeLayouts().length,
        palettes: listThemePalettes().length,
      },
    })
  })

// ── studio：本地网页工作台 ───────────────────────────────────────────────────

program
  .command("studio")
  .description("启动本地网页工作台，编辑、预览、复制并创建微信公众号草稿")
  .requiredOption("-f, --file <path>", "Markdown 文件路径")
  .option("-p, --port <number>", "本地监听端口（默认随机可用端口）")
  .option("--no-open", "启动后不自动打开浏览器")
  .action(async (opts) => {
    try {
      const parsedPort = opts.port === undefined ? 0 : Number.parseInt(opts.port, 10)
      if (Number.isNaN(parsedPort) || parsedPort < 0 || parsedPort > 65535) {
        throw new Error(`无效端口: ${opts.port}`)
      }

      const server = await createStudioServer({
        articlePath: resolve(opts.file),
        host: "127.0.0.1",
        port: parsedPort,
        openBrowser: opts.open !== false,
      })

      console.log(JSON.stringify({
        success: true,
        data: {
          url: server.url,
          file: resolve(opts.file),
          host: server.host,
          port: server.port,
          opened: server.opened,
          ...(server.warning ? { warning: server.warning } : {}),
          message: "Studio 已启动。按 Ctrl+C 退出。",
        },
      }, null, 2))
    } catch (e) {
      console.error(JSON.stringify(formatCliError("启动 Studio 失败", String(e)), null, 2))
      process.exit(1)
    }
  })

// ── serve：本地 REST API（自动化集成） ───────────────────────────────────────

program
  .command("serve")
  .description("启动本地 REST API 服务")
  .option("-p, --port <port>", "监听端口", "8080")
  .action((opts) => {
    const requestedPort = Number.parseInt(opts.port, 10)
    const port = Number.isFinite(requestedPort) ? requestedPort : 8080
    const server = createServer((req, res) => {
      handleApiRequest(req, res).catch(error => {
        const status = error instanceof ApiRequestError ? error.status : 500
        sendJson(res, status, {
          success: false,
          error: error instanceof ApiRequestError ? error.message : "内部错误",
          details: String(error),
        })
      })
    })

    server.listen(port, "127.0.0.1", () => {
      const address = server.address() as AddressInfo
      console.log(JSON.stringify({
        success: true,
        data: {
          url: `http://127.0.0.1:${address.port}`,
          port: address.port,
          endpoints: [
            "POST /api/v1/convert",
            "POST /api/v1/article-draft",
            "POST /api/v1/newspic-draft",
            "POST /api/v1/batch-upload",
          ],
        },
      }))
    })
  })

// ── theme：外部主题文件工具 ───────────────────────────────────────────────────

const themeCmd = program.command("theme").description("外部主题文件工具")

themeCmd
  .command("schema")
  .description("输出外部主题 JSON schema")
  .action(() => {
    ok({ schema: getThemeFileSchema() })
  })

themeCmd
  .command("validate")
  .description("校验外部主题 JSON 文件")
  .requiredOption("-f, --file <path>", "外部主题 JSON 文件路径")
  .action((opts) => {
    const result = loadThemeFile(resolve(opts.file))
    if (!result.theme) {
      fail("主题文件无效", result.errors)
    }

    ok({
      valid: true,
      theme: {
        name: result.theme.name,
        description: result.theme.description,
      },
      warnings: result.warnings,
    })
  })

// ── capabilities：供脚本查询本工具能力 ───────────────────────────────────────

program
  .command("capabilities")
  .description("输出本工具的能力描述（供脚本使用）")
  .action(() => {
    ok({
      tool: "wx-publisher",
      version: "0.1.0",
      description: "Markdown 转微信公众号草稿，无需第三方 API Key，完全本地转换",
      features: {
        external_theme_file: true,
        advanced_layout: true,
        gfm_alerts: true,
        footnotes: true,
        local_rest_api: true,
        curated_theme_presets: true,
        composable_theme_customization: true,
        theme_gallery: true,
        wechat_topic_card_markers: true,
        dual_channel_prepare: true,
        static_research_figures: true,
        article_source_url: true,
      },
      coverage: {
        theme_system: {
          presets: listThemes().length,
          layouts: listThemeLayouts().length,
          palettes: listThemePalettes().length,
        },
        advanced_modules: {
          public: PUBLIC_ADVANCED_MODULES.length,
          enhanced: ENHANCED_ADVANCED_MODULES.length,
          total_supported: PUBLIC_ADVANCED_MODULES.length + ENHANCED_ADVANCED_MODULES.length,
          public_modules: PUBLIC_ADVANCED_MODULES,
          enhanced_modules: ENHANCED_ADVANCED_MODULES,
        },
      },
      commands: {
        figures: {
          description: "从 JSON 生成精确研究图表 SVG/PNG，不访问平台",
          required_flags: ["--file", "--output"],
        },
        prepare: {
          description: "单一源稿生成微信静态稿、离线预览与可选 Hexo 副本，不访问平台",
          required_flags: ["--file", "--output"],
          optional_flags: ["--blog-root", "--theme"],
        },
        publish: {
          description: "完整流程：Markdown → HTML → 上传图片 → 创建草稿",
          required_config: ["wechat_appid", "wechat_secret"],
          required_flags: ["--file"],
          optional_flags: ["--theme", "--layout", "--palette", "--theme-file", "--title", "--author", "--digest", "--source-url", "--no-upload-images", "--cover", "--cover-url"],
        },
        "publish-newspic": {
          description: "上传图片并创建微信公众号贴图草稿",
          required_config: ["wechat_appid", "wechat_secret"],
          required_flags: ["--title", "--image"],
          optional_flags: ["--content", "--open-comment", "--only-fans-can-comment"],
        },
        convert: {
          description: "仅转换 Markdown 为微信 HTML，不发布",
          required_flags: ["--file"],
          optional_flags: ["--theme", "--layout", "--palette", "--theme-file", "--output"],
        },
        preview: {
          description: "生成浏览器主题画廊预览页",
          required_flags: ["--file"],
          optional_flags: ["--theme-file", "--output", "--no-open"],
        },
        "theme-gallery": {
          description: "生成本地静态主题画廊，默认使用高级模块 showcase 样稿",
          required_flags: [],
          optional_flags: ["--file", "--theme-file", "--output", "--no-open"],
        },
        studio: {
          description: "启动本地网页工作台，支持编辑、预览、复制和创建微信公众号草稿",
          required_flags: ["--file"],
          optional_flags: ["--port", "--no-open"],
        },
        serve: {
          description: "启动本地 REST API 服务",
          optional_flags: ["--port"],
          endpoints: [
            "POST /api/v1/convert",
            "POST /api/v1/article-draft",
            "POST /api/v1/newspic-draft",
            "POST /api/v1/batch-upload",
          ],
        },
        theme: {
          description: "外部主题文件工具",
          subcommands: {
            schema: { description: "输出外部主题 JSON schema" },
            validate: {
              description: "校验外部主题 JSON 文件",
              required_flags: ["--file"],
            },
          },
        },
        "config set": {
          description: "设置配置项",
          keys: ["wechat_appid", "wechat_secret", "default_theme"],
        },
        "config get": { description: "查看当前配置" },
        themes: { description: "列出完整预设、自定义版式和调色板" },
      },
      external_theme_file: {
        description: "通过 --theme-file 传入外部主题 JSON，不能与 --theme、--layout 或 --palette 同时使用",
        commands: ["convert", "publish", "preview", "theme-gallery", "theme schema", "theme validate"],
        schema: getThemeFileSchema(),
      },
      env_vars: {
        WXP_APPID: "微信公众号 AppID",
        WXP_SECRET: "微信公众号 AppSecret",
        WXP_THEME: "默认主题",
      },
      theme_system: {
        presets: listThemeReferences(),
        layouts: listThemeLayouts(),
        palettes: listThemePalettes(),
      },
      notes: [
        "封面图可选：--cover 本地路径 或 --cover-url 公网 URL；不提供则自动使用内置占位图，JSON 输出含 warning 字段",
        "文章中的外链图片和本地图片会自动上传到微信素材库",
        "本地相对图片路径按 Markdown 文件所在目录解析",
        "微信公众号草稿创建后需在后台手动发布",
        "公众号渠道稿可用独立的 #话题名 行标记话题卡片位置；草稿创建后仍需在微信后台绑定并转换为真实话题卡片",
        "access_token 自动缓存，有效期内不重复请求",
      ],
    })
  })

// ── draft：草稿管理 ───────────────────────────────────────────────────────────

const draftCmd = program.command("draft").description("草稿箱管理")

draftCmd
  .command("list")
  .description("列出最新草稿")
  .option("-n, --count <n>", "获取数量", "5")
  .action(async (opts) => {
    const config = loadConfig()
    const errors = validateConfig(config)
    if (errors.length > 0) fail("配置不完整", errors)
    const client = new WechatClient({ appid: config.wechat_appid, secret: config.wechat_secret })
    const drafts = await client.listDrafts(parseInt(opts.count)).catch(e => fail("获取草稿列表失败", String(e)))
    ok({ drafts })
  })

// ── validate：静态检查本地 HTML ───────────────────────────────────────────────

program
  .command("validate")
  .description("静态检查本地 HTML 文件的已知微信渲染问题")
  .requiredOption("-f, --file <path>", "要检查的 HTML 文件路径（由 convert 命令生成）")
  .action((opts) => {
    let html: string
    try {
      html = readFileSync(resolve(opts.file), "utf-8")
    } catch (e) {
      fail(`读取文件失败: ${opts.file}`, String(e))
    }

    const checks: Record<string, { status: string; detail: string }> = {}

    // CHECK: 普通 Markdown 列表应使用非原生列表结构，避免编辑器重复补 marker
    const safeListMatches = [...html.matchAll(/data-wxp-list="(ordered|unordered)"/g)]
    if (safeListMatches.length === 0) {
      checks["LIST_WECHAT_SAFE_STRUCTURE"] = { status: "SKIP", detail: "无普通 Markdown 列表" }
    } else {
      const nativeListMatches = [...html.matchAll(/<(ul|ol|li)\b/g)]
      checks["LIST_WECHAT_SAFE_STRUCTURE"] = {
        status: nativeListMatches.length === 0 ? "PASS" : "FAIL",
        detail: `${safeListMatches.length} 个安全列表，${nativeListMatches.length} 个原生列表标签`,
      }
    }

    // CHECK: 无序列表有 • 前缀文本
    const bulletCount = (html.match(/• /g) || []).length
    checks["LIST_HAS_BULLET"] = {
      status: bulletCount > 0 ? "PASS" : "SKIP",
      detail: `发现 ${bulletCount} 个 • 前缀`,
    }

    // CHECK: pre 有背景样式
    const preMatches = [...html.matchAll(/<pre[^>]*style="([^"]*)"/g)]
    if (preMatches.length === 0) {
      checks["CODE_BLOCK_BACKGROUND"] = { status: "SKIP", detail: "无代码块" }
    } else {
      const bad = preMatches.filter(m => !m[1].includes("background:"))
      checks["CODE_BLOCK_BACKGROUND"] = {
        status: bad.length === 0 ? "PASS" : "FAIL",
        detail: `${preMatches.length} 个 pre，${bad.length} 个缺少 background 样式`,
      }
    }

    // CHECK: pre code 有 color
    const preCodeMatches = [...html.matchAll(/class="language-[^"]*"\s+style="([^"]*)"/g)]
    if (preCodeMatches.length === 0) {
      checks["CODE_BLOCK_TEXT_COLOR"] = { status: "SKIP", detail: "无代码块" }
    } else {
      const bad = preCodeMatches.filter(m => !m[1].includes("color:"))
      checks["CODE_BLOCK_TEXT_COLOR"] = {
        status: bad.length === 0 ? "PASS" : "FAIL",
        detail: `${preCodeMatches.length} 个 pre code，${bad.length} 个缺少 color 样式`,
      }
    }

    // CHECK: inline-code 有 style
    const inlineCodeMatches = [...html.matchAll(/class="inline-code"\s+style="([^"]*)"/g)]
    const inlineCodeNoStyle = [...html.matchAll(/class="inline-code"\s+style=""/g)]
    if (inlineCodeMatches.length === 0 && inlineCodeNoStyle.length === 0) {
      checks["CODE_INLINE_STYLE"] = { status: "SKIP", detail: "无行内代码" }
    } else {
      checks["CODE_INLINE_STYLE"] = {
        status: inlineCodeNoStyle.length === 0 ? "PASS" : "FAIL",
        detail: `${inlineCodeMatches.length + inlineCodeNoStyle.length} 个 inline-code，${inlineCodeNoStyle.length} 个 style 为空`,
      }
    }

    // CHECK: h2 有 border-left
    const h2Matches = [...html.matchAll(/<h2[^>]*style="([^"]*)"/g)]
    if (h2Matches.length === 0) {
      checks["H2_BORDER_LEFT"] = { status: "SKIP", detail: "无 h2" }
    } else {
      const bad = h2Matches.filter(m => !m[1].includes("border-left"))
      checks["H2_BORDER_LEFT"] = {
        status: bad.length === 0 ? "PASS" : "FAIL",
        detail: `${h2Matches.length} 个 h2，${bad.length} 个缺少 border-left`,
      }
    }

    const checkList = Object.entries(checks).map(([id, result]) => ({ id, ...result }))
    const passCount = checkList.filter(c => c.status === "PASS").length
    const failCount = checkList.filter(c => c.status === "FAIL").length
    const skipCount = checkList.filter(c => c.status === "SKIP").length

    ok({
      overall: failCount === 0 ? "PASS" : "FAIL",
      pass_count: passCount,
      fail_count: failCount,
      skip_count: skipCount,
      checks: checkList,
      recommendation: failCount === 0
        ? "静态检查通过"
        : `需要修复: ${checkList.filter(c => c.status === "FAIL").map(c => c.id).join(", ")}`,
    })
  })

// ── preview：浏览器主题预览（人类用） ─────────────────────────────────────────

program
  .command("theme-gallery")
  .description("生成本地静态主题画廊")
  .option("-f, --file <path>", "Markdown 样稿路径（默认 examples/advanced-layout-showcase.md）")
  .option("--theme-file <path>", "额外预览的外部主题 JSON 文件路径")
  .option("-o, --output <path>", "输出 HTML 路径（默认写入系统临时目录）")
  .option("--no-open", "生成 HTML 但不自动打开浏览器")
  .action(async (opts) => {
    const sourcePath = resolve(opts.file ?? "examples/advanced-layout-showcase.md")
    const { results } = await renderThemePreviewResults(sourcePath, opts.themeFile)
    const outputPath = opts.output ?? `${tmpdir()}/wxp-theme-gallery-${randomUUID()}.html`
    writeThemeGallery(outputPath, results, sourcePath)
    const openResult = await tryOpenInDefaultApp(outputPath, opts.open !== false)

    ok({
      path: outputPath,
      source_file: sourcePath.replace(/\\/g, "/"),
      theme_count: listThemes().length,
      themes: results.map(r => ({ theme: r.theme, ok: !r.error, error: r.error })),
      opened: openResult.opened,
      message: openResult.opened ? "已在浏览器中打开主题画廊" : "主题画廊文件已生成",
      ...(openResult.warning ? { warning: openResult.warning } : {}),
    })
  })

program
  .command("preview")
  .description("在浏览器中预览所有主题效果")
  .requiredOption("-f, --file <path>", "Markdown 文件路径")
  .option("--theme-file <path>", "额外预览的外部主题 JSON 文件路径")
  .option("-o, --output <path>", "输出 HTML 路径（默认写入系统临时目录）")
  .option("--no-open", "生成 HTML 但不自动打开浏览器")
  .action(async (opts) => {
    const absPath = resolve(opts.file)
    const { results } = await renderThemePreviewResults(absPath, opts.themeFile)
    const outputPath = opts.output ?? `${tmpdir()}/wxp-preview-${randomUUID()}.html`
    writeThemeGallery(outputPath, results, absPath)
    const openResult = await tryOpenInDefaultApp(outputPath, opts.open !== false)

    ok({
      path: outputPath,
      themes: results.map(r => ({ theme: r.theme, ok: !r.error, error: r.error })),
      opened: openResult.opened,
      message: openResult.opened ? "已在浏览器中打开预览" : "预览文件已生成",
      ...(openResult.warning ? { warning: openResult.warning } : {}),
    })
  })

program.parse()

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

function extractTitle(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim() ?? null
}

function collectOption(value: string, previous: string[]): string[] {
  previous.push(value)
  return previous
}

function normalizeImageInputs(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((image): image is string => typeof image === "string" && image.trim().length > 0)
    .map(image => image.trim())
}

function validateNewspicTitleOrFail(title: string): void {
  if (!title) fail("title is required")
  const length = Array.from(title).length
  if (length > 20) fail("title cannot exceed 20 characters", { length, max: 20 })
}

function isHttpUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://")
}

async function uploadNewspicImages(images: string[], client: WechatClient): Promise<UploadResult[]> {
  const uploads: UploadResult[] = []
  for (const image of images) {
    const upload = isHttpUrl(image)
      ? await client.uploadImageFromUrl(image)
      : await client.uploadImage(resolve(image))
    uploads.push(upload)
  }
  return uploads
}

interface PreviewRenderTarget {
  theme: string
  themeDefinition?: Theme
  publishCommand: string
  metadata: Omit<ThemePreviewResult, "html" | "error" | "publishCommand">
}

async function renderThemePreviewResults(articlePath: string, themeFile?: string): Promise<{ results: ThemePreviewResult[] }> {
  let markdown: string
  try {
    markdown = readFileSync(articlePath, "utf-8")
  } catch (e) {
    fail(`读取文件失败: ${articlePath}`, String(e))
  }

  const renderTargets: PreviewRenderTarget[] = listThemes().map(themeName => {
    const theme = getTheme(themeName)
    return {
      theme: themeName,
      publishCommand: `wxp publish --file ${shellQuote(articlePath)} --theme ${shellQuote(themeName)}`,
      metadata: previewMetadata(theme),
    }
  })

  if (themeFile) {
    const themePath = resolve(themeFile)
    const result = loadThemeFile(themePath)
    if (!result.theme) {
      fail("主题文件无效", result.errors)
    }
    if (result.warnings.length) {
      console.error(JSON.stringify({ warnings: result.warnings }))
    }
    renderTargets.push({
      theme: result.theme.name,
      themeDefinition: result.theme,
      publishCommand: `wxp publish --file ${shellQuote(articlePath)} --theme-file ${shellQuote(themePath)}`,
      metadata: previewMetadata(result.theme, "custom"),
    })
  }

  const settled = await Promise.allSettled(
    renderTargets.map(target => convertMarkdown(markdown, {
      theme: target.theme,
      themeDefinition: target.themeDefinition,
    }))
  )

  const results = renderTargets.map((target, i): ThemePreviewResult => {
    const rendered = settled[i]
    if (rendered.status === "fulfilled") {
      return {
        ...target.metadata,
        html: rendered.value.html,
        publishCommand: target.publishCommand,
      }
    }
    return {
      ...target.metadata,
      html: "",
      error: String(rendered.reason),
      publishCommand: target.publishCommand,
    }
  })

  return { results }
}

function previewMetadata(theme: Theme, collectionOverride?: string): Omit<ThemePreviewResult, "html" | "error" | "publishCommand"> {
  return {
    theme: theme.name,
    displayName: theme.displayName ?? theme.name,
    collection: collectionOverride ?? theme.collection ?? "custom",
    bestFor: theme.bestFor ?? theme.description,
    density: theme.density ?? "medium",
    contrast: theme.contrast ?? "medium",
    accent: theme.accent ?? "#07c160",
  }
}

function writeThemeGallery(outputPath: string, results: ThemePreviewResult[], articlePath: string): void {
  const html = generatePreviewHtml(results, articlePath)
  try {
    writeFileSync(outputPath, html, "utf-8")
  } catch (e) {
    fail(`写入预览文件失败: ${outputPath}`, String(e))
  }
}

interface ConvertApiBody {
  markdown?: string
  theme?: unknown
  fontSize?: string
  convertVersion?: string
  title?: string
  content?: string
  author?: string
  digest?: string
  cover?: string
  coverUrl?: string
  images?: string[]
  needOpenComment?: boolean
  onlyFansCanComment?: boolean
}

async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method === "GET" && req.url === "/health") {
    sendJson(res, 200, { success: true, data: { status: "ok" } })
    return
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { success: false, error: "Method Not Allowed" })
    return
  }

  const path = req.url?.split("?")[0] ?? ""
  const body = await readJsonBody(req)

  if (path === "/api/v1/convert") {
    await handleConvertApi(body, res)
    return
  }
  if (path === "/api/v1/article-draft") {
    await handleDraftApi(body, res)
    return
  }
  if (path === "/api/v1/newspic-draft") {
    await handleNewspicDraftApi(body, res)
    return
  }
  if (path === "/api/v1/batch-upload") {
    await handleBatchUploadApi(body, res)
    return
  }

  sendJson(res, 404, { success: false, error: "Not Found" })
}

async function handleConvertApi(body: ConvertApiBody, res: ServerResponse): Promise<void> {
  if (typeof body.markdown !== "string") {
    sendJson(res, 400, { success: false, error: "markdown is required" })
    return
  }

  const config = loadConfig()
  const resolved = resolveApiTheme(body.theme, config.default_theme)
  const result = await convertMarkdown(body.markdown, {
    theme: resolved.theme.name,
    themeDefinition: resolved.theme,
    stripLinks: false,
  })
  const topicCardSummary = summarizeWechatTopicCards(result.wechatTopics)
  const warnings = [
    ...apiWarnings(body),
    ...(topicCardSummary ? [topicCardSummary.instruction] : []),
  ]

  sendJson(res, 200, {
    success: true,
    data: {
      html: result.html,
      theme: resolved.selection,
      external_images: result.externalImages,
      local_images: result.localImages,
      ...(topicCardSummary && { wechat_topic_cards: topicCardSummary }),
      warnings,
    },
  })
}

async function handleDraftApi(body: ConvertApiBody, res: ServerResponse): Promise<void> {
  const config = loadConfig()
  const errors = validateConfig(config)
  if (errors.length > 0) {
    sendJson(res, 400, { success: false, error: "配置不完整", details: errors })
    return
  }
  if (typeof body.markdown !== "string") {
    sendJson(res, 400, { success: false, error: "markdown is required" })
    return
  }

  const resolved = resolveApiTheme(body.theme, config.default_theme)
  const title = body.title || extractTitle(body.markdown) || "Untitled"
  const digest = typeof body.digest === "string" && body.digest.trim() ? body.digest.trim() : undefined
  if (digest && Array.from(digest).length > 120) {
    sendJson(res, 400, { success: false, error: "摘要不能超过 120 个字符" })
    return
  }

  const result = await convertMarkdown(body.markdown, {
    theme: resolved.theme.name,
    themeDefinition: resolved.theme,
  })
  const topicCardSummary = summarizeWechatTopicCards(result.wechatTopics)
  const client = new WechatClient({ appid: config.wechat_appid, secret: config.wechat_secret })
  const finalArticle = await uploadAndRewriteArticleImages(
    result.html,
    result.externalImages,
    result.localImages,
    client,
    process.cwd(),
  )
  const thumbMediaId = await resolveApiCover(body, client)

  const draft = await client.createDraft([{
    article_type: "news",
    title,
    content: finalArticle.html,
    thumb_media_id: thumbMediaId.mediaId,
    author: body.author,
    digest,
    show_cover_pic: 1,
    need_open_comment: 0,
  }])

  sendJson(res, 200, {
    success: true,
    data: {
      media_id: draft.media_id,
      title,
      digest,
      theme: resolved.selection,
      images_detected: result.externalImages.length + result.localImages.length,
      images_uploaded: finalArticle.uploadedImageCount,
      external_images: result.externalImages,
      local_images: result.localImages,
      used_placeholder_cover: thumbMediaId.usedPlaceholder,
      ...(topicCardSummary && { wechat_topic_cards: topicCardSummary }),
      warnings: [
        ...apiWarnings(body),
        ...(topicCardSummary ? [topicCardSummary.instruction] : []),
      ],
    },
  })
}

async function handleNewspicDraftApi(body: ConvertApiBody, res: ServerResponse): Promise<void> {
  const config = loadConfig()
  const errors = validateConfig(config)
  if (errors.length > 0) {
    sendJson(res, 400, { success: false, error: "配置不完整", details: errors })
    return
  }

  const title = typeof body.title === "string" ? body.title.trim() : ""
  if (!title) {
    sendJson(res, 400, { success: false, error: "title is required" })
    return
  }
  if (Array.from(title).length > 20) {
    sendJson(res, 400, { success: false, error: "title cannot exceed 20 characters" })
    return
  }

  const imageSources = normalizeImageInputs(body.images)
  if (imageSources.length === 0) {
    sendJson(res, 400, { success: false, error: "images must be a non-empty array" })
    return
  }

  const client = new WechatClient({ appid: config.wechat_appid, secret: config.wechat_secret })
  const uploads = await uploadNewspicImages(imageSources, client)
  const draft = await client.createDraft([
    buildNewspicDraftArticle({
      title,
      content: typeof body.content === "string" ? body.content : undefined,
      images: uploads,
      needOpenComment: Boolean(body.needOpenComment),
      onlyFansCanComment: Boolean(body.onlyFansCanComment),
    }),
  ])

  sendJson(res, 200, {
    success: true,
    data: {
      media_id: draft.media_id,
      title,
      type: "newspic",
      images_uploaded: uploads.length,
      images: uploads.map((upload, index) => ({ source: imageSources[index], ...upload })),
    },
  })
}

async function handleBatchUploadApi(body: ConvertApiBody, res: ServerResponse): Promise<void> {
  const config = loadConfig()
  const errors = validateConfig(config)
  if (errors.length > 0) {
    sendJson(res, 400, { success: false, error: "配置不完整", details: errors })
    return
  }
  if (!Array.isArray(body.images)) {
    sendJson(res, 400, { success: false, error: "images must be an array" })
    return
  }

  const client = new WechatClient({ appid: config.wechat_appid, secret: config.wechat_secret })
  const uploads = []
  for (const image of body.images) {
    if (typeof image !== "string") continue
    const result = image.startsWith("http://") || image.startsWith("https://")
      ? await client.uploadImageFromUrl(image)
      : await client.uploadImage(resolve(image))
    uploads.push({ source: image, ...result })
  }

  sendJson(res, 200, { success: true, data: { uploads } })
}

async function uploadAndRewriteArticleImages(
  html: string,
  externalImages: string[],
  localImages: string[],
  client: WechatClient,
  baseDir: string,
): Promise<{ html: string; uploadedImageCount: number }> {
  let finalHtml = html
  const imageMap = new Map<string, string>()

  for (const imgUrl of externalImages) {
    try {
      const result = await client.uploadImageFromUrl(imgUrl)
      imageMap.set(imgUrl, result.url)
    } catch (e) {
      console.error(JSON.stringify({ warning: `图片上传失败，保留原 URL: ${imgUrl}`, error: String(e) }))
    }
  }

  for (const imgPath of localImages) {
    const absPath = isAbsolute(imgPath) ? imgPath : resolve(baseDir, imgPath)
    try {
      const result = await client.uploadImage(absPath)
      imageMap.set(imgPath, result.url)
    } catch (e) {
      console.error(JSON.stringify({ warning: `图片上传失败，保留原路径: ${imgPath}`, error: String(e) }))
    }
  }

  for (const [original, wxUrl] of imageMap) {
    finalHtml = finalHtml.replaceAll(original, wxUrl)
  }

  return { html: finalHtml, uploadedImageCount: imageMap.size }
}

async function resolveApiCover(
  body: ConvertApiBody,
  client: WechatClient,
): Promise<{ mediaId: string; usedPlaceholder: boolean }> {
  if (body.cover) {
    const result = await client.uploadImage(resolve(body.cover))
    return { mediaId: result.media_id, usedPlaceholder: false }
  }
  if (body.coverUrl) {
    const result = await client.uploadImageFromUrl(body.coverUrl)
    return { mediaId: result.media_id, usedPlaceholder: false }
  }

  const tmpPath = resolve(tmpdir(), `wx-publisher-placeholder-${randomUUID()}.png`)
  writeFileSync(tmpPath, Buffer.from(getPlaceholderCoverBase64(), "base64"))
  try {
    const result = await client.uploadImage(tmpPath)
    return { mediaId: result.media_id, usedPlaceholder: true }
  } finally {
    try { unlinkSync(tmpPath) } catch {}
  }
}

function apiWarnings(body: ConvertApiBody): string[] {
  const warnings: string[] = []
  if (body.fontSize && !["small", "medium", "large"].includes(body.fontSize)) {
    warnings.push(`unsupported fontSize ignored: ${body.fontSize}`)
  }
  if (body.convertVersion && body.convertVersion !== "v1") {
    warnings.push(`unsupported convertVersion ignored: ${body.convertVersion}`)
  }
  return warnings
}

function resolveApiTheme(rawTheme: unknown, defaultTheme: string): ReturnType<typeof resolveThemeSelection> {
  try {
    return resolveThemeSelection(rawTheme, defaultTheme || "default")
  } catch (error) {
    throw new ApiRequestError(error instanceof Error ? error.message : String(error), 400)
  }
}

class ApiRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

function readJsonBody(req: IncomingMessage): Promise<ConvertApiBody> {
  return new Promise((resolveBody, reject) => {
    let raw = ""
    req.setEncoding("utf8")
    req.on("data", chunk => {
      raw += chunk
      if (raw.length > 10 * 1024 * 1024) {
        reject(new ApiRequestError("request body too large", 413))
        req.destroy()
      }
    })
    req.on("end", () => {
      if (!raw.trim()) {
        resolveBody({})
        return
      }
      try {
        const parsed: unknown = JSON.parse(raw)
        if (!isJsonObject(parsed)) {
          reject(new ApiRequestError("JSON body must be an object", 400))
          return
        }
        resolveBody(parsed)
      } catch {
        reject(new ApiRequestError("invalid JSON body", 400))
      }
    })
    req.on("error", reject)
  })
}

function isJsonObject(value: unknown): value is ConvertApiBody {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" })
  res.end(JSON.stringify(payload, null, 2))
}

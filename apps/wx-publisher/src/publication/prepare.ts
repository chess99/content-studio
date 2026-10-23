import { createHash } from "node:crypto"
import { mkdirSync, readFileSync, writeFileSync, realpathSync, existsSync } from "node:fs"
import { dirname, resolve, relative, extname, sep } from "node:path"
import { parse, stringify } from "yaml"
import sharp from "sharp"
import { unified } from "unified"
import remarkParse from "remark-parse"
import { visit } from "unist-util-visit"
import { convertMarkdown } from "../converter/index.js"

export function validateSourceUrl(value: string): string {
  const url = new URL(value)
  if (!/^https?:$/.test(url.protocol) || url.username || url.password) throw new Error("原文链接必须是 HTTP(S) URL")
  return url.href
}

export function extractSourceUrl(markdown: string): string | undefined {
  const front = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!front) return undefined
  const meta = parse(front[1])
  return meta?.canonical_url ? validateSourceUrl(String(meta.canonical_url)) : undefined
}

const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex")
const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!))

/** 本地准备阶段：只读取源稿和图片，不连接平台，不创建草稿。 */
export async function preparePublication(options: { file: string; outputDir: string; blogRoot?: string; theme?: string }) {
  const source = realpathSync(options.file)
  const markdown = readFileSync(source, "utf8")
  const front = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!front) throw new Error("源稿需要 YAML front matter：title、date、permalink、canonical_url")
  const meta = parse(front[1])
  if (!meta || typeof meta.title !== "string" || !meta.title.trim()) throw new Error("缺少文章标题")
  const slug = String(meta.permalink ?? "").match(/^\/posts\/([a-z0-9]+(?:-[a-z0-9]+)*)\/$/)?.[1]
  const date = String(meta.date ?? "").match(/^(\d{4})-(\d{2})-(\d{2})(?: |T|$)/)
  const day = date && `${date[1]}-${date[2]}-${date[3]}`
  if (!slug || !date || !day || Number.isNaN(Date.parse(day)) || new Date(day).toISOString().slice(0, 10) !== day) throw new Error("permalink 应为 /posts/<slug>/，date 应为有效 YYYY-MM-DD")
  const sourceUrl = validateSourceUrl(String(meta.canonical_url ?? ""))
  if (new URL(sourceUrl).pathname !== meta.permalink) throw new Error("canonical_url 路径必须与 permalink 一致")
  const body = markdown.slice(front[0].length)
  // 原始 HTML、Hexo 标签和未降级交互在公众号会丢内容，准备阶段直接拒绝。
  const portable = body.replace(/<!--\s*(?:more|interactive:[a-z0-9-]+)\s*-->/g, "")
  const tree = unified().use(remarkParse).parse(portable)
  visit(tree, node => {
    if (node.type === "html" || (node.type === "code" && /^(mermaid|math)$/i.test(node.lang ?? "")) || (node.type === "text" && node.value.includes("{%"))) throw new Error("正文含无法静态降级的 HTML、Hexo 标签或图表；请先提供普通 Markdown/PNG 版本")
  })
  const root = dirname(source)
  const output = resolve(options.outputDir)
  if (output === root || relative(output, source).split(sep)[0] !== "..") throw new Error("输出目录不能包含源稿")
  const images: Array<{ from: string; name: string; bytes: Buffer; digest: string; mediaType: string }> = []
  // 使用 Markdown AST 收集图片，覆盖引用式图片和带标题图片。
  const collected = await convertMarkdown(body)
  if (collected.externalImages.length) throw new Error("请将外链图片归档为源稿旁的本地 PNG/JPEG/WebP/GIF，再准备双渠道输出")
  for (const from of new Set(collected.localImages)) {
    const path = realpathSync(resolve(root, from))
    if (relative(root, path).startsWith(`..${sep}`) || relative(root, path) === "..") throw new Error(`图片越出源稿目录：${from}`)
    const bytes = readFileSync(path)
    const type = extname(path).toLowerCase()
    const mediaType = ({ ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" } as Record<string, string>)[type]
    if (!mediaType) throw new Error(`微信图片需为 PNG/JPEG/WebP/GIF：${from}`)
    const actual = await sharp(bytes).metadata()
    if (!actual.format || !["png", "jpeg", "webp", "gif"].includes(actual.format)) throw new Error(`图片实际格式不受支持：${from}`)
    const digest = hash(bytes)
    images.push({ from, name: `${digest.slice(0, 16)}${type}`, bytes, digest, mediaType })
  }
  // 所有输入校验通过后才创建输出；博客同步只覆盖上次生成后未被独立编辑的副本。
  let blogFile: string | undefined
  if (options.blogRoot) {
    const blog = resolve(options.blogRoot)
    if (!existsSync(resolve(blog, "_config.yml"))) throw new Error("blog-root 不是 Hexo 仓库")
    blogFile = resolve(blog, `source/_posts/${date[1]}/${date[2]}/${date[1]}${date[2]}${date[3]}-${slug}.md`)
  }
  const replaceImages = (text: string, prefix: string) => {
    // URL 出现在 Markdown 的目标位置或引用定义中；保留 alt、title 与正文。
    for (const image of images) {
      const escaped = image.from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      text = text.replace(new RegExp(`(\\]\\(<?|^\\s*\\[[^\\]]+\\]:\\s*<?)${escaped}(?=>?(?:[\\s)]|$))`, "gm"), `$1${prefix}${image.name}`)
    }
    return text
  }
  const publicationBody = replaceImages(markdown, `/images/${slug}/`)
  const receipt = `<!-- publication-content-sha256:${hash(publicationBody)} -->\n`
  const blogMarkdown = publicationBody.slice(0, front[0].length) + receipt + publicationBody.slice(front[0].length)
  if (blogFile && existsSync(blogFile) && readFileSync(blogFile, "utf8") !== blogMarkdown) {
    const existing = readFileSync(blogFile, "utf8")
    const savedReceipt = existing.match(/<!-- publication-content-sha256:([a-f0-9]{64}) -->\n/)
    const untouched = savedReceipt && hash(existing.replace(savedReceipt[0], "")) === savedReceipt[1]
    const previous = resolve(output, "manifest.json")
    let lastHash: string | undefined
    if (existsSync(previous)) {
      const last = JSON.parse(readFileSync(previous, "utf8"))
      if (last.source_url === sourceUrl) lastHash = last.blog_sha256
    }
    if (!untouched && (!lastHash || hash(existing) !== lastHash)) throw new Error(`博客副本已有独立修改，请核对后再同步：${blogFile}`)
  }
  const wechatMarkdown = `---\n${stringify({ title: meta.title, canonical_url: sourceUrl })}---\n\n# ${meta.title}\n\n${replaceImages(portable, "assets/").trim()}\n\n完整图表、评分交互与源码链接见阅读原文：${sourceUrl}\n`
  const result = await convertMarkdown(wechatMarkdown, { theme: options.theme ?? "github-readme" })
  let previewContent = result.html
  mkdirSync(resolve(output, "assets"), { recursive: true })
  for (const image of images) {
    writeFileSync(resolve(output, "assets", image.name), image.bytes)
    previewContent = previewContent.replaceAll(`assets/${image.name}`, `data:${image.mediaType};base64,${image.bytes.toString("base64")}`)
    if (options.blogRoot) {
      const target = resolve(options.blogRoot, "source/images", slug, image.name)
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, image.bytes)
    }
  }
  writeFileSync(resolve(output, "article.md"), wechatMarkdown)
  writeFileSync(resolve(output, "article.html"), result.html)
  const preview = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(meta.title)} · 微信预览</title><style>body{margin:0;background:#f2f3f5}main{box-sizing:border-box;max-width:430px;margin:auto;padding:24px 16px;background:white}</style></head><body><main>${previewContent}</main></body></html>`
  writeFileSync(resolve(output, "preview.html"), preview)
  const manifest = {
    schemaVersion: 1, title: meta.title, source_sha256: hash(markdown), source_url: sourceUrl,
    theme: options.theme ?? "github-readme", blog_file: blogFile && relative(resolve(options.blogRoot!), blogFile).split(sep).join("/"),
    blog_sha256: blogFile && hash(blogMarkdown),
    images: images.map(i => ({ source: i.from, file: `assets/${i.name}`, sha256: i.digest })),
    wechat: { markdown: "article.md", html: "article.html", preview: "preview.html", content_source_url: sourceUrl },
  }
  writeFileSync(resolve(output, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n")
  if (blogFile) { mkdirSync(dirname(blogFile), { recursive: true }); writeFileSync(blogFile, blogMarkdown) }
  return { ...manifest, output_dir: output }
}

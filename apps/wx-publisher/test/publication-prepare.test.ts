import { afterEach, describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync, symlinkSync } from "node:fs"
import { tmpdir } from "node:os"
import { resolve } from "node:path"
import sharp from "sharp"
import { preparePublication, validateSourceUrl, extractSourceUrl } from "../src/publication/prepare.js"
import { figureSvg, renderFigures } from "../src/publication/figures.js"
import { convertMarkdown } from "../src/converter/index.js"

const dirs: string[] = []
afterEach(() => { dirs.splice(0).forEach(dir => rmSync(dir, { recursive: true, force: true })) })
function fixture() {
  const root = mkdtempSync(resolve(tmpdir(), "wxp-publication-")); dirs.push(root)
  mkdirSync(resolve(root, "topic/images"), { recursive: true })
  mkdirSync(resolve(root, "blog"))
  writeFileSync(resolve(root, "blog/_config.yml"), "url: https://example.com\n")
  const article = `---\ntitle: "含 & 的研究"\ndate: 2026-10-23 10:00:00\npermalink: /posts/research/\ncanonical_url: https://example.com/posts/research/\n---\n\n正文。\n\n<!-- more -->\n\n![图](images/chart.png "数据")\n\n![引用图][chart]\n\n[chart]: images/chart.png\n\n<!-- interactive:aihot-score -->\n\n| 级别 | 门槛 |\n| --- | --- |\n| T1 | 60 |\n`
  writeFileSync(resolve(root, "topic/article.md"), article)
  const file = resolve(root, "topic/article.md")
  const outputDir = resolve(root, "topic/wechat")
  const blogRoot = resolve(root, "blog")
  return { root, file, outputDir, blogRoot, article }
}
async function withImage() {
  const f = fixture()
  await sharp({ create: { width: 4, height: 4, channels: 3, background: "white" } }).png().toFile(resolve(f.root, "topic/images/chart.png"))
  return f
}

describe("双渠道准备", () => {
  it("同一源稿产生可上传的本地图片、静态微信稿和 Hexo 副本，预览不依赖网络", async () => {
    const f = await withImage()
    const manifest = await preparePublication(f)
    const article = readFileSync(resolve(f.outputDir, "article.md"), "utf8")
    const html = readFileSync(resolve(f.outputDir, "article.html"), "utf8")
    const preview = readFileSync(resolve(f.outputDir, "preview.html"), "utf8")
    expect(manifest.images).toHaveLength(1)
    expect(article).not.toMatch(/interactive:|<!-- more -->/)
    expect(extractSourceUrl(article)).toBe("https://example.com/posts/research/")
    expect(article).toContain(`assets/${manifest.images[0].file.split("/").pop()}`)
    expect(article).not.toContain("](images/")
    expect(article).not.toContain(": images/")
    expect(html).not.toMatch(/<(script|iframe|svg|link)\b/)
    expect(html).toContain('style="')
    expect(preview).toContain("data:image/png;base64,")
    expect(preview).toContain("含 &amp; 的研究")
    const blog = readFileSync(resolve(f.blogRoot, manifest.blog_file!), "utf8")
    expect(blog).toContain("<!-- interactive:aihot-score -->")
    expect(blog).toContain("/images/research/")
    expect(blog).not.toContain("](images/")
    expect(readFileSync(f.file, "utf8")).toBe(f.article)
  })

  it("源稿更新可重建自己生成的副本，但不会覆盖在博客侧发生的独立编辑", async () => {
    const f = await withImage()
    const first = await preparePublication(f)
    rmSync(resolve(f.outputDir, "manifest.json")) // 换一台机器也能凭博客副本内的校验回执继续同步。
    writeFileSync(f.file, f.article.replace("正文。", "更新正文。"))
    await preparePublication(f)
    const blog = resolve(f.blogRoot, first.blog_file!)
    expect(readFileSync(blog, "utf8")).toContain("更新正文。")
    writeFileSync(blog, readFileSync(blog, "utf8") + "\n博客端修改")
    writeFileSync(f.file, f.article.replace("正文。", "再次更新。"))
    await expect(preparePublication(f)).rejects.toThrow("独立修改")
    expect(readFileSync(blog, "utf8")).toContain("博客端修改")
  })

  it("保留代码块里的 HTML 示例，将窄屏换行规则写进微信 HTML 本身", async () => {
    const f = await withImage()
    writeFileSync(f.file, f.article + '\n```html\n<iframe title="示例"></iframe>\n```\n')
    await preparePublication(f)
    const html = readFileSync(resolve(f.outputDir, "article.html"), "utf8")
    expect(html).not.toContain("<iframe")
    expect(html).toContain("table-layout:fixed;")
    expect(html).toContain("word-break:break-all;")
  })

  it("源图丢失或越界时不留下部分输出", async () => {
    const f = fixture()
    await expect(preparePublication(f)).rejects.toThrow()
    expect(existsSync(f.outputDir)).toBe(false)
    writeFileSync(resolve(f.root, "private.png"), "private")
    symlinkSync(resolve(f.root, "private.png"), resolve(f.root, "topic/images/chart.png"))
    await expect(preparePublication(f)).rejects.toThrow("越出")
    expect(existsSync(f.outputDir)).toBe(false)
  })

  it.each(["<iframe src='https://example.com'></iframe>", "```mermaid\ngraph LR\n```", "![x](https://example.com/x.png)"])("拒绝会丢失内容的输入：%s", async input => {
    const f = fixture(); writeFileSync(f.file, f.article.split("正文。")[0] + input)
    await expect(preparePublication(f)).rejects.toThrow()
    expect(existsSync(f.outputDir)).toBe(false)
  })
})

describe("原文入口与静态图", () => {
  it.each(["default", "github-readme"])("%s 主题将手机断行规则内联，转换与准备行为一致", async theme => {
    const { html } = await convertMarkdown("| 概念 | 定义 |\n|---|---|\n|SAME_OCCURRENCE|同一次发生|", { theme })
    expect(html).toContain("table-layout:fixed;")
    expect(html).toContain("word-break:break-all;")
    expect(html).toContain("overflow-wrap:anywhere;")
  })
  it("仅接受不带凭证的 HTTP(S) 原文链接", () => {
    expect(validateSourceUrl("https://example.com/posts/a/")).toBe("https://example.com/posts/a/")
    for (const url of ["javascript:alert(1)", "file:///etc/passwd", "https://user:secret@example.com", "/posts/a/"]) expect(() => validateSourceUrl(url)).toThrow()
  })
  it("生成真实的高清 PNG，同时保留可编辑 SVG，转义文案", async () => {
    const root = mkdtempSync(resolve(tmpdir(), "wxp-figures-")); dirs.push(root)
    const file = resolve(root, "figures.json")
    writeFileSync(file, JSON.stringify({ figures: [{ id: "decay", kind: "decay", title: "热度 <曲线>", note: "理论值", halfLife: 24, window: 48 }] }))
    await renderFigures(file, root)
    expect(readFileSync(resolve(root, "decay.svg"), "utf8")).toContain("&lt;曲线&gt;")
    const png = await sharp(resolve(root, "decay.png")).metadata()
    expect(png.format).toBe("png")
    expect(png.width).toBe(1920)
    expect(() => figureSvg({ id: "../escape", kind: "decay", title: "a", note: "b", halfLife: 24, window: 48 })).toThrow()
  })
})

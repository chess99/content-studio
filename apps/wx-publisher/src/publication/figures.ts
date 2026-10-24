import sharp from "sharp"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

type Figure = { id: string; title: string; note: string } & (
  { kind: "bars"; rows: Array<{ label: string; value: number }> } |
  { kind: "decay"; halfLife: number; window: number } |
  { kind: "flow"; rows: Array<{ label: string; detail: string }> }
)
const esc = (s: string) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!))
const text = (x: number, y: number, value: string | number, size = 26, extra = "") => `<text x="${x}" y="${y}" font-size="${size}" ${extra}>${esc(String(value))}</text>`

/** 精确坐标和数字用确定性绘图；PNG 是发布资产，SVG 保留为可编辑源。 */
export function figureSvg(f: Figure): string {
  if (!/^[a-z0-9-]+$/.test(f.id) || !f.title || !f.note) throw new Error("图表需要安全 id、title、note")
  let height = 520
  let content = ""
  if (f.kind === "bars") {
    if (!f.rows?.length || f.rows.length > 8 || f.rows.some(r => !r.label || !Number.isFinite(r.value) || r.value < 0)) throw new Error("条形图需要 1–8 行非负数据")
    const max = Math.max(1, ...f.rows.map(r => r.value))
    height = 210 + f.rows.length * 98
    content = f.rows.map((r, i) => {
      const y = 128 + i * 98
      return text(32, y, r.label) + text(682, y, r.value, 30, 'text-anchor="end" font-weight="700"') +
        `<rect x="32" y="${y + 15}" width="650" height="22" rx="3" fill="#e7edf3"/><rect x="32" y="${y + 15}" width="${650 * r.value / max}" height="22" rx="3" fill="#0969da"/>`
    }).join("")
  } else if (f.kind === "flow") {
    if (!f.rows?.length || f.rows.length > 8) throw new Error("流程图需要 1–8 步")
    height = 170 + f.rows.length * 112
    content = f.rows.map((r, i) => {
      const y = 100 + i * 112
      return `<rect x="32" y="${y}" width="650" height="88" rx="6" fill="#f4f7fa" stroke="#c9d5df"/>` +
        text(52, y + 34, r.label, 28, 'font-weight="700"') + text(52, y + 66, r.detail, 23) +
        (i < f.rows.length - 1 ? `<path d="M357 ${y + 90}v17m-5-5 5 5 5-5" fill="none" stroke="#0969da" stroke-width="2"/>` : "")
    }).join("")
  } else if (f.kind === "decay") {
    if (!Number.isFinite(f.halfLife) || f.halfLife <= 0 || !Number.isFinite(f.window) || f.window <= 0 || f.window > 1000) throw new Error("半衰期与窗口必须为正数，窗口至多 1000 小时")
    height = 560
    const x = (h: number) => 90 + h / f.window * 550
    const y = (v: number) => 410 - 270 * v
    for (const v of [0, .25, .5, .75, 1]) content += `<path d="M90 ${y(v)}H640" stroke="#dce4ec"/>` + text(76, y(v) + 8, `${v * 100}%`, 23, 'text-anchor="end"')
    for (let i = 0; i <= 4; i++) content += text(x(i * f.window / 4), 450, `${i * f.window / 4}h`, 23, 'text-anchor="middle"')
    const path = Array.from({ length: 101 }, (_, i) => `${i ? 'L' : 'M'}${x(i * f.window / 100).toFixed(2)},${y(.5 ** (i * f.window / 100 / f.halfLife)).toFixed(2)}`).join(" ")
    content += `<path d="${path}" fill="none" stroke="#0969da" stroke-width="4"/><path d="M640 ${y(.5 ** (f.window / f.halfLife))}V410" stroke="#0969da" stroke-width="3" stroke-dasharray="5 5"/>`
    content += text(330, 116, `半衰期 ${f.halfLife}h`, 25) + text(330, 493, `${f.window}h 边界移出统计窗口`, 24)
  } else { throw new Error("不支持的图表类型") }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="${height}" viewBox="0 0 720 ${height}" role="img"><title>${esc(f.title)}</title><desc>${esc(f.note)}</desc><rect width="720" height="${height}" fill="white"/><g fill="#202c39" font-family="PingFang SC,Heiti SC,Arial,sans-serif">${text(32, 52, f.title, 32, 'font-weight="700"')}${content}${text(32, height - 25, f.note, 21)}</g></svg>`
}

export async function renderFigures(file: string, outputDir: string) {
  const spec = JSON.parse(readFileSync(file, "utf8")) as { figures: Figure[] }
  if (!Array.isArray(spec.figures) || !spec.figures.length) throw new Error("需要 figures 数组")
  if (new Set(spec.figures.map(f => f.id)).size !== spec.figures.length) throw new Error("图表 id 不能重复")
  const rendered = spec.figures.map(f => ({ id: f.id, svg: figureSvg(f) }))
  mkdirSync(outputDir, { recursive: true })
  for (const f of rendered) {
    writeFileSync(resolve(outputDir, `${f.id}.svg`), f.svg)
    await sharp(Buffer.from(f.svg), { density: 192 }).png().toFile(resolve(outputDir, `${f.id}.png`))
  }
  return { output_dir: resolve(outputDir), figures: rendered.map(f => `${f.id}.png`) }
}

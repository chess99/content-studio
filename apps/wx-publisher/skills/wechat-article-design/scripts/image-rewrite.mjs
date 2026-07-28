import {normalizeCssUrlSource} from "./validate-wechat-html.mjs"

export function rewriteImageSources(html, replacements) {
  if (replacements.size === 0) return html

  return html.replace(/<img\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi, (tag) => {
    return tag.replace(/(\ssrc\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i, (match, prefix, doubleQuoted, singleQuoted, unquoted) => {
      const src = doubleQuoted ?? singleQuoted ?? unquoted ?? ""
      const replacement = replacements.get(src)
      if (!replacement) return match
      if (doubleQuoted !== undefined) return `${prefix}"${replacement}"`
      if (singleQuoted !== undefined) return `${prefix}'${replacement}'`
      return `${prefix}"${replacement}"`
    })
  })
}

function rewriteCssUrlValue(css, replacements, unquotedUrlQuote = '"') {
  if (replacements.size === 0) return css

  return css.replace(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi, (match, doubleQuoted, singleQuoted, unquoted) => {
    const source = normalizeCssUrlSource(doubleQuoted ?? singleQuoted ?? unquoted ?? "")
    const replacement = replacements.get(source)
    if (!replacement) return match
    if (doubleQuoted !== undefined) return `url("${replacement}")`
    if (singleQuoted !== undefined) return `url('${replacement}')`
    return `url(${unquotedUrlQuote}${replacement}${unquotedUrlQuote})`
  })
}

export function rewriteCssUrlSources(html, replacements) {
  if (replacements.size === 0) return html

  const withStyleBlocks = html.replace(
    /(<style\b(?:"[^"]*"|'[^']*'|[^'">])*?>)([\s\S]*?)(<\/style\s*>)/gi,
    (match, open, css, close) => `${open}${rewriteCssUrlValue(css, replacements)}${close}`
  )

  return withStyleBlocks.replace(/<\s*[a-zA-Z][\w:-]*(?:"[^"]*"|'[^']*'|[^'">])*>/g, (tag) => {
    return tag.replace(
      /(\sstyle\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i,
      (match, prefix, doubleQuoted, singleQuoted, unquoted) => {
        const css = doubleQuoted ?? singleQuoted ?? unquoted ?? ""
        const quoteForUnquotedCssUrl = doubleQuoted !== undefined ? "'" : '"'
        const rewritten = rewriteCssUrlValue(css, replacements, quoteForUnquotedCssUrl)
        if (doubleQuoted !== undefined) return `${prefix}"${rewritten}"`
        if (singleQuoted !== undefined) return `${prefix}'${rewritten}'`
        return `${prefix}"${rewritten}"`
      }
    )
  })
}

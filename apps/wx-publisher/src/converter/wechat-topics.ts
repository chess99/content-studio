export interface WechatTopicMarker {
  name: string
  line: number
  source: string
}

export interface WechatTopicCardSummary {
  detected: number
  items: Array<WechatTopicMarker>
  requires_manual_conversion: true
  instruction: string
}

export const WECHAT_TOPIC_CARD_INSTRUCTION =
  "草稿中保留了独立的 #话题名 标记。请在微信公众号后台逐个点击并选择“设置为话题卡片”，确认绑定到正确话题后再发布。"

/**
 * 识别公众号渠道稿中的话题卡片候选。
 *
 * 约定语法是一整行 `#话题名`，`#` 后不能有空格；`# 标题` 仍是普通 Markdown 标题。
 * 代码围栏和 front matter 中的同形文本不会被识别。
 */
export function scanWechatTopicMarkers(markdown: string): WechatTopicMarker[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n")
  const markers: WechatTopicMarker[] = []
  let frontMatter = lines[0]?.trim() === "---"
  let fence: { char: "`" | "~"; length: number } | null = null

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index] ?? ""

    if (frontMatter) {
      if (index > 0 && line.trim() === "---") frontMatter = false
      continue
    }

    const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})/)
    if (fenceMatch) {
      const token = fenceMatch[1]
      const char = token[0] as "`" | "~"
      if (!fence) {
        fence = { char, length: token.length }
      } else if (fence.char === char && token.length >= fence.length) {
        fence = null
      }
      continue
    }
    if (fence) continue

    const match = line.match(/^\s{0,3}#([^\s#].*?)\s*$/)
    if (!match) continue
    const name = match[1].trim()
    if (!name) continue

    markers.push({
      name,
      line: index + 1,
      source: `#${name}`,
    })
  }

  return markers
}

export function summarizeWechatTopicCards(markers: WechatTopicMarker[]): WechatTopicCardSummary | undefined {
  if (markers.length === 0) return undefined
  return {
    detected: markers.length,
    items: markers,
    requires_manual_conversion: true,
    instruction: WECHAT_TOPIC_CARD_INSTRUCTION,
  }
}

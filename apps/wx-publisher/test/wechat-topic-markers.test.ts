import { describe, expect, it } from "vitest"
import { convertMarkdown } from "../src/converter/index.js"
import {
  scanWechatTopicMarkers,
  summarizeWechatTopicCards,
} from "../src/converter/wechat-topics.js"

describe("WeChat topic card markers", () => {
  it("detects standalone hashtag lines but ignores headings, front matter, and fenced code", () => {
    const markdown = [
      "---",
      "title: Demo",
      "note: '#front-matter'",
      "---",
      "# Article title",
      "",
      "Opening.",
      "",
      "#OPC",
      "",
      "#AI 创业",
      "",
      "```text",
      "#inside-code",
      "```",
      "",
      "Body #inline-tag is not a marker.",
    ].join("\n")

    expect(scanWechatTopicMarkers(markdown)).toEqual([
      { name: "OPC", line: 9, source: "#OPC" },
      { name: "AI 创业", line: 11, source: "#AI 创业" },
    ])
  })

  it("keeps marker text in article HTML and reports the manual conversion contract", async () => {
    const result = await convertMarkdown("Opening.\n\n#AI创业\n\nBody.")
    const summary = summarizeWechatTopicCards(result.wechatTopics)

    expect(result.html).toContain("#AI创业")
    expect(summary).toMatchObject({
      detected: 1,
      requires_manual_conversion: true,
      items: [{ name: "AI创业", line: 3, source: "#AI创业" }],
    })
    expect(summary?.instruction).toContain("设置为话题卡片")
  })

  it("omits the manual conversion summary when no marker is present", () => {
    expect(summarizeWechatTopicCards([])).toBeUndefined()
  })
})

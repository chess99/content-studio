import { describe, expect, it } from "vitest"
import { buildNewspicDraftArticle } from "../src/wechat/client.js"

describe("WechatClient draft payload helpers", () => {
  it("builds a newspic draft article from uploaded image media ids", () => {
    const article = buildNewspicDraftArticle({
      title: "贴图标题",
      content: "贴图描述",
      images: [
        { media_id: "MEDIA_1", url: "https://mmbiz.qpic.cn/one.jpg" },
        { media_id: "MEDIA_2", url: "https://mmbiz.qpic.cn/two.jpg" },
      ],
      needOpenComment: true,
      onlyFansCanComment: true,
    })

    expect(article).toEqual({
      article_type: "newspic",
      title: "贴图标题",
      content: "贴图描述",
      need_open_comment: 1,
      only_fans_can_comment: 1,
      image_info: {
        image_list: [
          { image_media_id: "MEDIA_1" },
          { image_media_id: "MEDIA_2" },
        ],
      },
    })
  })
})

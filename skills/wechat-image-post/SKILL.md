---
name: wechat-image-post
description: Prepare and publish WeChat Official Account "贴图" image posts from a local image, title, and short caption. Use when the user asks to publish a 公众号贴图, 微信贴图, image-only WeChat post, or save one as a draft.
---

# WeChat Image Post Skill

Use this skill to turn a local image plus short copy into a WeChat Official Account "贴图" draft.

## Scope

This skill supports:

- Preparing a reusable local image-post package under `TOPIC_DIR/wechat/`.
- Copying the final image into the package without deleting the original.
- Saving title, description, and publish metadata in files that can be versioned.
- Creating a draft through the WeChat Official Account web UI when Chrome CDP access is available and the account is already logged in.

This skill does not use `wxp publish` for true image posts. The existing article publisher creates article drafts through the official article draft workflow; the "贴图" editor in the WeChat backend is a separate web UI flow with fields for image, title, description, and optional location/reward/comments/links.

## Prepare Package

From the `content-workflows` repository root:

```bash
node skills/wechat-image-post/scripts/prepare-wechat-image-post.mjs \
  --image "C:/path/to/poster.png" \
  --slug 20260625-codex-reconnecting-image-post \
  --title "Codex 重连修复" \
  --description "Codex 每次回答前都 Reconnecting？可能不是模型慢，而是 WebSocket 传输层不稳。改用户级 config，让 Responses API 直接走 HTTPS。" \
  --out-dir "D:/code/content/topics/20260625-codex-reconnecting-image-post/wechat"
```

Outputs:

- `TOPIC_DIR/wechat/poster.png`
- `TOPIC_DIR/wechat/caption.md`
- `TOPIC_DIR/wechat/wechat-image-post.json`
- `TOPIC_DIR/wechat/wechat-image-post-publish.md`

## Create Draft

The draft step depends on the `web-access` Chrome CDP proxy and an already logged-in WeChat Official Account browser session.

Before running:

```bash
node "$CLAUDE_SKILL_DIR/scripts/check-deps.mjs"
```

Then:

```bash
node skills/wechat-image-post/scripts/wechat-image-post-draft.mjs \
  --manifest "<TOPIC_DIR>/wechat/wechat-image-post.json"
```

The script opens the WeChat backend, enters the "贴图" editor, uploads the image, fills title and description, and clicks "保存为草稿".

If the script reports that CDP is unavailable, open Chrome remote debugging as instructed by `web-access` and rerun. If WeChat asks for login or QR confirmation, complete it in the browser, then rerun the command.

## Current Limitations

- This is UI automation, so WeChat backend layout changes can require selector updates.
- It intentionally does not bypass login, QR verification, captcha, or account permission checks.
- It creates a draft only; final publication remains a manual editorial action unless the user explicitly asks for publishing and confirms the final side effect.

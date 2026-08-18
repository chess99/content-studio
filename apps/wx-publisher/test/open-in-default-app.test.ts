import { describe, expect, it, vi } from "vitest"
import {
  buildOpenInDefaultAppCommand,
  tryOpenInDefaultApp,
} from "../src/cli/open-in-default-app.js"

describe("open previews in the default app", () => {
  it("uses the Windows file protocol handler", () => {
    expect(buildOpenInDefaultAppCommand("C:\\Temp\\preview file.html", "win32")).toEqual({
      command: "rundll32.exe",
      args: ["url.dll,FileProtocolHandler", "C:\\Temp\\preview file.html"],
    })
  })

  it("uses the native macOS opener", () => {
    expect(buildOpenInDefaultAppCommand("/tmp/preview.html", "darwin")).toEqual({
      command: "open",
      args: ["/tmp/preview.html"],
    })
  })

  it("uses xdg-open on Linux", () => {
    expect(buildOpenInDefaultAppCommand("/tmp/preview.html", "linux")).toEqual({
      command: "xdg-open",
      args: ["/tmp/preview.html"],
    })
  })

  it("reports a successful browser launch", async () => {
    const opener = vi.fn().mockResolvedValue(undefined)

    await expect(tryOpenInDefaultApp("/tmp/preview.html", true, opener)).resolves.toEqual({
      opened: true,
    })
    expect(opener).toHaveBeenCalledWith("/tmp/preview.html")
  })

  it("keeps prepared content usable when browser launch fails", async () => {
    const opener = vi.fn().mockRejectedValue(new Error("command not found"))

    await expect(tryOpenInDefaultApp("/tmp/preview.html", true, opener)).resolves.toEqual({
      opened: false,
      warning: "内容已准备好，但未能自动打开浏览器：command not found",
    })
  })

  it("does not call the opener with --no-open", async () => {
    const opener = vi.fn().mockResolvedValue(undefined)

    await expect(tryOpenInDefaultApp("/tmp/preview.html", false, opener)).resolves.toEqual({
      opened: false,
    })
    expect(opener).not.toHaveBeenCalled()
  })
})

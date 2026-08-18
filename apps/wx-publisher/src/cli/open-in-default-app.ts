import { spawn } from "child_process"

export interface OpenInDefaultAppCommand {
  command: string
  args: string[]
}

export interface OpenInDefaultAppResult {
  opened: boolean
  warning?: string
}

export function buildOpenInDefaultAppCommand(
  target: string,
  platform: NodeJS.Platform = process.platform,
): OpenInDefaultAppCommand {
  if (platform === "win32") {
    return {
      command: "rundll32.exe",
      args: ["url.dll,FileProtocolHandler", target],
    }
  }

  if (platform === "darwin") {
    return { command: "open", args: [target] }
  }

  return { command: "xdg-open", args: [target] }
}

export function openInDefaultApp(
  target: string,
  platform: NodeJS.Platform = process.platform,
): Promise<void> {
  const { command, args } = buildOpenInDefaultAppCommand(target, platform)

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "ignore",
      windowsHide: true,
    })

    child.once("error", reject)
    child.once("close", (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      const status = signal ? `signal ${signal}` : `exit code ${code ?? "unknown"}`
      reject(new Error(`${command} failed with ${status}`))
    })
  })
}

export async function tryOpenInDefaultApp(
  target: string,
  shouldOpen: boolean,
  opener: (value: string) => Promise<void> = openInDefaultApp,
): Promise<OpenInDefaultAppResult> {
  if (!shouldOpen) return { opened: false }

  try {
    await opener(target)
    return { opened: true }
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error)
    return {
      opened: false,
      warning: `内容已准备好，但未能自动打开浏览器：${details}`,
    }
  }
}

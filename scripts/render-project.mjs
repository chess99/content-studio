import {copyFile, mkdir, readFile, stat, unlink, writeFile} from "node:fs/promises";
import {existsSync} from "node:fs";
import {spawn} from "node:child_process";
import {dirname, join, resolve} from "node:path";
import {createRequire} from "node:module";

const root = resolve(import.meta.dirname, "..");
const slug = process.argv[2];
const mode = process.argv.includes("--final") ? "final" : "draft";
const coverOnly = process.argv.includes("--cover-only");

if (!slug) throw new Error("用法：pnpm video:render <project-slug> [--final]");

const projectDir = join(root, "projects", slug);
const propsPath = join(root, "tmp", `${slug}-render-props.json`);
if (!existsSync(propsPath)) {
  throw new Error(`缺少渲染参数，请先运行：pnpm video:prepare ${slug}`);
}

const props = JSON.parse(await readFile(propsPath, "utf8"));
const renderDir = join(projectDir, "renders");
const publishDir = join(projectDir, "publish");
await mkdir(renderDir, {recursive: true});
await mkdir(publishDir, {recursive: true});

const output = join(renderDir, `${mode}.mp4`);
const rawOutput = join(renderDir, `${mode}-raw.mp4`);
const chrome = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const require = createRequire(import.meta.url);
const cliPackagePath = require.resolve("@remotion/cli/package.json");
const cliPackage = JSON.parse(await readFile(cliPackagePath, "utf8"));
const remotionCli = join(dirname(cliPackagePath), cliPackage.bin.remotion);
const args = [
  "render",
  "src/video/index.ts",
  "KnowledgeVideo",
  rawOutput,
  `--props=${propsPath}`,
  `--browser-executable=${chrome}`,
  "--codec=h264",
  `--crf=${mode === "draft" ? 26 : 18}`,
  `--scale=${mode === "draft" ? 0.5 : 1}`,
  "--overwrite",
  "--log=info",
];

if (!coverOnly) {
  console.log(`开始渲染 ${mode}：${(props.totalFrames / props.fps).toFixed(2)} 秒`);
  await run(process.execPath, [remotionCli, ...args]);
  if (!existsSync(rawOutput) || (await stat(rawOutput)).size < 1024) {
    throw new Error(`渲染器未生成有效视频：${rawOutput}`);
  }
  await run("ffmpeg", [
    "-hide_banner", "-loglevel", "warning", "-y",
    "-i", rawOutput,
    "-c:v", "copy",
    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
    "-c:a", "aac", "-b:a", "192k",
    output,
  ]);
  await unlink(rawOutput);
  if (!existsSync(output) || (await stat(output)).size < 1024) {
    throw new Error(`响度处理后未生成有效视频：${output}`);
  }
}

if (mode === "final") {
  if (!coverOnly) await copyFile(output, join(publishDir, "final.mp4"));
  const coverFrame = Math.min(props.totalFrames - 1, Math.round(props.fps * 2.2));
  const coverPropsPath = join(root, "tmp", `${slug}-cover-props.json`);
  await writeFile(coverPropsPath, `${JSON.stringify({...props, coverMode: true}, null, 2)}\n`);
  await run(process.execPath, [
    remotionCli,
    "still",
    "src/video/index.ts",
    "KnowledgeVideo",
    join(publishDir, "cover.png"),
    `--props=${coverPropsPath}`,
    `--browser-executable=${chrome}`,
    `--frame=${coverFrame}`,
    "--overwrite",
  ]);
}

console.log(coverOnly ? "封面已更新。" : `已输出：${output}`);

function run(command, commandArgs) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, commandArgs, {cwd: root, stdio: "inherit", windowsHide: true});
    child.on("error", rejectRun);
    child.on("close", (code) => code === 0 ? resolveRun() : rejectRun(new Error(`${command} 失败 (${code})`)));
  });
}

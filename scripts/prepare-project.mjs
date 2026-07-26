import {mkdir, readFile, writeFile} from "node:fs/promises";
import {existsSync} from "node:fs";
import {spawn} from "node:child_process";
import {resolve, join, relative} from "node:path";

const root = resolve(import.meta.dirname, "..");
const slug = process.argv[2];

if (!slug) {
  throw new Error("用法：pnpm video:prepare <project-slug>");
}

const projectDir = join(root, "projects", slug);
const publicDir = join(root, "public", "generated", slug);
const audioDir = join(publicDir, "audio");
const tmpDir = join(root, "tmp");
const script = JSON.parse(await readFile(join(projectDir, "script.json"), "utf8"));
const storyboard = JSON.parse(await readFile(join(projectDir, "storyboard.json"), "utf8"));
const sources = JSON.parse(await readFile(join(projectDir, "input", "sources.json"), "utf8"));
const config = JSON.parse(await readFile(join(projectDir, "config.json"), "utf8"));
const dataRows = parseCsv(await readFile(join(projectDir, "input", "data.csv"), "utf8"));

validateProject({script, storyboard, sources, dataRows});
await mkdir(audioDir, {recursive: true});
await mkdir(tmpDir, {recursive: true});

const fps = config.video.fps;
const leadFrames = Math.round((config.voice.leadSeconds ?? 0.25) * fps);
const tailFrames = Math.round((config.voice.tailSeconds ?? 0.5) * fps);
let cursor = 0;
const preparedScenes = [];

for (const scriptScene of script.scenes) {
  const boardScene = storyboard.scenes.find((scene) => scene.id === scriptScene.id);
  const audioExtension = config.voice.provider === "edge-tts" ? "mp3" : "wav";
  const audioFile = join(audioDir, `${scriptScene.id}.${audioExtension}`);
  if (!existsSync(audioFile) || process.argv.includes("--force-voice")) {
    if (config.voice.provider === "edge-tts") {
      await generateEdgeTts({
        text: scriptScene.speechText,
        outputPath: audioFile,
        voice: config.voice.name,
        rate: config.voice.rate,
        pitch: config.voice.pitch,
      });
    } else {
      await generateSapi({
        text: scriptScene.speechText,
        outputPath: audioFile,
        voice: config.voice.name,
        rate: config.voice.rate,
      });
    }
  }

  const audioSeconds = await probeDuration(audioFile);
  const audioFrames = Math.ceil(audioSeconds * fps);
  const durationInFrames = leadFrames + audioFrames + tailFrames;
  const captions = makeCaptions({
    chunks: scriptScene.captionChunks ?? [scriptScene.displayText],
    audioFrames,
    leadFrames,
  });
  const visual = {...boardScene.visual};
  if (visual.dataSeries) {
    visual.points = dataRows
      .filter((row) => row.series === visual.dataSeries)
      .map((row) => ({year: Number(row.year), value: Number(row.value)}));
  }

  preparedScenes.push({
    id: scriptScene.id,
    from: cursor,
    durationInFrames,
    audioStartFrame: leadFrames,
    audioPath: `generated/${slug}/audio/${scriptScene.id}.${audioExtension}`,
    displayText: scriptScene.displayText,
    sourceIds: scriptScene.sourceIds,
    template: visual.template,
    visual,
    captions,
  });
  cursor += durationInFrames;
}

const timeline = {
  project: slug,
  title: config.title,
  seriesLabel: config.seriesLabel,
  fps,
  width: config.video.width,
  height: config.video.height,
  totalFrames: cursor,
  scenes: preparedScenes,
};

await writeFile(join(projectDir, "timeline.json"), `${JSON.stringify(timeline, null, 2)}\n`);
await writeFile(join(tmpDir, `${slug}-render-props.json`), `${JSON.stringify(timeline, null, 2)}\n`);
await writeFile(join(projectDir, "publish", "subtitles.srt"), toSrt(timeline));

console.log(`已准备 ${preparedScenes.length} 个场景。`);
console.log(`总时长：${(cursor / fps).toFixed(2)} 秒。`);
console.log(`渲染参数：${relative(root, join(tmpDir, `${slug}-render-props.json`))}`);

function parseCsv(text) {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const keys = header.split(",");
  return lines.filter(Boolean).map((line) => {
    const values = line.split(",");
    return Object.fromEntries(keys.map((key, index) => [key, values[index] ?? ""]));
  });
}

function validateProject({script: scriptData, storyboard: boardData, sources: sourceData, dataRows: rows}) {
  const sourceIds = new Set(sourceData.sources.map((source) => source.id));
  const boardIds = new Set(boardData.scenes.map((scene) => scene.id));
  const errors = [];

  for (const scene of scriptData.scenes) {
    if (!boardIds.has(scene.id)) errors.push(`${scene.id} 缺少分镜`);
    for (const id of scene.sourceIds) {
      if (!sourceIds.has(id)) errors.push(`${scene.id} 引用了不存在的来源 ${id}`);
    }
  }
  for (const row of rows) {
    if (row.sourceId && !sourceIds.has(row.sourceId)) {
      errors.push(`数据 ${row.series}/${row.year} 引用了不存在的来源 ${row.sourceId}`);
    }
  }
  if (errors.length) throw new Error(`项目验证失败：\n- ${errors.join("\n- ")}`);
}

function makeCaptions({chunks, audioFrames, leadFrames}) {
  const weights = chunks.map((chunk) => Math.max(1, [...chunk.replace(/[，。；！？：、\s]/g, "")].length));
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  let used = 0;
  return chunks.map((text, index) => {
    const startFrame = leadFrames + Math.round((used / totalWeight) * audioFrames);
    used += weights[index];
    const endFrame = leadFrames + Math.round((used / totalWeight) * audioFrames);
    return {text, startFrame, endFrame};
  });
}

async function generateSapi({text, outputPath, voice, rate}) {
  await run("powershell.exe", [
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-File", join(root, "scripts", "generate-sapi.ps1"),
    "-Text", text,
    "-OutputPath", outputPath,
    "-Rate", String(rate),
    "-Voice", voice,
  ]);
}

async function generateEdgeTts({text, outputPath, voice, rate, pitch}) {
  const executable = join(root, ".venv", "Scripts", process.platform === "win32" ? "edge-tts.exe" : "edge-tts");
  if (!existsSync(executable)) {
    throw new Error("未找到 Edge TTS。请先在项目 .venv 中安装 edge-tts。");
  }
  await run(executable, [
    "--voice", voice,
    `--rate=${rate ?? "+0%"}`,
    `--pitch=${pitch ?? "+0Hz"}`,
    "--text", text,
    "--write-media", outputPath,
  ]);
}

async function probeDuration(file) {
  const output = await run("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    file,
  ], true);
  const value = Number(output.trim());
  if (!Number.isFinite(value)) throw new Error(`无法读取音频时长：${file}`);
  return value;
}

function run(command, args, capture = false) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {cwd: root, windowsHide: true});
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; if (!capture) process.stdout.write(chunk); });
    child.stderr.on("data", (chunk) => { stderr += chunk; if (!capture) process.stderr.write(chunk); });
    child.on("error", rejectRun);
    child.on("close", (code) => code === 0 ? resolveRun(stdout) : rejectRun(new Error(`${command} 失败 (${code})\n${stderr}`)));
  });
}

function toSrt(timelineData) {
  let index = 1;
  const blocks = [];
  for (const scene of timelineData.scenes) {
    for (const caption of scene.captions) {
      const start = (scene.from + caption.startFrame) / timelineData.fps;
      const end = (scene.from + caption.endFrame) / timelineData.fps;
      blocks.push(`${index++}\n${formatSrtTime(start)} --> ${formatSrtTime(end)}\n${caption.text}`);
    }
  }
  return `${blocks.join("\n\n")}\n`;
}

function formatSrtTime(seconds) {
  const ms = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const millis = ms % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(millis).padStart(3, "0")}`;
}

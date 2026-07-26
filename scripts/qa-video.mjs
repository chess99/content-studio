import {mkdir, readFile, writeFile} from "node:fs/promises";
import {existsSync} from "node:fs";
import {spawn} from "node:child_process";
import {join, resolve} from "node:path";

const root = resolve(import.meta.dirname, "..");
const slug = process.argv[2];
const mode = process.argv.includes("--final") ? "final" : "draft";
if (!slug) throw new Error("用法：pnpm video:qa <project-slug> [--final]");

const projectDir = join(root, "projects", slug);
const video = join(projectDir, "renders", `${mode}.mp4`);
const timelinePath = join(projectDir, "timeline.json");
if (!existsSync(video) || !existsSync(timelinePath)) throw new Error("缺少视频或时间线，请先准备并渲染项目。");

const timeline = JSON.parse(await readFile(timelinePath, "utf8"));
const probe = JSON.parse(await run("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", video], true));
const videoStream = probe.streams.find((stream) => stream.codec_type === "video");
const audioStream = probe.streams.find((stream) => stream.codec_type === "audio");
const actualDuration = Number(probe.format.duration);
const expectedDuration = timeline.totalFrames / timeline.fps;
const expectedScale = mode === "draft" ? 0.5 : 1;
const errors = [];
const warnings = [];

if (!videoStream) errors.push("缺少视频流");
if (!audioStream) errors.push("缺少音频流");
if (videoStream && (videoStream.width !== timeline.width * expectedScale || videoStream.height !== timeline.height * expectedScale)) {
  errors.push(`分辨率异常：${videoStream.width}×${videoStream.height}`);
}
if (videoStream && videoStream.codec_name !== "h264") errors.push(`视频编码不是 H.264：${videoStream.codec_name}`);
if (Math.abs(actualDuration - expectedDuration) > 0.25) errors.push(`时长偏差过大：期望 ${expectedDuration.toFixed(2)} 秒，实际 ${actualDuration.toFixed(2)} 秒`);

for (const scene of timeline.scenes) {
  if (!scene.sourceIds.length) errors.push(`${scene.id} 没有来源`);
  for (const caption of scene.captions) {
    const length = [...caption.text.replace(/\s/g, "")].length;
    if (length > 24) warnings.push(`${scene.id} 字幕偏长（${length} 字）：${caption.text}`);
    if (caption.startFrame < 0 || caption.endFrame > scene.durationInFrames || caption.startFrame >= caption.endFrame) {
      errors.push(`${scene.id} 字幕时间越界：${caption.text}`);
    }
  }
}

const blackOutput = await run("ffmpeg", ["-hide_banner", "-i", video, "-vf", "blackdetect=d=0.8:pix_th=0.02", "-an", "-f", "null", "NUL"], true, true);
const blackSegments = [...blackOutput.matchAll(/black_start:([\d.]+).*?black_end:([\d.]+)/g)].map((match) => ({start: Number(match[1]), end: Number(match[2])}));
if (blackSegments.length) warnings.push(`检测到 ${blackSegments.length} 段黑帧候选`);

const volumeOutput = await run("ffmpeg", ["-hide_banner", "-i", video, "-af", "volumedetect", "-vn", "-f", "null", "NUL"], true, true);
const meanVolume = Number(volumeOutput.match(/mean_volume:\s*(-?[\d.]+) dB/)?.[1]);
const maxVolume = Number(volumeOutput.match(/max_volume:\s*(-?[\d.]+) dB/)?.[1]);
if (Number.isFinite(maxVolume) && maxVolume > -0.5) warnings.push(`音频峰值接近削波：${maxVolume} dB`);
if (Number.isFinite(meanVolume) && meanVolume < -26) warnings.push(`平均音量偏低：${meanVolume} dB`);

const snapshotDir = join(root, "tmp", "qa", slug, mode);
await mkdir(snapshotDir, {recursive: true});
for (const scene of timeline.scenes) {
  const second = (scene.from + Math.round(scene.durationInFrames * 0.52)) / timeline.fps;
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-ss", second.toFixed(3), "-i", video, "-frames:v", "1", join(snapshotDir, `${scene.id}.png`)]);
}

const report = {
  status: errors.length ? "failed" : warnings.length ? "passed-with-warnings" : "passed",
  checkedAt: new Date().toISOString(),
  mode,
  file: video,
  expected: {duration: expectedDuration, width: timeline.width * expectedScale, height: timeline.height * expectedScale, fps: timeline.fps},
  actual: {duration: actualDuration, width: videoStream?.width, height: videoStream?.height, videoCodec: videoStream?.codec_name, audioCodec: audioStream?.codec_name, meanVolume, maxVolume},
  blackSegments,
  errors,
  warnings,
  snapshots: timeline.scenes.map((scene) => join(snapshotDir, `${scene.id}.png`)),
};
await writeFile(join(projectDir, "renders", `${mode}-review-report.json`), `${JSON.stringify(report, null, 2)}\n`);

console.log(`质检状态：${report.status}`);
console.log(`视频：${videoStream?.width}×${videoStream?.height} / ${actualDuration.toFixed(2)} 秒 / ${videoStream?.codec_name} + ${audioStream?.codec_name}`);
console.log(`音量：mean ${meanVolume} dB / max ${maxVolume} dB`);
for (const warning of warnings) console.log(`警告：${warning}`);
for (const error of errors) console.error(`错误：${error}`);
if (errors.length) process.exitCode = 1;

function run(command, args, capture = false, mergeStderr = false) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {cwd: root, windowsHide: true});
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; if (!capture) process.stdout.write(chunk); });
    child.stderr.on("data", (chunk) => { stderr += chunk; if (!capture) process.stderr.write(chunk); });
    child.on("error", rejectRun);
    child.on("close", (code) => code === 0 ? resolveRun(mergeStderr ? `${stdout}\n${stderr}` : stdout) : rejectRun(new Error(`${command} 失败 (${code})\n${stderr}`)));
  });
}

#!/usr/bin/env node
import {existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, realpathSync, lstatSync, readlinkSync} from 'node:fs';
import {dirname, resolve, relative, isAbsolute, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {parseArgs} from 'node:util';

export const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = resolve(APP, '../..');
const CLI = join(APP, 'node_modules/hyperframes/bin/hyperframes.mjs');
const GSAP = join(APP, 'node_modules/gsap/dist/gsap.min.js');

// Resolve existing ancestors too: a new path under a symlink must stay external.
export function canonical(path, seen = new Set()) {
  const absolute = resolve(path);
  if (seen.has(absolute)) throw new Error('路径包含循环软链。');
  seen.add(absolute);
  const info = lstatSync(absolute, {throwIfNoEntry: false});
  if (info?.isSymbolicLink()) return canonical(resolve(dirname(absolute), readlinkSync(absolute)), seen);
  if (info) return realpathSync(absolute);
  const parent = dirname(absolute);
  return join(canonical(parent, seen), relative(parent, absolute));
}
export function externalPath(path) {
  if (!path || !isAbsolute(path)) throw new Error('请提供绝对路径。');
  const target = canonical(path);
  const rel = relative(ROOT, target);
  if (!rel || (!rel.startsWith('..' + '/') && !rel.startsWith('..' + '\\') && !isAbsolute(rel))) {
    throw new Error('内容工程与成片必须保存在 content-studio 仓库以外。');
  }
  return target;
}
export function dimensions(width, height, duration) {
  if (![width, height].every(n => Number.isInteger(n) && n >= 240 && n <= 4096 && n % 2 === 0)) {
    throw new Error('宽高须为 240–4096 之间的偶数。');
  }
  if (!Number.isFinite(duration) || duration < 1 || duration > 600) throw new Error('时长须为 1–600 秒。');
}
export function initialize(project, {width = 1920, height = 1080, duration = 6} = {}) {
  project = externalPath(project);
  dimensions(width, height, duration);
  if (existsSync(project)) throw new Error('目录已存在；请使用新目录，已有工程直接编辑。');
  if (!existsSync(GSAP)) throw new Error('请先在 apps/motion-video 运行 npm ci。');
  const values = {WIDTH: width, HEIGHT: height, DURATION: duration,
    FONT: Math.round(Math.min(width, height) * 0.095), ORB: Math.round(Math.min(width, height) * 0.38),
    TRAVEL: Math.round(Math.min(width, height) * 0.1)};
  const template = name => readFileSync(join(APP, 'assets', name), 'utf8').replace(/\{\{(\w+)\}\}/g, (_, key) => values[key]);
  mkdirSync(join(project, 'assets'), {recursive: true});
  copyFileSync(GSAP, join(project, 'assets/gsap.min.js'));
  copyFileSync(join(APP, 'node_modules/gsap/README.md'), join(project, 'assets/GSAP-README.md'));
  writeFileSync(join(project, 'index.html'), template('index.html'));
  mkdirSync(join(project, 'compositions'));
  writeFileSync(join(project, 'compositions/study.html'), template('study.html'));
  writeFileSync(join(project, 'project.json'), JSON.stringify({schemaVersion: 1, engine: 'hyperframes',
    engineVersion: JSON.parse(readFileSync(join(APP, 'package.json'))).dependencies['hyperframes'],
    width, height, duration, fps: 30, purpose: 'technical-sample'}, null, 2) + '\n');
  return project;
}
function run(command, args, options = {}) {
  const result = spawnSync(command, args, {stdio: 'inherit', ...options});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`命令失败（${result.status ?? result.signal}）：${command}`);
}
function hf(command, project, args = []) {
  if (!existsSync(CLI)) throw new Error('请先在 apps/motion-video 运行 npm ci。');
  const positional = command === 'timeline' && args[0] && !args[0].startsWith('-')
    ? [CLI, command, ...args, '--dir', project]
    : [CLI, command, project, ...args];
  if (command === 'preview' && !args.some(arg => ['--foreground', '--background', '--stop', '--status', '--context', '--selection'].includes(arg))) {
    positional.push('--foreground');
  }
  run(process.execPath, positional, {cwd: project,
    env: {...process.env, PWD: project, HYPERFRAMES_NO_TELEMETRY: '1', DO_NOT_TRACK: '1'}});
}
export function main(argv = process.argv.slice(2)) {
  const separator = argv.indexOf('--');
  const extra = separator < 0 ? [] : argv.slice(separator + 1);
  const {values, positionals} = parseArgs({args: separator < 0 ? argv : argv.slice(0, separator), allowPositionals: true,
    options: {'project-dir': {type: 'string'}, width: {type: 'string'}, height: {type: 'string'},
      duration: {type: 'string'}, output: {type: 'string'}, quality: {type: 'string', default: 'draft'}, help: {type: 'boolean'}}});
  const [command] = positionals;
  if (values.help || !command) {
    console.log('video.mjs init|lint|check|snapshot|preview|render|info|timeline --project-dir <绝对路径>\ninit: --width 1920 --height 1080 --duration 6\nrender: --output <绝对路径.mp4> --quality draft|delivery\n检查和预览的上游参数放在 -- 后，例如 snapshot --at 0,2,4');
    return;
  }
  if (positionals.length !== 1) throw new Error('只接受一个子命令。');
  const project = externalPath(values['project-dir']);
  if (command === 'init') {
    console.log(initialize(project, {width: Number(values.width ?? 1920), height: Number(values.height ?? 1080), duration: Number(values.duration ?? 6)}));
    return;
  }
  if (!existsSync(join(project, 'index.html'))) throw new Error('项目缺少 index.html。');
  if (command === 'render') {
    if (extra.length) throw new Error('render 仅接受 --output 与 --quality。');
    if (!['draft', 'delivery'].includes(values.quality)) throw new Error('quality 须为 draft 或 delivery。');
    const output = externalPath(values.output);
    if (!output.toLowerCase().endsWith('.mp4')) throw new Error('输出须为 MP4。');
    if (existsSync(output)) throw new Error('输出已存在；请使用新文件名保留已有版本。');
    hf('check', project, ['--json']);
    mkdirSync(dirname(output), {recursive: true});
    hf('render', project, ['--quality', values.quality, '--output', output]);
    run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size:stream=codec_name,width,height', '-of', 'json', output]);
  } else if (['lint', 'check', 'snapshot', 'preview', 'info', 'timeline'].includes(command)) {
    hf(command, project, extra);
  } else throw new Error(`不支持的命令：${command}`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, symlinkSync, rmSync, readFileSync, existsSync, realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {APP, externalPath, dimensions, initialize, main} from '../scripts/video.mjs';

test('external project boundary includes symlink ancestors', () => {
  assert.throws(() => externalPath('relative/video'));
  assert.throws(() => externalPath(join(APP, 'projects/test')));
  const temp = mkdtempSync(join(tmpdir(), 'motion-path-'));
  try {
    symlinkSync(APP, join(temp, 'app'), 'dir');
    assert.throws(() => externalPath(join(temp, 'app/new-project')));
    symlinkSync(join(APP, 'not-created.mp4'), join(temp, 'dangling.mp4'));
    assert.throws(() => externalPath(join(temp, 'dangling.mp4')));
    assert.equal(externalPath(join(temp, 'project')), join(realpathSync(temp), 'project'));
  } finally { rmSync(temp, {recursive: true, force: true}); }
});
test('invalid dimensions and non-finite durations are rejected', () => {
  for (const args of [[1081,1920,5], [0,1080,5], [1920,1080,NaN], [1920,1080,Infinity]]) {
    assert.throws(() => dimensions(...args));
  }
  dimensions(1080,1920,6);
});
test('initializer preserves existing project and produces self-contained seekable source', () => {
  if (!existsSync(join(APP, 'node_modules/gsap/dist/gsap.min.js'))) throw new Error('npm ci required');
  const temp = mkdtempSync(join(tmpdir(), 'motion-init-'));
  try {
    const project = join(temp, 'video');
    initialize(project, {width:1080,height:1920,duration:4});
    const before = readFileSync(join(project, 'index.html'), 'utf8');
    assert.ok(before.includes('data-height="1920"'));
    assert.ok(!before.includes('{{'));
    assert.ok(existsSync(join(project, 'assets/GSAP-README.md')));
    assert.throws(() => initialize(project));
    assert.equal(readFileSync(join(project, 'index.html'), 'utf8'), before);
    assert.throws(() => main(['publish','--project-dir',project]));
    assert.throws(() => main(['render','--project-dir',project,'--output',join(project,'out.mp4'),'--quality','unknown']));
  } finally { rmSync(temp, {recursive:true, force:true}); }
});

import test from "node:test";
import assert from "node:assert/strict";
import {resolve} from "node:path";
import {resolveProjectContext} from "../scripts/project-args.mjs";

const root = resolve("D:/work/knowledge-video-factory");

test("resolves legacy project slug", () => {
  const result = resolveProjectContext(["node", "script", "a-share-buffett"], root);
  assert.equal(result.projectDir, resolve(root, "projects", "a-share-buffett"));
  assert.equal(result.projectKey, "a-share-buffett");
});

test("uses parent topic slug for external video directory", () => {
  const external = resolve("D:/code/content/topics/20260726-a-share-buffett/video");
  const result = resolveProjectContext(["node", "script", "--project-dir", external], root);
  assert.equal(result.projectDir, external);
  assert.equal(result.projectKey, "20260726-a-share-buffett");
});

test("rejects missing project", () => {
  assert.throws(() => resolveProjectContext(["node", "script"], root), /project-slug/);
});

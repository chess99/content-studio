import { access } from "node:fs/promises";
import process from "node:process";

const requiredPaths = [
  "README.md",
  "AGENTS.md",
  "brand/DESIGN.md",
  "brand/pronunciation.json",
  "config/pipeline.example.json",
  "docs/WORKFLOW.md",
  "projects/_template/input/source.md",
  "projects/_template/input/sources.json",
  "projects/_template/input/data.csv",
  "projects/_template/config.json",
  "projects/_template/brief.json",
  "projects/_template/script.json",
  "projects/_template/storyboard.json",
  "schemas/brief.schema.json",
  "schemas/script.schema.json",
  "schemas/storyboard.schema.json",
  "src/pipeline/README.md",
  "src/providers/README.md",
  "src/renderers/README.md",
  "src/qa/README.md",
  "templates/README.md",
  "scripts/prepare-project.mjs",
  "scripts/render-project.mjs",
  "scripts/qa-video.mjs",
  "scripts/setup-voice.ps1",
  "requirements-voice.txt",
  "src/video/index.ts",
  "src/video/KnowledgeVideo.tsx",
  "src/video/templates/index.tsx",
  "projects/a-share-buffett/config.json",
  "projects/a-share-buffett/script.json",
  "projects/a-share-buffett/storyboard.json"
];

const missing = [];

for (const path of requiredPaths) {
  try {
    await access(new URL(`../${path}`, import.meta.url));
  } catch {
    missing.push(path);
  }
}

if (missing.length > 0) {
  console.error("项目结构不完整：");
  for (const path of missing) console.error(`- ${path}`);
  process.exitCode = 1;
} else {
  console.log(`结构检查通过，共核对 ${requiredPaths.length} 个必要文件。`);
}

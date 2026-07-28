import {basename, dirname, isAbsolute, join, resolve} from "node:path";

export function resolveProjectContext(argv, root) {
  const args = argv.slice(2);
  const projectDirIndex = args.indexOf("--project-dir");
  let projectDir;
  let legacySlug;

  if (projectDirIndex >= 0) {
    const value = args[projectDirIndex + 1];
    if (!value || value.startsWith("--")) throw new Error("--project-dir 后缺少目录");
    projectDir = isAbsolute(value) ? resolve(value) : resolve(process.cwd(), value);
  } else {
    legacySlug = args.find((arg) => !arg.startsWith("--"));
    if (!legacySlug) {
      throw new Error("请提供 <project-slug> 或 --project-dir <path>");
    }
    projectDir = join(root, "projects", legacySlug);
  }

  const directoryName = basename(projectDir);
  const rawKey = legacySlug ?? (directoryName.toLowerCase() === "video" ? basename(dirname(projectDir)) : directoryName);
  const projectKey = sanitizeProjectKey(rawKey);
  if (!projectKey) throw new Error(`无法从项目目录生成有效标识：${projectDir}`);

  return {projectDir, projectKey};
}

function sanitizeProjectKey(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

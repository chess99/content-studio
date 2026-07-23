#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function usage() {
  console.error(`Usage:
node skills/wechat-image-post/scripts/prepare-wechat-image-post.mjs \\
  --image <path> \\
  --slug <draft-slug> \\
  --title <title, max 20 chars> \\
  --description <caption> --out-dir <TOPIC_DIR/wechat>`);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      throw new Error(`Unexpected argument: ${arg}`);
    }
    const key = arg.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for ${arg}`);
    }
    args[key] = value;
    i += 1;
  }
  return args;
}

function assertTitle(title) {
  const count = Array.from(title).length;
  if (count > 20) {
    throw new Error(`WeChat image-post title must be 20 characters or fewer; got ${count}.`);
  }
}

function escapeMd(value) {
  return value.replace(/\r\n/g, '\n').trim();
}

function main() {
  const args = parseArgs(process.argv);
  const required = ['image', 'slug', 'title', 'description', 'out-dir'];
  for (const key of required) {
    if (!args[key]) {
      usage();
      throw new Error(`Missing --${key}`);
    }
  }

  assertTitle(args.title);

  const imagePath = path.resolve(args.image);
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image does not exist: ${imagePath}`);
  }

  const outDir = path.resolve(args['out-dir']);
  fs.mkdirSync(outDir, { recursive: true });

  const imageExt = path.extname(imagePath).toLowerCase() || '.png';
  const posterPath = path.join(outDir, `poster${imageExt}`);
  fs.copyFileSync(imagePath, posterPath);

  const manifest = {
    type: 'wechat-image-post',
    slug: args.slug,
    title: args.title,
    description: args.description,
    image: path.relative(process.cwd(), posterPath).replaceAll(path.sep, '/'),
    sourceImage: imagePath,
    createdAt: new Date().toISOString(),
    status: 'prepared',
  };

  const caption = `# ${args.title}

${escapeMd(args.description)}
`;

  const publishDoc = `# 公众号贴图发布准备

## 文件

- 图片：\`${manifest.image}\`
- 配置：\`${path.relative(process.cwd(), path.join(outDir, 'wechat-image-post.json')).replaceAll(path.sep, '/')}\`

## 标题

${args.title}

## 描述

${escapeMd(args.description)}

## 创建草稿命令

\`\`\`bash
node skills/wechat-image-post/scripts/wechat-image-post-draft.mjs \\
  --manifest ${path.relative(process.cwd(), path.join(outDir, 'wechat-image-post.json')).replaceAll(path.sep, '/')}
\`\`\`

## 说明

- 真正的公众号“贴图”草稿需要通过微信公众号后台 UI 创建。
- 如果 Chrome CDP 或公众号登录态不可用，先按 \`skills/wechat-image-post/SKILL.md\` 的说明完成浏览器准备。
`;

  fs.writeFileSync(path.join(outDir, 'caption.md'), caption, 'utf8');
  fs.writeFileSync(path.join(outDir, 'wechat-image-post.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(outDir, 'wechat-image-post-publish.md'), publishDoc, 'utf8');

  console.log(`Prepared WeChat image post package: ${outDir}`);
  console.log(`Manifest: ${path.join(outDir, 'wechat-image-post.json')}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

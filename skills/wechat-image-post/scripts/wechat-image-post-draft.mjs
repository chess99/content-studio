#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_PROXY = 'http://localhost:3456';
const WECHAT_HOME = 'https://mp.weixin.qq.com/';

function usage() {
  console.error(`Usage:
node skills/wechat-image-post/scripts/wechat-image-post-draft.mjs \\
  --manifest <TOPIC_DIR>/wechat/wechat-image-post.json [--proxy http://localhost:3456]`);
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

async function proxyJson(proxy, route, options = {}) {
  const response = await fetch(`${proxy}${route}`, options);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`CDP proxy ${route} failed (${response.status}): ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function evalIn(proxy, target, code) {
  return proxyJson(proxy, `/eval?target=${encodeURIComponent(target)}`, {
    method: 'POST',
    headers: { 'content-type': 'text/plain; charset=utf-8' },
    body: code,
  });
}

async function click(proxy, target, selector) {
  return proxyJson(proxy, `/click?target=${encodeURIComponent(target)}`, {
    method: 'POST',
    headers: { 'content-type': 'text/plain; charset=utf-8' },
    body: selector,
  });
}

async function setFiles(proxy, target, selector, files) {
  return proxyJson(proxy, `/setFiles?target=${encodeURIComponent(target)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ selector, files }),
  });
}

async function openTab(proxy, url) {
  return proxyJson(proxy, '/new', {
    method: 'POST',
    headers: { 'content-type': 'text/plain; charset=utf-8' },
    body: url,
  });
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitFor(proxy, target, expression, timeoutMs = 30000) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = await evalIn(proxy, target, expression);
    if (last && last.value) return last.value;
    await sleep(800);
  }
  throw new Error(`Timed out waiting for expression: ${expression}. Last result: ${JSON.stringify(last)}`);
}

function browserFillScript({ title, description }) {
  return `
(() => {
  const title = ${JSON.stringify(title)};
  const description = ${JSON.stringify(description)};

  function setNativeValue(el, value) {
    const proto = Object.getPrototypeOf(el);
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
    if (descriptor && descriptor.set) descriptor.set.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function byPlaceholder(part) {
    return Array.from(document.querySelectorAll('input, textarea'))
      .find((el) => (el.getAttribute('placeholder') || '').includes(part));
  }

  const titleInput = byPlaceholder('请输入标题') || byPlaceholder('标题');
  const descInput = byPlaceholder('描述') || Array.from(document.querySelectorAll('textarea')).at(0);

  if (!titleInput) return { ok: false, reason: 'title input not found' };
  setNativeValue(titleInput, title);

  if (descInput) {
    setNativeValue(descInput, description);
  } else {
    const editable = Array.from(document.querySelectorAll('[contenteditable="true"]'))
      .find((el) => (el.innerText || '').includes('描述') || el.clientHeight > 20);
    if (!editable) return { ok: false, reason: 'description input not found' };
    editable.focus();
    editable.innerText = description;
    editable.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: description }));
  }

  return { ok: true };
})()
`;
}

function findAndClickTextScript(text) {
  return `
(() => {
  const needle = ${JSON.stringify(text)};
  const nodes = Array.from(document.querySelectorAll('button, a, div, span'))
    .filter((el) => (el.innerText || el.textContent || '').trim().includes(needle));
  const el = nodes.find((node) => {
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  if (!el) return { ok: false, reason: 'not found', text: needle };
  el.scrollIntoView({ block: 'center', inline: 'center' });
  el.click();
  return { ok: true, text: needle };
})()
`;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.manifest) {
    usage();
    throw new Error('Missing --manifest');
  }

  const proxy = args.proxy || DEFAULT_PROXY;
  const manifestPath = path.resolve(args.manifest);
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const imagePath = path.isAbsolute(manifest.image)
    ? manifest.image
    : path.resolve(manifest.image);

  await fs.access(imagePath);

  try {
    await proxyJson(proxy, '/targets');
  } catch (error) {
    throw new Error(`Chrome CDP proxy is unavailable at ${proxy}. Run the web-access dependency check and enable remote debugging before retrying. Details: ${error.message}`);
  }

  const created = await openTab(proxy, WECHAT_HOME);
  const target = created.id || created.targetId || created;
  if (!target) throw new Error(`Could not determine target id from /new result: ${JSON.stringify(created)}`);

  await waitFor(proxy, target, 'document.readyState === "complete"', 30000);
  await sleep(1500);

  const loginCheck = await evalIn(proxy, target, `document.body.innerText.includes('扫码') || document.body.innerText.includes('登录')`);
  if (loginCheck.value) {
    throw new Error('WeChat backend is asking for login/QR confirmation. Complete login in the browser, then rerun this command.');
  }

  let clicked = await evalIn(proxy, target, findAndClickTextScript('贴图'));
  if (!clicked.value?.ok) {
    clicked = await evalIn(proxy, target, findAndClickTextScript('新的创作'));
    await sleep(1000);
    await evalIn(proxy, target, findAndClickTextScript('贴图'));
  }

  await sleep(2500);
  await waitFor(proxy, target, `document.body.innerText.includes('请选择或拖拽图片') || document.querySelector('input[type=file]')`, 30000);

  const fileInputExists = await evalIn(proxy, target, `Boolean(document.querySelector('input[type=file]'))`);
  if (!fileInputExists.value) {
    await evalIn(proxy, target, findAndClickTextScript('选择或拖拽图片'));
    await sleep(1000);
  }
  await setFiles(proxy, target, 'input[type=file]', [imagePath]);

  await sleep(3000);
  const fill = await evalIn(proxy, target, browserFillScript({
    title: manifest.title,
    description: manifest.description,
  }));
  if (!fill.value?.ok) {
    throw new Error(`Could not fill editor fields: ${JSON.stringify(fill.value)}`);
  }

  await sleep(1000);
  const saved = await evalIn(proxy, target, findAndClickTextScript('保存为草稿'));
  if (!saved.value?.ok) {
    await click(proxy, target, 'button');
  }

  await sleep(2000);
  const body = await evalIn(proxy, target, `document.body.innerText`);
  await fs.writeFile(
    path.join(path.dirname(manifestPath), 'wechat-image-post-status.md'),
    `# 公众号贴图发布状态

- 时间：${new Date().toISOString()}
- 标题：${manifest.title}
- 图片：${manifest.image}
- 状态：已尝试保存草稿

## 页面回显

\`\`\`
${String(body.value || '').slice(0, 2000)}
\`\`\`
`,
    'utf8',
  );

  console.log('WeChat image-post draft flow completed. Check the WeChat backend draft list.');
}

await main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

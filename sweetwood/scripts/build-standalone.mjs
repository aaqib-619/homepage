// Builds preview/homepage-standalone.html: the homepage as one file with every image inlined.
// Run: node sweetwood/scripts/build-standalone.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { webp: 'image/webp', jpg: 'image/jpeg', png: 'image/png' };
const cache = new Map();
const inline = (path) => {
  if (!cache.has(path)) {
    const ext = path.split('.').pop();
    cache.set(path, `data:${MIME[ext]};base64,${readFileSync(join(ROOT, path)).toString('base64')}`);
  }
  return cache.get(path);
};
let html = readFileSync(join(ROOT, 'index.html'), 'utf8');
html = html.replace(/assets\/(?:composed|amazon|site)\/[\w-]+\.(webp|jpg|png)/g, inline);
// The preload hints would duplicate the inlined hero bytes, so drop them.
html = html.replace(/<link rel="preload" as="image"[^>]*>\n/g, '');
writeFileSync(join(ROOT, 'preview', 'homepage-standalone.html'), html);
console.log(`preview/homepage-standalone.html: ${(html.length / 1024).toFixed(0)} KB, ${cache.size} images inlined`);

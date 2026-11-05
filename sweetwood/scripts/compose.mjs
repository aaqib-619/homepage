// Composes Shopify-ready images (hero, product cards, sampler, timeline) from the brand cut-outs.
// Each composition is an HTML template rendered by the preinstalled Chromium.
// Run: node sweetwood/scripts/compose.mjs   -> sweetwood/assets/composed/*.jpg + *.webp
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets', 'composed');
mkdirSync(OUT, { recursive: true });
const A = (n) => pathToFileURL(join(ROOT, 'assets', 'amazon', n + '.png')).href;

// Brand colours (sampled from the Amazon content and sweetwoodshots.com)
const C = { lime: '#B8C329', limeSoft: '#EEF1C8', cream: '#F8F2E4', pink: '#FF8AA2', pinkSoft: '#FFE1E7', yellow: '#FFB700', yellowSoft: '#FFEDB8', sand: '#F1E2C6', green: '#0F4D2E' };

const img = (src, style) => `<img src="${src}" style="position:absolute;${style}">`;
const shadow = 'filter:drop-shadow(0 30px 30px rgba(60,30,10,.28))';
const bottle = (f, style) => img(A('bottle-' + f), `${shadow};${style}`);
// The bottle cut-outs sit in an 800x800 canvas with the bottle centred (≈256x656). These helpers place by bottle height.
const B = (f, cx, bottom, h, rot = 0) => { const s = h / 656; return bottle(f, `width:${800 * s}px;left:${cx - 400 * s}px;top:${bottom - 736 * s}px;transform:rotate(${rot}deg)`); };

const page = (w, h, bg, body) => `<!doctype html><html><head><style>html,body{margin:0}body{width:${w}px;height:${h}px;position:relative;overflow:hidden;background:${bg}}</style></head><body>${body}</body></html>`;
const blob = (cx, cy, r, color, extra = '') => `<div style="position:absolute;left:${cx - r}px;top:${cy - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:${color};${extra}"></div>`;

const JOBS = {
  // Mobile hero: product group sits low, so the theme can stack text above on the same colour.
  'hero-mobile': [1170, 1000, C.limeSoft, `
    ${blob(585, 760, 470, C.lime, 'opacity:.55')}
    ${img(A('ing-hibiscus-sprig'), 'width:520px;left:-60px;top:500px;transform:rotate(-12deg)')}
    ${img(A('ing-cinnamon-sticks'), 'width:560px;left:640px;top:640px;transform:rotate(8deg)')}
    ${B('hibiscus', 330, 930, 560, -6)}
    ${B('passion', 840, 930, 560, 6)}
    ${B('original', 585, 975, 680)}
    ${img(A('ing-cinnamon-bundle'), 'width:420px;left:90px;top:780px')}
  `],
  'hero-desktop': [1600, 1100, C.limeSoft, `
    ${blob(1230, 760, 520, C.lime, 'opacity:.55')}
    ${img(A('ing-hibiscus-sprig'), 'width:560px;left:720px;top:540px;transform:rotate(-12deg)')}
    ${img(A('ing-cinnamon-sticks'), 'width:560px;left:1200px;top:700px;transform:rotate(8deg)')}
    ${B('hibiscus', 1010, 1010, 580, -6)}
    ${B('passion', 1450, 1010, 580, 6)}
    ${B('original', 1230, 1060, 720)}
    ${img(A('ing-cinnamon-bundle'), 'width:420px;left:800px;top:850px')}
  `],
  'card-original': [1000, 1250, C.sand, `
    ${blob(500, 640, 380, '#E8D2A8')}
    ${img(A('ing-cinnamon-bundle'), 'width:560px;left:420px;top:830px')}
    ${B('original', 470, 1120, 860)}
  `],
  'card-hibiscus': [1000, 1250, C.pinkSoft, `
    ${blob(500, 640, 380, '#FFC3CF')}
    ${img(A('ing-hibiscus'), 'width:420px;left:520px;top:760px;transform:rotate(14deg)')}
    ${B('hibiscus', 450, 1120, 860)}
  `],
  'card-passion': [1000, 1250, C.yellowSoft, `
    ${blob(500, 640, 380, '#FFDB7A')}
    ${img(A('ing-cinnamon-sticks'), 'width:560px;left:420px;top:880px;transform:rotate(-6deg)')}
    ${B('passion', 470, 1120, 860)}
  `],
  'card-sampler': [1000, 1250, C.cream, `
    ${blob(500, 660, 400, C.limeSoft)}
    ${B('hibiscus', 290, 1080, 620, -5)}
    ${B('passion', 710, 1080, 620, 5)}
    ${B('original', 500, 1140, 740)}
  `],
  'timeline-trays': [1000, 1000, C.cream, `
    ${blob(500, 520, 420, C.limeSoft)}
    ${img(A('tray-hibiscus'), `${shadow};width:820px;left:150px;top:140px`)}
    ${img(A('tray-original'), `${shadow};width:820px;left:20px;top:420px`)}
  `],
};

const browser = await pw.chromium.launch();
const pg = await browser.newPage();
for (const [name, [w, h, bg, body]] of Object.entries(JOBS)) {
  await pg.setViewportSize({ width: w, height: h });
  // Load from a file so the file:// cut-outs are allowed to load.
  const tmp = join(tmpdir(), `sw-compose-${name}.html`);
  writeFileSync(tmp, page(w, h, bg, body));
  await pg.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
  rmSync(tmp);
  await pg.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
  await pg.screenshot({ path: join(OUT, name + '.jpg'), type: 'jpeg', quality: 88 });
  console.log('composed', name);
}
await browser.close();
execSync(`python3 -I -c "import glob; from PIL import Image\nfor f in glob.glob('${OUT}/*.jpg'): Image.open(f).save(f[:-4] + '.webp', 'WEBP', quality=80)"`);
// Phone-sized variants used by srcset in index.html
execSync(`python3 -I ${join(dirname(fileURLToPath(import.meta.url)), 'make-variants.py')}`, { stdio: 'inherit' });

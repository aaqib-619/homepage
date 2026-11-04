// Renders the SVG artwork to JPGs for Shopify upload, and screenshots the homepage.
// Run: node sweetwood/scripts/render.mjs [--art] [--page]
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }
const { chromium } = pw;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ART = join(ROOT, 'assets', 'art');
const EXPORT = join(ROOT, 'assets', 'export');
const PREVIEW = join(ROOT, 'preview');
mkdirSync(EXPORT, { recursive: true });
mkdirSync(PREVIEW, { recursive: true });

const args = process.argv.slice(2);
const doArt = !args.length || args.includes('--art');
const doPage = !args.length || args.includes('--page');

const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;600;700&display=block" rel="stylesheet">';

const browser = await chromium.launch();

if (doArt) {
  const page = await browser.newPage();
  for (const f of readdirSync(ART).filter(f => f.endsWith('.svg'))) {
    const svg = readFileSync(join(ART, f), 'utf8');
    const [, w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<!doctype html><html><head>${FONTS}<style>html,body{margin:0;background:#FBF5EC}svg{display:block}</style></head><body>${svg}</body></html>`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const out = join(EXPORT, f.replace('.svg', f.startsWith('logo') ? '.png' : '.jpg'));
    await page.screenshot({ path: out, type: out.endsWith('.png') ? 'png' : 'jpeg', quality: out.endsWith('.png') ? undefined : 88, omitBackground: out.endsWith('.png') });
    console.log('art', f);
  }
  await page.close();
  // WebP copies for the page (smaller); Shopify converts uploads automatically, so upload the JPGs there.
  execSync(`python3 -I -c "import glob; from PIL import Image\nfor f in glob.glob('${EXPORT}/*.jpg'): Image.open(f).save(f[:-4] + '.webp', 'WEBP', quality=80)"`);
}

if (doPage) {
  const url = pathToFileURL(join(ROOT, 'index.html')).href;
  const shots = [
    { name: 'mobile', viewport: { width: 390, height: 844 }, scale: 2, mobile: true },
    { name: 'desktop', viewport: { width: 1440, height: 900 }, scale: 1, mobile: false },
  ];
  for (const s of shots) {
    const ctx = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: s.scale, isMobile: s.mobile, hasTouch: s.mobile });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => m.type() === 'error' && errors.push(m.text()));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // reveal any scroll-triggered content
    await page.screenshot({ path: join(PREVIEW, `${s.name}-fold.png`) });
    // scroll through so lazy images load, then reveal everything for the full-page capture
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')); document.getElementById('sticky').style.display = 'none'; });
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(PREVIEW, `${s.name}-full.png`), fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(s.name, 'horizontal overflow px:', overflow, errors.length ? 'errors: ' + errors.join(' | ') : 'no console errors');
    await ctx.close();
  }
}

await browser.close();

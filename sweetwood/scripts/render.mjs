// Screenshots the homepage at phone and desktop size and checks for overflow and console errors.
// Run: node sweetwood/scripts/render.mjs
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }
const { chromium } = pw;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PREVIEW = join(ROOT, 'preview');
mkdirSync(PREVIEW, { recursive: true });

const args = process.argv.slice(2);
const doPage = true;


const browser = await chromium.launch();

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

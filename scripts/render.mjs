// Exports Shopify-ready images and mobile previews using the preinstalled Playwright/Chromium.
// Run: node scripts/generate-assets.mjs && node scripts/render.mjs
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch { pw = require(join(execSync("npm root -g").toString().trim(), "playwright")); }
const { chromium, devices } = pw;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const exp = join(root, "assets/export"), prev = join(root, "preview");
mkdirSync(exp, { recursive: true }); mkdirSync(prev, { recursive: true });

const browser = await chromium.launch();

// 1. Rasterise every SVG (text-free art) to JPG for theme image pickers.
const raster = await browser.newPage();
for (const dir of ["banners", "products"]) {
  for (const f of readdirSync(join(root, "assets", dir)).filter(f => f.endsWith(".svg"))) {
    const src = pathToFileURL(join(root, "assets", dir, f)).href;
    await raster.goto(src);
    const { w, h } = await raster.evaluate(() => { const s = document.querySelector("svg"); return { w: +s.getAttribute("width"), h: +s.getAttribute("height") }; });
    const scale = dir === "products" ? 2 : 1;
    await raster.setViewportSize({ width: w * scale, height: h * scale });
    await raster.evaluate(([W, H]) => { const s = document.querySelector("svg"); s.setAttribute("width", W); s.setAttribute("height", H); }, [w * scale, h * scale]);
    await raster.screenshot({ path: join(exp, `${dir === "products" ? "product" : "art"}-${f.replace(".svg", ".jpg")}`), type: "jpeg", quality: 86 });
  }
}

// 2. Banners with copy baked in, at 3x for mobile (1170px wide).
const ctx = await browser.newContext({ ...devices["iPhone 13"], ignoreHTTPSErrors: true });
await ctx.addInitScript(() => { try { localStorage.setItem("welcomeSeen", "true"); localStorage.removeItem("cart"); } catch {} });
async function open(){
  const page = await ctx.newPage();
  for (let i = 0; i < 4; i++) {
    await page.goto(pathToFileURL(join(root, "index.html")).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const loaded = await page.evaluate(() => ["Cormorant", "DM Sans", "Prata"].every(n => [...document.fonts].some(f => f.family.includes(n) && f.status === "loaded")));
    if (loaded) break;
    console.warn("Web fonts not loaded, retrying…");
  }
  // Load lazy images up front so captures are complete.
  await page.evaluate(() => Promise.all([...document.images].map(i => { i.loading = "eager"; return i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }); })));
  await page.waitForTimeout(300);
  return page;
}
let page = await open();
await page.addStyleTag({ content: ".header,.sticky{display:none!important}" });
const shots = {
  "banner-hero": ".hero",
  "banner-gifting": "section[aria-labelledby=gift-h] .banner",
  "banner-gold-jewellery": "#gold .banner",
  "banner-gemstones": "#gems .banner",
  "banner-custom-designs": "#custom .banner",
  "banner-shop-by-budget": ".budget"
};
for (const [name, sel] of Object.entries(shots)) await page.locator(sel).screenshot({ path: join(exp, `${name}.jpg`), type: "jpeg", quality: 88 });

// 3. Previews: above the fold, full page, cart drawer, menu, welcome offer.
await page.close();
page = await open();
await page.screenshot({ path: join(prev, "01-above-the-fold.png") });
await page.mouse.wheel(0, 1500); await page.waitForTimeout(600);
await page.screenshot({ path: join(prev, "03-sticky-cta.png") });
await page.mouse.wheel(0, -5000); await page.waitForTimeout(400);
const hide = await page.addStyleTag({ content: ".sticky{display:none!important}.marquee{animation:none!important}" });
await page.screenshot({ path: join(prev, "02-full-page.jpg"), fullPage: true, type: "jpeg", quality: 80 });
await hide.evaluate(n => n.remove());
await page.setViewportSize(devices["iPhone 13"].viewport);
await page.mouse.wheel(0, 1500); await page.waitForTimeout(400);
await page.locator("[data-add]").first().click(); await page.waitForTimeout(500);
await page.screenshot({ path: join(prev, "04-cart-drawer.png") });
await page.keyboard.press("Escape"); await page.waitForTimeout(300);
await page.locator("[data-open=menu]").click(); await page.waitForTimeout(500);
await page.screenshot({ path: join(prev, "05-menu.png") });
await page.keyboard.press("Escape");
await page.evaluate(() => { const w = document.getElementById("welcome"); w.classList.add("on"); }); await page.waitForTimeout(500);
await page.screenshot({ path: join(prev, "06-welcome-offer.png") });
await page.evaluate(() => document.getElementById("welcome").classList.remove("on"));
await page.locator("#custom-form").scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
await page.locator("#custom-form").screenshot({ path: join(prev, "07-custom-design-form.png") });

await browser.close();
console.log("Exported to assets/export and preview/");

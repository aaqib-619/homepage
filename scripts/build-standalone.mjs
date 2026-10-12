// Builds single-file previews with every local image (and the hero video) inlined as data URIs,
// so each page can be opened, emailed or previewed anywhere:
//   index.html  -> preview/homepage-standalone.html
//   custom.html -> preview/custom-standalone.html
// Run: node scripts/build-standalone.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TYPES = { ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".webm": "video/webm" };
const uri = p => `data:${TYPES[extname(p)]};base64,` + readFileSync(join(root, p)).toString("base64");
const lookup = dir => JSON.stringify(Object.fromEntries(
  readdirSync(join(root, "assets", dir)).filter(f => f.endsWith(".svg")).map(f => [f.replace(".svg", ""), uri(`assets/${dir}/${f}`)])));

const PAGES = [
  { src: "index.html", out: "preview/homepage-standalone.html",
    helper: "const IMG = id => byId[id]?.img || `assets/products/${id}.svg`;",
    inline: () => `const IMG_DATA = ${lookup("products")};\nconst IMG = id => byId[id]?.img || IMG_DATA[id];` },
  { src: "custom.html", out: "preview/custom-standalone.html",
    helper: "const IMG = id => `assets/portfolio/${id}.svg`;",
    inline: () => `const IMG_DATA = ${lookup("portfolio")};\nconst IMG = id => IMG_DATA[id];` },
];

mkdirSync(join(root, "preview"), { recursive: true });
for (const page of PAGES) {
  let html = readFileSync(join(root, page.src), "utf8");
  // The preload hint and social image add nothing to an offline preview, so drop them rather than embed images twice more.
  html = html.replace(/<link rel="preload"[^>]*>\n?/, "").replace(/<meta property="og:image"[^>]*>\n?/, "");
  // Literal references in markup and in page data.
  html = html.replace(/assets\/(?:banners|brand|images|products|portfolio|video)\/[\w.-]+\.(?:svg|png|webp|jpg|webm)/g, m => uri(m));
  // Images built in JS from an id get an inlined lookup instead.
  if (!html.includes(page.helper)) throw new Error(`IMG helper not found in ${page.src}`);
  html = html.replace(page.helper, page.inline());
  writeFileSync(join(root, page.out), html);
  console.log(`${page.out} (${(html.length / 1024).toFixed(0)} KB)`);
}

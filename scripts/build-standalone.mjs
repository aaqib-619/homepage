// Builds preview/homepage-standalone.html: index.html with every local image inlined as a data URI,
// so the single file can be opened, emailed or previewed anywhere.
// Run: node scripts/build-standalone.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TYPES = { ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg" };
const uri = p => `data:${TYPES[extname(p)]};base64,` + readFileSync(join(root, p)).toString("base64");

let html = readFileSync(join(root, "index.html"), "utf8");

// The preload hint and social image add nothing to an offline preview, so drop them rather than embed the photo twice more.
html = html.replace(/<link rel="preload"[^>]*>\n?/, "").replace(/<meta property="og:image"[^>]*>\n?/, "");

// Literal references in markup and in the PRODUCTS data.
html = html.replace(/assets\/(?:banners|brand|images|products)\/[\w.-]+\.(?:svg|png|webp)/g, m => uri(m));

// Product images are also built in JS from an id; inline them as a lookup.
const products = Object.fromEntries(
  readdirSync(join(root, "assets/products")).filter(f => f.endsWith(".svg"))
    .map(f => [f.replace(".svg", ""), uri(`assets/products/${f}`)])
);
const helper = "const IMG = id => byId[id]?.img || `assets/products/${id}.svg`;";
if (!html.includes(helper)) throw new Error("IMG helper not found in index.html");
html = html.replace(helper, `const IMG_DATA = ${JSON.stringify(products)};\nconst IMG = id => byId[id]?.img || IMG_DATA[id];`);

mkdirSync(join(root, "preview"), { recursive: true });
writeFileSync(join(root, "preview/homepage-standalone.html"), html);
console.log(`preview/homepage-standalone.html (${(html.length / 1024).toFixed(0)} KB)`);

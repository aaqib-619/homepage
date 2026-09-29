// Builds preview/homepage-standalone.html: index.html with every SVG inlined as a data URI,
// so the single file can be opened, emailed or previewed anywhere.
// Run: node scripts/build-standalone.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const uri = p => "data:image/svg+xml;base64," + readFileSync(join(root, p)).toString("base64");

let html = readFileSync(join(root, "index.html"), "utf8");

// Static references (hero, banners) in the markup.
html = html.replace(/assets\/banners\/[\w-]+\.svg/g, m => uri(m));

// Product images are built in JS from an id; swap the helper for an inlined lookup.
const products = Object.fromEntries(
  readdirSync(join(root, "assets/products")).filter(f => f.endsWith(".svg"))
    .map(f => [f.replace(".svg", ""), uri(`assets/products/${f}`)])
);
const helper = "const IMG = id => `assets/products/${id}.svg`;";
if (!html.includes(helper)) throw new Error("IMG helper not found in index.html");
html = html.replace(helper, `const IMG_DATA = ${JSON.stringify(products)};\nconst IMG = id => IMG_DATA[id];`);

mkdirSync(join(root, "preview"), { recursive: true });
writeFileSync(join(root, "preview/homepage-standalone.html"), html);
console.log(`preview/homepage-standalone.html (${(html.length / 1024).toFixed(0)} KB)`);

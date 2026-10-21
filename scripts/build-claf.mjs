// Builds the CLAF homepage mockup as ONE self-contained file, with every font and image inlined
// as a data URI and no external calls:
//   claf/index.html -> claf/dist/claf-homepage.html
// Run: node scripts/build-claf.mjs
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "claf");
const TYPES = { ".woff2": "font/woff2", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };

let html = readFileSync(join(root, "index.html"), "utf8");

// Inline each asset once per reference; repeated images go through CSS custom properties in the source.
const missing = new Set();
html = html.replace(/assets\/[\w/.-]+\.(?:woff2|png|webp|jpg|svg)/g, p => {
  if (!existsSync(join(root, p))) { missing.add(p); return p; }
  return `data:${TYPES[extname(p)]};base64,` + readFileSync(join(root, p)).toString("base64");
});
if (missing.size) throw new Error(`Missing assets: ${[...missing].join(", ")} (fonts are not in git; see claf/README.md)`);

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "claf-homepage.html"), html);
console.log(`claf/dist/claf-homepage.html (${(html.length / 1024).toFixed(0)} KB)`);

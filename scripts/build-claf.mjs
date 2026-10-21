// Builds the CLAF homepage mockup as ONE self-contained file, with every font and image inlined
// as a data URI and no external calls:
//   claf/index.html -> claf/dist/claf-homepage.html
// Graphics that haven't been supplied yet (see SLOTS) are dropped from the CSS and their
// "Asset slot" labels stay visible. Drop the file into claf/assets/graphics/ and rebuild to fill the slot.
// Run: node scripts/build-claf.mjs
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "claf");
const TYPES = { ".woff2": "font/woff2", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const SLOTS = { "nautical-chart": "assets/graphics/nautical-chart.jpg", "trincomalee-map": "assets/graphics/trincomalee-map.jpg" };

let html = readFileSync(join(root, "index.html"), "utf8");

const missing = Object.keys(SLOTS).filter(k => !existsSync(join(root, SLOTS[k])));
html = html.replace(/data-missing="[^"]*"/, `data-missing="${missing.join(" ")}"`);
for (const k of missing) html = html.replaceAll(`url("${SLOTS[k]}")`, "none");

const needed = new Set();
html = html.replace(/assets\/[\w/.-]+\.(?:woff2|png|webp|jpg|svg)/g, p => {
  if (!existsSync(join(root, p))) { needed.add(p); return p; }
  return `data:${TYPES[extname(p)]};base64,` + readFileSync(join(root, p)).toString("base64");
});
if (needed.size) throw new Error(`Missing assets: ${[...needed].join(", ")} (fonts are not in git; see claf/README.md)`);

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "claf-homepage.html"), html);
console.log(`claf/dist/claf-homepage.html (${(html.length / 1024).toFixed(0)} KB)` + (missing.length ? `, empty slots: ${missing.join(", ")}` : ""));

// Renders the placeholder hero video for custom.html: a pencil sketch becoming a finished sapphire ring.
// Frames are stepped deterministically (Web Animations API) so the 8s loop is seamless, then encoded to
// WebM/VP8 with the ffmpeg bundled with Playwright. Swap in real footage when you have it (see README).
// Run: node scripts/make-hero-video.mjs
import { createRequire } from "node:module";
import { execSync, spawn } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch { pw = require(join(execSync("npm root -g").toString().trim(), "playwright")); }

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets/video");
mkdirSync(outDir, { recursive: true });

const W = 720, H = 900, FPS = 30, SECONDS = 8;
// Ring geometry (scene coordinates).
const cx = 360, bandCy = 470, rx = 190, ry = 150, gemCy = 300;
const bandPath = `M ${cx} ${bandCy - ry} A ${rx} ${ry} 0 1 1 ${cx - 0.01} ${bandCy - ry}`;

const html = `<!doctype html><html><head><style>
  html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#3c0e2a}
  svg,.pencil{position:absolute;left:0;top:0}
  .anim{animation-duration:${SECONDS}s;animation-iteration-count:infinite;animation-timing-function:cubic-bezier(.45,0,.25,1);animation-fill-mode:both}
  .draw{stroke-dasharray:1;stroke-dashoffset:1}
  .band-sketch{animation-name:drawBand}
  .gem-sketch{animation-name:drawGem}
  .sketch{animation-name:sketchFade}
  .gold{animation-name:goldIn;transform-origin:${cx}px ${bandCy}px}
  .stone{animation-name:stoneIn}
  .shine{stroke-dasharray:.12 .88;animation-name:shine;animation-timing-function:linear}
  .spark{animation-name:spark;transform-box:fill-box;transform-origin:center}
  .spark.s2{animation-name:spark2}
  .pencil{width:250px;height:22px;offset-path:path('${bandPath}');offset-rotate:0deg;offset-anchor:0% 50%;animation-name:pencil}
  @keyframes drawBand{0%{stroke-dashoffset:1}28%{stroke-dashoffset:0}100%{stroke-dashoffset:0}}
  @keyframes drawGem{0%,22%{stroke-dashoffset:1}36%{stroke-dashoffset:0}100%{stroke-dashoffset:0}}
  @keyframes sketchFade{0%,40%{opacity:1}52%{opacity:.28}86%{opacity:.28}96%,100%{opacity:0}}
  @keyframes pencil{0%{offset-distance:0%;opacity:0}4%{opacity:1}28%{offset-distance:100%;opacity:1}34%,100%{offset-distance:100%;opacity:0}}
  @keyframes goldIn{0%,34%{opacity:0;transform:scale(.94)}48%{opacity:1;transform:scale(1)}88%{opacity:1;transform:scale(1)}97%,100%{opacity:0;transform:scale(1)}}
  @keyframes stoneIn{0%,46%{opacity:0;transform:translateY(-70px)}56%{opacity:1;transform:translateY(0)}88%{opacity:1;transform:translateY(0)}97%,100%{opacity:0;transform:translateY(0)}}
  @keyframes shine{0%,55%{stroke-dashoffset:1;opacity:0}58%{opacity:.9}85%{stroke-dashoffset:-.1;opacity:.9}88%,100%{stroke-dashoffset:-.1;opacity:0}}
  @keyframes spark{0%,55%{transform:scale(0);opacity:0}61%{transform:scale(1.15) rotate(45deg);opacity:1}70%,100%{transform:scale(0) rotate(90deg);opacity:0}}
  @keyframes spark2{0%,64%{transform:scale(0);opacity:0}70%{transform:scale(1) rotate(45deg);opacity:1}79%,100%{transform:scale(0) rotate(90deg);opacity:0}}
</style></head><body>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5e1742"/><stop offset="1" stop-color="#2a081d"/></linearGradient>
    <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffc2c2" stop-opacity=".16"/><stop offset="1" stop-color="#ffc2c2" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a6420"/><stop offset=".28" stop-color="#e9c87a"/><stop offset=".5" stop-color="#b8893b"/><stop offset=".72" stop-color="#f7e4b0"/><stop offset="1" stop-color="#9c7228"/></linearGradient>
    <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7e4b0"/><stop offset=".45" stop-color="#c99a45"/><stop offset="1" stop-color="#8a6420"/></linearGradient>
    <linearGradient id="sapphire" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9dbcff"/><stop offset=".5" stop-color="#2a4fb8"/><stop offset="1" stop-color="#0f1f5c"/></linearGradient>
    <filter id="drop" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#14030d" flood-opacity=".5"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <circle cx="${cx}" cy="430" r="330" fill="url(#glow)"/>

  <!-- pencil sketch -->
  <g class="sketch anim" fill="none" stroke="#fff" stroke-linecap="round">
    <path class="draw band-sketch anim" pathLength="1" d="${bandPath}" stroke-opacity=".6" stroke-width="2.5"/>
    <path class="draw band-sketch anim" pathLength="1" d="M ${cx} ${bandCy - ry + 26} A ${rx - 24} ${ry - 24} 0 1 1 ${cx - 0.01} ${bandCy - ry + 26}" stroke-opacity=".35" stroke-width="1.5"/>
    <path class="draw gem-sketch anim" pathLength="1" d="M ${cx - 80} ${gemCy} A 80 58 0 1 1 ${cx + 80} ${gemCy} A 80 58 0 1 1 ${cx - 80} ${gemCy}" stroke-opacity=".6" stroke-width="2.5"/>
    <path class="draw gem-sketch anim" pathLength="1" d="M ${cx - 55} ${gemCy + 50} L ${cx + 55} ${gemCy + 50} L ${cx + 32} ${gemCy + 98} L ${cx - 32} ${gemCy + 98} Z" stroke-opacity=".5" stroke-width="2"/>
  </g>

  <!-- finished piece -->
  <g class="gold anim" filter="url(#drop)">
    <ellipse cx="${cx}" cy="${bandCy}" rx="${rx - 12}" ry="${ry - 12}" fill="none" stroke="url(#gold)" stroke-width="30"/>
    <path d="M ${cx - 55} ${gemCy + 50} L ${cx + 55} ${gemCy + 50} L ${cx + 32} ${gemCy + 98} L ${cx - 32} ${gemCy + 98} Z" fill="url(#goldV)"/>
  </g>
  <path class="shine anim" pathLength="1" d="M ${cx} ${bandCy - ry + 12} A ${rx - 12} ${ry - 12} 0 1 1 ${cx - 0.01} ${bandCy - ry + 12}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
  <g class="stone anim" filter="url(#drop)">
    <rect x="${cx - 70}" y="${gemCy - 18}" width="13" height="44" rx="6" fill="url(#goldV)" transform="rotate(-18 ${cx - 64} ${gemCy})"/>
    <rect x="${cx + 57}" y="${gemCy - 18}" width="13" height="44" rx="6" fill="url(#goldV)" transform="rotate(18 ${cx + 64} ${gemCy})"/>
    <ellipse cx="${cx}" cy="${gemCy}" rx="80" ry="58" fill="url(#sapphire)"/>
    <path d="M ${cx - 80} ${gemCy}H ${cx + 80}M ${cx} ${gemCy - 58}V ${gemCy + 58}M ${cx - 50} ${gemCy - 45}L ${cx + 50} ${gemCy + 45}M ${cx + 50} ${gemCy - 45}L ${cx - 50} ${gemCy + 45}" stroke="#fff" stroke-opacity=".22" stroke-width="2"/>
    <ellipse cx="${cx - 28}" cy="${gemCy - 14}" rx="20" ry="11" fill="#fff" opacity=".55"/>
    <rect x="${cx - 10}" y="${gemCy - 70}" width="20" height="18" rx="6" fill="url(#goldV)"/>
    <rect x="${cx - 10}" y="${gemCy + 52}" width="20" height="15" rx="6" fill="url(#goldV)"/>
  </g>
  <path class="spark anim" d="M${cx + 110} ${gemCy - 80}c3 14 9 20 23 23-14 3-20 9-23 23-3-14-9-20-23-23 14-3 20-9 23-23Z" fill="#fff"/>
  <path class="spark s2 anim" d="M${cx - 170} ${bandCy + 60}c2 10 7 15 17 17-10 2-15 7-17 17-2-10-7-15-17-17 10-2 15-7 17-17Z" fill="#fff"/>
</svg>
<svg class="pencil anim" viewBox="0 0 250 22" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 11L34 2V20Z" fill="#e9d3a8"/><path d="M0 11L12 7.5V14.5Z" fill="#2a081d"/>
  <rect x="34" y="2" width="190" height="18" fill="#d9b56a"/><rect x="34" y="2" width="190" height="6" fill="#fff" opacity=".25"/>
  <rect x="224" y="2" width="26" height="18" fill="#8a6420"/>
</svg>
</body></html>`;

// Playwright's bundled ffmpeg only reads piped MJPEG, so frames are streamed straight in as JPEGs.
const pwRoot = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
const ffmpeg = join(pwRoot, readdirSync(pwRoot).find(d => d.startsWith("ffmpeg")), "ffmpeg-linux");
const enc = spawn(ffmpeg, ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "pipe:0",
  "-c:v", "libvpx", "-b:v", "1800k", "-crf", "10", "-qmin", "4", "-qmax", "40", "-auto-alt-ref", "0", "-pix_fmt", "yuv420p",
  join(outDir, "custom-hero.webm")], { stdio: ["pipe", "inherit", "inherit"] });
const done = new Promise((res, rej) => enc.on("close", c => c === 0 ? res() : rej(new Error(`ffmpeg exited with ${c}`))));
const write = buf => new Promise(res => enc.stdin.write(buf) ? res() : enc.stdin.once("drain", res));

const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.setContent(html);
for (let i = 0; i < FPS * SECONDS; i++) {
  const t = (i / FPS) * 1000;
  await page.evaluate(t => document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; }), t);
  await write(await page.screenshot({ type: "jpeg", quality: 95 }));
}
enc.stdin.end();
// Poster: the finished ring, before the loop fades out.
await page.evaluate(t => document.getAnimations().forEach(a => { a.currentTime = t; }), 6000);
await page.screenshot({ path: join(outDir, "custom-hero-poster.jpg"), type: "jpeg", quality: 84 });
await browser.close();
await done;
console.log("Wrote assets/video/custom-hero.webm and custom-hero-poster.jpg");

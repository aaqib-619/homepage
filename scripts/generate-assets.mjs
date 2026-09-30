// Generates the SVG product images and banner art used by index.html.
// Run: node scripts/generate-assets.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = (p, s) => {
  mkdirSync(dirname(join(root, p)), { recursive: true });
  writeFileSync(join(root, p), s.trim() + "\n");
};

// ---------- shared defs ----------
const defs = `
<defs>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#8a6420"/>
    <stop offset=".28" stop-color="#e9c87a"/>
    <stop offset=".5" stop-color="#b8893b"/>
    <stop offset=".72" stop-color="#f7e4b0"/>
    <stop offset="1" stop-color="#9c7228"/>
  </linearGradient>
  <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f7e4b0"/>
    <stop offset=".45" stop-color="#c99a45"/>
    <stop offset="1" stop-color="#8a6420"/>
  </linearGradient>
  <linearGradient id="emerald" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#5fe0ae"/>
    <stop offset=".45" stop-color="#11805f"/>
    <stop offset="1" stop-color="#063d2e"/>
  </linearGradient>
  <linearGradient id="sapphire" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#9dbcff"/>
    <stop offset=".5" stop-color="#2a4fb8"/>
    <stop offset="1" stop-color="#0f1f5c"/>
  </linearGradient>
  <linearGradient id="ruby" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ff9aa8"/>
    <stop offset=".5" stop-color="#c0183a"/>
    <stop offset="1" stop-color="#5e0619"/>
  </linearGradient>
  <radialGradient id="crystal" cx=".35" cy=".3" r=".8">
    <stop offset="0" stop-color="#ffffff"/>
    <stop offset=".4" stop-color="#dce7f5"/>
    <stop offset="1" stop-color="#6f86a6"/>
  </radialGradient>
  <radialGradient id="pearl" cx=".35" cy=".3" r=".85">
    <stop offset="0" stop-color="#ffffff"/>
    <stop offset=".55" stop-color="#f1e9df"/>
    <stop offset="1" stop-color="#c9b9a6"/>
  </radialGradient>
  <radialGradient id="glow" cx=".5" cy=".42" r=".6">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".85"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="drop" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#5b4323" flood-opacity=".22"/>
  </filter>
</defs>`;

const sparkle = (x, y, s = 1, o = 0.9) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0-18C2-6 6-2 18 0 6 2 2 6 0 18-2 6-6 2-18 0-6-2-2-6 0-18Z" fill="#fff" opacity="${o}"/>`;

const shadow = (cx, cy, rx, ry = 16) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#6b5130" opacity=".18" filter="url(#soft)"/>`;

const facet = (d, fill) =>
  `<path d="${d}" fill="url(#${fill})"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>`;

const chain = (d, w = 5) =>
  `<path d="${d}" fill="none" stroke="#8a6420" stroke-width="${w + 2}" stroke-linecap="round" opacity=".35"/>
   <path d="${d}" fill="none" stroke="url(#gold)" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${w * 1.6} ${w * 0.7}"/>`;

const teardrop = (x, y, s, gem = "emerald") => `
<g transform="translate(${x} ${y}) scale(${s})" filter="url(#drop)">
  <circle cx="0" cy="-14" r="12" fill="none" stroke="url(#gold)" stroke-width="7"/>
  <path d="M0 0C44 58 66 100 66 138A66 66 0 0 1-66 138C-66 100-44 58 0 0Z" fill="url(#gold)"/>
  <path d="M0 18C34 66 52 102 52 136A52 52 0 0 1-52 136C-52 102-34 66 0 18Z" fill="url(#${gem})"/>
  <path d="M0 18L0 188M-52 136L52 136M-30 80L30 180M30 80L-30 180" stroke="#fff" stroke-opacity=".22" stroke-width="2"/>
  <path d="M-20 70C-30 90-34 110-30 130" stroke="#fff" stroke-opacity=".7" stroke-width="7" stroke-linecap="round" fill="none"/>
</g>`;

const coin = (x, y, s, letter = "") => `
<g transform="translate(${x} ${y}) scale(${s})" filter="url(#drop)">
  <circle cx="0" cy="-10" r="10" fill="none" stroke="url(#gold)" stroke-width="6"/>
  <circle cx="0" cy="44" r="46" fill="url(#gold)"/>
  <circle cx="0" cy="44" r="38" fill="none" stroke="#8a6420" stroke-opacity=".35" stroke-width="2"/>
  ${letter ? `<text x="0" y="60" text-anchor="middle" font-family="Georgia, serif" font-size="46" font-style="italic" fill="#7a5418">${letter}</text>` : `<path d="M-14 30L0 16 14 30 0 72Z" fill="#fff" opacity=".5"/>`}
</g>`;

// Sapphire solitaire ring; sketch=true draws it as a dashed pencil outline.
const solitaire = (x, y, s, sketch = false) => {
  const st = sketch ? 'fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3" stroke-dasharray="10 7"' : "";
  return `<g transform="translate(${x} ${y}) scale(${s})"${sketch ? "" : ' filter="url(#drop)"'}>
    <ellipse cx="0" cy="140" rx="150" ry="118" ${sketch ? st : 'fill="none" stroke="url(#gold)" stroke-width="26"'}/>
    <path d="M-44 40L44 40 26 78-26 78Z" ${sketch ? st : 'fill="url(#goldV)"'}/>
    ${sketch ? "" : `<rect x="-52" y="-6" width="10" height="40" rx="5" fill="url(#goldV)" transform="rotate(-18 -47 14)"/>
    <rect x="42" y="-6" width="10" height="40" rx="5" fill="url(#goldV)" transform="rotate(18 47 14)"/>`}
    <ellipse cx="0" cy="8" rx="64" ry="46" ${sketch ? st : 'fill="url(#sapphire)"'}/>
    ${sketch ? "" : `<path d="M-64 8L64 8M0-38L0 54M-40-28L40 44M40-28L-40 44" stroke="#fff" stroke-opacity=".22" stroke-width="2"/>
    <ellipse cx="-22" cy="-10" rx="16" ry="9" fill="#fff" opacity=".55"/>
    <rect x="-8" y="-50" width="16" height="14" rx="5" fill="url(#goldV)"/>
    <rect x="-8" y="44" width="16" height="12" rx="5" fill="url(#goldV)"/>`}
  </g>`;
};

const pearl = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#pearl)" filter="url(#drop)"/>`;

// ---------- product scenes (600x750) ----------
const W = 600, H = 750;
const bg = (c1, c2) => `
<rect width="${W}" height="${H}" fill="${c1}"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<rect y="${H * 0.72}" width="${W}" height="${H * 0.28}" fill="${c2}" opacity=".55"/>`;

const products = {
  "dome-hoops": `
    ${shadow(300, 610, 210)}
    <g filter="url(#drop)">
      <ellipse cx="225" cy="380" rx="120" ry="150" fill="none" stroke="url(#gold)" stroke-width="46"/>
      <ellipse cx="225" cy="380" rx="120" ry="150" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="6" stroke-dasharray="140 800" stroke-dashoffset="-40"/>
      <ellipse cx="395" cy="400" rx="105" ry="135" fill="none" stroke="url(#gold)" stroke-width="42"/>
      <ellipse cx="395" cy="400" rx="105" ry="135" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-dasharray="120 800" stroke-dashoffset="-30"/>
    </g>
    ${sparkle(150, 250, 1.2)}${sparkle(470, 300, 0.8)}`,

  "emerald-pendant": `
    ${chain("M60 -10C90 260 200 380 300 392C400 380 510 260 540 -10", 5)}
    ${teardrop(300, 400, 1.15)}
    ${shadow(300, 690, 120, 12)}
    ${sparkle(380, 470, 1)}${sparkle(210, 520, 0.6)}`,

  "pearl-huggies": `
    ${shadow(300, 630, 190)}
    <g filter="url(#drop)">
      <circle cx="200" cy="300" r="62" fill="none" stroke="url(#gold)" stroke-width="24"/>
      <circle cx="400" cy="300" r="62" fill="none" stroke="url(#gold)" stroke-width="24"/>
    </g>
    <rect x="193" y="360" width="14" height="40" rx="6" fill="url(#goldV)"/>
    <rect x="393" y="360" width="14" height="40" rx="6" fill="url(#goldV)"/>
    ${pearl(200, 450, 62)}${pearl(400, 450, 62)}
    ${sparkle(172, 420, 0.7)}${sparkle(372, 420, 0.7)}`,

  "herringbone-chain": `
    <path d="M40 -10C80 300 190 470 300 478C410 470 520 300 560 -10" fill="none" stroke="#6b4c1a" stroke-width="40" opacity=".2" filter="url(#soft)"/>
    <path d="M40 -10C80 300 190 470 300 478C410 470 520 300 560 -10" fill="none" stroke="url(#gold)" stroke-width="30"/>
    <path d="M40 -10C80 300 190 470 300 478C410 470 520 300 560 -10" fill="none" stroke="#7a5418" stroke-opacity=".45" stroke-width="30" stroke-dasharray="2 7"/>
    <path d="M40 -10C80 300 190 470 300 478C410 470 520 300 560 -10" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="4" transform="translate(-6 -8)"/>
    ${shadow(300, 660, 160, 12)}
    ${sparkle(300, 520, 1.1)}${sparkle(130, 300, 0.7)}`,

  "signet-ring": `
    ${shadow(300, 640, 170)}
    <g filter="url(#drop)">
      <ellipse cx="300" cy="440" rx="150" ry="120" fill="none" stroke="url(#gold)" stroke-width="36"/>
      <ellipse cx="300" cy="280" rx="110" ry="84" fill="url(#goldV)"/>
      <ellipse cx="300" cy="276" rx="92" ry="68" fill="url(#gold)"/>
      <text x="300" y="304" text-anchor="middle" font-family="Georgia, serif" font-size="84" font-style="italic" fill="#7a5418" opacity=".85">A</text>
    </g>
    ${sparkle(410, 230, 1)}`,

  "stacking-rings": `
    ${shadow(300, 650, 190)}
    ${[
      [300, 250, "sapphire"],
      [300, 380, "emerald"],
      [300, 510, "ruby"],
    ]
      .map(
        ([x, y, g]) => `
      <g filter="url(#drop)">
        <ellipse cx="${x}" cy="${y}" rx="150" ry="52" fill="none" stroke="url(#gold)" stroke-width="16"/>
        <ellipse cx="${x}" cy="${y - 50}" rx="30" ry="22" fill="url(#gold)"/>
        <ellipse cx="${x}" cy="${y - 54}" rx="22" ry="16" fill="url(#${g})"/>
        <ellipse cx="${x - 7}" cy="${y - 59}" rx="6" ry="4" fill="#fff" opacity=".7"/>
      </g>`
      )
      .join("")}
    ${sparkle(360, 190, 0.8)}`,

  "tennis-bracelet": (() => {
    const n = 30, cx = 300, cy = 380, rx = 200, ry = 150;
    let s = shadow(300, 600, 220);
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="url(#gold)" stroke-width="10"/>`;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
      const r = 17 + 5 * Math.sin(a);
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r + 4).toFixed(1)}" fill="url(#gold)"/>`;
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="url(#crystal)"/>`;
      s += `<path d="M${(x - r * 0.5).toFixed(1)} ${y.toFixed(1)}L${(x + r * 0.5).toFixed(1)} ${y.toFixed(1)}M${x.toFixed(1)} ${(y - r * 0.5).toFixed(1)}L${x.toFixed(1)} ${(y + r * 0.5).toFixed(1)}" stroke="#fff" stroke-width="1.5" opacity=".8"/>`;
    }
    return s + sparkle(470, 270, 1.2) + sparkle(160, 470, 0.8);
  })(),

  "initial-necklace": `
    ${chain("M90 -10C120 250 210 360 300 368C390 360 480 250 510 -10", 3.5)}
    ${coin(300, 380, 1.5, "M")}
    <circle cx="336" cy="425" r="9" fill="url(#sapphire)"/>
    ${shadow(300, 650, 110, 10)}
    ${sparkle(380, 400, 0.9)}`,

  "ear-cuff": `
    ${shadow(300, 620, 150)}
    <g filter="url(#drop)">
      <path d="M220 470C170 360 220 230 330 220C420 212 470 300 440 380" fill="none" stroke="url(#gold)" stroke-width="22" stroke-linecap="round"/>
      <path d="M250 440C215 360 250 270 330 262C392 256 425 312 408 364" fill="none" stroke="url(#gold)" stroke-width="12" stroke-linecap="round"/>
    </g>
    ${[[208, 420], [205, 360], [222, 302], [258, 256], [305, 228], [360, 222], [410, 246], [440, 300]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="url(#gold)"/><circle cx="${x}" cy="${y}" r="9.5" fill="url(#crystal)"/>`)
      .join("")}
    ${sparkle(460, 220, 1)}${sparkle(190, 250, 0.6)}`,

  "layered-set": `
    ${chain("M150 -10C170 150 230 220 300 224C370 220 430 150 450 -10", 3)}
    ${chain("M100 -10C130 260 210 350 300 356C390 350 470 260 500 -10", 4)}
    ${chain("M55 -10C90 360 190 480 300 486C410 480 510 360 545 -10", 3)}
    ${pearl(300, 238, 18)}
    ${coin(300, 366, 0.95)}
    ${teardrop(300, 494, 0.7, "emerald")}
    ${sparkle(360, 250, 0.7)}${sparkle(230, 560, 0.7)}`,

  "charm-bracelet": `
    ${shadow(300, 620, 210)}
    ${chain("M110 360C110 220 490 220 490 360C490 470 110 470 110 360Z", 7)}
    <g filter="url(#drop)">
      <path transform="translate(220 470)" d="M0 12C0-6 22-10 30 6 38-10 60-6 60 12 60 34 30 52 30 52S0 34 0 12Z" fill="url(#gold)"/>
      <path transform="translate(330 480)" d="M28 0L36 20 58 22 41 36 46 58 28 46 10 58 15 36-2 22 20 20Z" fill="url(#gold)"/>
      <circle cx="420" cy="450" r="20" fill="url(#gold)"/><circle cx="420" cy="450" r="14" fill="url(#ruby)"/>
      <circle cx="160" cy="440" r="20" fill="url(#pearl)"/>
    </g>
    ${sparkle(360, 250, 1)}`,

  "pearl-choker": (() => {
    const bez = (t, a, b, c, d) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d;
    let s = chain("M80 -10C110 280 200 400 300 408C400 400 490 280 520 -10", 3.5);
    for (const t of [0.3, 0.38, 0.46, 0.54, 0.62, 0.7]) {
      const x = bez(t, 80, 110, 200, 300), y = bez(t, -10, 280, 400, 408);
      const x2 = bez(t, 520, 490, 400, 300);
      s += pearl(x.toFixed(1), y.toFixed(1), 15) + pearl(x2.toFixed(1), y.toFixed(1), 15);
    }
    return s + pearl(300, 408, 22) + shadow(300, 660, 120, 10) + sparkle(330, 380, 0.8);
  })(),

  "custom-ring": `
    ${shadow(300, 650, 190)}
    ${solitaire(300, 280, 1.15)}
    ${sparkle(400, 230, 1.2)}${sparkle(190, 330, 0.7)}`,

  "bangle-duo": `
    ${shadow(300, 640, 220)}
    <g filter="url(#drop)">
      <ellipse cx="260" cy="380" rx="170" ry="120" fill="none" stroke="url(#gold)" stroke-width="30"/>
      <ellipse cx="345" cy="410" rx="170" ry="120" fill="none" stroke="url(#gold)" stroke-width="16"/>
      <ellipse cx="260" cy="380" rx="170" ry="120" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-dasharray="160 900" stroke-dashoffset="-60"/>
    </g>
    ${sparkle(150, 300, 1)}${sparkle(470, 500, 0.7)}`,
};

// ---------- loose gemstones ----------
// [light, mid, dark] per stone
const GEMS = {
  sapphire: ["#c9dcff", "#2f58c9", "#0b1b5c"],
  padparadscha: ["#ffe2d4", "#f0876c", "#9c3a33"],
  pink: ["#ffd9ea", "#e2508f", "#7e1541"],
  yellow: ["#fff4bd", "#f0bf2a", "#9c6606"],
  ruby: ["#ffc4cd", "#c8163c", "#560316"],
  emerald: ["#c4f5de", "#138a62", "#04382a"],
};
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => "#" + hexRgb(a).map((v, i) => Math.round(v + (hexRgb(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
const shade = ([lt, mid, dk], v) => (v > 0 ? mix(mid, lt, Math.min(v, 1)) : mix(mid, dk, Math.min(-v, 1)));
const poly = pts => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function outline(shape, n) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI - Math.PI / 2;
    let x = Math.cos(t), y = Math.sin(t);
    if (shape === "oval") y *= 0.78;
    if (shape === "cushion") {
      const e = 0.6;
      x = Math.sign(x) * Math.abs(x) ** e; y = Math.sign(y) * Math.abs(y) ** e * 0.92;
    }
    if (shape === "pear") {
      const k = (1 - Math.sin(t)) / 2;          // 1 at the top point, 0 at the bottom
      x *= 1 - 0.62 * k ** 1.6; y *= 1.18;
    }
    pts.push([x, y]);
  }
  return pts;
}
const octagon = (w = 1, h = 0.74, c = 0.24) => [[-w + c, -h], [w - c, -h], [w, -h + c], [w, h - c], [w - c, h], [-w + c, h], [-w, h - c], [-w, -h + c]];

function gem(cx, cy, s, shape, kind) {
  const col = GEMS[kind];
  const light = Math.atan2(-0.75, -0.65);
  const base = (shape === "emerald" ? octagon() : outline(shape, 16)).map(([x, y]) => [cx + x * s, cy + y * s]);
  const ring = k => base.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
  const quads = (A, B, flip, bias) => A.map((p, i) => {
    const j = (i + 1) % A.length;
    const mx = (p[0] + A[j][0]) / 2 - cx, my = (p[1] + A[j][1]) / 2 - cy;
    let v = Math.cos(Math.atan2(my, mx) - light) * 0.85 * flip + (i % 2 ? 0.22 : -0.22) + bias;
    return `<polygon points="${poly([p, A[j], B[j], B[i]])}" fill="${shade(col, v)}"/>`;
  }).join("");
  let g = `<g filter="url(#drop)"><polygon points="${poly(base)}" fill="${col[2]}"/>`;
  if (shape === "emerald") {
    const rs = [1, 0.84, 0.68, 0.52].map(ring);
    g += quads(rs[0], rs[1], 1, 0) + quads(rs[1], rs[2], -0.8, 0.1) + quads(rs[2], rs[3], 0.6, 0.2);
    g += `<polygon points="${poly(rs[3])}" fill="${mix(col[1], col[0], 0.3)}"/>`;
  } else {
    const M = ring(0.78), T = ring(0.5);
    g += quads(base, M, 1, 0) + quads(M, T, -0.7, 0.1);
    g += `<polygon points="${poly(T)}" fill="${mix(col[1], col[0], 0.32)}"/>`;
  }
  g += `<polygon points="${poly(base)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="${Math.max(1.5, s / 60)}"/>`;
  g += `<ellipse cx="${cx - s * 0.32}" cy="${cy - s * 0.3}" rx="${s * 0.16}" ry="${s * 0.07}" transform="rotate(-30 ${cx - s * 0.32} ${cy - s * 0.3})" fill="#fff" opacity=".55"/></g>`;
  return g;
}

const gemProducts = {
  "gem-blue-sapphire": ["oval", "sapphire"],
  "gem-padparadscha": ["oval", "padparadscha"],
  "gem-pink-sapphire": ["round", "pink"],
  "gem-yellow-sapphire": ["pear", "yellow"],
  "gem-ruby": ["cushion", "ruby"],
  "gem-emerald": ["emerald", "emerald"],
};
for (const [name, [shape, kind]] of Object.entries(gemProducts)) {
  products[name] = `${shadow(300, 600, 150, 14)}${gem(300, 360, shape === "round" ? 150 : 165, shape, kind)}${sparkle(420, 250, 1.1)}${sparkle(190, 470, 0.6)}`;
}

// Brand-toned backgrounds: white fading to blush (#eedcdf) and pink (#ffc2c2).
const TONE_A = ["#fdf8f8", "#f3e4e7"], TONE_B = ["#fff5f5", "#f8dede"];
const tones = Object.fromEntries(Object.keys(products).map((k, i) => [k, i % 2 ? TONE_B : TONE_A]));

for (const [name, body] of Object.entries(products)) {
  const [c1, c2] = tones[name];
  out(
    `assets/products/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs}${bg(c1, c2)}<g transform="translate(300 380) scale(1.14) translate(-300 -380)">${body}</g></svg>`
  );
}

// ---------- collection tiles (800x1000, copy overlays the bottom third) ----------
const svg = (w, h, body, extraDefs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${defs}<defs>${extraDefs}</defs>${body}</svg>`;
const grad = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const place = (body, x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${body}</g>`;

const giftBox = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#drop)">
  <rect x="-180" y="0" width="360" height="250" fill="#641946"/>
  <rect x="-200" y="-50" width="400" height="70" fill="#7a2458"/>
  <rect x="-20" y="-50" width="40" height="300" fill="url(#goldV)"/>
  <path d="M0-48C-60-130-140-110-110-60-90-30-30-42 0-48ZM0-48C60-130 140-110 110-60 90-30 30-42 0-48Z" fill="url(#gold)"/>
</g>`;

out("assets/banners/col-premium.svg", svg(800, 1000, `
  <rect width="800" height="1000" fill="url(#cp)"/>
  <circle cx="400" cy="400" r="300" fill="#fff" opacity=".35"/>
  ${place(products["pearl-huggies"], 60, -20, 1.14)}
  ${sparkle(640, 220, 1.4)}${sparkle(150, 560, 0.9)}`, grad("cp", "#f6e6e8", "#ffc2c2")));

out("assets/banners/col-gold.svg", svg(800, 1000, `
  <rect width="800" height="1000" fill="url(#cg)"/>
  <circle cx="400" cy="400" r="300" fill="#ffc2c2" opacity=".08"/>
  ${place(products["bangle-duo"], 70, -10, 1.1)}
  ${sparkle(630, 230, 1.4)}${sparkle(170, 590, 0.9)}`, grad("cg", "#7a2458", "#3c0e2a")));

out("assets/banners/col-gems.svg", svg(800, 1000, `
  <rect width="800" height="1000" fill="url(#cm)"/>
  <circle cx="400" cy="400" r="300" fill="#fff" opacity=".6"/>
  ${shadow(400, 620, 260, 18)}
  ${gem(400, 390, 140, "oval", "sapphire")}
  ${gem(620, 220, 62, "oval", "padparadscha")}
  ${gem(190, 230, 58, "round", "pink")}
  ${gem(200, 560, 74, "cushion", "ruby")}
  ${gem(610, 570, 78, "emerald", "emerald")}
  ${sparkle(470, 250, 1.2)}${sparkle(330, 590, 0.7)}`, grad("cm", "#ffffff", "#eedcdf")));

// ---------- section banners (1080x720, art on the right, copy on the left) ----------
out("assets/banners/gifting.svg", svg(1080, 720, `
  <rect width="1080" height="720" fill="url(#bgf)"/>
  <circle cx="800" cy="380" r="280" fill="#fff" opacity=".35"/>
  ${shadow(800, 640, 230, 18)}
  ${giftBox(800, 370, 0.95)}
  ${chain("M560 330C600 470 520 560 470 620", 4)}
  ${pearl(470, 632, 24)}
  ${sparkle(640, 200, 1.3)}${sparkle(990, 250, 0.9)}`, grad("bgf", "#ffd6d6", "#eedcdf")));

out("assets/banners/gold.svg", svg(1080, 720, `
  <rect width="1080" height="720" fill="url(#bgd)"/>
  <circle cx="800" cy="360" r="300" fill="#ffc2c2" opacity=".08"/>
  ${place(products["bangle-duo"], 500, -20, 1.0)}
  ${sparkle(640, 150, 1.3)}${sparkle(1000, 560, 0.9)}`, grad("bgd", "#7a2458", "#3c0e2a")));

out("assets/banners/gems.svg", svg(1080, 720, `
  <rect width="1080" height="720" fill="url(#bgm)"/>
  <circle cx="800" cy="360" r="290" fill="#fff" opacity=".6"/>
  <g transform="translate(840 350) scale(.86) translate(-800 -340)">
  ${shadow(800, 600, 230, 16)}
  ${gem(800, 340, 130, "oval", "sapphire")}
  ${gem(980, 190, 55, "oval", "padparadscha")}
  ${gem(620, 200, 52, "round", "pink")}
  ${gem(640, 520, 64, "cushion", "ruby")}
  ${gem(980, 520, 66, "emerald", "emerald")}
  ${sparkle(880, 210, 1.1)}
  </g>`, grad("bgm", "#ffffff", "#eedcdf")));

// Custom made: sketch becoming a finished ring, on deep plum.
out("assets/banners/custom.svg", svg(1080, 720, `
  <rect width="1080" height="720" fill="url(#ink)"/>
  <rect width="1080" height="720" fill="url(#grid)" mask="url(#gm)"/>
  <circle cx="820" cy="370" r="260" fill="#ffc2c2" opacity=".08"/>
  ${solitaire(720, 150, 1.05, true)}
  ${shadow(860, 610, 170, 14)}
  ${solitaire(860, 230, 1.1)}
  <g transform="translate(700 640) rotate(-8)">
    <rect x="0" y="-9" width="230" height="18" rx="3" fill="#d9b56a"/>
    <rect x="0" y="-9" width="230" height="6" fill="#fff" opacity=".25"/>
    <rect x="200" y="-9" width="30" height="18" fill="#8a6420"/>
    <path d="M0-9L-34 0 0 9Z" fill="#e9d3a8"/><path d="M-22-3.5L-34 0-22 3.5Z" fill="#3c0e2a"/>
  </g>
  ${sparkle(990, 170, 1.2)}${sparkle(760, 520, 0.7)}`,
  `${grad("ink", "#5a153f", "#2e0a20")}
   <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="1"/></pattern>
   <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0"><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#fff" stop-opacity="1"/></linearGradient>
   <mask id="gm"><rect width="1080" height="720" fill="url(#fade)"/></mask>`));

console.log("Assets generated.");

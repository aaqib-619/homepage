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

  "bangle-duo": `
    ${shadow(300, 640, 220)}
    <g filter="url(#drop)">
      <ellipse cx="260" cy="380" rx="170" ry="120" fill="none" stroke="url(#gold)" stroke-width="30"/>
      <ellipse cx="345" cy="410" rx="170" ry="120" fill="none" stroke="url(#gold)" stroke-width="16"/>
      <ellipse cx="260" cy="380" rx="170" ry="120" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-dasharray="160 900" stroke-dashoffset="-60"/>
    </g>
    ${sparkle(150, 300, 1)}${sparkle(470, 500, 0.7)}`,
};

const tones = {
  "dome-hoops": ["#f3ece2", "#e8dccb"],
  "emerald-pendant": ["#eef1ec", "#dde6de"],
  "pearl-huggies": ["#f5ebe6", "#ead8cf"],
  "herringbone-chain": ["#f3ece2", "#e8dccb"],
  "signet-ring": ["#f1ede8", "#e3dbd0"],
  "stacking-rings": ["#efeef3", "#dedbe8"],
  "tennis-bracelet": ["#eef0f3", "#dde2e8"],
  "initial-necklace": ["#f5ebe6", "#ead8cf"],
  "ear-cuff": ["#f3ece2", "#e8dccb"],
  "layered-set": ["#eef1ec", "#dde6de"],
  "charm-bracelet": ["#f5ebe6", "#ead8cf"],
  "bangle-duo": ["#f1ede8", "#e3dbd0"],
  "pearl-choker": ["#f3ece2", "#e8dccb"],
};

for (const [name, body] of Object.entries(products)) {
  const [c1, c2] = tones[name];
  out(
    `assets/products/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs}${bg(c1, c2)}<g transform="translate(300 380) scale(1.14) translate(-300 -380)">${body}</g></svg>`
  );
}

// ---------- banners ----------

// Hero: 1080x1440 (3:4). Neckline with layered necklaces; dark top leaves space for overlay copy.
out(
  "assets/banners/hero.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440" width="1080" height="1440">${defs}
  <defs>
    <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e9d6c2"/><stop offset="1" stop-color="#cfae8f"/>
    </linearGradient>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#a86d4c"/><stop offset=".5" stop-color="#c58a66"/><stop offset="1" stop-color="#b87c59"/>
    </linearGradient>
    <radialGradient id="skinLight" cx=".5" cy=".55" r=".5">
      <stop offset="0" stop-color="#e6b08c" stop-opacity=".7"/><stop offset="1" stop-color="#e6b08c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#123f35"/><stop offset="1" stop-color="#0a2620"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1440" fill="url(#heroBg)"/>
  <circle cx="860" cy="180" r="260" fill="#fff" opacity=".18"/>
  <g transform="translate(0 -220)">
  <path d="M395 0L395 300C395 450 230 520 0 580L0 1700 1080 1700 1080 580C850 520 685 450 685 300L685 0Z" fill="url(#skin)"/>
  <ellipse cx="540" cy="720" rx="420" ry="300" fill="url(#skinLight)"/>
  <path d="M395 0L395 300C395 360 370 400 330 430" fill="none" stroke="#8a5537" stroke-opacity=".35" stroke-width="10"/>
  <path d="M685 0L685 300C685 360 710 400 750 430" fill="none" stroke="#8a5537" stroke-opacity=".35" stroke-width="10"/>
  <path d="M260 600C360 580 450 600 510 640M820 600C720 580 630 600 570 640" fill="none" stroke="#8a5537" stroke-opacity=".28" stroke-width="8" stroke-linecap="round"/>
  <!-- necklaces -->
  ${chain("M398 300C420 420 660 420 682 300", 6)}
  ${pearl(540, 392, 16)}
  ${chain("M330 430C380 640 700 640 750 430", 7)}
  ${coin(540, 588, 1.2)}
  ${chain("M250 520C330 860 750 860 830 520", 6)}
  ${teardrop(540, 772, 0.95)}
  ${sparkle(640, 820, 1.6)}${sparkle(470, 610, 1)}${sparkle(610, 400, 0.8)}
  <!-- top -->
  <path d="M0 880C200 900 320 1080 540 1090C760 1080 880 900 1080 880L1080 1700 0 1700Z" fill="url(#top)"/>
  <path d="M0 880C200 900 320 1080 540 1090C760 1080 880 900 1080 880" fill="none" stroke="#1e5a4b" stroke-width="6"/>
  </g>
</svg>`
);

// Promo "stack" banner art: 1080x720, art on the right, plain emerald area left for copy.
out(
  "assets/banners/stack.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 720" width="1080" height="720">${defs}
  <defs><linearGradient id="em" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f4d3f"/><stop offset="1" stop-color="#082e26"/></linearGradient></defs>
  <rect width="1080" height="720" fill="url(#em)"/>
  <circle cx="820" cy="360" r="300" fill="#1c6b58" opacity=".35"/>
  <circle cx="820" cy="360" r="210" fill="#1c6b58" opacity=".35"/>
  <g transform="translate(560 40) scale(.9)">
    ${[[300, 250, "sapphire"], [300, 380, "emerald"], [300, 510, "ruby"]]
      .map(
        ([x, y, g]) => `
      <g filter="url(#drop)">
        <ellipse cx="${x}" cy="${y}" rx="150" ry="52" fill="none" stroke="url(#gold)" stroke-width="18"/>
        <ellipse cx="${x}" cy="${y - 50}" rx="32" ry="24" fill="url(#gold)"/>
        <ellipse cx="${x}" cy="${y - 54}" rx="24" ry="17" fill="url(#${g})"/>
        <ellipse cx="${x - 7}" cy="${y - 59}" rx="6" ry="4" fill="#fff" opacity=".7"/>
      </g>`
      )
      .join("")}
  </g>
  ${sparkle(700, 140, 1.4)}${sparkle(1000, 560, 1)}${sparkle(640, 600, 0.7)}
</svg>`
);

// Look banner: 1080x1080, close-up of layered stack used for "Shop the look" hotspots.
out(
  "assets/banners/look.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">${defs}
  <defs>
    <linearGradient id="lk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1e1d3"/><stop offset="1" stop-color="#d9b99c"/></linearGradient>
    <linearGradient id="sk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9a584"/><stop offset="1" stop-color="#c48d6b"/></linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#lk)"/>
  <path d="M330 0L330 140C330 260 180 320 0 360L0 1080 1080 1080 1080 360C900 320 750 260 750 140L750 0Z" fill="url(#sk2)"/>
  <path d="M0 840C220 850 330 1000 540 1010C750 1000 860 850 1080 840L1080 1080 0 1080Z" fill="#f4eee6"/>
  ${chain("M335 150C360 300 720 300 745 150", 6)}
  ${pearl(540, 262, 20)}
  ${chain("M250 300C320 560 760 560 830 300", 7)}
  ${coin(540, 490, 1.3, "A")}
  ${chain("M160 350C260 800 820 800 920 350", 6)}
  ${teardrop(540, 700, 0.9)}
  ${sparkle(660, 760, 1.4)}${sparkle(420, 520, 1)}
</svg>`
);

// Gift banner: 1080x720, blush with gift box.
out(
  "assets/banners/gift.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 720" width="1080" height="720">${defs}
  <defs><linearGradient id="bl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e2da"/><stop offset="1" stop-color="#e9c5b8"/></linearGradient></defs>
  <rect width="1080" height="720" fill="url(#bl)"/>
  <circle cx="800" cy="380" r="280" fill="#fff" opacity=".35"/>
  ${shadow(800, 620, 230, 18)}
  <g filter="url(#drop)">
    <rect x="620" y="360" width="360" height="250" rx="10" fill="#0f4d3f"/>
    <rect x="600" y="310" width="400" height="70" rx="10" fill="#146050"/>
    <rect x="780" y="310" width="40" height="300" fill="url(#goldV)"/>
    <path d="M800 312C740 230 660 250 690 300 710 330 770 318 800 312ZM800 312C860 230 940 250 910 300 890 330 830 318 800 312Z" fill="url(#gold)"/>
  </g>
  ${chain("M560 330C600 470 520 560 470 620", 4)}
  ${teardrop(468, 610, 0.5)}
  ${sparkle(640, 200, 1.3)}${sparkle(990, 250, 0.9)}${sparkle(560, 560, 0.7)}
</svg>`
);

// Waterproof banner: 1080x720, aqua-cream with droplets and hoops.
out(
  "assets/banners/waterproof.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 720" width="1080" height="720">${defs}
  <defs>
    <linearGradient id="aq" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3eeec"/><stop offset="1" stop-color="#c3dbd7"/></linearGradient>
    <radialGradient id="drop2" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".6" stop-color="#d8ecea" stop-opacity=".55"/><stop offset="1" stop-color="#8fbab5" stop-opacity=".6"/></radialGradient>
  </defs>
  <rect width="1080" height="720" fill="url(#aq)"/>
  ${shadow(800, 600, 220, 18)}
  <g filter="url(#drop)">
    <ellipse cx="730" cy="370" rx="130" ry="165" fill="none" stroke="url(#gold)" stroke-width="48"/>
    <ellipse cx="900" cy="395" rx="112" ry="145" fill="none" stroke="url(#gold)" stroke-width="42"/>
  </g>
  ${[[640, 250, 22], [760, 190, 14], [880, 290, 18], [960, 480, 12], [700, 520, 16], [820, 560, 10], [600, 420, 11], [1000, 200, 16]]
    .map(([x, y, r]) => `<path transform="translate(${x} ${y})" d="M0 ${-r * 1.6}C${r * 0.6} ${-r * 0.6} ${r} 0 ${r} ${r * 0.35}A${r} ${r} 0 0 1 ${-r} ${r * 0.35}C${-r} 0 ${-r * 0.6} ${-r * 0.6} 0 ${-r * 1.6}Z" fill="url(#drop2)" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>`)
    .join("")}
</svg>`
);

console.log("Assets generated.");

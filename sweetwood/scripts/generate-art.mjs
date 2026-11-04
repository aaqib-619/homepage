// Generates the Sweet Wood placeholder artwork as SVG.
// Run: node sweetwood/scripts/generate-art.mjs
// Every colour comes from PALETTE so the art can be re-tinted to the final brand kit in one place.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'art');
mkdirSync(OUT, { recursive: true });

export const PALETTE = {
  bark: '#5A2614',      // deep cinnamon bark
  cinnamon: '#A64B24',  // primary brand cinnamon
  spice: '#D3874A',     // warm highlight
  quill: '#C9743F',
  quillLight: '#E2A06A',
  cream: '#FBF5EC',
  sand: '#F2E5D2',
  dune: '#E7D3B8',
  forest: '#1F3A2B',
  leaf: '#4D7A4F',
  leafLight: '#7FA77A',
  newLeaf: '#B8553A',   // young cinnamon leaves flush red
  hibiscus: '#A8224A',
  hibiscusLight: '#D9577A',
  passion: '#E39B2F',
  passionPulp: '#F2C14E',
  passionRind: '#5B2A4A',
  ink: '#2A1A12',
  glass: '#F7EEE2',
};
const P = PALETTE;

const FLAVOURS = {
  original: { name: 'Pure Ceylon Cinnamon', short: 'ORIGINAL', label: P.cinnamon, band: P.bark, liquid: '#B8682F', tint: P.sand },
  hibiscus: { name: 'Cinnamon + Hibiscus', short: 'HIBISCUS', label: P.hibiscus, band: '#6E1230', liquid: '#9C2C3E', tint: '#F4DCDD' },
  passion:  { name: 'Cinnamon + Passion Fruit', short: 'PASSION FRUIT', label: P.passion, band: '#8A4B12', liquid: '#D9902F', tint: '#F8E6C4' },
};

const svg = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
  `<defs>${defs()}</defs>` +
  (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '') +
  body + `</svg>`;

function defs() {
  return `
  <linearGradient id="glassShade" x1="0" x2="1">
    <stop offset="0" stop-color="#000" stop-opacity=".18"/>
    <stop offset=".18" stop-color="#fff" stop-opacity=".35"/>
    <stop offset=".32" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".8" stop-color="#000" stop-opacity=".06"/>
    <stop offset="1" stop-color="#000" stop-opacity=".22"/>
  </linearGradient>
  <linearGradient id="capShade" x1="0" x2="1">
    <stop offset="0" stop-color="#000" stop-opacity=".35"/>
    <stop offset=".25" stop-color="#fff" stop-opacity=".18"/>
    <stop offset=".5" stop-color="#fff" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".35"/>
  </linearGradient>
  <linearGradient id="quillShade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".28"/>
    <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".28"/>
  </linearGradient>
  <radialGradient id="softShadow">
    <stop offset="0" stop-color="${P.bark}" stop-opacity=".28"/>
    <stop offset="1" stop-color="${P.bark}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="sunGlow">
    <stop offset="0" stop-color="#FFE3B0" stop-opacity=".95"/>
    <stop offset="1" stop-color="#FFE3B0" stop-opacity="0"/>
  </radialGradient>
  <pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r=".6" fill="${P.bark}" opacity=".05"/>
    <circle cx="4" cy="4" r=".5" fill="${P.bark}" opacity=".04"/>
  </pattern>`;
}

/* ---------- Elements ---------- */

// A 60ml shot bottle. (x, y) is the bottom centre. h is total height.
function bottle(f, x, y, h = 520) {
  const F = FLAVOURS[f];
  const s = h / 520;
  const w = 168 * s, bodyH = 360 * s, shoulder = 46 * s, neckW = 76 * s, neckH = 34 * s, capH = 80 * s, capW = 92 * s;
  const left = x - w / 2, top = y - bodyH;
  const r = 22 * s;
  const shoulderTop = top - shoulder;
  const neckL = x - neckW / 2, neckR = x + neckW / 2;
  const glassPath = `M${left} ${y - r} L${left} ${top} C${left} ${shoulderTop + 10 * s} ${neckL} ${shoulderTop + 6 * s} ${neckL} ${shoulderTop} L${neckL} ${shoulderTop - neckH} L${neckR} ${shoulderTop - neckH} L${neckR} ${shoulderTop} C${neckR} ${shoulderTop + 6 * s} ${left + w} ${shoulderTop + 10 * s} ${left + w} ${top} L${left + w} ${y - r} Q${left + w} ${y} ${left + w - r} ${y} L${left + r} ${y} Q${left} ${y} ${left} ${y - r} Z`;
  const labelTop = top + 34 * s, labelH = 250 * s;
  const capTop = shoulderTop - neckH - capH + 6 * s;
  const fs = (n) => (n * s).toFixed(1);
  return `
  <g>
    <ellipse cx="${x}" cy="${y + 4 * s}" rx="${w * 0.78}" ry="${16 * s}" fill="url(#softShadow)"/>
    <path d="${glassPath}" fill="${F.liquid}"/>
    <path d="${glassPath}" fill="url(#glassShade)"/>
    <rect x="${left}" y="${labelTop}" width="${w}" height="${labelH}" fill="${P.cream}"/>
    <rect x="${left}" y="${labelTop}" width="${w}" height="${16 * s}" fill="${F.label}"/>
    <rect x="${left}" y="${labelTop + labelH - 54 * s}" width="${w}" height="${54 * s}" fill="${F.label}"/>
    <g fill="${F.band}" opacity=".9">
      ${quillIcon(x, labelTop + 58 * s, 0.55 * s, F.label)}
    </g>
    <text x="${x}" y="${labelTop + 118 * s}" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="600" font-size="${fs(30)}" letter-spacing="${fs(1)}" fill="${P.bark}">Sweet</text>
    <text x="${x}" y="${labelTop + 150 * s}" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="600" font-size="${fs(30)}" letter-spacing="${fs(1)}" fill="${P.bark}">Wood</text>
    <text x="${x}" y="${labelTop + 176 * s}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="600" font-size="${fs(10)}" letter-spacing="${fs(2.4)}" fill="${P.cinnamon}">CEYLON CINNAMON</text>
    <text x="${x}" y="${labelTop + 190 * s}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="600" font-size="${fs(10)}" letter-spacing="${fs(2.4)}" fill="${P.cinnamon}">SHOT</text>
    <text x="${x}" y="${labelTop + labelH - 22 * s}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="${fs(f === 'passion' ? 11 : 12.5)}" letter-spacing="${fs(2)}" fill="${P.cream}">${F.short}</text>
    <rect x="${left}" y="${labelTop}" width="${w}" height="${labelH}" fill="url(#glassShade)" opacity=".55"/>
    <rect x="${x - capW / 2}" y="${capTop}" width="${capW}" height="${capH}" rx="${8 * s}" fill="${P.bark}"/>
    <g stroke="#000" stroke-opacity=".18" stroke-width="${1.4 * s}">
      ${Array.from({ length: 13 }, (_, i) => { const lx = x - capW / 2 + 8 * s + i * (capW - 16 * s) / 12; return `<line x1="${lx}" y1="${capTop + 8 * s}" x2="${lx}" y2="${capTop + capH - 8 * s}"/>`; }).join('')}
    </g>
    <rect x="${x - capW / 2}" y="${capTop}" width="${capW}" height="${capH}" rx="${8 * s}" fill="url(#capShade)"/>
    <rect x="${x - capW / 2 - 2 * s}" y="${capTop + capH - 12 * s}" width="${capW + 4 * s}" height="${12 * s}" rx="${3 * s}" fill="${P.bark}"/>
  </g>`;
}

// Small quill mark used on labels and as a logo-like glyph
function quillIcon(cx, cy, s = 1, accent = P.cinnamon) {
  return `<g transform="translate(${cx} ${cy}) scale(${s}) rotate(-28)">
    <rect x="-46" y="-9" width="92" height="18" rx="9" fill="${accent}"/>
    <rect x="-46" y="-9" width="92" height="18" rx="9" fill="url(#quillShade)"/>
    <path d="M-30 -6 L-30 6 M-4 -6 L-4 6 M22 -6 L22 6" stroke="${P.bark}" stroke-opacity=".35" stroke-width="2"/>
  </g>`;
}

// A Ceylon cinnamon quill lying at angle. Length l, thickness t.
function quill(x, y, l, t, rot = 0, tone = P.quill) {
  const r = t / 2;
  const joints = [0.22, 0.48, 0.74].map(p => -l / 2 + l * p);
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <ellipse cx="0" cy="${t * 0.85}" rx="${l * 0.52}" ry="${t * 0.4}" fill="url(#softShadow)"/>
    <rect x="${-l / 2}" y="${-r}" width="${l}" height="${t}" rx="${r * 0.6}" fill="${tone}"/>
    <g stroke="${P.bark}" stroke-opacity=".22" stroke-width="${Math.max(1, t * 0.05)}" fill="none">
      ${Array.from({ length: 6 }, (_, i) => { const yy = -r + t * (0.18 + i * 0.13); return `<path d="M${-l / 2 + r * 0.6} ${yy} Q0 ${yy + (i % 2 ? 1.5 : -1.5)} ${l / 2 - r * 0.6} ${yy}"/>`; }).join('')}
    </g>
    ${joints.map(jx => `<rect x="${jx - t * 0.06}" y="${-r}" width="${t * 0.12}" height="${t}" fill="${P.bark}" opacity=".22"/>`).join('')}
    <rect x="${-l / 2}" y="${-r}" width="${l}" height="${t}" rx="${r * 0.6}" fill="url(#quillShade)"/>
    ${ceylonEnd(l / 2 - r * 0.2, 0, r, tone)}
  </g>`;
}

// Cross-section of a Ceylon quill: many paper-thin layers rolled into a spiral
function ceylonEnd(cx, cy, r, tone = P.quill) {
  let d = '';
  const turns = 5, steps = 120;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * turns * Math.PI * 2;
    const rr = r * 0.95 * (1 - i / steps * 0.82);
    const px = cx + Math.cos(a) * rr * 0.55, py = cy + Math.sin(a) * rr;
    d += (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1);
  }
  return `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.55}" ry="${r}" fill="${P.quillLight}"/>
    <path d="${d}" fill="none" stroke="${P.bark}" stroke-opacity=".55" stroke-width="${Math.max(0.8, r * 0.06)}"/>`;
}

// Cross-section of cassia bark: one thick, hard curl
function cassiaEnd(cx, cy, r) {
  return `<g>
    <path d="M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r * 0.2} ${cy + r * 0.98}" fill="none" stroke="#6B3519" stroke-width="${r * 0.42}" stroke-linecap="round"/>
    <path d="M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r * 0.2} ${cy + r * 0.98}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="${r * 0.08}" transform="translate(${r * 0.12} 0)"/>
  </g>`;
}

function leaf(x, y, len, rot = 0, color = P.leaf) {
  const w = len * 0.32;
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <path d="M0 0 C ${w} ${-len * 0.25} ${w * 0.9} ${-len * 0.75} 0 ${-len} C ${-w * 0.9} ${-len * 0.75} ${-w} ${-len * 0.25} 0 0 Z" fill="${color}"/>
    <path d="M0 0 L0 ${-len * 0.96} M0 ${-len * 0.08} C ${w * 0.45} ${-len * 0.35} ${w * 0.4} ${-len * 0.7} ${w * 0.1} ${-len * 0.9} M0 ${-len * 0.08} C ${-w * 0.45} ${-len * 0.35} ${-w * 0.4} ${-len * 0.7} ${-w * 0.1} ${-len * 0.9}" stroke="#fff" stroke-opacity=".35" stroke-width="${len * 0.012}" fill="none"/>
  </g>`;
}

function hibiscus(x, y, r, rot = 0) {
  const petals = Array.from({ length: 5 }, (_, i) => {
    const a = i * 72;
    return `<g transform="rotate(${a})"><path d="M0 0 C ${r * 0.55} ${-r * 0.2} ${r * 0.7} ${-r * 0.95} 0 ${-r} C ${-r * 0.7} ${-r * 0.95} ${-r * 0.55} ${-r * 0.2} 0 0 Z" fill="${i % 2 ? P.hibiscus : '#B92A55'}"/>
      <path d="M0 ${-r * 0.1} L0 ${-r * 0.85} M0 ${-r * 0.2} L${r * 0.22} ${-r * 0.75} M0 ${-r * 0.2} L${-r * 0.22} ${-r * 0.75}" stroke="${P.hibiscusLight}" stroke-opacity=".55" stroke-width="${r * 0.02}"/></g>`;
  }).join('');
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <ellipse cx="${r * 0.08}" cy="${r * 0.12}" rx="${r * 1.05}" ry="${r * 0.9}" fill="url(#softShadow)"/>
    ${petals}
    <circle r="${r * 0.2}" fill="#5E0C25"/>
    <path d="M0 0 L${r * 0.15} ${-r * 0.62}" stroke="#F4D7A1" stroke-width="${r * 0.05}" stroke-linecap="round"/>
    ${Array.from({ length: 7 }, (_, i) => `<circle cx="${r * 0.15 + Math.cos(i) * r * 0.08}" cy="${-r * 0.64 + Math.sin(i * 1.7) * r * 0.06}" r="${r * 0.03}" fill="${P.passionPulp}"/>`).join('')}
  </g>`;
}

function passionfruit(x, y, r, rot = 0) {
  const seeds = [];
  let seed = 7;
  const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 34; i++) {
    const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * r * 0.62;
    seeds.push(`<ellipse cx="${(Math.cos(a) * d).toFixed(1)}" cy="${(Math.sin(a) * d).toFixed(1)}" rx="${r * 0.05}" ry="${r * 0.035}" fill="#2B1A10" transform="rotate(${(rand() * 180).toFixed(0)} ${(Math.cos(a) * d).toFixed(1)} ${(Math.sin(a) * d).toFixed(1)})"/>`);
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <ellipse cx="${r * 0.08}" cy="${r * 0.2}" rx="${r * 1.08}" ry="${r * 0.9}" fill="url(#softShadow)"/>
    <circle r="${r}" fill="${P.passionRind}"/>
    <circle r="${r * 0.86}" fill="#F6E7C8"/>
    <circle r="${r * 0.74}" fill="${P.passionPulp}"/>
    <circle r="${r * 0.74}" fill="${P.passion}" opacity=".35"/>
    ${seeds.join('')}
  </g>`;
}

function arch(x, y, w, h, fill) {
  return `<path d="M${x} ${y + h} L${x} ${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} L${x + w} ${y + h} Z" fill="${fill}"/>`;
}

function powder(x, y, r) {
  return `<g transform="translate(${x} ${y})">
    <ellipse rx="${r}" ry="${r * 0.32}" fill="${P.quill}"/>
    <ellipse rx="${r * 0.7}" ry="${r * 0.2}" cy="${-r * 0.06}" fill="${P.quillLight}" opacity=".8"/>
    ${Array.from({ length: 16 }, (_, i) => `<circle cx="${Math.cos(i * 2.4) * r * 1.2}" cy="${Math.sin(i * 1.3) * r * 0.42}" r="${r * 0.025}" fill="${P.quill}" opacity=".7"/>`).join('')}
  </g>`;
}

/* ---------- Compositions ---------- */
const files = {};

// Hero, mobile (4:5)
files['hero-mobile.svg'] = svg(1200, 1500, `
  <rect width="1200" height="1500" fill="url(#grain)"/>
  ${arch(170, 220, 860, 1180, P.sand)}
  <circle cx="900" cy="330" r="260" fill="url(#sunGlow)"/>
  ${leaf(250, 880, 330, -38, P.leaf)}
  ${leaf(300, 900, 260, -12, P.leafLight)}
  ${leaf(960, 880, 300, 34, P.leaf)}
  ${leaf(910, 900, 220, 10, P.newLeaf)}
  ${bottle('hibiscus', 380, 1180, 560)}
  ${bottle('passion', 820, 1180, 560)}
  ${bottle('original', 600, 1230, 660)}
  ${quill(440, 1330, 620, 54, -6)}
  ${quill(760, 1370, 560, 46, 4, P.quillLight)}
  ${hibiscus(205, 1290, 120, 12)}
  ${passionfruit(1015, 1300, 105, -10)}
`, P.cream);

// Hero, desktop (16:9). Product sits on the right; copy goes on the left in HTML.
files['hero-desktop.svg'] = svg(1920, 1080, `
  <rect width="1920" height="1080" fill="url(#grain)"/>
  <g transform="translate(110 0)">
  ${arch(960, 90, 820, 990, P.sand)}
  <circle cx="1620" cy="230" r="260" fill="url(#sunGlow)"/>
  ${leaf(1020, 760, 330, -40, P.leaf)}
  ${leaf(1070, 780, 250, -14, P.leafLight)}
  ${leaf(1740, 760, 310, 36, P.leaf)}
  ${leaf(1690, 780, 220, 12, P.newLeaf)}
  ${bottle('hibiscus', 1160, 900, 520)}
  ${bottle('passion', 1580, 900, 520)}
  ${bottle('original', 1370, 950, 620)}
  ${quill(1230, 1010, 560, 48, -5)}
  ${quill(1520, 1040, 520, 42, 4, P.quillLight)}
  ${hibiscus(1000, 990, 110, 12)}
  ${passionfruit(1700, 990, 96, -10)}
  </g>
`, P.cream);

// Product images (4:5), one per flavour
const props = {
  original: () => `${quill(380, 1300, 520, 52, -8)}${quill(820, 1330, 460, 44, 6, P.quillLight)}${quill(900, 1240, 300, 34, -24)}${leaf(280, 1180, 280, -30, P.leaf)}${leaf(960, 1150, 240, 30, P.newLeaf)}`,
  hibiscus: () => `${hibiscus(300, 1250, 150, 15)}${hibiscus(960, 1310, 100, -20)}${quill(640, 1370, 520, 46, -4)}${leaf(950, 1150, 240, 32, P.leaf)}`,
  passion: () => `${passionfruit(300, 1270, 140, 0)}${passionfruit(940, 1320, 95, 30)}${quill(640, 1370, 520, 46, 4)}${leaf(260, 1110, 240, -30, P.leaf)}`,
};
for (const f of Object.keys(FLAVOURS)) {
  files[`product-${f}.svg`] = svg(1200, 1500, `
    ${arch(200, 180, 800, 1320, FLAVOURS[f].tint)}
    ${props[f]()}
    ${bottle(f, 600, 1260, 900)}
  `, P.cream);
}

// Variety / starter box (4:5)
files['product-starter.svg'] = svg(1200, 1500, `
  ${arch(130, 200, 940, 1300, P.sand)}
  <g>
    <rect x="170" y="1010" width="860" height="330" rx="18" fill="${P.cinnamon}"/>
    <rect x="170" y="1010" width="860" height="70" rx="18" fill="${P.bark}"/>
    <text x="600" y="1210" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="74" font-weight="600" fill="${P.cream}">Sweet Wood</text>
    <text x="600" y="1268" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="24" letter-spacing="6" font-weight="600" fill="${P.sand}">STARTER TRIO · 12 SHOTS</text>
  </g>
  ${bottle('hibiscus', 360, 1030, 520)}
  ${bottle('original', 600, 1030, 560)}
  ${bottle('passion', 840, 1030, 520)}
  ${quill(400, 1410, 520, 44, -4)}
  ${hibiscus(1000, 1400, 80)}
  ${passionfruit(200, 1400, 75)}
`, P.cream);

// Estate landscape (wide 16:9 and mobile 4:5): rows of coppiced cinnamon on the southern coast
function estate(w, h) {
  const rows = [];
  for (let r = 0; r < 7; r++) {
    const y = h * 0.52 + r * r * h * 0.012 + r * h * 0.045;
    const size = 14 + r * 9;
    const n = Math.ceil(w / (size * 2.1)) + 2;
    const col = [P.leafLight, P.leaf, '#3F6A44', P.leaf, '#355E3B', P.forest, '#2A4A35'][r];
    let bushes = '';
    for (let i = 0; i < n; i++) {
      const bx = i * size * 2.1 - (r % 2) * size;
      const by = y + Math.sin(i * 1.7 + r) * 3;
      bushes += `<ellipse cx="${bx}" cy="${by}" rx="${size * 1.15}" ry="${size * 0.9}" fill="${col}"/>`;
      if ((i + r) % 4 === 0) bushes += `<ellipse cx="${bx + size * 0.3}" cy="${by - size * 0.6}" rx="${size * 0.45}" ry="${size * 0.3}" fill="${P.newLeaf}" opacity=".85"/>`;
    }
    rows.push(bushes);
  }
  const palm = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${P.forest}">
    <path d="M0 0 C 6 -90 14 -170 26 -250" stroke="${P.forest}" stroke-width="9" fill="none"/>
    ${[-70, -35, 0, 35, 70, 110, -110].map(a => `<path transform="translate(26 -250) rotate(${a})" d="M0 0 C 30 -20 70 -10 100 20 C 70 0 30 -5 0 0 Z"/>`).join('')}
  </g>`;
  return svg(w, h, `
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6D9B4"/><stop offset=".6" stop-color="${P.cream}"/></linearGradient>
    <rect width="${w}" height="${h}" fill="url(#sky)"/>
    <circle cx="${w * 0.72}" cy="${h * 0.3}" r="${h * 0.32}" fill="url(#sunGlow)"/>
    <circle cx="${w * 0.72}" cy="${h * 0.3}" r="${h * 0.075}" fill="#F7C987"/>
    <rect y="${h * 0.42}" width="${w}" height="${h * 0.06}" fill="#9FC3BE" opacity=".7"/>
    <path d="M0 ${h * 0.47} C ${w * 0.25} ${h * 0.43} ${w * 0.5} ${h * 0.5} ${w} ${h * 0.45} L${w} ${h} L0 ${h} Z" fill="${P.dune}"/>
    ${palm(w * 0.08, h * 0.55, h / 900)}${palm(w * 0.86, h * 0.53, h / 1000)}${palm(w * 0.93, h * 0.56, h / 1150)}
    ${rows.join('')}
    <rect y="${h * 0.9}" width="${w}" height="${h * 0.1}" fill="${P.forest}"/>
  `);
}
files['estate-wide.svg'] = estate(1920, 900);
files['estate-mobile.svg'] = estate(1200, 1200);

// Ceylon vs cassia education graphic (square)
files['ceylon-vs-cassia.svg'] = svg(1200, 1200, `
  <rect x="0" y="0" width="600" height="1200" fill="${P.sand}"/>
  <rect x="600" y="0" width="600" height="1200" fill="#E6D6C4"/>
  <circle cx="300" cy="400" r="190" fill="${P.cream}"/>
  <g transform="translate(300 400) scale(1.8 1)">${ceylonEnd(0, 0, 150)}</g>
  <circle cx="900" cy="400" r="190" fill="${P.cream}"/>
  ${cassiaEnd(900, 400, 110)}
  ${quill(300, 720, 440, 64, 0)}
  <g transform="translate(900 720)">
    <ellipse cx="0" cy="54" rx="230" ry="26" fill="url(#softShadow)"/>
    <rect x="-220" y="-40" width="440" height="80" rx="16" fill="#6B3519"/>
    <rect x="-220" y="-40" width="440" height="80" rx="16" fill="url(#quillShade)"/>
    <path d="M-206 -14 C -60 -20 60 -8 206 -16 M-206 14 C -60 10 60 20 206 12" stroke="#2E1408" stroke-opacity=".4" stroke-width="5" fill="none"/>
  </g>
  <text x="300" y="900" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="64" font-weight="600" fill="${P.bark}">Ceylon</text>
  <text x="300" y="950" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="26" fill="${P.cinnamon}">Many paper-thin layers</text>
  <text x="300" y="990" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="26" fill="${P.cinnamon}">Only trace coumarin</text>
  <text x="900" y="900" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="64" font-weight="600" fill="#4A2E20">Cassia</text>
  <text x="900" y="950" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="26" fill="#7A5A48">One thick, hard layer</text>
  <text x="900" y="990" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="26" fill="#7A5A48">Much higher coumarin</text>
`);

// Process illustrations (square): grow, peel, extract, bottle
files['process-grow.svg'] = svg(800, 800, `
  <clipPath id="disc"><circle cx="400" cy="400" r="340"/></clipPath>
  <circle cx="400" cy="400" r="340" fill="${P.sand}"/>
  <path clip-path="url(#disc)" d="M40 600 C 260 560 540 560 760 600 L760 760 L40 760 Z" fill="${P.dune}"/>
  ${[300, 400, 500].map((x, i) => `<path d="M${x} 600 L${x + (i - 1) * 10} 330" stroke="${P.bark}" stroke-width="14" stroke-linecap="round"/>`).join('')}
  ${leaf(300, 420, 160, -50)}${leaf(300, 360, 140, 40, P.leafLight)}${leaf(410, 330, 170, -10, P.newLeaf)}${leaf(400, 430, 150, 60)}${leaf(510, 400, 160, 45, P.leafLight)}${leaf(500, 350, 140, -35)}
`);
files['process-peel.svg'] = svg(800, 800, `
  <circle cx="400" cy="400" r="340" fill="${P.sand}"/>
  <rect x="170" y="380" width="460" height="60" rx="30" fill="#7A5634"/>
  <path d="M260 380 C 300 300 380 290 440 330 C 400 330 350 350 330 390 Z" fill="${P.quillLight}"/>
  <path d="M440 330 C 480 300 540 300 560 330" stroke="${P.quill}" stroke-width="14" fill="none" stroke-linecap="round"/>
  <g transform="translate(520 470) rotate(25)"><rect x="-10" y="-120" width="20" height="120" rx="6" fill="#9AA0A6"/><rect x="-16" y="0" width="32" height="90" rx="10" fill="${P.bark}"/></g>
  ${quill(330, 560, 300, 40, -4)}
`);
files['process-extract.svg'] = svg(800, 800, `
  <circle cx="400" cy="400" r="340" fill="${P.sand}"/>
  <path d="M300 220 L300 360 L210 560 Q200 600 240 600 L560 600 Q600 600 590 560 L500 360 L500 220 Z" fill="${P.glass}" stroke="${P.bark}" stroke-width="10" stroke-linejoin="round"/>
  <path d="M262 470 L538 470 L590 560 Q600 600 560 600 L240 600 Q200 600 210 560 Z" fill="#B8682F"/>
  <rect x="280" y="200" width="240" height="30" rx="10" fill="${P.bark}"/>
  ${[0, 1, 2, 3, 4].map(i => `<circle cx="${300 + i * 50}" cy="${520 - (i % 2) * 20}" r="${8 + (i % 3) * 3}" fill="${P.cream}" opacity=".6"/>`).join('')}
  <path d="M400 120 C 380 150 420 160 400 190" stroke="${P.leaf}" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M440 110 C 420 140 460 150 440 180" stroke="${P.leaf}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".6"/>
`);
files['process-bottle.svg'] = svg(800, 800, `
  <circle cx="400" cy="400" r="340" fill="${P.sand}"/>
  ${bottle('original', 400, 650, 520)}
`);

// Logo mark (SVG, transparent) – placeholder until the real logo files are supplied
files['logo-mark.svg'] = svg(240, 240, `${quillIcon(120, 120, 2, P.cinnamon)}`);

for (const [name, content] of Object.entries(files)) writeFileSync(join(OUT, name), content);
console.log(`Wrote ${Object.keys(files).length} SVGs to ${OUT}`);

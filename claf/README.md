# CLAF Edition Four: homepage mockup

A mobile-first homepage mockup for the **HSBC Ceylon Literary & Arts Festival**, Edition Four: *Intersection, where stories meet people*. It runs 22–24 January 2027 in Colombo. The final site will be WordPress with **The Events Calendar (Pro)** and **Event Tickets Plus**, so the programme and tickets copy those plugins' own markup.

- `index.html`: the source. One file with plain CSS and JS and no framework. It references `assets/` by relative path.
- `dist/claf-homepage.html`: the **deliverable**. One self-contained file with every font and image embedded and no external calls. Build it with `node scripts/build-claf.mjs`.
- `preview/`: screenshots at 390px (iPhone) and 1440px (desktop), including the sheets and the "Show notes" overlay.

Press **Show notes** (bottom left on desktop, in the Menu sheet or the footer on phones), or add `#notes` to the URL. Each section then explains how it meets the brief:

| Tag | What it covers |
|---|---|
| R1 | **Hero event slider.** Native scroll-snap swiping with the next slide peeking on phones. It also has autoplay (7s, progress bar), arrows, dots, keyboard, a pause button and an "Up next" rail. It pauses on touch, hover, focus or a hidden tab, and doesn't autoplay with reduced motion. Each slide has a pillar tag, title, panel and chair, date, time and venue, and a ticket CTA. Six slides cover all five pillars. |
| R2 | **All five pillars on the homepage.** Pillar "spines" sit on the Trincomalee chart, followed by a full-width Youth section: Future Writers (LKR 100,000 and mentorship) on ripped paper, free student passes and volunteering. The pillar colour key repeats everywhere a pillar appears. |
| R3 | **Brand.** Uses the guideline fonts and graphic elements (nautical chart, ripped newspaper, ripped paper, maps) and the key-art palette. The hero lockup copies the posters: INTER/SECTION in butter, the tagline and dates in tracked Financier capitals. |
| APP | **Phone shell.** A compact translucent header that keeps **Get tickets** visible, and a bottom tab bar (Home, Programme, Tickets, Youth, Menu) that shows the current section. The menu, cart and event details open as bottom sheets you can drag down to close; on desktop they're side panels. Speakers, editions, tickets and key art are swipe rails, the programme day tabs stick under the header, and buttons respond to taps. |
| WP | **WordPress plugins.** The programme and tickets copy The Events Calendar Pro and Event Tickets Plus markup (see below). |

## Brand system (from the guideline PDF and Instagram key art)

- **Fonts, one role each:**
  - Financier Display: headings, key-art capital lockups and reading copy.
  - PP Palma: UI only (nav, buttons, tags, labels, meta lines).
  - Oldforge: prices (as on the early-bird posts), slide day numbers and edition numerals.
  - The guideline lists PP Palma Fizzy Light and Medium, but only **Fizzy Heavy** was supplied. Body copy stays in Financier until a lighter PP Palma weight arrives.
- **Palette:** sampled from the Edition Four key art and hero chart.

  | Name | Hex |
  |---|---|
  | Petrol blue | `#064866` |
  | Deep petrol | `#00283F` |
  | Coral | `#BA525A` |
  | Burgundy | `#622937` |
  | Periwinkle | `#68799A` |
  | Butter | `#FFF1AA` |
  | Sky | `#83D2E5` |
  | Gold | `#BFA37A` |
  | Paper | `#EEEAE2` |

- **Pillar colour key:**
  - Literary: sky
  - Art: coral
  - Children: butter
  - Youth: burgundy
  - Performing Arts: periwinkle
- **Shape:** `border-radius:0` is forced globally. There's one hard offset shadow, and spacing follows an 8px scale.

## Assets (`assets/`)

| File | Source |
|---|---|
| `brand/claf-logo-light.png` | Supplied logo (light version, used on dark surfaces) |
| `graphics/hero-chart.webp` | Supplied nautical chart background with ripped-newspaper corners |
| `graphics/newspaper-torn.webp` | Supplied ripped-newspaper strip |
| `graphics/ripped-paper.webp` | Guideline PDF, "Ripped Paper" |
| `graphics/trincomalee-chart.webp` | Guideline PDF, "Maps" (Carte de la Baye et du Port de Trinquemalay) |
| `graphics/colombo-map.webp` | Guideline PDF, "Maps" (Colombo) |
| `photos/colombo-public-library-1930s.webp` | Guideline PDF, "Library Posts" (captioned Colombo Public Library) |
| `keyart/intersection-1..3.webp` | Supplied Instagram key art, one file per poster |

## WordPress mapping

- **Programme (TEC list view):** the panel reproduces The Events Calendar v2 list view as Events Calendar Pro renders it on a series page (last year's `/series/day-1-pass/`). That includes:
  - the events bar (search, view selector) and top bar (previous/next, Today, date);
  - the month separator;
  - each event row: date tag, featured image, `January 22 @ 10:00 am - 11:00 am` datetime, title, venue, excerpt, and the small CTA (Get Tickets and cost);
  - previous/next navigation and Subscribe to calendar.

  The class names match TEC's, so the theme only needs the Customizer (accent colour, fonts, background) plus short CSS.
- **Day tabs:** a thin custom wrapper with one tab per **Event Series** (Day 1, 2 and 3 Pass), each listing that series' events.
- **Pillar chips:** TEC **event categories**. Each colour swatch is that category's colour.
- **Hero slides:** events marked **Featured** in TEC.
- **Event sheet:** mirrors the single-event page: featured image, schedule, the "Event Series" marker, description, and the **Event Tickets Plus** ticket form (items with quantity steppers, a quantity and total footer, and **Get Tickets**). On the live site, tapping an event can open the real single-event page instead.
- **Tickets:**
  - Day Pass: an ET+ **series pass** on each Day series.
  - Festival Pass: a series pass covering all three days.
  - Student Pass: a free ticket, one per person.

  ET+ tickets are WooCommerce products. The `WC`/`PASSES` objects in the script hold the product IDs (placeholders). With `WC.live = true` and a Store API nonce, items are added through `POST /wp-json/wc/store/v1/cart/add-item` and checkout goes to `/checkout/`.

Last year's series page (ceylonliteraryfestival.com) couldn't be opened from the build environment, so the programme follows the plugin's default list-view structure. Compare it against the live page and send screenshots if anything differs.

## Swapping in real content

- **Programme:** edit `SESSIONS` in `index.html`. `featured: n` puts a session at position *n* in the hero slider. `PILLARS`, `DAYS`, `SPEAKERS` and `PASSES` hold the rest.
- **Placeholders:** text in `[brackets]` or with a gold highlight (`.ph`), plus anything labelled "Sample", needs replacing. That includes event images, speaker photos, partner logos, prices, the venue and dates.
- **Past editions:** dates and venues come from press coverage. Verify them with the organisers.

## Fonts and licensing

This repository is public, so the licensed font files (`assets/fonts/`) and the built file that embeds them (`dist/`) are **git-ignored**. To build:

1. Put WOFF2 files named `FinancierDisplay-Regular`, `-Medium` and `-Semibold`, `PPPalma-FizzyHeavy` and `Oldforge` in `claf/assets/fonts/`. The supplied OTFs were subset to Latin with `pyftsubset … --flavor=woff2`.
2. Run `node scripts/build-claf.mjs`.

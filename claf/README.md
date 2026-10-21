# CLAF Edition Four: homepage mockup

A mobile-first homepage mockup for the **HSBC Ceylon Literary & Arts Festival**, Edition Four: *Intersection, where stories meet people*. It runs 22–24 January 2027 in Colombo.

- `index.html`: the source. One file with plain CSS and JS and no framework. It references `assets/` by relative path.
- `dist/claf-homepage.html`: the **deliverable**. One self-contained file with every font and image embedded and no external calls. Build it with `node scripts/build-claf.mjs`.
- `preview/`: screenshots at 375px (iPhone) and 1440px (desktop), including the "Show notes" overlay.

Open the built file and press **Show notes** (bottom left or in the footer), or add `#notes` to the URL. Each section then shows how it meets the three core requirements:

| | Requirement | Where |
|---|---|---|
| R1 | Hero is an event slider | Hero: autoplay (7s, progress bar), arrows, square dots, swipe, keyboard, pause button, "Up next" rail. Each slide has a pillar tag, title, panel and chair, date, time and venue, and a ticket CTA. Six slides cover all five pillars. |
| R2 | All five pillars on the homepage, Youth given its own section | Pillar "spines" sit directly after the intro, each with a one-line description. A full-width Youth section follows, covering Future Writers (LKR 100,000 and mentorship), free student passes and volunteering. The pillar colour key repeats in the slider, programme filters, speakers, menu, newsletter and feedback. |
| R3 | Matches the Intersection brand | Supplied logo, fonts and newspaper texture; navy, burgundy and crimson on aged paper with gold; square corners; a single hard offset shadow. |

## Section order

Announcement bar → sticky navy header (logo, **Get tickets** always visible, cart, hamburger drawer) → hero (lockup and event slider) → torn-newspaper divider → intro and stats → five pillars → Youth → programme (day tabs and pillar filters) → speakers → tickets (Day, Festival and Student, wired to a WooCommerce mini-cart) → when & where (map slot, .ics download) → partners → past editions → newsletter and feedback → footer.

## Design system

- **Fonts, one role each:**
  - Financier Display: headings, numerals and reading copy.
  - PP Palma: UI only (nav, buttons, tags, labels, meta lines).
  - Oldforge: a sparing accent for the dateline, slide day numbers and edition numerals.
  - Only **PP Palma Fizzy Heavy** was supplied, which is too heavy for paragraphs. Body copy is set in Financier Regular until a PP Palma text weight arrives. To switch, add an `@font-face` for it and set `body{font-family:var(--f-ui)}`.
- **Palette:** tokens are in `:root`.
  - Sky `#BFD6FF` and cream `#E7E7DD` are sampled from the logo.
  - Navy, burgundy, crimson, gold and paper are approximations. Confirm the hex values against the brand guideline PDF, which wasn't in the upload.
- **Pillar colour key:**
  - Literary: sky
  - Art: gold
  - Children: rose
  - Youth: crimson
  - Performing Arts: burgundy
- **Shape:** `border-radius:0` is forced globally. There's one shadow token (`--shadow`, a hard offset), and spacing follows an 8px scale.

## Swapping in real content

- **Programme and hero:** edit the `SESSIONS` array in `index.html`. A session's `featured: n` puts it at position *n* in the hero slider. The pillars, speakers and days are the `PILLARS`, `SPEAKERS` and `DAYS` arrays.
- **Placeholders:** text shown in `[brackets]` or with a gold highlight (`.ph`), plus anything labelled "Sample", needs replacing.
- **Missing graphics:** the antique nautical chart (hero background) and the Trincomalee map (venue) have reserved slots. Save them as `assets/graphics/nautical-chart.jpg` and `assets/graphics/trincomalee-map.jpg` and rebuild. The build embeds them and removes the "Asset slot" labels. Nothing is faked in their place.
- **Past editions:** dates and venues come from press coverage. Verify them with the organisers.

## WooCommerce

The ticket buttons carry WooCommerce attributes (`add_to_cart_button`, `data-product_id`, `data-quantity`). The `WC` object in the script holds the product IDs (all placeholders):

- **Day Pass:** a variable product with one variation per day.
- **Festival Pass:** a simple product.
- **Student Pass:** a free product, limited to one per person.

With `WC.live = false` the cart is simulated. On the WordPress build, set `live: true`, print a Store API nonce (`wp_create_nonce('wc_store_api')`) into `WC.nonce`, and items are added with `POST /wp-json/wc/store/v1/cart/add-item`. Checkout links to `/checkout/`.

## Fonts and licensing

This repository is public, so the licensed font files (`assets/fonts/`) and the built file that embeds them (`dist/`) are **git-ignored**. To build:

1. Put WOFF2 files named `FinancierDisplay-Regular`, `-Medium` and `-Semibold`, `PPPalma-FizzyHeavy` and `Oldforge` in `claf/assets/fonts/`. The supplied OTFs were subset to Latin with `pyftsubset … --flavor=woff2`.
2. Run `node scripts/build-claf.mjs`.

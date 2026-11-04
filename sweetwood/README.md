# Sweet Wood: homepage v2 (mobile-first, Pebble / Wellina)

The homepage for **Sweet Wood Ceylon Cinnamon Shots**, built to be rebuilt in Shopify on the **Pebble theme, Wellina preset**. v2 replaces the v1 illustrations with Sweet Wood's real packaging, colours and copy from the Amazon listing, and follows the live Wellina demo, Dose and Proper Wild sites, which were captured and studied for this version.

## Files

| Path | What it is |
|---|---|
| `index.html` | The homepage. Self-contained CSS and JS. |
| `preview/homepage-standalone.html` | The same page as **one file** with every image inlined (about 4MB). Open it on a phone. |
| `preview/*.png` | Screenshots: `mobile-fold`, `mobile-full`, `mobile-cart`, `mobile-menu` (iPhone size, 2x), `desktop-fold`, `desktop-full` (1440px). |
| `assets/composed/*.jpg` | **Shopify uploads.** Hero (mobile 1170x1000, desktop 1600x1100), the three flavour cards and the Sampler (4:5), and the 12-week timeline image. Made from the real bottle cut-outs. |
| `assets/amazon/` | Cut-outs and photos extracted from the Amazon PDFs: the logo, white-cap US bottles, trays, ingredients, line art, photos and badges. PNG where transparent, JPG otherwise. |
| `assets/site/` | Images from sweetwoodshots.com: logo, slider bottles, and three product photos downsized to 1400px. |
| `scripts/compose.mjs` | Rebuilds `assets/composed/` from the cut-outs. Edit the layouts in `JOBS`. |
| `scripts/import-amazon-assets.py` | Re-extracts the Amazon cut-outs (see the file header). |
| `scripts/render.mjs`, `scripts/build-standalone.mjs` | Screenshots and the single-file preview. |

```bash
node sweetwood/scripts/compose.mjs
```

```bash
node sweetwood/scripts/render.mjs
```

```bash
node sweetwood/scripts/build-standalone.mjs
```

## What was taken from each reference

| Source | Used for |
|---|---|
| **Pebble / Wellina demo** | The section types and their order. These include slideshow, product tabs, stat cards, progress timeline, comparison table, testimonials split slider, newsletter and footer. Also lime pill buttons with a black circular arrow, large-radius cards, a centred logo on mobile, footer accordions on dark green and a rotating circular badge. |
| **Dose** | The warm cream base and calm serif-and-sans pairing. Also the clinical-results block with a collapsible "Study details", Subscribe & Save as the default, the "Best value" tab on pack size, and numbered footnotes in the footer. |
| **Proper Wild** (toned down) | Colour-blocked product tiles per flavour and the "When to reach for one" icon grid. Also the polaroid photo collage, big bordered stat boxes and checkmark comparison table. The heavy black type, party photography and slang were left out. |
| **sweetwoodshots.com and Amazon content** | Optima headings with Manrope body, the brand colours, the bolt pill "The pure power of Ceylon cinnamon", and A+ copy such as "We ran one", "12 weeks is the real timeline", "Three actives" and "Is it for you". Also the real customer reviews, the SIAL seal and the badges. |

## Colours and fonts

| Token | Hex | Where |
|---|---|---|
| Lime (brand) | `#B8C329` | Primary buttons, big stat card, accents |
| Lime soft | `#EEF1C8` | Hero, newsletter, tints |
| Green | `#0F4D2E` | Announcement, evidence, reviews, footer |
| Pink | `#FF6D89` / soft `#FFE1E7` | Hibiscus card, Ceylon vs cassia block, timeline note |
| Yellow | `#FFB700` / soft `#FFEDB8` | Passion Fruit card, Our Story block |
| Sand | `#F1E2C6` | Pure Cinnamon card |
| Wine | `#8E1628` | Italic heading accents, "Also includes", honest promise |
| Cream / paper | `#F8F2E4` / `#FFFDF8` | Page and card backgrounds |

**Pebble colour schemes to create:**
1. Cream background with ink text (default).
2. Lime soft (hero, newsletter).
3. Green with paper text and lime buttons.
4. Pink.
5. Yellow soft.
6. Paper (white cards).

**Fonts:** headings use **Optima**, which is built into iPhone and Mac. Other devices fall back to **Belleza**, the closest free match. Upload your licensed Optima web font to the theme to get it everywhere. Body text is **Manrope**, which is in Shopify's font library.

## Page structure and the Pebble section to use

| # | Section | Pebble section | Why it's there |
|---|---|---|---|
| - | Announcement bar | Announcement bar | Subscribe & save, free shipping and PLOS ONE, rotating. |
| - | Header: menu, centred logo, account, cart (mobile); nav and a "Try Sweet Wood" button (desktop) | Header + menu drawer | The drawer shows the three flavours as image tiles, like Wellina's menu. |
| 1 | **Hero:** "The world's first Ceylon cinnamon *shot.*" with two CTAs, three chips and the SIAL seal | Slideshow (one slide, text above image on mobile) | Headline, CTA and product are all above the fold on a 390px phone. |
| 2 | Proof marquee | Scrolling text | Clinically studied, PLOS ONE, SIAL 2024, 0g sugar, vegan, since 1931. |
| 3 | **Find your shot:** three colour-blocked cards with quick add, plus a Sampler banner | Product tabs / Featured collection | All three products on the homepage, and the Sampler for undecided visitors. |
| 4 | **The evidence:** "Most cinnamon supplements point to studies. *We ran one.*" | Custom section + stat cards + Collapsible content | Shows the 8.59 mg/dL result, 150 adults, 12 weeks, double-blind and placebo-controlled, and links to PLOS ONE. The "Study details" toggle discloses the capsule dose, the secondary outcome, who it worked best for and the funding. |
| 5 | **Made for the meal window:** Shake, Drink, 15 to 20 minutes, plus "When to reach for one" | Multicolumn / Icon boxes | Makes the habit concrete for this audience: pasta, rice, bread, dessert, dinners out. |
| 6 | **12 weeks is the real timeline** | Progress timeline | Sets honest expectations, then leads into the subscription. |
| 7 | **Three actives. Nothing to hide.** | Icon boxes / carousel | Cinnamon extract (660 mg), hibiscus (750 mg) and piperine (0.5 mg), plus the full ingredient list. |
| 8 | **Not all cinnamon is created equal** (pink block) | Custom section | Explains Ceylon vs cassia, including 0.01% coumarin. |
| 9 | **Better than pills and powder** | Comparison table | Sweet Wood vs a typical capsule vs cinnamon powder. |
| 10 | **From the source of true cinnamon** (yellow block) | Custom section / Image with text | Polaroid collage, a rotating "SDS Spices · Est. 1931" badge, facts, four process steps and certification badges. |
| 11 | **Reviews** | Testimonials split slider | Real reviews from sweetwoodshots.com, each linked to a product. |
| 12 | **Is Sweet Wood right for you?** | Custom section, two columns | Who it's for and who it isn't, then the wine-coloured "honest promise". This is from your A+ content and suits a skeptical, older buyer. |
| 13 | **Buy box** | Featured product + subscription app block | Flavour, 1 or 2 boxes (Best value), Subscribe & Save as the default, price per shot on the button and three assurances. |
| 14 | FAQ | Collapsible content | Eight questions, also output as FAQPage JSON-LD. |
| 15 | Newsletter: "Get 10% off your first order" | Newsletter | Wellina's rounded input with a circular arrow button. |
| 16 | Footer: accordions, socials, boxed FDA disclaimer, numbered footnotes | Footer | Compliance and navigation. |
| - | Sticky mobile CTA and cart drawer with a free-shipping bar and one-time to subscribe upsell | Theme setting / cart drawer | Hidden over the hero, buy box and footer. |

## Claims and compliance

- The 8.59 mg/dL figure, the footnote wording and the "honest promise" come from your Amazon A+ content, so they're already brand-approved.
- The page adds plain-English disclosures in the evidence section: LDL was the primary outcome and wasn't significant, and the effect was clearest in people with high blood sugar.
- Testimonials that mention controlling blood sugar levels were trimmed or left out. Testimonials are treated as claims, so they shouldn't say more than the label can.
- **Certifications:** only GMP, HACCP, FDA-registered facility, Pure Ceylon Cinnamon, Vegan and SIAL are shown. The USDA, EU and JAS organic badges from the Amazon content are held back until you confirm they cover the shots, not only SDS's spice range.
- **Flavour claims:** the Hibiscus card shows "Healthy metabolism" and Passion Fruit shows "Focus & energy" because they're on the bottle labels. The study supports only the blood-sugar claim, so have these reviewed.

## Placeholders to replace before launch

| Item | Where |
|---|---|
| US prices ($36 / $68), 15% discount, $50 free-shipping threshold | `CONFIG` in the script, card prices and JSON-LD |
| 30-day money-back guarantee | Buy box assurances |
| Passion Fruit supplement facts (hibiscus and pure figures are used) | Three actives section |
| Sampler: is it sold in the US? | Sampler banner, footer link |
| Image resolution: the cut-outs come from compressed PDFs, at most 800px | `assets/amazon/`. Re-run `compose.mjs` with originals. |
| Social links and email | Footer |
| Reviews: real but from Sri Lanka and Singapore. Swap in US reviews (for example, imported from Amazon) when you have them. | Reviews section |

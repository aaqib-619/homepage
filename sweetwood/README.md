# Sweet Wood: homepage (mobile-first CRO build)

A homepage design for **Sweet Wood Ceylon Cinnamon Shots**, built to be rebuilt in Shopify on the **Pebble theme (Wellina preset)**. It explains a new product category, introduces the clinical study without jargon, tells the seed-to-shot story and pushes visitors toward a first order and then a subscription.

> **Status: v1 for review.** The colours, fonts and product art are **placeholders**: the sandbox this was built in couldn't reach sweetwoodshots.com, Amazon or dosedaily.co. Prices, review numbers and the guarantee are placeholders too. See [Placeholders](#placeholders-to-replace-before-launch).

## Files

| Path | What it is |
|---|---|
| `index.html` | The homepage. Self-contained CSS and JS, no framework. |
| `preview/homepage-standalone.html` | The same page as **one file** with all images inlined. Open it on any phone or desktop, or email it. |
| `preview/*.png` | Screenshots: `mobile-fold`, `mobile-full`, `mobile-cart`, `mobile-menu` (iPhone 13 size, 2x), `desktop-fold` and `desktop-full` (1440px). |
| `assets/export/*.jpg` | **Shopify-ready artwork.** Upload these to the theme sections listed below. The `.webp` copies are used by the HTML preview. |
| `assets/art/*.svg` | Editable vector sources for the artwork. |
| `scripts/` | Generators: `generate-art.mjs` (SVG art), `render.mjs` (JPG/WebP exports and screenshots), `build-standalone.mjs`. |

```bash
node sweetwood/scripts/generate-art.mjs
```

```bash
node sweetwood/scripts/render.mjs
```

```bash
node sweetwood/scripts/build-standalone.mjs
```

## The page, section by section

Pebble section names are the closest match from the Pebble section library. Confirm the exact names in your theme editor, because presets sometimes rename them.

| # | Section | Pebble section | Job it does (CRO) |
|---|---|---|---|
| 1 | Announcement bar (3 rotating messages) | Announcement bar | Leads with the subscription offer, free shipping and the study. |
| 2 | Header: menu, centred logo, account, cart. On desktop, inline nav plus a "Try Sweet Wood" button | Header | The cart is always visible and the count is announced to screen readers. |
| 3 | **Hero:** "Real Ceylon cinnamon. One shot a day." Sub-line names the estates and the 12-week trial. Two CTAs, price per shot, four proof points | Image banner | On a 390px phone the headline, CTA and "from $2.55 a shot" all sit above the fold. The price anchor removes the "is this expensive?" worry early. |
| 4 | Proof marquee: PLOS ONE, 12-week study, NutraIngredients, no added sugar | Scrolling text | Credibility straight after the hero, which matters for a product nobody has heard of. |
| 5 | **What is Sweet Wood:** 3 cards (one small shot, before your main meal, every day) and "What's inside. That's it." | Rich text + Multicolumn | Explains the new category in 10 seconds. A short ingredient list builds trust. |
| 6 | **Pick your flavour:** 3 product cards (Original, Hibiscus, Passion Fruit) with quick add. Swipeable on mobile, 3-up on desktop | Featured collection | Only 3 products, so all of them sit on the homepage with no collection page needed. "Not sure? Start with Original" removes choice paralysis. |
| 7 | **The science** (dark green band): journal citation, 4 stats, "What we found", a 4-step "How the study worked" diagram, plain-English fine print, 2 CTAs | Image with text + Multicolumn + Collapsible content | The hero proof point, told for a non-scientist. The honest fine print (funding, dose form, secondary outcome) is collapsed but available, which builds trust instead of looking like hype. |
| 8 | Benefits: 6 tiles | Multicolumn (icons) | Scannable reasons to buy. |
| 9 | **Ceylon vs cassia:** illustration and a comparison table | Image with text + Comparison table (or Custom Liquid) | Education that creates the need: "the cinnamon in your kitchen probably isn't this". |
| 10 | **Grown by us:** estate illustration, 3 facts (1931, 70k sq ft, 0 solvents) and 4 illustrated steps (grow, peel by hand, AquaFX extraction, bottle) | Image with text + Multicolumn | Supply-chain ownership is Sweet Wood's moat. Nobody else can say "seed to shot". |
| 11 | **Daily ritual:** 3 steps and "Give it 12 weeks" progress bar | Multicolumn + Rich text | Sets the expectation that results take consistency, which leads naturally into subscribing. |
| 12 | **Buy box:** gallery, flavour, box size (12/24), Subscribe & Save (default, 15% off, frequency, perks) vs one-time, price per shot on the button, 3 assurances | Featured product + subscription app block | The main conversion point, modelled on Dose's PDP buy box. Subscription is preselected, and per-shot pricing makes the price feel smaller. |
| 13 | Comparison table: Sweet Wood vs capsules, supermarket cinnamon and typical wellness shots | Comparison table (or Custom Liquid) | Handles the "why not just take a capsule?" objection. |
| 14 | Reviews: rating summary and 3 cards | Testimonials, or your review app's widget | Social proof. **Sample content: replace it.** |
| 15 | Founder quote (Ranmali Abeyasinghe) and heritage chips | Rich text / Image with text | Human, credible brand story. The quote is from her interview in *The Morning* (Feb 2026). |
| 16 | FAQ (7 questions) | Collapsible content | Handles objections: taste, timing, safety, medication, subscription, storage. Also output as `FAQPage` JSON-LD. |
| 17 | Final CTA, starter-trio image and 30-day guarantee | Image with text | Last push, with risk reversal. |
| 18 | Newsletter: "The Cinnamon Papers", 10% off | Email signup | Captures visitors who aren't ready to buy yet. |
| 19 | Footer with link groups (accordions on mobile), socials and FDA disclaimer | Footer | Compliance and navigation. |
| - | Sticky mobile CTA | (theme setting or app) | Shows after the hero and hides at the buy box and footer. |
| - | Cart drawer: free-shipping bar, **one-time to subscription upsell** | Cart drawer + subscription app | Turns one-time buyers into subscribers at the last step. |

### Patterns borrowed from Dose (dosedaily.co)

- One hero product story and short, confident headlines.
- Ingredient transparency, plus a "how we compare" table against alternatives.
- Subscribe & Save as the default purchase option, with per-serving pricing.
- Reviews and press proof repeated down the page.
- "Take it daily" ritual framing.

### Mobile-first details

- Designed at 390px first, then scaled to tablet (640px) and desktop (1024px).
- All tap targets are at least 44px. Sticky elements respect the iPhone home-indicator safe area.
- Swipe carousels use scroll-snap, and the comparison table scrolls sideways with a sticky first column.
- The hero image is preloaded per breakpoint. Below-the-fold images are lazy-loaded WebP, about 390KB of artwork in total.
- No horizontal overflow at 390px or 1440px, and no console errors.
- Respects `prefers-reduced-motion`.

### Analytics

Events are pushed to `window.dataLayer` (GA4 or GTM): `add_to_cart` (with flavour, pack and purchase type), `purchase_option`, `cart_upsell_subscribe`, `cta_click` (with the button id) and `newsletter_signup`.

## Claims and compliance (please review)

The study copy is written to be **accurate and defensible**, because overclaiming is the fastest way to lose a skeptical audience and to attract FTC/FDA attention.

- **What the study showed:** 150 adults enrolled and 127 completed. It ran for 12 weeks and was randomised, double-blind and placebo-controlled. After 12 weeks, the extract group had a significantly greater reduction in **fasting blood sugar** than placebo, and the extract was well tolerated.
- **What it didn't show:** the primary outcome (LDL cholesterol) wasn't significant, so the blood-sugar result is a secondary outcome. The effect was clearest in people with raised blood sugar. Participants took **1,000mg/day of extract in capsules**, not the shot.
- **How the page handles it:**
  - It uses the structure/function wording "clinically studied to support healthy blood sugar", with an asterisk pointing to the FDA disclaimer.
  - It doesn't say "lowers blood sugar", "treats diabetes" or "clinically proven shot".
  - The plain-English fine print discloses the dose form, the secondary outcome and that SDS Spices funded the study.
  - "Is Sweet Wood a replacement for medication? No." is in the FAQ.
- The page says each shot is made with "the same Ceylon cinnamon extract". **Please confirm this, and the amount of extract per shot**, so we can say whether a shot matches the studied dose.
- "World's first" / "the first Ceylon cinnamon shot" is the brand's own claim. Keep the evidence for it on file.
- Have the final copy reviewed by someone who knows US supplement and food claims before launch.

## Placeholders to replace before launch

| Item | Where | Notes |
|---|---|---|
| Brand colours | `:root` tokens at the top of `index.html` | Placeholder palette: cinnamon, bark, cream, estate green, hibiscus and passion fruit. In Shopify, set these in the Pebble colour schemes. |
| Fonts | Google Fonts link (Fraunces + Inter) | Swap them for Sweet Wood's brand fonts. |
| Logo | `assets/export/logo-mark.png` and the text wordmark | Use the real logo files. |
| Product images | `product-*.jpg`, `hero-*.jpg` | These are illustrated stand-ins. Real packshots and lifestyle photography will convert better; keep the 4:5 ratio. |
| Prices | `CONFIG` in the script, the card prices and the JSON-LD | Currently $36 for 12 shots, $68 for 24, 15% off on subscription and free shipping over $50. |
| Reviews and rating | Buy box and reviews section | Marked **Sample**. Connect Judge.me, Okendo or Loox, or import your Amazon reviews. |
| Guarantee | Buy box and final CTA | "30-day happiness guarantee" is a suggestion. Use only if you'll offer it. |
| Refrigeration copy | FAQ | Confirm the storage instructions. |
| "Featured in NutraIngredients" | Marquee | They covered the study in March 2025. Swap in your strongest press logos. |
| Facts: 1931, 70k sq ft | Estate section and founder chips | Taken from SDS / SaaraLife public pages. Please confirm. |
| Email address | FAQ and footer | `hello@sweetwoodshots.com` is a placeholder. |

## Sources used

- PLOS ONE (2025), doi:10.1371/journal.pone.0317904. Coverage from NutraIngredients (10 Mar 2025), Sunday Times LK and University of Kelaniya news.
- Sweet Wood "Our Story", the UK and AU stockist product pages, and the Amazon UK listing: ingredients, usage, flavours.
- *The Morning* (26 Feb 2026) and *Living Magazine*: founder quote and launch story.
- SDS Spices and SaaraLife about pages: 1931 heritage, Kosgoda facilities.

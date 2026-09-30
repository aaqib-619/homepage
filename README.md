# Amirah Gems: mobile homepage (CRO build)

A mobile-first, conversion-optimised HTML homepage for **Amirah Gems**: one of a kind rings and premium jewellery gifting. The page follows the Amirah brand guidelines and is organised around the three primary collections:

1. **Premium Jewellery & Gifting**: most of the catalogue
2. **Gold Jewellery**: all forms of 18k, 22k and 24k gold
3. **Gemstones**: loose gemstones

It also features the **Custom Designs** service, with an enquiry form.

## Files

- `index.html`: the full page. Self-contained CSS and JS, no framework.
- `preview/homepage-standalone.html`: the whole page as **one file** with every image embedded. Open it anywhere, email it, or send it to a phone.
- `assets/images/hero-pearl-drops.webp`: hero photography, also used as the Butterfly Pearl Drop Earrings product image.
- `assets/brand/`: the wordmark extracted from the brand guidelines, in white (over the hero) and plum (solid header), plus the white lockup with tagline for the footer.
- `assets/banners/*.svg`, `assets/products/*.svg`: generated brand-palette artwork. Collection tiles, section banners, gold jewellery and loose gemstones (oval, round, pear, cushion and emerald cuts).
- `assets/export/`: JPGs ready to upload to Shopify.
  - `banner-*.jpg`: banners with copy baked in, 1170px wide.
  - `art-*.jpg`: the same artwork **without text**, for theme sections that overlay their own heading and button (recommended).
  - `product-*.jpg`: 1200×1500 (4:5) placeholder product images.
- `preview/*.png|jpg`: screenshots at iPhone 13 size.

Regenerate everything:

```bash
node scripts/generate-assets.mjs   # SVG artwork
node scripts/render.mjs            # JPG exports and previews (uses the Playwright/Chromium install)
node scripts/build-standalone.mjs  # single-file preview with images inlined
```

### Viewing it

1. **One file:** open `preview/homepage-standalone.html` in any browser, on desktop or phone.
2. **Mobile view on desktop:**
   - Open the file in Chrome.
   - Press `Cmd+Opt+I` (Mac) or `Ctrl+Shift+I` (Windows).
   - Press `Cmd+Shift+M` / `Ctrl+Shift+M` and choose an iPhone.

## Brand system (from the guidelines)

| Token | Value | Used for |
|---|---|---|
| Plum | `#641946` | Headings, dark sections (custom designs, footer), primary dark buttons, "New Arrival" badge |
| Rose | `#b84d69` | Accent text, outline buttons ("ADD TO CART", "View All"), links |
| Pink | `#ffc2c2` | Light primary button ("Shop Now"), newsletter band |
| Blush | `#eedcdf` | USP strip, "Save %" badge, dividers |
| White | `#ffffff` | Page background |

- **Cormorant Garamond**: hero and section headings.
- **DM Sans**: body copy, navigation and buttons.
- **Prata**: accents such as eyebrows, collection names and short statements.
- **Buttons and badges** are square with 1px borders, matching the button/badge system page.

## Page structure

| # | Module | Why it's there |
|---|---|---|
| 1 | Transparent header | Sits over the hero photo with the white wordmark and icons. It turns solid white with the plum wordmark after 40px of scroll, so it stays legible over content. The cart count is always visible (`aria-live`). |
| 2 | Hero | Brand photography with "Rare Gems, Timeless" and two paths: **Shop Now** for ready-to-wear buyers and **Design Your Own** for custom buyers. No rating. |
| 3 | USP strip | One line, looping: 300+ Five-Star Reviews · Ready-to-Wear Jewellery · Custom Designs · Expert Guidance. It pauses on touch or hover, and shows statically with reduced motion. |
| 3b | Category carousel | Swipeable circles directly below the hero: New Arrivals, Rings, Earrings, Necklaces, Bracelets, Gold, Gemstones, Custom and Gifts. They give one-tap shortcuts by jewellery type, and a rose ring highlights New Arrivals and Custom. |
| 4 | Our Collections | Three swipeable tiles, one per primary collection, so shoppers self-select immediately. |
| 5 | Premium Jewellery & Gifting | Type tabs (Earrings, Necklaces, Rings, Bracelets) and a product grid. Cards show metal colour swatches, "Save %" and "New Arrival" badges, low-stock flags and **Add to cart**. |
| 6 | Gifting banner | Gifting is part of the premium collection and a high-intent occasion. |
| 7 | Gold Jewellery | A plum banner, 18k/22k/24k shortcuts and a swipeable product row. |
| 8 | Shop by budget | Two bands only: **Under Rs. 50k** and **Above Rs. 50k**. |
| 9 | Gemstones | A banner and a grid of loose stones with carat and cut, plus a "Found your stone? We'll set it for you" cross-sell into Custom Designs. |
| 10 | Custom Designs | A sketch-to-ring banner, three steps and the metals offered, then the enquiry form (below). |
| 11 | Reviews | "300+ five-star reviews" with swipeable review cards linked to the product or to custom designs. |
| 12 | Expert Guidance | WhatsApp and consultation CTAs, the brand's key reassurance for considered, high-value purchases. |
| 13 | Newsletter | "Save 10%" on the brand's pink band. It's the only newsletter form; the footer has none. |
| 14 | FAQ | Custom work, metals, loose gemstones and getting help. Also emitted as `FAQPage` JSON-LD. |
| 15 | Footer | Plum background with the white lockup, accordion links, social and secure-checkout badges. |
| - | Sticky bottom bar | Appears after the hero and hides over the footer and while overlays are open. |
| - | Cart drawer | Line items, "You may also like" from the same collection, a "Talk to an expert" link and secure checkout. |
| - | Welcome offer | A bottom sheet, not a full-screen blocker. Shows after 25s or 50% scroll, once per visitor, and never while someone is filling in the custom form. |

### Custom design form

- **Jewellery type**: Ring, Engagement ring, Necklace, Pendant, Earrings, Bracelet, Something else.
- **Metal type**: 18k, 22k or 24k Gold, Silver, Platinum.
- **Metal colour**: Yellow, White or Rose. Choosing Platinum locks the colour to White, with a note.
- **Stone preference**: free text.
- **Reference images**:
  - Up to 3 images, 10MB each.
  - Tap or drag and drop, with thumbnails and remove buttons.
  - Non-images and oversized files are rejected with a message.
- **Tell us about your idea**: optional.
- **Name, email and contact number**: all required.
- **Budget**: removed, as requested.

## Before going live

1. **Products**: replace `PRODUCTS` in `index.html` (or rebuild the sections in Liquid) with real titles, prices, images, handles and `variantId`s. With `variantId` set, Add to cart posts to Shopify's `/cart/add.js`. Swatches only tint the illustrated placeholders; with real photography, switch each swatch to its variant's image.
2. **Reviews**: the four review cards are **placeholders**. Pull real reviews from your reviews app. The "300+ five-star reviews" figure comes from the brief; keep it in sync with the real count.
3. **Custom form uploads**: Shopify's built-in contact form **cannot receive file uploads**. Point the form's `action` at a form app or endpoint that accepts `multipart/form-data` (Shopify Forms alternatives such as Globo Form Builder, Hulk Form Builder or Jotform), or reference images will be dropped. The other fields work with the native contact form as they are.
4. **Currency and number format**: prices show as `Rs. 18,900`. Set `CONFIG.currency` and `CONFIG.locale` (use `en-IN` for `1,45,000`-style grouping). The Under/Above 50k threshold is `CONFIG.priceBand`.
5. **WhatsApp**: set `CONFIG.whatsapp` to your number in international format. Until then, the button falls back to `/pages/contact`.
6. **Offers**: create the `WELCOME10` discount (10% off first order), or change the copy to match your real welcome offer.
7. **Stock flags**: show "Only X left" only from real inventory.
8. **Collections**: these handles must exist in the store:
   - `premium-jewellery-gifting`, `gold-jewellery`, `gemstones`
   - `18k-gold`, `22k-gold`, `24k-gold`
   - `under-50k`, `above-50k`, `gifts`
9. **Domain**: update `canonical`, `og:image`, the JSON-LD URLs and the social links.

## Recommended A/B tests

1. Hero secondary CTA: "Design Your Own" vs "Explore Gemstones".
2. Collection tiles above vs below the USP strip.
3. Custom form: all fields on one step vs two steps (idea first, contact details second).
4. Card CTA: "Add to cart" vs "View details" for pieces above Rs. 50k.
5. Welcome offer: 10% off vs a free design consultation.

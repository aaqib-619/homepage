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
- `preview/*.png|jpg`: screenshots at iPhone 13 size, plus `preview/desktop-*` at 1440x900.

Regenerate everything:

```bash
node scripts/generate-assets.mjs   # SVG artwork
node scripts/render.mjs            # JPG exports and previews (uses the Playwright/Chromium install)
node scripts/make-hero-video.mjs   # placeholder hero video for custom.html
node scripts/build-standalone.mjs  # single-file previews of both pages with images inlined
```

### Viewing it

1. **One file:** open `preview/homepage-standalone.html` in any browser, on desktop or phone.
2. **Mobile view on desktop:**
   - Open the file in Chrome.
   - Press `Cmd+Opt+I` (Mac) or `Ctrl+Shift+I` (Windows).
   - Press `Cmd+Shift+M` / `Ctrl+Shift+M` and choose an iPhone.

## Custom jewellery landing page (`custom.html`)

A standalone, high-converting landing page for Amirah's custom jewellery service, built for paid social, search ads and links from the homepage. It uses the same brand system as the homepage and is responsive from phone to desktop.

It's built around **one goal, the enquiry**. The header has no main navigation, only the logo, "Talk to an expert" (WhatsApp) and **Start Your Design**, and every section ends in the same CTA.

| # | Section | Why it's there |
|---|---|---|
| 1 | Video hero | Autoplaying, muted, looping video that shows the craft: a sketch becoming the finished ring. It uses a poster image for instant paint, has a pause button for accessibility, and pauses when off screen or when reduced motion is set. Headline "Designed by You. Made by Us." with **Start Your Design** and **View Our Work** buttons. On desktop, the copy sits on plum beside the video. |
| 2 | Three key stats | Client rating, number of custom designs and average completion time. The numbers count up when scrolled into view. Edit them in `CONFIG.stats`. |
| 3 | Portfolio carousel | Past custom work with filters (Engagement rings, Rings, Pendants, Earrings), swipe or arrow navigation and a progress bar. Tapping a piece opens a lightbox with its story. **Design something similar** prefills the form (jewellery type, stone preference and an "Inspired by" note) and scrolls to it. |
| 4 | How it works | Four steps: share your idea, talk it through with an expert, approve the design, handcrafted for you. Followed by a CTA. |
| 5 | Testimonials | A swipeable carousel of client quotes, each linked to the piece they commissioned. |
| 6 | Metals & stones | 18k, 22k and 24k gold, silver and platinum; yellow, white and rose; sapphires, rubies, emeralds, pearls, or the client's own stone. |
| 7 | Enquiry form | What happens next, a WhatsApp alternative, and the same form fields as the homepage: jewellery type, metal type, metal colour (platinum locks to white), stone preference, reference images (up to 3), idea, name, email and contact number. A sticky explainer sits beside the form on desktop. |
| 8 | FAQ | Cost, timing, changes, working from photos, metals and stones. Also emitted as `FAQPage` JSON-LD. |
| 9 | Final CTA | **Start Your Design** and **Chat on WhatsApp**. |
| - | Sticky mobile CTA | Start Your Design plus a WhatsApp button. Appears after the hero and hides at the form and footer. |

### Built for ad campaigns

- **Deep links prefill the form.** For example, `custom.html?type=engagement-ring&stone=blue-sapphire` selects Engagement ring and fills the stone field. Use this to match each ad to the form.
- **Attribution travels with each enquiry.** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` and `utm_term` (or the referrer) are sent in a hidden `Source` field.
- **Analytics events** are pushed to `window.dataLayer` (Google Tag Manager or GA4):
  - `cta_click`
  - `whatsapp_click`
  - `portfolio_filter`
  - `portfolio_view`
  - `design_similar`
  - `form_start`
  - `form_error`
  - `generate_lead`

  Mark `generate_lead` as the conversion in GA4 and in your Meta and Google Ads pixels.

### Before launch

1. **Hero video:** replace `assets/video/custom-hero.webm` with real footage of your craftsmanship, such as a sketch, the bench, setting a stone and the finished piece. Keep it to 6–12 seconds, muted, under about 3MB, in 4:5 or 9:16 framing for phones. Add an MP4 (H.264) source **first** inside the `<video>` so Safari and iPhone play it, and update the poster (`custom-hero-poster.jpg`). `scripts/make-hero-video.mjs` regenerates the current placeholder.
2. **Portfolio:** replace `WORK` in `custom.html` and the images in `assets/portfolio/` with photographs of real commissions (4:5, at least 1200px wide). Real client work is the strongest proof on this page.
3. **Stats:** the 4.9/5 rating, 500+ designs and 3-week average in `CONFIG.stats` are **placeholders**. Use your real figures so the claims are accurate.
4. **Testimonials:** replace `TESTIMONIALS` with real client reviews, with permission.
5. **Form uploads and WhatsApp:** as for the homepage, image uploads need a form app or endpoint that accepts files, and `CONFIG.whatsapp` needs your number.
6. **URL:** publish the page in Shopify as a page template (for example `/pages/custom-jewellery`) and update the canonical URL. The homepage's navigation, menu, category circle, footer and search already link to `custom.html`; change those links to the live URL. The homepage keeps its own short custom section and form for visitors who scroll.

Previews are in `preview/custom-*`. A single-file version with all images and the video embedded is `preview/custom-standalone.html`.

## Responsive layout

One `index.html` serves every screen size, the same way a Shopify theme does.

| Width | Layout |
|---|---|
| Under 768px (phones) | The mobile layout described below. |
| 768–1023px (tablets) | 3-column product grids, collections in a 3-up grid, centered category circles, and wide 8:3 banners. |
| 1024px and up (desktop) | See the list below. |

The desktop layout includes:

- **Header:** a two-row header with the search, "Talk to an expert", logo, account and cart row above a full navigation bar. The nav has dropdowns for Premium Jewellery & Gifting, Gold Jewellery and Gemstones. It's transparent over the hero and turns solid white on scroll or hover.
- **Hero:** a split layout, with copy on plum beside the photograph.
- **Static sections:** the USP strip sits on one static line, and the category circles are centered.
- **Grids:** collections are 3-up; the Premium and Gemstones grids are 4 columns (8 premium pieces); Gold is a 5-up row; reviews are 4-up.
- **Wide banners:** served through `<picture>` from `assets/banners/*-wide.svg` (1920x720).
- **Custom Designs:** the explainer sits in a sticky left column, with the form on the right.
- **Narrower sections:** the expert, newsletter and FAQ sections use a narrower measure, and the newsletter form is inline.
- **Footer:** four columns, with link groups always open.
- **Hidden:** the mobile sticky bar and hamburger menu.

The content width is capped at 1240px. Desktop previews are in `preview/desktop-*`.

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
| 1 | Transparent header | Sits over the hero photo and turns solid white on scroll. The cart count is always visible. |
| 2 | Hero | Brand photography, "Rare Gems, Timeless", **Shop Now** and **Design Your Own**. |
| 3 | USP strip | One line: 300+ Five-Star Reviews · Ready-to-Wear Jewellery · Custom Designs · Expert Guidance. |
| 4 | Category carousel | Swipeable circles by jewellery type. |
| 5 | Premium Jewellery & Gifting | Type tabs and a product grid with swatches, badges and **Add to cart**. |
| 6 | Shop by budget | "Luxury at Every Budget": **Under Rs. 50K** (thoughtful gifts and everyday luxury) and **Above Rs. 50K** (statement and heirloom pieces), each with an explicit "Shop under/above 50K" CTA. |
| 7 | Gold Jewellery | "Gold That Lasts Generations": 18k/22k/24k shortcuts, a product carousel with no banner, and **View All Gold Jewellery**. |
| 8 | Testimonials | "Loved by Our Clients", with review cards linked to products. Placed straight after the products to build trust before the gemstone and custom asks. |
| 9 | Gemstone banner | A single banner: "Find the Gem That's Meant for You" with **Explore Gemstones** and **Set It in a Custom Piece** (cross-sells custom work). Artwork is `assets/banners/gems-feature.svg`. |
| 10 | Custom Designs | Explainer and enquiry form (below). |
| 11 | Expert Guidance | WhatsApp and consultation CTAs. |
| 12 | Newsletter | "Save 10%" on the pink band. |
| 13 | FAQ | Also emitted as `FAQPage` JSON-LD. |
| 14 | Footer | Lockup, link groups, social and secure-checkout badges. |
| - | Sticky bar, cart drawer, welcome offer, search | Unchanged. |

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

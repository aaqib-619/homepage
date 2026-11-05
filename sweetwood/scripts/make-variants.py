"""Make phone-sized WebP variants so phones never download desktop-sized images.

Run: python3 -I sweetwood/scripts/make-variants.py
Writes <name>-<width>w.webp next to each source. index.html picks between them with srcset/sizes.
In Shopify you don't need these: upload the full-size JPG and the theme's image_url filter serves the right width.
"""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')

# source (relative to assets/) -> widths to generate
JOBS = {
    'composed/hero-mobile.webp': [780],
    'composed/card-original.webp': [160, 480, 760],
    'composed/card-hibiscus.webp': [160, 480, 760],
    'composed/card-passion.webp': [160, 480, 760],
    'composed/card-sampler.webp': [240, 480],
    'composed/timeline-trays.webp': [760],
    'amazon/logo-sweetwood-black.webp': [200],
    'amazon/badge-sial-2024.webp': [180],
    'amazon/tray-original.webp': [160, 760],
    'amazon/bottle-original.webp': [160],
    'amazon/bottle-original-back.webp': [160, 760],
    'amazon/ing-capsules.webp': [160],
    'amazon/ing-cinnamon-powder.webp': [160],
    'amazon/ing-cinnamon-and-powder.webp': [600],
    'amazon/ing-hibiscus.webp': [480],
    'amazon/ing-pepper-bowl.webp': [480],
    'amazon/ing-ceylon-quills-tall.webp': [360],
    'amazon/ing-cassia-bundle.webp': [360],
    'amazon/photo-cinnamon-bales.webp': [480],
    'site/photo-hand-hibiscus.webp': [160, 400, 760],
    'site/photo-hand-passion.webp': [160, 760],
    'site/photo-grass-trio.webp': [400],
}
for rel, widths in JOBS.items():
    src = os.path.join(ROOT, rel)
    im = Image.open(src)
    for w in widths:
        if w >= im.width:
            continue
        out = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        dst = src[:-5] + f'-{w}w.webp'
        out.save(dst, 'WEBP', quality=78, method=6)
        print(f'{os.path.relpath(dst, ROOT):45s} {os.path.getsize(dst) // 1024:4d} KB')

"""Copy the chosen cut-outs from the Amazon PDF extraction into sweetwood/assets/amazon/.

Usage: python3 -I sweetwood/scripts/import-amazon-assets.py <extraction-dir>
<extraction-dir> holds cin/m, hib/m and aplus/m (made with pdfimages + merge.py).
Each file is saved as PNG (keeps transparency) and as WebP (smaller, used by the page).
These come from compressed PDFs (max ~800px): replace them with original files before launch.
"""
import os
import sys
from PIL import Image

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'amazon')
os.makedirs(OUT, exist_ok=True)

PICK = {
    # brand
    'logo-sweetwood-black': 'cin/m/p2_012_364x192.png',
    'logo-sds-spices': 'cin/m/p11_097_96x122.png',
    # bottles (transparent)
    'bottle-original': 'cin/m/p1_006_800x800.png',
    'bottle-hibiscus': 'hib/m/p1_008_800x800.png',
    'bottle-passion': 'cin/m/p11_109_800x800.png',
    'bottle-original-back': 'cin/m/p10_081_800x800.png',
    # packs
    'tray-original': 'cin/m/p1_002_800x533.png',
    'tray-hibiscus': 'hib/m/p1_000_800x533.png',
    'box-original': 'cin/m/p10_090_533x800.png',
    'box-hibiscus': 'hib/m/p10_092_800x427.png',
    'trio-flatlay': 'cin/m/p11_094_531x516.png',
    'trio-beach': 'cin/m/p4_029_517x330.png',
    # ingredients
    'ing-cinnamon-hibiscus-powder': 'cin/m/p1_000_800x800.png',
    'ing-cinnamon-bundle': 'cin/m/p5_036_800x436.png',
    'ing-cinnamon-powder': 'cin/m/p6_041_3543x2840.png',
    'ing-cinnamon-quills': 'aplus/m/p14_067_414x281.png',
    'ing-cinnamon-and-powder': 'aplus/m/p8_048_991x773.png',
    'ing-pepper': 'cin/m/p7_054_800x572.png',
    'ing-pepper-bowl': 'aplus/m/p8_050_630x420.png',
    'ing-hibiscus': 'aplus/m/p8_044_506x491.png',
    'ing-hibiscus-leaves': 'aplus/m/p1_005_912x683.png',
    'ing-capsules': 'aplus/m/p9_057_219x219.png',
    'ing-ceylon-quills-tall': 'hib/m/p5_036_793x800.png',
    'ing-cassia-bundle': 'hib/m/p5_038_800x436.png',
    'ing-hibiscus-sprig': 'hib/m/p2_019_800x599.png',
    'ing-cinnamon-sticks': 'hib/m/p7_053_800x494.png',
    # line art
    'sketch-quills-pile': 'cin/m/p4_027_800x558.png',
    'sketch-quill-bundle': 'cin/m/p7_062_720x503.png',
    'sketch-pepper': 'hib/m/p7_055_720x515.png',
    # photos
    'photo-cinnamon-bales': 'cin/m/p11_092_800x435.png',
    'photo-linen-cinnamon': 'aplus/m/p1_000_1464x600.png',
    'photo-hibiscus-flatlay': 'aplus/m/p5_025_1774x363.png',
    'photo-drinking': 'aplus/m/p3_016_751x751.png',
    'photo-capsules': 'cin/m/p6_040_1170x1526.png',
    # badges
    'badge-pure-ceylon': 'cin/m/p3_020_800x403.png',
    'badge-vegan': 'cin/m/p3_022_560x394.png',
    'badge-no-added-sugar': 'cin/m/p3_024_480x480.png',
    'badge-backed-by-science': 'cin/m/p8_066_720x720.png',
    'badge-natural': 'cin/m/p8_068_720x720.png',
    'badge-on-the-go': 'cin/m/p8_070_720x720.png',
    'badge-sial-2024': 'cin/m/p11_107_204x204.png',
    'badge-gmp': 'cin/m/p11_101_256x263.png',
    'badge-haccp': 'cin/m/p11_099_256x263.png',
    'badge-fda-registered': 'cin/m/p11_106_256x256.png',
    'badge-usda-organic': 'cin/m/p11_103_148x128.png',
    'badge-eu-organic': 'cin/m/p11_104_256x170.png',
    'badge-jas': 'cin/m/p11_105_256x132.png',
}

for name, rel in PICK.items():
    im = Image.open(os.path.join(SRC, rel))
    if max(im.size) > 1200:
        im.thumbnail((1200, 1200))
    # Keep PNG only where there is real transparency; photos become JPG for upload.
    has_alpha = im.mode in ('RGBA', 'LA') and im.getchannel('A').getextrema()[0] < 250
    if has_alpha:
        im.save(os.path.join(OUT, name + '.png'), optimize=True)
    else:
        im = im.convert('RGB')
        im.save(os.path.join(OUT, name + '.jpg'), quality=88)
        stale = os.path.join(OUT, name + '.png')
        if os.path.exists(stale):
            os.remove(stale)
    im.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=82, method=6)
    print(f'{name:32s} {im.size[0]}x{im.size[1]}')

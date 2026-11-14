from io import BytesIO
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

ROOT = Path(r"c:\Users\ayaao\rover-letters\public\images")
LEO_OUT = ROOT / "leo"
PIXEL_OUT = ROOT / "pixel"
LEO_OUT.mkdir(parents=True, exist_ok=True)
PIXEL_OUT.mkdir(parents=True, exist_ok=True)

LEO = {
    "leo-idle.png": "WhatsApp Image 2026-10-14 at 14.47.59.jpeg",
    "leo-talk-1.png": "WhatsApp Image 2026-10-14 at 14.48.21.jpeg",
    "leo-talk-2.png": "WhatsApp Image 2026-10-14 at 14.48.37.jpeg",
    "leo-blink.png": "WhatsApp Image 2026-10-14 at 14.48.53.jpeg",
    "leo-side.png": "WhatsApp Image 2026-10-14 at 14.49.07.jpeg",
    "leo-walk-sheet.png": "WhatsApp Image 2026-10-14 at 14.49.30.jpeg",
    "leo-surprise.png": "WhatsApp Image 2026-10-14 at 14.49.44.jpeg",
    "leo-letter.png": "WhatsApp Image 2026-10-14 at 14.49.57.jpeg",
}

PIXEL = {
    "pixel-idle.png": "WhatsApp Image 2026-10-14 at 15.01.14.jpeg",
    "pixel-talk-1.png": "WhatsApp Image 2026-10-14 at 15.01.29.jpeg",
    "pixel-talk-2.png": "WhatsApp Image 2026-10-14 at 15.01.43.jpeg",
    "pixel-blink.png": "WhatsApp Image 2026-10-14 at 15.02.41.jpeg",
    "pixel-walk.png": "WhatsApp Image 2026-10-14 at 15.07.04.jpeg",
    "pixel-surprise.png": "WhatsApp Image 2026-10-14 at 15.07.30.jpeg",
    "pixel-point.png": "WhatsApp Image 2026-10-14 at 15.07.46.jpeg",
}


def crop_alpha(im, pad=4):
    bbox = im.getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return im.crop((l, t, r, b))


print("loading u2net session")
session = new_session("u2net")


def cutout(src_name, dest: Path):
    src = ROOT / src_name
    if not src.exists():
        raise FileNotFoundError(src)
    print("cutting", src_name, "->", dest.name)
    result = remove(src.read_bytes(), session=session)
    im = Image.open(BytesIO(result)).convert("RGBA")
    im = crop_alpha(im)
    im.save(dest, "PNG")
    print("saved", dest, im.size)
    return im


for name, src in LEO.items():
    cutout(src, LEO_OUT / name)

sheet = Image.open(LEO_OUT / "leo-walk-sheet.png").convert("RGBA")
mid = sheet.width // 2
left = crop_alpha(sheet.crop((0, 0, mid, sheet.height)))
right = crop_alpha(sheet.crop((mid, 0, sheet.width, sheet.height)))
left.save(LEO_OUT / "leo-walk-1.png", "PNG")
right.save(LEO_OUT / "leo-walk-2.png", "PNG")
(LEO_OUT / "leo-walk-sheet.png").unlink()
print("saved leo-walk-1.png", left.size)
print("saved leo-walk-2.png", right.size)

for name, src in PIXEL.items():
    cutout(src, PIXEL_OUT / name)

print("done")

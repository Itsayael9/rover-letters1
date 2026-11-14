from io import BytesIO
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

ROOT = Path(r"c:\Users\ayaao\rover-letters\public\images")
ASSETS = Path(r"C:\Users\ayaao\.cursor\projects\c-Users-ayaao-rover-letters\assets")
OUT = ROOT / "pixel"
OUT.mkdir(parents=True, exist_ok=True)

PIXEL = {
    "pixel-idle.png": "WhatsApp_Image_2026-10-14_at_15.01.14",
    "pixel-talk-1.png": "WhatsApp_Image_2026-10-14_at_15.01.29",
    "pixel-blink.png": "WhatsApp_Image_2026-10-14_at_15.02.41",
    "pixel-talk-2.png": "WhatsApp_Image_2026-10-14_at_15.01.43",
    "pixel-walk.png": "WhatsApp_Image_2026-10-14_at_15.07.04",
    "pixel-surprise.png": "WhatsApp_Image_2026-10-14_at_15.07.30",
    "pixel-point.png": "WhatsApp_Image_2026-10-14_at_15.07.46",
}


def find_src(key):
    matches = list(ASSETS.glob(f"*{key}*"))
    if matches:
        return matches[0]
    public = ROOT / (key.replace("_", " ") + ".jpeg")
    if public.exists():
        return public
    raise FileNotFoundError(key)


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


def harden(im, low=28, high=96):
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a <= low:
                px[x, y] = (r, g, b, 0)
            elif a >= high:
                px[x, y] = (r, g, b, 255)
            else:
                na = int(round(255 * (a - low) / (high - low)))
                px[x, y] = (r, g, b, na)
    return im


print("loading u2net session")
session = new_session("u2net")

for dest_name, key in PIXEL.items():
    src = find_src(key)
    print("cutting", src.name, "->", dest_name)
    result = remove(src.read_bytes(), session=session)
    im = harden(Image.open(BytesIO(result)).convert("RGBA"))
    im = crop_alpha(im)
    dest = OUT / dest_name
    im.save(dest, "PNG")
    print("saved", dest.name, im.size)

print("done")

from pathlib import Path
from PIL import Image

src = Path(r"c:\Users\ayaao\rover-letters\public\images")
dst = Path(r"c:\Users\ayaao\rover-letters\public\opportunity")
dst.mkdir(parents=True, exist_ok=True)

mapping = {
    "opp.jpg": "01-opportunity-portrait.jpg",
    "-spirit-and-opportunity.jpg.png": "02-spirit-and-opportunity.jpg",
    "-mission-plan-90-.jpg": "03-mission-plan-90-days.jpg",
    "self-portrait-mars.webp": "03-self-portrait-mars.jpg",
    "launch.jpg": "04-launch.jpg",
    "-cruise-spacecraft.webp": "04b-cruise-spacecraft.jpg",
    "parachute.jpg": "05-parachute.jpg",
    "airbag-landing.jpg": "05c-airbag-landing.jpg",
    "eagle-crater.jpg": "06-eagle-crater.jpg",
    "rover-diagram.jpg": "07-rover-diagram.jpg",
    "solar-panels.jpg": "07b-solar-panels.jpg",
    "wheels.png": "08-wheels.jpg",
    "camera-eyes.jpg": "08b-camera-eyes.jpg",
    "descent-rockets.jpeg": "05b-descent-rockets.jpg",
    "arm-tool.jpg": "09-arm-tool.jpg",
    "9b-antenna.jpg": "09b-antenna.jpg",
    "mars-landscape.jpg": "10-mars-landscape.jpg",
    "blueberries.jpg": "11-blueberries.jpg",
    "-water-evidence.jpg": "12-water-evidence.jpg",
    "tracks.jpg": "13-tracks.jpg",
    "-dusty-panels.jpg": "13b-dusty-panels.jpg",
    "dust-storm.jpg": "14-dust-storm.jpg",
    "farewell.jpg": "15-farewell.jpg",
    "legacy.jpg": "16-legacy.jpg",
}

expected = [
    "01-opportunity-portrait.jpg",
    "02-spirit-and-opportunity.jpg",
    "03-mission-plan-90-days.jpg",
    "03-self-portrait-mars.jpg",
    "04-launch.jpg",
    "04b-cruise-spacecraft.jpg",
    "05-parachute.jpg",
    "05b-descent-rockets.jpg",
    "05c-airbag-landing.jpg",
    "06-eagle-crater.jpg",
    "07-rover-diagram.jpg",
    "07b-solar-panels.jpg",
    "08-wheels.jpg",
    "08b-camera-eyes.jpg",
    "09-arm-tool.jpg",
    "09b-antenna.jpg",
    "10-mars-landscape.jpg",
    "11-blueberries.jpg",
    "12-water-evidence.jpg",
    "13-tracks.jpg",
    "13b-dusty-panels.jpg",
    "14-dust-storm.jpg",
    "15-farewell.jpg",
    "16-legacy.jpg",
    "16b-kids-curiosity.jpg",
]


def save_as_jpg(inp: Path, out: Path) -> None:
    if inp.suffix.lower() in {".jpg", ".jpeg"} and out.suffix.lower() == ".jpg":
        out.write_bytes(inp.read_bytes())
        return
    im = Image.open(inp)
    if im.mode in ("RGBA", "P", "LA"):
        bg = Image.new("RGB", im.size, (255, 246, 235))
        if im.mode == "P":
            im = im.convert("RGBA")
        alpha = im.split()[-1] if im.mode in ("RGBA", "LA") else None
        bg.paste(im, mask=alpha)
        im = bg
    else:
        im = im.convert("RGB")
    im.save(out, "JPEG", quality=90)


done = []
missing_src = []
for sname, dname in mapping.items():
    s = src / sname
    if not s.exists():
        missing_src.append(sname)
        continue
    save_as_jpg(s, dst / dname)
    done.append(dname)

print("PLACED:")
for n in done:
    print(f"  {n} ({(dst / n).stat().st_size} bytes)")

if missing_src:
    print("\nSOURCE MISSING:")
    for n in missing_src:
        print(f"  {n}")

have = {p.name for p in dst.iterdir() if p.is_file() and p.suffix}
print("\nSTILL NEEDED:")
for n in expected:
    if n not in have:
        print(f"  {n}")

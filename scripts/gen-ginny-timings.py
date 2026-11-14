"""Proportional line timings for partNgenny.mp3 (until manual tuning)."""
import re
from pathlib import Path

js = Path(__file__).resolve().parents[1] / "src/data/kids/ingenuity.js"
text = js.read_text(encoding="utf-8")

segment_ids = [
    "meet-ginny",
    "big-ride",
    "my-body",
    "thin-air",
    "super-scout",
    "not-forgotten",
]
durations = [36.6, 44.12, 47.23, 43.47, 43.65, 50.44]

for seg_id, dur in zip(segment_ids, durations, strict=True):
    m = re.search(
        rf'id: "{seg_id}".*?lines: \[(.*?)\],\s*question:',
        text,
        re.S,
    )
    if not m:
        print(f"MISSING {seg_id}")
        continue
    block = m.group(1)
    texts = []
    for match in re.finditer(r'text: en\(\s*"((?:\\.|[^"\\])*)"', block):
        texts.append(bytes(match.group(1), "utf-8").decode("unicode_escape"))
    for match in re.finditer(r"text: en\(\s*\n\s*\"((?:\\.|[^\"\\])*)\"", block):
        pass  # multiline handled below
    # multiline strings
    for match in re.finditer(
        r'text: en\(\s*\n\s*"([^"]*(?:\n\s*"[^"]*)*)"',
        block,
    ):
        t = re.sub(r'\s*\n\s*"', " ", match.group(1))
        t = bytes(t, "utf-8").decode("unicode_escape")
        if t not in texts:
            texts.append(t)

    texts = []
    for line_block in re.finditer(
        r'\{\s*\n\s*id: "(s\d+-\d+)"(.*?)(?=\n\s*\},|\n\s*\{)',
        block,
        re.S,
    ):
        lb = line_block.group(2)
        tm = re.search(
            r"text: en\(\s*\"((?:\\.|[^\"\\])*)\"",
            lb,
            re.S,
        )
        if not tm:
            tm = re.search(
                r"text: en\(\s*\n\s*\"((?:\\.|[^\"\\])*)\"",
                lb,
                re.S,
            )
        if not tm:
            continue
        raw = re.sub(r"\s+", " ", tm.group(1))
        texts.append(raw.replace('\\"', '"'))

    weights = [max(len(t), 1) for t in texts]
    total = sum(weights)
    t0 = 0.0
    print(f"\n{seg_id} ({len(texts)} lines, {dur}s)")
    for j, line_text in enumerate(texts):
        seg = dur * weights[j] / total
        end = t0 + seg
        if j == len(texts) - 1:
            end = dur
        print(f"  [{j}] {t0:.2f} -> {end:.2f}  {line_text[:55]!r}")
        t0 = end
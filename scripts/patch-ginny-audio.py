"""Inject partNgenny clip timings into src/data/kids/ingenuity.js."""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JS = ROOT / "src/data/kids/ingenuity.js"

segment_ids = [
    "meet-ginny",
    "big-ride",
    "my-body",
    "thin-air",
    "super-scout",
    "not-forgotten",
]
durations = [36.6, 44.12, 47.23, 43.47, 43.65, 50.44]


def line_texts(block: str) -> list[str]:
    texts: list[str] = []
    for line_block in re.finditer(
        r'\{\s*\n\s*id: "(s\d+-\d+)"(.*?)(?=\n\s*\},|\n\s*\{)',
        block,
        re.S,
    ):
        lb = line_block.group(2)
        tm = re.search(r'text: en\(\s*"((?:\\.|[^"\\])*)"', lb, re.S)
        if not tm:
            tm = re.search(r'text: en\(\s*\n\s*"((?:\\.|[^"\\])*)"', lb, re.S)
        if not tm:
            continue
        raw = re.sub(r"\s+", " ", tm.group(1)).replace('\\"', '"')
        texts.append(raw)
    return texts


def timings(texts: list[str], dur: float) -> list[tuple[float, float]]:
    weights = [max(len(t), 1) for t in texts]
    total = sum(weights)
    t0 = 0.0
    out: list[tuple[float, float]] = []
    for j, _ in enumerate(texts):
        seg = dur * weights[j] / total
        end = t0 + seg
        if j == len(texts) - 1:
            end = dur
        out.append((round(t0, 2), round(end, 2)))
        t0 = end
    return out


def main() -> None:
    text = JS.read_text(encoding="utf-8")

    header = """const KIDS_AUDIO = {
  part1: "/audio/part1genny.mp3",
  part2: "/audio/part2genny.mp3",
  part3: "/audio/part3genny.mp3",
  part4: "/audio/part4genny.mp3",
  part5: "/audio/part5genny.mp3",
  part6: "/audio/part6genny.mp3",
  correct: (n) => `/audio/correct${n}genny.mp3`,
  wrong: (n) => `/audio/wrong${n}genny.mp3`,
};

const clip = (src, start, end) =>
  start != null && end != null
    ? { audioSrc: src, audioStart: start, audioEnd: end }
    : { audioSrc: src };

const part1Clip = (start, end) => clip(KIDS_AUDIO.part1, start, end);
const part2Clip = (start, end) => clip(KIDS_AUDIO.part2, start, end);
const part3Clip = (start, end) => clip(KIDS_AUDIO.part3, start, end);
const part4Clip = (start, end) => clip(KIDS_AUDIO.part4, start, end);
const part5Clip = (start, end) => clip(KIDS_AUDIO.part5, start, end);
const part6Clip = (start, end) => clip(KIDS_AUDIO.part6, start, end);

"""

    text = re.sub(
        r"/\*\*[\s\S]*?\*/\s*\nconst en",
        '/**\n * Ingenuity kids story — narration in public/audio/*genny.mp3\n * Line times are proportional; tweak audioStart/audioEnd if sync drifts.\n */\n\nconst en',
        text,
        count=1,
    )

    if "KIDS_AUDIO" not in text:
        text = text.replace(
            "const follow = (id, text, extra = {}) => ({\n  lines: [{ id, mood: \"happy\", ...extra, text: en(text) }],\n});\n\n",
            "const follow = (id, text, extra = {}) => ({\n  lines: [{ id, mood: \"happy\", ...extra, text: en(text) }],\n});\n\n"
            + header,
        )

    clip_fn = [
        "part1Clip",
        "part2Clip",
        "part3Clip",
        "part4Clip",
        "part5Clip",
        "part6Clip",
    ]

    for seg_i, (seg_id, dur) in enumerate(zip(segment_ids, durations, strict=True)):
        m = re.search(
            rf'(id: "{seg_id}".*?lines: \[)(.*?)(\],\s*question:)',
            text,
            re.S,
        )
        if not m:
            print(f"segment not found: {seg_id}", file=sys.stderr)
            continue
        block = m.group(2)
        texts = line_texts(block)
        times = timings(texts, dur)
        fn = clip_fn[seg_i]

        def add_clip(mo: re.Match[str]) -> str:
            line_id = mo.group(1)
            idx = int(re.search(r"-(\d+)$", line_id).group(1))
            if seg_id == "meet-ginny":
                line_idx = idx  # s1-0 .. s1-6
            else:
                line_idx = idx - 1  # s2-1 -> 0
            if line_idx >= len(times):
                return mo.group(0)
            start, end = times[line_idx]
            body = mo.group(2)
            if "...part" in body or "audioSrc" in body:
                return mo.group(0)
            # insert before media: or closing of object (before last props)
            insert = f"...{fn}({start}, {end}),\n          "
            if "media:" in body:
                body = re.sub(r"(\n\s*)(media:)", rf"\1{insert}\2", body, count=1)
            else:
                body = body.rstrip() + f"\n          {insert}".rstrip() + "\n        "
            return f'{{\n          id: "{line_id}",{body}}}'

        new_block = re.sub(
            r'\{\s*\n\s*id: "(s\d+-\d+)"(.*?)\n        \}',
            add_clip,
            block,
            flags=re.S,
        )
        text = text[: m.start(2)] + new_block + text[m.end(2) :]

        # question reveals
        n = seg_i + 1
        text = re.sub(
            rf'(id: "{seg_id}"[\s\S]*?reveal: follow\(\s*\n\s*"s{n}-correct",[\s\S]*?\{{)\s*mood:',
            rf"\1\n          audioSrc: KIDS_AUDIO.correct({n}),\n          mood:",
            text,
            count=1,
        )
        text = re.sub(
            rf'(id: "{seg_id}"[\s\S]*?wrongReveal: follow\(\s*\n\s*"s{n}-wrong",[\s\S]*?\{{)\s*mood:',
            rf"\1\n          audioSrc: KIDS_AUDIO.wrong({n}),\n          mood:",
            text,
            count=1,
        )

    JS.write_text(text, encoding="utf-8")
    print("patched", JS)


if __name__ == "__main__":
    main()
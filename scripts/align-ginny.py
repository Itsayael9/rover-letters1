"""Align ingenunity.js line clips to partNgenny.mp3 using Whisper word timestamps."""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "public" / "audio"
JS = ROOT / "src/data/kids/ingenuity.js"

PARTS = [
    ("meet-ginny", "part1genny.mp3", "part1Clip", 7),
    ("big-ride", "part2genny.mp3", "part2Clip", 6),
    ("my-body", "part3genny.mp3", "part3Clip", 7),
    ("thin-air", "part4genny.mp3", "part4Clip", 6),
    ("super-scout", "part5genny.mp3", "part5Clip", 6),
    ("not-forgotten", "part6genny.mp3", "part6Clip", 8),
]


def norm(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9']+", " ", s)
    return " ".join(s.split())


def line_texts(seg_id: str) -> list[str]:
    text = JS.read_text(encoding="utf-8")
    m = re.search(
        rf'id: "{seg_id}".*?lines: \[(.*?)\],\s*question:',
        text,
        re.S,
    )
    if not m:
        raise ValueError(seg_id)
    block = m.group(1)
    out: list[str] = []
    for lb in re.finditer(
        r'\{\s*\n\s*id: "(s\d+-\d+)"(.*?)(?=\n\s*\},)',
        block,
        re.S,
    ):
        body = lb.group(2)
        tm = re.search(
            r'text: en\(\s*"((?:\\.|[^"\\])*)"|'
            r'text: en\(\s*\n\s*"((?:\\.|[^"\\])*)"',
            body,
            re.S,
        )
        if not tm:
            continue
        raw = (tm.group(1) or tm.group(2) or "").replace('\\"', '"')
        raw = re.sub(r"\s+", " ", raw)
        out.append(raw)
    return out


def words_from_mp3(path: Path, model: WhisperModel) -> list[tuple[float, float, str]]:
    segs, _ = model.transcribe(
        str(path),
        word_timestamps=True,
        language="en",
        vad_filter=True,
    )
    words: list[tuple[float, float, str]] = []
    for seg in segs:
        if not seg.words:
            continue
        for w in seg.words:
            words.append((w.start, w.end, w.word.strip()))
    return words


def align(lines: list[str], words: list[tuple[float, float, str]], total: float) -> list[tuple[float, float]]:
    if not words:
        return uniform(len(lines), total)

    tokens = [norm(w[2]) for w in words if norm(w[2])]
    times = [w[0] for w in words]
    end_times = [w[1] for w in words]

    full = " ".join(tokens)
    cursor = 0
    ranges: list[tuple[float, float]] = []

    for i, line in enumerate(lines):
        target = norm(line)
        if not target:
            ranges.append((times[min(cursor, len(times) - 1)], end_times[min(cursor, len(end_times) - 1)]))
            continue
        target_tokens = target.split()
        best_j = cursor
        best_score = -1
        for j in range(cursor, min(len(tokens), cursor + 80)):
            window = " ".join(tokens[j : j + len(target_tokens) + 3])
            hit = sum(1 for t in target_tokens[:4] if t in window[: max(20, len(t) * 4)])
            if hit > best_score:
                best_score = hit
                best_j = j
        start_t = times[best_j]

        if i + 1 < len(lines):
            next_target = norm(lines[i + 1])
            ntok = next_target.split()[:3]
            end_j = best_j
            for j in range(best_j + 1, len(tokens)):
                window = " ".join(tokens[j : j + 5])
                if ntok and all(t in window for t in ntok if len(ntok) > 1):
                    end_j = j
                    break
                end_j = j
            end_t = times[end_j] if end_j < len(times) else end_times[-1]
            end_t = max(start_t + 0.25, end_t - 0.02)
        else:
            end_t = total

        ranges.append((round(start_t, 2), round(end_t, 2)))
        cursor = best_j + max(1, len(target_tokens) // 2)

    # extend each end to next start for gapless UI sync
    for i in range(len(ranges) - 1):
        ranges[i] = (ranges[i][0], ranges[i + 1][0])
    ranges[-1] = (ranges[-1][0], round(total, 2))
    return ranges


def uniform(n: int, total: float) -> list[tuple[float, float]]:
    step = total / n
    return [(round(i * step, 2), round((i + 1) * step, 2)) for i in range(n)]


def duration_ffprobe(path: Path) -> float:
    from mutagen.mp3 import MP3

    return float(MP3(path).info.length)


def main() -> None:
    print("Loading Whisper (base)…", flush=True)
    model = WhisperModel("base", device="cpu", compute_type="int8")
    js = JS.read_text(encoding="utf-8")
    all_timings: dict[str, list[tuple[float, float]]] = {}

    for seg_id, fname, clip_name, expect in PARTS:
        mp3 = AUDIO / fname
        lines = line_texts(seg_id)
        if len(lines) != expect:
            print(f"warn {seg_id}: script {len(lines)} lines, expected {expect}")
        words = words_from_mp3(mp3, model)
        total = duration_ffprobe(mp3)
        ranges = align(lines, words, total)
        all_timings[clip_name] = ranges
        print(fname, " | ".join(f"{a}-{b}" for a, b in ranges))

    for clip_name, ranges in all_timings.items():
        pattern = re.compile(rf"\.\.\.{re.escape(clip_name)}\([\d.]+,\s*[\d.]+\)")
        idx = 0

        def repl(_m: re.Match[str]) -> str:
            nonlocal idx
            a, b = ranges[idx]
            idx += 1
            return f"...{clip_name}({a}, {b})"

        js, n = pattern.subn(repl, js)
        if idx != len(ranges):
            print(f"warn {clip_name}: {idx} replacements for {len(ranges)} ranges")

    js = js.replace(
        "Line times from silence detection",
        "Line times aligned with Whisper word timestamps",
    )
    JS.write_text(js, encoding="utf-8")
    print("Wrote", JS)


if __name__ == "__main__":
    main()
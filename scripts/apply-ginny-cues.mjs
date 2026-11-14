import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const audioDir = path.join(root, "public", "audio");
const jsPath = path.join(root, "src", "data", "kids", "ingenuity.js");

const PARTS = [
  { seg: "meet-ginny", file: "part1genny", clip: "part1Clip", lines: 7 },
  { seg: "big-ride", file: "part2genny", clip: "part2Clip", lines: 6 },
  { seg: "my-body", file: "part3genny", clip: "part3Clip", lines: 7 },
  { seg: "thin-air", file: "part4genny", clip: "part4Clip", lines: 6 },
  { seg: "super-scout", file: "part5genny", clip: "part5Clip", lines: 6 },
  { seg: "not-forgotten", file: "part6genny", clip: "part6Clip", lines: 8 },
];

function lineTexts(segId, source) {
  const m = source.match(
    new RegExp(`id: "${segId}".*?lines: \\[(.*?)\\],\\s*question:`, "s")
  );
  if (!m) return [];
  const block = m[1];
  const out = [];
  for (const lb of block.matchAll(
    /\{\s*\n\s*id: "(s\d+-\d+)"([\s\S]*?)\n        \},/g
  )) {
    const body = lb[2];
    const tm = body.match(
      /text:\s*en\(([\s\S]*?)\),\s*\n\s*(mood|pose|highlight|\.\.\.|media)/
    );
    if (!tm) continue;
    const raw = tm[1]
      .replace(/"/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (raw) out.push(raw);
  }
  return out;
}

function durationSec(file) {
  const r = spawnSync(
    ffmpeg,
    ["-hide_banner", "-i", file, "-f", "null", "-"],
    { encoding: "utf8" }
  );
  const m = (r.stderr || "").match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
  if (!m) return null;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

function speechRuns(file) {
  const r = spawnSync(
    ffmpeg,
    [
      "-hide_banner",
      "-i",
      file,
      "-af",
      "silencedetect=noise=-33dB:d=0.14",
      "-f",
      "null",
      "-",
    ],
    { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
  );
  const log = r.stderr || "";
  const silences = [];
  let start = null;
  for (const line of log.split("\n")) {
    const s = line.match(/silence_start:\s*([\d.]+)/);
    const e = line.match(/silence_end:\s*([\d.]+)/);
    if (s) start = Number(s[1]);
    if (e && start != null) {
      silences.push({ start, end: Number(e[1]) });
      start = null;
    }
  }
  const total = durationSec(file);
  const runs = [];
  let t = 0;
  for (const s of silences) {
    if (s.start - t >= 0.15) runs.push({ start: t, end: s.start });
    t = s.end;
  }
  if (total - t >= 0.1) runs.push({ start: t, end: total });
  return runs;
}

/** Split speech runs into N line ranges (weight by script length). */
function rangesForPart(runs, weights, lineCount) {
  const n = lineCount;
  while (weights.length < n) weights.push(12);
  weights = weights.slice(0, n);

  if (!runs.length) {
    return Array.from({ length: n }, (_, i) => ({ start: i, end: i + 1 }));
  }

  const runDur = runs.map((r) => r.end - r.start);
  const totalDur = runDur.reduce((a, b) => a + b, 0);
  const wsum = weights.reduce((a, b) => a + b, 0);

  const groups = Array.from({ length: n }, () => []);
  let runIdx = 0;

  for (let li = 0; li < n; li++) {
    const want = (weights[li] / wsum) * totalDur;
    let acc = 0;
    while (runIdx < runs.length && (acc < want || groups[li].length === 0)) {
      groups[li].push(runs[runIdx]);
      acc += runDur[runIdx];
      runIdx++;
      if (li < n - 1 && acc >= want) break;
    }
  }
  while (runIdx < runs.length) {
    groups[n - 1].push(runs[runIdx]);
    runIdx++;
  }

  const ranges = groups.map((g) => {
    if (!g.length) return { start: 0, end: 0 };
    return {
      start: g[0].start,
      end: g[g.length - 1].end,
    };
  });

  for (let i = 0; i < n - 1; i++) {
    const gap = ranges[i + 1].start - ranges[i].end;
    if (gap > 0.12) {
      ranges[i].end = Math.max(
        ranges[i].start + 0.3,
        ranges[i].end - Math.min(gap - 0.08, 0.35)
      );
    }
  }

  return ranges.map((r) => ({
    start: Math.round(r.start * 100) / 100,
    end: Math.round(r.end * 100) / 100,
  }));
}

let js = readFileSync(jsPath, "utf8");

for (const p of PARTS) {
  const file = path.join(audioDir, `${p.file}.mp3`);
  const weights = lineTexts(p.seg, js).map((t) => Math.max(t.length, 12));
  const runs = speechRuns(file);
  const ranges = rangesForPart(runs, weights, p.lines);
  console.log(
    `${p.file}`,
    ranges.map((r) => `${r.start}-${r.end}`).join(" | ")
  );

  const re = new RegExp(`\\.\\.\\.${p.clip}\\([\\d.]+,\\s*[\\d.]+\\)`, "g");
  let i = 0;
  js = js.replace(re, () => {
    const r = ranges[i++];
    return `...${p.clip}(${r.start}, ${r.end})`;
  });
}

js = js.replace(
  /Line times .*\./,
  "Line times from partNgenny speech (text clears when each line finishes)."
);

writeFileSync(jsPath, js);
console.log("Updated", jsPath);
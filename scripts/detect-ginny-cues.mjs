import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const audioDir = path.join(root, "public", "audio");

const EXPECTED = {
  part1genny: 7,
  part2genny: 6,
  part3genny: 7,
  part4genny: 6,
  part5genny: 6,
  part6genny: 8,
};

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

function speechSegments(file, opts) {
  const { noiseDb = -32, minSilence = 0.22, minSpeech = 0.35 } = opts;
  const r = spawnSync(
    ffmpeg,
    [
      "-hide_banner",
      "-i",
      file,
      "-af",
      `silencedetect=noise=${noiseDb}dB:d=${minSilence}`,
      "-f",
      "null",
      "-",
    ],
    { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
  );
  const log = `${r.stderr || ""}${r.stdout || ""}`;
  const silences = [];
  let cur = null;
  for (const line of log.split("\n")) {
    const start = line.match(/silence_start:\s*([\d.]+)/);
    const end = line.match(/silence_end:\s*([\d.]+)/);
    if (start) cur = Number(start[1]);
    if (end && cur != null) {
      silences.push({ start: cur, end: Number(end[1]) });
      cur = null;
    }
  }
  const total = durationSec(file);
  if (!total) return [];

  const segs = [];
  let t = 0;
  for (const s of silences) {
    if (s.start > t + minSpeech) segs.push({ start: t, end: s.start });
    t = s.end;
  }
  if (total - t > minSpeech) segs.push({ start: t, end: total });
  return segs;
}

function tune(file, want) {
  const tries = [
    { noiseDb: -28, minSilence: 0.18 },
    { noiseDb: -30, minSilence: 0.2 },
    { noiseDb: -32, minSilence: 0.22 },
    { noiseDb: -34, minSilence: 0.24 },
    { noiseDb: -36, minSilence: 0.26 },
    { noiseDb: -38, minSilence: 0.28 },
    { noiseDb: -32, minSilence: 0.15 },
    { noiseDb: -32, minSilence: 0.3 },
    { noiseDb: -40, minSilence: 0.25 },
  ];
  let best = null;
  for (const o of tries) {
    const segs = speechSegments(file, o);
    const score = Math.abs(segs.length - want);
    if (!best || score < best.score) best = { score, segs, o };
    if (segs.length === want) return segs;
  }
  return best?.segs ?? [];
}

const out = {};
for (const [name, want] of Object.entries(EXPECTED)) {
  const file = path.join(audioDir, `${name}.mp3`);
  const segs = tune(file, want);
  out[name] = segs.map((s) => ({
    start: Math.round(s.start * 100) / 100,
    end: Math.round(s.end * 100) / 100,
  }));
  console.log(
    `${name}: want=${want} got=${segs.length}`,
    segs.map((s) => `${s.start.toFixed(2)}-${s.end.toFixed(2)}`).join(" | ")
  );
}

console.log("\nJSON:");
console.log(JSON.stringify(out, null, 2));
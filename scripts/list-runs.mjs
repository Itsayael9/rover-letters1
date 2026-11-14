import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");
const audioDir = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "public", "audio").replace(/^\/([A-Za-z]:)/, "$1");

function runs(file) {
  const r = spawnSync(
    ffmpeg,
    ["-hide_banner", "-i", file, "-af", "silencedetect=noise=-33dB:d=0.14", "-f", "null", "-"],
    { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
  );
  let st = null;
  const sil = [];
  for (const line of (r.stderr || "").split("\n")) {
    const a = line.match(/silence_start:\s*([\d.]+)/);
    const b = line.match(/silence_end:\s*([\d.]+)/);
    if (a) st = +a[1];
    if (b && st != null) {
      sil.push({ s: st, e: +b[1] });
      st = null;
    }
  }
  const dm = (r.stderr || "").match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
  const d = dm ? +dm[1] * 3600 + +dm[2] * 60 + +dm[3] : 0;
  let t = 0;
  const out = [];
  for (const s of sil) {
    if (s.s - t >= 0.15) out.push([t, s.s]);
    t = s.e;
  }
  if (d - t >= 0.1) out.push([t, d]);
  return out;
}

for (const name of ["part5genny", "part6genny"]) {
  const file = path.join(audioDir, `${name}.mp3`);
  console.log(`\n${name}`);
  runs(file).forEach((x, i) => console.log(String(i).padStart(2), `${x[0].toFixed(2)}-${x[1].toFixed(2)}`));
}
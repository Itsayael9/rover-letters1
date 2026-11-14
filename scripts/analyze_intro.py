from pydub import AudioSegment
import imageio_ffmpeg

ff = imageio_ffmpeg.get_ffmpeg_exe()
AudioSegment.converter = ff
AudioSegment.ffmpeg = ff

audio = AudioSegment.from_file(r"c:\Users\ayaao\rover-letters\public\audio\rover-intro.mp3")
print("duration_ms", len(audio))
print("duration_s", round(len(audio) / 1000, 3))

step = 50
vals = []
for t in range(0, len(audio), step):
    chunk = audio[t : t + step]
    vals.append((t / 1000.0, chunk.rms))

max_rms = max(v for _, v in vals) or 1
print("max_rms", max_rms)

speech = [(t, rms, rms > max_rms * 0.07) for t, rms in vals]
segs = []
cur = None
for t, rms, on in speech:
    if on:
        if cur is None:
            cur = [t, t]
        else:
            cur[1] = t
    elif cur is not None:
        if cur[1] - cur[0] >= 0.12:
            segs.append((round(cur[0], 2), round(cur[1] + 0.05, 2)))
        cur = None
if cur is not None:
    segs.append((round(cur[0], 2), round(cur[1] + 0.05, 2)))

print("SPEECH_SEGS")
for a, b in segs:
    print(f"  {a:.2f} -> {b:.2f}  ({b - a:.2f}s)")

print("\nTIMELINE")
for i, (t, rms) in enumerate(vals):
    if i % 4 == 0:
        bar = int(28 * rms / max_rms)
        mark = "*" if rms > max_rms * 0.07 else "."
        print(f"{t:5.2f} {mark} {('#' * bar)}")

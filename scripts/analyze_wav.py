from pydub import AudioSegment

audio = AudioSegment.from_wav(r"c:\Users\ayaao\rover-letters\scripts\rover-intro.wav")
print("duration_s", round(len(audio) / 1000, 3))

step = 40
vals = []
for t in range(0, len(audio), step):
    vals.append((t / 1000.0, audio[t : t + step].rms))

max_rms = max(v for _, v in vals) or 1
print("max_rms", max_rms)

on_thresh = max_rms * 0.06
segs = []
cur = None
for t, rms in vals:
    on = rms > on_thresh
    if on:
        if cur is None:
            cur = [t, t]
        else:
            cur[1] = t
    elif cur is not None:
        if cur[1] - cur[0] >= 0.10:
            segs.append((round(cur[0], 2), round(cur[1] + 0.04, 2)))
        cur = None
if cur is not None:
    segs.append((round(cur[0], 2), round(cur[1] + 0.04, 2)))

print("SPEECH_SEGS")
for a, b in segs:
    print(f"  {a:.2f} -> {b:.2f}  ({b - a:.2f}s)")

print("\nTIMELINE")
for i, (t, rms) in enumerate(vals):
    if i % 5 == 0:
        bar = int(32 * rms / max_rms)
        mark = "*" if rms > on_thresh else "."
        print(f"{t:5.2f} {mark} {('#' * bar)}")

from pathlib import Path

def mp3_duration(path):
    b = Path(path).read_bytes()
    i = 0
    if b[:3] == b"ID3":
        size = ((b[6] & 0x7f) << 21) | ((b[7] & 0x7f) << 14) | ((b[8] & 0x7f) << 7) | (b[9] & 0x7f)
        i = 10 + size
    rates = {3: {0: 44100, 1: 48000, 2: 32000}, 2: {0: 22050, 1: 24000, 2: 16000}, 0: {0: 11025, 1: 12000, 2: 8000}}
    br_v1 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0]
    br_v2 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0]
    dur = 0
    while i + 4 < len(b):
        if b[i] != 0xff or (b[i + 1] & 0xe0) != 0xe0:
            i += 1
            continue
        ver = (b[i + 1] >> 3) & 3
        layer = (b[i + 1] >> 1) & 3
        br_i = (b[i + 2] >> 4) & 15
        sr_i = (b[i + 2] >> 2) & 3
        pad = (b[i + 2] >> 1) & 1
        if ver == 1 or layer != 1 or br_i in (0, 15) or sr_i == 3 or ver not in rates:
            i += 1
            continue
        sr = rates[ver][sr_i]
        br = (br_v1 if ver == 3 else br_v2)[br_i] * 1000
        spf = 1152 if ver == 3 else 576
        flen = int((spf / 8) * br / sr) + pad
        if flen < 4:
            i += 1
            continue
        dur += spf / sr
        i += flen
    return dur


def splits(dur, texts):
    weights = [len(t) for t in texts]
    total = sum(weights)
    t = 0
    out = []
    for w in weights:
        start = t
        t += dur * w / total
        out.append((round(start, 2), round(t, 2)))
    out[-1] = (out[-1][0], round(dur, 2))
    return out


if __name__ == "__main__":
    root = Path("public/audio")
    segments = [
        ("s2", "second part.mp3", [
            "In July 2003, a giant rocket launched me from Earth.",
            "I traveled for about seven months inside my spaceship.",
            "Landing on Mars is tricky. The air there is very thin, so a parachute alone can't slow me down enough.",
            "So first came the parachute, then small rockets,",
            "and then… giant airbags!",
            "I bounced and rolled across the red ground like a beach ball.",
            "I stopped inside a small crater. That's a bowl-shaped hole in the ground. The scientists cheered, \"Hole in one!\"",
        ]),
        ("s3", "part 3.mp3", [
            "Let me show you my body. Every part has a job!",
            "I don't use gas. My solar panels turn sunlight into energy. They're my lunch box.",
            "My six wheels are my feet. Each one can turn on its own.",
            "My cameras are my eyes. They send pictures to you on Earth.",
            "My arm is a clever hand. It has a rock grinder that scrapes off the dusty outside of a rock. Then a tiny microscope lets me look inside, like a magnifying glass.",
            "My antenna is my phone. And at night I sleep to save my energy!",
        ]),
        ("s4", "part 4.mp3", [
            "Scientists asked a big question: was Mars ever wet?",
            "Scientists don't just guess. They look for evidence. Evidence means clues you can check.",
            "I found tiny round balls hidden in the rock. Scientists call them \"blueberries,\" but they're made of rock!",
            "On Earth, balls like these grow when water soaks into rock. So they were a big clue.",
            "I also found salty minerals, which is another clue. Long ago, Mars was warmer and wetter.",
            "Today it is cold and dry, and the water is long gone.",
        ]),
        ("s5", "part 5.mp3", [
            "I drove slowly, about as fast as a snail. But after years, I drove about 45 kilometers. That's farther than a marathon!",
            "Sometimes dust covered my solar panels. Then the wind blew it away!",
            "In 2018, a giant dust storm covered the sky. It was so dark that my panels couldn't get enough sunlight.",
            "Without sunlight, I had no energy. Scientists called me for months, but I couldn't answer.",
            "In 2019, they said goodbye to my mission.",
        ]),
        ("s6", "part 6.mp3", [
            "I'm still parked on Mars today, in a place called Perseverance Valley.",
            "I'm quiet now, but my discoveries are not. I showed that Mars once had water.",
            "New rovers like Perseverance are following my tracks and exploring more.",
            "I didn't find aliens, but I found the clues that led scientists to ask new questions.",
            "And you can keep asking questions too.",
            "Abandoned… but not forgotten!",
        ]),
    ]
    for key, fname, texts in segments:
        dur = mp3_duration(root / fname)
        print(key, fname, dur)
        print(splits(dur, texts))

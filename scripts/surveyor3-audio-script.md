# Moon kids mode — audio script (Surveyor 3 + Apollo 12)

Use this to generate **English** voice clips. The live app currently uses **browser TTS** (`speakRadio` / line text); these files are for pre-rendered MP3s when you wire them in (same pattern as `public/audio/part 3.mp3` for Opportunity).

---

## Production notes

| Role | Voice direction | Used for |
|------|-----------------|----------|
| **Surveyor 3** | Warm, curious kid-robot; medium pace; slight smile | Story lines, quiz follow-ups, most radio callouts |
| **Houston / Capcom** | Calm adult, radio filter optional | Soil-test confirmations, “you are go” lines |
| **Pete Conrad (Apollo 12)** | Upbeat astronaut, a little faster (`rate ~1.02`) | `apollo12Quote` only |
| **Mission narrator** (optional) | Neutral, documentary | On-screen beat titles if you read those too |

**Format:** MP3, mono or stereo, 44.1 kHz, **−1 dB** peak, light room tone OK.  
**Length:** Short punctuation pauses; quiz hints should sound encouraging, not stern.

**Suggested folder:** `public/surveyor3/audio/`  
**Suggested names:** `{category}-{id}.mp3` (see tables). Keep names URL-safe (no spaces).

---

## A — Surveyor 3 story (quiz + telling)

Spoken in order in **SurveyorSegmentRunner** (`line.text`). One file per line, or one MP3 per chapter (concatenate in order).

### Chapter 1 · meet — `meet-`

| File ID | Spoken text |
|---------|-------------|
| `meet-m1` | Hi! I'm Surveyor 3. I'm a robot lander, about as tall as a person. |
| `meet-m2` | NASA set me down on the Moon on April 20, 1967, in a dark plain called Oceanus Procellarum. |
| `meet-m3` | I don't have wheels. Three landing legs and round footpads hold me up in the dust. |
| `meet-m4` | My solar panel is my lunch. It turns sunlight into power for my camera and radio. |
| `meet-m5` | Now make a guess before I tell you the rest… |

**Quiz 1** (prompt is on screen; optional spoken prompt in `quiz-meet-prompt`):

| File ID | Spoken text |
|---------|-------------|
| `quiz-meet-prompt` | When did Surveyor 3 reach the Moon? |
| `quiz-meet-hint` | Hmm, not that one. The astronauts of Apollo 12 arrived in November 1969. |
| `quiz-meet-right` | April 20, 1967. I waited more than two years so people could walk over and visit me. |
| `quiz-meet-wrong` | I got here first. April 1967 — Apollo 12 didn't arrive until November 1969. |

### Chapter 2 · job — `job-`

| File ID | Spoken text |
|---------|-------------|
| `job-j1` | Before people could land, NASA had one big worry: would a heavy ship sink into the Moon dust? |
| `job-j2` | My footpads pressed into the ground. If they sank, astronauts could not come. |
| `job-j3` | My blue scoop is a little shovel. It digs a trench and feels how hard the soil pushes back. |
| `job-j4` | My TV camera is my eye. It sends pictures of the crater all the way to Earth. |
| `job-j5` | My antenna is my phone. Every number I measure goes to scientists in Houston. |
| `job-j6` | Your turn. What was the job that mattered most? |

**Quiz 2**

| File ID | Spoken text |
|---------|-------------|
| `quiz-job-prompt` | What was Surveyor 3's most important job? |
| `quiz-job-hint` | Hmm, not that one. Think about the footpads and the scoop, not a city. |
| `quiz-job-right` | Yes. The soil was firm — about as strong as damp beach sand. A lunar lander could stand on it. |
| `quiz-job-wrong` | My real job was the soil. If the dust was too soft, Apollo could not land. |

### Chapter 3 · bounce — `bounce-`

| File ID | Spoken text |
|---------|-------------|
| `bounce-b1` | Landing was supposed to be one soft touch. My radar would cut the engines at the right second. |
| `bounce-b2` | Bright rocks in the crater confused that radar. The engines stayed on. |
| `bounce-b3` | I bounced twice, then settled on a slope inside the crater. |
| `bounce-b4` | I was tipped, but my legs, camera, and scoop still worked. The soil test could go on. |
| `bounce-b5` | What should a pilot do if the radar will not turn the engines off? |

**Quiz 3**

| File ID | Spoken text |
|---------|-------------|
| `quiz-bounce-prompt` | The landing radar glitches. What is the safe move? |
| `quiz-bounce-hint` | Hmm, not that one. Engines that stay on push you back off the ground. |
| `quiz-bounce-right` | Cut the engines. I bounced twice because mine stayed lit. Then I could finally rest and dig. |
| `quiz-bounce-wrong` | Leaving the engines on is what made me bounce. A pilot cuts them by hand. |

### Chapter 4 · visit (Surveyor + Intrepid) — `visit-`

| File ID | Spoken text |
|---------|-------------|
| `visit-v1` | On November 19, 1969, Apollo 12's lander Intrepid touched down a short walk from me. |
| `visit-v2` | Pete Conrad and Alan Bean were the crew. They could see me from their window. |
| `visit-v3` | They snipped pieces of me to take home — my camera, scoop parts, and a bit of tubing. |
| `visit-v4` | The Moon has no wind. Their flag stays open on a bar across the top. |
| `visit-v5` | How close did those astronauts land? |

**Quiz 4**

| File ID | Spoken text |
|---------|-------------|
| `quiz-visit-prompt` | How close did Apollo 12 land to Surveyor 3? |
| `quiz-visit-hint` | Hmm, not that one. Conrad joked that Surveyor was right down the middle of the road. |
| `quiz-visit-right` | About 600 feet. Close enough to walk over, say hello, and carry pieces of me back to Earth. |
| `quiz-visit-wrong` | They found me easily. Intrepid landed about 600 feet away — a short Moon walk. |

### Invite card (before 3D game)

| File ID | Spoken text |
|---------|-------------|
| `invite-title` | Want to walk Surveyor Crater and clear Apollo to land? |
| `invite-body` | Click the Moon, follow the green arrow to the safe pad, test the soil, and plant the flag beside Intrepid. |

### Ready line (optional UI)

| File ID | Spoken text |
|---------|-------------|
| `ready-next` | Nice work. Tap Next when you are ready. |

---

## B — Surveyor 3 crater game (radio + beats)

**Beat card** `line` = on-screen only unless you narrate it. **`voice`** = key in `SURVEYOR3_KIDS.radioCallouts` — these are what `SurveyorGame` speaks today.

| `radioCallouts` key | File name | Spoken text |
|-------------------|-----------|-------------|
| `explorationIntro` | `radio-explorationIntro` | Surveyor 3 online. Click the ground and follow the green arrow to the glowing safe pad. |
| `spot1Arrive` | `radio-spot1Arrive` | Safe pad locked. Tap Dig and I will run the scoop until the soil test is finished. |
| `spot1Success` | `radio-spot1Success` | Bearing strength reads 6 PSI — damp beach sand! The surface can hold Intrepid. |
| `spot2Arrive` | `radio-spot2Arrive` | Site two: Surface Sampler claw. Grab a regolith clod and crush-test telemetry for Houston. |
| `spot2Success` | `radio-spot2Success` | Soil test complete. Firm as damp beach sand. Apollo 12 is cleared to land. Call them in. |
| `spot3Arrive` | `radio-spot3Arrive` | Site three: Panoramic camera and landing beacon. Aim at crater landmarks and lock the guide beam. |
| `spot3Success` | `radio-spot3Success` | Houston, this is Surveyor. Pad is safe — Intrepid, you are go for landing! |
| `landingView` | `radio-landingView` | You are looking out Intrepid's window. The engines are easing the lander onto soil my footpads already tested. |
| `flagView` | `radio-flagView` | Visor down. There is no wind up here. When I stop walking, tap once and plant the flag. |
| `stage3Success` | `radio-stage3Success` | The United States flag is on the Moon. Surveyor 3's job is done — Apollo 12 has landed. |
| `apollo12Quote` | `radio-apollo12Quote` | Hey, there it is! Right down the middle of the road! Let's walk down and check out Surveyor 3! |

**Optional beat narrations** (match `gameBeats.*.line`):

| Beat | File name | Spoken text |
|------|-----------|-------------|
| Scout | `beat-search` | Click the crater and follow the green arrow. The glowing ring is a flat, firm pad — the kind Apollo needs. |
| Scoop | `beat-dig` | My blue scoop is a little shovel. Tap Dig and I will test how hard the dust pushes back. |
| Photo | `beat-scan` | My TV camera is my eye. Spin it around so Houston can see the crater walls before a crew arrives. |
| Radio | `beat-notify` | Soil is firm. Pictures are in. Open the dish and call Pete Conrad and Alan Bean — they are go. |
| Land | `beat-landing` | November 1969. Watch Intrepid ease down onto the pad my footpads already tested. |
| Flag | `beat-flag` | There is no wind on the Moon. Tap once and plant the Stars and Stripes beside Intrepid. |

**Legacy / unused in current 3D flow** (generate only if you revive old minigames):

| Key | Spoken text |
|-----|-------------|
| `stage1Intro` | Altitude 10 meters! Tap Cut Vernier Engines inside the green zone to stop the bounce! |
| `stage1Success` | Touchdown confirmed! Settled at 14 degrees inside Surveyor Crater. Deploying robotic scoop! |
| `stage2Intro` | Scissor arm extended. Run all three soil strength tests to clear Apollo 12 for landing. |
| `stage2Success` | Soil bearing strength 6 PSI—solid as damp beach sand! Apollo 12 is cleared to land! |
| `stage3Intro` | Surveyor mission complete! November 1969 astronauts will walk this same crater. |

---

## C — Apollo 12 (Intrepid) — Act II

From `APOLLO12_KIDS.radioCallouts`. **Pete voice** for `apollo12Quote` (shared clip with Surveyor game).

| File name | Spoken text | Voice |
|-----------|-------------|-------|
| `a12-intro` | Houston, Intrepid — Pete Conrad on the ladder. We're 535 feet from Surveyor 3. Time to walk the crater! | Capcom / Pete |
| `a12-siteApproach` | There it is — you can even see the Surveyor footpad! We landed the pointed end of the oval right on the target. | Pete |
| `radio-apollo12Quote` | Hey, there it is! Right down the middle of the road! Let's walk down and check out Surveyor 3! | **Pete Conrad** |
| `a12-artifactTv` | Cutting the TV camera cable… that's 942 days of lunar UV on this mirror. Bag it for the Command Module! | Pete |
| `a12-artifactScoop` | The blue scoop arm still works! Pete's snipping the tubing — real Oceanus Procellarum dirt inside. | Pete |
| `a12-artifactStrut` | Tube cutters on the support strut — engineers want every micrometeorite pit counted back on Earth. | Pete |
| `a12-finale` | All three Surveyor pieces secured! Act II complete — thanks for walking in Pete and Al's boots. | Houston warm |

**Finale screen** (optional):  
`a12-finale-card` — Pete Conrad and Al Bean recovered all three Surveyor 3 artifacts for Earth.

---

## D — Deep dive / exploration spots (optional VO)

| File name | Spoken text |
|-----------|-------------|
| `spot-bearing-voice` | Before Apollo, NASA sent me to press my footpad into the regolith — if I sink, astronauts can't land! |
| `spot-bearing-narration` | Surveyor 3's first job: prove the Oceanus Procellarum dust is firm enough for a 15-ton Lunar Module. |
| `spot-scoop-voice` | My blue scissor arm digs trenches and grabs clods — every crush test radios strength data to Earth. |
| `spot-scoop-narration` | The accordion scoop can dig 17.5 cm deep and measure how hard lunar dirt resists pressure. |
| `spot-beacon-voice` | I spin my mirror camera to map Surveyor Crater and align my solar panel antenna as a landing beacon. |
| `spot-beacon-narration` | Panoramic photos plus a locked beacon guided Apollo 12 to land just 535 feet from this crater rim. |

**Minigame one-liners** (currently TTS strings in `SurveyorMinigames.jsx`):

| File name | Spoken text |
|-----------|-------------|
| `mini-bearing-ok` | Bearing locked at 6 PSI — Apollo safe! |
| `mini-scoop-ok` | Telemetry sent — regolith strength recorded! |
| `mini-beacon-hint` | Slew the mirror to the crater rim, then lock the landing beacon. |
| `mini-beacon-ok` | Beacon locked — Apollo 12 has a guide beam! |

---

## E — One-file chapter exports (like Opportunity)

If you prefer **six long MP3s** instead of dozens of shorts, read each chapter **in table order** with ~0.4 s between lines and ~0.8 s before each quiz block:

1. `surveyor-chapter-meet.mp3` — meet-m1 … meet-m5  
2. `surveyor-chapter-job.mp3` — job-j1 … job-j6  
3. `surveyor-chapter-bounce.mp3` — bounce-b1 … bounce-b5  
4. `surveyor-chapter-visit.mp3` — visit-v1 … visit-v5  
5. `surveyor-game-radio.mp3` — all **B** `radio-*` lines in mission order (optional)  
6. `apollo12-act2.mp3` — a12-intro → siteApproach → apollo12Quote → three artifacts → finale  

---

## F — Wiring checklist (when MP3s exist)

1. Add paths to a map (e.g. `src/data/kids/surveyor3Audio.js`) keyed like `radioCallouts` and line `id`s.  
2. In `SurveyorSegmentRunner`, prefer `line.audioSrc` then fall back to TTS (same as `useKidsVoice`).  
3. In `SurveyorGame`, pass `beat.audioSrc` or replace `CALL[key]` with file URLs.  
4. Reuse **one** `radio-apollo12Quote.mp3` in Surveyor flag beat and Apollo 12 walk-up.

**Total core clips to generate:** ~22 story lines + 16 quiz clips + 11 radio + 6 beat lines + 7 Apollo = **~72** (excluding legacy and optional narration).
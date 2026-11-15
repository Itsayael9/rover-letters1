/**
 * Viking 1 kids story — 5 segments + one question each.
 * Narration audio: /public/audio/viking/part1.mp3 … part5.mp3
 * Quiz audio: answer-correct-1 … 5, answer-wrong-1 … 5
 */

const en = (s) => ({ en: s });

const media = (src, caption, credit, alt) => ({
  src: `/viking/${src}`,
  caption: en(caption),
  credit: en(credit),
  alt: en(alt || caption),
});

const follow = (id, text, extra = {}) => ({
  lines: [{ id, mood: "happy", ...extra, text: en(text) }],
});

const VIKING_AUDIO = {
  s1: "/audio/viking/part1.mp3",
  s2: "/audio/viking/part2.mp3",
  s3: "/audio/viking/part3.mp3",
  s4: "/audio/viking/part4.mp3",
  s5: "/audio/viking/part5.mp3",
  correct: (n) => `/audio/viking/answer-correct-${n}.mp3`,
  wrong: (n) => `/audio/viking/answer-wrong-${n}.mp3`,
};

// Line end times (seconds) from silencedetect on generated MP3s
const CUTS = {
  s1: [2.37, 5.35, 9.79, 14.29, 18.76, 21.97],
  s2: [5.92, 8.4, 14.72, 20.13, 23.52, 23.8],
  s3: [3.91, 4.62, 7.09, 11.98, 15.02, 16.85],
  s4: [1.46, 6.35, 9.66, 12.59, 16.63, 19.72],
  s5: [3.79, 6.3, 12.88, 17.65, 20.1, 23.23, 25.84, 26.12],
};

const clip = (key, i) => {
  const ends = CUTS[key];
  if (!ends || ends[i] == null) return {};
  return { audioSrc: VIKING_AUDIO[key], audioStart: i ? ends[i - 1] : 0, audioEnd: ends[i] };
};

export const VIKING_KIDS = {
  id: "viking-1",
  name: en("Viking 1"),
  nickname: en("Vik"),
  inviteTitle: en("Want to land on Mars with me and see the very first pictures I took?"),
  inviteYes: en("Yes, let's go"),
  inviteNo: en("Not now"),
  missionControlTitle: en("Mission Control coming next"),
  missionControlBody: en("Soon you will help build Vik. This part is on the way!"),
  missionControlBack: en("Back to Mars map"),
  segments: [
    {
      id: "meet-vik",
      title: en("Meet Vik"),
      lines: [
        {
          id: "s1-0",
          text: en("Beep, beep! Hello, space explorer!"),
          mood: "curious",
          pose: "look-up",
          ...clip("s1", 0),
        },
        {
          id: "s1-1",
          text: en("I'm Viking 1, but you can call me Vik!"),
          mood: "happy",
          pose: "wave",
          ...clip("s1", 1),
          media: media("01-viking-lander-portrait.jpg", "The Viking 1 lander", "NASA/JPL-Caltech"),
        },
        {
          id: "s1-2",
          text: en("I'm a Mars lander! No wheels, just three strong legs."),
          mood: "happy",
          highlight: "legs",
          pose: "bounce",
          ...clip("s1", 2),
        },
        {
          id: "s1-3",
          text: en("My job? Explore Mars, study the weather, and take pictures!"),
          mood: "curious",
          highlight: "cameras",
          pose: "look-up",
          ...clip("s1", 3),
        },
        {
          id: "s1-4",
          text: en("My twin, Viking 2, joined me six weeks later."),
          mood: "happy",
          pose: "wave",
          ...clip("s1", 4),
          media: media(
            "02-orbiter-and-lander.jpg",
            "Each Viking had an orbiter and a lander",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s1-5",
          text: en("Now, can you guess what makes me different from a rover?"),
          mood: "surprised",
          pose: "bounce",
          ...clip("s1", 5),
        },
      ],
      question: {
        prompt: en("What kind of machine is Vik?"),
        options: [
          { id: "rover", label: en("A rover that drives around") },
          { id: "lander", label: en("A lander that stays in one place"), correct: true },
          { id: "heli", label: en("A helicopter") },
        ],
        hint: en("Look at my feet. I have legs, not wheels."),
        explanation: en("Yes! I'm a lander. I stay right where I landed."),
        wrongText: en("Not quite! I have legs, not wheels. I'm a lander, and I stay where I landed."),
      },
      reveal: follow("s1-correct", "Yes! I'm a lander. I stay right where I landed.", {
        mood: "happy",
        pose: "bounce",
        audioSrc: VIKING_AUDIO.correct(1),
      }),
      wrongReveal: follow(
        "s1-wrong",
        "Not quite! I have legs, not wheels. I'm a lander, and I stay where I landed.",
        { mood: "happy", highlight: "legs", audioSrc: VIKING_AUDIO.wrong(1) }
      ),
    },
    {
      id: "safe-place",
      title: en("My Journey to Mars"),
      lines: [
        {
          id: "s2-1",
          text: en("My adventure began in August 1975!"),
          mood: "happy",
          pose: "look-up",
          ...clip("s2", 0),
          media: media("03-launch-1975.jpg", "The Viking 1 launch, August 1975", "NASA"),
        },
        {
          id: "s2-2",
          text: en("My friend the orbiter carried me all the way to Mars."),
          mood: "curious",
          pose: "look-up",
          ...clip("s2", 1),
        },
        {
          id: "s2-3",
          text: en("Uh-oh! Our first landing spot was too rocky!"),
          mood: "scared",
          pose: "shake",
          ...clip("s2", 2),
        },
        {
          id: "s2-4",
          text: en("So we found somewhere safer: the Plain of Gold."),
          mood: "happy",
          ...clip("s2", 3),
          media: media("04-landing-site-chryse.jpg", "The Plain of Gold on Mars", "NASA/JPL-Caltech"),
        },
        {
          id: "s2-5",
          text: en("On July 20, 1976... touchdown! I made it!"),
          mood: "surprised",
          pose: "land",
          ...clip("s2", 4),
        },
        {
          id: "s2-6",
          text: en("Seven years after humans first walked on the Moon!"),
          mood: "surprised",
          pose: "shock",
          ...clip("s2", 5),
        },
      ],
      question: {
        prompt: en("Why did the team pick a new landing place?"),
        options: [
          { id: "rocky", label: en("The first place was too rocky"), correct: true },
          { id: "far", label: en("It was too far from Earth") },
          { id: "sunny", label: en("It was too sunny") },
        ],
        hint: en("The orbiter's pictures showed a problem on the ground."),
        explanation: en("Yes! The pictures showed rough ground, so the team chose a safer place."),
        wrongText: en("Good guess! But the problem was rough, rocky ground. Safety first!"),
      },
      reveal: follow(
        "s2-correct",
        "Yes! The pictures showed rough ground, so the team chose a safer place.",
        { mood: "happy", pose: "bounce", audioSrc: VIKING_AUDIO.correct(2) }
      ),
      wrongReveal: follow(
        "s2-wrong",
        "Good guess! But the problem was rough, rocky ground. Safety first!",
        { mood: "happy", pose: "shock", audioSrc: VIKING_AUDIO.wrong(2) }
      ),
    },
    {
      id: "first-picture",
      title: en("My First Picture"),
      lines: [
        {
          id: "s3-1",
          text: en("Guess what I photographed first on Mars?"),
          mood: "happy",
          highlight: "cameras",
          pose: "look-up",
          ...clip("s3", 0),
        },
        {
          id: "s3-2",
          text: en("My own foot! Ha-ha!"),
          mood: "curious",
          highlight: "legs",
          pose: "bounce",
          ...clip("s3", 1),
          media: media(
            "05-first-image-footpad.jpg",
            "The first picture from the surface of Mars",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s3-3",
          text: en("It helped show that I'd landed safely."),
          mood: "happy",
          highlight: "legs",
          ...clip("s3", 2),
        },
        {
          id: "s3-4",
          text: en("The next day, I sent Earth's first color picture from the Martian surface!"),
          mood: "happy",
          pose: "wave",
          ...clip("s3", 3),
          media: media("06-first-color-image.jpg", "The first color picture of Mars", "NASA/JPL-Caltech"),
        },
        {
          id: "s3-5",
          text: en("I even photographed beautiful sunsets."),
          mood: "happy",
          ...clip("s3", 4),
          media: media("07-sunset.jpg", "A sunset on Mars seen by Viking 1", "NASA/JPL-Caltech"),
        },
        {
          id: "s3-6",
          text: en("Pretty amazing, right?"),
          mood: "happy",
          pose: "wave",
          ...clip("s3", 5),
        },
      ],
      question: {
        prompt: en("What was Vik's very first picture of?"),
        options: [
          { id: "foot", label: en("My own foot"), correct: true },
          { id: "alien", label: en("A tiny alien") },
          { id: "sun", label: en("The Sun") },
        ],
        hint: en("I wanted to check the ground I was standing on."),
        explanation: en("Yes! My foot showed I was safe on solid ground."),
        wrongText: en("Fun guess! But my first picture was my own foot, to check the ground."),
      },
      reveal: follow("s3-correct", "Yes! My foot showed I was safe on solid ground.", {
        mood: "happy",
        pose: "bounce",
        audioSrc: VIKING_AUDIO.correct(3),
      }),
      wrongReveal: follow(
        "s3-wrong",
        "Fun guess! But my first picture was my own foot, to check the ground.",
        { mood: "happy", highlight: "legs", audioSrc: VIKING_AUDIO.wrong(3) }
      ),
    },
    {
      id: "soil-scientist",
      title: en("The Mystery of Mars"),
      lines: [
        {
          id: "s4-1",
          text: en("But wait! I had a BIG mystery to solve."),
          mood: "surprised",
          pose: "shock",
          ...clip("s4", 0),
          media: media("08-lander-diagram.jpg", "The parts of the Viking lander", "NASA"),
        },
        {
          id: "s4-2",
          text: en("Could tiny living things exist on Mars?"),
          mood: "curious",
          highlight: "lab",
          pose: "look-up",
          ...clip("s4", 1),
        },
        {
          id: "s4-3",
          text: en("With my robot arm, I scooped up red soil."),
          mood: "happy",
          highlight: "arm",
          pose: "scoop",
          ...clip("s4", 2),
          media: media("09-trenches.jpg", "Trenches dug by the soil scoop", "NASA/JPL-Caltech"),
        },
        {
          id: "s4-4",
          text: en("My instruments searched for clues of life!"),
          mood: "curious",
          highlight: "lab",
          ...clip("s4", 3),
        },
        {
          id: "s4-5",
          text: en("No clear proof... but so many discoveries!"),
          mood: "happy",
          ...clip("s4", 4),
        },
        {
          id: "s4-6",
          text: en("And I sent weather reports back to Earth, too!"),
          mood: "happy",
          highlight: "dish",
          pose: "call",
          ...clip("s4", 5),
        },
      ],
      question: {
        prompt: en("What was Vik's scoop for?"),
        options: [
          { id: "rain", label: en("Catching rain") },
          { id: "dig", label: en("Digging up soil to test it"), correct: true },
          { id: "paint", label: en("Painting rocks") },
        ],
        hint: en("I was a soil scientist."),
        explanation: en("Right! I scooped soil and tested it."),
        wrongText: en("Close! My scoop dug up soil so I could test it."),
      },
      reveal: follow("s4-correct", "Right! I scooped soil and tested it.", {
        mood: "happy",
        highlight: "arm",
        pose: "arm-up",
        audioSrc: VIKING_AUDIO.correct(4),
      }),
      wrongReveal: follow("s4-wrong", "Close! My scoop dug up soil so I could test it.", {
        mood: "happy",
        highlight: "arm",
        pose: "arm-up",
        audioSrc: VIKING_AUDIO.wrong(4),
      }),
    },
    {
      id: "not-forgotten",
      title: en("Never Forgotten"),
      lines: [
        {
          id: "s5-1",
          text: en("For six amazing years, I explored Mars."),
          mood: "happy",
          pose: "bounce",
          ...clip("s5", 0),
        },
        {
          id: "s5-2",
          text: en("Then, in 1982... my messages stopped."),
          mood: "sad",
          pose: "droop",
          ...clip("s5", 1),
        },
        {
          id: "s5-3",
          text: en("My team tried to reach me, but I couldn't answer."),
          mood: "sad",
          highlight: "dish",
          pose: "droop",
          ...clip("s5", 2),
        },
        {
          id: "s5-4",
          text: en("Years later, a spacecraft spotted me from above."),
          mood: "happy",
          ...clip("s5", 3),
          media: media("10-mro-view-2006.jpg", "Viking 1 seen from space in 2006", "NASA/JPL/University of Arizona"),
        },
        {
          id: "s5-5",
          text: en("I'm still here, on Mars."),
          mood: "happy",
          ...clip("s5", 4),
        },
        {
          id: "s5-6",
          text: en("And now... you know my story."),
          mood: "happy",
          pose: "wave",
          ...clip("s5", 5),
        },
        {
          id: "s5-7",
          text: en("Thank you for remembering me."),
          mood: "happy",
          pose: "wave",
          ...clip("s5", 6),
        },
        {
          id: "s5-8",
          text: en("Abandoned, yes. Forgotten? Never!"),
          mood: "happy",
          pose: "wave",
          ...clip("s5", 7),
        },
      ],
      question: {
        prompt: en("Where is Vik today?"),
        options: [
          { id: "mars", label: en("Still on Mars"), correct: true },
          { id: "earth", label: en("Back on Earth") },
          { id: "moon", label: en("On the Moon") },
        ],
        hint: en("I never left."),
        explanation: en("Yes! I'm still on Mars, and I'm not forgotten."),
        wrongText: en("Not quite! I never left Mars. I'm still on the Plain of Gold."),
      },
      reveal: follow("s5-correct", "Yes! I'm still on Mars, and I'm not forgotten.", {
        mood: "happy",
        pose: "wave",
        audioSrc: VIKING_AUDIO.correct(5),
      }),
      wrongReveal: follow(
        "s5-wrong",
        "Not quite! I never left Mars. I'm still on the Plain of Gold.",
        { mood: "happy", pose: "bounce", audioSrc: VIKING_AUDIO.wrong(5) }
      ),
    },
  ],
};

export default VIKING_KIDS;
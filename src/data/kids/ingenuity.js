/**
 * Ingenuity kids story — narration in public/audio/*genny.mp3
 * Line times: speech bursts + script length (tune audioStart/audioEnd if one line drifts).
 */

const en = (s) => ({ en: s });

const media = (src, caption, credit, alt) => ({
  src: `/ingenuity/${src}`,
  caption: en(caption),
  credit: en(credit),
  alt: en(alt || caption),
});

const follow = (id, text, extra = {}) => ({
  lines: [{ id, mood: "happy", ...extra, text: en(text) }],
});

const KIDS_AUDIO = {
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

export const INGENUITY_KIDS = {
  id: "ingenuity",
  name: en("Ingenuity"),
  nickname: en("Ginny"),
  inviteTitle: en(
    "Want to see how I got to Mars — and become the engineer who builds me and sends me flying?"
  ),
  inviteYes: en("Yes, let's go"),
  inviteNo: en("Not now"),
  playGameLabel: en("Play the mini-game"),
  missionControlTitle: en("Mission Control coming next"),
  missionControlBody: en(
    "Soon you will help build Ginny and send her to fly on Mars. This part is on the way!"
  ),
  missionControlBack: en("Back to Mars map"),
  segments: [
    {
      id: "meet-ginny",
      title: en("Hi! My name is Ingenuity"),
      lines: [
        {
          id: "s1-0",
          text: en("Hmm… it's so quiet and so cold here. Wait… is someone there?"),
          mood: "sleepy",
          pose: "yawn",
          ...part1Clip(0.19, 5.05),
        },
        {
          id: "s1-1",
          text: en("Hi! I'm Ingenuity, but my friends call me Ginny!"),
          mood: "happy",
          pose: "wave",
          ...part1Clip(6.5, 10.09),
          media: media(
            "01-ingenuity-on-mars.jpg",
            "Ingenuity, the Mars helicopter",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s1-2",
          text: en(
            "I'm a helicopter, and I'm tiny! I weigh about the same as two bags of sugar."
          ),
          mood: "happy",
          pose: "bounce",
          ...part1Clip(10.41, 15.51),
        },
        {
          id: "s1-3",
          text: en(
            "My blades are about four feet wide, from one tip to the other."
          ),
          mood: "happy",
          highlight: "blades",
          pose: "fly",
          ...part1Clip(15.84, 19.48),
        },
        {
          id: "s1-4",
          text: en(
            "I was built for a test. The scientists asked: can a helicopter fly on Mars?"
          ),
          mood: "curious",
          pose: "look-up",
          ...part1Clip(19.83, 25.25),
        },
        {
          id: "s1-5",
          text: en(
            "They planned for me to make no more than five test flights, in about one month."
          ),
          mood: "happy",
          ...part1Clip(25.6, 29.69),
          media: media(
            "01b-test-flights-plan.jpg",
            "Ginny was planned for only five test flights",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s1-6",
          text: en("Now make a guess before I tell you…"),
          mood: "surprised",
          pose: "bounce",
          ...part1Clip(30.25, 36.4),
        },
      ],
      question: {
        prompt: en("How many flights did Ginny really make on Mars?"),
        options: [
          { id: "5", label: en("5 flights") },
          { id: "20", label: en("20 flights") },
          { id: "72", label: en("72 flights"), correct: true },
        ],
        hint: en("Think way bigger than five!"),
        explanation: en(
          "Seventy-two flights! That's more than fourteen times the plan. Not bad for a tiny helicopter!"
        ),
        wrongText: en(
          "Good guess! Most people guess smaller. But I flew 72 times!"
        ),
      },
      reveal: follow(
        "s1-correct",
        "Seventy-two flights! That's more than fourteen times the plan. Not bad for a tiny helicopter!",
        {
          audioSrc: KIDS_AUDIO.correct(1),
          mood: "surprised", pose: "shock" }
      ),
      wrongReveal: follow(
        "s1-wrong",
        "Good guess! Most people guess smaller. But I flew 72 times!",
        {
          audioSrc: KIDS_AUDIO.wrong(1),
          mood: "happy", pose: "bounce" }
      ),
    },

    {
      id: "big-ride",
      title: en("The big ride"),
      lines: [
        {
          id: "s2-1",
          text: en("On July 30, 2020, a giant rocket launched from Earth. I was on board!"),
          mood: "surprised",
          pose: "look-up",
          ...part2Clip(0, 6.95),
          media: media("02-launch.jpg", "The rocket that carried Ginny to Mars", "NASA"),
        },
        {
          id: "s2-2",
          text: en(
            "But I didn't fly there. I rode strapped under the belly of my big friend, Perseverance, the Mars rover."
          ),
          mood: "happy",
          pose: "curl",
          ...part2Clip(7.17, 17.18),
          media: media(
            "02b-under-perseverance.jpg",
            "Ginny rode under the belly of Perseverance",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s2-3",
          text: en(
            "It was a long, dark trip. I stayed folded up and very quiet, like a baby koala holding on tight."
          ),
          mood: "sleepy",
          pose: "curl",
          ...part2Clip(17.51, 28.43),
        },
        {
          id: "s2-4",
          text: en("On February 18, 2021, we landed in a place called Jezero Crater."),
          mood: "happy",
          pose: "bounce",
          ...part2Clip(28.84, 34.77),
          media: media(
            "02c-jezero-crater.jpg",
            "Jezero Crater on Mars",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s2-5",
          text: en(
            "About six weeks later, I was turned upright, so my legs pointed down and my blades pointed up."
          ),
          mood: "curious",
          pose: "wave",
          ...part2Clip(35.23, 41.56),
          media: media(
            "02d-turned-upright.jpg",
            "Ginny turned upright under Perseverance",
            "NASA/JPL-Caltech/MSSS"
          ),
        },
        {
          id: "s2-6",
          text: en("Now came the scary part. It was almost time to fly!"),
          mood: "scared",
          pose: "shake",
          ...part2Clip(41.89, 43.89),
        },
      ],
      question: {
        prompt: en("How did Ginny travel to Mars?"),
        options: [
          { id: "balloon", label: en("Inside a giant balloon") },
          {
            id: "rover",
            label: en("Strapped under the rover Perseverance"),
            correct: true,
          },
          { id: "rocket", label: en("On her own tiny rocket") },
        ],
        hint: en("I had a big rover friend with a very strong belly."),
        explanation: en(
          "Yes! Perseverance gave me a piggyback ride all the way to Mars."
        ),
        wrongText: en(
          "Not quite! My ride was my friend Perseverance. I held on under its belly."
        ),
      },
      reveal: follow(
        "s2-correct",
        "Yes! Perseverance gave me a piggyback ride all the way to Mars.",
        {
          audioSrc: KIDS_AUDIO.correct(2),
          mood: "happy", pose: "bounce" }
      ),
      wrongReveal: follow(
        "s2-wrong",
        "Not quite! My ride was my friend Perseverance. I held on under its belly.",
        {
          audioSrc: KIDS_AUDIO.wrong(2),
          mood: "happy", pose: "bounce" }
      ),
    },

    {
      id: "my-body",
      title: en("My body and tools"),
      lines: [
        {
          id: "s3-1",
          text: en(
            "Hey, explorer! Want to see what makes me fly? Every part of my tiny body has a special job!"
          ),
          mood: "happy",
          pose: "wave",
          ...part3Clip(0, 6.95),
          media: media(
            "03-anatomy.jpg",
            "The parts of Ingenuity",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s3-2",
          text: en(
            "My blades are super light and spin really fast to lift me through Mars's thin air!"
          ),
          mood: "happy",
          highlight: "blades",
          pose: "fly",
          ...part3Clip(7.19, 12.64),
          media: media("03b-blades.jpg", "Ginny's blades", "NASA/JPL-Caltech"),
        },
        {
          id: "s3-3",
          text: en(
            "See that solar panel on my head? It catches sunlight to charge my batteries. That's how I get my energy!"
          ),
          mood: "happy",
          highlight: "solar",
          ...part3Clip(13.01, 22.78),
          media: media(
            "03c-solar-panel.jpg",
            "Ginny's solar panel",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s3-4",
          text: en(
            "Inside, I have a little computer that acts like my brain, helping me fly safely."
          ),
          mood: "happy",
          highlight: "avionics",
          ...part3Clip(22.97, 28.28),
        },
        {
          id: "s3-5",
          text: en(
            "My cameras are my eyes, my sensors help me balance, and my antenna lets me talk to Perseverance!"
          ),
          mood: "curious",
          highlight: "sensors",
          pose: "call",
          ...part3Clip(28.46, 37.87),
        },
        {
          id: "s3-6",
          text: en(
            "And my little legs help me land, while my heaters keep my electronics warm during freezing Martian nights!"
          ),
          mood: "happy",
          highlight: "legs",
          pose: "land",
          ...part3Clip(38.14, 41.05),
        },
        {
          id: "s3-7",
          text: en(
            "Pretty clever for such a tiny helicopter, right? Now, can you remember what gives me energy?"
          ),
          mood: "curious",
          pose: "bounce",
          ...part3Clip(41.99, 47.23),
        },
      ],
      question: {
        prompt: en("Which part helps recharge Ginny's batteries?"),
        options: [
          { id: "legs", label: en("The legs") },
          { id: "solar", label: en("The solar panel"), correct: true },
          { id: "blades", label: en("The blades") },
        ],
        hint: en("It sits on top and loves the Sun."),
        explanation: en("Exactly! Sunlight keeps my batteries charged!"),
        wrongText: en(
          "It's my solar panel! It collects energy from the Sun."
        ),
      },
      reveal: follow(
        "s3-correct",
        "Exactly! Sunlight keeps my batteries charged!",
        {
          audioSrc: KIDS_AUDIO.correct(3),
          mood: "happy", highlight: "solar" }
      ),
      wrongReveal: follow(
        "s3-wrong",
        "It's my solar panel! It collects energy from the Sun.",
        {
          audioSrc: KIDS_AUDIO.wrong(3),
          mood: "happy", highlight: "solar" }
      ),
    },

    {
      id: "thin-air",
      title: en("Flying in thin air"),
      lines: [
        {
          id: "s4-1",
          text: en("Flying on Mars is super hard. The air there is very, very thin!"),
          mood: "curious",
          pose: "look-up",
          ...part4Clip(0, 5.55),
          media: media(
            "04-thin-air.jpg",
            "The thin sky of Mars",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s4-2",
          text: en(
            "It's less than one percent as dense as Earth's air. It's like trying to swim in a pool with almost no water!"
          ),
          mood: "surprised",
          pose: "shock",
          ...part4Clip(5.71, 14.31),
        },
        {
          id: "s4-3",
          text: en(
            "That's why my body is tiny, and my blades are super light and spin incredibly fast!"
          ),
          mood: "happy",
          highlight: "blades",
          ...part4Clip(14.46, 20.89),
        },
        {
          id: "s4-4",
          text: en(
            "On April 19, 2021, I spun my blades, lifted off the ground… and flew!"
          ),
          mood: "happy",
          pose: "takeoff",
          ...part4Clip(21.11, 30.85),
          media: media(
            "04b-first-flight.jpg",
            "Ginny's first flight on Mars",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s4-5",
          text: en(
            "I became the first aircraft to make a powered, controlled flight on another planet!"
          ),
          mood: "surprised",
          pose: "bounce",
          ...part4Clip(31.14, 38.85),
        },
        {
          id: "s4-6",
          text: en(
            'People called it my "Wright Brothers moment," because the Wright brothers made the first successful powered, controlled airplane flight on Earth.'
          ),
          mood: "happy",
          pose: "wave",
          ...part4Clip(39.47, 43.22),
        },
      ],
      question: {
        prompt: en("Why is flying on Mars so hard?"),
        options: [
          { id: "clouds", label: en("There are too many clouds") },
          { id: "thin", label: en("The air is very thin"), correct: true },
          { id: "gravity", label: en("Mars has no gravity") },
        ],
        hint: en("Think about the air around my blades. Is there a lot of it?"),
        explanation: en(
          "Yes! With so little air, my blades have much less air to push on!"
        ),
        wrongText: en(
          "Not quite! It's the thin air. My blades have to work extra hard to lift me!"
        ),
      },
      reveal: follow(
        "s4-correct",
        "Yes! With so little air, my blades have much less air to push on!",
        {
          audioSrc: KIDS_AUDIO.correct(4),
          mood: "happy", pose: "bounce" }
      ),
      wrongReveal: follow(
        "s4-wrong",
        "Not quite! It's the thin air. My blades have to work extra hard to lift me!",
        {
          audioSrc: KIDS_AUDIO.wrong(4),
          mood: "happy", pose: "shock" }
      ),
    },

    {
      id: "super-scout",
      title: en("A super scout"),
      lines: [
        {
          id: "s5-1",
          text: en(
            "My test was supposed to end after five flights. But I just kept going!"
          ),
          mood: "happy",
          pose: "fly",
          ...part5Clip(0, 7.65),
          media: media(
            "05-flight-log.jpg",
            "Ginny's flight log",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s5-2",
          text: en(
            "I flew for almost three years. In total, I was in the air for about 129 minutes. That's more than two hours!"
          ),
          mood: "happy",
          pose: "fly",
          ...part5Clip(8.21, 17.4),
        },
        {
          id: "s5-3",
          text: en(
            "I flew about 17 kilometers, that's about 10 miles, all together."
          ),
          mood: "happy",
          pose: "fly",
          ...part5Clip(17.65, 25.98),
        },
        {
          id: "s5-4",
          text: en(
            "I went as high as 24 meters. That's taller than a seven-story building! And I went as fast as a racing bike."
          ),
          mood: "surprised",
          pose: "takeoff",
          ...part5Clip(26.28, 36.81),
        },
        {
          id: "s5-5",
          text: en(
            "Then I got a new job: scout! I flew ahead to look at the ground, so Perseverance knew where to explore."
          ),
          mood: "curious",
          highlight: "sensors",
          pose: "look-up",
          ...part5Clip(37.17, 40.03),
          media: media(
            "05b-scout-view.jpg",
            "What Ginny's camera saw while scouting",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s5-6",
          text: en("I was Perseverance's eyes in the sky!"),
          mood: "happy",
          pose: "wave",
          ...part5Clip(40.54, 43.41),
        },
      ],
      question: {
        prompt: en("What was Ginny's new job after her test flights?"),
        options: [
          { id: "digging", label: en("Digging holes in the ground") },
          { id: "scout", label: en("Scout for Perseverance"), correct: true },
          { id: "mail", label: en("Delivering Mars mail") },
        ],
        hint: en("I flew ahead and looked at the path."),
        explanation: en("Yes! I flew ahead so Perseverance could choose where to go."),
        wrongText: en(
          "Fun idea! But my real job was scout. I flew ahead and looked at the path."
        ),
      },
      reveal: follow(
        "s5-correct",
        "Yes! I flew ahead so Perseverance could choose where to go.",
        {
          audioSrc: KIDS_AUDIO.correct(5),
          mood: "happy", pose: "fly" }
      ),
      wrongReveal: follow(
        "s5-wrong",
        "Fun idea! But my real job was scout. I flew ahead and looked at the path.",
        {
          audioSrc: KIDS_AUDIO.wrong(5),
          mood: "happy", pose: "wave" }
      ),
    },

    {
      id: "not-forgotten",
      title: en("Not forgotten"),
      lines: [
        {
          id: "s6-1",
          text: en("On January 18, 2024, I took to the Martian sky for the very last time."),
          mood: "sad",
          pose: "land",
          ...part6Clip(0, 6.07),
          media: media(
            "06-last-flight.jpg",
            "Ginny's last flight",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s6-2",
          text: en(
            "During my final landing, my rotor blades were damaged. That meant I couldn't fly anymore."
          ),
          mood: "sad",
          pose: "droop",
          ...part6Clip(6.6, 12.21),
        },
        {
          id: "s6-3",
          text: en(
            "On January 25, the scientists announced that my flying mission was complete."
          ),
          mood: "sad",
          pose: "droop",
          ...part6Clip(12.84, 17.56),
        },
        {
          id: "s6-4",
          text: en(
            "I'm still resting on Mars, but I proved something amazing: helicopters really can fly on another planet!"
          ),
          mood: "happy",
          pose: "bounce",
          ...part6Clip(17.92, 25.11),
          media: media(
            "06c-legacy.jpg",
            "Ginny proved that flying on Mars is possible",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s6-5",
          text: en(
            "And my story isn't over! NASA is developing ideas for future Mars helicopters, building on everything I taught them."
          ),
          mood: "happy",
          pose: "fly",
          ...part6Clip(25.43, 33.16),
          media: media(
            "06b-skyfall.jpg",
            "The next-generation Mars helicopters, SkyFall",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s6-6",
          text: en(
            "Maybe one day, new helicopters will explore places no rover can reach!"
          ),
          mood: "curious",
          pose: "look-up",
          ...part6Clip(33.54, 38.66),
        },
        {
          id: "s6-7",
          text: en(
            "So even though my blades have stopped spinning, my discoveries will keep inspiring new adventures."
          ),
          mood: "happy",
          pose: "fly",
          ...part6Clip(38.96, 44.97),
        },
        {
          id: "s6-8",
          text: en("Abandoned… but never forgotten!"),
          mood: "happy",
          pose: "wave",
          ...part6Clip(48.15, 50.26),
        },
      ],
      question: {
        prompt: en("What was Ginny's biggest achievement?"),
        options: [
          { id: "birds", label: en("Finding Martian birds") },
          {
            id: "first",
            label: en(
              "Making the first powered, controlled flight on another planet"
            ),
            correct: true,
          },
          { id: "rover", label: en("Turning into a rover") },
        ],
        hint: en("Remember my Wright Brothers moment!"),
        explanation: en("Yes! I made history by flying on another world!"),
        wrongText: en(
          "Fun guess! But I was the first aircraft to make a powered, controlled flight on another planet!"
        ),
      },
      reveal: follow(
        "s6-correct",
        "Yes! I made history by flying on another world!",
        {
          audioSrc: KIDS_AUDIO.correct(6),
          mood: "happy",
          pose: "wave",
          media: media(
            "04b-first-flight.jpg",
            "Ginny's first flight on Mars",
            "NASA/JPL-Caltech"
          ),
        }
      ),
      wrongReveal: follow(
        "s6-wrong",
        "Fun guess! But I was the first aircraft to make a powered, controlled flight on another planet!",
        {
          audioSrc: KIDS_AUDIO.wrong(6),
          mood: "happy",
          pose: "bounce",
          media: media(
            "04b-first-flight.jpg",
            "Ginny's first flight on Mars",
            "NASA/JPL-Caltech"
          ),
        }
      ),
    },
  ],
};

export default INGENUITY_KIDS;
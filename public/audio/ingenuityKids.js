/**
 * Ingenuity kids story — 6 segments + one question each.
 * Same format as OPPORTUNITY_KIDS.
 * A first wrong answer shows hint. A correct answer speaks reveal.
 * A second wrong answer speaks wrongReveal instead.
 *
 * Audio: no audio files yet. When the voice is generated, add to each line
 *   audioSrc: "/audio/ingenuity-partN.mp3", audioStart: 0, audioEnd: 3.5
 * (same idea as the clip() helper in the Opportunity file). Until then the
 * browser voice reads the text.
 *
 * Poses for the cartoon (Ingenuity.jsx): wave, bounce, shake, fly, takeoff, land,
 * look-up, shock, curl, droop, yawn, call
 * Highlights: blades, antenna, solar, batteries, avionics, sensors, legs
 *
 * Photo checklist (filenames under /public/ingenuity/):
 *  01-ingenuity-on-mars.jpg
 *  01b-test-flights-plan.jpg
 *  02-launch.jpg
 *  02b-under-perseverance.jpg
 *  02c-jezero-crater.jpg
 *  02d-turned-upright.jpg
 *  03-anatomy.jpg
 *  03b-blades.jpg
 *  03c-solar-panel.jpg
 *  04-thin-air.jpg
 *  04b-first-flight.jpg
 *  05-flight-log.jpg
 *  05b-scout-view.jpg
 *  06-last-flight.jpg
 *  06b-skyfall.jpg
 *  06c-legacy.jpg
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

export const INGENUITY_KIDS = {
  id: "ingenuity",
  name: en("Ingenuity"),
  nickname: en("Ginny"),
  inviteTitle: en(
    "Want to see how I got to Mars — and become the engineer who builds me and sends me flying?"
  ),
  inviteYes: en("Yes, let's go"),
  inviteNo: en("Not now"),
  missionControlTitle: en("Mission Control coming next"),
  missionControlBody: en(
    "Soon you will help build Ginny and send her to fly on Mars. This part is on the way!"
  ),
  missionControlBack: en("Back to Mars map"),
  segments: [
    // ------------------------------------------------------------------
    // 1. Hi! My name is Ingenuity
    // ------------------------------------------------------------------
    {
      id: "meet-ginny",
      title: en("Hi! My name is Ingenuity"),
      lines: [
        {
          id: "s1-0",
          text: en("Hmm… it's so quiet and so cold here. Wait… is someone there?"),
          mood: "sleepy",
          pose: "yawn",
        },
        {
          id: "s1-1",
          text: en("Hi! I'm Ingenuity, but my friends call me Ginny!"),
          mood: "happy",
          pose: "wave",
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
        },
        {
          id: "s1-3",
          text: en(
            "My blades are about four feet wide, from one tip to the other."
          ),
          mood: "happy",
          highlight: "blades",
          pose: "fly",
        },
        {
          id: "s1-4",
          text: en(
            "I was built for a test. The scientists asked: can a helicopter fly on Mars?"
          ),
          mood: "curious",
          pose: "look-up",
        },
        {
          id: "s1-5",
          text: en(
            "They planned for me to make no more than five test flights, in about one month."
          ),
          mood: "happy",
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
        { mood: "surprised", pose: "shock" }
      ),
      wrongReveal: follow(
        "s1-wrong",
        "Good guess! Most people guess smaller. But I flew 72 times!",
        { mood: "happy", pose: "bounce" }
      ),
    },

    // ------------------------------------------------------------------
    // 2. The big ride
    // ------------------------------------------------------------------
    {
      id: "big-ride",
      title: en("The big ride"),
      lines: [
        {
          id: "s2-1",
          text: en("On July 30, 2020, a giant rocket launched from Earth. I was on board!"),
          mood: "surprised",
          pose: "look-up",
          media: media("02-launch.jpg", "The rocket that carried Ginny to Mars", "NASA"),
        },
        {
          id: "s2-2",
          text: en(
            "But I didn't fly there. I rode strapped under the belly of my big friend, Perseverance, the Mars rover."
          ),
          mood: "happy",
          pose: "curl",
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
        },
        {
          id: "s2-4",
          text: en("On February 18, 2021, we landed in a place called Jezero Crater."),
          mood: "happy",
          pose: "bounce",
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
        { mood: "happy", pose: "bounce" }
      ),
      wrongReveal: follow(
        "s2-wrong",
        "Not quite! My ride was my friend Perseverance. I held on under its belly.",
        { mood: "happy", pose: "bounce" }
      ),
    },

    // ------------------------------------------------------------------
    // 3. My body and tools (the 7 real parts)
    // ------------------------------------------------------------------
    {
      id: "my-body",
      title: en("My body and tools"),
      lines: [
        {
          id: "s3-1",
          text: en("Let me show you my body. Every part has a job!"),
          mood: "happy",
          pose: "wave",
          media: media(
            "03-anatomy.jpg",
            "The parts of Ingenuity",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s3-2",
          text: en(
            "My blades are made of super-light carbon fiber, with foam inside. They help me lift off in Mars's thin air."
          ),
          mood: "happy",
          highlight: "blades",
          pose: "fly",
          media: media("03b-blades.jpg", "Ginny's blades", "NASA/JPL-Caltech"),
        },
        {
          id: "s3-3",
          text: en(
            "On top, I have a solar panel. It's my lunch box! It keeps my battery charged with sunlight."
          ),
          mood: "happy",
          highlight: "solar",
          media: media(
            "03c-solar-panel.jpg",
            "Ginny's solar panel",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s3-4",
          text: en(
            "My batteries store that energy. It's enough for one 90-second flight every Martian day."
          ),
          mood: "curious",
          highlight: "batteries",
        },
        {
          id: "s3-5",
          text: en(
            "Inside my body is my brain, called avionics. It helps me fly and find my way. And heaters keep me warm on freezing Mars nights."
          ),
          mood: "happy",
          highlight: "avionics",
        },
        {
          id: "s3-6",
          text: en(
            "My sensors feel how fast I'm going and in which direction. And my cameras are my eyes!"
          ),
          mood: "curious",
          highlight: "sensors",
          pose: "look-up",
        },
        {
          id: "s3-7",
          text: en(
            "My antenna is my phone. It talks to Earth through Perseverance and the satellites around Mars."
          ),
          mood: "happy",
          highlight: "antenna",
          pose: "call",
        },
        {
          id: "s3-8",
          text: en(
            "And my legs are super-light carbon fiber tubes. They help me land softly after every flight."
          ),
          mood: "happy",
          highlight: "legs",
          pose: "land",
        },
      ],
      question: {
        prompt: en("Which part keeps Ginny's battery charged?"),
        options: [
          { id: "legs", label: en("The legs") },
          { id: "solar", label: en("The solar panel"), correct: true },
          { id: "blades", label: en("The blades") },
        ],
        hint: en("It sits on top and loves the Sun."),
        explanation: en("Right! Sunlight is my food."),
        wrongText: en(
          "Close! It's my solar panel on top. Sunlight charges my batteries."
        ),
      },
      reveal: follow("s3-correct", "Right! Sunlight is my food.", {
        mood: "happy",
        highlight: "solar",
      }),
      wrongReveal: follow(
        "s3-wrong",
        "Close! It's my solar panel on top. Sunlight charges my batteries.",
        { mood: "happy", highlight: "solar" }
      ),
    },

    // ------------------------------------------------------------------
    // 4. Flying in thin air
    // ------------------------------------------------------------------
    {
      id: "thin-air",
      title: en("Flying in thin air"),
      lines: [
        {
          id: "s4-1",
          text: en("Flying on Mars is super hard. The air there is very, very thin."),
          mood: "curious",
          pose: "look-up",
          media: media(
            "04-thin-air.jpg",
            "The thin sky of Mars",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s4-2",
          text: en(
            "It's less than one percent as thick as the air on Earth. It's like trying to swim in a pool with almost no water!"
          ),
          mood: "surprised",
          pose: "shock",
        },
        {
          id: "s4-3",
          text: en(
            "That's why my body is tiny and my blades are super light."
          ),
          mood: "happy",
          highlight: "blades",
        },
        {
          id: "s4-4",
          text: en(
            "On April 19, 2021, I spun my blades, lifted off the ground… and flew!"
          ),
          mood: "happy",
          pose: "takeoff",
          media: media(
            "04b-first-flight.jpg",
            "Ginny's first flight on Mars",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s4-5",
          text: en("It was the first time any aircraft flew on another planet!"),
          mood: "surprised",
          pose: "bounce",
        },
        {
          id: "s4-6",
          text: en(
            "People called it my \"Wright Brothers moment.\" The Wright brothers built the first airplane that flew on Earth."
          ),
          mood: "happy",
          pose: "wave",
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
          "Yes! With so little air, my blades have almost nothing to push on."
        ),
        wrongText: en(
          "Not quite! It's the thin air. My blades have much less air to push on."
        ),
      },
      reveal: follow(
        "s4-correct",
        "Yes! With so little air, my blades have almost nothing to push on.",
        { mood: "happy", pose: "bounce" }
      ),
      wrongReveal: follow(
        "s4-wrong",
        "Not quite! It's the thin air. My blades have much less air to push on.",
        { mood: "happy", pose: "shock" }
      ),
    },

    // ------------------------------------------------------------------
    // 5. A super scout
    // ------------------------------------------------------------------
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
        },
        {
          id: "s5-3",
          text: en(
            "I flew about 17 kilometers, that's about 10 miles, all together."
          ),
          mood: "happy",
          pose: "fly",
        },
        {
          id: "s5-4",
          text: en(
            "I went as high as 24 meters. That's taller than a seven-story building! And I went as fast as a racing bike."
          ),
          mood: "surprised",
          pose: "takeoff",
        },
        {
          id: "s5-5",
          text: en(
            "Then I got a new job: scout! I flew ahead to look at the ground, so Perseverance knew where to explore."
          ),
          mood: "curious",
          highlight: "sensors",
          pose: "look-up",
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
        { mood: "happy", pose: "fly" }
      ),
      wrongReveal: follow(
        "s5-wrong",
        "Fun idea! But my real job was scout. I flew ahead and looked at the path.",
        { mood: "happy", pose: "wave" }
      ),
    },

    // ------------------------------------------------------------------
    // 6. Not forgotten
    // ------------------------------------------------------------------
    {
      id: "not-forgotten",
      title: en("Not forgotten"),
      lines: [
        {
          id: "s6-1",
          text: en("On January 18, 2024, I flew for the very last time."),
          mood: "sad",
          pose: "land",
          media: media(
            "06-last-flight.jpg",
            "Ginny's last flight",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s6-2",
          text: en(
            "My landing was rough and my blades got damaged, so I can't fly anymore."
          ),
          mood: "sad",
          pose: "droop",
        },
        {
          id: "s6-3",
          text: en(
            "A week later, on January 25, the scientists said my mission was complete."
          ),
          mood: "sad",
          pose: "droop",
        },
        {
          id: "s6-4",
          text: en(
            "I'm still parked on Mars. But I showed everyone that flying on another planet is possible!"
          ),
          mood: "happy",
          pose: "bounce",
          media: media(
            "06c-legacy.jpg",
            "Ginny proved that flying on Mars is possible",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s6-5",
          text: en(
            "Now NASA is planning new helicopters called SkyFall. They will look for safe places to land and for ice under the ground."
          ),
          mood: "happy",
          pose: "fly",
          media: media(
            "06b-skyfall.jpg",
            "The next-generation Mars helicopters, SkyFall",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s6-6",
          text: en("And you can keep asking questions too. What else could fly on other worlds?"),
          mood: "curious",
          pose: "look-up",
        },
        {
          id: "s6-7",
          text: en("Abandoned… but not forgotten!"),
          mood: "happy",
          pose: "wave",
        },
      ],
      question: {
        prompt: en("What was Ginny's biggest achievement?"),
        options: [
          { id: "birds", label: en("Finding Martian birds") },
          {
            id: "first",
            label: en("Being the first aircraft to fly on another planet"),
            correct: true,
          },
          { id: "rover", label: en("Turning into a rover") },
        ],
        hint: en("Remember my Wright Brothers moment."),
        explanation: en("Yes! The first flight on another world. That's real science."),
        wrongText: en(
          "Fun guess! But my real achievement was being the first to fly on another planet."
        ),
      },
      reveal: follow(
        "s6-correct",
        "Yes! The first flight on another world. That's real science.",
        {
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
        "Fun guess! But my real achievement was being the first to fly on another planet.",
        {
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

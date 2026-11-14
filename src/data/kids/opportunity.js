/**
 * Opportunity kids story — 6 segments + one question each.
 * A first wrong answer shows hint. A correct answer speaks reveal.
 * A second wrong answer speaks wrongReveal instead.
 *
 * Photo checklist (filenames under /public/opportunity/):
 *  01-opportunity-portrait.jpg
 *  02-spirit-and-opportunity.jpg
 *  03-mission-plan-90-days.jpg
 *  03-self-portrait-mars.jpg
 *  04-launch.jpg
 *  04b-cruise-spacecraft.jpg
 *  05-parachute.jpg
 *  05b-descent-rockets.jpg
 *  05c-airbag-landing.jpg
 *  06-eagle-crater.jpg
 *  07-rover-diagram.jpg
 *  07b-solar-panels.jpg
 *  08-wheels.jpg
 *  08b-camera-eyes.jpg
 *  09-arm-tool.jpg
 *  09b-antenna.jpg
 *  10-mars-landscape.jpg
 *  11-blueberries.jpg
 *  12-water-evidence.jpg
 *  13-tracks.jpg
 *  13b-dusty-panels.jpg
 *  14-dust-storm.jpg
 *  15-farewell.jpg
 *  16-legacy.jpg
 */

const en = (s) => ({ en: s });

const media = (src, caption, credit, alt) => ({
  src: `/opportunity/${src}`,
  caption: en(caption),
  credit: en(credit),
  alt: en(alt || caption),
});

const follow = (id, text, extra = {}) => ({
  lines: [{ id, text: en(text), mood: extra.mood || "happy", ...extra, text: en(text) }],
});

const KIDS_AUDIO = {
  part0: "/audio/part0.mp3",
  intro: "/audio/opp-intro.mp3",
  part2: "/audio/second part.mp3",
  part3: "/audio/part 3.mp3",
  part4: "/audio/part 4.mp3",
  part5: "/audio/part 5.mp3",
  part6: "/audio/part 6.mp3",
  correct: (n) => `/audio/answer correct ${n}.mp3`,
  wrong: (n) => `/audio/answer wrong${n}.mp3`,
};

const clip = (src, start, end) =>
  start != null && end != null
    ? { audioSrc: src, audioStart: start, audioEnd: end }
    : { audioSrc: src };

const introClip = (start, end) => clip(KIDS_AUDIO.intro, start, end);
const part2Clip = (start, end) => clip(KIDS_AUDIO.part2, start, end);
const part3Clip = (start, end) => clip(KIDS_AUDIO.part3, start, end);
const part4Clip = (start, end) => clip(KIDS_AUDIO.part4, start, end);
const part5Clip = (start, end) => clip(KIDS_AUDIO.part5, start, end);
const part6Clip = (start, end) => clip(KIDS_AUDIO.part6, start, end);

export const OPPORTUNITY_KIDS = {
  id: "opportunity",
  name: en("Opportunity"),
  nickname: en("Opp"),
  inviteTitle: en(
    "Want to see how my trip began — and become the scientist who sent me to Mars?"
  ),
  inviteYes: en("Yes, let's go"),
  inviteNo: en("Not now"),
  playGameLabel: en("Play the mini-game"),
  missionControlTitle: en("Mission Control coming next"),
  missionControlBody: en(
    "Soon you will help build and launch Opp. This part is on the way!"
  ),
  missionControlBack: en("Back to Mars map"),
  segments: [
    {
      id: "meet-opp",
      title: en("Hi! My name is Opportunity"),
      lines: [
        {
          id: "s1-0",
          text: en("Oh… why is the sky so red today? Is it morning on Mars already?"),
          mood: "sleepy",
          pose: "yawn",
          ...clip(KIDS_AUDIO.part0),
        },
        {
          id: "s1-1",
          text: en("Hi! I'm Opportunity, but you can call me Opp!"),
          mood: "happy",
          pose: "wave",
          ...introClip(0, 3.33),
          media: media(
            "01-opportunity-portrait.jpg",
            "Opportunity, the Mars rover",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s1-2",
          text: en(
            "I'm a robot. Real people built me, and I'm about as big as a golf cart."
          ),
          mood: "happy",
          pose: "bounce",
          ...introClip(3.33, 8.61),
        },
        {
          id: "s1-3",
          text: en(
            "My job is to be a geologist. That's a scientist who studies rocks, because rocks tell stories about the past."
          ),
          mood: "curious",
          highlight: "arm",
          pose: "arm-up",
          ...introClip(8.61, 16.57),
        },
        {
          id: "s1-4",
          text: en(
            "I have a twin named Spirit. She landed on Mars three weeks before me!"
          ),
          mood: "happy",
          pose: "wave",
          ...introClip(16.57, 21.57),
          media: media(
            "02-spirit-and-opportunity.jpg",
            "Twin rovers Spirit and Opportunity",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s1-5",
          text: en(
            "The scientists planned for me to work for 90 days. That's about one school term."
          ),
          mood: "happy",
          ...introClip(21.57, 27.43),
          media: media(
            "03-mission-plan-90-days.jpg",
            "Opp was planned for only 90 days",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s1-6",
          text: en("Now make a guess before I tell you…"),
          mood: "surprised",
          pose: "bounce",
          ...introClip(27.43, 30.04),
        },
      ],
      question: {
        prompt: en("How long did Opp really work on Mars?"),
        options: [
          { id: "3m", label: en("About 3 months") },
          { id: "1y", label: en("About 1 year") },
          { id: "14y", label: en("About 14 years"), correct: true },
        ],
        hint: en("Think bigger than one school term. Much bigger!"),
        explanation: en(
          "Fourteen years! That's more than 55 times longer than planned. The engineers built me tough!"
        ),
        wrongText: en(
          "Good guess! Most people guess smaller. But I kept going for 14 years!"
        ),
      },
      reveal: follow(
        "s1-correct",
        "Fourteen years! That's more than 55 times longer than planned. The engineers built me tough!",
        {
          mood: "surprised",
          pose: "shock",
          audioSrc: KIDS_AUDIO.correct(1),
          media: media(
            "03-self-portrait-mars.jpg",
            "A self-portrait of Opportunity on Mars",
            "NASA/JPL-Caltech/Cornell Univ."
          ),
        }
      ),
      wrongReveal: follow(
        "s1-wrong",
        "Good guess! Most people guess smaller. But I kept going for 14 years!",
        {
          mood: "happy",
          audioSrc: KIDS_AUDIO.wrong(1),
          media: media(
            "03-self-portrait-mars.jpg",
            "A self-portrait of Opportunity on Mars",
            "NASA/JPL-Caltech/Cornell Univ."
          ),
        }
      ),
    },
    {
      id: "big-bounce",
      title: en("The big bounce"),
      lines: [
        {
          id: "s2-1",
          text: en("In July 2003, a giant rocket launched me from Earth."),
          mood: "surprised",
          pose: "look-up",
          ...part2Clip(0, 4.01),
          media: media(
            "04-launch.jpg",
            "Opportunity's rocket launch, July 2003",
            "NASA"
          ),
        },
        {
          id: "s2-2",
          text: en(
            "I traveled for about seven months inside my spaceship."
          ),
          mood: "sleepy",
          pose: "curl",
          ...part2Clip(4.01, 8.17),
          media: media(
            "04b-cruise-spacecraft.jpg",
            "Opp's trip through space to Mars",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s2-3",
          text: en(
            "Landing on Mars is tricky. The air there is very thin, so a parachute alone can't slow me down enough."
          ),
          mood: "scared",
          pose: "look-up",
          ...part2Clip(8.17, 16.04),
          media: media(
            "05-parachute.jpg",
            "The parachute that slowed Opp down",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s2-4",
          text: en("So first came the parachute, then small rockets,"),
          mood: "scared",
          pose: "shake",
          ...part2Clip(16.04, 19.74),
          media: media(
            "05b-descent-rockets.jpg",
            "Rockets firing during landing",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s2-5",
          text: en("and then… giant airbags!"),
          mood: "surprised",
          pose: "bounce",
          ...part2Clip(19.74, 21.59),
          media: media(
            "05c-airbag-landing.jpg",
            "The airbag landing",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s2-6",
          text: en(
            "I bounced and rolled across the red ground like a beach ball."
          ),
          mood: "surprised",
          highlight: "wheels",
          pose: "roll",
          ...part2Clip(21.59, 26.29),
        },
        {
          id: "s2-7",
          text: en(
            "I stopped inside a small crater. That's a bowl-shaped hole in the ground. The scientists cheered, \"Hole in one!\""
          ),
          mood: "happy",
          pose: "wave",
          ...part2Clip(26.29, 34.93),
          media: media(
            "06-eagle-crater.jpg",
            "First view from Eagle Crater",
            "NASA/JPL-Caltech"
          ),
        },
      ],
      question: {
        prompt: en("Why did Opp need airbags?"),
        options: [
          { id: "water", label: en("To float on water") },
          {
            id: "cushion",
            label: en("To cushion the landing so I didn't break"),
            correct: true,
          },
          { id: "warm", label: en("To keep me warm at night") },
        ],
        hint: en("They were soft, like a pillow around me."),
        explanation: en("Yes! Airbags are like a soft pillow for a robot."),
        wrongText: en(
          "Not quite! The airbags were my pillow. They protected me from the bumpy landing."
        ),
      },
      reveal: follow(
        "s2-correct",
        "Yes! Airbags are like a soft pillow for a robot.",
        { mood: "happy", pose: "bounce", audioSrc: KIDS_AUDIO.correct(2) }
      ),
      wrongReveal: follow(
        "s2-wrong",
        "Not quite! The airbags were my pillow. They protected me from the bumpy landing.",
        { mood: "happy", pose: "bounce", audioSrc: KIDS_AUDIO.wrong(2) }
      ),
    },
    {
      id: "my-tools",
      title: en("My body and tools"),
      lines: [
        {
          id: "s3-1",
          text: en("Let me show you my body. Every part has a job!"),
          mood: "happy",
          pose: "wave",
          ...part3Clip(0, 3.52),
          media: media(
            "07-rover-diagram.jpg",
            "The parts of Opportunity",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s3-2",
          text: en(
            "I don't use gas. My solar panels turn sunlight into energy. They're my lunch box."
          ),
          mood: "happy",
          highlight: "panels",
          pose: "shine",
          ...part3Clip(3.52, 9.71),
          media: media(
            "07b-solar-panels.jpg",
            "Opp's solar panels",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s3-3",
          text: en(
            "My six wheels are my feet. Each one can turn on its own."
          ),
          mood: "happy",
          highlight: "wheels",
          pose: "roll",
          ...part3Clip(9.71, 13.99),
          media: media(
            "08-wheels.jpg",
            "Opportunity's wheels in Mars sand",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s3-4",
          text: en(
            "My cameras are my eyes. They send pictures to you on Earth."
          ),
          mood: "curious",
          highlight: "camera",
          pose: "shine",
          ...part3Clip(13.99, 18.5),
          media: media(
            "08b-camera-eyes.jpg",
            "Opp's camera mast — the eyes",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s3-5",
          text: en(
            "My arm is a clever hand. It has a rock grinder that scrapes off the dusty outside of a rock. Then a tiny microscope lets me look inside, like a magnifying glass."
          ),
          mood: "happy",
          highlight: "arm",
          pose: "arm-up",
          ...part3Clip(18.5, 30.81),
          media: media(
            "09-arm-tool.jpg",
            "Opportunity's arm studying a rock",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s3-6",
          text: en(
            "My antenna is my phone. And at night I sleep to save my energy!"
          ),
          mood: "sleepy",
          highlight: "antenna",
          pose: "yawn",
          ...part3Clip(30.81, 35.63),
          media: media(
            "09b-antenna.jpg",
            "Opp's antenna talking to Earth",
            "NASA/JPL-Caltech"
          ),
        },
      ],
      question: {
        prompt: en("Which part of Opp works like a magnifying glass?"),
        options: [
          { id: "wheels", label: en("The wheels") },
          { id: "antenna", label: en("The antenna") },
          { id: "microscope", label: en("The arm's microscope"), correct: true },
        ],
        hint: en("It sits on my arm and zooms in on tiny things."),
        explanation: en("Right! It lets me see tiny details that eyes can't."),
        wrongText: en(
          "Close! The microscope on my arm zooms in on tiny things, like a magnifying glass."
        ),
      },
      reveal: follow(
        "s3-correct",
        "Right! It lets me see tiny details that eyes can't.",
        {
          mood: "happy",
          highlight: "arm",
          pose: "arm-up",
          audioSrc: KIDS_AUDIO.correct(3),
        }
      ),
      wrongReveal: follow(
        "s3-wrong",
        "Close! The microscope on my arm zooms in on tiny things, like a magnifying glass.",
        {
          mood: "happy",
          highlight: "arm",
          pose: "arm-up",
          audioSrc: KIDS_AUDIO.wrong(3),
        }
      ),
    },
    {
      id: "water-clue",
      title: en("The water detective"),
      lines: [
        {
          id: "s4-1",
          text: en("Scientists asked a big question: was Mars ever wet?"),
          mood: "curious",
          pose: "look-up",
          ...part4Clip(0, 4.02),
          media: media(
            "10-mars-landscape.jpg",
            "The landscape Opportunity explored",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s4-2",
          text: en(
            "Scientists don't just guess. They look for evidence. Evidence means clues you can check."
          ),
          mood: "curious",
          ...part4Clip(4.02, 10.96),
        },
        {
          id: "s4-3",
          text: en(
            "I found tiny round balls hidden in the rock. Scientists call them \"blueberries,\" but they're made of rock!"
          ),
          mood: "surprised",
          pose: "shock",
          ...part4Clip(10.96, 19.32),
          media: media(
            "11-blueberries.jpg",
            "Hematite \"blueberries\" on Mars",
            "NASA/JPL-Caltech/Cornell"
          ),
        },
        {
          id: "s4-4",
          text: en(
            "On Earth, balls like these grow when water soaks into rock. So they were a big clue."
          ),
          mood: "happy",
          pose: "shock",
          ...part4Clip(19.32, 25.95),
        },
        {
          id: "s4-5",
          text: en(
            "I also found salty minerals, which is another clue. Long ago, Mars was warmer and wetter."
          ),
          mood: "happy",
          ...part4Clip(25.95, 32.97),
          media: media(
            "12-water-evidence.jpg",
            "Rocks that hold clues about ancient water",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s4-6",
          text: en("Today it is cold and dry, and the water is long gone."),
          mood: "sad",
          pose: "droop",
          ...part4Clip(32.97, 37.15),
        },
      ],
      question: {
        prompt: en("Which one is evidence that water was once on Mars?"),
        options: [
          { id: "berries", label: en("The blueberry rocks"), correct: true },
          { id: "red", label: en("Mars is red") },
          { id: "far", label: en("Mars is far away") },
        ],
        hint: en("Look for the rocks I found, not how Mars looks."),
        explanation: en(
          "Yes! Those rocks grew in water, so they were real evidence."
        ),
        wrongText: en(
          "Good thinking! But the clue was the blueberry rocks. They only form when water is around."
        ),
      },
      reveal: follow(
        "s4-correct",
        "Yes! Those rocks grew in water, so they were real evidence.",
        { mood: "happy", pose: "bounce", audioSrc: KIDS_AUDIO.correct(4) }
      ),
      wrongReveal: follow(
        "s4-wrong",
        "Good thinking! But the clue was the blueberry rocks. They only form when water is around.",
        { mood: "happy", pose: "shock", audioSrc: KIDS_AUDIO.wrong(4) }
      ),
    },
    {
      id: "long-drive",
      title: en("A very long drive"),
      lines: [
        {
          id: "s5-1",
          text: en(
            "I drove slowly, about as fast as a snail. But after years, I drove about 45 kilometers. That's farther than a marathon!"
          ),
          mood: "happy",
          highlight: "wheels",
          pose: "roll",
          ...part5Clip(0, 9.83),
          media: media(
            "13-tracks.jpg",
            "Wheel tracks left by Opportunity",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s5-2",
          text: en(
            "Sometimes dust covered my solar panels. Then the wind blew it away!"
          ),
          mood: "happy",
          highlight: "panels",
          pose: "shine",
          ...part5Clip(9.83, 15.36),
          media: media(
            "13b-dusty-panels.jpg",
            "Dust on Opp's solar panels",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s5-3",
          text: en(
            "In 2018, a giant dust storm covered the sky. It was so dark that my panels couldn't get enough sunlight."
          ),
          mood: "angry",
          highlight: "panels",
          pose: "shake",
          ...part5Clip(15.36, 23.95),
          media: media(
            "14-dust-storm.jpg",
            "A dust storm darkening the Martian sky",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s5-4",
          text: en(
            "Without sunlight, I had no energy. Scientists called me for months, but I couldn't answer."
          ),
          mood: "sad",
          highlight: "antenna",
          pose: "droop",
          ...part5Clip(23.95, 31.38),
        },
        {
          id: "s5-5",
          text: en("In 2019, they said goodbye to my mission."),
          mood: "sad",
          pose: "droop",
          ...part5Clip(31.38, 34.77),
          media: media(
            "15-farewell.jpg",
            "Opportunity's last look at Mars",
            "NASA/JPL-Caltech"
          ),
        },
      ],
      question: {
        prompt: en("Why did Opp stop talking in 2018?"),
        options: [
          { id: "gas", label: en("I ran out of gas") },
          {
            id: "sun",
            label: en("There wasn't enough sunlight for my panels"),
            correct: true,
          },
          { id: "off", label: en("The scientists turned me off the same day") },
        ],
        hint: en("I don't have a gas tank. My panels need sunlight."),
        explanation: en("Yes! Remember, I run on sunlight, not gas."),
        wrongText: en(
          "Not quite! I don't have a gas tank. The dust storm blocked my sunlight, and I lost my energy."
        ),
      },
      reveal: follow(
        "s5-correct",
        "Yes! Remember, I run on sunlight, not gas.",
        {
          mood: "happy",
          highlight: "panels",
          pose: "shine",
          audioSrc: KIDS_AUDIO.correct(5),
        }
      ),
      wrongReveal: follow(
        "s5-wrong",
        "Not quite! I don't have a gas tank. The dust storm blocked my sunlight, and I lost my energy.",
        {
          mood: "sad",
          highlight: "panels",
          audioSrc: KIDS_AUDIO.wrong(5),
        }
      ),
    },
    {
      id: "not-forgotten",
      title: en("Not forgotten"),
      lines: [
        {
          id: "s6-1",
          text: en(
            "I'm still parked on Mars today, in a place called Perseverance Valley."
          ),
          mood: "sad",
          pose: "droop",
          ...part6Clip(0, 5.13),
          media: media(
            "15-farewell.jpg",
            "Opportunity's last look at Mars",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s6-2",
          text: en(
            "I'm quiet now, but my discoveries are not. I showed that Mars once had water."
          ),
          mood: "happy",
          pose: "bounce",
          ...part6Clip(5.13, 10.76),
        },
        {
          id: "s6-3",
          text: en(
            "New rovers like Perseverance are following my tracks and exploring more."
          ),
          mood: "happy",
          highlight: "wheels",
          pose: "roll",
          ...part6Clip(10.76, 16.04),
          media: media(
            "16-legacy.jpg",
            "Later rovers followed Opportunity's path",
            "NASA/JPL-Caltech"
          ),
        },
        {
          id: "s6-4",
          text: en(
            "I didn't find aliens, but I found the clues that led scientists to ask new questions."
          ),
          mood: "curious",
          pose: "look-up",
          ...part6Clip(16.04, 22.26),
        },
        {
          id: "s6-5",
          text: en("And you can keep asking questions too."),
          mood: "happy",
          pose: "wave",
          ...part6Clip(22.26, 25.04),
        },
        {
          id: "s6-6",
          text: en("Abandoned… but not forgotten!"),
          mood: "happy",
          pose: "wave",
          ...part6Clip(25.04, 27.17),
        },
      ],
      question: {
        prompt: en("What was Opp's biggest discovery?"),
        options: [
          { id: "aliens", label: en("Little green aliens") },
          { id: "oceans", label: en("Mars has oceans today") },
          { id: "water", label: en("Mars once had water"), correct: true },
        ],
        hint: en("Think about the water clues in the rocks."),
        explanation: en("Yes! That's real science."),
        wrongText: en(
          "Fun guess! But my real discovery was that Mars once had water."
        ),
      },
      reveal: follow("s6-correct", "Yes! That's real science.", {
        mood: "happy",
        pose: "wave",
        audioSrc: KIDS_AUDIO.correct(6),
        media: media(
          "12-water-evidence.jpg",
          "Rocks that show Mars once had water",
          "NASA/JPL-Caltech"
        ),
      }),
      wrongReveal: follow(
        "s6-wrong",
        "Fun guess! But my real discovery was that Mars once had water.",
        {
          mood: "happy",
          pose: "bounce",
          audioSrc: KIDS_AUDIO.wrong(6),
          media: media(
            "12-water-evidence.jpg",
            "Rocks that show Mars once had water",
            "NASA/JPL-Caltech"
          ),
        }
      ),
    },
  ],
};

export default OPPORTUNITY_KIDS;

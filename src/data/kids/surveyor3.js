/**
 * Surveyor 3 — game-first kids pack (2 briefing cards → 3-stage lunar game).
 */

function surveyorQuestion({ prompt, options, correctIndex, explanation, hint }) {
  return {
    prompt,
    options: options.map((label, i) => ({
      id: String(i),
      label,
      correct: i === correctIndex,
    })),
    explanation,
    hint: hint ?? "Think about what NASA had to prove before sending astronauts.",
    wrongText: "Try again — Apollo needs solid lunar soil before astronauts can land!",
  };
}

export const SURVEYOR3_KIDS = {
  id: "surveyor-3",
  name: "Surveyor 3",
  missionTitle: "Apollo's Robotic Lunar Scout",
  themeColor: "#9ad8ff",
  landingSite: "Surveyor Crater, Oceanus Procellarum",
  landingDate: "April 20, 1967",
  coordinates: { lat: -3.02, lon: -23.42 },

  segments: [
    {
      id: "seg-1",
      title: "Mission Briefing: Test the Moon!",
      pose: "wave",
      mood: "excited",
      highlight: "scoop",
      image: "/surveyor3/landing-crater.jpg",
      imageCaption:
        "Surveyor Crater in Oceanus Procellarum — target zone for Surveyor 3 (1967) and Apollo 12 (1969).",
      voiceLine:
        "Surveyor 3 online! NASA sent me here two years before Apollo to prove astronauts won't sink into the Moon dust.",
      narration:
        "April 1967: Before human astronauts can land on the Moon, NASA needs you to land Surveyor 3 inside a crater and test if the ground can hold a spaceship!",
      question: surveyorQuestion({
        prompt: "What is your #1 mission as Surveyor 3?",
        options: [
          "Test if lunar soil is solid enough for Apollo astronauts to land safely",
          "Search for ancient oceans on Mars",
        ],
        correctIndex: 0,
        explanation: "Affirmative! Let's fire up the landing thrusters and enter the simulator.",
      }),
    },
    {
      id: "seg-2",
      title: "Incoming Radar Glitch!",
      pose: "bounce",
      mood: "surprised",
      highlight: "legs",
      image: "/surveyor3/footpad-imprint.jpg",
      imageCaption:
        "Actual imprint from Surveyor 3's footpad after bouncing twice on the 14-degree crater slope.",
      voiceLine:
        "Warning! Bright crater rocks are confusing my landing radar—get ready to cut the engines manually!",
      narration:
        "Bright rocks in Surveyor Crater just tricked my radar into keeping the engines firing! Take manual control now to stick the landing and test the lunar soil!",
      launchGameImmediately: true,
      question: surveyorQuestion({
        prompt: "What should you do when the radar glitches on descent?",
        options: [
          "Cut the vernier engines manually inside the safe touchdown window",
          "Keep firing engines until the fuel tank is empty",
        ],
        correctIndex: 0,
        explanation: "Roger! Manual cutoff engaged — launching lunar engineer simulator!",
      }),
    },
  ],

  radioCallouts: {
    stage1Intro:
      "Altitude 10 meters! Tap Cut Vernier Engines inside the green zone to stop the bounce!",
    stage1Success:
      "Touchdown confirmed! Settled at 14 degrees inside Surveyor Crater. Deploying robotic scoop!",
    stage2Intro:
      "Scissor arm extended. Run all three soil strength tests to clear Apollo 12 for landing.",
    stage2Success:
      "Soil bearing strength 6 PSI—solid as damp beach sand! Apollo 12 is cleared to land!",
    stage3Intro:
      "Fast-forward 31 months to November 1969! Incoming transmission from Apollo 12 Commander Pete Conrad...",
    apollo12Quote:
      "Hey, there it is! Right down the middle of the road! Let's walk down and check out Surveyor 3!",
    stage3Success:
      "Artifacts secured for return to Earth! Act Two—Apollo 12—is now unlocked on the Moon!",
  },

  artifacts: [
    {
      id: "tv-camera",
      name: "Surveyor 3 Television Camera",
      nasaId: "AS12-48-7100",
      image: "/surveyor3/camera-artifact.jpg",
      mass: "6.8 kg (15 lbs)",
      launchState:
        "Bright white thermal paint, spotless optical mirror, sealed electronics.",
      recoveredState:
        "White paint turned golden-tan from 31 months of intense solar UV radiation; mirror coated in fine lunar dust; glass survived -170°C to +70°C swings without cracking.",
      museumLocation: "Smithsonian National Air & Space Museum, Washington, D.C.",
    },
    {
      id: "soil-scoop",
      name: "Soil Mechanics Surface Sampler (Scoop)",
      nasaId: "AS12-48-7133",
      image: "/surveyor3/soil-trench.jpg",
      mass: "2.1 kg (4.6 lbs)",
      launchState: "Painted bright blue with crisp aluminum scissor-arm hinges.",
      recoveredState:
        "Blue paint faded by solar radiation, but its electric motor and hinges remained intact—carrying genuine Oceanus Procellarum dust inside the scoop back to Earth.",
      museumLocation: "NASA Jet Propulsion Laboratory (JPL) / Cosmosphere",
    },
    {
      id: "strut-tubes",
      name: "Aluminum Support Strut Tubes",
      nasaId: "AS12-48-7136",
      image: "/surveyor3/apollo12-visit.jpg",
      mass: "0.4 kg (0.9 lbs)",
      launchState: "Smooth polished and painted aerospace aluminum tubing.",
      recoveredState:
        "Snipped off with tube cutters by Pete Conrad so engineers could count microscopic micrometeorite pits and test metal fatigue after 942 days on the Moon.",
      museumLocation: "NASA Johnson Space Center Curation Lab, Houston",
    },
  ],
};
/**
 * Apollo 12 (Intrepid) — Act II kids pack: EVA at Surveyor Crater, recover 3 artifacts.
 */
import { SURVEYOR3_KIDS } from "@/data/kids/surveyor3";

export const APOLLO12_KIDS = {
  id: "apollo-12",
  name: "Apollo 12 (Intrepid)",
  missionTitle: "Act II — Walk to Surveyor 3",
  themeColor: "#f5c451",
  landingSite: "Surveyor Crater, Oceanus Procellarum",
  landingDate: "November 19, 1969",
  requiresComplete: "surveyor-3",

  radioCallouts: {
    intro:
      "Houston, Intrepid — Pete Conrad on the ladder. We're 535 feet from Surveyor 3. Time to walk the crater!",
    siteApproach:
      "There it is — you can even see the Surveyor footpad! We landed the pointed end of the oval right on the target.",
    apollo12Quote: SURVEYOR3_KIDS.radioCallouts.apollo12Quote,
    artifactTv:
      "Cutting the TV camera cable… that's 942 days of lunar UV on this mirror. Bag it for the Command Module!",
    artifactScoop:
      "The blue scoop arm still works! Pete's snipping the tubing — real Oceanus Procellarum dirt inside.",
    artifactStrut:
      "Tube cutters on the support strut — engineers want every micrometeorite pit counted back on Earth.",
    finale:
      "All three Surveyor pieces secured! Act II complete — thanks for walking in Pete and Al's boots.",
  },

  surveyorWreck: { worldX: 720, worldY: 260, label: "Surveyor 3" },
  spawn: { worldX: 140, worldY: 320 },
  artifacts: SURVEYOR3_KIDS.artifacts.map((a) => ({
    ...a,
    hotspot: a.id === "tv-camera"
      ? { x: 58, y: 22, highlight: "camera" }
      : a.id === "soil-scoop"
        ? { x: 32, y: 52, highlight: "scoop" }
        : { x: 62, y: 38, highlight: "legs" },
  })),
};

export default APOLLO12_KIDS;
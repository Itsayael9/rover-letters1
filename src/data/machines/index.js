import { OPPORTUNITY_KIDS } from "@/data/kids/opportunity";
import { INGENUITY_KIDS } from "@/data/kids/ingenuity";
import { SURVEYOR3_KIDS } from "@/data/kids/surveyor3";
import { APOLLO12_KIDS } from "@/data/kids/apollo12";

/** Central registry — map pins, kids data, and future machine components. */
export const MACHINES = {
  opportunity: {
    id: "opportunity",
    name: "Opportunity",
    subtitle: "Mars rover · landed 2004",
    planetId: "mars",
    themeColor: "#f49d56",
    kids: OPPORTUNITY_KIDS,
    experience: "opportunity-segments",
  },
  ingenuity: {
    id: "ingenuity",
    name: "Ingenuity",
    subtitle: "Mars helicopter · first powered flight",
    planetId: "mars",
    themeColor: "#9ad8ff",
    kids: INGENUITY_KIDS,
    experience: "ingenuity-segments",
  },
  "surveyor-3": {
    id: "surveyor-3",
    name: "Surveyor 3",
    subtitle: "Robotic lunar lander · Apr 1967",
    planetId: "moon",
    lat: -3.02,
    lon: -23.42,
    mapX: 42,
    mapY: 53,
    themeColor: "#9ad8ff",
    kids: SURVEYOR3_KIDS,
    experience: "surveyor-game",
  },
  "apollo-12": {
    id: "apollo-12",
    name: "Apollo 12 (Intrepid)",
    subtitle: "Crewed Lunar Module · Nov 1969",
    planetId: "moon",
    lat: -3.01,
    lon: -23.42,
    mapX: 43,
    mapY: 52,
    themeColor: "#f5c451",
    kids: APOLLO12_KIDS,
    experience: "apollo-act-two",
  },
};

export function machineById(id) {
  return MACHINES[id] ?? null;
}

export function kidsPackFor(id) {
  return MACHINES[id]?.kids ?? null;
}
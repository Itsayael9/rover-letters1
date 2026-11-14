import sections from "@/data/opportunityDeepDive";

/** Which rover anchor to frame when the ring shows station 0 (null = default ring shot). */
export function resolveRingCameraAnchor(activeSectionId, activeTriggerId, activeStation) {
  if (activeStation !== 0) return null;

  if (activeTriggerId === "camera") return "cameraMast";

  const section = sections.find((s) => s.id === activeSectionId);
  return section?.cameraTarget ?? "fullRover";
}

/** Highlight uses the same anchor as the ring camera on station 0. */
export function resolveHighlightAnchor(activeSectionId, activeTriggerId, activeStation) {
  const anchor = resolveRingCameraAnchor(activeSectionId, activeTriggerId, activeStation);
  if (anchor) return anchor;
  const section = sections.find((s) => s.id === activeSectionId);
  return section?.cameraTarget;
}

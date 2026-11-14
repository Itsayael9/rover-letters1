/** Shared layout for Opportunity on ring station 0. */
export const RING_RADIUS = 4.2;

export const DEFAULT_RING_CAMERA = {
  position: [0, 0.72, RING_RADIUS + 6.6],
  target: [0, 0.14, RING_RADIUS],
};

/** Antenna chapter — full high-gain disc in frame (not an edge crop). */
export const ANTENNA_VIEW = {
  fov: 40,
  distanceMul: 8,
  minDistance: 1.35,
};

/** Solar arrays chapter — closer framing on panel materials (tune fov / distance here). */
export const SOLAR_PANELS_VIEW = {
  fov: 36,
  distanceMul: 1.12,
  minDistance: 0.72,
  targetBiasY: 0.68,
};

/** Smaller on the ring so the full rover + mast fit in frame on mobile. */
export const ROVER_PAD = {
  position: [0, -0.12, 0],
  rotation: [0, 0, 0],
  scale: 0.44,
  groundY: -0.88,
};

/** Y rotation (rad) on the pad so the active part faces the archive camera. */
export const ROVER_YAW_BY_ANCHOR = {
  fullRover: 0,
  wideMarsView: 0,
  cameraMast: 0,
  antenna: 0.12,
  solarPanels: Math.PI * 0.34,
  wheelAssembly: Math.PI * 0.14,
  roboticArm: -Math.PI * 0.32,
  rockEnvironment: Math.PI * 0.22,
};

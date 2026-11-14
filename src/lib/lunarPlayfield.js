import * as THREE from "three";

/** Playable Surveyor Crater — Oceanus Procellarum scale, game-sized. */
export const WORLD = 64;
export const SPAWN = { x: -2.2, z: 7.4 };
export const SAFE_SPOT = { x: 10.4, z: -8.6 };
export const APOLLO_PAD = { x: 14.8, z: -6.4 };
export const FLAG_POS = { x: 19.5, z: -2.2 };
export const ARRIVE_R = 5.4;
export const SPAWN_YAW = Math.atan2(SAFE_SPOT.x - SPAWN.x, SAFE_SPOT.z - SPAWN.z);

export function hash(n) {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}

function smoothstep(a, b, x) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Height of the kids-mode crater floor at xz. */
export function playfieldHeight(x, z) {
  const fine = Math.sin(x * 1.55 + z * 0.72) * 0.04 + Math.cos(z * 1.7 - x * 0.62) * 0.032;
  const medium =
    Math.sin(x * 0.22 + z * 0.13) * 0.28 +
    Math.cos(z * 0.18 - x * 0.15) * 0.22 +
    Math.sin((x - z) * 0.07) * 0.2;

  let h = medium + fine;

  for (let i = 0; i < 18; i += 1) {
    const cx = (hash(i * 9 + 1) - 0.5) * 52;
    const cz = (hash(i * 9 + 2) - 0.5) * 52;
    const radius = 1.1 + hash(i * 9 + 3) * 3.4;
    const d = Math.hypot(x - cx, z - cz) / radius;
    if (d < 1.45) {
      h += -0.38 * Math.exp(-d * d * 2.6) + 0.1 * Math.exp(-(((d - 0.9) / 0.14) ** 2));
    }
  }

  const dSafe = Math.hypot(x - SAFE_SPOT.x, z - SAFE_SPOT.z);
  const padBlend = 1 - smoothstep(0.4, 5.2, dSafe);
  h = THREE.MathUtils.lerp(h, 0.12 + fine * 0.15, padBlend);

  const dApollo = Math.hypot(x - APOLLO_PAD.x, z - APOLLO_PAD.z);
  const apolloBlend = 1 - smoothstep(0.5, 4.4, dApollo);
  h = THREE.MathUtils.lerp(h, 0.14 + fine * 0.1, apolloBlend * 0.85);

  return h;
}

export function clampWorld(x, z, pad = 3.4) {
  const lim = WORLD / 2 - pad;
  return {
    x: THREE.MathUtils.clamp(x, -lim, lim),
    z: THREE.MathUtils.clamp(z, -lim, lim),
  };
}

/** Averaged height so the lander does not chatter on crater rims. */
export function playfieldHeightSmooth(x, z, span = 0.42) {
  return (
    (playfieldHeight(x, z) +
      playfieldHeight(x + span, z) +
      playfieldHeight(x - span, z) +
      playfieldHeight(x, z + span) +
      playfieldHeight(x, z - span)) /
    5
  );
}

export function dampAngle(current, target, lambda, dt) {
  let diff = target - current;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * (1 - Math.exp(-lambda * dt));
}

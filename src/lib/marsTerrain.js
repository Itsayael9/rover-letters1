/** Shared Mars terrain height (matches MarsSurface mesh). */

const CRATER = { x: 0, z: -15, radius: 5.2, depth: 4.2 };

function hash(n) {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}

function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function marsTerrainHeight(x, z) {
  const fine =
    Math.sin(x * 1.7 + z * 0.8) * 0.045 + Math.cos(z * 1.9 - x * 0.7) * 0.035;

  const medium =
    Math.sin(x * 0.19 + z * 0.11) * 0.24 +
    Math.cos(z * 0.16 - x * 0.13) * 0.2 +
    Math.sin((x - z) * 0.055) * 0.32;

  let h = medium + fine;

  for (let i = 0; i < 36; i += 1) {
    const cx = (hash(i * 7 + 1) - 0.5) * 180;
    const cz = -8 - hash(i * 7 + 2) * 180;
    const radius = 0.7 + hash(i * 7 + 3) * 2.8;
    const d = Math.hypot(x - cx, z - cz) / radius;
    if (d < 1.5) {
      h += -0.22 * Math.exp(-d * d * 3) + 0.09 * Math.exp(-(((d - 0.91) / 0.12) ** 2));
    }
  }

  const dx = x - CRATER.x;
  const dz = z - CRATER.z;
  const d = Math.hypot(dx, dz);
  const angle = Math.atan2(dz, dx);
  const irregularRadius = d + 0.22 * Math.sin(angle * 5) + 0.13 * Math.sin(angle * 9 + 1.2);
  const wallT = smoothstep(1.8, CRATER.radius, irregularRadius);
  const floor = -CRATER.depth + fine * 1.5;
  const craterBlend = 1 - wallT;
  h = h * wallT + floor * craterBlend;

  const rimDistance = irregularRadius - 4.7;
  h += 0.62 * Math.exp(-(rimDistance * rimDistance) / 0.22);

  const wallMask = smoothstep(1.8, 2.4, d) * (1 - smoothstep(4.4, 5.25, d));
  h += wallMask * (Math.sin(angle * 17 + d * 3) * 0.11 + Math.sin(angle * 29 - d * 5) * 0.055);

  return h;
}

export function marsSurfaceWorldY(x, z) {
  return -0.12 + marsTerrainHeight(x, z);
}

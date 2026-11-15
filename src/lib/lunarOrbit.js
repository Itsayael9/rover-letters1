import * as THREE from "three";

/** Offset of the Moon from Earth in scene space (not to true scale — readable for kids). */
export function moonOrbitOffset(orbit, elapsedSeconds) {
  const { radius, periodSeconds, inclination, initialAngle } = orbit;
  const angle = initialAngle + (elapsedSeconds / periodSeconds) * Math.PI * 2;
  const cosI = Math.cos(inclination);
  const sinI = Math.sin(inclination);
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius * cosI;
  const y = Math.sin(angle) * radius * sinI * 0.65;
  return new THREE.Vector3(x, y, z);
}

export function getBodyWorldPosition(body, bodies, elapsedSeconds) {
  if (!body.orbit?.parentId) {
    return new THREE.Vector3(...(body.position ?? [0, 0, 0]));
  }

  const parent = bodies.find((b) => b.id === body.orbit.parentId);
  if (!parent) {
    return new THREE.Vector3(...(body.position ?? [0, 0, 0]));
  }

  const parentPos = new THREE.Vector3(...parent.position);
  const offset = moonOrbitOffset(body.orbit, elapsedSeconds);
  return parentPos.add(offset);
}
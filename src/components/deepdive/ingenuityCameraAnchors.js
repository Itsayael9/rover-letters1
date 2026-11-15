import * as THREE from "three";

const _target = new THREE.Vector3();
const _position = new THREE.Vector3();
const _size = new THREE.Vector3();

/** Preset views around the normalized Ingenuity GLB (whole-model bounding box). */
const VIEWS = {
  fullHeli: { distMul: 2.4, elev: 0.35, azim: 0.55, targetBias: 0.42 },
  fullHeliHigh: { distMul: 2.1, elev: 0.55, azim: 0.35, targetBias: 0.48 },
  fullHeliLow: { distMul: 2.5, elev: 0.18, azim: 0.7, targetBias: 0.32 },
  fullHeliWide: { distMul: 2.85, elev: 0.28, azim: 1.1, targetBias: 0.45 },
  rotors: { distMul: 1.05, elev: 0.75, azim: 0.25, targetBias: 0.72 },
  solar: { distMul: 1.2, elev: 0.62, azim: -0.4, targetBias: 0.58 },
  antenna: { distMul: 1.15, elev: 0.45, azim: 1.35, targetBias: 0.5 },
  fuselage: { distMul: 1.25, elev: 0.38, azim: 0.85, targetBias: 0.48 },
  legs: { distMul: 1.35, elev: 0.12, azim: 0.65, targetBias: 0.22 },
};

export function cameraFrameForIngenuityAnchor(root, anchorKey = "fullHeli") {
  if (!root) return null;
  const box = new THREE.Box3().setFromObject(root);
  if (box.isEmpty()) return null;

  const view = VIEWS[anchorKey] ?? VIEWS.fullHeli;
  const center = box.getCenter(_target);
  box.getSize(_size);
  const span = Math.max(_size.x, _size.y, _size.z, 0.08);
  const dist = span * view.distMul;

  _target.copy(center);
  _target.y = box.min.y + _size.y * view.targetBias;

  _position.set(
    _target.x + Math.cos(view.azim) * dist,
    _target.y + view.elev * dist,
    _target.z + Math.sin(view.azim) * dist
  );

  return {
    position: _position.toArray(),
    target: _target.toArray(),
    fov: anchorKey === "fullHeliWide" ? 48 : anchorKey.startsWith("full") ? 42 : 38,
  };
}
import * as THREE from "three";

const PART_MATERIAL_MATCH = {
  cameraMast: (name) => /mast/i.test(name || ""),
  solarDeck: (name) => /panel/i.test(name || ""),
  wheels: (name) => /suspension/i.test(name || ""),
  arm: (name) => /(?:^tex_)?arm/i.test(name || ""),
  body: (name) => /body|instrument|foil/i.test(name || "") || /^silver$/i.test(name || ""),
  highGain: (name) => /^silver$/i.test(name || ""),
};

export function partMaterialMatcher(partKey) {
  return PART_MATERIAL_MATCH[partKey];
}

function materialName(mat) {
  return mat?.name || "";
}

function expandGroupBounds(mesh, geometry, group, out) {
  const pos = geometry.attributes.position;
  if (!pos) return;
  const index = geometry.index;
  const start = group.start ?? 0;
  const count = group.count ?? (index ? index.count : pos.count);
  const end = Math.min(start + count, index ? index.count : pos.count);
  const v = new THREE.Vector3();
  mesh.updateWorldMatrix(true, false);

  for (let i = start; i < end; i += 1) {
    const vi = index ? index.getX(i) : i;
    v.fromBufferAttribute(pos, vi).applyMatrix4(mesh.matrixWorld);
    out.expandByPoint(v);
  }
}

/** World-space bounds for a rover part (GLB uses one mesh, many materials). */
export function getPartBounds(root, partKey) {
  const box = new THREE.Box3();
  const match = PART_MATERIAL_MATCH[partKey];
  if (!root || !match) return box;

  root.traverse((obj) => {
    if (!obj.isMesh) return;
    const geometry = obj.geometry;
    if (!geometry) return;

    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    const groups =
      geometry.groups?.length > 0
        ? geometry.groups
        : [{ start: 0, count: geometry.index?.count ?? geometry.attributes.position.count, materialIndex: 0 }];

    groups.forEach((group) => {
      const mat = materials[group.materialIndex ?? 0];
      if (!match(materialName(mat))) return;
      expandGroupBounds(obj, geometry, group, box);
    });
  });

  return box;
}

export function fullRoverBounds(root) {
  const box = new THREE.Box3();
  if (!root) return box;
  root.traverse((obj) => {
    if (obj.isMesh) box.expandByObject(obj);
  });
  return box;
}

/** High-gain dish only — GLB material "Silver" (not tex_mast). */
export function getAntennaBounds(root) {
  const box = getPartBounds(root, "highGain");
  if (box.isEmpty()) return fullRoverBounds(root);
  return box;
}

export function partBounds(objects) {
  const box = new THREE.Box3();
  objects.forEach((o) => box.expandByObject(o));
  return box;
}

function fitCameraToBox(box, { padding = 1.55, yaw = 0.65, pitch = 0.28, targetBiasY = 0.5 }) {
  if (box.isEmpty()) return null;
  const target = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  target.y = box.min.y + size.y * targetBiasY;

  const maxDim = Math.max(size.x, size.y, size.z, 0.15);
  const fovRad = (42 * Math.PI) / 180;
  const dist = Math.max(0.45, (maxDim / (2 * Math.tan(fovRad / 2))) * padding);

  const position = new THREE.Vector3(
    target.x + Math.cos(yaw) * dist,
    target.y + pitch * dist,
    target.z + Math.sin(yaw) * dist
  );

  return { position: position.toArray(), target: target.toArray() };
}

export function cameraFrameForPart(root, partKey, view = {}) {
  const partBox = getPartBounds(root, partKey);
  if (!partBox.isEmpty()) {
    return fitCameraToBox(partBox, view);
  }
  return fitCameraToBox(fullRoverBounds(root), { padding: 1.72, yaw: 0.62, pitch: 0.32, targetBiasY: 0.4 });
}

import * as THREE from "three";
import { ANTENNA_VIEW, DEFAULT_RING_CAMERA, SOLAR_PANELS_VIEW } from "./ringConstants";
import {
  fullRoverBounds,
  getAntennaBounds,
  getPartBounds,
} from "./roverPartBounds";

const _viewerDir = new THREE.Vector3(...DEFAULT_RING_CAMERA.position)
  .sub(new THREE.Vector3(...DEFAULT_RING_CAMERA.target))
  .normalize();
const _target = new THREE.Vector3();
const _position = new THREE.Vector3();
const _geoTarget = new THREE.Vector3();

const VIEWER_DISTANCE_MUL = {
  cameraMast: { mul: 1.65, min: 1.05 },
  solarPanels: { mul: 1.35, min: 1.0 },
  wheelAssembly: { mul: 1.5, min: 0.85 },
  roboticArm: { mul: 1.5, min: 0.88 },
  fullRover: { mul: 2.05, min: 2.35 },
  wideMarsView: { mul: 2.35, min: 2.85 },
  rockEnvironment: { mul: 2.0, min: 2.2 },
};

function distanceForBox(box, anchorKey) {
  const { mul, min } = VIEWER_DISTANCE_MUL[anchorKey] ?? { mul: 1.4, min: 0.9 };
  const span = Math.max(...box.getSize(new THREE.Vector3()).toArray(), 0.1);
  return Math.max(min, span * mul);
}

function targetFromBounds(box, biasY = 0.5) {
  if (box.isEmpty()) return null;
  _target.copy(box.getCenter(new THREE.Vector3()));
  const size = box.getSize(new THREE.Vector3());
  _target.y = box.min.y + size.y * biasY;
  return _target.clone();
}

/** Close-up on the high-gain dish (material Silver), from the viewer side. */
function frameAntennaFromGeometry(root) {
  const box = getAntennaBounds(root);
  const geoTarget = box.isEmpty() ? null : targetFromBounds(box, 0.5);
  if (!geoTarget) return null;

  _geoTarget.copy(geoTarget);
  const size = box.getSize(new THREE.Vector3());
  const span = Math.max(size.x, size.y, size.z, 0.06);
  const dist = Math.max(ANTENNA_VIEW.minDistance, span * ANTENNA_VIEW.distanceMul);

  _position.set(
    _geoTarget.x + span * 0.15,
    _geoTarget.y + span * 0.2,
    _geoTarget.z + dist
  );

  return {
    position: _position.toArray(),
    target: _geoTarget.toArray(),
    fov: ANTENNA_VIEW.fov,
  };
}

/** Camera on the viewer side: target at anchor; position along ring-center → default camera axis. */
function frameViewerSide(root, anchorKey) {
  if (!root) return null;

  let box;
  let biasY = 0.5;
  switch (anchorKey) {
    case "cameraMast":
      box = getPartBounds(root, "cameraMast");
      biasY = 0.55;
      break;
    case "solarPanels": {
      box = getPartBounds(root, "solarDeck");
      if (box.isEmpty()) box = fullRoverBounds(root);
      const target = targetFromBounds(box, SOLAR_PANELS_VIEW.targetBiasY);
      if (!target) return null;
      const size = box.getSize(new THREE.Vector3());
      const span = Math.max(...size.toArray(), 0.12);
      const dist = Math.max(
        SOLAR_PANELS_VIEW.minDistance,
        span * SOLAR_PANELS_VIEW.distanceMul
      );
      _position
        .copy(target)
        .add(
          new THREE.Vector3(
            size.x * 0.08,
            size.y * 0.42 + dist * 0.1,
            dist * 0.82
          )
        );
      return {
        position: _position.toArray(),
        target: target.toArray(),
        fov: SOLAR_PANELS_VIEW.fov,
      };
    }
    case "wheelAssembly":
      box = getPartBounds(root, "wheels");
      biasY = 0.45;
      break;
    case "roboticArm":
      box = getPartBounds(root, "arm");
      biasY = 0.5;
      break;
    case "fullRover":
    case "wideMarsView":
      box = fullRoverBounds(root);
      biasY = anchorKey === "wideMarsView" ? 0.38 : 0.42;
      break;
    case "rockEnvironment": {
      box = fullRoverBounds(root);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      _target.set(center.x + size.x * 0.35, center.y * 0.28, center.z + size.z * 0.25);
      const dist = distanceForBox(box, "rockEnvironment");
      _position.copy(_target).addScaledVector(_viewerDir, dist).add(new THREE.Vector3(0, 0.12, 0));
      return { position: _position.toArray(), target: _target.toArray() };
    }
    default:
      box = fullRoverBounds(root);
      break;
  }

  const target = targetFromBounds(box, biasY);
  if (!target) return null;

  const dist = distanceForBox(box, anchorKey);
  _position.copy(target).addScaledVector(_viewerDir, dist).add(new THREE.Vector3(0, 0.08, 0));

  return { position: _position.toArray(), target: target.toArray() };
}

export function cameraFrameForAnchor(root, anchorKey) {
  if (!root) return null;
  root.updateMatrixWorld(true);
  if (anchorKey === "antenna") return frameAntennaFromGeometry(root);
  return frameViewerSide(root, anchorKey);
}

export function getAnchorWorldPoint(root, anchorKey) {
  if (!root) return null;
  root.updateMatrixWorld(true);
  let box;
  switch (anchorKey) {
    case "cameraMast":
      box = getPartBounds(root, "cameraMast");
      return targetFromBounds(box, 0.55);
    case "solarPanels":
      box = getPartBounds(root, "solarDeck");
      return targetFromBounds(box, 0.5);
    case "wheelAssembly":
      box = getPartBounds(root, "wheels");
      return targetFromBounds(box, 0.45);
    case "roboticArm":
      box = getPartBounds(root, "arm");
      return targetFromBounds(box, 0.5);
    case "antenna":
      box = getAntennaBounds(root);
      return targetFromBounds(box, 0.5);
    default:
      return null;
  }
}

export function buildAnchorFrameTable(root) {
  const keys = [
    "fullRover",
    "cameraMast",
    "antenna",
    "solarPanels",
    "wheelAssembly",
    "roboticArm",
    "rockEnvironment",
    "wideMarsView",
  ];
  const table = {};
  keys.forEach((key) => {
    table[key] = cameraFrameForAnchor(root, key);
  });
  return table;
}

export function highlightPartForAnchor(anchorKey) {
  switch (anchorKey) {
    case "solarPanels":
      return "solarDeck";
    case "wheelAssembly":
      return "wheels";
    case "cameraMast":
      return "cameraMast";
    case "roboticArm":
      return "arm";
    case "antenna":
      return "highGain";
    default:
      return "body";
  }
}

export function logPartBounds(root) {
  if (!root || typeof console === "undefined") return;
  const keys = ["cameraMast", "solarDeck", "wheels", "arm", "body"];
  keys.forEach((key) => {
    const b = getPartBounds(root, key);
    const s = b.getSize(new THREE.Vector3());
    console.log(`[DeepDive] bounds ${key}`, s.x.toFixed(2), s.y.toFixed(2), s.z.toFixed(2));
  });
  const a = getAntennaBounds(root);
  const sa = a.getSize(new THREE.Vector3());
  console.log("[DeepDive] bounds antennaCluster", sa.x.toFixed(2), sa.y.toFixed(2), sa.z.toFixed(2));
}

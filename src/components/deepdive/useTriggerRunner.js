"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import sections from "@/data/opportunityDeepDive";
import { useDeepDive } from "./DeepDiveContext";
import { getPartObjects, partBounds } from "./RoverModel";
import { triggerOrderInSection } from "./parseTriggers";
import { cameraFrameForAnchor } from "./cameraAnchors";

const WIDE_CAM = { position: [7, 3.5, 8], target: [0, 0.5, 0] };

function findTrigger(triggerId, sectionId) {
  const primary = sections.find((s) => s.id === sectionId);
  if (primary?.triggers?.[triggerId]) return primary.triggers[triggerId];
  for (const s of sections) {
    if (s.triggers?.[triggerId]) return s.triggers[triggerId];
  }
  return null;
}

/** Runs 3D actions when the user clicks a trigger word or auto-play fires. */
export function useTriggerRunner() {
  const { activeTrigger, activeSectionId, reducedMotion, sceneApiRef, bumpCameraSync } = useDeepDive();
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!activeTrigger?.id) return undefined;
    const api = sceneApiRef.current;
    const ctrl = api.controlsRef?.current;
    const root = api.roverRoot;
    if (!root) return undefined;

    cancelRef.current?.();
    const cleanups = [];
    cancelRef.current = () => cleanups.forEach((fn) => fn());

    bumpCameraSync();

    const def = findTrigger(activeTrigger.id, activeSectionId);
    if (!def) return () => cancelRef.current?.();

    const animate = !reducedMotion;
    if (def.action === "reset") {
      if (ctrl) applySectionCamera(ctrl, activeSectionId, root, animate);
    } else if (def.action === "focus") {
      if (ctrl && def.position && def.target) {
        ctrl.setLookAt(...def.position, ...def.target, animate);
      } else if (ctrl) focusPart(ctrl, root, def.part, animate);
    } else if (def.action === "zoomOut") {
      if (ctrl) ctrl.setLookAt(...WIDE_CAM.position, ...WIDE_CAM.target, animate);
      api.setRockOpacity?.(1);
      const t = window.setTimeout(() => api.setRockOpacity?.(0), 3000);
      cleanups.push(() => clearTimeout(t));
    } else if (def.action === "wiggle" && animate) {
      cleanups.push(wigglePart(root, def.part, def.durationMs ?? 1000));
    } else if (def.action === "spin" && animate) {
      cleanups.push(spinPart(root, def.part, def.durationMs ?? 1500));
    } else if (def.action === "glow" && animate) {
      cleanups.push(glowPart(root, def.part, def.durationMs ?? 1500));
    } else if (def.action === "dim") {
      api.setDim?.(true);
      const t = window.setTimeout(() => api.setDim?.(false), 3000);
      cleanups.push(() => clearTimeout(t));
    }

    return () => cancelRef.current?.();
  }, [activeTrigger, activeSectionId, reducedMotion, sceneApiRef, bumpCameraSync]);
}

/** Auto-fire triggers when a section becomes active. */
export function useSectionAutoTriggers() {
  const { activeSectionId, fireTrigger, isOpen } = useDeepDive();
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (!isOpen) return undefined;
    const section = sections.find((s) => s.id === activeSectionId);
    if (!section) return undefined;
    triggerOrderInSection(section).forEach((id, i) => {
      timers.current.push(window.setTimeout(() => fireTrigger(id), 1500 * (i + 1)));
    });
    return () => timers.current.forEach(clearTimeout);
  }, [activeSectionId, isOpen, fireTrigger]);
}

function applySectionCamera(ctrl, sectionId, root, animate) {
  const section = sections.find((s) => s.id === sectionId);
  if (!section?.cameraTarget || !root) return;
  const frame = cameraFrameForAnchor(root, section.cameraTarget);
  if (!frame) return;
  ctrl.setLookAt(...frame.position, ...frame.target, animate);
}

function focusPart(ctrl, root, partKey, animate) {
  const objs = getPartObjects(root, partKey);
  const box = partBounds(objs);
  const size = box.getSize(new THREE.Vector3()).length() || 2;
  const center = box.getCenter(new THREE.Vector3());
  const dist = size * 2.2;
  ctrl.setLookAt(
    center.x + dist * 0.6,
    center.y + dist * 0.4,
    center.z + dist * 0.6,
    center.x,
    center.y,
    center.z,
    animate
  );
}

function wigglePart(root, partKey, ms) {
  const objs = getPartObjects(root, partKey);
  const saved = objs.map((o) => o.rotation.clone());
  const start = performance.now();
  let raf = 0;
  const tick = (now) => {
    const t = (now - start) / ms;
    if (t >= 1) {
      objs.forEach((o, i) => o.rotation.copy(saved[i]));
      return;
    }
    objs.forEach((o, i) => {
      o.rotation.y = saved[i].y + Math.sin(t * 12) * 0.25;
    });
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    objs.forEach((o, i) => o.rotation.copy(saved[i]));
  };
}

function spinPart(root, partKey, ms) {
  const objs = getPartObjects(root, partKey);
  const startZ = root.position.z;
  const start = performance.now();
  let raf = 0;
  const tick = (now) => {
    const t = Math.min(1, (now - start) / ms);
    objs.forEach((o) => {
      o.rotation.x = t * Math.PI * 2;
    });
    root.position.z = startZ + Math.sin(t * Math.PI) * 0.6;
    if (t < 1) raf = requestAnimationFrame(tick);
    else {
      root.position.z = startZ;
      objs.forEach((o) => { o.rotation.x = 0; });
    }
  };
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    root.position.z = startZ;
  };
}

function glowPart(root, partKey, ms) {
  const mats = [];
  getPartObjects(root, partKey).forEach((o) => {
    o.traverse((c) => {
      if (c.isMesh && c.material) {
        const m = c.material.clone();
        c.material = m;
        mats.push(m);
      }
    });
  });
  const start = performance.now();
  let raf = 0;
  const tick = (now) => {
    const t = (now - start) / ms;
    const pulse = t <= 0.5 ? t * 2 : Math.max(0, (1 - t) * 2);
    mats.forEach((m) => {
      m.emissive = new THREE.Color("#ffb347");
      m.emissiveIntensity = pulse;
    });
    if (t < 1) raf = requestAnimationFrame(tick);
    else mats.forEach((m) => { m.emissiveIntensity = 0; });
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

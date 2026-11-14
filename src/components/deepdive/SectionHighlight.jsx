"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { highlightPartForAnchor } from "./cameraAnchors";
import { useDeepDive } from "./DeepDiveContext";
import { resolveHighlightAnchor } from "./ringCameraResolve";
import { partMaterialMatcher } from "./roverPartBounds";

const NO_HIGHLIGHT = new Set(["fullRover", "wideMarsView", "rockEnvironment"]);

/** Brief warm rim on materials for the active chapter part. */
export default function SectionHighlight({ root, activeStation = 0 }) {
  const { activeSectionId, activeTrigger, reducedMotion, userCameraActive } = useDeepDive();
  const saved = useRef([]);

  useEffect(() => {
    saved.current.forEach(({ mat, emissive, intensity }) => {
      mat.emissive.copy(emissive);
      mat.emissiveIntensity = intensity;
    });
    saved.current = [];
    if (!root || userCameraActive || reducedMotion) return undefined;

    const anchor = resolveHighlightAnchor(activeSectionId, activeTrigger?.id, activeStation);
    if (!anchor || NO_HIGHLIGHT.has(anchor)) return undefined;

    const partKey = highlightPartForAnchor(anchor);
    const match = partMaterialMatcher(partKey);
    if (!match) return undefined;

    const mats = [];
    root.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return;
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      materials.forEach((m) => {
        if (!match(m?.name || "")) return;
        mats.push({
          mat: m,
          emissive: m.emissive?.clone?.() ?? new THREE.Color(0, 0, 0),
          intensity: m.emissiveIntensity ?? 0,
        });
      });
    });
    if (mats.length === 0) return undefined;
    saved.current = mats;

    const accent = new THREE.Color("#e8c4a0");
    mats.forEach(({ mat }) => {
      if (!mat.emissive) mat.emissive = new THREE.Color();
      mat.emissive.copy(accent);
      mat.emissiveIntensity = 0.035;
    });

    return () => {
      mats.forEach(({ mat, emissive, intensity }) => {
        mat.emissive.copy(emissive);
        mat.emissiveIntensity = intensity;
      });
    };
  }, [activeSectionId, activeTrigger, activeStation, root, reducedMotion, userCameraActive]);

  return null;
}

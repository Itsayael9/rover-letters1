"use client";

import { useEffect } from "react";
import sections from "@/data/opportunityDeepDive";
import { cameraFrameForAnchor } from "./cameraAnchors";

/**
 * Must render inside R3F <Canvas> so CameraControls ref + setLookAt stay in sync with the draw loop.
 */
export default function ScrollCameraSync({
  controlsRef,
  roverRoot,
  activeSectionId,
  userCameraActive,
  nasaRoverReady,
  reducedMotion,
  syncKey,
}) {
  useEffect(() => {
    if (!nasaRoverReady || userCameraActive || !roverRoot) return undefined;

    let cancelled = false;
    const apply = () => {
      if (cancelled) return;
      const ctrl = controlsRef.current;
      if (!ctrl) {
        requestAnimationFrame(apply);
        return;
      }

      const section = sections.find((s) => s.id === activeSectionId);
      const anchor = section?.cameraTarget ?? "fullRover";
      const frame = cameraFrameForAnchor(roverRoot, anchor);
      if (!frame) return;

      const [px, py, pz] = frame.position;
      const [tx, ty, tz] = frame.target;
      const animate = !reducedMotion;
      if (animate && ctrl.smoothTime > 0.1) ctrl.smoothTime = 0.1;
      ctrl.setLookAt(px, py, pz, tx, ty, tz, animate);
    };

    apply();
    return () => {
      cancelled = true;
    };
  }, [
    activeSectionId,
    userCameraActive,
    nasaRoverReady,
    reducedMotion,
    syncKey,
    roverRoot,
    controlsRef,
  ]);

  return null;
}

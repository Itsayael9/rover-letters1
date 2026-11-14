"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { resolveRingCameraAnchor } from "./ringCameraResolve";
import { ROVER_YAW_BY_ANCHOR } from "./ringConstants";
import { useDeepDive } from "./DeepDiveContext";

/** Chapter face stays on the pad. A drag turns the rover model itself. */
export default function RoverYawRig({
  padRef,
  spinGroupRef,
  activeStation,
  activeSectionId,
  activeTriggerId,
  reducedMotion,
  nasaRoverReady,
}) {
  const goalYaw = useRef(0);
  const currentYaw = useRef(0);
  const turn = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const gl = useThree((s) => s.gl);
  const { registerSceneApi } = useDeepDive();

  useEffect(() => {
    registerSceneApi({ spinRef: spinGroupRef });
  }, [registerSceneApi, spinGroupRef]);

  useEffect(() => {
    const el = gl.domElement;
    const down = (event) => {
      if (event.button != null && event.button !== 0) return;
      dragging.current = true;
      lastX.current = event.clientX;
    };
    const move = (event) => {
      if (!dragging.current) return;
      const dx = event.clientX - lastX.current;
      lastX.current = event.clientX;
      turn.current += dx * 0.012;
    };
    const up = () => {
      dragging.current = false;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [gl]);

  useEffect(() => {
    turn.current = 0;
    if (!nasaRoverReady || activeStation !== 0) {
      goalYaw.current = 0;
      return;
    }
    const anchor = resolveRingCameraAnchor(activeSectionId, activeTriggerId, activeStation);
    goalYaw.current = ROVER_YAW_BY_ANCHOR[anchor] ?? 0;
    if (reducedMotion && padRef.current) {
      currentYaw.current = goalYaw.current;
      padRef.current.rotation.y = goalYaw.current;
    }
  }, [activeStation, activeSectionId, activeTriggerId, reducedMotion, nasaRoverReady, padRef]);

  useFrame((_, dt) => {
    const pad = padRef.current;
    const spin = spinGroupRef?.current;
    if (!pad || !nasaRoverReady || activeStation !== 0) return;

    if (spin) spin.rotation.y = turn.current;

    if (dragging.current) {
      currentYaw.current = goalYaw.current;
      pad.rotation.y = goalYaw.current;
      return;
    }

    const speed = reducedMotion ? 1 : 1 - Math.exp(-dt * 4.2);
    currentYaw.current += (goalYaw.current - currentYaw.current) * speed;
    pad.rotation.y = currentYaw.current;
  });

  return null;
}

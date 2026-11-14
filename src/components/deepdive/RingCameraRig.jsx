"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cameraFrameForAnchor } from "./cameraAnchors";
import { DEFAULT_RING_CAMERA } from "./ringConstants";
import { resolveRingCameraAnchor } from "./ringCameraResolve";
import { useDeepDive } from "./DeepDiveContext";

const DEFAULT_FOV = 44;

/**
 * Lerp camera on station 0 to scroll/trigger anchors; default ring view on other stations.
 */
export default function RingCameraRig({
  activeStation,
  roverRoot,
  activeSectionId,
  activeTriggerId,
  activeTriggerNonce,
  syncKey,
  reducedMotion,
  userCameraActive,
  nasaRoverReady,
}) {
  const camera = useThree((s) => s.camera);
  const { sceneApiRef } = useDeepDive();
  const goalPos = useRef(new THREE.Vector3(...DEFAULT_RING_CAMERA.position));
  const goalTarget = useRef(new THREE.Vector3(...DEFAULT_RING_CAMERA.target));
  const goalFov = useRef(DEFAULT_FOV);
  const lookAt = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  const frameForStory = (root) => {
    const spin = sceneApiRef.current?.spinRef?.current;
    const saved = spin ? spin.rotation.y : null;
    if (spin) {
      spin.rotation.y = 0;
      root.updateMatrixWorld(true);
    }
    const anchor = resolveRingCameraAnchor(activeSectionId, activeTriggerId, activeStation);
    const frame = anchor ? cameraFrameForAnchor(root, anchor) : null;
    if (spin && saved != null) {
      spin.rotation.y = saved;
      root.updateMatrixWorld(true);
    }
    return frame;
  };

  useEffect(() => {
    if (!nasaRoverReady) return;

  if (activeStation !== 0 || userCameraActive || !roverRoot) {
      goalPos.current.set(...DEFAULT_RING_CAMERA.position);
      goalTarget.current.set(...DEFAULT_RING_CAMERA.target);
      goalFov.current = DEFAULT_FOV;
      return;
    }

    const anchor = resolveRingCameraAnchor(activeSectionId, activeTriggerId, activeStation);
    if (!anchor) {
      goalPos.current.set(...DEFAULT_RING_CAMERA.position);
      goalTarget.current.set(...DEFAULT_RING_CAMERA.target);
      return;
    }

    roverRoot.updateMatrixWorld(true);
    const frame = frameForStory(roverRoot);
    if (!frame) {
      goalPos.current.set(...DEFAULT_RING_CAMERA.position);
      goalTarget.current.set(...DEFAULT_RING_CAMERA.target);
      return;
    }

    goalPos.current.fromArray(frame.position);
    goalTarget.current.fromArray(frame.target);
    goalFov.current = frame.fov ?? DEFAULT_FOV;

    if (reducedMotion) {
      camera.position.copy(goalPos.current);
      camera.fov = goalFov.current;
      camera.updateProjectionMatrix();
      camera.lookAt(goalTarget.current);
      initialized.current = true;
    }
  }, [
    activeStation,
    roverRoot,
    activeSectionId,
    activeTriggerId,
    activeTriggerNonce,
    syncKey,
    reducedMotion,
    userCameraActive,
    nasaRoverReady,
    camera,
  ]);

  useFrame((_, dt) => {
    if (!nasaRoverReady) return;

    if (activeStation === 0 && roverRoot && !userCameraActive) {
      const frame = frameForStory(roverRoot);
      if (frame) {
        goalPos.current.fromArray(frame.position);
        goalTarget.current.fromArray(frame.target);
        goalFov.current = frame.fov ?? DEFAULT_FOV;
      }
    } else {
      goalFov.current = DEFAULT_FOV;
    }

    const speed = reducedMotion ? 1 : 1 - Math.exp(-dt * 5.5);

    if (!initialized.current) {
      camera.position.copy(goalPos.current);
      lookAt.current.copy(goalTarget.current);
      camera.lookAt(lookAt.current);
      initialized.current = true;
      return;
    }

    camera.position.lerp(goalPos.current, speed);
    lookAt.current.lerp(goalTarget.current, speed);
    camera.lookAt(lookAt.current);
    if (Math.abs(camera.fov - goalFov.current) > 0.01) {
      camera.fov += (goalFov.current - camera.fov) * speed;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

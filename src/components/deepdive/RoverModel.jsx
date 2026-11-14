"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { logPartBounds } from "./cameraAnchors";
import { fullRoverBounds } from "./roverPartBounds";

export const MODEL_URL = "/models/mer-opportunity-static.glb";

function prepareScene(root) {
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    obj.castShadow = false;
    obj.receiveShadow = true;

    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    materials.forEach((mat) => {
      if (!mat) return;

      if (mat.map) {
        mat.map.colorSpace = THREE.SRGBColorSpace;
        mat.map.needsUpdate = true;
        if (mat.color) mat.color.setRGB(1, 1, 1);
      } else if (mat.color && mat.isMeshStandardMaterial) {
        mat.color.setHex(0xc4cad4);
      }

      if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
      if (mat.normalMap) {
        mat.normalMap.colorSpace = THREE.NoColorSpace;
        mat.normalScale?.set(1, 1);
      }
      if (mat.roughnessMap) mat.roughnessMap.colorSpace = THREE.NoColorSpace;
      if (mat.metalnessMap) mat.metalnessMap.colorSpace = THREE.NoColorSpace;

      if (mat.emissive) mat.emissive.setHex(0x000000);
      if ("emissiveIntensity" in mat) mat.emissiveIntensity = 0;

      if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
        mat.metalness = 0;
        mat.roughness = 0.88;
        mat.envMapIntensity = 0.55;
      }

      mat.needsUpdate = true;
    });
  });
}

/** Load and normalize the NASA Opportunity GLB (only when deep dive is mounted). */
export default function RoverModel({ groundY = 0, onReady }) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef(null);
  const logged = useRef(false);

  const fitted = useMemo(() => {
    const clone = scene.clone(true);
    prepareScene(clone);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(...box.getSize(new THREE.Vector3()).toArray(), 0.001);
    const scale = 2.65 / maxDim;
    clone.position.sub(center);
    clone.scale.setScalar(scale);
    clone.updateMatrixWorld(true);
    const grounded = new THREE.Box3().setFromObject(clone);
    clone.position.y += groundY - grounded.min.y;
    return { clone, scale };
  }, [scene, groundY]);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    const names = [];
    fitted.clone.traverse((obj) => {
      if (obj.isMesh && obj.name) names.push(`${obj.name} (${obj.type})`);
    });
    console.log("[DeepDive] GLB mesh nodes:", names);
    logPartBounds(fitted.clone);
    onReady?.(fitted.clone);
  }, [fitted, onReady]);

  return (
    <group ref={group}>
      <primitive object={fitted.clone} />
    </group>
  );
}

export { fullRoverBounds, getPartBounds, partBounds } from "./roverPartBounds";

export function getPartObjects(root, partKey) {
  /** @deprecated use getPartBounds — GLB is one mesh; highlights use materials now */
  const found = [];
  if (!root) return found;
  root.traverse((obj) => {
    if (obj.isMesh) found.push(obj);
  });
  return found.length ? [found[0]] : found;
}

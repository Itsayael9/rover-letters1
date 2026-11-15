"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export const INGENUITY_MODEL_URL = "/models/25043_Ingenuity_v3.glb";

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
      }
      if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
        mat.metalness = Math.min(mat.metalness ?? 0, 0.35);
        mat.roughness = Math.max(mat.roughness ?? 0.5, 0.55);
      }
      mat.needsUpdate = true;
    });
  });
}

export default function IngenuityArchiveModel({ groundY = 0, onReady }) {
  const { scene } = useGLTF(INGENUITY_MODEL_URL);
  const logged = useRef(false);

  const fitted = useMemo(() => {
    const clone = scene.clone(true);
    prepareScene(clone);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(...box.getSize(new THREE.Vector3()).toArray(), 0.001);
    const scale = 2.2 / maxDim;
    clone.position.sub(center);
    clone.scale.setScalar(scale);
    clone.updateMatrixWorld(true);
    const grounded = new THREE.Box3().setFromObject(clone);
    clone.position.y += groundY - grounded.min.y;
    return clone;
  }, [scene, groundY]);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    onReady?.(fitted);
  }, [fitted, onReady]);

  return <primitive object={fitted} />;
}
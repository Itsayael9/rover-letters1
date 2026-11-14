"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SPIN_POSES = new Set(["bounce", "shock", "roll"]);
const WAVE_POSES = new Set(["wave", "arm-up"]);

function Rover({ url, pose, reduceMotion, onReady }) {
  const { scene } = useGLTF(url);
  const group = useRef(null);
  const readySent = useRef(false);
  const spinTo = useRef(0);
  const prevPose = useRef(null);
  const motion = useRef({ y: -0.55, rx: 0, ry: 0, rz: 0 });

  const fitted = useMemo(() => {
    const model = scene.clone(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const fit = 1.55 / Math.max(size.x, size.y, size.z, 0.001);
    return { model, fit, offset: center.multiplyScalar(-1), halfH: (size.y * fit) / 2 };
  }, [scene]);

  useEffect(() => {
    if (readySent.current) return;
    readySent.current = true;
    onReady?.();
  }, [onReady]);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    if (pose !== prevPose.current) {
      if (!reduceMotion && SPIN_POSES.has(pose)) spinTo.current += Math.PI * 2;
      prevPose.current = pose;
    }

    let tx = 0;
    let tz = 0;
    let ty = -fitted.halfH;
    if (!reduceMotion && WAVE_POSES.has(pose)) {
      tz = Math.sin(t * 5.5) * 0.22;
      tx = -0.06;
      ty += Math.abs(Math.sin(t * 5.5)) * 0.06;
    } else if (!reduceMotion && (pose === "bounce" || pose === "shock")) {
      ty += Math.abs(Math.sin(t * 6)) * 0.18;
    } else if (!reduceMotion && pose === "shake") {
      tz = Math.sin(t * 22) * 0.07;
    } else if (!reduceMotion && pose === "look-up") {
      tx = -0.28;
    } else if (pose === "curl" || pose === "droop" || pose === "yawn") {
      tx = 0.22;
      ty -= 0.08;
    } else if (!reduceMotion && (pose === "call" || pose === "shine")) {
      tz = Math.sin(t * 2.2) * 0.08;
    }

    const sway = !pose && !reduceMotion ? Math.sin(t * 0.6) * 0.08 : 0;
    const k = 1 - Math.exp(-5 * dt);
    const m = motion.current;
    m.rx += (tx - m.rx) * k;
    m.rz += (tz - m.rz) * k;
    m.y += (ty - m.y) * k;
    m.ry += (spinTo.current + sway - m.ry) * (1 - Math.exp(-3 * dt));
    g.rotation.set(m.rx, m.ry, m.rz);
    g.position.y = m.y;
  });

  return (
    <group ref={group} scale={fitted.fit}>
      <primitive object={fitted.model} position={fitted.offset} />
    </group>
  );
}

/** 3D Opportunity. Motion is the whole rover: this file has no separate arm bone. */
export default function OppModelView({ pose = null, reduceMotion = false, onReady }) {
  return (
    <Canvas
      camera={{ position: [0.35, 0.35, 2.7], fov: 30 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl, camera }) => {
        gl.setClearColor(0x000000, 0);
        camera.lookAt(0, 0.05, 0);
      }}
    >
      <ambientLight intensity={0.95} />
      <directionalLight position={[3, 6, 4]} intensity={1.45} />
      <Suspense fallback={null}>
        <Rover
          url="/models/opportunity.glb"
          pose={pose}
          reduceMotion={reduceMotion}
          onReady={onReady}
        />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/opportunity.glb");

"use client";

import * as THREE from "three";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";

function Face({ speaking, cfg, eyesOpen = true }) {
  const mouth = useRef();
  const eyes = useRef();

  useFrame(({ clock }) => {
    if (!mouth.current || !eyes.current) return;
    const t = clock.elapsedTime;
    mouth.current.scale.y = speaking
      ? 0.35 + 0.65 * Math.abs(Math.sin(t * 11))
      : 0.12;
    if (!eyesOpen) {
      eyes.current.scale.y = 0.08;
    } else {
      eyes.current.scale.y = t % 4 < 0.12 ? 0.1 : 1;
    }
  });

  return (
    <group position={cfg.pos} rotation={[0, cfg.rotY, 0]} scale={cfg.scale}>
      <group ref={eyes}>
        {[-0.22, 0.22].map((x) => (
          <group key={x} position={[x, 0.12, 0]}>
            <mesh>
              <sphereGeometry args={[0.16, 24, 24]} />
              <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0, 0, 0.13]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#141a3c" />
            </mesh>
            <mesh position={[0.025, 0.03, 0.19]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </group>
        ))}
      </group>
      <group position={[0, -0.2, 0.05]} scale={[1.4, 1, 1]}>
        <mesh ref={mouth}>
          <sphereGeometry args={[0.14, 24, 24]} />
          <meshStandardMaterial color="#8a1f1f" />
        </mesh>
      </group>
    </group>
  );
}

function DustPuffs({ reduced }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 18; i += 1) {
      arr.push({
        x: (Math.random() - 0.5) * 3.2,
        y: Math.random() * 0.4,
        z: (Math.random() - 0.5) * 2.2 - 0.4,
        s: 0.08 + Math.random() * 0.14,
        speed: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current || reduced) return;
    const t = clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      const p = positions[i];
      child.position.y = p.y + Math.sin(t * p.speed + p.phase) * 0.12 + 0.05;
      child.material.opacity = 0.18 + Math.sin(t * p.speed + p.phase) * 0.08;
    });
  });

  return (
    <group ref={ref}>
      {positions.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} scale={p.s}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial color="#e8c4a0" transparent opacity={0.22} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function RoverModel({ url, speaking, face, eyesOpen, celebrate }) {
  const { scene } = useGLTF(url);
  const swing = useRef();

  const { model, fit, offset } = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const fix = (m) => {
        const c = m.clone();
        if (typeof c.metalness === "number") c.metalness = Math.min(c.metalness, 0.35);
        if (typeof c.roughness === "number") c.roughness = Math.max(c.roughness, 0.45);
        return c;
      };
      o.material = Array.isArray(o.material) ? o.material.map(fix) : fix(o.material);
    });
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    return {
      model,
      fit: 3 / Math.max(size.x, size.y, size.z),
      offset: center.multiplyScalar(-1),
    };
  }, [scene]);

  useFrame(({ clock }) => {
    if (!swing.current) return;
    const base = Math.sin(clock.elapsedTime * 0.4) * 0.2;
    swing.current.rotation.y = celebrate
      ? base + Math.sin(clock.elapsedTime * 2.2) * 0.15
      : base;
  });

  return (
    <group ref={swing}>
      <group scale={fit}>
        <primitive object={model} position={offset} />
      </group>
      <Face speaking={speaking} cfg={face} eyesOpen={eyesOpen} />
    </group>
  );
}

/** Warm kids-stage canvas with Opp model, cartoon face, and soft dust. */
export default function OppRoverCanvas({
  modelUrl,
  face,
  speaking = false,
  eyesOpen = true,
  celebrate = false,
  className = "",
}) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className={`kids-rover-canvas ${className}`}>
      <Canvas camera={{ position: [0, 1.15, 5.4], fov: 40 }} dpr={[1, 1.75]}>
        <color attach="background" args={["#fff4e6"]} />
        <ambientLight intensity={1.05} />
        <hemisphereLight args={["#fff8ef", "#e8b48a", 1]} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} color="#fff2e0" />
        <directionalLight position={[-5, 3, 4]} intensity={1.1} color="#ffd2b0" />
        <Environment resolution={128} frames={1}>
          <Lightformer intensity={1.8} position={[0, 5, -5]} scale={[12, 12, 1]} />
          <Lightformer intensity={1.2} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[10, 5, 1]} />
        </Environment>
        <Suspense fallback={null}>
          <RoverModel
            url={modelUrl}
            speaking={speaking}
            face={face}
            eyesOpen={eyesOpen}
            celebrate={celebrate}
          />
          <DustPuffs reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/opportunity.glb");

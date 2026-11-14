"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { BODIES } from "@/data/bodies";

function SpinningWorld({ body, position, size }) {
  const mesh = useRef();
  const map = useTexture(body.texture);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1, 1);
  map.offset.set(0, 0);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group position={position}>
      <mesh ref={mesh}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial map={map} roughness={0.9} metalness={0.05} />
      </mesh>
    </group>
  );
}

function Worlds() {
  const moon = BODIES.find((body) => body.id === "moon");
  const mars = BODIES.find((body) => body.id === "mars");

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 3, 6]} intensity={1.9} />
      <directionalLight position={[-5, 2, 4]} intensity={0.7} color="#9bb8ff" />
      <SpinningWorld body={moon} position={[-1.55, 0.08, 0]} size={0.92} />
      <SpinningWorld body={mars} position={[1.65, -0.06, 0]} size={1.18} />
    </>
  );
}

export default function IntroWorlds() {
  return (
    <div className="intro-worlds" style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 5.4], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Worlds />
        </Suspense>
      </Canvas>
    </div>
  );
}

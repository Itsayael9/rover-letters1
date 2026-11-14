"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { BODIES } from "@/data/bodies";

function Starfield() {
  const texture = useTexture("/textures/milkyway.jpg");
  return (
    <mesh raycast={() => null} renderOrder={-2}>
      <sphereGeometry args={[48, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} color="#606060" toneMapped={false} />
    </mesh>
  );
}

function Planet({ body, position, size, spin = 0.04 }) {
  const mesh = useRef();
  const map = useTexture(body.texture);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1, 1);

  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * spin;
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[size, 48, 48]} />
      <meshStandardMaterial map={map} roughness={0.92} metalness={0.04} />
    </mesh>
  );
}

function EarthGroup({ body }) {
  const group = useRef();
  const map = useTexture(body.texture);
  const night = useTexture(body.nightTexture);
  const clouds = useTexture(body.cloudsTexture);
  const cloudMesh = useRef();

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.035;
    if (cloudMesh.current) cloudMesh.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={group} position={[-2.4, 0.1, -0.6]}>
      <mesh>
        <sphereGeometry args={[0.95, 48, 48]} />
        <meshStandardMaterial
          map={map}
          emissiveMap={night}
          emissive="#ffd9a0"
          emissiveIntensity={0.45}
        />
      </mesh>
      <mesh ref={cloudMesh}>
        <sphereGeometry args={[0.97, 48, 48]} />
        <meshStandardMaterial
          map={clouds}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function ReadyPing({ onReady }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

function Scene({ parallax, onReady }) {
  const { camera } = useThree();
  const moon = BODIES.find((b) => b.id === "moon");
  const mars = BODIES.find((b) => b.id === "mars");
  const earth = BODIES.find((b) => b.id === "earth");

  useFrame(() => {
    camera.position.x = parallax.x * 0.35;
    camera.position.y = parallax.y * 0.2;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 4]} intensity={1.4} />
      <directionalLight position={[-4, 1, 2]} intensity={0.35} color="#9bb8ff" />
      <Starfield />
      {earth && <EarthGroup body={earth} />}
      {moon && <Planet body={moon} position={[0.2, -0.15, 0.2]} size={0.42} spin={0.03} />}
      {mars && <Planet body={mars} position={[2.35, 0.05, -0.3]} size={0.78} spin={0.028} />}
      <ReadyPing onReady={onReady} />
    </>
  );
}

export default function EntranceBackdrop({ parallax = { x: 0, y: 0 }, onReady }) {
  return (
    <div className="entrance-backdrop">
      <Canvas camera={{ position: [0, 0, 5.2], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: false }}>
        <Suspense fallback={null}>
          <Scene parallax={parallax} onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}

"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { ROCKET_IMAGE } from "@/data/rocketAsset";

/** Scaled for a readable “textbook diagram” view (not true astronomical scale). */
const PLANETS = [
  {
    id: "mercury",
    name: "Mercury",
    orbit: 3.2,
    size: 0.28,
    speed: 2.4,
    color: "#b5b5b5",
    phase: 0.4,
  },
  {
    id: "venus",
    name: "Venus",
    orbit: 4.4,
    size: 0.36,
    speed: 1.85,
    color: "#e8cda8",
    phase: 2.1,
  },
  {
    id: "earth",
    name: "Earth",
    orbit: 5.6,
    size: 0.4,
    speed: 1.55,
    texture: "/textures/earth.jpg",
    phase: 4.2,
  },
  {
    id: "mars",
    name: "Mars",
    orbit: 6.8,
    size: 0.34,
    speed: 1.25,
    texture: "/textures/mars.jpg",
    phase: 5.5,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    orbit: 8.6,
    size: 0.72,
    speed: 0.65,
    texture: "/textures/2k_jupiter.jpg",
    phase: 1.2,
  },
  {
    id: "saturn",
    name: "Saturn",
    orbit: 10.4,
    size: 0.62,
    speed: 0.5,
    texture: "/textures/2k_saturn.jpg",
    ring: true,
    phase: 3.8,
  },
];

const ROCKET_ORBIT = 7.6;

function orbitPoints(radius, segments = 128) {
  const pts = [];
  for (let i = 0; i <= segments; i += 1) {
    const a = (i / segments) * Math.PI * 2;
    pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
  }
  return pts;
}

function OrbitPath({ radius }) {
  const points = useMemo(() => orbitPoints(radius), [radius]);
  return (
    <Line
      points={points}
      color="#c8d4e8"
      lineWidth={1}
      transparent
      opacity={0.45}
      dashed
      dashSize={0.35}
      gapSize={0.22}
    />
  );
}

function OrbitLabel({ name, radius }) {
  return (
    <Html position={[radius + 0.55, 0.12, 0]} center distanceFactor={14}>
      <span className="solar-orbit-label">{name}</span>
    </Html>
  );
}

function Sun() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.95, 48, 48]} />
        <meshBasicMaterial color="#ffcc66" />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshBasicMaterial color="#ff9933" transparent opacity={0.22} />
      </mesh>
      <pointLight intensity={3.5} distance={45} color="#ffe8b0" />
      <Html position={[0, 1.35, 0]} center distanceFactor={16}>
        <span className="solar-orbit-label solar-orbit-label--sun">Sun</span>
      </Html>
    </group>
  );
}

function ColorPlanetMesh({ body, map }) {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.y += 0.008;
  });
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[body.size, 32, 32]} />
      {map ? (
        <meshStandardMaterial map={map} roughness={0.92} metalness={0.02} />
      ) : (
        <meshStandardMaterial color={body.color} roughness={0.88} metalness={0.05} />
      )}
    </mesh>
  );
}

function PlanetBody({ body, time, map }) {
  const angle = time * body.speed * 0.35 + (body.phase ?? 0);
  const x = Math.cos(angle) * body.orbit;
  const z = Math.sin(angle) * body.orbit;

  return (
    <group position={[x, 0, z]}>
      {body.ring && (
        <mesh rotation={[Math.PI / 2.15, 0, 0]}>
          <ringGeometry args={[body.size * 1.45, body.size * 2.05, 64]} />
          <meshBasicMaterial
            color="#e8dfc8"
            side={THREE.DoubleSide}
            transparent
            opacity={0.75}
          />
        </mesh>
      )}
      <ColorPlanetMesh body={body} map={map} />
      <Html position={[0, body.size + 0.35, 0]} center distanceFactor={12}>
        <span className="solar-planet-tag">{body.name}</span>
      </Html>
    </group>
  );
}

function TexturedPlanet({ body, time }) {
  const map = useTexture(body.texture);
  return <PlanetBody body={body} time={time} map={map} />;
}

function Planet({ body, time }) {
  if (body.texture) return <TexturedPlanet body={body} time={time} />;
  return <PlanetBody body={body} time={time} map={null} />;
}

function OrbitingRocket({ time, rocketSrc }) {
  const angle = time * 0.42 + 0.2;
  const x = Math.cos(angle) * ROCKET_ORBIT;
  const z = Math.sin(angle) * ROCKET_ORBIT;
  const yaw = -angle + Math.PI / 2;

  return (
    <Html position={[x, 0.35, z]} center transform sprite distanceFactor={10}>
      <div className="solar-rocket-wrap" style={{ transform: `rotate(${yaw}rad)` }}>
        <img src={rocketSrc} alt="" className="solar-rocket" draggable={false} />
      </div>
    </Html>
  );
}

function System({ time, rocketSrc }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 10, 4]} intensity={0.55} />
      <Sun />
      {PLANETS.map((body) => (
        <OrbitPath key={`path-${body.id}`} radius={body.orbit} />
      ))}
      <OrbitPath radius={ROCKET_ORBIT} />
      {PLANETS.map((body) => (
        <OrbitLabel key={`label-${body.id}`} name={body.name} radius={body.orbit} />
      ))}
      {PLANETS.map((body) => (
        <Planet key={body.id} body={body} time={time} />
      ))}
      <OrbitingRocket time={time} rocketSrc={rocketSrc} />
    </>
  );
}

/** Top-down solar system diagram with orbit rings, labels, and a flying rocket. */
export default function SolarSystemView({ time = 0, rocketSrc = ROCKET_IMAGE }) {
  return (
    <div className="solar-system-view">
      <p className="solar-diagram-caption">Our solar system — each dashed circle is a planet&apos;s orbit</p>
      <Canvas
        camera={{ position: [0, 16, 10], fov: 42, near: 0.1, far: 200 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <System time={time} rocketSrc={rocketSrc} />
        </Suspense>
      </Canvas>
    </div>
  );
}

"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const WHITE = "#f4f1ea";
const ALUM = "#c5ced6";
const GOLD = "#d4a84b";
const PAD = "#4e555c";
const PANEL = "#1d4f8f";
const CELL = "#8ec4ff";

function Leg({ angle }) {
  const { mid, quat, foot } = useMemo(() => {
    const hip = new THREE.Vector3(Math.sin(angle) * 0.32, 0.62, Math.cos(angle) * 0.32);
    const foot = new THREE.Vector3(Math.sin(angle) * 1.22, 0.04, Math.cos(angle) * 1.22);
    const dir = foot.clone().sub(hip);
    const mid = hip.clone().add(foot).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { mid, quat, foot, length: dir.length() };
  }, [angle]);

  return (
    <group>
      <mesh position={mid} quaternion={quat} castShadow>
        <cylinderGeometry args={[0.032, 0.038, mid.distanceTo(foot) * 2, 8]} />
        <meshStandardMaterial color={ALUM} metalness={0.55} roughness={0.32} />
      </mesh>
      <mesh position={[foot.x, 0.14, foot.z]}>
        <cylinderGeometry args={[0.07, 0.09, 0.16, 8]} />
        <meshStandardMaterial color={GOLD} metalness={0.35} roughness={0.5} />
      </mesh>
      <mesh position={[foot.x, 0.035, foot.z]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.28, 0.06, 20]} />
        <meshStandardMaterial color={PAD} roughness={0.8} />
      </mesh>
    </group>
  );
}

function SolarPanel() {
  return (
    <group position={[0, 1.05, -0.05]}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.03, 0.034, 0.58, 8]} />
        <meshStandardMaterial color={ALUM} metalness={0.5} roughness={0.35} />
      </mesh>
      <group position={[0, 0.58, 0]} rotation={[-0.42, 0.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.45, 0.035, 0.86]} />
          <meshStandardMaterial color={PANEL} roughness={0.4} metalness={0.15} />
        </mesh>
        {[-0.36, 0, 0.36].map((x) => (
          <mesh key={x} position={[x, 0.02, 0]}>
            <boxGeometry args={[0.012, 0.01, 0.72]} />
            <meshStandardMaterial color={CELL} emissive={CELL} emissiveIntensity={0.25} />
          </mesh>
        ))}
        {[-0.2, 0.2].map((z) => (
          <mesh key={z} position={[0, 0.02, z]}>
            <boxGeometry args={[1.2, 0.01, 0.012]} />
            <meshStandardMaterial color={CELL} emissive={CELL} emissiveIntensity={0.25} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CameraMast() {
  return (
    <group position={[0, 0.95, 0.46]}>
      <mesh>
        <cylinderGeometry args={[0.025, 0.028, 0.42, 8]} />
        <meshStandardMaterial color={ALUM} metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.26, 0.06]} rotation={[0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.16, 16]} />
        <meshStandardMaterial color={WHITE} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.26, 0.15]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.05, 0.04, 16]} />
        <meshStandardMaterial color="#141820" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Antenna() {
  return (
    <group position={[-0.55, 0.95, -0.15]} rotation={[0.15, -0.6, 0.2]}>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.018, 0.02, 0.7, 8]} />
        <meshStandardMaterial color={ALUM} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.62, 0.46, 0.04]} />
        <meshStandardMaterial color="#e8eef6" metalness={0.25} roughness={0.35} />
      </mesh>
      {[-0.16, 0, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.72, 0.03]}>
          <boxGeometry args={[0.012, 0.4, 0.012]} />
          <meshStandardMaterial color="#8aa0b8" metalness={0.4} roughness={0.3} />
        </mesh>
      ))}
      {[-0.12, 0.12].map((y) => (
        <mesh key={y} position={[0, 0.72 + y, 0.03]}>
          <boxGeometry args={[0.52, 0.012, 0.012]} />
          <meshStandardMaterial color="#8aa0b8" metalness={0.4} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Frame({ legs }) {
  const tubes = useMemo(() => {
    const feet = legs.map((angle) => new THREE.Vector3(Math.sin(angle) * 1.22, 0.16, Math.cos(angle) * 1.22));
    const pairs = [
      [feet[0], feet[1]],
      [feet[1], feet[2]],
      [feet[2], feet[0]],
    ];
    return pairs.map(([a, b]) => {
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const dir = b.clone().sub(a);
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      return { mid, quat, length: dir.length() };
    });
  }, [legs]);

  return (
    <group>
      {tubes.map((tube, i) => (
        <mesh key={i} position={tube.mid} quaternion={tube.quat}>
          <cylinderGeometry args={[0.022, 0.022, tube.length, 6]} />
          <meshStandardMaterial color={ALUM} metalness={0.55} roughness={0.32} />
        </mesh>
      ))}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.55, 8]} />
        <meshStandardMaterial color={ALUM} metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Scoop({ digging }) {
  const arm = useRef();
  useFrame(({ clock }) => {
    if (!arm.current) return;
    const t = clock.elapsedTime;
    const dig = digging.current
      ? -1.05 + Math.sin(t * 5.4) * 0.22
      : -0.12 + Math.sin(t * 0.7) * 0.03;
    const reach = digging.current ? Math.sin(t * 3.1) * 0.08 : 0;
    arm.current.rotation.z += (dig - arm.current.rotation.z) * 0.14;
    arm.current.rotation.x += (reach - arm.current.rotation.x) * 0.16;
  });
  return (
    <group ref={arm} position={[0.48, 0.62, 0.1]}>
      <mesh position={[0.28, -0.02, 0]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.62, 0.045, 0.045]} />
        <meshStandardMaterial color={ALUM} metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[0.58, -0.08, 0]} rotation={[0, 0, 0.4]} castShadow>
        <boxGeometry args={[0.2, 0.07, 0.14]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  );
}

export default function SurveyorLander3D({ stateRef }) {
  const root = useRef();
  const digging = useRef(false);
  const legs = useMemo(() => [0.4, 0.4 + (Math.PI * 2) / 3, 0.4 + (Math.PI * 4) / 3], []);

  useFrame(({ clock }) => {
    digging.current = Boolean(stateRef?.current?.digging);
    if (!root.current) return;
    const lean = digging.current ? Math.sin(clock.elapsedTime * 4.2) * 0.035 : 0;
    root.current.rotation.x += (lean - root.current.rotation.x) * 0.12;
    root.current.rotation.z = digging.current ? Math.sin(clock.elapsedTime * 2.6) * 0.02 : 0;
  });

  return (
    <group ref={root} scale={1.25}>
      <Frame legs={legs} />
      {legs.map((angle) => (
        <Leg key={angle} angle={angle} />
      ))}

      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.95, 0.42, 0.78]} />
        <meshStandardMaterial color={WHITE} roughness={0.62} />
      </mesh>
      <mesh position={[-0.22, 0.78, 0.02]}>
        <boxGeometry args={[0.28, 0.22, 0.36]} />
        <meshStandardMaterial color={GOLD} metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[0.22, 0.66, -0.18]}>
        <boxGeometry args={[0.32, 0.16, 0.22]} />
        <meshStandardMaterial color="#ded8cc" roughness={0.7} />
      </mesh>

      <SolarPanel />
      <CameraMast />
      <Antenna />
      <Scoop digging={digging} />
    </group>
  );
}

"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { APOLLO_PAD, FLAG_POS, playfieldHeight } from "@/lib/lunarPlayfield";

const SUIT = "#f4f6f8";
const GOLD = "#c9a227";
const BOOT = "#3a4048";

function flagTexture() {
  const c = document.createElement("canvas");
  c.width = 380;
  c.height = 200;
  const ctx = c.getContext("2d");
  const stripeH = 200 / 13;
  for (let i = 0; i < 13; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? "#B22234" : "#FFFFFF";
    ctx.fillRect(0, i * stripeH, 380, stripeH + 1);
  }
  ctx.fillStyle = "#3C3B6E";
  ctx.fillRect(0, 0, 152, stripeH * 7);
  ctx.fillStyle = "#FFFFFF";
  for (let r = 0; r < 9; r += 1) {
    const cols = r % 2 === 0 ? 6 : 5;
    for (let s = 0; s < cols; s += 1) {
      const x = 14 + s * 24 + (r % 2 === 0 ? 0 : 12);
      const y = 10 + r * 10.5;
      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function SuitLeg({ side, legRef }) {
  const x = side === "left" ? -0.13 : 0.13;
  return (
    <group ref={legRef} position={[x, 0.66, 0]}>
      <mesh position={[0, -0.32, 0]} castShadow>
        <capsuleGeometry args={[0.075, 0.46, 4, 8]} />
        <meshStandardMaterial color={SUIT} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.62, 0.05]} castShadow>
        <boxGeometry args={[0.14, 0.08, 0.22]} />
        <meshStandardMaterial color={BOOT} roughness={0.7} />
      </mesh>
    </group>
  );
}

function SuitArm({ side, armRef }) {
  const x = side === "left" ? -0.3 : 0.3;
  return (
    <group ref={armRef} position={[x, 1.14, 0]}>
      <mesh position={[0, -0.2, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.28, 4, 8]} />
        <meshStandardMaterial color={SUIT} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.4, 0.02]}>
        <boxGeometry args={[0.09, 0.08, 0.09]} />
        <meshStandardMaterial color={BOOT} roughness={0.6} />
      </mesh>
    </group>
  );
}

/** A7L-style suit. Boots rest at y = 0. The body only yaws, so it stays upright. */
function Astronaut({ motionRef }) {
  const leftLeg = useRef();
  const rightLeg = useRef();
  const leftArm = useRef();
  const rightArm = useRef();

  useFrame(({ clock }) => {
    const m = motionRef.current;
    const s = m.walking ? Math.sin(clock.elapsedTime * 6.5) : 0;
    const hammer = m.planting ? -1.2 - Math.sin(clock.elapsedTime * 9) * 0.18 : 0;
    if (leftLeg.current) leftLeg.current.rotation.x = s * 0.5;
    if (rightLeg.current) rightLeg.current.rotation.x = -s * 0.5;
    if (leftArm.current) leftArm.current.rotation.x = m.planting ? -0.35 : -s * 0.4;
    if (rightArm.current) rightArm.current.rotation.x = m.planting ? hammer : s * 0.4;
  });

  return (
    <group>
      <SuitLeg side="left" legRef={leftLeg} />
      <SuitLeg side="right" legRef={rightLeg} />
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[0.46, 0.5, 0.28]} />
        <meshStandardMaterial color={SUIT} roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.02, -0.18]} castShadow>
        <boxGeometry args={[0.36, 0.48, 0.16]} />
        <meshStandardMaterial color="#e7eef6" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0.18, 1.16, 0.15]}>
        <boxGeometry args={[0.09, 0.07, 0.02]} />
        <meshStandardMaterial color="#3C3B6E" />
      </mesh>
      <mesh position={[0, 1.38, 0.02]} castShadow>
        <sphereGeometry args={[0.22, 24, 18]} />
        <meshStandardMaterial color={SUIT} roughness={0.32} />
      </mesh>
      <mesh position={[0, 1.4, 0.14]} rotation={[-0.2, 0, 0]}>
        <sphereGeometry args={[0.16, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.15} emissive="#6a4a10" emissiveIntensity={0.3} />
      </mesh>
      <SuitArm side="left" armRef={leftArm} />
      <SuitArm side="right" armRef={rightArm} />
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 20]} />
        <meshBasicMaterial color="#000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function LunarModule({ thrusters }) {
  const flame = useRef();
  useFrame(({ clock }) => {
    if (!flame.current) return;
    flame.current.visible = thrusters;
    const s = 0.7 + Math.abs(Math.sin(clock.elapsedTime * 18)) * 0.45;
    flame.current.scale.set(s, 1 + s * 0.4, s);
  });

  const pads = [
    [-1.15, -1.15],
    [1.15, -1.15],
    [-1.15, 1.15],
    [1.15, 1.15],
  ];

  return (
    <group>
      {pads.map(([x, z], i) => {
        const hip = new THREE.Vector3(x * 0.42, 0.95, z * 0.42);
        const foot = new THREE.Vector3(x, 0.04, z);
        const mid = hip.clone().add(foot).multiplyScalar(0.5);
        const dir = foot.clone().sub(hip);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        return (
          <group key={i}>
            <mesh position={mid} quaternion={quat} castShadow>
              <cylinderGeometry args={[0.035, 0.04, dir.length(), 6]} />
              <meshStandardMaterial color="#c5d0dc" metalness={0.45} roughness={0.35} />
            </mesh>
            <mesh position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.24, 0.045, 16]} />
              <meshStandardMaterial color="#5c656e" roughness={0.8} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.95, 1.05, 0.42, 8]} />
        <meshStandardMaterial color="#c9a45a" metalness={0.55} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.16, 0.28, 0.28, 12]} />
        <meshStandardMaterial color="#8d939c" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh ref={flame} position={[0, 0.38, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.18, 0.55, 10]} />
        <meshBasicMaterial color="#ffb070" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[0.72, 0.62, 0.72]} />
        <meshStandardMaterial color="#e7eef5" metalness={0.15} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.58, 0.37]}>
        <boxGeometry args={[0.42, 0.16, 0.02]} />
        <meshStandardMaterial color="#1a2433" metalness={0.4} roughness={0.2} />
      </mesh>
      <mesh position={[0.42, 1.85, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.55, 6]} />
        <meshStandardMaterial color="#d0d6de" metalness={0.4} />
      </mesh>
      <mesh position={[0.55, 0.55, 0.15]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.08, 0.7, 0.04]} />
        <meshStandardMaterial color="#9aa3ad" metalness={0.3} />
      </mesh>
    </group>
  );
}

export default function ApolloFlag3D({ phase, controlRef, poseRef, onFlagPlanted, onCanPlant }) {
  const lm = useRef();
  const crew = useRef();
  const flag = useRef();
  const pole = useRef();
  const cloth = useRef();
  const crossbar = useRef();
  const motionRef = useRef({ walking: false, planting: false });
  const landingY = playfieldHeight(APOLLO_PAD.x, APOLLO_PAD.z);
  const flagY = playfieldHeight(FLAG_POS.x, FLAG_POS.z);
  const tex = useMemo(() => flagTexture(), []);
  const start = useRef(null);
  const walkStart = useRef(null);
  const toldReady = useRef(false);
  const planted = useRef(false);
  const planting = useRef(false);

  const route = useMemo(() => {
    const dx = FLAG_POS.x - APOLLO_PAD.x;
    const dz = FLAG_POS.z - APOLLO_PAD.z;
    const len = Math.hypot(dx, dz) || 1;
    const ux = dx / len;
    const uz = dz / len;
    const px = -uz;
    const pz = ux;
    return {
      start: { x: APOLLO_PAD.x + px * 2.15, z: APOLLO_PAD.z + pz * 2.15 },
      end: { x: FLAG_POS.x + px * 0.72, z: FLAG_POS.z + pz * 0.72 },
      px,
      pz,
    };
  }, []);

  useFrame(({ clock }, dt) => {
    const show = phase === "landing" || phase === "flag" || phase === "complete";
    if (show) {
      if (start.current == null) start.current = clock.elapsedTime;
    } else {
      start.current = null;
      walkStart.current = null;
      toldReady.current = false;
      planted.current = false;
      planting.current = false;
    }
    const elapsed = clock.elapsedTime - (start.current ?? clock.elapsedTime);
    const step = Math.min(dt, 0.05);

    let lmY = landingY;
    if (lm.current) {
      const fly = phase === "landing" ? Math.min(1, elapsed / 6) : 1;
      const t = fly * fly * (3 - 2 * fly);
      lmY = THREE.MathUtils.lerp(landingY + 16, landingY, t);
      if (phase !== "landing") lmY = landingY;
      lm.current.position.set(APOLLO_PAD.x, lmY, APOLLO_PAD.z);
      lm.current.visible = show;
    }

    if (phase === "flag" && walkStart.current == null) walkStart.current = clock.elapsedTime;
    const walked =
      phase === "complete"
        ? 1
        : walkStart.current == null
          ? 0
          : Math.min(1, (clock.elapsedTime - walkStart.current) / 7);
    const ease = walked * walked * (3 - 2 * walked);
    const crewX = THREE.MathUtils.lerp(route.start.x, route.end.x, ease);
    const crewZ = THREE.MathUtils.lerp(route.start.z, route.end.z, ease);
    const crewY = playfieldHeight(crewX, crewZ);
    const walking = phase === "flag" && walked < 1 && !planting.current;

    if (walked >= 1 && phase === "flag" && !toldReady.current) {
      toldReady.current = true;
      onCanPlant?.();
    }

    if (controlRef?.current?.plantClick && walked >= 1 && phase === "flag" && !planting.current && !planted.current) {
      planting.current = true;
      controlRef.current.plantClick = false;
    }

    let plant = controlRef?.current?.plantAmount ?? 0;
    if (planting.current) {
      plant = Math.min(1, plant + step * 0.45);
      controlRef.current.plantAmount = plant;
      if (plant >= 1 && !planted.current) {
        planted.current = true;
        planting.current = false;
        onFlagPlanted?.();
      }
    }
    if (phase === "complete") plant = 1;
    motionRef.current.walking = walking;
    motionRef.current.planting = planting.current || (phase === "complete" && plant > 0.2);

    if (crew.current) {
      crew.current.position.set(crewX, crewY, crewZ);
      crew.current.visible = phase === "flag" || phase === "complete";
      const faceX = planting.current || walked >= 1 ? FLAG_POS.x : route.end.x;
      const faceZ = planting.current || walked >= 1 ? FLAG_POS.z : route.end.z;
      const yaw = Math.atan2(faceX - crewX, faceZ - crewZ);
      crew.current.rotation.set(0, yaw, 0);
    }

    if (flag.current) {
      flag.current.position.set(FLAG_POS.x, flagY, FLAG_POS.z);
      flag.current.visible = plant > 0.02 || phase === "complete";
      if (pole.current) {
        const h = 1.7 * Math.max(plant, 0.02);
        pole.current.scale.y = h / 1.7;
        pole.current.position.y = h * 0.5;
      }
      if (crossbar.current) {
        crossbar.current.visible = plant > 0.62;
        crossbar.current.position.y = 1.55 * plant;
      }
      if (cloth.current) {
        cloth.current.visible = plant > 0.62;
        cloth.current.position.y = 1.55 * plant;
        cloth.current.material.opacity = Math.min(1, (plant - 0.55) * 3);
      }
    }

    if (poseRef?.current) {
      const pose = poseRef.current;
      pose.ready = show;
      if (phase === "landing") {
        pose.eye.set(APOLLO_PAD.x + 8.2, lmY + 3.6, APOLLO_PAD.z + 8.4);
        pose.look.set(APOLLO_PAD.x, lmY + 1.5, APOLLO_PAD.z);
      } else if (phase === "flag" || phase === "complete") {
        pose.eye.set(crewX - route.px * 5.6, crewY + 2.2, crewZ - route.pz * 5.6);
        pose.look.set(crewX, crewY + 0.75, crewZ);
      }
    }
  });

  const thrusters = phase === "landing";

  return (
    <group>
      <group ref={lm} visible={false} scale={1.55}>
        <LunarModule thrusters={thrusters} />
      </group>
      <group ref={crew} visible={false}>
        <Astronaut motionRef={motionRef} />
      </group>
      <group ref={flag} visible={false}>
        <mesh ref={pole} position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.026, 1.7, 8]} />
          <meshStandardMaterial color="#d5dbe3" metalness={0.5} roughness={0.32} />
        </mesh>
        <mesh ref={crossbar} position={[0.42, 1.55, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.9, 6]} />
          <meshStandardMaterial color="#c5cdd6" metalness={0.45} roughness={0.35} />
        </mesh>
        <mesh ref={cloth} position={[0.48, 1.55, 0]}>
          <planeGeometry args={[0.92, 0.5]} />
          <meshStandardMaterial map={tex} side={THREE.DoubleSide} transparent roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

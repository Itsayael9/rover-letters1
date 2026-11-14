"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, useTexture } from "@react-three/drei";
import SurveyorLander3D from "@/components/kids/surveyor/SurveyorLander3D";
import ApolloFlag3D from "@/components/kids/surveyor/ApolloFlag3D";
import {
  ARRIVE_R,
  FLAG_POS,
  SAFE_SPOT,
  SPAWN,
  SPAWN_YAW,
  WORLD,
  clampWorld,
  dampAngle,
  playfieldHeight,
  playfieldHeightSmooth,
} from "@/lib/lunarPlayfield";

function Terrain({ onPick, picking }) {
  const source = useTexture("/textures/moon.jpg");
  const texture = useMemo(() => {
    const tiled = source.clone();
    tiled.wrapS = THREE.RepeatWrapping;
    tiled.wrapT = THREE.RepeatWrapping;
    tiled.repeat.set(5, 5);
    tiled.colorSpace = THREE.SRGBColorSpace;
    tiled.anisotropy = 8;
    tiled.needsUpdate = true;
    return tiled;
  }, [source]);

  useEffect(() => () => texture.dispose(), [texture]);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(WORLD, WORLD, 140, 140);
    const pos = geo.attributes.position;
    const colors = [];
    const rock = new THREE.Color("#6d6a70");
    const pale = new THREE.Color("#e8e6e2");
    const pad = new THREE.Color("#c8e8ff");
    const c = new THREE.Color();

    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      const z = -pos.getY(i);
      const h = playfieldHeight(x, z);
      pos.setZ(i, h);
      const dSafe = Math.hypot(x - SAFE_SPOT.x, z - SAFE_SPOT.z);
      c.copy(rock).lerp(pale, 0.45 + 0.2 * Math.sin(x * 0.3 + z * 0.2));
      if (dSafe < 4.2) c.lerp(pad, 1 - dSafe / 4.2);
      colors.push(c.r, c.g, c.b);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onPointerDown={(e) => {
        if (!picking()) return;
        e.stopPropagation();
        onPick(e.point.x, e.point.z, true);
      }}
      onPointerMove={(e) => {
        if (!picking() || e.buttons === 0) return;
        onPick(e.point.x, e.point.z, false);
      }}
      onPointerUp={() => onPick(null, null, false)}
    >
      <meshStandardMaterial map={texture} vertexColors roughness={0.95} metalness={0} />
    </mesh>
  );
}

function GuideArrow({ roverRef, active }) {
  const group = useRef();
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const st = roverRef.current;
    const dx = SAFE_SPOT.x - st.pos.x;
    const dz = SAFE_SPOT.z - st.pos.z;
    const dist = Math.hypot(dx, dz);
    g.visible = active && dist > ARRIVE_R + 0.4;
    g.position.set(st.pos.x, st.pos.y + 2.45, st.pos.z);
    g.rotation.y = Math.atan2(dx, dz);
    const bob = Math.sin(clock.elapsedTime * 3) * 0.08;
    g.position.y += bob;
  });
  return (
    <group ref={group}>
      <mesh position={[0, 0, 1.15]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.38, 0.72, 3]} />
        <meshBasicMaterial color="#7ee8c1" />
      </mesh>
    </group>
  );
}

function SafeBeacon({ active }) {
  const ring = useRef();
  const beam = useRef();
  const y = playfieldHeight(SAFE_SPOT.x, SAFE_SPOT.z) + 0.04;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ring.current) {
      const s = 1.35 + Math.sin(t * 1.8) * 0.1;
      ring.current.scale.set(s, s, s);
      ring.current.material.opacity = active ? 0.5 + Math.sin(t * 2.2) * 0.18 : 0.16;
    }
    if (beam.current) {
      beam.current.material.opacity = active ? 0.18 + Math.sin(t * 1.6) * 0.06 : 0.05;
    }
  });

  return (
    <group position={[SAFE_SPOT.x, y, SAFE_SPOT.z]}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.15, 3.7, 48]} />
        <meshBasicMaterial color="#7ee8c1" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.05, 32]} />
        <meshStandardMaterial
          color="#9ad8ff"
          emissive="#4ade80"
          emissiveIntensity={active ? 0.85 : 0.2}
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh ref={beam} position={[0, 5.2, 0]}>
        <cylinderGeometry args={[0.12, 1.15, 10.4, 16, 1, true]} />
        <meshBasicMaterial color="#9ad8ff" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 9.6, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color={active ? "#b8ffe0" : "#9ad8ff"} />
      </mesh>
    </group>
  );
}

function GoalMarker({ roverRef }) {
  const mesh = useRef();
  useFrame(({ clock }) => {
    const g = roverRef.current.goal;
    if (!mesh.current) return;
    if (!g) {
      mesh.current.visible = false;
      return;
    }
    mesh.current.visible = true;
    mesh.current.position.set(g.x, playfieldHeight(g.x, g.z) + 0.05, g.z);
    const s = 0.85 + Math.sin(clock.elapsedTime * 3) * 0.08;
    mesh.current.scale.set(s, 1, s);
  });
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
      <ringGeometry args={[0.35, 0.52, 28]} />
      <meshBasicMaterial color="#f5c451" transparent opacity={0.85} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Trench({ visible }) {
  const y = playfieldHeight(SAFE_SPOT.x, SAFE_SPOT.z);
  if (!visible) return null;
  return (
    <mesh position={[SAFE_SPOT.x - 0.35, y + 0.03, SAFE_SPOT.z + 0.2]} rotation={[-Math.PI / 2, 0, 0.4]}>
      <boxGeometry args={[1.1, 0.28, 0.08]} />
      <meshStandardMaterial color="#3a3840" roughness={1} />
    </mesh>
  );
}

function Dust({ roverRef, origin }) {
  const ref = useRef();
  const parts = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        a: (i / 16) * Math.PI * 2,
        r: 0.25 + (i % 5) * 0.1,
        s: 0.035 + (i % 3) * 0.02,
        ph: i * 0.4,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const moving = Boolean(roverRef.current.moving);
    const digging = Boolean(roverRef.current.digging);
    const on = moving || digging;
    const t = clock.elapsedTime;
    ref.current.position.copy(origin.current);
    ref.current.children.forEach((ch, i) => {
      const p = parts[i];
      const lift = on ? 0.06 + Math.abs(Math.sin(t * 5 + p.ph)) * (digging ? 0.28 : 0.1) : 0.02;
      ch.position.set(Math.cos(p.a + t * 0.6) * p.r, lift, Math.sin(p.a + t * 0.6) * p.r);
      ch.material.opacity = on ? 0.28 : 0.04;
    });
  });

  return (
    <group ref={ref}>
      {parts.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[p.s, 6, 6]} />
          <meshBasicMaterial color="#c4c0b8" transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

function EarthInSky() {
  const map = useTexture("/textures/earth.jpg");
  return (
    <mesh position={[34, 18, -46]}>
      <sphereGeometry args={[3.4, 32, 32]} />
      <meshBasicMaterial map={map} />
    </mesh>
  );
}

function CameraRig({ target, poseRef, phase }) {
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const yaw = useRef(Math.PI);

  useFrame((_, dt) => {
    const st = target.current;
    const pos = st.pos;
    yaw.current = dampAngle(yaw.current, st.yaw, 1.8, dt);
    const y = yaw.current;
    let speed = 3.2;

    if (phase === "landing" && poseRef.current.ready) {
      desired.copy(poseRef.current.eye);
      look.copy(poseRef.current.look);
      speed = 2.4;
    } else if (phase === "flag" && poseRef.current.ready) {
      desired.copy(poseRef.current.eye);
      look.copy(poseRef.current.look);
      speed = 6.5;
    } else if (phase === "scan") {
      const spin = (st.scanT ?? 0) * Math.PI * 2;
      desired.set(pos.x + Math.sin(spin) * 6.2, pos.y + 3.4, pos.z + Math.cos(spin) * 6.2);
      look.set(pos.x, pos.y + 1.2, pos.z);
      speed = 2.2;
    } else if (phase === "notify") {
      desired.set(pos.x + 4.2, pos.y + 3.8, pos.z + 5.1);
      look.set(pos.x, pos.y + 1.4, pos.z);
      speed = 2.4;
    } else if (phase === "complete") {
      desired.set(FLAG_POS.x + 7.2, 4.6, FLAG_POS.z + 8.4);
      look.set(FLAG_POS.x, playfieldHeight(FLAG_POS.x, FLAG_POS.z) + 1.15, FLAG_POS.z);
      speed = 1.6;
    } else {
      const back = 7.6;
      const cx = pos.x - Math.sin(y) * back;
      const cz = pos.z - Math.cos(y) * back;
      const ground = playfieldHeightSmooth(cx, cz);
      desired.set(cx, Math.max(pos.y + 4.4, ground + 3.1), cz);
      look.set(pos.x, pos.y + 1.15, pos.z);
    }
    const k = 1 - Math.exp(-speed * dt);
    camera.position.lerp(desired, k);
    camera.lookAt(look);
  });
  return null;
}

function PlayerController({ controlRef, roverRef, originRef, onPadReached, onDigProgress, onScanProgress, onStatus }) {
  const arrived = useRef(false);
  const vel = useRef({ x: 0, z: 0 });
  const statusTick = useRef(0);

  useFrame((_, dt) => {
    const c = controlRef.current;
    const st = roverRef.current;
    const locked = c.phase !== "search" && c.phase !== "dig";
    const step = Math.min(dt, 0.05);

    if (locked) {
      st.goal = null;
      vel.current.x = 0;
      vel.current.z = 0;
      st.moving = false;
    } else if (st.goal) {
      const dx = st.goal.x - st.pos.x;
      const dz = st.goal.z - st.pos.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.45) {
        st.goal = null;
        vel.current.x *= 0.82;
        vel.current.z *= 0.82;
      } else {
        const nx = dx / dist;
        const nz = dz / dist;
        const cruise = Math.min(3.15, 1.1 + dist * 0.22);
        const tx = nx * cruise;
        const tz = nz * cruise;
        const blend = 1 - Math.exp(-3.6 * step);
        vel.current.x += (tx - vel.current.x) * blend;
        vel.current.z += (tz - vel.current.z) * blend;
        st.yaw = dampAngle(st.yaw, Math.atan2(nx, nz), 3.2, step);
      }
    } else {
      vel.current.x *= Math.exp(-5.5 * step);
      vel.current.z *= Math.exp(-5.5 * step);
    }

    st.pos.x += vel.current.x * step;
    st.pos.z += vel.current.z * step;
    const clamped = clampWorld(st.pos.x, st.pos.z);
    st.pos.x = clamped.x;
    st.pos.z = clamped.z;
    const yTarget = playfieldHeightSmooth(st.pos.x, st.pos.z);
    st.pos.y += (yTarget - st.pos.y) * (1 - Math.exp(-7.5 * step));
    originRef.current.set(st.pos.x, st.pos.y, st.pos.z);

    const speed = Math.hypot(vel.current.x, vel.current.z);
    st.moving = speed > 0.18;

    const distPad = Math.hypot(st.pos.x - SAFE_SPOT.x, st.pos.z - SAFE_SPOT.z);
    if (c.phase === "search" && distPad < ARRIVE_R && !arrived.current) {
      arrived.current = true;
      st.goal = null;
      onPadReached();
    }
    if (c.phase !== "search") arrived.current = true;

    if (c.phase === "dig") {
      const pull = 1 - Math.exp(-4 * step);
      st.pos.x += (SAFE_SPOT.x - st.pos.x) * pull;
      st.pos.z += (SAFE_SPOT.z - st.pos.z) * pull;
      st.goal = null;
    }
    if (c.phase === "dig" && c.digHeld) {
      const next = Math.min(1, (c.digAmount ?? 0) + step * 0.42);
      c.digAmount = next;
      onDigProgress(next);
    }
    st.digging = Boolean(c.digHeld && c.phase === "dig");

    if (c.phase === "scan" && c.scanHeld) {
      const next = Math.min(1, (c.scanAmount ?? 0) + step * 0.34);
      c.scanAmount = next;
      st.scanT = next;
      onScanProgress?.(next);
    }

    statusTick.current += step;
    if (onStatus && statusTick.current > 0.2) {
      statusTick.current = 0;
      onStatus({ dist: distPad, onPad: distPad < ARRIVE_R + 1.6 });
    }
  });

  return null;
}

function RoverBody({ roverRef, talking }) {
  const group = useRef();
  useFrame(() => {
    const st = roverRef.current;
    if (!group.current) return;
    group.current.position.set(st.pos.x, st.pos.y, st.pos.z);
    group.current.rotation.y = st.yaw;
  });
  void talking;
  return (
    <group ref={group}>
      <SurveyorLander3D stateRef={roverRef} />
    </group>
  );
}

function Scene({ controlRef, phase, talking, onPadReached, onDigProgress, onScanProgress, onLanded, onFlagPlanted, onCanPlant, onStatus }) {
  const roverRef = useRef({
    pos: new THREE.Vector3(SPAWN.x, playfieldHeightSmooth(SPAWN.x, SPAWN.z), SPAWN.z),
    yaw: SPAWN_YAW,
    moving: false,
    digging: false,
    scanT: 0,
    goal: null,
  });
  const originRef = useRef(new THREE.Vector3(SPAWN.x, 0, SPAWN.z));
  const poseRef = useRef({
    eye: new THREE.Vector3(),
    look: new THREE.Vector3(),
    ready: false,
  });
  const landFired = useRef(false);
  const clock0 = useRef(null);

  const picking = () => {
    const p = controlRef.current.phase;
    return p === "search" || p === "dig";
  };

  const onPick = (x, z, isDown) => {
    if (x == null) return;
    if (!picking()) return;
    const p = clampWorld(x, z);
    roverRef.current.goal = { x: p.x, z: p.z };
    void isDown;
  };

  useFrame(({ clock }) => {
    if (phase === "landing") {
      if (clock0.current == null) clock0.current = clock.elapsedTime;
      const e = clock.elapsedTime - clock0.current;
      if (e > 6.2 && !landFired.current) {
        landFired.current = true;
        onLanded();
      }
    } else if (phase === "search") {
      clock0.current = null;
      landFired.current = false;
    }
  });

  return (
    <>
      <color attach="background" args={["#05060a"]} />
      <fog attach="fog" args={["#0b0d12", 32, 82]} />
      <Stars radius={180} depth={90} count={2400} factor={3.5} saturation={0} fade speed={0.12} />
      <ambientLight intensity={0.42} />
      <directionalLight
        position={[-16, 24, -12]}
        intensity={1.65}
        color="#f7f3ea"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight args={["#c8d4ee", "#1a1c22", 0.5]} />
      <Suspense fallback={null}>
        <Terrain onPick={onPick} picking={picking} />
        <EarthInSky />
      </Suspense>
      <SafeBeacon active={phase === "search" || phase === "dig"} />
      <GuideArrow roverRef={roverRef} active={phase === "search"} />
      <GoalMarker roverRef={roverRef} />
      <Trench visible={phase !== "search"} />
      <PlayerController
        controlRef={controlRef}
        roverRef={roverRef}
        originRef={originRef}
        onPadReached={onPadReached}
        onDigProgress={onDigProgress}
        onScanProgress={onScanProgress}
        onStatus={onStatus}
      />
      <RoverBody roverRef={roverRef} talking={talking} />
      <Dust roverRef={roverRef} origin={originRef} />
      <ApolloFlag3D
        phase={phase}
        controlRef={controlRef}
        poseRef={poseRef}
        onFlagPlanted={onFlagPlanted}
        onCanPlant={onCanPlant}
      />
      <CameraRig target={roverRef} poseRef={poseRef} phase={phase === "pause" ? "search" : phase} />
    </>
  );
}

export default function LunarMission3D({
  controlRef,
  phase,
  talking,
  onPadReached,
  onDigProgress,
  onScanProgress,
  onLanded,
  onFlagPlanted,
  onCanPlant,
  onStatus,
}) {
  return (
    <Canvas
      className="s3-3d-canvas"
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [SPAWN.x - Math.sin(SPAWN_YAW) * 8, 6.2, SPAWN.z - Math.cos(SPAWN_YAW) * 8], fov: 42, near: 0.1, far: 220 }}
      gl={{ antialias: true }}
      onPointerMissed={() => {}}
    >
      <Scene
        controlRef={controlRef}
        phase={phase}
        talking={talking}
        onPadReached={onPadReached}
        onDigProgress={onDigProgress}
        onScanProgress={onScanProgress}
        onLanded={onLanded}
        onFlagPlanted={onFlagPlanted}
        onCanPlant={onCanPlant}
        onStatus={onStatus}
      />
    </Canvas>
  );
}

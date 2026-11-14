"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { STATIONS } from "@/data/ringStations";
import { RING_RADIUS } from "./ringConstants";
import RingCameraRig from "./RingCameraRig";

const RADIUS = RING_RADIUS;
const STEP = (Math.PI * 2) / STATIONS.length;

const NASA_WHITE = "#FFFFFF";
const NASA_BLUE = "#0B3D91";

function seeded(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Blueberries({ reduceMotion }) {
  const ref = useRef();
  const COUNT = 54;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const items = useMemo(() => {
    const rnd = seeded(7);
    return Array.from({ length: COUNT }, () => {
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      const rad = 0.4 + Math.cbrt(rnd()) * 1.1;
      return {
        x: rad * Math.sin(phi) * Math.cos(theta),
        y: rad * Math.cos(phi) * 0.7,
        z: rad * Math.sin(phi) * Math.sin(theta),
        s: 0.07 + rnd() * 0.09,
        ph: rnd() * Math.PI * 2,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = reduceMotion ? 0 : clock.elapsedTime;
    items.forEach((it, i) => {
      dummy.position.set(it.x, it.y + Math.sin(t * 0.8 + it.ph) * 0.06, it.z);
      dummy.scale.setScalar(it.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.rotation.y = t * 0.12;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, COUNT]}>
      <sphereGeometry args={[1, 16, 12]} />
      <meshStandardMaterial color="#5b5f66" metalness={0.55} roughness={0.45} />
    </instancedMesh>
  );
}

function PhotoCard({ src }) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  const aspect = tex.image ? tex.image.width / tex.image.height : 1.5;
  const h = 1.8;
  const w = h * aspect;
  return (
    <group>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[w + 0.14, h + 0.14]} />
        <meshBasicMaterial color={NASA_WHITE} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function StationSlot({
  index,
  activeStation,
  reduceMotion,
  stationRevealRef,
  bobPhase,
  children,
  content,
}) {
  const shell = useRef(null);
  const scaleRef = useRef(index === activeStation ? 1 : 0);
  const anchor = useMemo(() => {
    const a = index * STEP;
    return {
      x: Math.sin(a) * RADIUS,
      z: Math.cos(a) * RADIUS,
      ry: a,
    };
  }, [index]);

  useFrame(({ clock }, dt) => {
    const g = shell.current;
    if (!g) return;

    const target = index === activeStation ? 1 : 0;
    const speed = reduceMotion ? 1 : Math.min(1, dt * 4.2);
    scaleRef.current += (target - scaleRef.current) * speed;

    if (index === 0) stationRevealRef.current = scaleRef.current;

    const s = scaleRef.current;
    g.scale.setScalar(s);

    const bob =
      index === activeStation && s > 0.02 && !reduceMotion
        ? Math.sin(clock.elapsedTime * 0.85 + bobPhase) * 0.07
        : 0;
    g.position.set(anchor.x, bob, anchor.z);
  });

  return (
    <group ref={shell} rotation={[0, anchor.ry, 0]} scale={0}>
      {index === 0 ? children : null}
      {content}
    </group>
  );
}

function Ring({
  activeStation,
  reduceMotion,
  stationRevealRef,
  children,
}) {
  const group = useRef();
  const target = -activeStation * STEP;

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    let diff = target - g.rotation.y;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    g.rotation.y += reduceMotion ? diff : diff * Math.min(1, dt * 3.2);
  });

  return (
    <group ref={group}>
      {STATIONS.map((st, i) => (
        <StationSlot
          key={st.id}
          index={i}
          activeStation={activeStation}
          reduceMotion={reduceMotion}
          stationRevealRef={stationRevealRef}
          bobPhase={i * 1.7}
          content={
            <>
              {st.id === "blueberries" ? <Blueberries reduceMotion={reduceMotion} /> : null}
              {st.photo ? (
                <Suspense fallback={null}>
                  <PhotoCard src={st.photo} />
                </Suspense>
              ) : null}
            </>
          }
        >
          {children}
        </StationSlot>
      ))}
    </group>
  );
}

export default function RingStage({
  activeStation = 0,
  onSelectStation,
  paused = false,
  children,
  roverRoot,
  activeSectionId,
  activeTriggerId,
  activeTriggerNonce,
  cameraSyncKey,
  reducedMotion,
  userCameraActive,
  nasaRoverReady,
  stationRevealRef: stationRevealRefProp,
}) {
  const stationRevealRefInternal = useRef(0);
  const stationRevealRef = stationRevealRefProp ?? stationRevealRefInternal;
  const reduceMotionLocal = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const reduce = reducedMotion ?? reduceMotionLocal;
  const station = STATIONS[activeStation] ?? STATIONS[0];

  return (
    <div className="ring-stage">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={paused ? "never" : "always"}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.72, RADIUS + 6.6], fov: 44 }}
        className="h-full w-full"
      >
        <RingCameraRig
          activeStation={activeStation}
          roverRoot={roverRoot}
          activeSectionId={activeSectionId}
          activeTriggerId={activeTriggerId}
          activeTriggerNonce={activeTriggerNonce}
          syncKey={cameraSyncKey}
          reducedMotion={reduce}
          userCameraActive={userCameraActive}
          nasaRoverReady={nasaRoverReady}
        />
        <ambientLight intensity={0.32} />
        <directionalLight position={[2, 6, 8]} intensity={1.15} color="#e8eef8" />
        <directionalLight position={[-6, 3, -4]} intensity={0.75} color={NASA_BLUE} />
        <directionalLight position={[0, -2, 4]} intensity={0.22} color="#6a7a9a" />
        <Suspense fallback={null}>
          <Ring
            activeStation={activeStation}
            reduceMotion={reduce}
            stationRevealRef={stationRevealRef}
          >
            {children}
          </Ring>
        </Suspense>
      </Canvas>

      <p className="ring-caption" aria-live="polite">
        {station.caption}
        <small>{station.note}</small>
      </p>

      <div className="ring-dots" role="tablist" aria-label="Ring stations">
        {STATIONS.map((st, i) => (
          <button
            key={st.id}
            type="button"
            role="tab"
            aria-selected={i === activeStation}
            aria-label={st.label}
            className={`ring-dot${i === activeStation ? " is-active" : ""}`}
            onClick={() => onSelectStation?.(i)}
          />
        ))}
      </div>
    </div>
  );
}

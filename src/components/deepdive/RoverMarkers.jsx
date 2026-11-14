"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import sections from "@/data/opportunityDeepDive";
import { getAnchorWorldPoint } from "./cameraAnchors";

const NASA_RED = "#FC3D21";
const REVEAL_THRESHOLD = 0.92;

const MARKERS = [
  { anchor: "cameraMast", sectionId: "cameras", label: "Cameras" },
  { anchor: "solarPanels", sectionId: "solar-panels", label: "Solar panels" },
  { anchor: "antenna", sectionId: "antenna", label: "Antenna" },
  { anchor: "wheelAssembly", sectionId: "wheels", label: "Wheels" },
  { anchor: "roboticArm", sectionId: "robotic-arm", label: "Robotic arm" },
];

/** Hotspots only on wide shots — part chapters keep the 3D view clear. */
function isOverviewChapter(sectionId) {
  const section = sections.find((s) => s.id === sectionId);
  const target = section?.cameraTarget ?? "fullRover";
  return target === "fullRover" || target === "wideMarsView";
}

function MarkerDot({
  anchor,
  label,
  hidden,
  onPick,
  onHover,
  reduceMotion,
  pulsePhase,
  padRef,
  roverRoot,
}) {
  const group = useRef(null);
  const ringRef = useRef(null);
  const ringScale = useRef(1);
  const world = useMemo(() => new THREE.Vector3(), []);
  const local = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    if (hidden || !group.current || !roverRoot || !padRef?.current) {
      if (group.current) group.current.visible = false;
      return;
    }

    const pt = getAnchorWorldPoint(roverRoot, anchor);
    if (!pt) {
      group.current.visible = false;
      return;
    }

    group.current.visible = true;
    world.copy(pt);
    padRef.current.worldToLocal(local.copy(world));
    group.current.position.copy(local);

    const pulse = reduceMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 2.4 + pulsePhase) * 0.12;
    ringScale.current += (pulse - ringScale.current) * Math.min(1, dt * 8);
    if (ringRef.current) ringRef.current.scale.setScalar(ringScale.current);
  });

  if (hidden) return null;

  return (
    <group ref={group} visible={false}>
      <mesh
        renderOrder={999}
        onPointerDown={(e) => {
          e.stopPropagation();
          onPick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(label);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[0.09, 16, 12]} />
        <meshBasicMaterial color={NASA_RED} depthTest={false} transparent opacity={0.01} />
      </mesh>
      <mesh renderOrder={1000}>
        <sphereGeometry args={[0.038, 16, 12]} />
        <meshBasicMaterial color={NASA_RED} depthTest={false} />
      </mesh>
      <mesh ref={ringRef} renderOrder={1001}>
        <ringGeometry args={[0.048, 0.062, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          depthTest={false}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function RoverMarkers({
  padRef,
  roverRoot,
  activeSectionId,
  activeStation,
  stationRevealRef,
  scrollToSection,
  reduceMotion,
  onMarkerHint,
}) {
  const root = useRef(null);

  useEffect(() => {
    onMarkerHint?.(null);
  }, [activeSectionId, activeStation, onMarkerHint]);

  useFrame(() => {
    if (!root.current) return;
    const show =
      roverRoot &&
      (stationRevealRef?.current ?? 0) >= REVEAL_THRESHOLD &&
      activeStation === 0 &&
      (isOverviewChapter(activeSectionId) || activeSectionId === "antenna");
    root.current.visible = show;
  });

  return (
    <group ref={root} visible={false}>
      {MARKERS.map((m, i) => (
        <MarkerDot
          key={m.anchor}
          anchor={m.anchor}
          label={m.label}
          hidden={
            activeSectionId === m.sectionId
              ? m.sectionId !== "antenna"
              : !isOverviewChapter(activeSectionId)
          }
          pulsePhase={i * 0.9}
          reduceMotion={reduceMotion}
          padRef={padRef}
          roverRoot={roverRoot}
          onPick={() => scrollToSection?.(m.sectionId)}
          onHover={(text) => onMarkerHint?.(text)}
        />
      ))}
    </group>
  );
}

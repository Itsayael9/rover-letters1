"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { CREW } from "@/data/introScript";

const FACE = {
  leo: {
    mouth: [0.02, 0.36, 0.04],
    mouthColor: "#7a1c1c",
    mouthScale: [0.09, 0.05, 0.04],
    eyeY: 0.46,
    eyeX: 0.07,
    eyeSize: 0.035,
  },
  pixel: {
    mouth: [0.0, 0.3, 0.04],
    mouthColor: "#1a4d6a",
    mouthScale: [0.11, 0.05, 0.04],
    eyeY: 0.4,
    eyeX: 0.08,
    eyeSize: 0.04,
  },
};

function TalkingFace({ who, talking }) {
  const mouth = useRef();
  const cfg = FACE[who];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!mouth.current) return;
    mouth.current.visible = talking;
    if (talking) {
      const open = 0.55 + 0.7 * Math.abs(Math.sin(t * 13));
      mouth.current.scale.set(cfg.mouthScale[0], cfg.mouthScale[1] * open, cfg.mouthScale[2]);
    }
  });

  return (
    <mesh ref={mouth} position={cfg.mouth} scale={cfg.mouthScale} visible={false}>
      <sphereGeometry args={[1, 16, 12]} />
      <meshStandardMaterial
        color={cfg.mouthColor}
        emissive={who === "pixel" ? "#1a6d9a" : "#4a1010"}
        emissiveIntensity={who === "pixel" ? 0.55 : 0.15}
      />
    </mesh>
  );
}

export function CrewFigure({
  who = "leo",
  talking = false,
  position = [0, 0, 0],
  scale = 1,
  walking = false,
}) {
  const group = useRef();
  const src = who === "pixel" ? CREW.robot.image : CREW.explorer.image;
  const map = useTexture(src);

  const material = useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
    return map;
  }, [map]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    const walk = walking ? Math.abs(Math.sin(t * 7)) * 0.06 : 0;
    const talk = talking ? Math.sin(t * 10) * 0.015 : 0;
    group.current.position.y = position[1] + walk + talk;
    group.current.rotation.y = talking ? Math.sin(t * 2.2) * 0.08 : Math.sin(t * 0.8) * 0.04;
  });

  const height = who === "pixel" ? 1.35 : 1.7;

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh castShadow>
        <planeGeometry args={[height, height]} />
        <meshStandardMaterial
          map={material}
          transparent
          alphaTest={0.12}
          roughness={0.55}
          metalness={who === "pixel" ? 0.25 : 0.02}
          side={THREE.DoubleSide}
        />
      </mesh>
      <TalkingFace who={who} talking={talking} />
      {talking && (
        <pointLight
          position={[FACE[who].mouth[0], FACE[who].mouth[1], 0.3]}
          intensity={who === "pixel" ? 0.8 : 0.25}
          distance={2.4}
          color={who === "pixel" ? "#5ec8ff" : "#ffd7a0"}
        />
      )}
    </group>
  );
}

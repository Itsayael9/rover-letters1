"use client";
import * as THREE from "three";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";

const MODEL = "/models/saturn-v.glb";
const FLIP = false; // if the rocket points DOWN, change this to true

function Rocket() {
  const { scene } = useGLTF(MODEL);
  const floatRef = useRef();
  const spinRef = useRef();

  const { model, fit, offset, align } = useMemo(() => {
    const model = scene.clone(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const longest = Math.max(size.x, size.y, size.z);

    // turn the model so its longest side points up
    let align = [0, 0, 0];
    if (size.x === longest) align = [0, 0, Math.PI / 2];
    else if (size.z === longest) align = [-Math.PI / 2, 0, 0];

    return {
      model,
      fit: 4.2 / longest, // rocket height on screen
      offset: center.multiplyScalar(-1),
      align,
    };
  }, [scene]);

  useFrame(({ clock }, delta) => {
    spinRef.current.rotation.y += delta * 0.35;
    floatRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.12;
  });

  return (
    <group ref={floatRef}>
      <group rotation={[FLIP ? Math.PI : 0, 0, 0.35]}>
        <group ref={spinRef}>
          <group rotation={align}>
            <group scale={fit}>
              <primitive object={model} position={offset} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

export default function RocketScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 35 }}
      gl={{ alpha: true }}
      dpr={[1, 1.75]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 5]} intensity={2.4} />
      <directionalLight position={[-5, 2, 3]} intensity={1.2} color="#ffd2b0" />
      <directionalLight position={[0, 3, -5]} intensity={1.2} />

      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.2} position={[0, 5, -5]} scale={[12, 12, 1]} />
        <Lightformer intensity={1.6} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[10, 5, 1]} />
        <Lightformer intensity={1.6} position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[10, 5, 1]} />
        <Lightformer intensity={1.2} position={[0, 1, 7]} scale={[12, 5, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <Rocket />
      </Suspense>
    </Canvas>
  );
}
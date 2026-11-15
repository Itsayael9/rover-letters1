"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useDeepDive } from "./DeepDiveContext";
import IngenuityArchiveModel, { INGENUITY_MODEL_URL } from "./IngenuityArchiveModel";
import IngenuityCameraRig from "./IngenuityCameraRig";

/** Mission archive 3D: Ingenuity helicopter with scroll-driven camera presets. */
export default function IngenuityDeepDiveScene() {
  const [heliRoot, setHeliRoot] = useState(null);
  const {
    activeSectionId,
    setNasaRoverReady,
    bumpCameraSync,
    nasaRoverReady,
    userCameraActive,
    reducedMotion,
    cameraSyncKey,
  } = useDeepDive();

  useEffect(() => {
    return () => {
      useGLTF.clear(INGENUITY_MODEL_URL);
    };
  }, []);

  const handleReady = useCallback(
    (root) => {
      setHeliRoot(root);
      setNasaRoverReady(true);
      bumpCameraSync();
    },
    [setNasaRoverReady, bumpCameraSync]
  );

  return (
    <div className="deep-dive-scene-wrap ring-stage touch-none" style={{ touchAction: "none" }}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={!nasaRoverReady ? "never" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.55, 4.2], fov: 42 }}
        className="h-full w-full"
      >
        <IngenuityCameraRig
          heliRoot={heliRoot}
          activeSectionId={activeSectionId}
          syncKey={cameraSyncKey}
          reducedMotion={reducedMotion}
          userCameraActive={userCameraActive}
          modelReady={nasaRoverReady}
        />
        <color attach="background" args={["#0a0c12"]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[2, 5, 6]} intensity={1.2} color="#f0f4ff" />
        <directionalLight position={[-4, 2, -3]} intensity={0.55} color="#4a6088" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
          <circleGeometry args={[3.5, 48]} />
          <meshStandardMaterial color="#1a1510" roughness={0.92} metalness={0.05} />
        </mesh>
        <Suspense fallback={null}>
          <IngenuityArchiveModel groundY={0} onReady={handleReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
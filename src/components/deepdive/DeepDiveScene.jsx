"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import sections from "@/data/opportunityDeepDive";
import { stationForSection, stationForTrigger } from "@/data/ringStations";
import { useDeepDive } from "./DeepDiveContext";
import RoverModel, { MODEL_URL } from "./RoverModel";
import RingStage from "./RingStage";
import RoverMarkers from "./RoverMarkers";
import RoverYawRig from "./RoverYawRig";
import TriggerBridge from "./TriggerBridge";
import SceneChrome from "./SceneChrome";
import SectionHighlight from "./SectionHighlight";
import { buildAnchorFrameTable } from "./cameraAnchors";
import { ROVER_PAD } from "./ringConstants";

/** Mission archive 3D: ring carousel + Opportunity at station 0. */
export default function DeepDiveScene() {
  const [roverRoot, setRoverRoot] = useState(null);
  const [ringOverride, setRingOverride] = useState(null);
  const {
    registerSceneApi,
    activeSectionId,
    activeTrigger,
    setNasaRoverReady,
    bumpCameraSync,
    nasaRoverReady,
    userCameraActive,
    reducedMotion,
    cameraSyncKey,
    scrollToSection,
  } = useDeepDive();

  const stationRevealRef = useRef(0);
  const padRef = useRef(null);
  const spinGroupRef = useRef(null);
  const [markerHint, setMarkerHint] = useState(null);

  useEffect(() => {
    const section = sections.find((s) => s.id === activeSectionId);
    registerSceneApi({ setDim: () => {}, setRockOpacity: () => {} });
    if (section?.sceneEffect !== "dust") {
      /* dust handled in SceneChrome */
    }
  }, [activeSectionId, registerSceneApi]);

  useEffect(() => {
    setRingOverride(null);
  }, [activeSectionId]);

  useEffect(() => {
    return () => {
      useGLTF.clear(MODEL_URL);
    };
  }, []);

  const handleRoverReady = (root) => {
    setRoverRoot(root);
    registerSceneApi({
      roverRoot: root,
      anchorFrames: buildAnchorFrameTable(root),
    });
    setNasaRoverReady(true);
    bumpCameraSync();
  };

  const activeStation = useMemo(() => {
    if (ringOverride !== null) return ringOverride;
    if (activeTrigger?.id) {
      const fromTrigger = stationForTrigger(activeTrigger.id);
      if (fromTrigger !== undefined) return fromTrigger;
    }
    return stationForSection(activeSectionId);
  }, [activeSectionId, activeTrigger, ringOverride]);

  return (
    <div className="deep-dive-scene-wrap touch-none" style={{ touchAction: "none" }}>
      {nasaRoverReady ? <SceneChrome /> : null}
      {markerHint ? (
        <p className="rover-marker-hud" aria-live="polite">
          {markerHint}
          <span className="rover-marker-hud-hint"> · tap dot for chapter</span>
        </p>
      ) : null}
      <TriggerBridge />
      <SectionHighlight root={roverRoot} activeStation={activeStation} />
      <RingStage
        activeStation={activeStation}
        paused={!nasaRoverReady}
        onSelectStation={setRingOverride}
        roverRoot={roverRoot}
        activeSectionId={activeSectionId}
        activeTriggerId={activeTrigger?.id}
        activeTriggerNonce={activeTrigger?.nonce}
        cameraSyncKey={cameraSyncKey}
        reducedMotion={reducedMotion}
        userCameraActive={userCameraActive}
        nasaRoverReady={nasaRoverReady}
        scrollToSection={scrollToSection}
        stationRevealRef={stationRevealRef}
      >
        <group
          ref={padRef}
          position={ROVER_PAD.position}
          rotation={ROVER_PAD.rotation}
          scale={ROVER_PAD.scale}
        >
          <RoverYawRig
            padRef={padRef}
            spinGroupRef={spinGroupRef}
            activeStation={activeStation}
            activeSectionId={activeSectionId}
            activeTriggerId={activeTrigger?.id}
            reducedMotion={reducedMotion}
            nasaRoverReady={nasaRoverReady}
          />
          <group ref={spinGroupRef}>
            <Suspense fallback={null}>
              <RoverModel groundY={ROVER_PAD.groundY} onReady={handleRoverReady} />
            </Suspense>
          </group>
          <RoverMarkers
            padRef={padRef}
            roverRoot={roverRoot}
            activeSectionId={activeSectionId}
            activeStation={activeStation}
            stationRevealRef={stationRevealRef}
            scrollToSection={scrollToSection}
            reducedMotion={reducedMotion}
            onMarkerHint={setMarkerHint}
          />
        </group>
      </RingStage>
    </div>
  );
}

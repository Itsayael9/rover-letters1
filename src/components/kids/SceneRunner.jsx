"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { t } from "@/data/kids/text";
import { useKidsProgress } from "@/context/KidsProgressContext";
import { useKidsVoice } from "@/hooks/useKidsVoice";
import IntroPredictScene from "@/components/kids/scenes/IntroPredictScene";
import TapPartsScene from "@/components/kids/scenes/TapPartsScene";
import DragBuildScene from "@/components/kids/scenes/DragBuildScene";
import ComingSoonScene from "@/components/kids/scenes/ComingSoonScene";

const SCENE_MAP = {
  "intro-predict": IntroPredictScene,
  intro: IntroPredictScene,
  predict: IntroPredictScene,
  "tap-parts": TapPartsScene,
  "drag-build": DragBuildScene,
  // Reserved slots for later types:
  // "timing-tap": TimingTapScene,
  // detective: DetectiveScene,
  // drive: DriveScene,
  // quiz: QuizScene,
};

export default function SceneRunner({ machine, onExit }) {
  const reduceMotion = useReducedMotion();
  const {
    sceneIndex,
    setSceneIndex,
    stars,
    markSceneComplete,
    completedScenes,
  } = useKidsProgress();

  const [readAloud, setReadAloud] = useState(true);
  const [muted, setMuted] = useState(false);
  const [sceneDone, setSceneDone] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const voice = useKidsVoice({ readAloud, muted });
  const scenes = machine.scenes;
  const scene = scenes[sceneIndex] ?? null;
  const sceneId = scene ? scene.id : "";
  const atEnd = showEnd || !scene;

  useEffect(() => {
    voice.stop();
    if (sceneId && completedScenes.includes(sceneId)) {
      setSceneDone(true);
    } else {
      setSceneDone(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the scene identity changes
  }, [sceneIndex, sceneId]);

  const SceneComponent = useMemo(() => {
    if (!scene) return null;
    return SCENE_MAP[scene.type] ?? null;
  }, [scene]);

  const handleSceneComplete = useCallback(
    ({ stars: earned = 0, badge = null } = {}) => {
      if (!scene) return;
      if (!completedScenes.includes(scene.id)) {
        markSceneComplete(scene.id, earned, badge);
      }
      setSceneDone(true);
    },
    [scene, completedScenes, markSceneComplete]
  );

  const goNext = () => {
    voice.stop();
    setSceneDone(false);
    if (sceneIndex >= scenes.length - 1) {
      setShowEnd(true);
      return;
    }
    setSceneIndex(sceneIndex + 1);
  };

  const skipScene = () => {
    voice.stop();
    if (!scene) return;
    if (!completedScenes.includes(scene.id)) {
      markSceneComplete(scene.id, 0, null);
    }
    setSceneDone(true);
  };

  return (
    <div className="kids-runner">
      <header className="kids-runner-top">
        <button
          type="button"
          className="kids-icon-btn"
          onClick={onExit}
          aria-label="Back to Mars"
        >
          ←
        </button>

        <div className="kids-dots" role="list" aria-label="Scene progress">
          {scenes.map((s, i) => (
            <span
              key={s.id}
              role="listitem"
              className={`kids-dot${i === sceneIndex && !atEnd ? " is-current" : ""}${
                completedScenes.includes(s.id) || i < sceneIndex ? " is-done" : ""
              }`}
              aria-label={`${t(s.title)}${completedScenes.includes(s.id) ? ", done" : ""}`}
            />
          ))}
        </div>

        <div className="kids-top-actions">
          <span className="kids-star-count" aria-label={`${stars} stars`}>
            ⭐ {stars}
          </span>
          <button
            type="button"
            className={`kids-toggle${readAloud ? " is-on" : ""}`}
            aria-pressed={readAloud}
            onClick={() => setReadAloud((v) => !v)}
          >
            📖 Read to me
          </button>
          <button
            type="button"
            className={`kids-icon-btn${muted ? " is-on" : ""}`}
            aria-pressed={muted}
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={() => setMuted((v) => !v)}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </header>

      <div className="kids-runner-body">
        <AnimatePresence mode="wait">
          {atEnd ? (
            <motion.div
              key="end"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="kids-runner-scene"
            >
              <ComingSoonScene machine={machine} onExit={onExit} />
            </motion.div>
          ) : SceneComponent ? (
            <motion.div
              key={scene.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="kids-runner-scene"
            >
              <h1 className="kids-scene-title">{t(scene.title)}</h1>
              <SceneComponent
                scene={scene}
                machine={machine}
                voice={voice}
                readAloud={readAloud}
                muted={muted}
                onComplete={handleSceneComplete}
              />
            </motion.div>
          ) : (
            <div className="kids-runner-scene">
              <p className="kids-instruction">
                Scene type “{scene?.type}” is not ready yet.
              </p>
              <button type="button" className="kids-btn kids-btn-primary" onClick={goNext}>
                Next
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {!atEnd && (
        <footer className="kids-runner-footer">
          <button type="button" className="kids-btn kids-btn-ghost" onClick={skipScene}>
            Skip
          </button>
          <button
            type="button"
            className="kids-btn kids-btn-primary"
            disabled={!sceneDone}
            onClick={goNext}
          >
            Next →
          </button>
        </footer>
      )}
    </div>
  );
}

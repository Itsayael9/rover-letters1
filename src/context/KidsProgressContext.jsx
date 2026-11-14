"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "rover-letters-kids-progress-v2";

const KidsProgressContext = createContext(null);

function loadStore() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveStore(store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}

const emptyMachine = () => ({
  segmentIndex: 0,
  stars: 0,
  completedSegments: [],
  answers: {},
  firstTryCorrect: [],
});

export function KidsProgressProvider({
  machineId,
  children,
  /** Always open on segment 1 (index 0) — do not resume mid-story. */
  startAtBeginning = true,
}) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(emptyMachine);

  useEffect(() => {
    const store = loadStore();
    const raw = store[machineId] || {};
    setProgress({
      ...emptyMachine(),
      ...raw,
      // Always begin on first segment when opening kids mode
      segmentIndex: startAtBeginning
        ? 0
        : (raw.segmentIndex ?? raw.sceneIndex ?? 0),
      completedSegments: startAtBeginning ? [] : (raw.completedSegments ?? []),
    });
    setReady(true);
  }, [machineId, startAtBeginning]);

  useEffect(() => {
    if (!ready) return;
    const store = loadStore();
    store[machineId] = progress;
    saveStore(store);
  }, [machineId, progress, ready]);

  const setSegmentIndex = useCallback((index) => {
    setProgress((p) => ({ ...p, segmentIndex: index }));
  }, []);

  const addStars = useCallback((n) => {
    if (!n) return;
    setProgress((p) => ({ ...p, stars: p.stars + n }));
  }, []);

  const markSegmentComplete = useCallback((segmentId, stars = 0) => {
    setProgress((p) => {
      if (p.completedSegments.includes(segmentId)) {
        return stars ? { ...p, stars: p.stars + stars } : p;
      }
      return {
        ...p,
        completedSegments: [...p.completedSegments, segmentId],
        stars: p.stars + (stars || 0),
      };
    });
  }, []);

  const saveAnswer = useCallback((key, value) => {
    setProgress((p) => ({
      ...p,
      answers: { ...p.answers, [key]: value },
      firstTryCorrect:
        value?.firstTry && value?.correct && !p.firstTryCorrect.includes(key)
          ? [...p.firstTryCorrect, key]
          : p.firstTryCorrect,
    }));
  }, []);

  const resetMachine = useCallback(() => {
    setProgress(emptyMachine());
  }, []);

  const value = useMemo(
    () => ({
      ready,
      machineId,
      segmentIndex: progress.segmentIndex,
      stars: progress.stars,
      completedSegments: progress.completedSegments,
      answers: progress.answers,
      firstTryCorrect: progress.firstTryCorrect,
      setSegmentIndex,
      addStars,
      markSegmentComplete,
      saveAnswer,
      resetMachine,
      // aliases for older scene runner
      sceneIndex: progress.segmentIndex,
      setSceneIndex: setSegmentIndex,
      completedScenes: progress.completedSegments,
      markSceneComplete: (id, stars) => markSegmentComplete(id, stars),
    }),
    [
      ready,
      machineId,
      progress,
      setSegmentIndex,
      addStars,
      markSegmentComplete,
      saveAnswer,
      resetMachine,
    ]
  );

  return (
    <KidsProgressContext.Provider value={value}>
      {children}
    </KidsProgressContext.Provider>
  );
}

export function useKidsProgress() {
  const ctx = useContext(KidsProgressContext);
  if (!ctx) {
    throw new Error("useKidsProgress must be used inside KidsProgressProvider");
  }
  return ctx;
}

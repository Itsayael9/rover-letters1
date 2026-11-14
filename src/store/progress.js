"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BODIES } from "@/data/bodies";

const STORAGE_KEY = "rover-letters-machines-progress";

export function machineIds() {
  return BODIES.flatMap((body) => (body.equipment ?? []).map((machine) => machine.id));
}

/** Free exploration — every planet is always visitable. */
export function planetUnlocked(planetId) {
  void planetId;
  return true;
}

function loadCompleted() {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((id) => typeof id === "string");
  } catch {
    return [];
  }
}

function saveCompleted(ids) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* storage full or blocked — the session still works */
  }
}

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [completedMachines, setCompletedMachines] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCompletedMachines(loadCompleted());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveCompleted(completedMachines);
  }, [completedMachines, ready]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    window.resetProgress = () => setCompletedMachines([]);
    return () => {
      delete window.resetProgress;
    };
  }, []);

  const completeMachine = useCallback((id) => {
    if (!id) return;
    setCompletedMachines((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const isCompleted = useCallback(
    (id) => completedMachines.includes(id),
    [completedMachines]
  );

  const isPlanetUnlocked = useCallback((planetId) => planetUnlocked(planetId), []);

  const resetProgress = useCallback(() => {
    setCompletedMachines([]);
  }, []);

  const value = useMemo(
    () => ({
      completedMachines,
      completeMachine,
      isCompleted,
      isPlanetUnlocked,
      resetProgress,
      ready,
    }),
    [completedMachines, completeMachine, isCompleted, isPlanetUnlocked, resetProgress, ready]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

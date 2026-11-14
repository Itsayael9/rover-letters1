"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "rover-letters-sfx-enabled";

const AudioPrefsContext = createContext(null);

function readEnabled() {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "0") return false;
    if (raw === "1") return true;
  } catch {
    /* ignore */
  }
  return true;
}

export function AudioPrefsProvider({ children }) {
  const [sfxEnabled, setSfxEnabledState] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSfxEnabledState(readEnabled());
    setReady(true);
  }, []);

  const setSfxEnabled = useCallback((next) => {
    setSfxEnabledState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSfx = useCallback(() => {
    setSfxEnabled((v) => !v);
  }, [setSfxEnabled]);

  const value = useMemo(
    () => ({ sfxEnabled: ready ? sfxEnabled : true, setSfxEnabled, toggleSfx }),
    [ready, sfxEnabled, setSfxEnabled, toggleSfx]
  );

  return <AudioPrefsContext.Provider value={value}>{children}</AudioPrefsContext.Provider>;
}

export function useAudioPrefs() {
  const ctx = useContext(AudioPrefsContext);
  if (!ctx) throw new Error("useAudioPrefs must be used inside AudioPrefsProvider");
  return ctx;
}
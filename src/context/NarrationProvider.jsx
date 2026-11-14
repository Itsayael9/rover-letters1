"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NARRATION_SCRIPT } from "@/data/narration";
import {
  cancelSpeech,
  estimateLineDurationMs,
  pickEnglishVoice,
  speakLine,
  waitForVoices,
} from "@/hooks/useSpeech";

const NarrationContext = createContext(null);

export function NarrationProvider({ children }) {
  const [muted, setMuted] = useState(false);
  const [active, setActive] = useState(false);
  const [lineIndex, setLineIndex] = useState(-1);
  const runId = useRef(0);
  const voiceRef = useRef(null);
  const audioRef = useRef(null);
  const cueListeners = useRef(new Set());

  useEffect(() => {
    let live = true;
    waitForVoices().then((voices) => {
      if (live) voiceRef.current = pickEnglishVoice(voices);
    });
    return () => {
      live = false;
      cancelSpeech();
      audioRef.current?.pause();
    };
  }, []);

  const emitCue = useCallback((cue) => {
    if (!cue) return;
    cueListeners.current.forEach((fn) => fn(cue));
  }, []);

  const subscribeCue = useCallback((fn) => {
    cueListeners.current.add(fn);
    return () => cueListeners.current.delete(fn);
  }, []);

  const stop = useCallback(() => {
    runId.current += 1;
    cancelSpeech();
    audioRef.current?.pause();
    audioRef.current = null;
    setActive(false);
    setLineIndex(-1);
  }, []);

  const playLine = useCallback(
    async (line, id) => {
      if (id !== runId.current) return;

      setLineIndex(NARRATION_SCRIPT.findIndex((row) => row.id === line.id));
      emitCue(line.cue);

      if (muted) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, estimateLineDurationMs(line.text));
        });
        return;
      }

      if (line.audioSrc) {
        const audio = new Audio(line.audioSrc);
        audioRef.current = audio;
        await new Promise((resolve, reject) => {
          audio.onended = () => resolve();
          audio.onerror = () => reject();
          audio.play().catch(reject);
        });
        return;
      }

      const voices = window.speechSynthesis.getVoices();
      const voice = voiceRef.current ?? pickEnglishVoice(voices);
      await speakLine(line.text, { voice, rate: 0.88, pitch: 1.05 });
    },
    [emitCue, muted]
  );

  const start = useCallback(async () => {
    const id = ++runId.current;
    cancelSpeech();
    audioRef.current?.pause();
    setActive(true);
    setLineIndex(0);

    for (const line of NARRATION_SCRIPT) {
      if (id !== runId.current) return;
      try {
        await playLine(line, id);
      } catch {
        if (id !== runId.current) return;
        await new Promise((resolve) => {
          window.setTimeout(resolve, estimateLineDurationMs(line.text));
        });
      }
    }

    if (id === runId.current) {
      setActive(false);
      setLineIndex(-1);
    }
  }, [playLine]);

  const skip = useCallback(() => {
    stop();
  }, [stop]);

  const currentLine = lineIndex >= 0 ? NARRATION_SCRIPT[lineIndex] : null;

  const value = useMemo(
    () => ({
      muted,
      setMuted,
      active,
      lineIndex,
      currentLine,
      script: NARRATION_SCRIPT,
      start,
      stop,
      skip,
      subscribeCue,
    }),
    [muted, active, lineIndex, currentLine, start, stop, skip, subscribeCue]
  );

  return (
    <NarrationContext.Provider value={value}>{children}</NarrationContext.Provider>
  );
}

export function useNarration() {
  const ctx = useContext(NarrationContext);
  if (!ctx) throw new Error("useNarration must be used inside NarrationProvider");
  return ctx;
}

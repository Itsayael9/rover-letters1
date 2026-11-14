"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ENGLISH_LANG = "en-US";

/** Wait until the browser has loaded voice list (Chrome loads them async). */
export function waitForVoices(timeoutMs = 2000) {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    const onVoices = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
      resolve(window.speechSynthesis.getVoices());
    };

    window.speechSynthesis.addEventListener("voiceschanged", onVoices);
    window.speechSynthesis.getVoices();

    window.setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
      resolve(window.speechSynthesis.getVoices());
    }, timeoutMs);
  });
}

/** Pick a clear English voice when we can. */
export function pickEnglishVoice(voices) {
  const list = voices.length ? voices : [];
  const prefer =
    list.find((v) => v.lang === ENGLISH_LANG && /google|natural|samantha|zira/i.test(v.name)) ||
    list.find((v) => v.lang === ENGLISH_LANG) ||
    list.find((v) => v.lang.startsWith("en"));
  return prefer ?? null;
}

/** Prefer a brighter English voice, then pitch it up for the kids story. */
export function pickKidsVoice(voices) {
  const list = voices.length ? voices : [];
  const english = list.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = english.length ? english : list;
  const bright =
    pool.find((v) => /child|kid|girl|zira|aria|samantha|jenny|female/i.test(v.name) && !/david|guy|male/i.test(v.name)) ||
    pool.find((v) => !/david|guy|male/i.test(v.name)) ||
    pool[0];
  return bright ?? null;
}

/**
 * Speak one line. Returns a promise that resolves when done or rejects on error.
 */
export function speakLine(text, { voice, rate = 0.88, pitch = 1.05 } = {}) {
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = ENGLISH_LANG;
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(event.error ?? new Error("speech error"));
    window.speechSynthesis.speak(utterance);
  });
}

export function cancelSpeech() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

/** Rough subtitle duration when muted (ms). */
export function estimateLineDurationMs(text) {
  return Math.max(2800, Math.min(12000, text.length * 55));
}

export function useSpeech() {
  const [lineIndex, setLineIndex] = useState(-1);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const runId = useRef(0);
  const voiceRef = useRef(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setSupported(false);
      return undefined;
    }

    let live = true;
    waitForVoices().then((voices) => {
      if (live) voiceRef.current = pickEnglishVoice(voices);
    });

    return () => {
      live = false;
      cancelSpeech();
    };
  }, []);

  const stop = useCallback(() => {
    runId.current += 1;
    cancelSpeech();
    setSpeaking(false);
    setLineIndex(-1);
  }, []);

  const play = useCallback((lines, lang = ENGLISH_LANG) => {
    if (!("speechSynthesis" in window)) return;
    cancelSpeech();
    const id = ++runId.current;

    const voices = window.speechSynthesis.getVoices();
    const voice = voiceRef.current ?? pickEnglishVoice(voices);

    setSpeaking(true);

    const speakNext = (i) => {
      if (id !== runId.current) return;
      if (i >= lines.length) {
        setSpeaking(false);
        setLineIndex(-1);
        return;
      }
      setLineIndex(i);
      speakLine(lines[i], { voice, rate: 0.88, pitch: 1.05 })
        .then(() => speakNext(i + 1))
        .catch(() => {
          if (id === runId.current) {
            setSpeaking(false);
            setLineIndex(-1);
          }
        });
    };

    speakNext(0);
  }, []);

  return { play, stop, speaking, lineIndex, supported };
}

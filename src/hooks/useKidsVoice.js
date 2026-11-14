"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  cancelSpeech,
  estimateLineDurationMs,
  pickKidsVoice,
  speakLine,
  waitForVoices,
} from "@/hooks/useSpeech";
import { t } from "@/data/kids/text";

/**
 * Speak ordered lines { text, audioSrc?, mood?, sfx?, media? }.
 * Exposes currentLine for media sync + mood.
 */
export function useKidsVoice({ readAloud = true, muted = false, onLineStart } = {}) {
  const [lineIndex, setLineIndex] = useState(-1);
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(true);
  const runId = useRef(0);
  const heldRef = useRef(false);
  const [held, setHeld] = useState(false);
  const voiceRef = useRef(null);
  const audioRef = useRef(null);
  const sfxRef = useRef(null);
  const linesRef = useRef([]);
  const onLineStartRef = useRef(onLineStart);
  const resumeSnapRef = useRef(null);

  useEffect(() => {
    onLineStartRef.current = onLineStart;
  }, [onLineStart]);

  useEffect(() => {
    let live = true;
    if (!("speechSynthesis" in window)) {
      setSupported(false);
      return undefined;
    }
    waitForVoices().then((voices) => {
      if (live) voiceRef.current = pickKidsVoice(voices);
    });
    return () => {
      live = false;
      cancelSpeech();
      audioRef.current?.pause();
      sfxRef.current?.pause();
    };
  }, []);

  const stop = useCallback(() => {
    runId.current += 1;
    heldRef.current = false;
    setHeld(false);
    cancelSpeech();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (sfxRef.current) {
      sfxRef.current.pause();
      sfxRef.current = null;
    }
    setActive(false);
  }, []);

  /** Pause the current line without skipping it. */
  const holdPlayback = useCallback(() => {
    heldRef.current = true;
    setHeld(true);
    audioRef.current?.pause();
    cancelSpeech();
  }, []);

  const releasePlayback = useCallback(() => {
    heldRef.current = false;
    setHeld(false);
    const audio = audioRef.current;
    if (audio && !audio.ended) audio.play().catch(() => {});
  }, []);

  /** Pause for overlay (Read more): remember the line and how far the audio got. */
  const pausePlayback = useCallback(() => {
    const audio = audioRef.current;
    const line = lineIndex >= 0 ? linesRef.current[lineIndex] : null;
    resumeSnapRef.current = {
      line,
      lineIndex,
      audioTime: audio && Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
      wasHeld: heldRef.current,
    };
    runId.current += 1;
    heldRef.current = false;
    setHeld(false);
    cancelSpeech();
    audio?.pause();
    setActive(false);
    return resumeSnapRef.current;
  }, [lineIndex]);

  const playSfx = (name) => {
    if (!name || muted) return;
    try {
      const audio = new Audio(`/opportunity/sfx/${name}.mp3`);
      sfxRef.current = audio;
      audio.play().catch(() => {});
    } catch {
      /* optional file */
    }
  };

  const playLines = useCallback(
    async (lines = [], options = {}) => {
      stop();
      const list = Array.isArray(lines) ? lines : [];
      linesRef.current = list;
      if (list.length === 0) return true;
      if (options.startHeld) {
        heldRef.current = true;
        setHeld(true);
      }

      const id = ++runId.current;
      setActive(!options.startHeld);

      const waitWhileHeld = () =>
        new Promise((resolve) => {
          const timer = window.setInterval(() => {
            if (!heldRef.current || id !== runId.current) {
              window.clearInterval(timer);
              resolve(id === runId.current);
            }
          }, 80);
        });

      for (let i = 0; i < list.length; i += 1) {
        if (id !== runId.current) return false;
        setLineIndex(i);
        const line = list[i];
        onLineStartRef.current?.(line, i);
        if (line.sfx) playSfx(line.sfx);

        const text = t(line.text);
        const clipMs =
          line.audioEnd != null
            ? Math.max(400, ((line.audioEnd - (line.audioStart || 0)) * 1000))
            : estimateLineDurationMs(text);

        try {
          if (muted || !readAloud) {
            await new Promise((resolve) => {
              window.setTimeout(resolve, line.audioSrc ? clipMs : estimateLineDurationMs(text));
            });
          } else if (line.audioSrc) {
            const playing = audioRef.current;
            const sameClip =
              playing &&
              !playing.ended &&
              playing.dataset.clip === line.audioSrc;

            if (!sameClip) {
              playing?.pause();
              const audio = new Audio(line.audioSrc);
              audio.dataset.clip = line.audioSrc;
              audioRef.current = audio;
              const startAt =
                options.fromTime != null ? options.fromTime : line.audioStart || 0;
              const seek = () => {
                if (startAt > 0) {
                  const max = Number.isFinite(audio.duration) ? Math.max(0, audio.duration - 0.05) : startAt;
                  audio.currentTime = Math.min(startAt, max);
                }
              };
              if (audio.readyState >= 1) seek();
              else {
                await new Promise((resolve) => {
                  audio.addEventListener("loadedmetadata", () => {
                    seek();
                    resolve();
                  }, { once: true });
                });
              }
              if (!heldRef.current) await audio.play();
            }

            const audio = audioRef.current;
            if (heldRef.current) {
              const still = await waitWhileHeld();
              if (!still) return false;
              setActive(true);
              await audio.play().catch(() => {});
            }
            const endAt = line.audioEnd ?? Number.POSITIVE_INFINITY;
            const status = await new Promise((resolve, reject) => {
              const finish = (why) => {
                window.clearInterval(timer);
                audio.removeEventListener("ended", onEnd);
                audio.removeEventListener("error", onErr);
                resolve(why);
              };
              const check = () => {
                if (heldRef.current) return;
                if (id !== runId.current) finish("stopped");
                else if (audio.ended || audio.currentTime + 0.08 >= endAt) finish("ok");
              };
              const onEnd = () => finish("ok");
              const onErr = () => {
                window.clearInterval(timer);
                reject(new Error("audio"));
              };
              audio.addEventListener("ended", onEnd);
              audio.addEventListener("error", onErr);
              const timer = window.setInterval(check, 80);
              check();
            });
            if (status === "stopped" || id !== runId.current) return false;
          } else if ("speechSynthesis" in window) {
            if (heldRef.current) {
              const still = await waitWhileHeld();
              if (!still) return false;
              setActive(true);
            }
            const voices = window.speechSynthesis.getVoices();
            const voice = voiceRef.current ?? pickKidsVoice(voices);
            await speakLine(text, { voice, rate: 0.96, pitch: 1.65 });
          } else {
            await new Promise((resolve) => {
              window.setTimeout(resolve, estimateLineDurationMs(text));
            });
          }
        } catch {
          if (id !== runId.current) return false;
          if (heldRef.current) {
            await new Promise((resolve) => {
              const timer = window.setInterval(() => {
                if (!heldRef.current || id !== runId.current) {
                  window.clearInterval(timer);
                  resolve();
                }
              }, 80);
            });
            if (id !== runId.current) return false;
            i -= 1;
            continue;
          }
          await new Promise((resolve) => {
            window.setTimeout(resolve, estimateLineDurationMs(text));
          });
        }
      }

      if (id === runId.current) {
        setActive(false);
        return true;
      }
      return false;
    },
    [muted, readAloud, stop]
  );

  /** Resume after Read more. Stays quiet if Opp was already paused. */
  const resumePlayback = useCallback(async () => {
    const snap = resumeSnapRef.current;
    resumeSnapRef.current = null;
    if (!snap?.line) return true;
    return playLines([snap.line], {
      fromTime: snap.audioTime > 0 ? snap.audioTime : undefined,
      startHeld: Boolean(snap.wasHeld),
    });
  }, [playLines]);

  const wasOverlayPaused = useCallback(() => Boolean(resumeSnapRef.current?.wasHeld), []);

  const currentLine =
    lineIndex >= 0 && linesRef.current[lineIndex]
      ? linesRef.current[lineIndex]
      : null;

  return {
    playLines,
    stop,
    pausePlayback,
    resumePlayback,
    wasOverlayPaused,
    holdPlayback,
    releasePlayback,
    held,
    active,
    speaking: active && !held && !muted && readAloud,
    lineIndex,
    currentLine,
    lines: linesRef.current,
    supported,
  };
}

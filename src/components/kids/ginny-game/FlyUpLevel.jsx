"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Ingenuity from "@/components/kids/Ingenuity";
import {
  ALTITUDE_MARKS,
  ALTITUDE_MAX,
  FLY,
  PHOTOS,
  pickText,
} from "@/data/ginnyGame";

const RISE_PER_SEC = 4.2;
const TAP_STEP = 1;

export default function FlyUpLevel({
  onComplete,
  onMarkCard,
  reduceMotion,
  demoActive,
  onFlyInteraction,
  flyBtnRef,
  pulseFly,
}) {
  const [altitude, setAltitude] = useState(0);
  const [holding, setHolding] = useState(false);
  const [groundSrc, setGroundSrc] = useState(PHOTOS.ground);
  const seenMarks = useRef(new Set());
  const done = useRef(false);
  const raf = useRef(0);
  const last = useRef(performance.now());
  const demoHold = useRef(false);

  useEffect(() => {
    const img = new Image();
    img.onerror = () => setGroundSrc(PHOTOS.groundFallback);
    img.src = PHOTOS.ground;
  }, []);

  useEffect(() => {
    if (!demoActive) {
      demoHold.current = false;
      return undefined;
    }
    demoHold.current = true;
    const t = window.setTimeout(() => {
      demoHold.current = false;
    }, 2800);
    return () => clearTimeout(t);
  }, [demoActive]);

  const loop = useCallback(() => {
    const now = performance.now();
    const dt = Math.min(40, now - last.current);
    last.current = now;
    const activeHold = holding || demoHold.current;

    setAltitude((alt) => {
      let next = alt;
      if (activeHold && next < ALTITUDE_MAX) {
        next = Math.min(ALTITUDE_MAX, next + (RISE_PER_SEC * dt) / 1000);
      }
      ALTITUDE_MARKS.forEach((mark) => {
        if (next >= mark.m - 0.2 && !seenMarks.current.has(mark.m)) {
          seenMarks.current.add(mark.m);
          window.setTimeout(() => onMarkCard?.(mark), 0);
        }
      });
      if (next >= ALTITUDE_MAX && !done.current) {
        done.current = true;
        window.setTimeout(() => onComplete?.(), reduceMotion ? 400 : 800);
      }
      return next;
    });

    raf.current = requestAnimationFrame(loop);
  }, [holding, onComplete, onMarkCard, reduceMotion]);

  useEffect(() => {
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [loop]);

  const riseTap = () => {
    onFlyInteraction?.();
    setAltitude((alt) => Math.min(ALTITUDE_MAX, alt + TAP_STEP));
  };

  const t = altitude / ALTITUDE_MAX;
  const flyBottom = `${12 + t * 38}%`;
  const rockScale = 1 - t * 0.55;
  const rockOpacity = 1 - t * 0.92;

  return (
    <div className="ginny-fly-step mx-auto w-full max-w-md">
      <div className="ginny-alt-gauge mb-2 flex items-end justify-between gap-2">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase text-white/80">{pickText(FLY.altitude)}</p>
          <div className="relative mt-1 h-28 w-12 rounded border-2 border-white/50 bg-black/40">
            {ALTITUDE_MARKS.map((mark) => (
              <span
                key={mark.m}
                className="absolute right-full mr-1 w-16 text-right text-[10px] font-bold text-[#f0c14a]"
                style={{ bottom: `${(mark.m / ALTITUDE_MAX) * 100}%`, transform: "translateY(50%)" }}
              >
                {mark.m}
                {pickText(FLY.meters)}
              </span>
            ))}
            <div
              className="absolute bottom-0 left-0 right-0 rounded-sm bg-[#6fdc8c]"
              style={{ height: `${t * 100}%` }}
            />
          </div>
        </div>
        <p className="text-4xl font-extrabold tabular-nums text-[#f0c14a]">
          {altitude.toFixed(1)}
          <span className="text-lg">{pickText(FLY.meters)}</span>
        </p>
      </div>

      <div className="ginny-fly-stage relative mb-4 aspect-[4/3] overflow-hidden rounded-md border-2 border-[#111] bg-[#1a0a08]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={groundSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: reduceMotion ? (t < 0.5 ? 1 : 0) : 1 - t,
            transform: reduceMotion ? undefined : `scale(${1 + t * 0.08})`,
            transition: reduceMotion ? "opacity 0.3s" : "opacity 0.2s linear",
          }}
          draggable={false}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PHOTOS.aerial}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: reduceMotion ? (t >= 0.5 ? 1 : 0) : t,
            transform: reduceMotion ? undefined : `scale(${1.05 - t * 0.05})`,
            transition: reduceMotion ? "opacity 0.3s" : "opacity 0.2s linear",
          }}
          draggable={false}
        />
        <svg
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <ellipse
            cx="42"
            cy="72"
            rx="22"
            ry="14"
            fill="#6b5344"
            stroke="#3a2a24"
            strokeWidth="1.5"
            opacity={rockOpacity}
            style={{ transform: `scale(${rockScale})`, transformOrigin: "42px 72px" }}
          />
          <path
            d="M28 78 L48 58 L62 76 L38 82 Z"
            fill="#5a4a3a"
            stroke="#3a2a24"
            strokeWidth="1"
            opacity={rockOpacity}
            style={{ transform: `scale(${rockScale})`, transformOrigin: "45px 70px" }}
          />
        </svg>
        <div
          className="pointer-events-none absolute z-[3] flex w-full justify-center"
          style={{ bottom: flyBottom, transition: reduceMotion ? "bottom 0.2s" : "bottom 0.1s linear" }}
        >
          <div className="relative">
            <Ingenuity talking={holding} mood="happy" pose="fly" size="72px" followPointer={false} rotors="fast" />
            <ellipse
              className="ginny-fly-shadow absolute -bottom-1 left-1/2 h-2 w-14 -translate-x-1/2 rounded-full bg-black/40"
              style={{ opacity: 0.25 + t * 0.35, transform: `translateX(-50%) scale(${1.2 - t * 0.4})` }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          ref={flyBtnRef}
          type="button"
          className={`ginny-fly-btn${holding ? " ginny-fly-btn--on" : ""}${pulseFly ? " ginny-fly-btn--pulse" : ""}`}
          aria-label={pickText(FLY.flyAria)}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture?.(e.pointerId);
            onFlyInteraction?.();
            setHolding(true);
          }}
          onPointerUp={() => setHolding(false)}
          onPointerCancel={() => setHolding(false)}
          onLostPointerCapture={() => setHolding(false)}
          onClick={riseTap}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "ArrowUp") {
              e.preventDefault();
              onFlyInteraction?.();
              setHolding(true);
            }
          }}
          onKeyUp={(e) => {
            if (e.key === " " || e.key === "ArrowUp") setHolding(false);
          }}
        >
          {pickText(FLY.flyUp)}
        </button>
      </div>
    </div>
  );
}
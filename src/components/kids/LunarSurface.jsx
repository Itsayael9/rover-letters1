"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const WORLD_W = 900;
const WORLD_H = 480;
const HOP = 7.2;
const FRICTION = 0.88;
const ARRIVE_R = 52;

function craterDecor() {
  return (
    <>
      <ellipse cx="220" cy="360" rx="120" ry="28" fill="#6a6770" opacity="0.35" />
      <ellipse cx="520" cy="300" rx="180" ry="42" fill="#5c5962" opacity="0.4" />
      <ellipse cx="750" cy="350" rx="100" ry="24" fill="#6a6770" opacity="0.3" />
      {[...Array(24)].map((_, i) => (
        <circle
          key={i}
          cx={40 + (i * 97) % WORLD_W}
          cy={80 + (i * 53) % (WORLD_H - 60)}
          r={1.2 + (i % 3) * 0.8}
          fill="#a8a4ad"
          opacity={0.25 + (i % 5) * 0.08}
        />
      ))}
    </>
  );
}

function DustBurst({ x, y, id }) {
  return (
    <g key={id} className="lunar-dust-burst" transform={`translate(${x} ${y})`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={Math.cos(i) * 8}
          cy={-4 - i * 3}
          r={2 + (i % 2)}
          fill="#c4c0b8"
          opacity="0.55"
        />
      ))}
    </g>
  );
}

function DPad({ onDir }) {
  const press = (dx, dy) => () => onDir({ dx, dy, hop: true });
  return (
    <div className="lunar-dpad" aria-label="Move across the Moon">
      <button type="button" className="lunar-dpad-btn lunar-dpad-up" onClick={press(0, -1)} aria-label="Hop north">
        ↑
      </button>
      <button type="button" className="lunar-dpad-btn lunar-dpad-left" onClick={press(-1, 0)} aria-label="Hop west">
        ←
      </button>
      <button type="button" className="lunar-dpad-btn lunar-dpad-right" onClick={press(1, 0)} aria-label="Hop east">
        →
      </button>
      <button type="button" className="lunar-dpad-btn lunar-dpad-down" onClick={press(0, 1)} aria-label="Hop south">
        ↓
      </button>
    </div>
  );
}

/**
 * Panning lunar surface — low-gravity hops, keyboard + touch D-pad.
 */
export default function LunarSurface({
  spawn = { worldX: 120, worldY: 300 },
  spots = [],
  completedSpotIds = [],
  activeSpotId = null,
  onArrive,
  renderAvatar,
  themeColor = "#9ad8ff",
  arrivalReset = 0,
  children,
}) {
  const [pos, setPos] = useState({ x: spawn.worldX, y: spawn.worldY });
  const vel = useRef({ x: 0, y: 0 });
  const keys = useRef({});
  const raf = useRef(null);
  const arrivedRef = useRef(new Set());
  const [dust, setDust] = useState([]);
  const dustId = useRef(0);
  const viewRef = useRef(null);

  useEffect(() => {
    arrivedRef.current = new Set(
      [...arrivedRef.current].filter((id) => completedSpotIds.includes(id))
    );
  }, [arrivalReset, completedSpotIds]);

  const addDust = useCallback((x, y) => {
    const id = dustId.current++;
    setDust((d) => [...d.slice(-8), { id, x, y }]);
    window.setTimeout(() => setDust((d) => d.filter((p) => p.id !== id)), 400);
  }, []);

  const impulse = useCallback(
    (dx, dy) => {
      vel.current.x += dx * HOP;
      vel.current.y += dy * HOP;
      addDust(pos.x, pos.y + 18);
    },
    [addDust, pos.x, pos.y]
  );

  useEffect(() => {
    const down = (e) => {
      if (e.repeat) return;
      keys.current[e.code] = true;
    };
    const up = (e) => {
      keys.current[e.code] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const k = keys.current;
      let ax = 0;
      let ay = 0;
      if (k.ArrowLeft || k.KeyA) ax -= 1;
      if (k.ArrowRight || k.KeyD) ax += 1;
      if (k.ArrowUp || k.KeyW) ay -= 1;
      if (k.ArrowDown || k.KeyS) ay += 1;
      if (ax !== 0 || ay !== 0) {
        const len = Math.hypot(ax, ay) || 1;
        vel.current.x += (ax / len) * HOP * 0.42;
        vel.current.y += (ay / len) * HOP * 0.42;
      }
      vel.current.x *= FRICTION;
      vel.current.y *= FRICTION;
      setPos((p) => {
        const nx = Math.max(40, Math.min(WORLD_W - 40, p.x + vel.current.x));
        const ny = Math.max(60, Math.min(WORLD_H - 40, p.y + vel.current.y));
        if (Math.abs(vel.current.x) > 0.4 || Math.abs(vel.current.y) > 0.4) {
          addDust(nx, ny + 16);
        }
        spots.forEach((spot) => {
          if (completedSpotIds.includes(spot.id)) return;
          if (activeSpotId && spot.id !== activeSpotId) return;
          const dist = Math.hypot(nx - spot.worldX, ny - spot.worldY);
          if (dist < ARRIVE_R && !arrivedRef.current.has(spot.id)) {
            arrivedRef.current.add(spot.id);
            onArrive?.(spot);
          }
        });
        return { x: nx, y: ny };
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [spots, completedSpotIds, activeSpotId, onArrive, addDust]);

  const camX = Math.max(0, Math.min(WORLD_W - 400, pos.x - 200));
  const camY = Math.max(0, Math.min(WORLD_H - 280, pos.y - 140));

  return (
    <div className="lunar-surface-wrap">
      <svg
        ref={viewRef}
        viewBox={`${camX} ${camY} 400 280`}
        className="lunar-surface-svg"
        role="img"
        aria-label="Lunar surface exploration"
      >
        <defs>
          <linearGradient id="lunar-horizon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(8,10,16,0.55)" />
            <stop offset="45%" stopColor="rgba(8,10,16,0.12)" />
            <stop offset="100%" stopColor="rgba(90,88,95,0.35)" />
          </linearGradient>
        </defs>
        <rect x={camX - 20} y={camY - 20} width={440} height={320} fill="url(#lunar-horizon)" />
        <rect x={0} y={WORLD_H - 120} width={WORLD_W} height={140} fill="#6b686f" opacity="0.85" />
        <rect x={0} y={WORLD_H - 100} width={WORLD_W} height={100} fill="#78757c" opacity="0.9" />
        {craterDecor()}
        {dust.map((d) => (
          <DustBurst key={d.id} x={d.x} y={d.y} id={d.id} />
        ))}
        {spots.map((spot) => {
          const done = completedSpotIds.includes(spot.id);
          const inactive = activeSpotId && spot.id !== activeSpotId && !done;
          return (
            <g key={spot.id} opacity={inactive ? 0.35 : 1}>
              <circle
                cx={spot.worldX}
                cy={spot.worldY}
                r={done ? 14 : 22}
                fill="none"
                stroke={themeColor}
                strokeWidth={done ? 2 : 3}
                className={done ? "" : "lunar-spot-pulse"}
                opacity={done ? 0.5 : 0.9}
              />
              <circle cx={spot.worldX} cy={spot.worldY} r={8} fill={themeColor} opacity={done ? 0.4 : 0.85} />
              {!done && (
                <text
                  x={spot.worldX}
                  y={spot.worldY - 28}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="11"
                  fontWeight="600"
                >
                  {spot.label}
                </text>
              )}
            </g>
          );
        })}
        <g transform={`translate(${pos.x - 50} ${pos.y - 70})`}>
          {renderAvatar?.({ moving: Math.abs(vel.current.x) + Math.abs(vel.current.y) > 0.5 })}
        </g>
      </svg>
      <DPad onDir={impulse} />
      {children}
    </div>
  );
}

export { WORLD_W, WORLD_H, ARRIVE_R };
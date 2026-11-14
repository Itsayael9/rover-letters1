"use client";

import { useEffect, useState } from "react";

const INK = "#1a2030";
const C = {
  foil: "#d4a84b",
  foilHi: "#f5d98a",
  foilDim: "#a67c32",
  panel: "#3d4654",
  leg: "#6b7a8f",
  suit: "#e8eef5",
  visor: "#1e3a5f",
  visorHi: "#4a90c8",
  boot: "#4a5568",
  blush: "#ffb0b8",
  plss: "#8a9bb0",
};

export default function Apollo12({
  talking = false,
  mood = "happy",
  pose = "idle",
  highlight = null,
  size = "100%",
  waveLevel = 0,
  dust = false,
  showLander = true,
  className,
  style,
}) {
  const [mouthOpen, setMouthOpen] = useState(0);
  const [look] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!talking) {
      setMouthOpen(0);
      return undefined;
    }
    const id = setInterval(() => setMouthOpen(0.15 + Math.random() * 0.85), 110);
    return () => clearInterval(id);
  }, [talking]);

  const hop = pose === "hop" || pose === "bounce" ? -8 : 0;
  const armUp = pose === "wave" || highlight === "artifact";
  const lmGlow = highlight === "lander";

  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      style={{ width: size, height: "auto", ...style }}
      role="img"
      aria-label="Apollo 12 astronaut at Intrepid"
    >
      <defs>
        <linearGradient id="a12-foil" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.foilHi} />
          <stop offset="50%" stopColor={C.foil} />
          <stop offset="100%" stopColor={C.foilDim} />
        </linearGradient>
        <filter id="a12-glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {dust && (
        <g className="a12-dust-kick" opacity="0.6">
          {[0, 1, 2, 3].map((i) => (
            <ellipse key={i} cx={95 + i * 6} cy={268} rx={10 - i} ry={3} fill="#a8a4ad" />
          ))}
        </g>
      )}

      {showLander && (
        <g filter={lmGlow ? "url(#a12-glow)" : undefined} transform="translate(220, 140)">
          <polygon points="0,80 55,0 110,80" fill="url(#a12-foil)" stroke={INK} strokeWidth="2.5" />
          {[15, 55, 95].map((lx, i) => (
            <g key={i}>
              <line x1={lx} y1={80} x2={lx - 8} y2={115} stroke={INK} strokeWidth="5" />
              <line x1={lx} y1={80} x2={lx - 8} y2={115} stroke={C.leg} strokeWidth="3" />
              <ellipse cx={lx - 8} cy={118} rx={14} ry={5} fill={C.boot} stroke={INK} strokeWidth="2" />
            </g>
          ))}
          <rect x="42" y="25" width="26" height="40" rx="3" fill={C.panel} stroke={INK} strokeWidth="2" />
          <path d="M48 65 L55 95" stroke={INK} strokeWidth="3" />
        </g>
      )}

      <g transform={`translate(70, ${170 + hop})`}>
        {/* PLSS backpack */}
        <rect x="38" y="20" width="28" height="42" rx="6" fill={C.plss} stroke={INK} strokeWidth="2" />
        {/* suit body */}
        <ellipse cx="52" cy="75" rx="22" ry="28" fill={C.suit} stroke={INK} strokeWidth="2.5" />
        {/* helmet */}
        <circle cx="52" cy="38" r="24" fill={C.suit} stroke={INK} strokeWidth="3" />
        <ellipse cx="52" cy="40" rx="18" ry="16" fill={C.visor} stroke={INK} strokeWidth="2" />
        <ellipse cx="48" cy="36" rx="8" ry="5" fill={C.visorHi} opacity="0.45" />
        <ellipse cx={48 + look.x} cy={42 + look.y} rx="3.5" ry="4" fill="#fff" />
        <ellipse cx={50 + look.x * 1.2} cy={43 + look.y} rx="1.8" ry="2" fill={INK} />
        <ellipse cx={56 + look.x} cy={42 + look.y} rx="3.5" ry="4" fill="#fff" />
        <ellipse cx={58 + look.x * 1.2} cy={43 + look.y} rx="1.8" ry="2" fill={INK} />
        {talking ? (
          <ellipse cx="52" cy="52" rx={4 + mouthOpen * 4} ry={2 + mouthOpen * 2} fill={INK} opacity="0.7" />
        ) : mood === "happy" ? (
          <path d="M46 52 Q52 56 58 52" fill="none" stroke={INK} strokeWidth="2" />
        ) : null}
        {mood === "excited" && <circle cx="68" cy="35" r="5" fill={C.blush} opacity="0.5" />}
        {/* arms */}
        <path
          d={armUp ? "M30 58 L8 28" : "M30 58 L18 72"}
          stroke={INK}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d={armUp ? "M30 58 L8 28" : "M30 58 L18 72"}
          stroke={C.suit}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M74 58 L88 78" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M74 58 L88 78" stroke={C.suit} strokeWidth="3" strokeLinecap="round" />
        {/* legs */}
        <line x1="42" y1="98" x2="32" y2="125" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <line x1="62" y1="98" x2="72" y2="125" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="30" cy="128" rx="10" ry="6" fill={C.boot} stroke={INK} strokeWidth="2" />
        <ellipse cx="74" cy="128" rx="10" ry="6" fill={C.boot} stroke={INK} strokeWidth="2" />
        {talking &&
          [1, 2].map((i) => (
            <circle
              key={i}
              cx={85}
              cy={30}
              r={6 + i * (8 + waveLevel * 10)}
              fill="none"
              stroke="#f5c451"
              strokeWidth={2 - i * 0.3}
              opacity={0.35 + waveLevel * 0.2}
              className="a12-radio-ring"
            />
          ))}
      </g>

      <style>{`
        .a12-dust-kick { animation: a12-dust 0.35s ease-out; }
        @keyframes a12-dust {
          from { opacity: 0.85; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-8px); }
        }
        .a12-radio-ring { animation: a12-ring 1s ease-out infinite; }
        @keyframes a12-ring {
          0% { transform: scale(0.9); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 0; }
        }
      `}</style>
    </svg>
  );
}
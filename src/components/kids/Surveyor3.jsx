"use client";

import { useEffect, useState } from "react";

const INK = "#1a2030";
const C = {
  foil: "#d4a84b",
  foilHi: "#f5d98a",
  frame: "#8a9bb0",
  panel: "#e8eef5",
  leg: "#6b7a8f",
  pad: "#4a5568",
  scoop: "#3b82f6",
  solar: "#1e3a5f",
  solarCell: "#2d5a8a",
  lens: "#1e293b",
  blush: "#ffb0b8",
};

export default function Surveyor3({
  talking = false,
  mood = "happy",
  pose = "idle",
  highlight = null,
  size = "100%",
  waveLevel = 0,
  className,
  style,
}) {
  const [look] = useState({ x: 0, y: 0 });
  const [mouthOpen, setMouthOpen] = useState(0);

  useEffect(() => {
    if (!talking) {
      setMouthOpen(0);
      return undefined;
    }
    const id = setInterval(() => setMouthOpen(0.2 + Math.random() * 0.8), 110);
    return () => clearInterval(id);
  }, [talking]);

  const bounceY = pose === "bounce" ? 6 : pose === "dig" ? 2 : 0;
  const scoopRot = pose === "dig" ? -28 : pose === "wave" ? -12 : 0;
  const legPulse = highlight === "legs" || pose === "bounce";
  const camGlow = highlight === "camera" || talking;
  const scoopGlow = highlight === "scoop" || pose === "dig";
  const solarGlow = highlight === "solar";
  const antGlow = highlight === "antenna" || talking;

  const moodEye =
    mood === "surprised" ? "surprised" : mood === "excited" ? "wide" : "normal";

  return (
    <svg
      viewBox="0 0 400 320"
      className={className}
      style={{ width: size, height: "auto", ...style }}
      role="img"
      aria-label="Surveyor 3 lunar lander"
    >
      <defs>
        <linearGradient id="s3-foil" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.foilHi} />
          <stop offset="100%" stopColor={C.foil} />
        </linearGradient>
        <filter id="s3-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={`translate(0, ${-bounceY})`}>
        {/* Legs */}
        <g className={legPulse ? "s3-pulse" : ""} opacity={legPulse ? 1 : 0.95}>
          {[
            [120, 268, 80, 300],
            [200, 268, 200, 300],
            [280, 268, 320, 300],
          ].map(([x1, y1, x2, y2], i) => (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth="8" strokeLinecap="round" />
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.leg} strokeWidth="5" strokeLinecap="round" />
              <ellipse
                cx={x2}
                cy={y2 + 4}
                rx={22}
                ry={8}
                fill={C.pad}
                stroke={INK}
                strokeWidth="2.5"
              />
              <ellipse cx={x2} cy={y2 + 2} rx={18} ry={5} fill="#5a6578" opacity="0.5" />
            </g>
          ))}
        </g>

        {/* Deck + foil boxes */}
        <rect x="105" y="195" width="190" height="55" rx="8" fill={C.frame} stroke={INK} strokeWidth="3" />
        <rect x="115" y="178" width="55" height="40" rx="4" fill="url(#s3-foil)" stroke={INK} strokeWidth="2" />
        <rect x="178" y="175" width="48" height="38" rx="4" fill="url(#s3-foil)" stroke={INK} strokeWidth="2" />
        <rect x="232" y="180" width="52" height="36" rx="4" fill={C.panel} stroke={INK} strokeWidth="2" />

        {/* Solar panel */}
        <g filter={solarGlow ? "url(#s3-glow)" : undefined}>
          <rect
            x="148"
            y="118"
            width="104"
            height="52"
            rx="3"
            fill={C.solar}
            stroke={INK}
            strokeWidth="2.5"
          />
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3, 4].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={154 + col * 19}
                y={124 + row * 11}
                width="15"
                height="8"
                rx="1"
                fill={C.solarCell}
                stroke="#0f2744"
                strokeWidth="0.5"
              />
            ))
          )}
        </g>

        {/* Mast + TV camera */}
        <rect x="196" y="95" width="10" height="35" fill={C.leg} stroke={INK} strokeWidth="1.5" />
        <g filter={camGlow ? "url(#s3-glow)" : undefined}>
          <rect x="178" y="62" width="46" height="36" rx="6" fill={C.panel} stroke={INK} strokeWidth="2.5" />
          <ellipse cx="201" cy="80" rx="14" ry="12" fill={C.lens} stroke={INK} strokeWidth="2" />
          {/* expressive eyes on camera */}
          {moodEye === "surprised" ? (
            <>
              <circle cx="193" cy="74" r="4" fill="#fff" />
              <circle cx="209" cy="74" r="4" fill="#fff" />
              <circle cx="193" cy="74" r="2" fill={INK} />
              <circle cx="209" cy="74" r="2" fill={INK} />
            </>
          ) : (
            <>
              <ellipse cx="193" cy={76 - mouthOpen * 2} rx="3.5" ry="4" fill="#fff" />
              <ellipse cx={193 + look.x * 2} cy={76 - mouthOpen * 2 + look.y} rx="2" ry="2.5" fill={INK} />
              <ellipse cx="209" cy={76 - mouthOpen * 2} rx="3.5" ry="4" fill="#fff" />
              <ellipse cx={209 + look.x * 2} cy={76 - mouthOpen * 2 + look.y} rx="2" ry="2.5" fill={INK} />
            </>
          )}
          {talking ? (
            <ellipse cx="201" cy="88" rx={4 + mouthOpen * 5} ry={2 + mouthOpen * 3} fill={INK} />
          ) : mood === "happy" || mood === "excited" ? (
            <path d="M194 88 Q201 92 208 88" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          ) : null}
          {mood === "excited" && (
            <circle cx="220" cy="70" r="5" fill={C.blush} opacity="0.55" />
          )}
        </g>

        {/* Planar antenna */}
        <g filter={antGlow ? "url(#s3-glow)" : undefined}>
          <line x1="268" y1="200" x2="318" y2="145" stroke={INK} strokeWidth="4" />
          <line x1="268" y1="200" x2="318" y2="145" stroke={C.leg} strokeWidth="2" />
          <rect x="302" y="128" width="38" height="28" rx="2" fill={C.panel} stroke={INK} strokeWidth="2" transform="rotate(-38 321 142)" />
          {talking &&
            [1, 2, 3].map((i) => (
              <circle
                key={i}
                cx={330}
                cy={125}
                r={8 + i * (10 + waveLevel * 12)}
                fill="none"
                stroke="#9ad8ff"
                strokeWidth={2 - i * 0.4}
                opacity={0.35 + waveLevel * 0.25 - i * 0.08}
                className="s3-radio-ring"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
        </g>

        {/* Scissor arm + scoop */}
        <g
          transform={`translate(108, 210) rotate(${scoopRot})`}
          filter={scoopGlow ? "url(#s3-glow)" : undefined}
        >
          <path d="M0 0 L55 -8 L95 12" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <path d="M0 0 L55 -8 L95 12" fill="none" stroke={C.leg} strokeWidth="3" strokeLinecap="round" />
          <path d="M20 -2 L48 -6 M22 4 L50 0" stroke={C.frame} strokeWidth="2" />
          <path
            d="M95 12 L118 18 L112 28 L90 22 Z"
            fill={C.scoop}
            stroke={INK}
            strokeWidth="2"
          />
        </g>
      </g>

      <style>{`
        .s3-pulse { animation: s3-leg-bounce 0.45s ease-in-out infinite alternate; }
        @keyframes s3-leg-bounce { from { transform: translateY(0); } to { transform: translateY(-4px); } }
        .s3-radio-ring { animation: s3-ring 1.1s ease-out infinite; }
        @keyframes s3-ring {
          0% { opacity: 0.55; transform: scale(0.85); }
          100% { opacity: 0; transform: scale(1.15); }
        }
      `}</style>
    </svg>
  );
}
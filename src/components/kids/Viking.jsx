"use client";
// Viking.jsx — cartoon Viking lander for Rover Letters (Kids mode)
// Same style, same face and same props as Opportunity.jsx / Ingenuity.jsx.
// Pure SVG + React. No images, no dependencies. Drop it in src/components/kids/.

import { useEffect, useRef, useState } from "react";

const INK = "#3a2a24";
const C = {
  gold: "#f0c14a",
  goldHi: "#fff6d2",
  cream: "#fffaf3",
  silver: "#e7eef5",
  steel: "#8ea0b3",
  boom: "#4a5468",
  panel: "#1d3f78",
  panelLine: "#9fd0ff",
  tan: "#e6d6b2",
  tanLine: "#b9a57c",
  dirt: "#b4673f",
  dirtHi: "#d98b5b",
  red: "#d64545",
  flag: "#2a4a9a",
  flame: "#ff9a3c",
  flameHi: "#ffe27a",
  mouth: "#c23b4a",
  tongue: "#ff8b9a",
  blush: "#ffb0b8",
  glow: "#ffe27a",
};

// ---------- Part info (kid-friendly lines you can read with the narrator) ----------
export const PARTS = [
  { id: "dish", label: "Big dish antenna", center: [318, 92], text: "This big dish is my phone. It points at Earth and sends my pictures and my science back home." },
  { id: "cameras", label: "Cameras", center: [200, 138], text: "These are my two eyes! They turn all the way around and take pictures of Mars, even in 3D." },
  { id: "arm", label: "Sampler arm", center: [262, 300], text: "My arm stretches out and digs. It has a little scoop to pick up Martian soil!" },
  { id: "weather", label: "Weather boom", center: [68, 150], text: "This is my weather station. It measures how cold it is and how fast the wind blows." },
  { id: "power", label: "Power units", center: [86, 232], text: "I don't use sunlight. My two special batteries make electricity from heat, and they keep my insides warm!" },
  { id: "legs", label: "Legs", center: [100, 292], text: "My three legs have round feet and shock absorbers, so I can land softly and stand steady." },
  { id: "lab", label: "Science lab", center: [131, 230], text: "Inside me is a tiny science lab. It tests Martian soil to look for signs of life." },
];
export const ALL_PARTS = PARTS.map((p) => p.id);

// ---------- helpers ----------
function Tube({ d, w = 10, color = C.steel }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

// ---------- parts ----------
function LegSide() {
  return (
    <g>
      <Tube d="M132 262 L70 316" w={9} />
      <Tube d="M112 281 L92 299" w={14} color={C.silver} />
      <circle cx="72" cy="314" r="6" fill={C.gold} stroke={INK} strokeWidth="2.5" />
      <ellipse cx="64" cy="324" rx="25" ry="8" fill={C.steel} stroke={INK} strokeWidth="3" />
      <ellipse cx="64" cy="322" rx="15" ry="4" fill="#fff" opacity=".3" />
    </g>
  );
}

function Legs({ both = true }) {
  return (
    <g>
      <LegSide />
      {both && (
        <g transform="translate(400,0) scale(-1,1)">
          <LegSide />
        </g>
      )}
    </g>
  );
}

function PowerSide() {
  return (
    <g>
      <rect x="54" y="198" width="66" height="72" rx="28" fill={C.tan} stroke={INK} strokeWidth="3.5" />
      <path d="M70 212 Q76 236 70 262" fill="none" stroke={C.tanLine} strokeWidth="3" strokeLinecap="round" />
      <path d="M88 205 Q94 234 90 266" fill="none" stroke={C.tanLine} strokeWidth="3" strokeLinecap="round" />
      <path d="M62 218 Q64 208 74 204" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" />
      <circle cx="82" cy="238" r="9" fill={C.flame} opacity=".5" />
    </g>
  );
}

function Power({ both = true }) {
  return (
    <g>
      <PowerSide />
      {both && (
        <g transform="translate(400,0) scale(-1,1)">
          <PowerSide />
        </g>
      )}
    </g>
  );
}

// Always visible: the hexagonal body with the flag
function Core() {
  return (
    <g>
      <rect x="100" y="188" width="200" height="80" rx="26" fill={C.silver} stroke={INK} strokeWidth="3.5" />
      <rect x="114" y="192" width="172" height="8" rx="4" fill="#fff" opacity=".85" />
      <line x1="166" y1="206" x2="166" y2="262" stroke={INK} strokeOpacity=".16" strokeWidth="2" />
      <line x1="234" y1="206" x2="234" y2="262" stroke={INK} strokeOpacity=".16" strokeWidth="2" />
      <path d="M122 258 Q200 272 278 258" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" />
      {[120, 280].map((x) => (
        <circle key={x} cx={x} cy="254" r="4" fill={C.panel} stroke={INK} strokeWidth="2" />
      ))}
      {/* little flag */}
      <rect x="254" y="208" width="30" height="18" fill="#fff" stroke={INK} strokeWidth="2" />
      {[208, 215.2, 222.4].map((y) => (
        <rect key={y} x="254" y={y} width="30" height="3.6" fill={C.red} />
      ))}
      <rect x="254" y="208" width="12" height="10.8" fill={C.flag} />
      <rect x="254" y="208" width="30" height="18" fill="none" stroke={INK} strokeWidth="2" />
    </g>
  );
}

function Lab() {
  return (
    <g>
      <rect x="114" y="206" width="34" height="48" rx="10" fill={C.gold} stroke={INK} strokeWidth="3" />
      <rect x="119" y="212" width="7" height="34" rx="3.5" fill={C.goldHi} opacity=".75" />
      <rect x="132" y="226" width="9" height="20" rx="4.5" fill="#9fe3ff" stroke={INK} strokeWidth="2" />
      <circle cx="136" cy="216" r="2.8" fill="#fff" opacity=".85" />
      <circle cx="141" cy="211" r="2" fill="#fff" opacity=".7" />
    </g>
  );
}

function Weather({ windy = false }) {
  return (
    <g>
      <Tube d="M92 204 L70 134" w={5} />
      <circle cx="82" cy="170" r="5" fill={C.gold} stroke={INK} strokeWidth="2.2" />
      <g transform="translate(68 122)">
        <g className={windy ? "vik-spin vik-spin-fast" : "vik-spin"}>
          <line x1="-14" y1="0" x2="14" y2="0" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <line x1="0" y1="-14" x2="0" y2="14" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          {[[-14, 0], [14, 0], [0, -14], [0, 14]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="5.5" fill={C.cream} stroke={INK} strokeWidth="2.2" />
          ))}
        </g>
        <circle r="4.5" fill={C.gold} stroke={INK} strokeWidth="2.2" />
      </g>
    </g>
  );
}

function Dish({ calling = false }) {
  return (
    <g>
      <Tube d="M296 190 L305 126" w={8} />
      <g transform="rotate(-18 318 92)">
        <g className={calling ? "vik-dish" : ""}>
          <ellipse cx="318" cy="92" rx="33" ry="39" fill={C.silver} stroke={INK} strokeWidth="3" />
          <ellipse cx="318" cy="92" rx="21" ry="26" fill={C.steel} stroke={INK} strokeWidth="2" />
          <circle cx="318" cy="92" r="4.5" fill={C.gold} stroke={INK} strokeWidth="2" />
        </g>
      </g>
    </g>
  );
}

function Brow({ cx, cy, mood, side }) {
  const flip = side === "right" ? 1 : -1;
  let d = `M${cx - 14} ${cy} Q${cx} ${cy - 6} ${cx + 14} ${cy}`;
  if (mood === "angry") d = `M${cx - 14 * flip} ${cy + 6} Q${cx} ${cy - 2} ${cx + 14 * flip} ${cy - 8}`;
  if (mood === "sad") d = `M${cx - 14} ${cy - 4} Q${cx} ${cy + 6} ${cx + 14} ${cy - 2}`;
  if (mood === "surprised" || mood === "scared") d = `M${cx - 14} ${cy + 2} Q${cx} ${cy - 10} ${cx + 14} ${cy + 2}`;
  if (mood === "curious" && side === "left") d = `M${cx - 14} ${cy + 4} Q${cx} ${cy - 10} ${cx + 14} ${cy - 2}`;
  return <path d={d} fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />;
}

function Eye({ cx, cy, look, mood }) {
  const big = mood === "surprised" || mood === "scared";
  const r = big ? 30 : mood === "angry" ? 22 : 27;
  const pr = big ? 8 : mood === "sleepy" || mood === "sad" ? 10 : 13;
  const sleepy = mood === "sleepy" || mood === "sad";
  const px = cx + look.x + (mood === "curious" ? 3 : 0);
  const py = cy + look.y + (sleepy ? 6 : 0);
  return (
    <g className="vik-eye">
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={INK} strokeWidth="3" />
      <circle cx={px} cy={py} r={pr} fill="#24356b" />
      <circle cx={px} cy={py} r={pr * 0.45} fill="#11182e" />
      <circle cx={px - 4} cy={py - 4.5} r="4" fill="#fff" />
      <circle cx={px + 3} cy={py + 3} r="1.6" fill="#fff" opacity=".8" />
      {sleepy && (
        <path d={`M${cx - r - 1} ${cy + 2} A${r + 1} ${r + 1} 0 0 1 ${cx + r + 1} ${cy + 2} Z`} fill={C.cream} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      )}
    </g>
  );
}

function Mouth({ open, mood }) {
  if (mood === "surprised" || mood === "scared") {
    const ry = 8 + open * 8;
    return <ellipse cx="200" cy="74" rx={8 + open * 3} ry={ry} fill={C.mouth} stroke={INK} strokeWidth="3" />;
  }
  if (mood === "sad" || mood === "angry") {
    if (open < 0.2) {
      return <path d="M186 78 Q200 64 214 78" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />;
    }
    return (
      <path d={`M186 76 Q200 ${70 - open * 8} 214 76 Z`} fill={C.mouth} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    );
  }
  if (open < 0.15) {
    return <path d="M184 66 Q200 84 216 66" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />;
  }
  const d = 8 + open * 14;
  return (
    <g>
      <path d={`M184 66 Q200 ${66 + d * 1.6} 216 66 Z`} fill={C.mouth} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="200" cy={66 + d * 0.95} rx="7" ry={Math.min(5, d * 0.3)} fill={C.tongue} />
    </g>
  );
}

// The two cameras on top are the eyes
function Cameras({ look, mood }) {
  return (
    <g>
      {[165, 235].map((x) => (
        <g key={x}>
          <rect x={x - 14} y="156" width="28" height="38" rx="9" fill={C.silver} stroke={INK} strokeWidth="3" />
          <rect x={x - 14} y="174" width="28" height="6" rx="2" fill={C.gold} stroke={INK} strokeWidth="2" />
        </g>
      ))}
      <Brow cx={165} cy={110} mood={mood} side="left" />
      <Brow cx={235} cy={110} mood={mood} side="right" />
      <Eye cx={165} cy={138} look={look} mood={mood} />
      <Eye cx={235} cy={138} look={look} mood={mood} />
    </g>
  );
}

// Mouth and cheeks on the front of the body (belong to the cameras part)
function LowerFace({ mood, mouthOpen }) {
  return (
    <g>
      <ellipse cx="168" cy="233" rx="9" ry="5.5" fill={C.blush} opacity=".85" />
      <ellipse cx="232" cy="233" rx="9" ry="5.5" fill={C.blush} opacity=".85" />
      <g transform="translate(200 222) scale(0.9) translate(-200 -66)">
        <Mouth open={mouthOpen} mood={mood} />
      </g>
    </g>
  );
}

function Arm({ raised = false, waving = false, scooping = false }) {
  return (
    <g
      className={`vik-arm${raised ? " vik-arm-up" : ""}${waving ? " vik-arm-wave" : ""}${scooping ? " vik-scoop" : ""}`}
      style={{ transformOrigin: "236px 256px", transformBox: "view-box" }}
    >
      <Tube d="M236 256 L258 290 L262 316" w={9} color={C.boom} />
      <circle cx="236" cy="256" r="7" fill={C.gold} stroke={INK} strokeWidth="2.5" />
      <circle cx="258" cy="290" r="5.5" fill={C.gold} stroke={INK} strokeWidth="2.5" />
      <path d="M249 312 L277 312 L271 327 L255 327 Z" fill={C.silver} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

function Soil() {
  return (
    <g>
      <path d="M240 332 Q262 312 296 332 Z" fill={C.dirt} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M252 328 Q264 318 278 326" fill="none" stroke={C.dirtHi} strokeWidth="3" strokeLinecap="round" />
      <circle cx="286" cy="328" r="2.5" fill={C.dirtHi} />
    </g>
  );
}

function Parachute() {
  return (
    <g>
      <line x1="80" y1="-34" x2="132" y2="190" stroke={INK} strokeWidth="2.5" />
      <line x1="200" y1="-34" x2="200" y2="140" stroke={INK} strokeWidth="2.5" opacity="0" />
      <line x1="320" y1="-34" x2="268" y2="190" stroke={INK} strokeWidth="2.5" />
      <path d="M70 -34 Q70 -124 200 -124 Q330 -124 330 -34 Q300 -48 265 -34 Q232 -48 200 -34 Q168 -48 135 -34 Q100 -48 70 -34 Z" fill={C.cream} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M200 -122 Q150 -114 135 -34 Q168 -48 200 -34 Z" fill={C.red} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M200 -122 Q250 -114 265 -34 Q232 -48 200 -34 Z" fill={C.red} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </g>
  );
}

function Flames() {
  return (
    <g className="vik-flames">
      {[[132, 0], [200, 0.15], [268, 0.3]].map(([x, delay]) => (
        <g key={x} className="vik-flame" style={{ animationDelay: `${delay}s` }}>
          <path d={`M${x - 11} 268 Q${x} 312 ${x + 11} 268 Z`} fill={C.flame} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d={`M${x - 5} 268 Q${x} 294 ${x + 5} 268 Z`} fill={C.flameHi} />
        </g>
      ))}
    </g>
  );
}

const ICON_VB = {
  dish: "276 44 84 92",
  cameras: "128 100 144 98",
  arm: "222 246 62 90",
  weather: "46 104 54 106",
  power: "50 194 70 80",
  legs: "34 256 106 80",
  lab: "106 200 50 58",
};

export function PartIcon({ part, size = 96, className, style }) {
  const vb = ICON_VB[part];
  if (!vb) return null;
  const [, , w, h] = vb.split(" ").map(Number);
  const look = { x: 0, y: 0 };
  return (
    <svg viewBox={vb} width={size} height={(size * h) / w} className={className} style={style} role="img" aria-label={part}>
      {part === "dish" && <Dish />}
      {part === "cameras" && <Cameras look={look} mood="happy" />}
      {part === "arm" && <Arm />}
      {part === "weather" && <Weather />}
      {part === "power" && <PowerSide />}
      {part === "legs" && <Legs both={false} />}
      {part === "lab" && <Lab />}
    </svg>
  );
}

export default function Viking({
  talking = false,
  mood = "happy",
  pose = null,
  size = "100%",
  assembled = ALL_PARTS,
  ghosts = false,
  highlight = null,
  hotspots = false,
  onPartClick,
  followPointer = true,
  className,
  style,
}) {
  const svgRef = useRef(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [mouthOpen, setMouthOpen] = useState(0);

  useEffect(() => {
    if (!talking) {
      setMouthOpen(0);
      return;
    }
    const id = setInterval(() => setMouthOpen(0.15 + Math.random() * 0.85), 120);
    return () => clearInterval(id);
  }, [talking]);

  useEffect(() => {
    if (!followPointer) return;
    const onMove = (e) => {
      const el = svgRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.4);
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, dist / 220);
      setLook({ x: (dx / dist) * 6 * k, y: (dy / dist) * 5 * k });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [followPointer]);

  const part = (id, label, children) => {
    const visible = assembled.includes(id);
    const interactive = !!onPartClick && visible;
    const handlers = interactive
      ? {
          role: "button",
          tabIndex: 0,
          "aria-label": label,
          onClick: () => onPartClick(id),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onPartClick(id);
            }
          },
        }
      : {};
    return (
      <g
        key={id}
        className={`vik-part${interactive ? " vik-int" : ""}${highlight === id ? " vik-hl" : ""}`}
        style={{
          opacity: visible ? 1 : ghosts ? 0.2 : 0,
          filter: !visible && ghosts ? "grayscale(1)" : undefined,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity .3s",
        }}
        {...handlers}
      >
        {children}
      </g>
    );
  };

  const labelOf = (id) => PARTS.find((p) => p.id === id).label;
  const digging = pose === "scoop" || highlight === "arm";

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 340"
      width={size}
      className={className}
      style={{ display: "block", maxWidth: "100%", height: "auto", overflow: "visible", ...style }}
      role="img"
      aria-label="Viking, the cartoon Mars lander"
    >
      <style>{`
        @keyframes vik-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        @keyframes vik-bounce { 0%,100% { transform: translateY(0) } 30% { transform: translateY(-28px) } 55% { transform: translateY(0) } 75% { transform: translateY(-12px) } }
        @keyframes vik-shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }
        @keyframes vik-blink { 0%,92%,100% { transform: scaleY(1) } 95% { transform: scaleY(.08) } }
        @keyframes vik-pulse { 0% { transform: scale(.7); opacity: .9 } 100% { transform: scale(2.1); opacity: 0 } }
        @keyframes vik-dish { 0%,100% { transform: rotate(-12deg) } 50% { transform: rotate(12deg) } }
        @keyframes vik-spin { to { transform: rotate(360deg) } }
        @keyframes vik-scoop { 0%,100% { transform: rotate(-4deg) } 50% { transform: rotate(14deg) } }
        @keyframes vik-armwave { 0%,100% { transform: rotate(-80deg) } 50% { transform: rotate(-108deg) } }
        @keyframes vik-land { 0% { transform: translateY(-190px) } 76% { transform: translateY(0) } 85% { transform: translateY(7px) } 100% { transform: translateY(0) } }
        @keyframes vik-flame { 0%,100% { transform: scaleY(1) } 50% { transform: scaleY(1.35) } }
        @keyframes vik-flamesout { 0%,72% { opacity: 1 } 100% { opacity: 0 } }
        @keyframes vik-chute { 0%,100% { transform: rotate(-3deg) } 50% { transform: rotate(3deg) } }
        .vik-bob { animation: vik-bob 3.2s ease-in-out infinite; transform-box: fill-box; }
        .vik-pose-bounce { animation: vik-bounce 0.7s ease-in-out infinite; }
        .vik-pose-shake { animation: vik-shake 0.28s linear infinite; }
        .vik-pose-curl { animation: none; transform: scale(0.92, 0.88); transform-origin: 200px 320px; transform-box: view-box; }
        .vik-pose-droop { animation: none; transform: translateY(8px) rotate(-2deg); transform-origin: 200px 320px; transform-box: view-box; }
        .vik-pose-land { animation: vik-land 2.2s cubic-bezier(.2,.7,.3,1) forwards; }
        .vik-pose-chute { animation: vik-chute 2.4s ease-in-out infinite; transform-box: view-box; transform-origin: 200px -40px; }
        .vik-eye { transform-box: fill-box; transform-origin: center; animation: vik-blink 5s infinite; }
        .vik-int { cursor: pointer; }
        .vik-int:hover { filter: brightness(1.1); }
        .vik-int:focus-visible { outline: none; filter: drop-shadow(0 0 5px ${C.glow}) drop-shadow(0 0 2px ${C.glow}); }
        .vik-hl { filter: drop-shadow(0 0 7px ${C.glow}) drop-shadow(0 0 14px ${C.glow}); }
        .vik-arm { transition: transform 0.45s ease; transform-box: view-box; transform-origin: 236px 256px; }
        .vik-arm-up { transform: rotate(-95deg); filter: drop-shadow(0 0 8px ${C.glow}); }
        .vik-arm-wave { animation: vik-armwave 0.8s ease-in-out infinite; }
        .vik-scoop { animation: vik-scoop 0.9s ease-in-out infinite; }
        .vik-spin { transform-box: fill-box; transform-origin: center; animation: vik-spin 6s linear infinite; }
        .vik-spin-fast { animation-duration: 0.9s; }
        .vik-dish { transform-box: fill-box; transform-origin: center; animation: vik-dish 1.1s ease-in-out infinite; }
        .vik-ring { transform-box: fill-box; transform-origin: center; animation: vik-pulse 1.6s ease-out infinite; }
        .vik-flames { animation: vik-flamesout 2.2s forwards; }
        .vik-flame { transform-box: fill-box; transform-origin: top; animation: vik-flame 0.18s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .vik-bob, .vik-eye, .vik-ring, .vik-pose-bounce, .vik-pose-shake, .vik-pose-land, .vik-pose-chute, .vik-spin, .vik-dish, .vik-scoop, .vik-arm-wave, .vik-flame { animation: none; }
          .vik-arm { transition: none; }
        }
      `}</style>

      <ellipse cx="200" cy="334" rx="150" ry="9" fill="#000" opacity=".18" />

      <g
        className={`vik-bob${pose === "bounce" ? " vik-pose-bounce" : ""}${
          pose === "shake" ? " vik-pose-shake" : ""
        }${pose === "curl" ? " vik-pose-curl" : ""}${pose === "droop" ? " vik-pose-droop" : ""}${
          pose === "land" ? " vik-pose-land" : ""
        }${pose === "parachute" ? " vik-pose-chute" : ""}`}
      >
        {pose === "parachute" && <Parachute />}
        {part("legs", labelOf("legs"), <Legs />)}
        {pose === "land" && <Flames />}
        {part("power", labelOf("power"), <Power />)}
        <Core />
        {part("lab", labelOf("lab"), <Lab />)}
        {part("weather", labelOf("weather"), <Weather windy={highlight === "weather" || pose === "windy"} />)}
        {part("dish", labelOf("dish"), <Dish calling={pose === "call" || highlight === "dish"} />)}
        {part(
          "cameras",
          labelOf("cameras"),
          <g style={{ transform: pose === "look-up" || pose === "shock" ? "translateY(-5px)" : undefined }}>
            <Cameras
              look={
                pose === "look-up"
                  ? { x: look.x, y: -5 }
                  : pose === "yawn"
                    ? { x: look.x * 0.2, y: 4 }
                    : look
              }
              mood={mood}
            />
            <LowerFace mood={mood} mouthOpen={mouthOpen} />
          </g>
        )}
        {digging && <Soil />}
        {part(
          "arm",
          labelOf("arm"),
          <Arm
            raised={pose === "arm-up" || highlight === "arm"}
            waving={pose === "wave"}
            scooping={pose === "scoop"}
          />
        )}

        {hotspots &&
          PARTS.filter((p) => assembled.includes(p.id)).map((p) => (
            <g
              key={p.id}
              transform={`translate(${p.center[0]} ${p.center[1]})`}
              style={{ cursor: onPartClick ? "pointer" : "default" }}
              onClick={onPartClick ? () => onPartClick(p.id) : undefined}
            >
              <circle className="vik-ring" r="10" fill={C.glow} />
              <circle r="9" fill={C.glow} stroke={INK} strokeWidth="2.5" />
              <circle r="3" fill={INK} />
            </g>
          ))}
      </g>
    </svg>
  );
}
"use client";
// Opportunity.jsx — cartoon Opportunity rover for Rover Letters (Kids mode)
// Pure SVG + React. No images, no dependencies. Drop it in src/components/kids/.

import { useEffect, useRef, useState } from "react";

const INK = "#3a2a24";
const C = {
  gold: "#f0c14a",
  goldHi: "#fff6d2",
  cream: "#fffaf3",
  silver: "#e7eef5",
  steel: "#8ea0b3",
  panel: "#1d3f78",
  panelLine: "#9fd0ff",
  tire: "#2c2624",
  hub: "#f4f7fb",
  mouth: "#c23b4a",
  tongue: "#ff8b9a",
  blush: "#ffb0b8",
  glow: "#ffe27a",
};

// ---------- Part info (kid-friendly lines you can read with the narrator) ----------
export const PARTS = [
  { id: "wheels", label: "Wheels", center: [98, 300], text: "I have 6 wheels. They're my legs! They help me climb over rocks and sand." },
  { id: "panels", label: "Solar panels", center: [82, 175], text: "These are my lunch! They turn sunlight into energy so I can move." },
  { id: "camera", label: "Camera", center: [200, 66], text: "This camera is my eyes. It takes pictures of Mars for you." },
  { id: "arm", label: "Robot arm", center: [100, 258], text: "My arm is like a hand with a microscope. It looks closely at rocks." },
  { id: "antenna", label: "Antenna", center: [314, 126], text: "My antenna is my phone. It sends messages to scientists on Earth." },
];
export const ALL_PARTS = PARTS.map((p) => p.id);

// ---------- helpers ----------
const lerp = (a, b, t) => a + (b - a) * t;
const lerp2 = (p, q, t) => [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];
const pts = (arr) => arr.map((p) => p.join(",")).join(" ");

function Tube({ d, w = 10 }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={C.steel} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

// ---------- parts ----------
function Wheel({ x, y, r = 26, spin = false }) {
  return (
    <g className={spin ? "opp-spin" : ""}>
      <circle cx={x} cy={y} r={r} fill={C.tire} stroke={INK} strokeWidth="3" />
      <circle cx={x} cy={y} r={r * 0.55} fill={C.hub} stroke={INK} strokeWidth="2.5" />
      <circle cx={x} cy={y} r={r * 0.16} fill={C.steel} stroke={INK} strokeWidth="2" />
      {[0, 120, 240].map((a) => (
        <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * r * 0.34} cy={y + Math.sin((a * Math.PI) / 180) * r * 0.34} r="2" fill={INK} />
      ))}
      <path d={`M${x - r * 0.8} ${y - r * 0.35} A${r * 0.9} ${r * 0.9} 0 0 1 ${x - r * 0.3} ${y - r * 0.82}`} fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function WheelSide({ spin = false }) {
  return (
    <g>
      <Tube d="M60 300 L136 300" w={7} />
      <Tube d="M98 300 L150 242" w={9} />
      <Wheel x={60} y={300} spin={spin} />
      <Wheel x={98} y={300} spin={spin} />
      <Wheel x={136} y={300} spin={spin} />
    </g>
  );
}

function Wheels({ both = true, spin = false }) {
  return (
    <g>
      <WheelSide spin={spin} />
      {both && (
        <g transform="translate(400,0) scale(-1,1)">
          <WheelSide spin={spin} />
        </g>
      )}
    </g>
  );
}

function Wing() {
  const O = [[24, 150], [140, 125], [146, 198], [32, 228]];
  const I = [[35, 159], [131, 137], [136, 189], [42, 213]];
  const vlines = [1 / 3, 2 / 3].map((t) => [lerp2(I[0], I[1], t), lerp2(I[3], I[2], t)]);
  const hline = [lerp2(I[0], I[3], 0.5), lerp2(I[1], I[2], 0.5)];
  return (
    <g>
      <polygon points={pts(O)} fill={C.silver} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <polygon points={pts(I)} fill={C.panel} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {vlines.map((l, i) => (
        <line key={i} x1={l[0][0]} y1={l[0][1]} x2={l[1][0]} y2={l[1][1]} stroke={C.panelLine} strokeWidth="1.8" />
      ))}
      <line x1={hline[0][0]} y1={hline[0][1]} x2={hline[1][0]} y2={hline[1][1]} stroke={C.panelLine} strokeWidth="1.8" />
      <polygon points={pts([lerp2(I[0], I[1], 0.1), lerp2(I[0], I[1], 0.38), lerp2(I[3], I[2], 0.22), lerp2(I[3], I[2], 0)])} fill="#fff" opacity=".14" />
    </g>
  );
}

function Panels({ both = true }) {
  return (
    <g>
      <Wing />
      {both && (
        <g transform="translate(400,0) scale(-1,1)">
          <Wing />
        </g>
      )}
    </g>
  );
}

function Body() {
  return (
    <g>
      <rect x="190" y="78" width="20" height="98" rx="10" fill={C.silver} stroke={INK} strokeWidth="3" />
      <rect x="122" y="160" width="156" height="86" rx="36" fill={C.cream} stroke={INK} strokeWidth="3.5" />
      <rect x="136" y="172" width="70" height="12" rx="6" fill="#fff" opacity=".9" />
      <rect x="214" y="176" width="46" height="18" rx="6" fill={C.gold} stroke={INK} strokeWidth="2" />
      <circle cx="237" cy="185" r="4" fill={C.goldHi} />
      {[150, 250].map((x) => (
        <circle key={x} cx={x} cy="228" r="4" fill={C.panel} stroke={INK} strokeWidth="2" />
      ))}
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
    <g className="opp-eye">
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

function Camera({ look, mood, mouthOpen }) {
  return (
    <g>
      <rect x="164" y="38" width="14" height="22" rx="6" fill={C.silver} stroke={INK} strokeWidth="3" />
      <rect x="222" y="38" width="14" height="22" rx="6" fill={C.silver} stroke={INK} strokeWidth="3" />
      <rect x="142" y="48" width="116" height="48" rx="24" fill={C.cream} stroke={INK} strokeWidth="3.5" />
      <ellipse cx="164" cy="78" rx="10" ry="6" fill={C.blush} opacity=".85" />
      <ellipse cx="236" cy="78" rx="10" ry="6" fill={C.blush} opacity=".85" />
      <Brow cx={172} cy={8} mood={mood} side="left" />
      <Brow cx={228} cy={8} mood={mood} side="right" />
      <Eye cx={172} cy={36} look={look} mood={mood} />
      <Eye cx={228} cy={36} look={look} mood={mood} />
      <Mouth open={mouthOpen} mood={mood} />
    </g>
  );
}

function Arm({ raised = false }) {
  return (
    <g
      className={raised ? "opp-arm opp-arm-up" : "opp-arm"}
      style={{ transformOrigin: "142px 226px", transformBox: "view-box" }}
    >
      <Tube d="M142 226 L108 240 L97 270" w={11} />
      <circle cx="96" cy="277" r="16" fill={C.cream} stroke={INK} strokeWidth="3" />
      <circle cx="96" cy="277" r="7" fill={C.panel} stroke={INK} strokeWidth="2" />
      <circle cx="108" cy="240" r="6" fill={C.gold} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

function Antenna({ calling = false }) {
  return (
    <g>
      <Tube d="M262 176 L262 122" w={6} />
      <circle cx="262" cy="118" r="6" fill={C.gold} stroke={INK} strokeWidth="2.5" />
      <Tube d="M258 205 Q292 175 308 140" w={9} />
      <g className={calling ? "opp-dish" : ""} transform="rotate(-25 315 126)">
        <ellipse cx="315" cy="126" rx="25" ry="29" fill={C.silver} stroke={INK} strokeWidth="3" />
        <ellipse cx="315" cy="126" rx="15" ry="18" fill={C.steel} stroke={INK} strokeWidth="2" />
        <circle cx="315" cy="126" r="4" fill={C.gold} stroke={INK} strokeWidth="2" />
      </g>
    </g>
  );
}

const ICON_VB = {
  wheels: "28 234 140 98",
  panels: "16 118 136 114",
  camera: "146 8 108 86",
  arm: "78 218 92 80",
  antenna: "242 90 106 120",
};

export function PartIcon({ part, size = 96, className, style }) {
  const vb = ICON_VB[part];
  if (!vb) return null;
  const [, , w, h] = vb.split(" ").map(Number);
  const look = { x: 0, y: 0 };
  return (
    <svg viewBox={vb} width={size} height={(size * h) / w} className={className} style={style} role="img" aria-label={part}>
      {part === "wheels" && <Wheels both={false} />}
      {part === "panels" && <Panels both={false} />}
      {part === "camera" && <Camera look={look} mood="happy" mouthOpen={0} />}
      {part === "arm" && <Arm />}
      {part === "antenna" && <Antenna />}
    </svg>
  );
}

export default function Opportunity({
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
      const dy = e.clientY - (r.top + r.height * 0.15);
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
        className={`opp-part${interactive ? " opp-int" : ""}${highlight === id ? " opp-hl" : ""}`}
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

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 340"
      width={size}
      className={className}
      style={{ display: "block", maxWidth: "100%", height: "auto", overflow: "visible", ...style }}
      role="img"
      aria-label="Opportunity, the cartoon Mars rover"
    >
      <style>{`
        @keyframes opp-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-5px) } }
        @keyframes opp-bounce { 0%,100% { transform: translateY(0) } 30% { transform: translateY(-28px) } 55% { transform: translateY(0) } 75% { transform: translateY(-12px) } }
        @keyframes opp-shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }
        @keyframes opp-blink { 0%,92%,100% { transform: scaleY(1) } 95% { transform: scaleY(.08) } }
        @keyframes opp-pulse { 0% { transform: scale(.7); opacity: .9 } 100% { transform: scale(2.1); opacity: 0 } }
        @keyframes opp-spin { to { transform: rotate(360deg) } }
        @keyframes opp-dish { 0%,100% { transform: rotate(-25deg) } 50% { transform: rotate(-8deg) } }
        .opp-bob { animation: opp-bob 3.2s ease-in-out infinite; transform-box: fill-box; }
        .opp-pose-bounce { animation: opp-bounce 0.7s ease-in-out infinite; }
        .opp-pose-shake { animation: opp-shake 0.28s linear infinite; }
        .opp-pose-curl { transform: scale(0.92, 0.88); transform-origin: 200px 300px; }
        .opp-pose-droop { transform: translateY(8px) rotate(-2deg); transform-origin: 200px 300px; }
        .opp-eye { transform-box: fill-box; transform-origin: center; animation: opp-blink 5s infinite; }
        .opp-int { cursor: pointer; }
        .opp-int:hover { filter: brightness(1.1); }
        .opp-int:focus-visible { outline: none; filter: drop-shadow(0 0 5px ${C.glow}) drop-shadow(0 0 2px ${C.glow}); }
        .opp-hl { filter: drop-shadow(0 0 7px ${C.glow}) drop-shadow(0 0 14px ${C.glow}); }
        .opp-arm { transition: transform 0.45s ease; transform-box: view-box; transform-origin: 142px 226px; }
        .opp-arm-up { transform: rotate(-42deg); filter: drop-shadow(0 0 8px ${C.glow}); }
        .opp-spin { transform-box: fill-box; transform-origin: center; animation: opp-spin 0.7s linear infinite; }
        .opp-dish { transform-box: fill-box; transform-origin: 315px 126px; animation: opp-dish 1.1s ease-in-out infinite; }
        .opp-ring { transform-box: fill-box; transform-origin: center; animation: opp-pulse 1.6s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .opp-bob, .opp-eye, .opp-ring, .opp-pose-bounce, .opp-pose-shake, .opp-spin, .opp-dish { animation: none; }
          .opp-arm { transition: none; }
        }
      `}</style>

      <ellipse cx="200" cy="334" rx="150" ry="9" fill="#000" opacity=".18" />

      <g
        className={`opp-bob${
          pose === "bounce" ? " opp-pose-bounce" : ""
        }${pose === "shake" ? " opp-pose-shake" : ""}${
          pose === "curl" ? " opp-pose-curl" : ""
        }${pose === "droop" ? " opp-pose-droop" : ""}`}
      >
        {part("panels", labelOf("panels"), <Panels />)}
        {part(
          "wheels",
          labelOf("wheels"),
          <Wheels spin={pose === "roll" || highlight === "wheels"} />
        )}
        <Body />
        {part(
          "arm",
          labelOf("arm"),
          <Arm raised={pose === "arm-up" || pose === "wave" || highlight === "arm"} />
        )}
        {part(
          "antenna",
          labelOf("antenna"),
          <Antenna calling={pose === "call" || highlight === "antenna"} />
        )}
        {part(
          "camera",
          labelOf("camera"),
          <g style={{ transform: pose === "look-up" || pose === "shock" ? "translateY(-6px)" : undefined }}>
            <Camera
              look={
                pose === "look-up"
                  ? { x: look.x, y: -5 }
                  : pose === "yawn"
                    ? { x: look.x * 0.2, y: 4 }
                    : look
              }
              mood={mood}
              mouthOpen={mouthOpen}
            />
          </g>
        )}

        {hotspots &&
          PARTS.filter((p) => assembled.includes(p.id)).map((p) => (
            <g
              key={p.id}
              transform={`translate(${p.center[0]} ${p.center[1]})`}
              style={{ cursor: onPartClick ? "pointer" : "default" }}
              onClick={onPartClick ? () => onPartClick(p.id) : undefined}
            >
              <circle className="opp-ring" r="10" fill={C.glow} />
              <circle r="9" fill={C.glow} stroke={INK} strokeWidth="2.5" />
              <circle r="3" fill={INK} />
            </g>
          ))}
      </g>
    </svg>
  );
}

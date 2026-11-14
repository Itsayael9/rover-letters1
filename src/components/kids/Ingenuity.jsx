"use client";
// Ingenuity.jsx — cartoon Ingenuity helicopter for Rover Letters (Kids mode)
// Same style, same face and same props as Opportunity.jsx. Pure SVG + React.
// Drop it in src/components/kids/.

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
  blade: "#34415f",
  bladeHi: "#6c7fa8",
  pad: "#2c2624",
  mouth: "#c23b4a",
  tongue: "#ff8b9a",
  blush: "#ffb0b8",
  glow: "#ffe27a",
  green: "#6fdc8c",
};

// ---------- Part info (the 7 real parts of Ingenuity, kid-friendly lines) ----------
export const PARTS = [
  { id: "blades", label: "Blades", center: [60, 88], text: "My blades are made of super-light carbon fiber. They spin so fast that they can lift me, even in Mars's thin air!" },
  { id: "antenna", label: "Antenna", center: [270, 14], text: "My antenna is my phone. It talks to Earth through the Perseverance rover and the satellites around Mars." },
  { id: "solar", label: "Solar panel", center: [200, 42], text: "This is my lunch! My solar panel keeps my battery charged with sunlight." },
  { id: "batteries", label: "Batteries", center: [108, 229], text: "My batteries store energy. They give me enough power for one 90-second flight every Martian day." },
  { id: "avionics", label: "Avionics and body", center: [239, 174], text: "This is my brain! It helps me fly and find my way. My body has heaters to keep me warm on freezing Mars nights." },
  { id: "sensors", label: "Sensors and cameras", center: [200, 214], text: "My sensors feel how fast I'm going and in which direction. My cameras are my eyes, so I can see where I fly." },
  { id: "legs", label: "Legs", center: [98, 316], text: "My legs are ultra-light carbon fiber tubes. They help me land softly after every flight." },
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
function Foot({ x, y, rx = 15, ry = 6 }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={C.pad} stroke={INK} strokeWidth="3" />
      <ellipse cx={x - rx * 0.25} cy={y - ry * 0.3} rx={rx * 0.4} ry={ry * 0.3} fill="#fff" opacity=".22" />
    </g>
  );
}

function Legs() {
  return (
    <g>
      {/* back legs (thinner, further away) */}
      <Tube d="M152 280 L128 314" w={6} />
      <Foot x={125} y={320} rx={11} ry={5} />
      <Tube d="M248 280 L272 314" w={6} />
      <Foot x={275} y={320} rx={11} ry={5} />
      {/* front legs */}
      <Tube d="M138 274 L102 318" w={9} />
      <Foot x={97} y={325} />
      <Tube d="M262 274 L298 318" w={9} />
      <Foot x={303} y={325} />
    </g>
  );
}

function Rotor({ cy, mode, dir }) {
  const d = `M14 ${cy} C 70 ${cy - 9}, 150 ${cy - 10}, 200 ${cy - 8} C 250 ${cy - 10}, 330 ${cy - 9}, 386 ${cy} C 330 ${cy + 8}, 250 ${cy + 9}, 200 ${cy + 8} C 150 ${cy + 9}, 70 ${cy + 8}, 14 ${cy} Z`;
  const cls = mode === "fast" ? `ing-rot-fast${dir < 0 ? " ing-rev" : ""}` : mode === "slow" ? `ing-rot-slow${dir < 0 ? " ing-rev" : ""}` : "";
  return (
    <g>
      {mode === "fast" && <ellipse cx="200" cy={cy} rx="188" ry="10" fill="#fff" opacity=".2" />}
      <g className={cls}>
        <path d={d} fill={C.blade} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d={`M30 ${cy - 3} C 90 ${cy - 8}, 150 ${cy - 8}, 186 ${cy - 6}`} fill="none" stroke={C.bladeHi} strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
        <path d={`M214 ${cy - 6} C 250 ${cy - 8}, 310 ${cy - 8}, 370 ${cy - 3}`} fill="none" stroke={C.bladeHi} strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
        {[70, 100, 130, 270, 300, 330].map((x) => (
          <path key={x} d={`M${x} ${cy - 6} L${x + 5} ${cy + 6}`} stroke="#fff" strokeWidth="2" opacity=".14" />
        ))}
        <ellipse cx="22" cy={cy} rx="6" ry="4.5" fill={C.gold} stroke={INK} strokeWidth="2" />
        <ellipse cx="378" cy={cy} rx="6" ry="4.5" fill={C.gold} stroke={INK} strokeWidth="2" />
      </g>
      <ellipse cx="200" cy={cy} rx="17" ry="9" fill={C.gold} stroke={INK} strokeWidth="3" />
      <ellipse cx="197" cy={cy - 2} rx="6" ry="2.5" fill={C.goldHi} />
    </g>
  );
}

function Blades({ mode = "slow" }) {
  return (
    <g>
      <Rotor cy={122} mode={mode} dir={-1} />
      <Rotor cy={86} mode={mode} dir={1} />
    </g>
  );
}

function SolarPanel() {
  const O = [[138, 58], [168, 26], [232, 26], [262, 58]];
  const I = [[148, 54], [172, 32], [228, 32], [252, 54]];
  const vlines = [0.25, 0.5, 0.75].map((t) => [lerp2(I[1], I[2], t), lerp2(I[0], I[3], t)]);
  const hline = [lerp2(I[1], I[0], 0.5), lerp2(I[2], I[3], 0.5)];
  return (
    <g>
      <polygon points={pts(O)} fill={C.silver} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <polygon points={pts(I)} fill={C.panel} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {vlines.map((l, i) => (
        <line key={i} x1={l[0][0]} y1={l[0][1]} x2={l[1][0]} y2={l[1][1]} stroke={C.panelLine} strokeWidth="1.8" />
      ))}
      <line x1={hline[0][0]} y1={hline[0][1]} x2={hline[1][0]} y2={hline[1][1]} stroke={C.panelLine} strokeWidth="1.8" />
      <polygon points={pts([lerp2(I[1], I[2], 0.08), lerp2(I[1], I[2], 0.34), lerp2(I[0], I[3], 0.22), lerp2(I[0], I[3], 0.02)])} fill="#fff" opacity=".16" />
    </g>
  );
}

function Antenna({ calling = false }) {
  return (
    <g>
      <Tube d="M250 46 L267 19" w={5} />
      <circle cx="270" cy="14" r="6.5" fill={C.gold} stroke={INK} strokeWidth="2.5" />
      <circle cx="268" cy="12" r="2" fill={C.goldHi} />
      {calling && (
        <g>
          <circle className="ing-ring" cx="270" cy="14" r="8" fill="none" stroke={C.glow} strokeWidth="3" />
          <circle className="ing-ring ing-ring2" cx="270" cy="14" r="8" fill="none" stroke={C.glow} strokeWidth="3" />
        </g>
      )}
    </g>
  );
}

// Always visible: the mast and the body box
function Core() {
  return (
    <g>
      <rect x="192" y="56" width="16" height="112" rx="8" fill={C.silver} stroke={INK} strokeWidth="3" />
      <ellipse cx="200" cy="104" rx="22" ry="6" fill={C.gold} stroke={INK} strokeWidth="2.5" />
      <ellipse cx="200" cy="148" rx="14" ry="5" fill={C.gold} stroke={INK} strokeWidth="2.5" />
      <rect x="116" y="158" width="168" height="128" rx="36" fill={C.silver} stroke={INK} strokeWidth="3.5" />
      <path d="M134 270 Q200 282 266 270" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" />
      {[138, 262].map((x) => (
        <circle key={x} cx={x} cy="272" r="4" fill={C.panel} stroke={INK} strokeWidth="2" />
      ))}
    </g>
  );
}

function Batteries() {
  return (
    <g>
      <rect x="100" y="196" width="16" height="7" rx="3" fill={C.gold} stroke={INK} strokeWidth="2.5" />
      <rect x="90" y="201" width="36" height="56" rx="10" fill={C.panel} stroke={INK} strokeWidth="3" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="97" y={211 + i * 14} width="22" height="9" rx="4" fill={C.green} stroke={INK} strokeWidth="1.8" />
      ))}
      <path d="M94 208 Q94 204 99 204" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Avionics({ lit = false }) {
  return (
    <g>
      <rect x="132" y="165" width="66" height="14" rx="6" fill={C.gold} stroke={INK} strokeWidth="2.5" />
      <rect x="138" y="169" width="30" height="4" rx="2" fill={C.goldHi} opacity=".9" />
      <circle className={lit ? "ing-led" : ""} cx="208" cy="172" r="4.5" fill={lit ? C.glow : C.green} stroke={INK} strokeWidth="2" />
      <rect x="218" y="164" width="46" height="16" rx="5" fill={C.panel} stroke={INK} strokeWidth="2.5" />
      {[226, 234, 242, 250].map((x) => (
        <line key={x} x1={x} y1="169" x2={x} y2="175" stroke={C.panelLine} strokeWidth="2" strokeLinecap="round" />
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
    <g className="ing-eye">
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

// The face: sensors and cameras (big cartoon eyes on the front of the body)
function Face({ look, mood, mouthOpen }) {
  return (
    <g>
      <rect x="134" y="186" width="132" height="86" rx="30" fill={C.cream} stroke={INK} strokeWidth="3.5" />
      <g transform="translate(200 214) scale(0.84) translate(-200 -36)">
        <ellipse cx="164" cy="78" rx="10" ry="6" fill={C.blush} opacity=".85" />
        <ellipse cx="236" cy="78" rx="10" ry="6" fill={C.blush} opacity=".85" />
        <Brow cx={172} cy={8} mood={mood} side="left" />
        <Brow cx={228} cy={8} mood={mood} side="right" />
        <Eye cx={172} cy={36} look={look} mood={mood} />
        <Eye cx={228} cy={36} look={look} mood={mood} />
        <Mouth open={mouthOpen} mood={mood} />
      </g>
    </g>
  );
}

const ICON_VB = {
  blades: "4 66 206 74",
  antenna: "232 0 64 62",
  solar: "128 18 144 50",
  batteries: "82 190 52 74",
  avionics: "106 150 190 140",
  sensors: "126 178 148 100",
  legs: "74 262 252 72",
};

export function PartIcon({ part, size = 96, className, style }) {
  const vb = ICON_VB[part];
  if (!vb) return null;
  const [, , w, h] = vb.split(" ").map(Number);
  const look = { x: 0, y: 0 };
  return (
    <svg viewBox={vb} width={size} height={(size * h) / w} className={className} style={style} role="img" aria-label={part}>
      {part === "blades" && <Blades mode="off" />}
      {part === "antenna" && <Antenna />}
      {part === "solar" && <SolarPanel />}
      {part === "batteries" && <Batteries />}
      {part === "avionics" && (
        <>
          <Core />
          <Avionics />
        </>
      )}
      {part === "sensors" && <Face look={look} mood="happy" mouthOpen={0} />}
      {part === "legs" && <Legs />}
    </svg>
  );
}

// Poses that make the rotors spin fast / stop. Everything else: slow, lazy spin.
const FAST_POSES = ["fly", "takeoff", "roll", "land"];
const STOP_POSES = ["curl", "droop", "yawn", "sleep"];
// How high Ingenuity floats above the ground for each pose
const LIFT = { takeoff: 50, fly: 64, land: 0 };

export default function Ingenuity({
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
  rotors = "auto", // "auto" | "fast" | "slow" | "off"
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
      const dy = e.clientY - (r.top + r.height * 0.62);
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, dist / 220);
      setLook({ x: (dx / dist) * 6 * k, y: (dy / dist) * 5 * k });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [followPointer]);

  let rotorMode = rotors;
  if (rotorMode === "auto") {
    if (highlight === "blades" || FAST_POSES.includes(pose)) rotorMode = "fast";
    else if (STOP_POSES.includes(pose)) rotorMode = "off";
    else rotorMode = "slow";
  }

  const lift = LIFT[pose] || 0;
  const shadowScale = 1 - lift / 190;

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
        className={`ing-part${interactive ? " ing-int" : ""}${highlight === id ? " ing-hl" : ""}`}
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
      aria-label="Ingenuity, the cartoon Mars helicopter"
    >
      <style>{`
        @keyframes ing-hover { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes ing-bounce { 0%,100% { transform: translateY(0) } 30% { transform: translateY(-28px) } 55% { transform: translateY(0) } 75% { transform: translateY(-12px) } }
        @keyframes ing-shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }
        @keyframes ing-wave { 0%,100% { transform: rotate(-7deg) } 50% { transform: rotate(7deg) } }
        @keyframes ing-sway { 0%,100% { transform: translate(-7px,0) rotate(-3deg) } 50% { transform: translate(7px,-5px) rotate(3deg) } }
        @keyframes ing-blink { 0%,92%,100% { transform: scaleY(1) } 95% { transform: scaleY(.08) } }
        @keyframes ing-pulse { 0% { transform: scale(.7); opacity: .9 } 100% { transform: scale(2.1); opacity: 0 } }
        @keyframes ing-rot { 0%,100% { transform: scaleX(1) } 50% { transform: scaleX(.14) } }
        @keyframes ing-rot-s { 0%,100% { transform: scaleX(1) } 50% { transform: scaleX(.5) } }
        @keyframes ing-led { 0%,100% { opacity: 1 } 50% { opacity: .25 } }
        .ing-bob { animation: ing-hover 3s ease-in-out infinite; transform-box: fill-box; }
        .ing-pose-bounce { animation: ing-bounce 0.7s ease-in-out infinite; }
        .ing-pose-shake { animation: ing-shake 0.28s linear infinite; }
        .ing-pose-wave { animation: ing-wave 0.9s ease-in-out infinite; transform-box: view-box; transform-origin: 200px 210px; }
        .ing-pose-fly { animation: ing-sway 1.8s ease-in-out infinite; transform-box: view-box; transform-origin: 200px 210px; }
        .ing-pose-curl { animation: none; transform: scale(0.92, 0.88); transform-origin: 200px 320px; transform-box: view-box; }
        .ing-pose-droop { animation: none; transform: translateY(8px) rotate(-2deg); transform-origin: 200px 320px; transform-box: view-box; }
        .ing-eye { transform-box: fill-box; transform-origin: center; animation: ing-blink 5s infinite; }
        .ing-int { cursor: pointer; }
        .ing-int:hover { filter: brightness(1.1); }
        .ing-int:focus-visible { outline: none; filter: drop-shadow(0 0 5px ${C.glow}) drop-shadow(0 0 2px ${C.glow}); }
        .ing-hl { filter: drop-shadow(0 0 7px ${C.glow}) drop-shadow(0 0 14px ${C.glow}); }
        .ing-rot-fast { transform-box: fill-box; transform-origin: center; animation: ing-rot 0.2s linear infinite; }
        .ing-rot-slow { transform-box: fill-box; transform-origin: center; animation: ing-rot-s 2.4s ease-in-out infinite; }
        .ing-rev { animation-direction: reverse; animation-delay: -0.07s; }
        .ing-led { animation: ing-led 0.6s ease-in-out infinite; }
        .ing-ring { transform-box: fill-box; transform-origin: center; animation: ing-pulse 1.6s ease-out infinite; }
        .ing-ring2 { animation-delay: .8s; }
        @media (prefers-reduced-motion: reduce) {
          .ing-bob, .ing-eye, .ing-ring, .ing-pose-bounce, .ing-pose-shake, .ing-pose-wave, .ing-pose-fly, .ing-rot-fast, .ing-rot-slow, .ing-led { animation: none; }
        }
      `}</style>

      {/* ground shadow: gets smaller when Ingenuity flies higher */}
      <ellipse
        cx="200"
        cy="334"
        rx="150"
        ry="9"
        fill="#000"
        opacity=".18"
        style={{
          transformBox: "view-box",
          transformOrigin: "200px 334px",
          transform: `scale(${shadowScale})`,
          transition: "transform .9s cubic-bezier(.3,.7,.2,1)",
        }}
      />

      {/* outer group: lifts off the ground (takeoff / fly) and comes back down (land) */}
      <g style={{ transform: `translateY(${-lift}px)`, transition: "transform .9s cubic-bezier(.3,.7,.2,1)" }}>
        <g
          className={`ing-bob${pose === "bounce" ? " ing-pose-bounce" : ""}${
            pose === "shake" ? " ing-pose-shake" : ""
          }${pose === "wave" || pose === "arm-up" ? " ing-pose-wave" : ""}${
            pose === "fly" || pose === "roll" ? " ing-pose-fly" : ""
          }${pose === "curl" ? " ing-pose-curl" : ""}${pose === "droop" ? " ing-pose-droop" : ""}`}
        >
          {part("legs", labelOf("legs"), <Legs />)}
          <Core />
          {part("solar", labelOf("solar"), <SolarPanel />)}
          {part(
            "antenna",
            labelOf("antenna"),
            <Antenna calling={pose === "call" || highlight === "antenna"} />
          )}
          {part("blades", labelOf("blades"), <Blades mode={rotorMode} />)}
          {part("batteries", labelOf("batteries"), <Batteries />)}
          {part("avionics", labelOf("avionics"), <Avionics lit={highlight === "avionics"} />)}
          {part(
            "sensors",
            labelOf("sensors"),
            <g style={{ transform: pose === "look-up" || pose === "shock" ? "translateY(-4px)" : undefined }}>
              <Face
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
                <circle className="ing-ring" r="10" fill={C.glow} />
                <circle r="9" fill={C.glow} stroke={INK} strokeWidth="2.5" />
                <circle r="3" fill={INK} />
              </g>
            ))}
        </g>
      </g>
    </svg>
  );
}

"use client";
// Cartoon Surveyor 3 — v2 lander (quiz / story), redrawn from real photos.

import { useEffect, useId, useRef, useState } from "react";

const NAVY = "#14234f";
const NAVY_LIGHT = "#2b3f87";
const WHITE = "#f4f6fa";
const GRAY = "#c9d0dc";
const GRAY_DARK = "#8a94a8";
const GOLD = "#e8b83a";
const GOLD_DARK = "#b98a14";
const OUTLINE = "#2a3140";
const PANEL = "#7f95bd";
const PANEL_DARK = "#566b97";

const MOODS = {
  happy: { lid: 0, mouth: "smile", eye: 1 },
  surprised: { lid: 0, mouth: "open", eye: 1.15 },
  proud: { lid: 0.12, mouth: "bigsmile", eye: 1 },
  worried: { lid: 0.18, mouth: "wobble", eye: 1.05 },
  sleepy: { lid: 0.62, mouth: "flat", eye: 1 },
};

const EYE_Y = 180;
const EYE_LX = 174;
const EYE_RX = 226;

export const S3_PARTS = [
  { id: "legs", label: "Landing legs" },
  { id: "solar", label: "Solar panel" },
  { id: "camera", label: "TV camera" },
  { id: "scoop", label: "Soil scoop" },
  { id: "antenna", label: "Antenna" },
  { id: "mast", label: "Mast" },
  { id: "body", label: "Electronics" },
];

function mapMood(mood) {
  if (mood === "excited") return "proud";
  if (mood === "curious") return "happy";
  if (mood === "sad") return "worried";
  if (MOODS[mood]) return mood;
  return "happy";
}

function mapPose(pose) {
  if (pose === "dig") return "scoop";
  if (pose === "wave" || pose === "scoop" || pose === "sleep" || pose === "idle") return pose;
  if (pose === "bounce") return "bounce";
  if (pose === "scan") return "scan";
  return "idle";
}

function mapHighlight(highlight) {
  if (highlight === "scoop") return "arm";
  return highlight;
}

function SurveyorArt({
  mood = "happy",
  talking = false,
  pose = "idle",
  highlight = null,
  lookX = 0,
  lookY = 0,
  waveLevel = 0,
  thrusters = false,
  onPartClick,
  uid,
}) {
  const m = pose === "sleep" ? MOODS.sleepy : MOODS[mood] || MOODS.happy;
  const lid = pose === "sleep" ? 0.95 : m.lid;
  const eyeR = 15 * m.eye;

  const glow = (part) =>
    highlight === part ? { filter: `url(#${uid}-glow)` } : undefined;
  const hot = (part) =>
    onPartClick
      ? {
          onClick: () => onPartClick(part),
          style: { cursor: "pointer", ...(glow(part) || {}) },
          role: "button",
          "aria-label": part,
        }
      : { style: glow(part) };

  const mouthPath = {
    smile: "M186 192 Q200 204 214 192",
    bigsmile: "M182 190 Q200 211 218 190 Q200 196 182 190 Z",
    open: "M193 191 Q200 207 207 191 Q200 188 193 191 Z",
    wobble: "M186 197 Q193 190 200 197 Q207 204 214 197",
    flat: "M190 196 L210 196",
  }[m.mouth];

  const poseClass =
    pose === "bounce" ? `sv-${uid}-bounce` : pose === "scan" ? `sv-${uid}-scan` : pose;

  return (
    <g className={`sv-${uid}-${poseClass}`} opacity={pose === "sleep" ? 0.92 : 1}>
      <ellipse cx="200" cy="468" rx="150" ry="14" fill="#000" opacity="0.22" />

      <g className={`sv-${uid}-bob`}>
        <g {...hot("legs")}>
          <line x1="150" y1="330" x2="62" y2="446" stroke={OUTLINE} strokeWidth="16" strokeLinecap="round" />
          <line x1="150" y1="330" x2="62" y2="446" stroke={WHITE} strokeWidth="11" strokeLinecap="round" />
          <line x1="250" y1="330" x2="338" y2="446" stroke={OUTLINE} strokeWidth="16" strokeLinecap="round" />
          <line x1="250" y1="330" x2="338" y2="446" stroke={WHITE} strokeWidth="11" strokeLinecap="round" />
          <line x1="192" y1="340" x2="198" y2="448" stroke={OUTLINE} strokeWidth="20" strokeLinecap="round" />
          <line x1="192" y1="340" x2="198" y2="448" stroke={WHITE} strokeWidth="14" strokeLinecap="round" />
          <line x1="110" y1="392" x2="170" y2="344" stroke={GRAY_DARK} strokeWidth="5" strokeLinecap="round" />
          <line x1="292" y1="392" x2="232" y2="344" stroke={GRAY_DARK} strokeWidth="5" strokeLinecap="round" />
          {[[58, 454], [198, 456], [342, 454]].map(([x, y]) => (
            <g key={x}>
              <ellipse cx={x} cy={y} rx="23" ry="9" fill={OUTLINE} />
              <ellipse cx={x} cy={y - 2} rx="20" ry="7" fill={`url(#${uid}-gold)`} />
            </g>
          ))}
          {(thrusters || pose === "bounce") && (
            <g opacity="0.65">
              {[
                [62, 448],
                [198, 450],
                [342, 448],
              ].map(([x, y], i) => (
                <ellipse key={i} cx={x} cy={y + 10} rx="8" ry={14 + i * 2} fill="#c4b8a8" />
              ))}
            </g>
          )}
        </g>

        <g {...hot("body")}>
          <line x1="92" y1="262" x2="38" y2="168" stroke={OUTLINE} strokeWidth="6" strokeLinecap="round" />
          <line x1="92" y1="262" x2="38" y2="168" stroke={GRAY} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="38" cy="166" r="5" fill={GOLD} stroke={OUTLINE} strokeWidth="2" />
          <line x1="300" y1="300" x2="378" y2="262" stroke={OUTLINE} strokeWidth="6" strokeLinecap="round" />
          <line x1="300" y1="300" x2="378" y2="262" stroke={GRAY} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="380" cy="261" r="5" fill={GOLD} stroke={OUTLINE} strokeWidth="2" />

          <g stroke={OUTLINE} strokeWidth="11" strokeLinecap="round">
            <line x1="104" y1="334" x2="296" y2="334" />
            <line x1="186" y1="262" x2="104" y2="334" />
            <line x1="186" y1="262" x2="296" y2="334" />
            <line x1="146" y1="298" x2="246" y2="298" />
          </g>
          <g stroke={WHITE} strokeWidth="6.5" strokeLinecap="round">
            <line x1="104" y1="334" x2="296" y2="334" />
            <line x1="186" y1="262" x2="104" y2="334" />
            <line x1="186" y1="262" x2="296" y2="334" />
            <line x1="146" y1="298" x2="246" y2="298" />
          </g>
          {[[104, 334], [296, 334], [186, 262]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="8" fill={`url(#${uid}-gold)`} stroke={OUTLINE} strokeWidth="2" />
          ))}

          <rect x="62" y="252" width="96" height="76" rx="14" fill={OUTLINE} />
          <rect x="65" y="255" width="90" height="70" rx="12" fill={`url(#${uid}-body)`} />
          <rect x="65" y="300" width="90" height="13" fill={`url(#${uid}-gold)`} />
          <path d="M65 300 L155 300 M65 313 L155 313" stroke={GOLD_DARK} strokeWidth="1.5" />
          <circle cx="86" cy="276" r="9" fill={NAVY} />
          <circle cx="86" cy="276" r="5" fill="#fff" />
          <circle cx="86" cy="276" r="2.5" fill="#e0422b" />
          {[112, 126, 140].map((x) => (
            <circle key={x} cx={x} cy="276" r="3" fill={GRAY_DARK} />
          ))}

          <ellipse cx="258" cy="306" rx="20" ry="18" fill={OUTLINE} />
          <ellipse cx="258" cy="304" rx="17" ry="15" fill={`url(#${uid}-body)`} />
          <ellipse cx="258" cy="298" rx="12" ry="7" fill={GRAY} />
          <ellipse cx="296" cy="290" rx="16" ry="14" fill={OUTLINE} />
          <ellipse cx="296" cy="288" rx="13" ry="11" fill={`url(#${uid}-gold)`} />
          <ellipse cx="296" cy="284" rx="8" ry="4.5" fill="#ffe9a6" opacity="0.7" />
        </g>

        <g {...hot("mast")}>
          <polygon points="178,52 194,52 198,340 182,340" fill={OUTLINE} />
          <polygon points="181,54 191,54 194.5,338 185.5,338" fill={WHITE} />
        </g>

        <g className={`sv-${uid}-solar`} {...hot("solar")}>
          <polygon points="42,62 178,18 190,92 52,134" fill={OUTLINE} />
          <polygon points="48,64 174,24 184,88 57,127" fill={`url(#${uid}-panel)`} />
          {[1, 2, 3, 4].map((i) => (
            <line
              key={`v${i}`}
              x1={48 + i * 25.2}
              y1={64 - i * 10}
              x2={57 + i * 25.4}
              y2={127 - i * 9.8}
              stroke="#33426b"
              strokeWidth="1.6"
              opacity="0.75"
            />
          ))}
          {[1, 2].map((i) => (
            <line
              key={`h${i}`}
              x1={48 + i * 3}
              y1={64 + i * 21}
              x2={174 + i * 3.3}
              y2={24 + i * 21.2}
              stroke="#33426b"
              strokeWidth="1.6"
              opacity="0.75"
            />
          ))}
          <polygon points="56,68 108,52 104,66 54,82" fill="#fff" opacity="0.22" />
        </g>

        <g className={`sv-${uid}-plate`} {...hot("antenna")}>
          <polygon points="196,26 336,54 322,126 190,96" fill={OUTLINE} />
          <polygon points="201,32 329,58 317,120 196,92" fill={`url(#${uid}-plate)`} />
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={232 + i * 28}
              y1={38 + i * 6}
              x2={228 + i * 28}
              y2={104 + i * 5}
              stroke="#4a62b8"
              strokeWidth="1.3"
              opacity="0.5"
            />
          ))}
          <polygon points="210,38 268,48 262,66 207,54" fill="#fff" opacity="0.14" />
          {talking &&
            [1, 2, 3].map((i) => (
              <circle
                key={i}
                cx="268"
                cy="78"
                r={10 + i * (8 + waveLevel * 10)}
                fill="none"
                stroke="#9ad8ff"
                strokeWidth={2.2 - i * 0.35}
                opacity={0.4 + waveLevel * 0.22 - i * 0.1}
                className={`sv-${uid}-ring`}
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
        </g>

        <g className={pose === "scan" ? `sv-${uid}-cam-pan` : ""} {...hot("camera")}>
          <rect x="184" y="162" width="32" height="20" rx="8" fill={OUTLINE} />
          <rect x="186" y="164" width="28" height="16" rx="6" fill={GRAY} />
          <rect x="148" y="148" width="104" height="76" rx="26" fill={OUTLINE} />
          <rect x="151" y="151" width="98" height="70" rx="24" fill={`url(#${uid}-body)`} />
          <rect x="172" y="138" width="56" height="14" rx="7" fill={GRAY_DARK} />
          <rect x="176" y="140" width="48" height="8" rx="4" fill={GRAY} />

          {[["L", EYE_LX], ["R", EYE_RX]].map(([side, cx]) => (
            <g key={side}>
              <circle cx={cx} cy={EYE_Y} r={eyeR + 3} fill={OUTLINE} />
              <circle cx={cx} cy={EYE_Y} r={eyeR} fill="#fff" />
              <g clipPath={`url(#${uid}-eye${side})`}>
                <circle cx={cx + lookX} cy={EYE_Y + lookY} r={eyeR * 0.52} fill="#1d2b52" />
                <circle cx={cx + lookX} cy={EYE_Y + lookY} r={eyeR * 0.28} fill="#05080f" />
                <circle cx={cx + lookX - 3} cy={EYE_Y + lookY - 4} r={eyeR * 0.17} fill="#fff" />
                <rect
                  x={cx - eyeR - 2}
                  y={EYE_Y - eyeR - 2}
                  width={eyeR * 2 + 4}
                  height={(eyeR * 2 + 4) * lid}
                  fill={GRAY}
                />
                <rect
                  className={`sv-${uid}-blink`}
                  x={cx - eyeR - 2}
                  y={EYE_Y - eyeR - 2}
                  width={eyeR * 2 + 4}
                  height={eyeR * 2 + 4}
                  fill={GRAY}
                />
              </g>
            </g>
          ))}

          {mood === "worried" && pose !== "sleep" && (
            <g stroke={OUTLINE} strokeWidth="3.5" strokeLinecap="round">
              <line x1="159" y1="158" x2="184" y2="164" />
              <line x1="241" y1="158" x2="216" y2="164" />
            </g>
          )}

          <g transform="translate(0 14)">
            <g className={`sv-${uid}-mouth ${talking ? `sv-${uid}-talk` : ""}`}>
              {m.mouth === "open" || m.mouth === "bigsmile" || talking ? (
                <>
                  <path
                    d={talking ? "M188 191 Q200 207 212 191 Q200 187 188 191 Z" : mouthPath}
                    fill="#3a1f2b"
                  />
                  <path d="M193 199 Q200 204 207 199 Q200 196 193 199 Z" fill="#e87a8a" />
                </>
              ) : (
                <path d={mouthPath} fill="none" stroke={OUTLINE} strokeWidth="3.5" strokeLinecap="round" />
              )}
            </g>
          </g>
          <circle cx="162" cy="204" r="6" fill="#ff9aa8" opacity="0.45" />
          <circle cx="238" cy="204" r="6" fill="#ff9aa8" opacity="0.45" />
        </g>

        <g className={`sv-${uid}-arm`} {...hot("arm")}>
          <line x1="286" y1="322" x2="336" y2="346" stroke={OUTLINE} strokeWidth="11" strokeLinecap="round" />
          <line x1="286" y1="322" x2="336" y2="346" stroke={WHITE} strokeWidth="6" strokeLinecap="round" />
          <line x1="336" y1="346" x2="356" y2="392" stroke={OUTLINE} strokeWidth="11" strokeLinecap="round" />
          <line x1="336" y1="346" x2="356" y2="392" stroke={WHITE} strokeWidth="6" strokeLinecap="round" />
          <circle cx="286" cy="322" r="9" fill={`url(#${uid}-gold)`} stroke={OUTLINE} strokeWidth="2" />
          <circle cx="336" cy="346" r="8" fill={`url(#${uid}-gold)`} stroke={OUTLINE} strokeWidth="2" />
          <path
            d="M345 388 Q362 410 385 394 L379 382 Q363 390 353 380 Z"
            fill="#5b9cf5"
            stroke={OUTLINE}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
      </g>

      {pose === "sleep" && (
        <g fill="#fff" fontFamily="ui-rounded, 'Baloo 2', system-ui, sans-serif" fontWeight="800">
          <text className={`sv-${uid}-zzz`} x="308" y="146" fontSize="28">
            z
          </text>
          <text className={`sv-${uid}-zzz`} x="328" y="124" fontSize="22" style={{ animationDelay: "0.7s" }}>
            z
          </text>
          <text className={`sv-${uid}-zzz`} x="344" y="106" fontSize="16" style={{ animationDelay: "1.4s" }}>
            z
          </text>
        </g>
      )}
    </g>
  );
}

export default function Surveyor3({
  mood = "happy",
  talking = false,
  pose = "idle",
  highlight = null,
  lookX: lookXProp,
  lookY: lookYProp,
  onPartClick,
  size = "100%",
  waveLevel = 0,
  thrusters = false,
  followPointer = false,
  className,
  style,
}) {
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef(null);
  const [look, setLook] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!followPointer) {
      setLook({ x: 0, y: 0 });
      return undefined;
    }
    const onMove = (e) => {
      const el = svgRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.34);
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, dist / 220);
      setLook({ x: (dx / dist) * 5 * k, y: (dy / dist) * 4 * k });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [followPointer]);

  const mappedMood = mapMood(mood);
  const mappedPose = mapPose(pose);
  const mappedHighlight = highlight ? mapHighlight(highlight) : null;
  const lookX = lookXProp ?? look.x;
  const lookY = lookYProp ?? look.y;

  const widthStyle =
    typeof size === "number"
      ? { width: size, height: "auto", ...style }
      : { width: size, maxWidth: "100%", height: "auto", ...style };

  return (
    <svg
      ref={svgRef}
      viewBox="-5 0 420 500"
      className={className}
      style={{ display: "block", overflow: "visible", ...widthStyle }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Surveyor 3, cartoon Moon lander"
    >
      <style>{`
        .sv-${uid}-bob { animation: sv-${uid}-bob 3.2s ease-in-out infinite; }
        .sv-${uid}-sleep .sv-${uid}-bob { animation: none; }
        @keyframes sv-${uid}-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        .sv-${uid}-bounce .sv-${uid}-bob { animation: sv-${uid}-land-bounce .75s ease-in-out infinite; }
        @keyframes sv-${uid}-land-bounce { 0%,100% { transform: translateY(0) } 35% { transform: translateY(-16px) } 60% { transform: translateY(2px) } }
        .sv-${uid}-blink { animation: sv-${uid}-blink 4.5s infinite; transform-box: fill-box; transform-origin: top center; }
        @keyframes sv-${uid}-blink { 0%,92%,100% { transform: scaleY(0) } 95% { transform: scaleY(1) } }
        .sv-${uid}-mouth { transform-box: fill-box; transform-origin: center; }
        .sv-${uid}-talk { animation: sv-${uid}-talk .28s ease-in-out infinite alternate; }
        @keyframes sv-${uid}-talk { from { transform: scaleY(.35) } to { transform: scaleY(1.5) } }
        .sv-${uid}-solar { transform-origin: 188px 70px; animation: sv-${uid}-solar 5s ease-in-out infinite; }
        @keyframes sv-${uid}-solar { 0%,100% { transform: rotate(-2.5deg) } 50% { transform: rotate(2deg) } }
        .sv-${uid}-scan .sv-${uid}-solar { animation-duration: 2.6s; }
        .sv-${uid}-plate { transform-origin: 268px 70px; animation: sv-${uid}-plate 4.2s ease-in-out infinite; }
        @keyframes sv-${uid}-plate { 0%,100% { transform: rotate(2deg) } 50% { transform: rotate(-2.5deg) } }
        .sv-${uid}-cam-pan { transform-origin: 200px 186px; animation: sv-${uid}-cam 2.2s ease-in-out infinite; }
        @keyframes sv-${uid}-cam { 0%,100% { transform: rotate(-5deg) } 50% { transform: rotate(7deg) } }
        .sv-${uid}-arm { transform-origin: 286px 322px; transition: transform .5s ease; }
        .sv-${uid}-wave .sv-${uid}-arm { animation: sv-${uid}-wave .9s ease-in-out infinite alternate; }
        @keyframes sv-${uid}-wave { from { transform: rotate(-38deg) } to { transform: rotate(-12deg) } }
        .sv-${uid}-scoop .sv-${uid}-arm { animation: sv-${uid}-scoop 1.8s ease-in-out infinite; }
        @keyframes sv-${uid}-scoop { 0%,100% { transform: rotate(8deg) } 40% { transform: rotate(30deg) } 70% { transform: rotate(16deg) } }
        .sv-${uid}-zzz { animation: sv-${uid}-zzz 2.4s ease-in-out infinite; }
        @keyframes sv-${uid}-zzz { 0% { opacity: 0; transform: translate(0,6px) } 40%,70% { opacity: 1 } 100% { opacity: 0; transform: translate(10px,-14px) } }
        .sv-${uid}-ring { animation: sv-${uid}-ring 1.1s ease-out infinite; }
        @keyframes sv-${uid}-ring { 0% { opacity: 0.55; transform: scale(0.85); } 100% { opacity: 0; transform: scale(1.15); } }
        @media (prefers-reduced-motion: reduce) {
          [class*="sv-${uid}-"] { animation: none !important; }
        }
      `}</style>

      <defs>
        <filter id={`${uid}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={GOLD} floodOpacity="0.95" />
        </filter>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor={GRAY} />
        </linearGradient>
        <linearGradient id={`${uid}-panel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={PANEL} />
          <stop offset="1" stopColor={PANEL_DARK} />
        </linearGradient>
        <linearGradient id={`${uid}-plate`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={NAVY_LIGHT} />
          <stop offset="1" stopColor={NAVY} />
        </linearGradient>
        <radialGradient id={`${uid}-gold`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor={GOLD_DARK} />
        </radialGradient>
        <clipPath id={`${uid}-eyeL`}>
          <circle cx={EYE_LX} cy={EYE_Y} r={18} />
        </clipPath>
        <clipPath id={`${uid}-eyeR`}>
          <circle cx={EYE_RX} cy={EYE_Y} r={18} />
        </clipPath>
      </defs>

      <SurveyorArt
        uid={uid}
        mood={mappedMood}
        talking={talking}
        pose={mappedPose}
        highlight={mappedHighlight}
        lookX={lookX}
        lookY={lookY}
        waveLevel={waveLevel}
        thrusters={thrusters}
        onPartClick={onPartClick}
      />
    </svg>
  );
}
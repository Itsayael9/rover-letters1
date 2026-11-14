"use client";

const INK = "#3a2a24";
const C = {
  cream: "#fffaf3",
  silver: "#e7eef5",
  gold: "#f0c14a",
  panel: "#1d3f78",
  tire: "#2c2624",
};

function Wheel({ x, y, spin }) {
  return (
    <g className={spin ? "ginny-wheel-spin" : ""}>
      <circle cx={x} cy={y} r="5" fill={C.tire} stroke={INK} strokeWidth="1.2" />
      <circle cx={x} cy={y} r="2.2" fill={C.silver} />
    </g>
  );
}

export default function PerseveranceRover({ stuck, reduceMotion, showThanks, className }) {
  const spin = stuck && !reduceMotion;
  return (
    <svg viewBox="0 0 120 80" className={className} role="img" aria-label="Perseverance rover" style={{ width: 100, height: 66 }}>
      {showThanks ? (
        <g transform="translate(60, -8)">
          <rect x="-42" y="-14" width="84" height="22" rx="8" fill="#fff" stroke={INK} strokeWidth="1.5" />
          <text x="0" y="2" textAnchor="middle" fontSize="8" fontWeight="bold" fill={INK}>
            Thanks Ginny!
          </text>
        </g>
      ) : null}
      <text x="60" y="12" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#fff">
        Perseverance
      </text>
      <rect x="28" y="28" width="64" height="28" rx="10" fill={C.cream} stroke={INK} strokeWidth="2" />
      <rect x="48" y="14" width="24" height="18" rx="6" fill={C.silver} stroke={INK} strokeWidth="1.5" />
      <circle cx="54" cy="24" r="5" fill="#fff" stroke={INK} strokeWidth="1.2" />
      <circle cx="66" cy="24" r="5" fill="#fff" stroke={INK} strokeWidth="1.2" />
      <circle cx="54" cy="24" r="2" fill={C.panel} />
      <circle cx="66" cy="24" r="2" fill={C.panel} />
      <rect x="34" y="34" width="18" height="10" rx="3" fill={C.gold} stroke={INK} strokeWidth="1" />
      {[34, 50, 66, 82, 98, 114].map((x, i) => (
        <Wheel key={i} x={x} y={58} spin={spin} />
      ))}
      {stuck && !reduceMotion ? (
        <>
          <circle cx="38" cy="62" r="3" fill="rgba(180,140,90,0.7)" className="ginny-dust-puff" />
          <circle cx="78" cy="64" r="3" fill="rgba(180,140,90,0.7)" className="ginny-dust-puff" />
        </>
      ) : null}
    </svg>
  );
}
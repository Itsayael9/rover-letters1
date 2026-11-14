"use client";

export default function RoverCharacter({ speaking }) {
  return (
    <svg
      viewBox="0 0 240 200"
      role="img"
      aria-label="Cartoon of the Mars rover Opportunity"
      className="mx-auto w-full max-w-[260px]"
    >
      {/* solar panel */}
      <rect x="20" y="86" width="200" height="14" rx="4" fill="#f5b700" />
      <path d="M70 86v14M120 86v14M170 86v14" stroke="#b98400" strokeWidth="2" />

      {/* body */}
      <rect x="62" y="100" width="116" height="48" rx="12" fill="#e9edf5" />

      {/* mast + head */}
      <rect x="116" y="60" width="8" height="28" fill="#c9d1e3" />
      <rect x="82" y="12" width="76" height="52" rx="16" fill="#f3f5f9" stroke="#9aa6c1" strokeWidth="3" />

      {/* eyes */}
      <circle cx="104" cy="34" r="9" fill="#fff" stroke="#9aa6c1" strokeWidth="2" />
      <circle cx="136" cy="34" r="9" fill="#fff" stroke="#9aa6c1" strokeWidth="2" />
      <circle cx="105" cy="35" r="4" fill="#1f2757" />
      <circle cx="137" cy="35" r="4" fill="#1f2757" />

      {/* cheeks */}
      <circle cx="92" cy="50" r="4" fill="#ffb3a0" opacity="0.7" />
      <circle cx="148" cy="50" r="4" fill="#ffb3a0" opacity="0.7" />

      {/* mouth: moves only while speaking */}
      <ellipse cx="120" cy="50" rx="8" ry="3" fill="#c8552f">
        {speaking && (
          <animate
            attributeName="ry"
            values="3;8;3;6;3"
            dur="0.5s"
            repeatCount="indefinite"
          />
        )}
      </ellipse>

      {/* wheels */}
      {[78, 120, 162].map((x) => (
        <g key={x}>
          <circle cx={x} cy="162" r="17" fill="#141a3c" stroke="#9aa6c1" strokeWidth="4" />
          <circle cx={x} cy="162" r="5" fill="#9aa6c1" />
        </g>
      ))}
    </svg>
  );
}
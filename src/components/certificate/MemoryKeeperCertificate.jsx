"use client";

import { forwardRef } from "react";
import "./certificate.css";

function MarsCorner() {
  return (
    <svg className="mk-planet mk-planet--mars" viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="36" fill="#c45a3a" />
      <circle cx="28" cy="30" r="6" fill="#8b3a28" opacity="0.5" />
      <circle cx="52" cy="48" r="8" fill="#8b3a28" opacity="0.45" />
      <circle cx="44" cy="24" r="4" fill="#a04832" opacity="0.4" />
    </svg>
  );
}

function MoonCorner() {
  return (
    <svg className="mk-planet mk-planet--moon" viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="36" fill="#b8bcc4" />
      <circle cx="30" cy="32" r="7" fill="#8a9099" opacity="0.55" />
      <circle cx="50" cy="46" r="5" fill="#8a9099" opacity="0.5" />
      <circle cx="46" cy="28" r="3" fill="#9aa0a8" opacity="0.45" />
    </svg>
  );
}

function GoldStar({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="#d4a84b"
        d="M8 1.2 9.6 5.8l4.9.4-3.7 3.2 1.2 4.8L8 11.8l-3.9 2.4 1.2-4.8-3.7-3.2 4.9-.4L8 1.2z"
      />
    </svg>
  );
}

/**
 * @param {object} props
 * @param {string} [props.childName]
 * @param {{ id: string, name: string }[]} [props.machines]
 * @param {"preview" | "personal"} [props.mode]
 */
const MemoryKeeperCertificate = forwardRef(function MemoryKeeperCertificate(
  { childName = "", machines = [], mode = "preview" },
  ref
) {
  const personal = mode === "personal" && childName.trim();
  const showMachines = personal
    ? machines.filter((m) => m?.name)
    : [];
  const slotCount = Math.max(machines.length, 5);

  return (
    <div className="mk-cert" ref={ref} role="img" aria-label="Memory Keeper Certificate">
      <div className="mk-cert-outer">
        <div className="mk-cert-inner">
          <GoldStar className="mk-star mk-star--tl" />
          <GoldStar className="mk-star mk-star--tr" />
          <GoldStar className="mk-star mk-star--bl" />
          <GoldStar className="mk-star mk-star--br" />
          <MarsCorner />
          <MoonCorner />

          <p className="mk-kicker">
            <span className="mk-kicker-star" aria-hidden="true">
              ★
            </span>{" "}
            ROVER LETTERS{" "}
            <span className="mk-kicker-star" aria-hidden="true">
              ★
            </span>
          </p>

          <h1 className="mk-title">Memory Keeper Certificate</h1>

          <p className="mk-given">This certificate is proudly given to</p>

          {personal ? (
            <p className="mk-name">{childName.trim()}</p>
          ) : (
            <div className="mk-name-line" aria-hidden="true">
              <span className="mk-name-placeholder">Your name</span>
            </div>
          )}

          <div className="mk-name-rule" aria-hidden="true">
            <span className="mk-name-rule-star">★</span>
          </div>

          <p className="mk-machines-lead">met and remembered these machines:</p>

          <ul className={`mk-machines${personal ? " is-filled" : ""}`}>
            {personal
              ? showMachines.map((m) => (
                  <li key={m.id}>
                    <GoldStar className="mk-machines-star" />
                    <span>{m.name}</span>
                  </li>
                ))
              : Array.from({ length: slotCount }, (_, i) => (
                  <li key={i} className="mk-machines-slot">
                    <GoldStar className="mk-machines-star" />
                    <span className="mk-slot-line" />
                  </li>
                ))}
          </ul>

          <p className="mk-quote">
            <span aria-hidden="true">★ </span>
            Abandoned, yes. Forgotten? Never.
            <span aria-hidden="true"> ★</span>
          </p>

          <p className="mk-disclaimer">Independent educational project. Not affiliated with NASA.</p>
        </div>
      </div>
    </div>
  );
});

export default MemoryKeeperCertificate;
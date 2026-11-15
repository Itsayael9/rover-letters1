"use client";

import { forwardRef, useId } from "react";
import { CERT_EXPORT_FONT_PX } from "@/components/certificate/certConstants";
import { partitionMachinesForCert } from "@/components/certificate/certificateLayout";
import "./certificate.css";

function MarsIllustration({ uid }) {
  const id = uid || "mars";
  return (
    <svg className="mk-planet mk-planet--mars" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-mars-sphere`} cx="35%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#e89068" />
          <stop offset="45%" stopColor="#c45a3a" />
          <stop offset="100%" stopColor="#7a2e1c" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="54" fill={`url(#${id}-mars-sphere)`} />
      <ellipse cx="44" cy="48" rx="12" ry="9" fill="#8b3a28" opacity="0.45" />
      <ellipse cx="72" cy="58" rx="16" ry="11" fill="#6b2818" opacity="0.4" />
      <circle cx="78" cy="38" r="6" fill="#8b3a28" opacity="0.35" />
      <circle cx="38" cy="72" r="8" fill="#6b2818" opacity="0.38" />
      <circle cx="58" cy="34" r="4" fill="#a04832" opacity="0.35" />
      <ellipse cx="60" cy="98" rx="50" ry="8" fill="#000" opacity="0.12" />
    </svg>
  );
}

function MoonIllustration({ uid }) {
  const id = uid || "moon";
  return (
    <svg className="mk-planet mk-planet--moon" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-moon-sphere`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#e8eaee" />
          <stop offset="50%" stopColor="#b8bcc4" />
          <stop offset="100%" stopColor="#7a808a" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill={`url(#${id}-moon-sphere)`} />
      <circle cx="42" cy="44" r="10" fill="#8a9099" opacity="0.5" />
      <circle cx="68" cy="52" r="14" fill="#8a9099" opacity="0.42" />
      <circle cx="54" cy="70" r="8" fill="#8a9099" opacity="0.38" />
      <circle cx="76" cy="36" r="5" fill="#9aa0a8" opacity="0.4" />
      <ellipse cx="60" cy="98" rx="48" ry="7" fill="#000" opacity="0.1" />
    </svg>
  );
}

function GoldStar({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path
        fill="#d4a84b"
        d="M10 1.5 12.2 7l6.3.5-4.8 4.2 1.6 6.2L10 14.8l-5.3 3.1 1.6-6.2L1.5 7.5l6.3-.5L10 1.5z"
      />
    </svg>
  );
}

function LaurelSprig({ flip }) {
  return (
    <svg
      className="mk-laurel"
      viewBox="0 0 56 72"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        fill="none"
        stroke="#c9a24d"
        strokeWidth="2.2"
        strokeLinecap="round"
        d="M42 6c-16 6-22 20-22 36M14 14c10 8 14 20 14 34"
      />
      <ellipse cx="36" cy="16" rx="7" ry="12" fill="#d4a84b" opacity="0.65" transform="rotate(-28 36 16)" />
      <ellipse cx="28" cy="32" rx="6" ry="11" fill="#d4a84b" opacity="0.58" transform="rotate(-18 28 32)" />
      <ellipse cx="20" cy="48" rx="6" ry="10" fill="#d4a84b" opacity="0.52" transform="rotate(-10 20 48)" />
      <ellipse cx="14" cy="62" rx="5" ry="8" fill="#c9a24d" opacity="0.48" transform="rotate(-5 14 62)" />
    </svg>
  );
}

function MartianLandscape({ uid }) {
  const sky = `mk-sky-${uid}`;
  const duneA = `mk-dune-a-${uid}`;
  const duneB = `mk-dune-b-${uid}`;
  const dust = `mk-dust-${uid}`;
  return (
    <svg className="mk-landscape" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e8d4" stopOpacity="0" />
          <stop offset="25%" stopColor="#f5dcc8" stopOpacity="0.6" />
          <stop offset="55%" stopColor="#e8a878" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c45a3a" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id={duneA} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e07850" />
          <stop offset="100%" stopColor="#9e4028" />
        </linearGradient>
        <linearGradient id={duneB} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d06848" />
          <stop offset="100%" stopColor="#7a3018" />
        </linearGradient>
        <linearGradient id={dust} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f3e8d4" stopOpacity="0" />
          <stop offset="50%" stopColor="#f0d0a8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f3e8d4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="160" fill={`url(#${sky})`} />
      <rect width="1200" height="55" y="20" fill={`url(#${dust})`} opacity="0.7" />
      <path
        fill={`url(#${duneA})`}
        d="M0 95 Q180 55 340 88 T680 72 T1020 82 T1200 65 L1200 160 L0 160 Z"
      />
      <path
        fill={`url(#${duneB})`}
        opacity="0.85"
        d="M0 115 Q220 88 460 108 T900 98 T1200 92 L1200 160 L0 160 Z"
      />
      <ellipse cx="200" cy="108" rx="42" ry="18" fill="#6b2818" opacity="0.5" />
      <ellipse cx="520" cy="102" rx="55" ry="22" fill="#6b2818" opacity="0.45" />
      <ellipse cx="880" cy="98" rx="48" ry="20" fill="#6b2818" opacity="0.48" />
      <path fill="#5a2214" d="M140 72 L168 108 L118 108 Z" />
      <path fill="#5a2214" d="M720 58 L752 102 L696 102 Z" />
      <path fill="#5a2214" d="M1020 68 L1048 100 L996 100 Z" />
      <circle cx="380" cy="78" r="4" fill="#8b3a28" opacity="0.5" />
      <circle cx="620" cy="70" r="3" fill="#8b3a28" opacity="0.45" />
    </svg>
  );
}

function MachineColumns({ personal, left, right, rows, slotCount }) {
  if (personal) {
    return (
      <div className="mk-machines-cols">
        <ul className="mk-machines-col">
          {left.map((m) => (
            <li key={m.id}>
              <GoldStar className="mk-machines-star" />
              <span>{m.name}</span>
            </li>
          ))}
        </ul>
        <ul className="mk-machines-col">
          {right.map((m) => (
            <li key={m.id}>
              <GoldStar className="mk-machines-star" />
              <span>{m.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const half = Math.ceil(slotCount / 2);
  return (
    <div className="mk-machines-cols">
      <ul className="mk-machines-col">
        {Array.from({ length: half }, (_, i) => (
          <li key={`l-${i}`} className="mk-machines-slot">
            <GoldStar className="mk-machines-star" />
            <span className="mk-slot-line" />
          </li>
        ))}
      </ul>
      <ul className="mk-machines-col">
        {Array.from({ length: slotCount - half }, (_, i) => (
          <li key={`r-${i}`} className="mk-machines-slot">
            <GoldStar className="mk-machines-star" />
            <span className="mk-slot-line" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.childName]
 * @param {{ id: string, name: string }[]} [props.machines]
 * @param {"preview" | "personal"} [props.mode]
 * @param {boolean} [props.exportRender]
 * @param {boolean} [props.preview]
 * @param {number} [props.previewFontPx] — scales entire cert in modal (no CSS transform)
 */
const MemoryKeeperCertificate = forwardRef(function MemoryKeeperCertificate(
  {
    childName = "",
    machines = [],
    mode = "preview",
    exportRender = false,
    preview = false,
    previewFontPx,
  },
  ref
) {
  const personal = mode === "personal" && childName.trim();
  const showMachines = personal ? machines.filter((m) => m?.name) : [];
  const slotCount = Math.max(machines.length, 5);
  const trimmedName = childName.trim();
  const nameSizeClass =
    trimmedName.length > 28 ? "mk-name--sm" : trimmedName.length > 18 ? "mk-name--md" : "";
  const uid = useId().replace(/:/g, "");
  const { left, right, rows } = partitionMachinesForCert(
    personal ? showMachines : machines.slice(0, slotCount)
  );

  const rootClass = ["mk-cert", exportRender ? "mk-cert--export" : "", preview ? "mk-cert--preview" : ""]
    .filter(Boolean)
    .join(" ");

  let rootStyle;
  if (exportRender) {
    rootStyle = { fontSize: `${CERT_EXPORT_FONT_PX}px` };
  } else if (preview && previewFontPx) {
    rootStyle = { fontSize: `${previewFontPx}px` };
  }

  return (
    <div
      className={rootClass}
      ref={ref}
      role="img"
      aria-label="Memory Keeper Certificate"
      style={rootStyle}
    >
      <div className="mk-cert-outer">
        <div className="mk-cert-gold-frame" aria-hidden="true" />
        <div className="mk-cert-inner">
          <GoldStar className="mk-star mk-star--a" />
          <GoldStar className="mk-star mk-star--b" />
          <GoldStar className="mk-star mk-star--c" />
          <GoldStar className="mk-star mk-star--d" />
          <GoldStar className="mk-star mk-star--e" />
          <GoldStar className="mk-star mk-star--f" />

          <MarsIllustration uid={`${uid}-mars`} />
          <MoonIllustration uid={`${uid}-moon`} />

          <div className="mk-cert-main">
            <p className="mk-kicker">
              <span className="mk-kicker-star" aria-hidden="true">
                ★
              </span>{" "}
              ROVER LETTERS{" "}
              <span className="mk-kicker-star" aria-hidden="true">
                ★
              </span>
            </p>

            <div className="mk-title-banner">
              <LaurelSprig />
              <h1 className="mk-title">Memory Keeper Certificate</h1>
              <LaurelSprig flip />
            </div>

            <p className="mk-given">This certificate is proudly given to</p>

            {personal ? (
              <p className={`mk-name ${nameSizeClass}`.trim()}>{trimmedName}</p>
            ) : (
              <div className="mk-name-line" aria-hidden="true">
                <span className="mk-name-placeholder">Your name</span>
              </div>
            )}

            <div className="mk-name-rule" aria-hidden="true">
              <span className="mk-name-rule-star">★</span>
            </div>

            <p className="mk-machines-lead">met and remembered these machines:</p>

            <MachineColumns
              personal={personal}
              left={left}
              right={right}
              rows={rows}
              slotCount={slotCount}
            />
          </div>

          <footer className="mk-cert-footer">
            <MartianLandscape uid={uid} />
            <div className="mk-quote-wrap">
              <div className="mk-gold-rule" aria-hidden="true">
                <span className="mk-gold-rule-star">★</span>
              </div>
              <p className="mk-quote">
                Abandoned, yes. Forgotten? <em>Never.</em>
              </p>
            </div>
            <div className="mk-disclaimer-row">
              <span className="mk-disclaimer-line" aria-hidden="true" />
              <p className="mk-disclaimer">Independent educational project. Not affiliated with NASA.</p>
              <span className="mk-disclaimer-line" aria-hidden="true" />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
});

export default MemoryKeeperCertificate;
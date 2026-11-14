"use client";

import { useState } from "react";

/**
 * Museum specimen viewer — shared by Surveyor 3 finale and future Apollo 12.
 */
export default function ArtifactInspector({ artifacts = [], themeColor = "#9ad8ff", onClose, onDone }) {
  const [index, setIndex] = useState(0);
  const [era, setEra] = useState("recovered");
  const item = artifacts[index];

  if (!item) return null;

  const stateText = era === "launch" ? item.launchState : item.recoveredState;

  return (
    <div className="s3-artifact-inspector">
      <header className="s3-artifact-head">
        <div>
          <p className="s3-artifact-kicker">Lunar time capsule</p>
          <h2>{item.name}</h2>
          <p className="s3-artifact-nasa">{item.nasaId}</p>
        </div>
        <div className="s3-artifact-era" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={era === "launch"}
            className={era === "launch" ? "is-on" : ""}
            onClick={() => setEra("launch")}
          >
            1967 Launch
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={era === "recovered"}
            className={era === "recovered" ? "is-on" : ""}
            onClick={() => setEra("recovered")}
          >
            1969 Recovery
          </button>
        </div>
      </header>

      <div className="s3-artifact-body">
        <div className="s3-artifact-visual">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div className={`s3-artifact-fallback${item.image ? " hidden" : ""}`} aria-hidden={!!item.image}>
            <svg viewBox="0 0 120 80" className="s3-artifact-schematic">
              <rect width="120" height="80" rx="8" fill="#1e293b" stroke={themeColor} strokeWidth="2" />
              <text x="60" y="44" textAnchor="middle" fill={themeColor} fontSize="11" fontFamily="system-ui">
                NASA specimen
              </text>
            </svg>
          </div>
          <p className="s3-artifact-mass">{item.mass}</p>
        </div>

        <div className="s3-artifact-copy">
          <p>{stateText}</p>
          <p className="s3-artifact-museum">
            <span>On display</span>
            {item.museumLocation}
          </p>
        </div>
      </div>

      <footer className="s3-artifact-foot">
        <div className="s3-artifact-dots">
          {artifacts.map((a, i) => (
            <button
              key={a.id}
              type="button"
              aria-label={a.name}
              className={i === index ? "is-on" : ""}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <div className="s3-artifact-actions">
          {onClose ? (
            <button type="button" className="kids-btn kids-btn-ghost" onClick={onClose}>
              Back
            </button>
          ) : null}
          {index < artifacts.length - 1 ? (
            <button
              type="button"
              className="kids-btn kids-btn-primary"
              style={{ background: themeColor, borderColor: "#1a2030" }}
              onClick={() => setIndex((i) => i + 1)}
            >
              Next artifact
            </button>
          ) : (
            <button
              type="button"
              className="kids-btn kids-btn-primary"
              style={{ background: themeColor, borderColor: "#1a2030" }}
              onClick={onDone}
            >
              Finish inspection
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
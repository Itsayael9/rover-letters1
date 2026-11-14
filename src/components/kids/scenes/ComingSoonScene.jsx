"use client";

import { t } from "@/data/kids/text";
import { useKidsProgress } from "@/context/KidsProgressContext";

export default function ComingSoonScene({ machine, onExit }) {
  const { stars, badges } = useKidsProgress();

  return (
    <div className="kids-scene kids-scene-end">
      <div className="kids-end-card">
        <p className="kids-end-emoji" aria-hidden="true">
          🚀⭐
        </p>
        <h2>{t(machine.endTitle)}</h2>
        <p>{t(machine.endBody)}</p>
        <p className="kids-end-stars" aria-label={`${stars} stars earned`}>
          {"⭐".repeat(Math.max(stars, 0)) || "⭐"}{" "}
          <span>
            {stars} star{stars === 1 ? "" : "s"}
          </span>
        </p>
        {badges.length > 0 && (
          <p className="kids-end-badges">
            Badge: {badges.map((b) => `🏅 ${b}`).join(" · ")}
          </p>
        )}
        <button type="button" className="kids-btn kids-btn-primary" onClick={onExit}>
          Back to Mars
        </button>
      </div>
    </div>
  );
}

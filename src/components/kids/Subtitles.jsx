"use client";

import { t } from "@/data/kids/text";

export default function Subtitles({ lines = [], lineIndex = -1, fallback = "" }) {
  if (!lines.length && !fallback) return null;

  if (!lines.length) {
    return (
      <p className="kids-subtitles" aria-live="polite">
        {t(fallback)}
      </p>
    );
  }

  return (
    <div className="kids-subtitles" aria-live="polite">
      {lines.map((line, i) => (
        <p
          key={line.id ?? i}
          className={`kids-subtitles-line${i === lineIndex ? " is-current" : ""}`}
        >
          {t(line.text)}
        </p>
      ))}
    </div>
  );
}

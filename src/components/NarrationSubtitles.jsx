"use client";

import { useNarration } from "@/context/NarrationProvider";

/** Bottom captions synced to the narration script. */
export default function NarrationSubtitles({ visible }) {
  const { active, lineIndex, script } = useNarration();

  if (!visible || !active || lineIndex < 0) return null;

  const line = script[lineIndex];
  if (!line) return null;

  return (
    <div className="narration-subtitles" role="status" aria-live="polite">
      <p className="narration-subtitles-line is-current">{line.text}</p>
    </div>
  );
}

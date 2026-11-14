"use client";

import { useAudioPrefs } from "@/context/AudioPrefsContext";

export default function SfxToggle({ className = "" }) {
  const { sfxEnabled, toggleSfx } = useAudioPrefs();

  return (
    <button
      type="button"
      onClick={toggleSfx}
      aria-pressed={sfxEnabled}
      aria-label={sfxEnabled ? "Mute sound effects" : "Unmute sound effects"}
      className={`rounded-full border border-white/25 bg-black/65 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur transition hover:bg-black/85 ${className}`}
    >
      {sfxEnabled ? "Sound on" : "Muted"}
    </button>
  );
}
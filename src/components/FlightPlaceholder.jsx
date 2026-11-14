"use client";

import { useNarration } from "@/context/NarrationProvider";

/** Rocket flight will replace this screen later. */
export default function FlightPlaceholder({ onSkipToHub }) {
  const { skip } = useNarration();

  const handleSkip = () => {
    skip();
    onSkipToHub?.();
  };

  return (
    <div className="flight-placeholder">
      <p className="flight-placeholder-title">Rocket flight coming next</p>
      <button type="button" className="entrance-ctrl flight-skip" onClick={handleSkip} aria-label="Skip to museum">
        Skip
      </button>
    </div>
  );
}

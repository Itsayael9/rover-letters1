"use client";

/**
 * A dark overlay with a hole that follows the pointer.
 * x and y are 0..1 (left/top of the screen).
 */
export default function Flashlight({ x, y }) {
  const hole = `radial-gradient(
    circle 22vmax at ${x * 100}% ${y * 100}%,
    transparent 0%,
    rgba(0, 0, 0, 0.18) 18%,
    rgba(0, 0, 0, 0.72) 38%,
    rgba(0, 0, 0, 0.94) 58%
  )`;

  return (
    <div
      className="hangar-flashlight pointer-events-none absolute inset-0 z-10"
      style={{ background: hole }}
      aria-hidden="true"
    />
  );
}

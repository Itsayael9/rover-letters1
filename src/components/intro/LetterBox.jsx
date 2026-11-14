"use client";

/**
 * The rusty metal chest on the hangar floor.
 * When the flashlight is near it, it glows.
 * Click it to open the lid. A shine bursts out.
 */
export default function LetterBox({
  lightX,
  lightY,
  opened,
  onOpen,
}) {
  const boxX = 0.5;
  const boxY = 0.78;
  const dx = lightX - boxX;
  const dy = lightY - boxY;
  const near = dx * dx + dy * dy < 0.055;

  return (
    <div className="pointer-events-auto absolute bottom-[7%] left-1/2 z-[5] w-[min(52vw,340px)] -translate-x-1/2">
      <button
        type="button"
        className={`letter-chest ${near ? "is-lit" : ""} ${opened ? "is-open" : ""}`}
        onClick={() => {
          if (!opened) onOpen?.();
        }}
        aria-label="Open the box"
      >
        {/* Bottom of the chest stays still. */}
        <span className="chest-body">
          <img src="/intro/box.png" alt="" draggable="false" />
        </span>
        {/* Lid rotates back when opened. */}
        <span className="chest-lid">
          <img src="/intro/box.png" alt="" draggable="false" />
        </span>
        {opened && <span className="chest-shine" />}
        {opened && (
          <span className="chest-puff" aria-hidden="true">
            <i /><i /><i /><i /><i /><i />
          </span>
        )}
      </button>
    </div>
  );
}

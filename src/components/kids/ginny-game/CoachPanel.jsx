"use client";

import Ingenuity from "@/components/kids/Ingenuity";
import { UI, pickText } from "@/data/ginnyGame";

export default function CoachPanel({
  message,
  talking,
  mood = "happy",
  pose = "fly",
  primaryLabel,
  onPrimary,
  primaryDisabled,
  onShowMe,
  showHand,
  onBackToStory,
}) {
  return (
    <footer className="ginny-coach shrink-0 border-t-2 border-[#111] bg-[#fffaf3] px-3 py-3 text-[#3a2a24]">
      <div className="mx-auto flex w-full max-w-lg gap-3">
        <div className="ginny-coach-face w-20 shrink-0">
          <Ingenuity talking={talking} mood={mood} pose={pose} size="80px" followPointer={false} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="ginny-coach-msg text-base font-semibold leading-snug" aria-live="polite">
            {message}
          </p>
          <div className="ginny-coach-actions mt-2 flex flex-wrap items-center gap-2">
            {primaryLabel && onPrimary ? (
              <button
                type="button"
                className={`kids-btn kids-btn-primary min-h-12 px-4${showHand ? " ginny-coach-pulse" : ""}`}
                disabled={primaryDisabled}
                onClick={onPrimary}
              >
                {primaryLabel}
              </button>
            ) : null}
            {onShowMe ? (
              <button type="button" className="kids-btn kids-btn-ghost min-h-12 text-sm" onClick={onShowMe}>
                {pickText(UI.showMe)}
              </button>
            ) : null}
          </div>
          {onBackToStory ? (
            <button
              type="button"
              className="ginny-coach-back mt-2 text-sm font-semibold text-[#0B3D91] underline"
              onClick={onBackToStory}
            >
              {pickText(UI.backToStory)}
            </button>
          ) : null}
        </div>
      </div>
      {showHand ? (
        <span className="ginny-pointing-hand" aria-hidden>
          👆
        </span>
      ) : null}
    </footer>
  );
}
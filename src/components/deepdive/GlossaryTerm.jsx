"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { glossaryEntry } from "@/data/glossary";

const POPUP_MARGIN = 8;
const POPUP_MAX_W = 280;

function clampPopup(anchorRect, popupW, popupH) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = anchorRect.left + anchorRect.width / 2 - popupW / 2;
  left = Math.max(POPUP_MARGIN, Math.min(left, vw - popupW - POPUP_MARGIN));

  let top = anchorRect.bottom + POPUP_MARGIN;
  if (top + popupH > vh - POPUP_MARGIN) {
    top = anchorRect.top - popupH - POPUP_MARGIN;
  }
  top = Math.max(POPUP_MARGIN, Math.min(top, vh - popupH - POPUP_MARGIN));
  return { left, top };
}

export default function GlossaryTerm({ termKey, emphasize = true, children }) {
  const entry = glossaryEntry(termKey);
  const label = children ?? entry?.label ?? termKey;
  const anchorRef = useRef(null);
  const popupRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  const [mounted, setMounted] = useState(false);
  const tipId = useId();
  const closeTimer = useRef(0);

  useEffect(() => setMounted(true), []);

  const reposition = useCallback(() => {
    const anchor = anchorRef.current;
    const popup = popupRef.current;
    if (!anchor || !popup) return;
    const ar = anchor.getBoundingClientRect();
    const pr = popup.getBoundingClientRect();
    setCoords(clampPopup(ar, pr.width || POPUP_MAX_W, pr.height || 80));
  }, []);

  const show = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    if (!entry) return;
    setOpen(true);
    requestAnimationFrame(reposition);
  }, [entry, reposition]);

  const hide = useCallback(() => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  }, []);

  const hideNow = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    reposition();
    const onScroll = () => reposition();
    const onResize = () => reposition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") hideNow();
    };
    const onPointerDown = (e) => {
      if (anchorRef.current?.contains(e.target)) return;
      if (popupRef.current?.contains(e.target)) return;
      hideNow();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, hideNow]);

  if (!entry) {
    return <span>{label}</span>;
  }

  if (!emphasize) {
    return <span>{label}</span>;
  }

  const popup =
    open && mounted
      ? createPortal(
          <div
            ref={popupRef}
            id={tipId}
            role="tooltip"
            className="mission-glossary-popup"
            style={{ left: coords.left, top: coords.top, maxWidth: POPUP_MAX_W }}
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            <span className="mission-glossary-kicker">Dictionary</span>
            <strong>{entry.label}</strong>
            <p>{entry.definition}</p>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        ref={anchorRef}
        className="mission-glossary-term"
        aria-describedby={open ? tipId : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={(e) => {
          e.preventDefault();
          if (open) hideNow();
          else show();
        }}
      >
        {label}
      </button>
      {popup}
    </>
  );
}

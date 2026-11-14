"use client";

import { useEffect, useState } from "react";
import { t } from "@/data/kids/text";

/** Framed NASA photo with crossfade after preload; never crashes on missing files. */
export default function MediaPanel({ media }) {
  const [display, setDisplay] = useState(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!media?.src) {
      setDisplay(null);
      setReady(false);
      setFailed(false);
      return undefined;
    }

    let alive = true;
    setDisplay(media);
    setReady(false);
    setFailed(false);

    const img = new window.Image();
    img.onload = () => {
      if (alive) setReady(true);
    };
    img.onerror = () => {
      if (alive) {
        setFailed(true);
        setReady(true);
      }
    };
    img.src = media.src;

    return () => {
      alive = false;
    };
  }, [media?.src]);

  const caption = display ? t(display.caption) : "";
  const credit = display ? t(display.credit) : "";
  const alt = display ? t(display.alt) : "NASA photo";

  const visible = Boolean(display && ready);

  return (
    <aside
      className={`kids-media${visible && !failed ? " is-in" : display ? " is-loading" : ""}`}
      aria-live="polite"
    >
      <div className="kids-tv">
        <div className="kids-tv-bezel">
          <div className="kids-tv-screen">
            <span className="kids-media-tag">Real photo · NASA</span>
            {display && ready && !failed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={display.src} src={display.src} alt={alt} className="kids-media-img" />
            ) : failed ? (
              <div className="kids-media-placeholder">
                <span className="kids-media-cam" aria-hidden="true">
                  📷
                </span>
                <p>{caption || "Photo unavailable"}</p>
              </div>
            ) : display ? (
              <div className="kids-media-placeholder kids-media-loading" aria-busy="true">
                <span className="kids-media-cam" aria-hidden="true">
                  📷
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="kids-tv-chin">
          {display && ready ? (
            <p className="kids-media-caption">
              <strong>{caption}</strong>
              {credit ? <span> · {credit}</span> : null}
            </p>
          ) : (
            <span className="kids-tv-speaker" aria-hidden="true" />
          )}
        </div>
        <div className="kids-tv-stand" aria-hidden="true" />
      </div>
    </aside>
  );
}

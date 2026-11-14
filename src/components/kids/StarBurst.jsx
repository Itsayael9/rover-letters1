"use client";

import { useEffect, useState } from "react";

/** Tiny confetti + star flash for correct answers. Respects reduced motion. */
export default function StarBurst({ show, label = "+1 star" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return undefined;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 1600);
    return () => window.clearTimeout(t);
  }, [show]);

  if (!visible) return null;

  return (
    <div className="kids-starburst" role="status" aria-live="polite">
      <span className="kids-starburst-star" aria-hidden="true">
        ⭐
      </span>
      <span className="kids-starburst-label">{label}</span>
      <span className="kids-confetti" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <i key={i} style={{ "--i": i }} />
        ))}
      </span>
    </div>
  );
}

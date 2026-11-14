"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
/** Big 3-2-1 numbers during the countdown phase. */
export default function Countdown({ visible }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStep(0);
      return undefined;
    }

    if (reduced) {
      setStep(1);
      return undefined;
    }

    setStep(3);
    const t2 = window.setTimeout(() => setStep(2), 1000);
    const t1 = window.setTimeout(() => setStep(1), 2000);
    const t0 = window.setTimeout(() => setStep(0), 3000);

    return () => {
      window.clearTimeout(t2);
      window.clearTimeout(t1);
      window.clearTimeout(t0);
    };
  }, [visible, reduced]);

  if (!visible || step === 0) return null;

  return (
    <div className="countdown-overlay" aria-live="polite">
      <span className="countdown-digit">{step}</span>
    </div>
  );
}

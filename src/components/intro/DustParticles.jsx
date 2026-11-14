"use client";

import { useEffect, useRef } from "react";

/**
 * Tiny dust dots that float. They glow more when they are
 * inside the flashlight beam.
 */
export default function DustParticles({ x, y, reduced }) {
  const canvasRef = useRef(null);
  const lightRef = useRef({ x, y });
  lightRef.current = { x, y };

  useEffect(() => {
    if (reduced) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    const dots = Array.from({ length: 42 }, () => ({
      px: Math.random(),
      py: Math.random(),
      z: 0.4 + Math.random() * 0.6,
      s: 0.2 + Math.random() * 0.8,
    }));

    let frame = 0;
    const tick = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.clearRect(0, 0, w, h);
      const light = lightRef.current;

      dots.forEach((dot) => {
        dot.py -= 0.00035 * dot.z;
        dot.px += Math.sin(dot.py * 18 + dot.s) * 0.00012;
        if (dot.py < -0.02) {
          dot.py = 1.02;
          dot.px = Math.random();
        }

        const dx = dot.px - light.x;
        const dy = dot.py - light.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const inBeam = Math.max(0, 1 - dist / 0.28);

        ctx.fillStyle = `rgba(255, 236, 200, ${0.08 + inBeam * 0.55})`;
        ctx.beginPath();
        ctx.arc(dot.px * w, dot.py * h, 0.7 + dot.z * 1.6, 0, Math.PI * 2);
        ctx.fill();
      });

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      aria-hidden="true"
    />
  );
}

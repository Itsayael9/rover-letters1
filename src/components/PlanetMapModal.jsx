"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/store/progress";

export default function PlanetMapModal({ planet, onClose, onPick }) {
  const { completedMachines } = useProgress();
  const [tipId, setTipId] = useState(null);
  const machines = planet?.equipment ?? [];
  const found = machines.filter((machine) => completedMachines.includes(machine.id)).length;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!planet) return null;

  const choose = (machine) => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch && tipId !== machine.id) {
      setTipId(machine.id);
      return;
    }
    onPick(machine);
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 p-3"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${planet.name} map`}
        className="flex max-h-[92dvh] w-full max-w-3xl flex-col bg-[#1A1A1A] text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3 border-b border-white/15 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{planet.name}</p>
            <p className="text-lg font-bold">Machines found: {found} / {machines.length}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close map"
            className="grid h-11 w-11 place-items-center border border-white bg-[#0B3D91] text-xl font-bold"
          >
            X
          </button>
        </header>

        <div
          className="relative min-h-[240px] flex-1"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${planet.texture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {machines.map((machine) => {
            const done = completedMachines.includes(machine.id);
            return (
              <button
                key={machine.id}
                type="button"
                className="absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
                style={{ left: `${machine.mapX ?? 50}%`, top: `${machine.mapY ?? 50}%` }}
                aria-label={machine.name}
                onMouseEnter={() => setTipId(machine.id)}
                onMouseLeave={() => setTipId((current) => (current === machine.id ? null : current))}
                onClick={() => choose(machine)}
              >
                <span
                className={`grid h-9 w-9 place-items-center rounded-full border-2 border-white text-sm font-bold ${
                  done ? "bg-[#0B3D91] shadow-[0_0_16px_#FC3D21]" : "animate-pulse"
                }`}
                style={done ? undefined : { background: machine.color || "#FC3D21" }}
                >
                  {done ? "✓" : "?"}
                </span>
                {tipId === machine.id ? (
                  <span className="absolute bottom-12 whitespace-nowrap bg-white px-2 py-1 text-sm font-bold text-[#1A1A1A]">
                    {machine.name}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

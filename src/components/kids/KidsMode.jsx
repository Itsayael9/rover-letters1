"use client";

import "./kids.css";
import { KidsProgressProvider } from "@/context/KidsProgressContext";
import SegmentRunner from "@/components/kids/SegmentRunner";
import { DeepDiveProvider, useDeepDive } from "@/components/deepdive/DeepDiveContext";
import DeepDive from "@/components/deepdive/DeepDive";
import { OPPORTUNITY_KIDS } from "@/data/kids/opportunity";

const MACHINES = {
  opportunity: OPPORTUNITY_KIDS,
};

function KidsStoryLayer({ machine, onExit }) {
  const { isOpen } = useDeepDive();
  return (
    <div className={isOpen ? "kids-story-layer is-archive-open" : "kids-story-layer"} aria-hidden={isOpen}>
      <SegmentRunner machine={machine} onExit={onExit} />
    </div>
  );
}

/** Kids Mode entry — Opportunity 6-segment story. */
export default function KidsMode({ machineId = "opportunity", onClose }) {
  const machine = MACHINES[machineId];

  if (!machine) {
    return (
      <div className="kids-mode">
        <div className="kids-end-card">
          <p>Machine not found.</p>
          <button type="button" className="kids-btn kids-btn-primary" onClick={onClose}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="kids-mode"
      role="dialog"
      aria-modal="true"
      aria-label={`${tName(machine)} kids adventure`}
    >
      <KidsProgressProvider machineId={machine.id} startAtBeginning>
        <DeepDiveProvider>
          <KidsStoryLayer machine={machine} onExit={onClose} />
          <DeepDive />
        </DeepDiveProvider>
      </KidsProgressProvider>
    </div>
  );
}

function tName(machine) {
  const n = machine.name;
  if (typeof n === "string") return n;
  return n?.en ?? "Rover";
}

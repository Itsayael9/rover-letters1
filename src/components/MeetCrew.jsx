"use client";

import CrewSprite from "@/components/CrewSprite";

export default function MeetCrew({ speaker }) {
  return (
    <div className="meet-crew">
      <div className={`meet-slot leo ${speaker === "leo" ? "talking" : ""}`}>
        <CrewSprite
          who="leo"
          pose={speaker === "leo" ? "talk" : "idle"}
          talking={speaker === "leo"}
          alt="Leo"
        />
      </div>
      <div className={`meet-slot pixel ${speaker === "pixel" ? "talking" : ""}`}>
        <CrewSprite
          who="pixel"
          pose={speaker === "pixel" ? "talk" : "idle"}
          talking={speaker === "pixel"}
          alt="Pixel"
        />
      </div>
    </div>
  );
}

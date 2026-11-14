"use client";

import sections from "@/data/opportunityDeepDive";
import { useDeepDive } from "./DeepDiveContext";

/** HTML overlays on the 3D viewport (dust, evidence photo, return control). */
export default function SceneChrome() {
  const { activeSectionId, userCameraActive, returnToStoryView } = useDeepDive();
  const section = sections.find((s) => s.id === activeSectionId);
  const dust = section?.sceneEffect === "dust";
  const photo = section?.scenePhoto;

  return (
    <>
      {userCameraActive ? (
        <button type="button" className="scene-return-story" onClick={returnToStoryView}>
          Return to story view
        </button>
      ) : null}
      <div className={`scene-dust-veil${dust ? " is-active" : ""}`} aria-hidden />
      {photo ? (
        <div className={`scene-evidence-card${section.id === "ancient-water" ? " is-visible" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.src} alt={photo.caption} />
          <p>
            {photo.caption} · {photo.credit}
          </p>
        </div>
      ) : null}
    </>
  );
}

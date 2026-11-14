"use client";

import { ROCKET_IMAGE } from "@/data/rocketAsset";

/**
 * Simple website landing: same star sky as the museum, rocket on the left,
 * project info on the right.
 */
export default function LandingPage({ onBegin }) {
  return (
    <div className="landing-page">
      <div className="landing-sky" aria-hidden="true" />

      <div className="landing-layout">
        <div className="landing-rocket-col">
          <div className="landing-rocket-wrap">
            <img
              src={ROCKET_IMAGE}
              alt=""
              className="landing-rocket"
              draggable={false}
            />
            <div className="landing-flame" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <div className="landing-copy">
          <p className="landing-kicker">NASA Space Apps Challenge · 2026</p>
          <h1 className="landing-title">Rover Letters</h1>
          <p className="landing-tagline">Abandoned but not Forgotten</p>

          <ul className="landing-list">
            <li>Explore real worlds: Earth, the Moon, and Mars.</li>
            <li>Meet machines NASA left behind and hear their stories.</li>
            <li>Built for curious explorers and future scientists.</li>
          </ul>

          <p className="landing-body">
            Humanity sent rovers and landers far from home. Their missions ended,
            but their discoveries still matter. This museum in space is your
            chance to find them again.
          </p>

          <button type="button" className="landing-begin" onClick={onBegin}>
            Begin
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

/**
 * Step 0 only. Quiet space, real planets, then a fade into the hangar.
 */
export default function TitleScreen({ reduced, opening, onOpen }) {
  return (
    <div
      className={`title-screen absolute inset-0 z-30 overflow-hidden ${
        opening ? "is-leaving" : ""
      }`}
    >
      {/* Same night-sky photo used behind the 3D planets. */}
      <div className="title-sky" aria-hidden="true">
        <img
          src="/textures/milkyway.jpg"
          alt=""
          className="title-sky-photo"
          draggable="false"
        />
        <div className="title-sky-dim" />
      </div>

      {/* Quiet globes. Same maps as Earth and Mars in the museum. */}
      <div className="title-planets" aria-hidden="true">
        <Globe className="is-earth" texture="/textures/earth.jpg" clouds="/textures/earth-clouds.jpg" reduced={reduced} />
        <Globe className="is-mars" texture="/textures/mars.jpg" reduced={reduced} />
      </div>

      <div className="title-copy">
        <motion.h1
          className="title-word"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0.3 : 1.1 }}
        >
          Rover Letters
        </motion.h1>
        <motion.p
          className="title-sub"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : 0.45, duration: reduced ? 0.3 : 1 }}
        >
          Abandoned but not forgotten
        </motion.p>
        <motion.button
          type="button"
          className="title-start"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0.1 : 0.9, duration: 0.6 }}
          onClick={onOpen}
          disabled={opening}
        >
          Begin
        </motion.button>
      </div>
    </div>
  );
}

/** A round planet made from a NASA map. It only turns slowly. */
function Globe({ className, texture, clouds, reduced }) {
  return (
    <div className={`title-globe ${className}`}>
      <span
        className={`title-globe-map ${reduced ? "" : "is-spinning"}`}
        style={{ backgroundImage: `url(${texture})` }}
      />
      {clouds && (
        <span
          className={`title-globe-clouds ${reduced ? "" : "is-spinning"}`}
          style={{ backgroundImage: `url(${clouds})` }}
        />
      )}
      <span className="title-globe-shade" />
    </div>
  );
}

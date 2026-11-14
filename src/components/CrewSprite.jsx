"use client";

import { useEffect, useState } from "react";
import { SPRITES } from "@/data/introScript";

export default function CrewSprite({
  who = "leo",
  pose = "idle",
  talking = false,
  walking = false,
  flip = false,
  className = "",
  alt,
}) {
  const pack = SPRITES[who];
  const [frame, setFrame] = useState(0);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    setFrame(0);
  }, [who, pose, talking, walking]);

  useEffect(() => {
    const walkFrames = pack.walk?.length ?? 0;
    if (walking && walkFrames > 1) {
      const timer = window.setInterval(() => setFrame((n) => n + 1), 170);
      return () => window.clearInterval(timer);
    }
    if (talking) {
      const timer = window.setInterval(() => setFrame((n) => n + 1), 150);
      return () => window.clearInterval(timer);
    }
    return undefined;
  }, [pack, talking, walking]);

  useEffect(() => {
    if (pose !== "idle" || talking || walking) {
      setBlink(false);
      return undefined;
    }

    let timeout = 0;
    const loop = () => {
      timeout = window.setTimeout(() => {
        setBlink(true);
        timeout = window.setTimeout(() => {
          setBlink(false);
          loop();
        }, 130);
      }, 1800 + Math.random() * 2600);
    };
    loop();
    return () => window.clearTimeout(timeout);
  }, [pose, talking, walking]);

  let src = pack[pose] || pack.idle;
  if (walking) src = pack.walk[frame % pack.walk.length];
  else if (talking) src = pack.talk[frame % pack.talk.length];
  else if (blink) src = pack.blink;
  if (Array.isArray(src)) src = src[0];

  return (
    <img
      src={src}
      alt={alt || who}
      className={`crew-sprite ${flip ? "flip" : ""} ${className}`}
      draggable={false}
    />
  );
}

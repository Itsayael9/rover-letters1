"use client";

import { useTriggerRunner } from "./useTriggerRunner";

/** Hooks that connect trigger context to the 3D scene. */
export default function TriggerBridge() {
  useTriggerRunner();
  return null;
}

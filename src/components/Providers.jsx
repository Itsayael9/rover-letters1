"use client";

import { NarrationProvider } from "@/context/NarrationProvider";
import { AudioPrefsProvider } from "@/context/AudioPrefsContext";

export default function Providers({ children) {
  return (
    <AudioPrefsProvider>
      <NarrationProvider>{children}</NarrationProvider>
    </AudioPrefsProvider>
  );
}

"use client";

import { NarrationProvider } from "@/context/NarrationProvider";

export default function Providers({ children }) {
  return <NarrationProvider>{children}</NarrationProvider>;
}

"use client";
import { useLang } from "@/context/LangContext";

const OPTIONS = [
  ["en", "EN"],
  ["ar", "العربية"],
];

export default function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div role="group" aria-label="Language / اللغة" className="flex items-center gap-1 text-sm">
      {OPTIONS.map(([code, label]) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`min-h-9 px-3 font-semibold tracking-wide ${
            lang === code
              ? "border-b-2 border-[#fc3d21] text-white"
              : "border-b-2 border-transparent text-white/70 hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { BODIES } from "@/data/bodies";
import { useLang } from "@/context/LangContext";
import Intro from "@/components/Intro";
import Captions from "@/components/Captions";
import SiteHeader, { MapLogo } from "@/components/SiteHeader";
import PlanetMapModal from "@/components/PlanetMapModal";
import { useProgress } from "@/store/progress";

const NARRATION = {
  en: "/audio/narration-en.mp3",
  ar: "/audio/narration-ar.mp3",
};

const SpaceScene = dynamic(() => import("@/components/SpaceScene"), {
  ssr: false,
});

const KidsMode = dynamic(() => import("@/components/kids/KidsMode"), {
  ssr: false,
});

export default function Home() {
  const { t, lang } = useLang();
  const [phase, setPhase] = useState("intro"); // "intro" | "flying" | "leaving" | "space"
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(null); // { bodyId, equipId }
  const [onSurface, setOnSurface] = useState(false);
  const [narrating, setNarrating] = useState(false);
  const markerEls = useRef({});
  const finished = useRef(false);
  const narrationRef = useRef(null);

  const handleSelectPlanet = (id) => {
    if (id !== selected) setOpen(null);
    setSelected(id);
  };

  const handleSurfaceChange = useCallback((isSurface) => {
    setOnSurface(Boolean(isSurface));
  }, []);

  const body = BODIES.find((b) => b.id === selected);

  const item = open
    ? BODIES.find((b) => b.id === open.bodyId)?.equipment?.find((e) => e.id === open.equipId)
    : null;

  const marsMachines = BODIES.find((b) => b.id === "mars")?.equipment ?? [];
  const marsSiteVisit =
    open?.bodyId === "mars" && marsMachines.some((machine) => machine.id === open.equipId);
  const showKids = item?.id === "opportunity" && onSurface;
  const { isPlanetUnlocked, ready: progressReady, completedMachines } = useProgress();
  const [mapOpen, setMapOpen] = useState(false);
  const [lockNote, setLockNote] = useState(false);
  const [moonNote, setMoonNote] = useState(false);
  const bootedProgress = useRef(false);
  const moonWasOpen = useRef(false);
  const moonUnlockQueued = useRef(false);

  useEffect(() => {
    if (!progressReady) return;
    const openNow = isPlanetUnlocked("moon");
    if (!bootedProgress.current) {
      bootedProgress.current = true;
      moonWasOpen.current = openNow;
      return;
    }
    if (openNow && !moonWasOpen.current) moonUnlockQueued.current = true;
    moonWasOpen.current = openNow;
    if (moonUnlockQueued.current && !showKids) {
      moonUnlockQueued.current = false;
      setMoonNote(true);
    }
  }, [progressReady, isPlanetUnlocked, completedMachines, showKids]);

  const stopNarration = () => {
    const audio = narrationRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setNarrating(false);
  };

  const playNarration = () => {
    const audio = narrationRef.current;
    if (!audio) return;
    audio.src = NARRATION[lang] ?? NARRATION.en;
    audio.currentTime = 0;
    setNarrating(true);
    const play = audio.play();
    if (play) play.catch(() => setNarrating(false));
  };

  const finishIntro = () => {
    if (finished.current) return;
    finished.current = true;
    setPhase("leaving");
    setTimeout(() => setPhase("space"), 700);
  };

  const skipIntro = () => {
    stopNarration();
    finishIntro();
  };

  const startJourney = () => {
    playNarration();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      finishIntro();
    } else {
      setPhase("flying");
    }
  };

  const introDone = phase === "leaving" || phase === "space";

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <SpaceScene
          selected={selected}
          onSelect={handleSelectPlanet}
          markerEls={markerEls}
          marsSiteVisit={marsSiteVisit}
          onSurfaceChange={handleSurfaceChange}
          paused={phase === "intro" || phase === "flying"}
          names={t.planets}
          rtl={lang === "ar"}
          moonUnlocked={isPlanetUnlocked("moon")}
          onMoonLocked={() => setLockNote(true)}
        />
      </div>

      {body &&
        !item &&
        (body.equipment ?? []).map((m) => (
          <button
            key={m.id}
            ref={(el) => {
              markerEls.current[m.id] = el;
            }}
            onClick={() => setOpen({ bodyId: body.id, equipId: m.id })}
            aria-label={m.name}
            className="equipment-marker group pointer-events-none absolute left-0 top-0 text-white opacity-0"
          >
            <span className="block text-3xl font-bold leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] group-hover:hidden">
              X
            </span>
            <span className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-yellow-300/50 bg-black/75 px-3 py-1.5 text-sm font-semibold shadow-lg shadow-yellow-500/20 ring-2 ring-yellow-300/40 group-hover:flex">
              <span className="h-3 w-3 animate-pulse rounded-full bg-yellow-300" />
              {m.name}
            </span>
          </button>
        ))}

      {introDone && !showKids && !item && <SiteHeader title={t.site} onMap={body ? () => setMapOpen(true) : null} />}

      {introDone && body && (item || showKids) && (
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          aria-label="Map"
          className={`absolute left-4 z-[90] grid h-11 w-11 place-items-center rounded-md bg-[#0B3D91] ${
            showKids ? "top-24" : "top-4"
          }`}
        >
          <MapLogo />
        </button>
      )}

      {!body && introDone && (
        <p className="pointer-events-none absolute left-0 right-0 top-24 text-center text-sm font-semibold uppercase tracking-[0.28em] text-white/80">
          {t.hint}
        </p>
      )}

      {body && !item && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6 text-white md:p-10">
          <div className="max-w-lg bg-black/70 p-5">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{body.name}</h1>
            <p className="mt-2 text-white/80">{body.tagline}</p>
            {body.equipment?.length > 0 && (
              <p className="mt-3 text-sm text-white/70">
                {body.id === "mars"
                  ? "Tap Opportunity on Mars to land and meet the rover."
                  : t.tapMarker}
              </p>
            )}
          </div>
          <button
            onClick={() => setSelected(null)}
            className="pointer-events-auto border border-white/50 bg-black/55 px-5 py-2 text-sm font-semibold hover:bg-black/80"
          >
            {t.back}
          </button>
        </div>
      )}

      {mapOpen && body && (
        <PlanetMapModal
          planet={body}
          onClose={() => setMapOpen(false)}
          onPick={(machine) => {
            setMapOpen(false);
            setOpen({ bodyId: body.id, equipId: machine.id });
          }}
        />
      )}

      {lockNote && (
        <div
          className="fixed inset-0 z-[75] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setLockNote(false)}
        >
          <div
            role="dialog"
            aria-label="The Moon is still waiting"
            className="w-[min(100%,22rem)] rounded-3xl bg-[#1A1A1A] px-6 py-6 text-center text-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-4xl" aria-hidden="true">🌙</p>
            <p className="mt-2 text-sm font-semibold text-[#FC3D21]">Nova</p>
            <p className="mt-2 text-2xl font-bold">Not yet, explorer!</p>
            <p className="mt-2 text-base leading-relaxed text-white/90">
              The Moon is still waiting. Finish Mars with Opportunity, and then the Moon will open for you.
            </p>
            <button
              type="button"
              onClick={() => setLockNote(false)}
              className="mt-5 rounded-full bg-[#0B3D91] px-6 py-2 text-base font-bold text-white"
            >
              I will!
            </button>
          </div>
        </div>
      )}

      {moonNote && (
        <div
          className="fixed inset-0 z-[75] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setMoonNote(false)}
        >
          <div
            role="dialog"
            aria-label="The Moon is unlocked"
            className="w-[min(100%,22rem)] rounded-3xl bg-[#1A1A1A] px-6 py-6 text-center text-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-4xl" aria-hidden="true">🌙</p>
            <p className="mt-2 text-sm font-semibold text-[#FC3D21]">Nova</p>
            <p className="mt-2 text-2xl font-bold">The Moon is unlocked!</p>
            <p className="mt-2 text-base leading-relaxed text-white/90">
              You finished Mars. The Moon is ready. Come visit whenever you like.
            </p>
            <button
              type="button"
              onClick={() => setMoonNote(false)}
              className="mt-5 rounded-full bg-[#FC3D21] px-6 py-2 text-base font-bold text-[#1A1A1A]"
            >
              Yay!
            </button>
          </div>
        </div>
      )}

      {marsSiteVisit && !onSurface && (
        <p className="pointer-events-none absolute left-0 right-0 top-1/2 z-40 -translate-y-1/2 text-center text-lg text-white/90">
          Landing on Mars…
        </p>
      )}

      {showKids && <KidsMode machineId="opportunity" onClose={() => setOpen(null)} />}

      <audio
        ref={narrationRef}
        preload="auto"
        src={NARRATION[lang] ?? NARRATION.en}
        onEnded={() => setNarrating(false)}
      />

      <Captions audioRef={narrationRef} lang={lang} active={narrating} />

      {phase !== "space" && (
        <Intro phase={phase} onStart={startJourney} onFinish={finishIntro} onSkip={skipIntro} />
      )}
    </main>
  );
}

"use client";
import { useEffect, useState } from "react";
import RoverCharacter from "@/components/RoverCharacter";
import { useSpeech } from "@/hooks/useSpeech";

export default function StoryPanel({ body, onBack }) {
  const [equipmentId, setEquipmentId] = useState(null);
  const { play, stop, speaking, lineIndex, supported } = useSpeech();

  const list = body.equipment ?? [];
  const item = list.find((e) => e.id === equipmentId);

  // Stop talking when the planet or the equipment changes
  useEffect(() => {
    stop();
    setEquipmentId(null);
  }, [body.id, stop]);

  const openItem = (id) => {
    stop();
    setEquipmentId(id);
  };

  return (
    <aside className="absolute bottom-0 left-0 right-0 max-h-[75vh] overflow-y-auto bg-black/75 p-6 text-white backdrop-blur md:left-auto md:top-0 md:max-h-none md:w-96">
      <h1 className="text-2xl font-semibold">{body.name}</h1>
      <p className="mt-1 text-white/70">{body.tagline}</p>

      {/* 1. Equipment list */}
      {!item && (
        <div className="mt-6">
          {list.length === 0 ? (
            <p className="rounded-lg border border-dashed border-white/30 p-4 text-sm text-white/60">
              No equipment stories here yet.
            </p>
          ) : (
            <>
              <p className="mb-2 text-sm text-white/70">Who would you like to meet?</p>
              {list.map((e) => (
                <button
                  key={e.id}
                  onClick={() => openItem(e.id)}
                  className="mb-2 w-full rounded-xl border border-white/20 bg-white/10 p-4 text-left hover:bg-white/20"
                >
                  <span className="block text-lg font-semibold">{e.name}</span>
                  <span className="text-sm text-white/70">{e.subtitle}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* 2. Character + story */}
      {item && (
        <div className="mt-6">
          <RoverCharacter speaking={speaking} />
          <h2 className="mt-3 text-xl font-semibold">{item.name}</h2>
          <p className="text-sm text-white/70">{item.subtitle}</p>

          <div className="mt-4 space-y-2 text-lg leading-snug">
            {item.story.map((line, i) => (
              <p
                key={i}
                className={
                  i === lineIndex
                    ? "rounded bg-yellow-300 px-2 py-1 text-black"
                    : "px-2 py-1 text-white/85"
                }
              >
                {line}
              </p>
            ))}
          </div>

          {!supported && (
            <p className="mt-3 text-sm text-red-300">
              This browser can't read text aloud. Try Chrome or Edge.
            </p>
          )}

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => (speaking ? stop() : play(item.story, item.lang))}
              className="rounded-full bg-yellow-300 px-5 py-2 font-semibold text-black"
            >
              {speaking ? "Stop" : "Listen"}
            </button>
            <button
              onClick={() => openItem(null)}
              className="rounded-full border border-white/40 px-5 py-2"
            >
              Other equipment
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-8 rounded-full border border-white/40 px-5 py-2 text-sm"
      >
        Back to space
      </button>
    </aside>
  );
}
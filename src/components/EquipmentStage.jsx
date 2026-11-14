"use client";
import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { useSpeech } from "@/hooks/useSpeech";

/* ---------- Cartoon face (eyes + mouth) ---------- */
function Face({ speaking, cfg }) {
  const mouth = useRef();
  const eyes = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    mouth.current.scale.y = speaking ? 0.35 + 0.65 * Math.abs(Math.sin(t * 11)) : 0.12;
    eyes.current.scale.y = t % 4 < 0.12 ? 0.1 : 1; // blink every 4 seconds
  });

  return (
    <group position={cfg.pos} rotation={[0, cfg.rotY, 0]} scale={cfg.scale}>
      <group ref={eyes}>
        {[-0.22, 0.22].map((x) => (
          <group key={x} position={[x, 0.12, 0]}>
            <mesh>
              <sphereGeometry args={[0.16, 24, 24]} />
              <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0, 0, 0.13]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#141a3c" />
            </mesh>
            <mesh position={[0.025, 0.03, 0.19]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </group>
        ))}
      </group>
      <group position={[0, -0.2, 0.05]} scale={[1.4, 1, 1]}>
        <mesh ref={mouth}>
          <sphereGeometry args={[0.14, 24, 24]} />
          <meshStandardMaterial color="#8a1f1f" />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- The real NASA model + face ---------- */
function RoverModel({ url, speaking, face }) {
  const { scene } = useGLTF(url);
  const swing = useRef();

  const { model, fit, offset } = useMemo(() => {
    const model = scene.clone(true);

    // Lighting only: copy the materials and tone down extreme metal so the rover is not too dark
    model.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const fix = (m) => {
        const c = m.clone();
        if (typeof c.metalness === "number") c.metalness = Math.min(c.metalness, 0.35);
        if (typeof c.roughness === "number") c.roughness = Math.max(c.roughness, 0.45);
        return c;
      };
      o.material = Array.isArray(o.material) ? o.material.map(fix) : fix(o.material);
    });

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    return {
      model,
      fit: 3 / Math.max(size.x, size.y, size.z), // scale to a standard size
      offset: center.multiplyScalar(-1),
    };
  }, [scene]);

  useFrame(({ clock }) => {
    swing.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.25;
  });

  return (
    <group ref={swing}>
      <group scale={fit}>
        <primitive object={model} position={offset} />
      </group>
      <Face speaking={speaking} cfg={face} />
    </group>
  );
}

/* ---------- Dev-only slider panel to place the face ---------- */
function FaceTuner({ face, setFace }) {
  const set = (patch) => setFace({ ...face, ...patch });
  const setPos = (i, v) => {
    const pos = [...face.pos];
    pos[i] = v;
    set({ pos });
  };
  const row = (label, value, min, max, onChange) => (
    <label className="flex items-center gap-2 text-xs">
      <span className="w-12">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1"
      />
      <span className="w-10 text-right">{value.toFixed(2)}</span>
    </label>
  );
  return (
    <div className="absolute right-4 top-16 w-64 space-y-1 rounded-xl bg-black/80 p-3 text-white">
      {row("x", face.pos[0], -2, 2, (v) => setPos(0, v))}
      {row("y", face.pos[1], -2, 2, (v) => setPos(1, v))}
      {row("z", face.pos[2], -2, 2, (v) => setPos(2, v))}
      {row("size", face.scale, 0.1, 2, (v) => set({ scale: v }))}
      {row("turn", face.rotY, -3.14, 3.14, (v) => set({ rotY: v }))}
      <p className="pt-2 text-[11px] text-white/70">Copy this into bodies.js:</p>
      <code className="block break-all text-[11px] text-yellow-200">
        {`face: { pos: [${face.pos.map((n) => n.toFixed(2)).join(", ")}], scale: ${face.scale.toFixed(2)}, rotY: ${face.rotY.toFixed(2)} }`}
      </code>
    </div>
  );
}

/* ---------- The stage ---------- */
export default function EquipmentStage({ item, onClose }) {
  const { play, stop, speaking, lineIndex, supported } = useSpeech();
  const [face, setFace] = useState(item.face);
  const [tuning, setTuning] = useState(false);
  const [details, setDetails] = useState(false);
  const { active, progress } = useProgress();
  const isDev = process.env.NODE_ENV === "development";

  // Start talking as soon as the stage opens
  useEffect(() => {
    play(item.story, item.lang);
    return () => stop();
  }, [item, play, stop]);

  const subtitle =
    speaking && lineIndex >= 0
      ? item.story[lineIndex]
      : "Press Listen to hear my story";

  return (
    // No background color here: the Mars scene behind shows through
    <div className="fixed inset-0 z-50 text-white">
      {/* soft fade at the bottom so the subtitles are easy to read */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 to-transparent" />

      <Canvas camera={{ position: [0, 1.2, 6], fov: 40 }} style={{ background: "transparent" }}>
        <ambientLight intensity={1.1} />
        <hemisphereLight args={["#ffffff", "#c97a50", 1.1]} />
        <directionalLight position={[4, 6, 5]} intensity={2.6} />
        <directionalLight position={[-5, 3, 4]} intensity={1.4} color="#ffd2b0" />
        <directionalLight position={[0, 2, -5]} intensity={1} />

        {/* reflection lighting, built in code (no download) */}
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={2.2} position={[0, 5, -5]} scale={[12, 12, 1]} />
          <Lightformer intensity={1.6} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[10, 5, 1]} />
          <Lightformer intensity={1.6} position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[10, 5, 1]} />
          <Lightformer intensity={1.2} position={[0, 1, 7]} scale={[12, 5, 1]} />
        </Environment>

        <Suspense fallback={null}>
          <RoverModel url={item.model} speaking={speaking} face={face} />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={3} maxDistance={9} />
      </Canvas>

      {active && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="rounded-full bg-black/60 px-5 py-2 text-white">
            Loading {item.name}… {Math.round(progress)}%
          </p>
        </div>
      )}

      {/* top bar */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
        <button
          onClick={onClose}
          className="border border-white/50 bg-black/55 px-4 py-2 text-sm font-semibold hover:bg-black/80"
        >
          ← Back to Mars
        </button>
        {isDev && (
          <button
            onClick={() => setTuning((t) => !t)}
            className="border border-white/50 bg-black/55 px-4 py-2 text-sm font-semibold hover:bg-black/80"
          >
            Tune face
          </button>
        )}
      </div>
      {isDev && tuning && <FaceTuner face={face} setFace={setFace} />}

      {/* name, subtitle, buttons */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-3 p-6 text-center">
        <h2 className="text-2xl font-semibold drop-shadow">{item.name}</h2>
        <p className="min-h-[4.5rem] max-w-2xl rounded-xl bg-black/60 px-5 py-3 text-xl leading-snug">
          {subtitle}
        </p>
        {!supported && (
          <p className="text-sm text-red-300">
            This browser can't read text aloud. Try Chrome or Edge.
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => (speaking ? stop() : play(item.story, item.lang))}
            className="bg-[#fc3d21] px-6 py-2 font-bold text-white hover:bg-[#e1331b]"
          >
            {speaking ? "Stop" : "Listen"}
          </button>
          <button
            onClick={() => setDetails(true)}
            className="border border-white/50 bg-black/55 px-4 py-2 text-sm font-semibold hover:bg-black/80"
          >
            Explore more details
          </button>
        </div>
      </div>

      {/* adult details (placeholder until Step 6) */}
      {details && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6">
          <div className="max-w-lg rounded-2xl bg-[#141a3c] p-6">
            <h3 className="text-xl font-semibold">{item.name}: full details</h3>
            <p className="mt-3 text-white/80">
              The detailed adult section (facts, timeline, sources) will be built in Step 6.
            </p>
            <button
              onClick={() => setDetails(false)}
              className="mt-5 bg-[#fc3d21] px-5 py-2 font-bold text-white hover:bg-[#e1331b]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
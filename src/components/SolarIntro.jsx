"use client";
import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF, useTexture } from "@react-three/drei";

const ROCKET = "/models/saturn-v.glb";
const RING_TEX = "/textures/saturn-ring.png"; // must match the file name in public/textures
const FLIP = false; // if the rocket flies tail-first, change to true
const DURATION = 22; // match narration length so each planet can be named
const FREEZE_Z = -108; // the camera stops following here (at Neptune)
const CAM_OFFSET = new THREE.Vector3(0.8, 0.9, 4.5); // camera behind the rocket
const SUN = { pos: [-11, 3.5, -4], r: 5 };

// Not to scale: sizes and distances are made for a good view
const PLANETS = [
  { id: "mercury", tex: "/textures/mercury.jpg", pos: [-4.4, 1.3, -6], r: 1.15 },
  { id: "venus", tex: "/textures/venus.jpg", pos: [5.0, -1.4, -14], r: 2.0 },
  { id: "earth", tex: "/textures/earth.jpg", pos: [-5.4, 1.1, -24], r: 2.3 },
  { id: "mars", tex: "/textures/mars.jpg", pos: [5.2, -1.0, -34], r: 1.85 },
  { id: "jupiter", tex: "/textures/jupiter.jpg", pos: [-11.2, 1.8, -52], r: 5.1 },
  { id: "saturn", tex: "/textures/saturn.jpg", pos: [12.0, -0.7, -74], r: 4.6, ring: true },
  { id: "uranus", tex: "/textures/uranus.jpg", pos: [-8.8, 1.3, -92], r: 3.1 },
  { id: "neptune", tex: "/textures/neptune.jpg", pos: [8.0, -0.7, -108], r: 3.1 },
];

// The rocket passes close to each planet, then turns right and leaves
const WAYPOINTS = [
  [-0.8, 0.4, -6],
  [0.6, -0.4, -14],
  [-0.9, 0.5, -24],
  [0.8, -0.3, -34],
  [-2.2, 0.8, -52],
  [1.4, 0, -74],
  [-1.2, 0.5, -92],
  [1.0, 0, -108], // passes Neptune
  [2.5, 1.5, -116],
  [14, 3.5, -124], // turns right
  [48, 6, -124], // flies away to the right
].map((a) => new THREE.Vector3(...a));

/* ---------- Milky Way sky (follows the camera) ---------- */
function Sky() {
  const map = useTexture("/textures/milkyway.jpg");
  const ref = useRef();
  useFrame(({ camera }) => {
    ref.current.position.copy(camera.position);
  });
  return (
    <mesh ref={ref} raycast={() => null} renderOrder={-1}>
      <sphereGeometry args={[800, 48, 48]} />
      <meshBasicMaterial
        map={map}
        color="#8a8a8a"
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ---------- Sun ---------- */
function Sun() {
  const map = useTexture("/textures/sun.jpg");
  const glow = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, "rgba(255,210,120,0.9)");
    g.addColorStop(0.35, "rgba(255,150,50,0.35)");
    g.addColorStop(1, "rgba(255,120,30,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);

  return (
    <group position={SUN.pos}>
      <mesh>
        <sphereGeometry args={[SUN.r, 48, 48]} />
        <meshBasicMaterial map={map} />
      </mesh>
      <sprite scale={[SUN.r * 4.2, SUN.r * 4.2, 1]}>
        <spriteMaterial
          map={glow}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </sprite>
    </group>
  );
}

/* ---------- Saturn's rings ---------- */
function SaturnRing({ r }) {
  const map = useTexture(RING_TEX);
  const geo = useMemo(() => {
    const inner = r * 1.25;
    const outer = r * 2.1;
    const g = new THREE.RingGeometry(inner, outer, 128);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
    }
    return g;
  }, [r]);

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2 + 0.45, 0, 0.2]}>
      <meshBasicMaterial map={map} transparent side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

/* ---------- A planet ---------- */
function Planet({ p }) {
  const map = useTexture(p.tex);
  const ref = useRef();
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.15;
  });
  return (
    <group position={p.pos}>
      <mesh ref={ref}>
        <sphereGeometry args={[p.r, 48, 48]} />
        <meshStandardMaterial map={map} />
      </mesh>
      {p.ring && <SaturnRing r={p.r} />}
    </group>
  );
}

/* ---------- The rocket: floats on the side, then flies ---------- */
function RocketFlight({ flying, onEnd, rtl }) {
  const { scene } = useGLTF(ROCKET);
  const rocketRef = useRef();
  const spinRef = useRef();
  const state = useRef({
    t: 0,
    curve: null,
    done: false,
    uFreeze: 0.8,
    start: new THREE.Vector3(),
    base: 1,
  });
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  const { model, fit, offset, align } = useMemo(() => {
    const model = scene.clone(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const longest = Math.max(size.x, size.y, size.z);
    let align = [0, 0, 0]; // turn the long side to point up
    if (size.x === longest) align = [0, 0, Math.PI / 2];
    else if (size.z === longest) align = [-Math.PI / 2, 0, 0];
    return { model, fit: 2.8 / longest, offset: center.multiplyScalar(-1), align };
  }, [scene]);

  const idleQ = useMemo(
    () => new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, rtl ? -0.35 : 0.35)),
    [rtl]
  );
  const tmp = useMemo(
    () => ({
      p: new THREE.Vector3(),
      tan: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      q: new THREE.Quaternion(),
      camPos: new THREE.Vector3(),
      focus: new THREE.Vector3(),
      look: new THREE.Vector3(),
      idleCam: new THREE.Vector3(0, 0, 10),
      idleLook: new THREE.Vector3(0, 0, 0),
    }),
    []
  );

  useFrame(({ camera, clock, viewport }, delta) => {
    const s = state.current;
    const r = rocketRef.current;
    spinRef.current.rotation.y += delta * (flying ? 1.2 : 0.35);

    // 1) Before the click: float on the side of the screen
    if (!flying) {
      const vp = viewport.getCurrentViewport(camera, [0, 0, 5]);
      const narrow = vp.width < vp.height; // phone in portrait
      const side = rtl ? -1 : 1;
      const x = narrow ? 0 : side * vp.width * 0.26;
      const y = (narrow ? -vp.height * 0.2 : -0.1) + Math.sin(clock.elapsedTime * 0.8) * 0.1;
      s.start.set(x, y, 5);
      s.base = narrow ? 0.8 : 1;
      r.position.copy(s.start);
      r.scale.setScalar(s.base);
      r.quaternion.slerp(idleQ, 1 - Math.exp(-6 * delta));
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);
      return;
    }

    // 2) After the click: build the path once
    if (!s.curve) {
      s.curve = new THREE.CatmullRomCurve3([s.start.clone(), ...WAYPOINTS], false, "catmullrom", 0.4);
      // find the point on the path where the camera must stop (at Neptune)
      s.uFreeze = 0.8;
      for (let i = 1; i <= 400; i++) {
        s.curve.getPointAt(i / 400, tmp.p);
        if (tmp.p.z <= FREEZE_Z) {
          s.uFreeze = i / 400;
          break;
        }
      }
    }

    // 3) Fly: starts calmly, then gets faster and faster
    s.t += delta / DURATION;
    const p = Math.min(s.t, 1);
    const u = Math.pow(p, 1.15);

    s.curve.getPointAt(u, tmp.p);
    s.curve.getTangentAt(u, tmp.tan);
    r.position.copy(tmp.p);
    tmp.q.setFromUnitVectors(tmp.up, tmp.tan);
    r.quaternion.slerp(tmp.q, 1 - Math.exp(-8 * delta));
    const shrink = p > 0.9 ? Math.max(1 - (p - 0.9) / 0.1, 0.001) : 1;
    r.scale.setScalar(s.base * shrink);

    // 4) Camera: follows behind the rocket, then STOPS at Neptune.
    //    The rocket turns right and leaves the screen on the right side.
    const ul = Math.min(u, s.uFreeze);
    s.curve.getPointAt(Math.max(0, ul - 0.03), tmp.camPos).add(CAM_OFFSET);
    s.curve.getPointAt(ul, tmp.focus);
    const b = THREE.MathUtils.smoothstep(p, 0, 0.06);
    camera.position.lerpVectors(tmp.idleCam, tmp.camPos, b);
    tmp.look.lerpVectors(tmp.idleLook, tmp.focus, b);
    camera.lookAt(tmp.look);

    if (p >= 1 && !s.done) {
      s.done = true;
      onEndRef.current?.();
    }
  });

  return (
    <group ref={rocketRef}>
      <group ref={spinRef}>
        <group rotation={[FLIP ? Math.PI : 0, 0, 0]}>
          <group rotation={align}>
            <group scale={fit}>
              <primitive object={model} position={offset} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

/* Tells the page that everything is loaded */
function Ready({ onReady }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

/* ---------- The whole entrance world ---------- */
export default function SolarIntro({ flying, onEnd, onReady, rtl }) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 2000 }} dpr={[1, 1.75]}>
      <ambientLight intensity={0.3} />
      <pointLight position={SUN.pos} intensity={3} decay={0} />
      <directionalLight position={[3, 4, 6]} intensity={1.2} />

      <Environment resolution={256} frames={1}>
        <Lightformer intensity={1.6} position={[0, 5, -5]} scale={[12, 12, 1]} />
        <Lightformer intensity={1.2} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[10, 5, 1]} />
        <Lightformer intensity={1.2} position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[10, 5, 1]} />
        <Lightformer intensity={1} position={[0, 1, 7]} scale={[12, 5, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <Sky />
        <Sun />
        {PLANETS.map((p) => (
          <Planet key={p.id} p={p} />
        ))}
        <RocketFlight flying={flying} onEnd={onEnd} rtl={rtl} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
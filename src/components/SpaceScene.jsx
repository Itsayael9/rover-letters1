
"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useTexture } from "@react-three/drei";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { BODIES } from "@/data/bodies";
import { getBodyWorldPosition, moonOrbitOffset } from "@/lib/lunarOrbit";
import MoonSurface from "@/components/MoonSurface";
import MarsSurface from "@/components/MarsSurface";

const HOME_POS = new THREE.Vector3(0, 0, 9);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);

/* ---------- Latitude/longitude helper ---------- */

function latLonToVec3(lat, lon, radius) {
  const latitude = THREE.MathUtils.degToRad(lat);
  const phi = THREE.MathUtils.degToRad(lon + 180);

  return new THREE.Vector3(
    -radius * Math.cos(latitude) * Math.cos(phi),
    radius * Math.sin(latitude),
    radius * Math.cos(latitude) * Math.sin(phi)
  );
}

/* ---------- Planet surfaces ---------- */

function useGlobeMap(url) {
  const map = useTexture(url);

  // Keep one copy of the photo around the sphere — never tiled.
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1, 1);
  map.offset.set(0, 0);
  map.needsUpdate = true;

  return map;
}

function Surface({ body }) {
  const map = useGlobeMap(body.texture);
  return <meshStandardMaterial map={map} />;
}

function EarthSurface({ body }) {
  const [map, night] = useTexture([
    body.texture,
    body.nightTexture,
  ]);

  return (
    <meshStandardMaterial
      map={map}
      emissiveMap={night}
      emissive="#ffd9a0"
      emissiveIntensity={0.6}
    />
  );
}

/* ---------- Clouds ---------- */

function Clouds({ body }) {
  const ref = useRef();
  const clouds = useTexture(body.cloudsTexture);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.065;
    }
  });

  return (
    <mesh ref={ref} raycast={() => null}>
      <sphereGeometry args={[body.size * 1.012, 64, 64]} />
      <meshStandardMaterial
        color="white"
        alphaMap={clouds}
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---------- Atmosphere ---------- */

const glowVertex = `
  varying vec3 vN;
  varying vec3 vW;

  void main() {
    vN = normalize(mat3(modelMatrix) * normal);
    vW = (modelMatrix * vec4(position, 1.0)).xyz;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

const glowFragment = `
  varying vec3 vN;
  varying vec3 vW;

  uniform vec3 uColor;
  uniform vec3 uSun;
  uniform float uPower;
  uniform float uStrength;

  void main() {
    vec3 n = normalize(vN);
    vec3 v = normalize(cameraPosition - vW);

    float rim = pow(
      1.0 - max(dot(n, v), 0.0),
      uPower
    );

    float lit = smoothstep(
      -0.25,
      0.55,
      dot(n, uSun)
    );

    gl_FragColor = vec4(
      uColor,
      rim * lit * uStrength
    );
  }
`;

function Atmosphere({ body }) {
  const { color, scale, power, strength } = body.atmosphere;

  const uniforms = useMemo(
    () => ({
      uColor: {
        value: new THREE.Vector3(...color),
      },
      uSun: {
        value: new THREE.Vector3(6, 3, 6).normalize(),
      },
      uPower: { value: power },
      uStrength: { value: strength },
    }),
    [color, power, strength]
  );

  return (
    <mesh scale={scale} raycast={() => null}>
      <sphereGeometry args={[body.size, 64, 64]} />
      <shaderMaterial
        vertexShader={glowVertex}
        fragmentShader={glowFragment}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---------- Space background ---------- */

function SpaceBackground() {
  const texture = useTexture("/textures/milkyway.jpg");

  return (
    <mesh raycast={() => null} renderOrder={-1}>
      <sphereGeometry args={[90, 64, 64]} />
      <meshBasicMaterial
        map={texture}
        color="#707070"
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ---------- Equipment marker tracking ---------- */

function MarkerTracker({ body, item, meshRef, markerEls }) {
  const anchor = useRef();

  const world = useMemo(() => new THREE.Vector3(), []);
  const center = useMemo(() => new THREE.Vector3(), []);
  const toCam = useMemo(() => new THREE.Vector3(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);

  const pos = useMemo(
    () => latLonToVec3(item.lat, item.lon, body.size * 1.005),
    [item.lat, item.lon, body.size]
  );

  useFrame(({ camera, size }) => {
    const el = markerEls?.current?.[item.id];

    if (!el || !anchor.current || !meshRef.current) return;

    anchor.current.getWorldPosition(world);
    meshRef.current.getWorldPosition(center);

    toCam.copy(camera.position).sub(world);
    normal.copy(world).sub(center);

    const facing = normal.dot(toCam) > 0;

    world.project(camera);

    const x = (world.x * 0.5 + 0.5) * size.width;
    const y = (-world.y * 0.5 + 0.5) * size.height;

    el.style.transform =
      `translate(${x}px, ${y}px) translate(-50%, -50%)`;

    el.style.opacity = facing ? "1" : "0";
    el.style.pointerEvents = facing ? "auto" : "none";
  });

  useEffect(() => {
    const id = item.id;

    return () => {
      const el = markerEls?.current?.[id];

      if (el) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      }
    };
  }, [item.id, markerEls]);

  return <group ref={anchor} position={pos} />;
}

/* ---------- Planet ---------- */

function BodyLabel({ name, rtl }) {
  if (!name) return null;
  return (
    <Html center sprite style={{ pointerEvents: "none" }} zIndexRange={[8, 0]}>
      <span
        dir={rtl ? "rtl" : "ltr"}
        className="whitespace-nowrap text-[11px] font-semibold text-white [text-shadow:0_1px_3px_#000,0_0_6px_#000]"
      >
        {name}
      </span>
    </Html>
  );
}

function OrbitingBody({ body, parentBody, paused, children }) {
  const mount = useRef();
  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (!mount.current || !body.orbit) return;
    mount.current.position.copy(moonOrbitOffset(body.orbit, 0));
  }, [body]);

  useFrame((state) => {
    if (paused || !mount.current || !body.orbit) return;
    const rate = reduceMotion ? 0.35 : 1;
    mount.current.position.copy(moonOrbitOffset(body.orbit, state.clock.elapsedTime * rate));
  });

  return (
    <group position={parentBody.position}>
      <group ref={mount}>{children}</group>
    </group>
  );
}

function Planet({ body, selected, onSelect, markerEls, faceMarkers = false, name, rtl, onPlanetHover }) {
  const spin = useRef();
  const meshRef = useRef();
  const hoverSound = useRef(false);

  const [hovered, setHovered] = useState(false);

  const markers = body.equipment ?? [];
  const isSelected = selected === body.id;

  useFrame((_, delta) => {
    const group = spin.current;

    if (!group) return;

    if (faceMarkers && markers.length) {
      const v = latLonToVec3(
        markers[0].lat,
        markers[0].lon,
        1
      );

      let target = -Math.atan2(v.x, v.z);
      const current = group.rotation.y;

      target +=
        Math.round((current - target) / (2 * Math.PI)) *
        2 * Math.PI;

      group.rotation.y +=
        (target - current) * (1 - Math.exp(-3 * delta));
    } else {
      group.rotation.y += delta * 0.05;
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  return (
    <group position={body.position} scale={hovered ? 1.07 : 1}>
      <group ref={spin}>
        <mesh
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            if (!hoverSound.current) {
              hoverSound.current = true;
              onPlanetHover?.();
            }
          }}
          onPointerOut={() => {
            setHovered(false);
            hoverSound.current = false;
          }}
          onClick={(e) => {
            e.stopPropagation();

            if (e.delta > 5) return;

            setHovered(false);
            onSelect(body.id);
          }}
        >
          <sphereGeometry args={[body.size, 64, 64]} />

          {body.nightTexture ? (
            <EarthSurface body={body} />
          ) : (
            <Surface body={body} />
          )}
        </mesh>

        {isSelected &&
          markers.map((item) => (
            <MarkerTracker
              key={item.id}
              body={body}
              item={item}
              meshRef={meshRef}
              markerEls={markerEls}
            />
          ))}
      </group>

      {body.cloudsTexture && <Clouds body={body} />}
      {body.atmosphere && <Atmosphere body={body} />}
      <BodyLabel name={name} rtl={rtl} />
    </group>
  );
}

/* ---------- Camera rig ---------- */

function CameraRig({
  selected,
  view,
  onApproachComplete,
}) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);

  const animating = useRef(false);
  const phase = useRef("idle");
  const elapsed = useRef(0);
  const notified = useRef(false);

  const startPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const goalPos = useRef(new THREE.Vector3());
  const goalTarget = useRef(new THREE.Vector3());

  const completionCallback = useRef(onApproachComplete);

  useEffect(() => {
    completionCallback.current = onApproachComplete;
  }, [onApproachComplete]);

  const prevView = useRef(view);

  useEffect(() => {
    if (!controls) return;

    const cameFrom = prevView.current;
    prevView.current = view;

    if (view === "approaching") {
      const body = BODIES.find(
        (item) => item.id === selected
      );

      if (!body) {
        goalTarget.current.copy(HOME_TARGET);
        goalPos.current.copy(HOME_POS);
        startPos.current.copy(camera.position);
        startTarget.current.copy(controls.target);
        controls.enabled = true;
        phase.current = "normal";
        animating.current = true;
        return;
      }

      startPos.current.copy(camera.position);
      startTarget.current.copy(controls.target);

      goalTarget.current.copy(getBodyWorldPosition(body, BODIES, 0));

      goalPos.current
        .copy(goalTarget.current)
        .add(new THREE.Vector3(0, 0, body.size + 0.08));

      elapsed.current = 0;
      notified.current = false;
      phase.current = "approach";
      animating.current = false;
      controls.enabled = false;

      return;
    }

    if (view === "surface") {
      phase.current = "idle";
      animating.current = false;

      camera.position.set(0, 1.7, 7);
      controls.target.set(0, 1.45, -6);
      controls.enabled = true;
      controls.update();

      return;
    }

    if (view === "enter-cover" || view === "exit-cover") {
      animating.current = false;
      phase.current = "idle";
      controls.enabled = false;
      return;
    }

    controls.enabled = true;
    phase.current = "normal";

    const body = BODIES.find(
      (item) => item.id === selected
    );

    if (body) {
      const position = getBodyWorldPosition(body, BODIES, 0);

      goalTarget.current.copy(position);

      goalPos.current
        .copy(position)
        .add(new THREE.Vector3(0, 0, body.size * 3.2));

      animating.current = true;
      return;
    }

    goalTarget.current.copy(HOME_TARGET);
    goalPos.current.copy(HOME_POS);

    // Coming back from the Moon/Mars walk: put the museum camera
    // in its original seat so the planets do not look stretched.
    const fromWalk =
      cameFrom === "exit-cover" ||
      cameFrom === "surface" ||
      cameFrom === "enter-cover";

    if (fromWalk) {
      camera.position.copy(HOME_POS);
      controls.target.copy(HOME_TARGET);
      animating.current = false;
      controls.update();
      return;
    }

    animating.current = true;
  }, [selected, view, controls, camera]);

  useEffect(() => {
    if (!controls) return;

    const stop = () => {
      // Let people grab the camera while looking at a planet,
      // but never cancel the flight back to the museum overview.
      if (view === "space" && selected) {
        animating.current = false;
      }
    };

    controls.addEventListener("start", stop);

    return () => {
      controls.removeEventListener("start", stop);
    };
  }, [controls, view, selected]);

  useFrame((state, delta) => {
    if (!controls) return;

    const body = selected ? BODIES.find((item) => item.id === selected) : null;

    const orbitRate =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0.35
        : 1;

    if (body?.orbit) {
      const world = getBodyWorldPosition(body, BODIES, state.clock.elapsedTime * orbitRate);
      goalTarget.current.copy(world);
      if (view === "space" && animating.current) {
        goalPos.current.copy(world).add(new THREE.Vector3(0, 0, body.size * 3.2));
      }
      if (view === "approaching" && phase.current === "approach") {
        goalPos.current.copy(world).add(new THREE.Vector3(0, 0, body.size + 0.08));
      }
    }

    if (
      view === "approaching" &&
      phase.current === "approach"
    ) {
      elapsed.current += delta;

      const raw = Math.min(elapsed.current / 1.6, 1);
      const t = raw * raw * (3 - 2 * raw);

      state.camera.position.lerpVectors(
        startPos.current,
        goalPos.current,
        t
      );

      controls.target.lerpVectors(
        startTarget.current,
        goalTarget.current,
        t
      );

      controls.update();

      if (raw >= 1 && !notified.current) {
        notified.current = true;
        completionCallback.current?.();
      }

      return;
    }

    if (view !== "space" || !animating.current) return;

    const t = 1 - Math.exp(-3 * delta);

    state.camera.position.lerp(goalPos.current, t);
    controls.target.lerp(goalTarget.current, t);
    controls.update();

    if (
      state.camera.position.distanceTo(goalPos.current) < 0.02 &&
      controls.target.distanceTo(goalTarget.current) < 0.02
    ) {
      animating.current = false;
    }
  });

  return null;
}

/* ---------- Main scene ---------- */

export default function SpaceScene({
  selected,
  onSelect,
  markerEls,
  /** True when user chose an equipment site (Mars or Moon mission pin). */
  siteVisit = false,
  onSurfaceChange,
  paused = false,
  names = {},
  rtl = false,
  onPlanetHover,
  onApproachStart,
}) {
  const [view, setView] = useState("space");

  const onSelectRef = useRef(onSelect);
  const onSurfaceChangeRef = useRef(onSurfaceChange);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    onSurfaceChangeRef.current = onSurfaceChange;
  }, [onSurfaceChange]);

  useEffect(() => {
    onSurfaceChangeRef.current?.(view === "surface");
  }, [view]);

  const completeApproach = useCallback(() => {
    setView("enter-cover");
  }, []);

  useEffect(() => {
    if (
      view !== "enter-cover" &&
      view !== "exit-cover" &&
      view !== "exit-surface"
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (view === "enter-cover") {
        setView("surface");
      } else if (view === "exit-cover") {
        onSelectRef.current?.(null);
        setView("space");
      } else if (view === "exit-surface") {
        setView("space");
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [view]);

  const activeSiteVisit = siteVisit;

  useEffect(() => {
    const missionBody = selected === "mars" || selected === "moon" ? selected : null;
    if (activeSiteVisit && missionBody && view === "space") {
      onApproachStart?.();
      setView("approaching");
    }
  }, [activeSiteVisit, selected, view, onApproachStart]);

  useEffect(() => {
    if (
      !activeSiteVisit &&
      (selected === "mars" || selected === "moon") &&
      view === "surface"
    ) {
      setView("exit-surface");
    }
  }, [activeSiteVisit, selected, view]);

  // If the overlay "Back to space" button clears the planet while we
  // are still flying in or walking on the surface, go home cleanly.
  useEffect(() => {
    if (selected) return;
    if (
      view === "approaching" ||
      view === "surface" ||
      view === "enter-cover"
    ) {
      setView("exit-cover");
    }
  }, [selected, view]);

  const handlePlanetSelect = useCallback(
    (id) => {
      if (view !== "space" && view !== "approaching") return;
      onSelect?.(id);
    },
    [onSelect, view]
  );

  const covered =
    view === "enter-cover" ||
    view === "exit-cover" ||
    view === "exit-surface";

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 0, 9], fov: 50 }}
        frameloop={paused ? "never" : "always"}
      >
        {view === "surface" ? (
          <>
            <color
              attach="background"
              args={[selected === "mars" ? "#4a3228" : "#020308"]}
            />

            <ambientLight
              intensity={selected === "mars" ? 0.32 : 0.2}
              color={selected === "mars" ? "#e0c4a8" : "#ffffff"}
            />

            <directionalLight
              castShadow
              position={[30, 40, 20]}
              intensity={selected === "mars" ? 2.2 : 2.5}
              color={selected === "mars" ? "#fff0e0" : "#ffffff"}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-near={0.5}
              shadow-camera-far={180}
            />

            <Suspense fallback={null}>
              {selected === "mars" ? (
                <MarsSurface />
              ) : (
                <MoonSurface />
              )}
            </Suspense>
          </>
        ) : (
          <>
            <ambientLight intensity={0.4} />

            <directionalLight
              position={[6, 3, 6]}
              intensity={1.8}
            />

            <directionalLight
              position={[-6, 2, 6]}
              intensity={0.8}
              color="#9bb8ff"
            />

            <Suspense fallback={null}>
              <SpaceBackground />

              {BODIES.filter((body) => !body.orbit).map((body) => (
                <Planet
                  key={body.id}
                  body={body}
                  selected={selected}
                  onSelect={handlePlanetSelect}
                  markerEls={markerEls}
                  faceMarkers={view === "space" && selected === body.id}
                  name={names[body.id]}
                  rtl={rtl}
                  onPlanetHover={onPlanetHover}
                />
              ))}

              {BODIES.filter((body) => body.orbit).map((body) => {
                const parent = BODIES.find((b) => b.id === body.orbit.parentId);
                if (!parent) return null;

                const moonBody = { ...body, position: [0, 0, 0] };

                return (
                  <OrbitingBody key={body.id} body={body} parentBody={parent} paused={paused}>
                    <Planet
                      body={moonBody}
                      selected={selected}
                      onSelect={handlePlanetSelect}
                      markerEls={markerEls}
                      faceMarkers={view === "space" && selected === body.id}
                      name={names[body.id]}
                      rtl={rtl}
                      onPlanetHover={onPlanetHover}
                    />
                  </OrbitingBody>
                );
              })}
            </Suspense>
          </>
        )}

        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={1}
          maxDistance={16}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.65}
        />

        <CameraRig
          selected={selected}
          view={view}
          onApproachComplete={completeApproach}
        />
      </Canvas>

      <div
        className={`pointer-events-none absolute inset-0 z-20 bg-black transition-opacity duration-500 ease-in-out ${covered ? "opacity-100" : "opacity-0"
          }`}
      />

      {view === "surface" && !activeSiteVisit && (
        <button
          type="button"
          onClick={() => setView("exit-cover")}
          className="absolute left-4 top-4 z-30 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-black/90"
        >
          ← Back to space museum
        </button>
      )}
    </div>
  );
}

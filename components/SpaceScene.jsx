"use client";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { BODIES } from "@/data/bodies";
import { useMemo } from "react";

const HOME_POS = new THREE.Vector3(0, 0, 9);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);

/* ---------- Surfaces ---------- */
function Surface({ body }) {
  const map = useTexture(body.texture);
  return <meshStandardMaterial map={map} />;
}

function EarthSurface({ body }) {
  const [map, night] = useTexture([body.texture, body.nightTexture]);
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
    ref.current.rotation.y += delta * 0.065;
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

/* ---------- Atmosphere (soft haze, sunlit side only) ---------- */
const glowVertex = `
  varying vec3 vN;
  varying vec3 vW;
  void main() {
    vN = normalize(mat3(modelMatrix) * normal);
    vW = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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
    float rim = pow(1.0 - max(dot(n, v), 0.0), uPower);
    float lit = smoothstep(-0.25, 0.55, dot(n, uSun));
    gl_FragColor = vec4(uColor, rim * lit * uStrength);
  }
`;

function Atmosphere({ body }) {
  const { color, scale, power, strength } = body.atmosphere;
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Vector3(...color) },
      uSun: { value: new THREE.Vector3(6, 3, 6).normalize() },
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

/* ---------- Planet ---------- */
function Planet({ body, onSelect }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.05;
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  return (
    <group position={body.position} scale={hovered ? 1.06 : 1}>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 5) return; // it was a drag, not a click
          onSelect(body.id);
        }}
      >
        <sphereGeometry args={[body.size, 64, 64]} />
        {body.nightTexture ? <EarthSurface body={body} /> : <Surface body={body} />}
      </mesh>

      {body.cloudsTexture && <Clouds body={body} />}
      {body.atmosphere && <Atmosphere body={body} />}

      {hovered && (
        <Html position={[0, -body.size - 0.35, 0]} center>
          <div className="pointer-events-none whitespace-nowrap rounded-full bg-black/70 px-3 py-1 text-sm text-white">
            {body.name}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ---------- Camera fly-to ---------- */
function CameraRig({ selected }) {
  const controls = useThree((s) => s.controls);
  const animating = useRef(false);
  const goalPos = useRef(new THREE.Vector3());
  const goalTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    const body = BODIES.find((b) => b.id === selected);
    if (body) {
      const p = new THREE.Vector3(...body.position);
      goalTarget.current.copy(p);
      goalPos.current.copy(p).add(new THREE.Vector3(0, 0, body.size * 3.2));
    } else {
      goalTarget.current.copy(HOME_TARGET);
      goalPos.current.copy(HOME_POS);
    }
    animating.current = true;
  }, [selected]);

  useEffect(() => {
    if (!controls) return;
    const stop = () => (animating.current = false);
    controls.addEventListener("start", stop);
    return () => controls.removeEventListener("start", stop);
  }, [controls]);

  useFrame((state, delta) => {
    if (!controls || !animating.current) return;
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

/* ---------- Scene ---------- */
export default function SpaceScene({ selected, onSelect }) {
  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 3, 6]} intensity={1.8} />
      <directionalLight position={[-6, 2, 6]} intensity={0.8} color="#9bb8ff" />
      <Suspense fallback={null}>
        <SpaceBackground />
        {BODIES.map((b) => (
          <Planet key={b.id} body={b} onSelect={onSelect} />
        ))}
      </Suspense>
      <OrbitControls makeDefault enablePan={false} minDistance={1} maxDistance={16} />
      <CameraRig selected={selected} />
    </Canvas>
  );
}
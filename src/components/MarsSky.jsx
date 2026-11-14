"use client";

import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const marsSkyVertex = `
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const marsSkyFragment = `
  varying vec3 vWorldPos;

  uniform sampler2D uGalaxy;
  uniform float uGalaxyStrength;

  const float PI = 3.14159265;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n000 = hash(i);
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));

    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);

    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);

    return mix(nxy0, nxy1, f.z);
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  vec2 directionToEquirectUV(vec3 dir) {
    float u = atan(dir.z, dir.x) / (2.0 * PI) + 0.5;
    float v = asin(clamp(dir.y, -1.0, 1.0)) / PI + 0.5;
    return vec2(u, v);
  }

  float proceduralStars(vec3 dir) {
    vec3 p = dir * 420.0;
    vec3 cell = floor(p);
    vec3 local = fract(p);

    float brightness = 0.0;
    for (int x = -1; x <= 1; x++) {
      for (int y = -1; y <= 1; y++) {
        for (int z = -1; z <= 1; z++) {
          vec3 o = vec3(float(x), float(y), float(z));
          vec3 id = cell + o;
          float rnd = hash(id);
          if (rnd < 0.992) continue;

          vec3 starPos = o + vec3(
            hash(id + 1.3),
            hash(id + 2.7),
            hash(id + 4.1)
          );
          float d = length(local - starPos);
          float core = smoothstep(0.09, 0.0, d);
          brightness += core * (0.25 + 0.75 * hash(id + 9.2));
        }
      }
    }
    return brightness;
  }

  void main() {
    vec3 dir = normalize(vWorldPos - cameraPosition);
    float elevation = dir.y;

    // Mars dusty sky gradient (thin CO2 + dust; not deep black space).
    vec3 horizonColor = vec3(0.82, 0.52, 0.34);
    vec3 midColor = vec3(0.45, 0.28, 0.22);
    vec3 zenithColor = vec3(0.22, 0.14, 0.12);

    float height = clamp(elevation * 0.5 + 0.5, 0.0, 1.0);
    float curve = pow(height, 0.72);
    vec3 sky = mix(horizonColor, midColor, smoothstep(0.0, 0.55, curve));
    sky = mix(sky, zenithColor, smoothstep(0.35, 1.0, curve));

    // Horizon glow — dust scattering near the ground.
    float horizonGlow =
      exp(-max(elevation, 0.0) * 2.8) *
      (1.0 - smoothstep(-0.35, 0.15, elevation));
    sky += vec3(0.35, 0.14, 0.05) * horizonGlow;

    // Subtle dust clouds in the air.
    float dust = fbm(dir * 3.5 + vec3(0.0, elevation * 2.0, 0.0));
    sky = mix(sky, sky * 0.92 + vec3(0.08, 0.03, 0.01), dust * 0.22);

    // Faint galactic band, heavily reddened by Martian dust.
    vec2 galaxyUV = directionToEquirectUV(dir);
    vec3 galaxy = texture2D(uGalaxy, galaxyUV).rgb;
    galaxy = pow(galaxy, vec3(1.15));
    galaxy *= vec3(1.05, 0.72, 0.52);

    float aboveHorizon = smoothstep(-0.05, 0.35, elevation);
    float extinction = mix(0.04, 0.18, aboveHorizon);
    sky += galaxy * extinction * uGalaxyStrength;

    // Pinpoint stars (dimmer near horizon, like real dusty air).
    float stars = proceduralStars(dir);
    float starVisibility = mix(0.06, 0.38, smoothstep(0.0, 0.65, elevation));
    sky += vec3(1.0, 0.88, 0.72) * stars * starVisibility;

    gl_FragColor = vec4(sky, 1.0);
  }
`;

function MarsSkyDome({ radius }) {
  const galaxy = useTexture("/textures/milkyway.jpg");

  useEffect(() => {
    galaxy.colorSpace = THREE.SRGBColorSpace;
    galaxy.wrapS = THREE.RepeatWrapping;
    galaxy.wrapT = THREE.ClampToEdgeWrapping;
    galaxy.needsUpdate = true;
  }, [galaxy]);

  const uniforms = useMemo(
    () => ({
      uGalaxy: { value: galaxy },
      uGalaxyStrength: { value: 0.55 },
    }),
    [galaxy]
  );

  return (
    <mesh raycast={() => null} renderOrder={-1}>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial
        vertexShader={marsSkyVertex}
        fragmentShader={marsSkyFragment}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Procedural dusty Martian sky — warm haze, faint reddened stars. */
export default function MarsSky({ radius = 90 }) {
  return (
    <Suspense fallback={null}>
      <MarsSkyDome radius={radius} />
    </Suspense>
  );
}

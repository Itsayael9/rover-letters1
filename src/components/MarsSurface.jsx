
"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import MarsSky from "@/components/MarsSky";
import { marsTerrainHeight } from "@/lib/marsTerrain";

const CRATER = { x: 0, z: -15, radius: 5.2, depth: 4.2 };

function hash(n) {
    const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return v - Math.floor(v);
}

function smoothstep(a, b, x) {
    const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
}

function terrainHeight(x, z) {
    return marsTerrainHeight(x, z);
}

function Terrain() {
    const source = useTexture("/textures/mars.jpg");

    // Clone so tiling the ground does not change the Mars globe in space.
    const texture = useMemo(() => {
        const tiled = source.clone();
        tiled.wrapS = THREE.RepeatWrapping;
        tiled.wrapT = THREE.RepeatWrapping;
        tiled.repeat.set(8, 8);
        tiled.colorSpace = THREE.SRGBColorSpace;
        tiled.anisotropy = 8;
        tiled.needsUpdate = true;
        return tiled;
    }, [source]);

    useEffect(() => {
        return () => texture.dispose();
    }, [texture]);

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(220, 220, 360, 360);
        const positions = geo.attributes.position;
        const colors = [];

        // Warm, light Martian regolith.
        const regolith = new THREE.Color("#E9A078");
        const lighter = new THREE.Color("#FFD0A6");
        const shadowRock = new THREE.Color("#54291F");
        const color = new THREE.Color();

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = -positions.getY(i);
            const h = terrainHeight(x, z);

            positions.setZ(i, h);

            const variation =
                0.5 +
                0.25 * Math.sin(x * 0.12 + z * 0.07) +
                0.15 * Math.sin(x * 0.7 - z * 0.5);

            color.copy(regolith).lerp(
                lighter,
                THREE.MathUtils.clamp(variation * 0.5, 0, 0.35)
            );

            // Darken the crater interior.
            const d = Math.hypot(x - CRATER.x, z - CRATER.z);

            if (d < 5.0) {
                const darkness =
                    0.88 * (1 - smoothstep(1.7, 4.8, d));

                color.lerp(shadowRock, darkness);
            }

            // Warm highlights on elevated terrain.
            if (h > 0.45) {
                color.lerp(lighter, 0.16);
            }

            colors.push(color.r, color.g, color.b);
        }

        geo.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(colors, 3)
        );

        geo.computeVertexNormals();
        return geo;
    }, []);

    useEffect(() => {
        return () => geometry.dispose();
    }, [geometry]);

    return (
        <mesh
            geometry={geometry}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.12, 0]}
            receiveShadow
        >
            <meshStandardMaterial
                map={texture}
                vertexColors
                roughness={1}
                metalness={0}
                color="#FFFFFF"
            />
        </mesh>
    );
}

export default function MarsSurface() {
    return (
        <group>
            <MarsSky radius={180} />
            <fog attach="fog" args={["#b88868", 8, 55]} />

            <Terrain />
        </group>
    );
}

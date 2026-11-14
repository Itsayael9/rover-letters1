"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/** Ring of instanced Mars rocks; opacity 0 hides them. */
export default function RockField({ opacity = 0 }) {
  const ref = useRef(null);
  const count = 40;
  const seeds = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const r = 2 + Math.random() * 4;
      list.push({
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        y: 0.05 + Math.random() * 0.08,
        s: 0.05 + Math.random() * 0.2,
      });
    }
    return list;
  }, []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    seeds.forEach((rock, i) => {
      m.identity();
      m.makeScale(rock.s, rock.s, rock.s);
      m.setPosition(rock.x, rock.y, rock.z);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [seeds]);

  if (opacity < 0.01) return null;

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#6b3a24" transparent opacity={opacity} />
    </instancedMesh>
  );
}

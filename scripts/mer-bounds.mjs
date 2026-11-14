import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { fileURLToPath } from "url";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "../public/models/mer-opportunity-static.glb");

const loader = new GLTFLoader();
loader.load(pathToFileURL(filePath).href, (gltf) => {
  const scene = gltf.scene.clone(true);
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const scale = 4 / maxDim;
  scene.position.sub(center);
  scene.position.y -= box.min.y * scale;
  scene.scale.setScalar(scale);

  scene.updateMatrixWorld(true);
  scene.traverse((obj) => {
    if (!obj.isMesh) return;
    const b = new THREE.Box3().setFromObject(obj);
    const c = b.getCenter(new THREE.Vector3());
    console.log(
      obj.name,
      "center",
      c.toArray().map((n) => n.toFixed(3)),
      "size",
      b.getSize(new THREE.Vector3()).toArray().map((n) => n.toFixed(3))
    );
  });
  const whole = new THREE.Box3().setFromObject(scene);
  console.log("whole minY", whole.min.y.toFixed(4), "maxY", whole.max.y.toFixed(4));
});

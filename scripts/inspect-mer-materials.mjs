import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "../public/models/mer-opportunity-static.glb");
const buffer = fs.readFileSync(filePath);

const loader = new GLTFLoader();
loader.parse(buffer.buffer, path.dirname(filePath), (gltf) => {
  gltf.scene.traverse((obj) => {
    if (!obj.isMesh) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    mats.forEach((m, i) => {
      console.log(
        obj.name,
        m.type,
        "color=#" + (m.color?.getHexString?.() || "?"),
        "map=" + !!m.map,
        "normalMap=" + !!m.normalMap,
        "metalness=" + m.metalness,
        "roughness=" + m.roughness
      );
    });
  });
});

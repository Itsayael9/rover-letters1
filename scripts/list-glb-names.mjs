import fs from "fs";
const b = fs.readFileSync("public/models/mer-opportunity-static.glb");
const t = b.toString("utf8", 0, Math.min(800000, b.length));
const re = /"name":"([^"]+)"/g;
const names = [];
let m;
while ((m = re.exec(t))) {
  if (!names.includes(m[1])) names.push(m[1]);
}
console.log(names.join("\n"));
console.log("--- count", names.length);

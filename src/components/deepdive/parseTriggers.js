/** Collect trigger ids in paragraph order for auto-play. */
export function triggerOrderInSection(section) {
  const re = /\{[^|}]+\|([^}]+)\}/g;
  const ids = [];
  section.paragraphs.forEach((para) => {
    let m;
    while ((m = re.exec(para)) !== null) ids.push(m[1]);
  });
  return ids;
}

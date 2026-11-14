/** Pick the section whose block occupies the reader focus band (stable while swiping). */
export function pickActiveSectionId(scrollRoot, sectionElements) {
  if (!scrollRoot || !sectionElements?.length) return null;

  const rootRect = scrollRoot.getBoundingClientRect();
  const focusMin = rootRect.top + rootRect.height * 0.22;
  const focusMax = rootRect.top + rootRect.height * 0.48;

  let bestId = null;
  let bestOverlap = 0;

  sectionElements.forEach((el) => {
    const id = el.dataset.sectionId;
    if (!id) return;

    const r = el.getBoundingClientRect();
    const overlap = Math.min(r.bottom, focusMax) - Math.max(r.top, focusMin);
    if (overlap <= 0) return;

    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      bestId = id;
    }
  });

  if (bestId) return bestId;

  const focusLine = rootRect.top + rootRect.height * 0.32;
  let nearestId = null;
  let nearestDist = Infinity;
  sectionElements.forEach((el) => {
    const id = el.dataset.sectionId;
    if (!id) return;
    const r = el.getBoundingClientRect();
    if (r.bottom < rootRect.top || r.top > rootRect.bottom) return;
    const dist = Math.abs(r.top + 48 - focusLine);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestId = id;
    }
  });

  return nearestId;
}

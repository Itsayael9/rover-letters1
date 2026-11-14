const TRIGGER_RE = /\{([^|}]+)\|([^}]+)\}/g;
const GLOSSARY_RE = /\{\{([^}]+)\}\}/g;

/** Split paragraph into text, glossary, and 3D trigger tokens. */
export function tokenizeParagraph(text) {
  const combined = /\{\{([^}]+)\}\}|\{([^|}]+)\|([^}]+)\}/g;
  const parts = [];
  let last = 0;
  let m;
  while ((m = combined.exec(text)) !== null) {
    if (m.index > last) parts.push({ kind: "text", value: text.slice(last, m.index) });
    if (m[1] !== undefined) {
      parts.push({ kind: "glossary", key: m[1].trim() });
    } else {
      parts.push({ kind: "trigger", label: m[2], id: m[3] });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ kind: "text", value: text.slice(last) });
  return parts;
}

export { TRIGGER_RE, GLOSSARY_RE };

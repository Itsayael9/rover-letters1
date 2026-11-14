"use client";

import { useDeepDive } from "./DeepDiveContext";

const TRIGGER_RE = /\{([^|}]+)\|([^}]+)\}/g;

function Paragraph({ text, onTrigger }) {
  const parts = [];
  let last = 0;
  let m;
  const re = new RegExp(TRIGGER_RE.source, "g");
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ kind: "text", value: text.slice(last, m.index) });
    parts.push({ kind: "trigger", label: m[1], id: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ kind: "text", value: text.slice(last) });

  return (
    <p className="mb-2">
      {parts.map((p, i) =>
        p.kind === "text" ? (
          <span key={i}>{p.value}</span>
        ) : (
          <button
            key={i}
            type="button"
            className="museum-trigger"
            onClick={() => onTrigger(p.id)}
            aria-label={`Highlight on model: ${p.label}`}
          >
            {p.label}
          </button>
        )
      )}
    </p>
  );
}

/** One exhibit card at a time (shorter than scrolling all parts). */
export default function TextPanel({ sections }) {
  const { activeSectionId, setActiveSectionId, fireTrigger } = useDeepDive();
  const total = sections.length;
  const idx = Math.max(0, sections.findIndex((s) => s.id === activeSectionId));
  const section = sections[idx] ?? sections[0];

  const go = (next) => {
    const i = Math.min(total - 1, Math.max(0, idx + next));
    setActiveSectionId(sections[i].id);
  };

  return (
    <>
      <nav className="museum-nav" aria-label="Exhibit parts">
        <button type="button" disabled={idx <= 0} onClick={() => go(-1)}>
          Previous
        </button>
        <span className="museum-nav-label">
          Part {section.index} of {total}
        </span>
        <button type="button" disabled={idx >= total - 1} onClick={() => go(1)}>
          Next
        </button>
      </nav>

      <article className="museum-body" data-section-id={section.id} key={section.id}>
        <h3>{section.title}</h3>
        <p className="museum-opp-quote">{section.oppLine}</p>
        {section.paragraphs.map((para, i) => (
          <Paragraph key={i} text={para} onTrigger={fireTrigger} />
        ))}
        <ul className="museum-facts">
          {section.nasaFacts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <div className="museum-question">
          <strong>Mission question</strong>
          {section.question}
        </div>
        <div className="museum-links">
          <strong>Check it on NASA</strong>
          <ul className="mt-1 list-disc pl-4">
            {section.sources.map((src) => (
              <li key={src.url}>
                <a href={src.url} target="_blank" rel="noopener noreferrer">
                  {src.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
}

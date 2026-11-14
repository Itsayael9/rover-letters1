"use client";

import { useState } from "react";
import { t } from "@/data/kids/text";

const TONES = ["yellow", "orange", "teal"];

export default function SegmentQuestion({
  question,
  onSolved,
  onSaveAnswer,
  variant,
}) {
  const [picked, setPicked] = useState(null);
  const [wrongTries, setWrongTries] = useState(0);
  const [result, setResult] = useState(null);
  const [solved, setSolved] = useState(false);

  const choose = (opt) => {
    if (solved) return;
    setPicked(opt.id);

    if (opt.correct) {
      const firstTry = wrongTries === 0;
      setSolved(true);
      setResult("correct");
      onSaveAnswer?.({ optionId: opt.id, correct: true, firstTry });
      onSolved?.({
        firstTry,
        stars: 1,
        revealed: false,
        line: question.explanation,
      });
      return;
    }

    const next = wrongTries + 1;
    setWrongTries(next);
    onSaveAnswer?.({ optionId: opt.id, correct: false, firstTry: false });

    if (next >= 2) {
      const right = question.options.find((o) => o.correct);
      setPicked(right?.id ?? opt.id);
      setSolved(true);
      setResult("wrong");
      onSolved?.({
        firstTry: false,
        stars: 0,
        revealed: true,
        line: question.wrongText,
      });
      return;
    }

    setResult("hint");
  };

  const followText =
    result === "correct"
      ? t(question.explanation)
      : result === "wrong"
        ? t(question.wrongText)
        : "";

  const moon = variant === "moon";
  const keys = ["A", "B", "C"];
  const status =
    result === "hint"
      ? `${t({ en: "Hmm, not that one." })} ${t(question.hint)}`
      : followText;

  return (
    <div className={`kids-qcard${moon ? " kids-qcard--moon" : ""}`}>
      {moon ? (
        <div className="s3-qchip" aria-hidden="true">
          <span className="s3-qchip-face">◉‿◉</span>
          <span>Surveyor 3</span>
        </div>
      ) : null}
      <p className="kids-qcard-prompt">{t(question.prompt)}</p>
      <div className="kids-qcard-options" role="group" aria-label="Choose an answer">
        {question.options.map((opt, i) => (
          <button
            key={opt.id}
            type="button"
            disabled={solved && !opt.correct && picked !== opt.id}
            className={`${moon ? "s3-qopt" : `kids-qbtn tone-${TONES[i % TONES.length]}`}${
              picked === opt.id ? " is-picked" : ""
            }${solved && opt.correct ? " is-right" : ""}`}
            onClick={() => choose(opt)}
          >
            {moon ? <span className="s3-qopt-key">{keys[i] ?? i + 1}</span> : null}
            <span>{t(opt.label)}</span>
          </button>
        ))}
      </div>
      {moon && status ? (
        <p className={`s3-qstatus${result === "correct" ? " is-ok" : result === "hint" ? " is-hint" : ""}`} role="status">
          {status}
        </p>
      ) : null}
      {!moon && result === "hint" ? (
        <p className="kids-qcard-hint" role="status">
          {`${t({ en: "Hmm, not that one." })} ${t(question.hint)}`}
        </p>
      ) : null}
      {!moon && followText ? (
        <p className="kids-qcard-explain" role="status">
          {followText}
        </p>
      ) : null}
    </div>
  );
}

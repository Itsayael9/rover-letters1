"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import MemoryKeeperCertificate from "@/components/certificate/MemoryKeeperCertificate";
import {
  allMachinesComplete,
  certificateMachineList,
  machineIds,
  useProgress,
} from "@/state/progress";

export default function CertificateModal({ open, onClose }) {
  const { completedMachines, ready } = useProgress();
  const [childName, setChildName] = useState("");
  const [personalized, setPersonalized] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const exportRef = useRef(null);

  const allMachines = certificateMachineList();
  const required = machineIds();
  const unlocked = ready && allMachinesComplete(completedMachines);
  const completedList = allMachines.filter((m) => completedMachines.includes(m.id));
  const found = completedList.length;
  const total = required.length;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setPersonalized(false);
      setChildName("");
    }
  }, [open]);

  const generate = () => {
    if (!unlocked || !childName.trim()) return;
    setPersonalized(true);
  };

  const downloadPng = useCallback(async () => {
    const node = exportRef.current;
    if (!node || !personalized || !childName.trim()) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        cacheBust: true,
        width: 1050,
        height: Math.round(1050 * (210 / 297)),
      });
      const link = document.createElement("a");
      const safe = childName.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") || "memory-keeper";
      link.download = `rover-letters-certificate-${safe}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  }, [childName, personalized]);

  if (!open) return null;

  const certMode = personalized && childName.trim() ? "personal" : "preview";
  const certMachines = personalized ? completedList : allMachines;

  return (
    <div className="cert-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="cert-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="cert-modal-head">
          <h2 id="cert-modal-title">
            {unlocked ? "Memory Keeper Certificate" : "Certificate preview"}
          </h2>
          <button type="button" className="cert-btn-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="cert-modal-scroll">
          <div className="cert-modal-scale">
            <MemoryKeeperCertificate
              mode={certMode}
              childName={childName}
              machines={certMachines}
            />
          </div>
        </div>

        <footer className="cert-modal-foot">
          <p className="cert-modal-progress">
            Machines remembered: {found} / {total}
          </p>

          {!unlocked ? (
            <p className="cert-modal-note">
              Visit and finish every mission on Mars and the Moon to unlock your personalized
              certificate. You can preview the template anytime.
            </p>
          ) : !personalized ? (
            <>
              <p className="cert-modal-note">You unlocked the certificate! Enter your name, then generate it.</p>
              <div className="cert-modal-form">
                <label htmlFor="cert-child-name">Your first name</label>
                <input
                  id="cert-child-name"
                  type="text"
                  className="cert-modal-input"
                  value={childName}
                  maxLength={40}
                  autoComplete="given-name"
                  placeholder="e.g. Sara"
                  onChange={(e) => setChildName(e.target.value)}
                />
                <div className="cert-modal-actions">
                  <button
                    type="button"
                    className="cert-btn cert-btn-primary"
                    disabled={!childName.trim()}
                    onClick={generate}
                  >
                    Generate My Certificate
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="cert-modal-note">
                Happy exploring, {childName.trim()}! Download your certificate as a PNG.
              </p>
              <div className="cert-modal-actions">
                <button
                  type="button"
                  className="cert-btn cert-btn-primary"
                  disabled={downloading}
                  onClick={downloadPng}
                >
                  {downloading ? "Saving…" : "Download PNG"}
                </button>
                <button
                  type="button"
                  className="cert-btn cert-btn-ghost"
                  onClick={() => setPersonalized(false)}
                >
                  Edit name
                </button>
              </div>
            </>
          )}
        </footer>
      </div>

      {personalized && childName.trim() ? (
        <div className="cert-export-hidden" aria-hidden="true">
          <MemoryKeeperCertificate
            ref={exportRef}
            mode="personal"
            childName={childName}
            machines={completedList}
          />
        </div>
      ) : null}
    </div>
  );
}
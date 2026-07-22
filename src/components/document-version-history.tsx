"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createDocumentVersion,
  duplicateDocumentVersion,
  restoreDocumentVersion,
  type DocumentVersionActionState,
} from "@/app/hub/actions";

export type DocumentVersionSummary = {
  id: string;
  title: string;
  versionDate: string;
  status: "saved" | "finalized";
  notes: string;
  creator: string;
  createdAt: string;
  recipient: string;
  artifact?: {
    fileName: string;
    byteLength: number;
    sha256: string;
  };
};

const idleState: DocumentVersionActionState = { status: "idle", message: "" };

function formatDate(value: string) {
  if (!value) return "Not dated";
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export function DocumentVersionHistory({
  documentType,
  currentPayload,
  defaultTitle,
  defaultDate,
  versions,
  finalizationBlocked,
}: {
  documentType: "business_plan" | "fundraising_package";
  currentPayload: string;
  defaultTitle: string;
  defaultDate: string;
  versions: DocumentVersionSummary[];
  finalizationBlocked: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(defaultTitle);
  const [versionDate, setVersionDate] = useState(defaultDate || new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState(idleState);
  const [pending, startTransition] = useTransition();

  function saveVersion(status: "saved" | "finalized") {
    const data = new FormData();
    data.set("documentType", documentType);
    data.set("status", status);
    data.set("title", title);
    data.set("versionDate", versionDate);
    data.set("notes", notes);
    data.set("payload", currentPayload);
    startTransition(async () => {
      const next = await createDocumentVersion(idleState, data);
      setResult(next);
      if (next.status === "success") {
        setNotes("");
        router.refresh();
      }
    });
  }

  function duplicate(id: string) {
    const data = new FormData();
    data.set("id", id);
    startTransition(async () => {
      const next = await duplicateDocumentVersion(data);
      setResult(next);
      if (next.status === "success") router.refresh();
    });
  }

  function restore(id: string, versionTitle: string) {
    if (!window.confirm(`Replace the active working draft with “${versionTitle}”? The archived version will remain unchanged.`)) return;
    const data = new FormData();
    data.set("id", id);
    startTransition(async () => {
      const next = await restoreDocumentVersion(data);
      setResult(next);
      if (next.status === "success") router.refresh();
    });
  }

  return (
    <div className="document-version-workspace">
      <section className="planner-card document-version-create">
        <div className="planner-card-heading">
          <div>
            <p className="eyebrow">Milestone version</p>
            <h3>Preserve the current working draft</h3>
            <p>Routine changes continue to autosave. Only these deliberate actions add an immutable entry to history.</p>
          </div>
        </div>
        <div className="business-plan-form-grid two">
          <label className="business-plan-field">Version title<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <label className="business-plan-field">Version date<input type="date" value={versionDate} onChange={(event) => setVersionDate(event.target.value)} /></label>
          <label className="business-plan-field wide">Version notes<textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What changed, why this milestone matters, or who reviewed it" /></label>
        </div>
        <div className="document-version-create-actions">
          <button className="planner-secondary-button" type="button" disabled={pending || !title || !versionDate} onClick={() => saveVersion("saved")}>Save version</button>
          <button className="hub-save-button" type="button" disabled={pending || finalizationBlocked || !title || !versionDate} onClick={() => saveVersion("finalized")}>Finalize and preserve export</button>
          {finalizationBlocked ? <small>Resolve blocking review items before finalizing. A milestone version can still be saved.</small> : <small>Finalizing stores the exact ZIP or HTML generated now.</small>}
        </div>
      </section>

      {result.message ? <div className={`planner-save-message ${result.status}`} role={result.status === "error" ? "alert" : "status"}>{result.message}</div> : null}

      <section className="document-version-list" aria-label="Version history">
        <div className="document-version-list-heading">
          <div><p className="eyebrow">Version history</p><h3>{versions.length ? `${versions.length} preserved version${versions.length === 1 ? "" : "s"}` : "No milestone versions yet"}</h3></div>
          <p>Snapshots remain unchanged when duplicated or restored.</p>
        </div>
        {versions.length ? versions.map((version) => (
          <article className="document-version-card" key={version.id}>
            <div className="document-version-card-main">
              <div className="document-version-card-title">
                <span className={`document-version-status ${version.status}`}>{version.status === "finalized" ? "Finalized" : "Saved version"}</span>
                <h4>{version.title}</h4>
              </div>
              <dl>
                <div><dt>Version date</dt><dd>{formatDate(version.versionDate)}</dd></div>
                <div><dt>Creator</dt><dd>{version.creator}</dd></div>
                {version.recipient ? <div><dt>Prepared for</dt><dd>{version.recipient}</dd></div> : null}
                <div><dt>Export</dt><dd>{version.artifact ? `Preserved exactly · ${formatBytes(version.artifact.byteLength)}` : "Generated on download"}</dd></div>
              </dl>
              {version.notes ? <p className="document-version-notes">{version.notes}</p> : null}
              {version.artifact ? <small className="document-version-hash">SHA-256 {version.artifact.sha256.slice(0, 16)}…</small> : null}
            </div>
            <div className="document-version-actions">
              <a href={`/hub/versions/${version.id}/preview`} target="_blank" rel="noreferrer">Preview</a>
              <a href={`/hub/versions/${version.id}/download`}>Download</a>
              <button type="button" disabled={pending} onClick={() => duplicate(version.id)}>Duplicate</button>
              <button type="button" disabled={pending} onClick={() => restore(version.id, version.title)}>Restore as draft</button>
            </div>
          </article>
        )) : <div className="document-version-empty"><strong>The active draft is autosaved, but it is not yet part of history.</strong><p>Use “Save version” for a meaningful milestone or “Finalize” when the document is ready to share.</p></div>}
      </section>
    </div>
  );
}

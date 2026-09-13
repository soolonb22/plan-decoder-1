import { useEffect, useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Disclaimer } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import {
  CASE_NOTES_DISCLAIMER,
  CASE_NOTES_PLUM,
  CASE_NOTES_TAGLINE,
  CASE_NOTES_TITLE,
  CASE_NOTE_SYSTEMS,
  EVIDENCE_TYPES,
  HOUSING_FORM_FACTS,
  SAFETY_LINE,
  addEvidenceNote,
  createEmptyDraft,
  exportDraftJson,
  loadDrafts,
  parseCaseWalkSearch,
  removeDraft,
  removeEvidenceNote,
  upsertDraft,
  walkSearchFor,
  type CaseDraft,
  type CaseEvidenceType,
  type CaseWalkSearch,
} from "@/lib/case-notes";
import { cn, downloadText } from "@/lib/utils";

export const Route = createFileRoute("/case-notes")({
  validateSearch: (raw: Record<string, unknown>): CaseWalkSearch => parseCaseWalkSearch(raw),
  component: CaseNotesPage,
  head: () => ({
    meta: [
      { title: CASE_NOTES_TITLE },
      {
        name: "description",
        content:
          "Plan Decoder Case notes — practise a housing, NDIS, provider, school, health, or Centrelink conversation draft on this device. Not a government system. Not an official NDIS Navigator. Not legal advice.",
      },
    ],
  }),
});

function CaseNotesPage() {
  const search = Route.useSearch();
  const [drafts, setDrafts] = useState<CaseDraft[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [ready, setReady] = useState(false);
  const [evidenceLabel, setEvidenceLabel] = useState("");
  const [evidenceType, setEvidenceType] = useState<CaseEvidenceType>("note");
  const [evidenceDescription, setEvidenceDescription] = useState("");

  useEffect(() => {
    const rows = loadDrafts();
    setDrafts(rows);
    const fromNote = search.note ? rows.find((row) => row.id === search.note) : undefined;
    if (fromNote) {
      setSelectedId(fromNote.id);
      setReady(true);
      return;
    }
    if (search.system || search.situation) {
      const draft = createEmptyDraft(search.system);
      draft.situation = search.situation ?? "";
      const saved = upsertDraft(draft);
      setDrafts(loadDrafts());
      setSelectedId(saved.id);
      setReady(true);
      return;
    }
    setSelectedId(rows[0]?.id ?? "");
    setReady(true);
  }, [search.note, search.situation, search.system]);

  const draft = useMemo(
    () => drafts.find((row) => row.id === selectedId) ?? null,
    [drafts, selectedId],
  );

  function persist(next: CaseDraft) {
    const saved = upsertDraft(next);
    setDrafts(loadDrafts());
    setSelectedId(saved.id);
  }

  function startNew() {
    const next = upsertDraft(createEmptyDraft(search.system ?? "Housing"));
    setDrafts(loadDrafts());
    setSelectedId(next.id);
  }

  function onDelete() {
    if (!draft) return;
    if (!window.confirm("Delete this draft from this device? This does not file anything with government.")) return;
    removeDraft(draft.id);
    const rows = loadDrafts();
    setDrafts(rows);
    setSelectedId(rows[0]?.id ?? "");
  }

  function onAddEvidence() {
    if (!draft) return;
    if (!evidenceLabel.trim() && !evidenceDescription.trim()) return;
    persist(
      addEvidenceNote(draft, {
        label: evidenceLabel.trim() || "Note",
        type: evidenceType,
        description: evidenceDescription.trim(),
      }),
    );
    setEvidenceLabel("");
    setEvidenceDescription("");
    setEvidenceType("note");
  }

  return (
    <div>
      <header className="mb-6">
        <p className="text-sm font-semibold" style={{ color: CASE_NOTES_PLUM }}>
          Independent practice tool
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: CASE_NOTES_PLUM }}>
          {CASE_NOTES_TITLE}
        </h1>
        <p className="mt-2 max-w-2xl text-muted">{CASE_NOTES_TAGLINE}</p>
      </header>

      <Disclaimer>{CASE_NOTES_DISCLAIMER}</Disclaimer>
      <p className="mt-3 rounded-xl border border-line bg-card px-4 py-3 text-sm">{SAFETY_LINE}</p>

      <Card className="mt-5">
        <p className="text-sm font-medium">Attach this draft to a Systems walk</p>
        <p className="mt-1 text-sm text-muted">
          Systems walk is the rehearsal map. Community navigator is a different walk for local doors. This page only
          keeps notes on this device.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" asChild>
            <Link to="/systems-walk" search={draft ? walkSearchFor(draft) : {}}>
              Open Systems walk
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/navigator" search={{ tab: "walk" }}>
              Open Community navigator
            </Link>
          </Button>
        </div>
      </Card>

      <div className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Drafts on this device</h2>
            <p className="mt-1 text-sm text-muted">Nothing is uploaded. Nothing is sent to an API.</p>
          </div>
          <Button type="button" variant="secondary" onClick={startNew}>
            New draft
          </Button>
        </div>
        {!ready ? <p className="mt-3 text-sm text-muted">Opening notes on this device…</p> : null}
        {ready && drafts.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No drafts yet. Start one below.</p>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {drafts.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setSelectedId(row.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left",
                  selectedId === row.id ? "bg-primary-soft" : "border-line bg-card",
                )}
                style={selectedId === row.id ? { borderColor: CASE_NOTES_PLUM } : undefined}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{row.system}</p>
                <p className="mt-1 font-semibold">{row.title || "Untitled draft"}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{row.situation || "No situation written yet."}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {draft ? (
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold">1. Which system?</h2>
            <p className="mt-1 text-sm text-muted">Same set as Systems walk. Housing, NDIS, providers, school, health, Centrelink.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {CASE_NOTE_SYSTEMS.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => persist({ ...draft, system: name })}
                  className={cn(
                    "rounded-2xl border p-4 text-left",
                    draft.system === name ? "bg-primary-soft" : "border-line bg-card",
                  )}
                  style={draft.system === name ? { borderColor: CASE_NOTES_PLUM } : undefined}
                >
                  <p className="font-semibold">{name}</p>
                </button>
              ))}
            </div>
          </div>

          {draft.system === "Housing" ? (
            <Card>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: CASE_NOTES_PLUM }}>
                Queensland housing papers
              </p>
              <p className="mt-1 text-sm text-muted">
                These names are for practice only. Read the paper in your hand. This is not the RTA.
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {HOUSING_FORM_FACTS.map((fact) => (
                  <li key={fact.form}>
                    <span className="font-semibold">{fact.form}</span>
                    {" = "}
                    {fact.meaning}
                    {fact.href ? (
                      <>
                        {" "}
                        Official:{" "}
                        <a
                          className="font-medium underline-offset-2 hover:underline"
                          style={{ color: CASE_NOTES_PLUM }}
                          href={fact.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {fact.href}
                        </a>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          <div>
            <h2 className="text-lg font-semibold">2. Title and situation</h2>
            <p className="mt-1 text-sm text-muted">Plain text. Your words. A notice, a letter, a meeting.</p>
            <div className="mt-3 space-y-3">
              <Field label="Title" hint="A short name so you can find this draft later.">
                <Input
                  value={draft.title}
                  onChange={(e) => persist({ ...draft, title: e.target.value })}
                  placeholder="e.g. Form 11 — talk first"
                />
              </Field>
              <Field label="Situation" hint="Short and plain is enough.">
                <Textarea
                  value={draft.situation}
                  onChange={(e) => persist({ ...draft, situation: e.target.value })}
                  rows={4}
                  placeholder="e.g. Form 11 issued; I do not agree there was a breach"
                />
              </Field>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">3. Evidence notes</h2>
            <p className="mt-1 text-sm text-muted">
              Label, type, and a description. Metadata only. Do not upload files. Plan PDFs are not read here.
            </p>
            <ul className="mt-3 space-y-2">
              {draft.evidence.length === 0 ? (
                <li className="rounded-xl border border-dashed border-line px-4 py-3 text-sm text-muted">
                  No evidence notes yet. A label and a sentence is enough.
                </li>
              ) : (
                draft.evidence.map((item) => (
                  <li key={item.id} className="rounded-2xl border border-line bg-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{item.type}</p>
                        <p className="font-semibold">{item.label}</p>
                        <p className="mt-1 text-sm text-muted">{item.description}</p>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => persist(removeEvidenceNote(draft, item.id))}>
                        Remove
                      </Button>
                    </div>
                  </li>
                ))
              )}
            </ul>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Label">
                <Input
                  value={evidenceLabel}
                  onChange={(e) => setEvidenceLabel(e.target.value)}
                  placeholder="e.g. Form 11 copy"
                />
              </Field>
              <Field label="Type">
                <select
                  className="h-11 w-full rounded-lg border border-line bg-card px-3 text-base text-ink"
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value as CaseEvidenceType)}
                >
                  {EVIDENCE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Description" hint="What it is, where you keep it. No file is stored here.">
              <Textarea
                className="mt-3"
                value={evidenceDescription}
                onChange={(e) => setEvidenceDescription(e.target.value)}
                rows={3}
                placeholder="e.g. Paper notice. Date received written on the back."
              />
            </Field>
            <Button type="button" className="mt-3" variant="secondary" onClick={onAddEvidence}>
              Add evidence note
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild style={{ backgroundColor: CASE_NOTES_PLUM }}>
              <Link to="/systems-walk" search={walkSearchFor(draft)}>
                Walk this
              </Link>
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                downloadText(
                  `plan-decoder-case-notes-${draft.system.toLowerCase()}.json`,
                  exportDraftJson(draft),
                )
              }
            >
              Download JSON to this device
            </Button>
            <Button type="button" variant="ghost" onClick={onDelete}>
              Delete draft
            </Button>
          </div>
        </div>
      ) : ready ? (
        <Card className="mt-8">
          <p className="font-medium">Start a practice draft</p>
          <p className="mt-1 text-sm text-muted">Pick a system, write the situation, and keep evidence as notes only.</p>
          <Button className="mt-3" type="button" onClick={startNew} style={{ backgroundColor: CASE_NOTES_PLUM }}>
            New draft
          </Button>
        </Card>
      ) : null}
    </div>
  );
}

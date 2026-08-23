import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DOMAINS } from "@/lib/content/language";
import { useOllie } from "@/lib/store";
import { todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Textarea } from "@/components/ui/input";
import { MembershipGate, PageHeader } from "@/components/layout/page";
import { DraftWithOllie } from "@/components/draft-with-ollie";

export const Route = createFileRoute("/clinical")({ component: ClinicalPage });

function ClinicalPage() {
  const add = useOllie((s) => s.addEvidence);
  const [notes, setNotes] = useState("");
  const [domain, setDomain] = useState<string>(DOMAINS[0].id);

  return (
    <MembershipGate need="pro">
      <PageHeader
        title="Clinical language builder"
        lede="For allied health and coordinators. Translate clinical notes into NDIS functional language without over-claiming."
      />
      <Card className="space-y-3">
        <Field label="Life area">
          <select
            className="h-11 w-full rounded-lg border border-line bg-card px-3"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            {DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Clinical or session notes (your words)">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observed difficulty initiating hygiene without a known support person. Two prompts insufficient. Task abandoned at 40 minutes."
          />
        </Field>
        <Button
          disabled={!notes.trim()}
          onClick={() =>
            add({
              title: "Clinical working note",
              body: notes,
              type: "clinical",
              domain: domain as never,
              tags: ["clinical"],
              date: todayISO(),
              source: "Clinical language builder",
            })
          }
        >
          File in vault
        </Button>
      </Card>
      <div className="mt-4">
        <DraftWithOllie
          kind="clinical-language"
          notes={notes}
          prompt="Rewrite these notes as NDIS-ready functional language for a support letter. No diagnosis. No guarantee of funding. Include frequency if present. Use the life area as a heading. Australian English. Clinician-facing but still plain."
        />
      </div>
    </MembershipGate>
  );
}

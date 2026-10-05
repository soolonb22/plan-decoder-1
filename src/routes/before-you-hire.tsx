import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { guideSections } from "@/lib/hire/sections";

export const Route = createFileRoute("/before-you-hire")({
  component: BeforeYouHirePage,
  head: () => ({
    meta: [
      { title: "Before you hire · Plan Decoder" },
      {
        name: "description",
        content:
          "Plain-language guide before you hire a support worker or other professional. Not legal advice. Not the NDIA.",
      },
    ],
  }),
});

function BeforeYouHirePage() {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const sections = guideSections();

  async function download() {
    setBusy(true);
    setNote(null);
    try {
      const { downloadGuide } = await import("@/lib/hire/pdf");
      await downloadGuide();
      setNote("Guide PDF downloaded to this device.");
    } catch {
      setNote("The PDF could not be built in this browser. You can still read the guide on this page.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Before you hire"
        lede="What to check before you hire a support worker or other professional. Read it here, or download the PDF. There is no form."
      />
      <Disclaimer>
        This is preparation, not legal advice and not an NDIA form. It does not decide funding, safety, or whether a
        provider is allowed to charge a fee. Check ndis.gov.au before you sign. It is not an NDIS support and cannot
        be paid from a plan.
      </Disclaimer>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="button" disabled={busy} onClick={() => void download()}>
          {busy ? "Building…" : "Download the guide PDF"}
        </Button>
        <Link to="/service-agreement" className="text-sm font-medium text-primary underline-offset-2 hover:underline">
          Need the agreement instead
        </Link>
      </div>
      {note ? (
        <p className="mt-4 rounded-xl bg-primary-soft px-4 py-3 text-sm" role="status">
          {note}
        </p>
      ) : null}
      <div className="mt-6 space-y-4">
        {sections.map((section) => (
          <Card key={section.heading}>
            <h2 className="text-xl font-semibold text-primary-deep">{section.heading}</h2>
            <div className="mt-3 space-y-3 text-ink">
              {section.body.split("\n").map((line, index) =>
                line.trim() ? <p key={index}>{line}</p> : null,
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

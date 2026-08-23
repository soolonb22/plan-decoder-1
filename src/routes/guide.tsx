import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GuideFlow, GuidePicker } from "@/components/guide-flow";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { useOllie } from "@/lib/store";

export const Route = createFileRoute("/guide")({ component: GuidePage });

function GuidePage() {
  const last = useOllie((s) => s.lastGuide);
  const [id, setId] = useState<string | null>(last || null);
  return (
    <div>
      <PageHeader
        title="Let’s take this one step at a time."
        lede="Choose a goal. Answer a few questions. Leave with words you can use — and edit."
        picture="/brand/story-path.jpg"
      />
      <Disclaimer>
        Guided drafts are starting points. They are not legal advice, clinical reports, or NDIA decisions.
      </Disclaimer>
      <div className="mt-6">
        {id ? (
          <GuideFlow
            flowId={id}
            onExit={() => {
              setId(null);
              useOllie.setState({ lastGuide: "" });
            }}
          />
        ) : (
          <GuidePicker
            onPick={(next) => {
              setId(next);
              useOllie.setState({ lastGuide: next });
            }}
          />
        )}
      </div>
    </div>
  );
}

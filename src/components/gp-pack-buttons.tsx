import { useState } from "react";
import { Download } from "lucide-react";
import { useActiveClient, useClientList } from "@/lib/store";
import { downloadText } from "@/lib/utils";
import { buildGpPackText, downloadGpPackPdf } from "@/lib/gp-pack";
import { Button } from "@/components/ui/button";

export function GpPackButtons({ size = "sm" }: { size?: "sm" | "default" }) {
  const [busy, setBusy] = useState(false);
  const client = useActiveClient();
  const evidence = useClientList("evidence");
  const logs = useClientList("logs");
  const flags = useClientList("flags");
  const goals = useClientList("goals");
  const schoolNotes = useClientList("schoolNotes");
  const fluctuations = useClientList("fluctuations");
  const appointments = useClientList("appointments");
  const meetings = useClientList("meetings");
  const checklist = useClientList("checklist");
  const whodas = useClientList("whodas");
  const claims = useClientList("claims");
  const providers = useClientList("providers");
  const budgets = useClientList("budgets");

  const input = {
    client,
    evidence,
    logs,
    flags,
    goals,
    schoolNotes,
    fluctuations,
    appointments,
    meetings,
    checklist,
    whodas,
    claims,
    providers,
    budgets,
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size={size}
        disabled={busy}
        onClick={() => {
          setBusy(true);
          void downloadGpPackPdf(input).finally(() => setBusy(false));
        }}
      >
        <Download />
        {busy ? "Making PDF…" : "GP pack (PDF)"}
      </Button>
      <Button
        size={size}
        variant="secondary"
        onClick={() => downloadText("plan-decoder-gp-pack.txt", buildGpPackText(input))}
      >
        GP pack (text)
      </Button>
    </div>
  );
}

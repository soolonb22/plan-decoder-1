import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GLOSSARY } from "@/lib/content/glossary";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/glossary")({ component: GlossaryPage });

function GlossaryPage() {
  const [q, setQ] = useState("");
  const items = useMemo(() => {
    const n = q.toLowerCase();
    return GLOSSARY.filter(
      (g) => !n || g.term.toLowerCase().includes(n) || g.plain.toLowerCase().includes(n),
    );
  }, [q]);
  return (
    <div>
      <PageHeader title="Glossary" lede="NDIS words in ordinary English." />
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a word" className="mb-4" />
      <div className="space-y-2">
        {items.map((g) => (
          <Card key={g.term} className="py-4">
            <p className="font-semibold">{g.term}</p>
            <p className="mt-1 text-sm text-muted">{g.plain}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

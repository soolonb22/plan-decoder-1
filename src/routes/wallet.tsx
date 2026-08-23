import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DOMAINS } from "@/lib/content/language";
import { useOllie, useClientList } from "@/lib/store";
import { formatDate, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Disclaimer, EmptyState, MembershipGate, PageHeader } from "@/components/layout/page";
import type { EvidenceType, WhodasDomain } from "@/lib/types";

export const Route = createFileRoute("/wallet")({ component: WalletPage });

const TYPES: EvidenceType[] = [
  "observation",
  "carer",
  "clinical",
  "school",
  "letter",
  "plan",
  "photo-note",
  "other",
];

function WalletPage() {
  const add = useOllie((s) => s.addEvidence);
  const remove = useOllie((s) => s.removeEvidence);
  const items = useClientList("evidence");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<EvidenceType>("observation");
  const [domain, setDomain] = useState<WhodasDomain | "">("");
  const [date, setDate] = useState(todayISO());
  const [source, setSource] = useState("");

  return (
    <MembershipGate need="core">
      <PageHeader
        title="Evidence Wallet"
        lede="Short, dated notes about function. One note per situation is enough. It stays on this device."
        picture="/brand/story-wallet.jpg"
        actions={
          <Button onClick={() => setOpen((v) => !v)}>{open ? "Close" : "Add a note"}</Button>
        }
      />
      <Disclaimer>
        Keep originals of clinical reports. This wallet is your working file on this device — not an official NDIS record.
      </Disclaimer>
      {open ? (
        <Card className="mt-5 space-y-3">
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Morning routine needs two people" />
          </Field>
          <Field label="What happened, how often, what support changes">
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Kind">
              <select
                className="h-11 w-full rounded-lg border border-line bg-card px-3"
                value={type}
                onChange={(e) => setType(e.target.value as EvidenceType)}
              >
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Life area">
              <select
                className="h-11 w-full rounded-lg border border-line bg-card px-3"
                value={domain}
                onChange={(e) => setDomain(e.target.value as WhodasDomain | "")}
              >
                <option value="">Not sure yet</option>
                {DOMAINS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Source">
              <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Carer / OT / school" />
            </Field>
          </div>
          <Button
            onClick={() => {
              if (!title.trim() || !body.trim()) return;
              add({ title, body, type, domain, tags: domain ? [domain] : [], date, source });
              setTitle("");
              setBody("");
              setOpen(false);
            }}
          >
            Save on this device
          </Button>
        </Card>
      ) : null}
      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyState
            title="The wallet is empty"
            body="Add one observation from this week. Frequency and what happens without support matter more than long stories."
          />
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    {formatDate(item.date)} · {item.type}
                    {item.source ? ` · ${item.source}` : ""}
                  </p>
                </div>
                <Badge>{item.domain || "unfiled"}</Badge>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{item.body}</p>
              <Button className="mt-3" size="sm" variant="ghost" onClick={() => remove(item.id)}>
                Remove
              </Button>
            </Card>
          ))
        )}
      </div>
    </MembershipGate>
  );
}

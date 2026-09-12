import type { ReactNode } from "react";
import { SYSTEMS_WALK_PLUM, type NavigatorReport } from "@/lib/systems-walk";
import { Card } from "@/components/ui/card";

const KEY_LABELS: Record<string, string> = {
  form11: "Form 11",
  systemDoor: "Which door",
  whatThisIs: "What this is",
  whatThisIsNot: "What this is not",
  usualWindow: "Usual window",
  wordsYouCanUse: "Words you can use",
  notTryingTo: "Not trying to",
};

function prettyKey(key: string) {
  if (KEY_LABELS[key]) return KEY_LABELS[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toLowerCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function isOfficial(value: unknown): value is { name: string; href: string } {
  return Boolean(
    value &&
      typeof value === "object" &&
      "href" in value &&
      typeof (value as { href: unknown }).href === "string" &&
      "name" in value,
  );
}

function ValueView({ value }: { value: unknown }) {
  if (value == null || value === "") return null;
  if (typeof value === "boolean") return <p>{value ? "Yes" : "No"}</p>;
  if (typeof value === "string" || typeof value === "number") {
    return <p className="text-sm leading-relaxed">{String(value)}</p>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    if (value.every(isOfficial)) {
      return (
        <ul className="mt-1 space-y-1 text-sm">
          {value.map((item) => (
            <li key={item.href}>
              <a
                className="font-medium underline-offset-2 hover:underline"
                style={{ color: SYSTEMS_WALK_PLUM }}
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
        {value.map((item, i) => (
          <li key={i}>
            {typeof item === "string" ? item : <ValueView value={item} />}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === "object") {
    return (
      <dl className="mt-2 space-y-3">
        {Object.entries(value as Record<string, unknown>).map(([key, item]) => (
          <div key={key}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{prettyKey(key)}</dt>
            <dd className="mt-1">
              <ValueView value={item} />
            </dd>
          </div>
        ))}
      </dl>
    );
  }
  return null;
}

function Section({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: SYSTEMS_WALK_PLUM }}>
        {kicker}
      </p>
      <h2 className="mt-1 text-lg font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </Card>
  );
}

export function SystemsWalkReport({ report }: { report: NavigatorReport }) {
  return (
    <div className="space-y-4">
      <Section kicker="Scenario" title="What you brought">
        <ValueView value={report.scenario} />
      </Section>
      <Section kicker="World model" title="What this paper is">
        <ValueView value={report.worldModel} />
      </Section>
      <Section kicker="Interpretations" title="What it can mean">
        <ul className="space-y-2">
          {report.interpretations.map((item) => (
            <li key={item.meaning} className="rounded-xl bg-paper-2 px-3 py-2 text-sm">
              {item.meaning}
            </li>
          ))}
        </ul>
      </Section>
      <Section kicker="Intent" title="What we are practising">
        <ValueView value={report.intent} />
      </Section>
      <Section kicker="Risks" title="Watch-fors">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {report.risks.risks_detected.map((risk) => (
            <li key={risk}>{risk}</li>
          ))}
        </ul>
      </Section>
      <Section kicker="Routes" title="What to try, in order">
        <ol className="space-y-4">
          {report.routes.map((route) => (
            <li key={route.name}>
              <p className="font-semibold">{route.name}</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
                {route.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

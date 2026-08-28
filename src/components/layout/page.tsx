import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ACCESS_BOUNDARY } from "@/lib/access-copy";
import { CREDIT_PRICE_AUD, MEMBERSHIP_PRICE_AUD } from "@/lib/billing";
import { canAccess } from "@/lib/membership";
import type { Membership } from "@/lib/types";
import { useOllie } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeWordUnlock } from "@/components/code-word";

export function PageHeader({
  title,
  lede,
  actions,
  picture,
}: {
  title: string;
  lede?: string;
  actions?: ReactNode;
  picture?: string;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="welcome-row max-w-2xl">
        {picture ? <img src={picture} alt="" width={56} height={56} /> : null}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
          {lede ? <p className="mt-2 text-muted">{lede}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-dashed py-10 text-center">
      <p className="font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">{body}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </Card>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary-deep">{children}</p>
  );
}

export function MembershipGate({
  need,
  children,
}: {
  need: Membership;
  children: ReactNode;
}) {
  const membership = useOllie((s) => s.membership);
  if (canAccess(membership, need)) return children;
  const name = need === "pro" ? "Professional" : "Core";
  return (
    <Card className="max-w-xl">
      <p className="text-sm font-medium text-primary">Membership needed</p>
      <h2 className="mt-1 text-xl font-semibold">This is part of {name}</h2>
      <p className="mt-2 text-sm text-muted">
        {ACCESS_BOUNDARY}
        {need === "pro"
          ? ` Professional is $${MEMBERSHIP_PRICE_AUD.pro} a month for coordinators, coaches, clinicians, and schools.`
          : ` Finished reports and polished drafts then use 1 credit ($${CREDIT_PRICE_AUD}) each.`}
      </p>
      <div className="mt-5 rounded-xl bg-paper-2 px-4 py-4">
        <p className="mb-3 text-sm font-medium">Have a code word?</p>
        <CodeWordUnlock need={need} compact />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/membership">See membership</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/pricing">Pricing</Link>
        </Button>
      </div>
    </Card>
  );
}

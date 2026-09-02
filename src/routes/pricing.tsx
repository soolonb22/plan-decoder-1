import { Link, createFileRoute } from "@tanstack/react-router";
import { ACCESS_BOUNDARY } from "@/lib/access-copy";
import {
  CORE_TRIAL_DAYS,
  CREDIT_PACKS,
  CREDIT_PRICE_AUD,
  MEMBERSHIP_PRICE_AUD,
} from "@/lib/billing";
import { PLANS } from "@/lib/membership";
import { LOGIN_CREATE_SEARCH } from "@/lib/public-paths";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page";

const TITLE = "Pricing — Core, credits, and Professional | Plan Decoder";
const DESC =
  "Plan Decoder pricing in Australian dollars. Free tools to look around, Core after a short trial, credits for finished reports, and Professional for coordinators working with more than one person. Not the NDIA.";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index,follow" },
    ],
  }),
});

function PricingPage() {
  const { user } = useCurrentUserState();
  const free = PLANS.find((p) => p.id === "free")!;
  const core = PLANS.find((p) => p.id === "core")!;
  const pro = PLANS.find((p) => p.id === "pro")!;
  const coreCta = user ? (
    <Button className="mt-5 w-full" asChild>
      <Link to="/membership">Start Core on Pay and credits</Link>
    </Button>
  ) : (
    <Button className="mt-5 w-full" asChild>
      <Link to="/login" search={LOGIN_CREATE_SEARCH}>
        Start {CORE_TRIAL_DAYS}-day Core trial
      </Link>
    </Button>
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Plan Decoder pricing",
    url: "https://www.plandecoder.com/pricing",
    itemListElement: [
      { "@type": "Offer", name: "Free", price: "0", priceCurrency: "AUD" },
      {
        "@type": "Offer",
        name: "Core",
        price: String(MEMBERSHIP_PRICE_AUD.core),
        priceCurrency: "AUD",
        description: `${CORE_TRIAL_DAYS}-day trial, then monthly`,
      },
      {
        "@type": "Offer",
        name: "Professional",
        price: String(MEMBERSHIP_PRICE_AUD.pro),
        priceCurrency: "AUD",
      },
      ...CREDIT_PACKS.map((pack) => ({
        "@type": "Offer",
        name: pack.label,
        price: String(pack.aud),
        priceCurrency: "AUD",
      })),
    ],
  };

  return (
    <div>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <PageHeader
        title="Simple Australian-dollar pricing"
        lede="Pay for the practice tools you need. Nothing here is an NDIA fee, and it does not decide eligibility or funding."
      />

      <p className="mb-6 max-w-2xl text-sm text-muted">{ACCESS_BOUNDARY}</p>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">{free.name}</p>
          <p className="mt-1 text-3xl font-semibold">$0</p>
          <p className="mt-2 text-sm text-muted">{free.blurb}</p>
          <ul className="mt-4 space-y-1.5 text-sm">
            {free.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {user ? (
            <p className="mt-5 text-sm text-muted">You already have an account.</p>
          ) : (
            <Button className="mt-5 w-full" asChild>
              <Link to="/login" search={LOGIN_CREATE_SEARCH}>
                Create a free account
              </Link>
            </Button>
          )}
        </Card>

        <Card className="border-primary">
          <p className="text-sm text-muted">{core.name}</p>
          <p className="mt-1 text-3xl font-semibold">
            ${MEMBERSHIP_PRICE_AUD.core}
            <span className="ml-1 text-sm font-normal text-muted">
              per month after {CORE_TRIAL_DAYS}-day trial
            </span>
          </p>
          <p className="mt-2 text-sm text-muted">{core.blurb}</p>
          <ul className="mt-4 space-y-1.5 text-sm">
            {core.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {coreCta}
          <p className="mt-3 text-xs text-muted">
            Trial then A${MEMBERSHIP_PRICE_AUD.core}/month until you cancel. Cancel by emailing us. See{" "}
            <Link to="/privacy" className="underline-offset-2 hover:underline">
              Refunds and cancellation
            </Link>
            .
          </p>
        </Card>

        <Card>
          <p className="text-sm text-muted">{pro.name}</p>
          <p className="mt-1 text-3xl font-semibold">
            ${MEMBERSHIP_PRICE_AUD.pro}
            <span className="ml-1 text-sm font-normal text-muted">per month</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            For coordinators and clinicians working with more than one person.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm">
            {pro.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted">
            Professional checkout is not live yet. Use Core for one person, or email us if you support more than one.
          </p>
        </Card>
      </div>

      <h2 className="mt-10 text-lg font-semibold">Credits for finished outcomes</h2>
      <p className="mt-1 text-sm text-muted">
        Core (or Professional) is needed before credits can be spent. Each finished practice report or
        polished draft uses 1 credit (${CREDIT_PRICE_AUD}).
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {CREDIT_PACKS.map((pack) => (
          <Card key={pack.credits}>
            <p className="font-semibold">{pack.label}</p>
            <p className="mt-1 text-2xl font-semibold">${pack.aud}</p>
            <p className="text-sm text-muted">${CREDIT_PRICE_AUD} each</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <p className="text-sm text-muted">
          Independent Australian practice workspace. Not the NDIA, not a diagnosis, and not legal advice.
          Membership is a personal purchase and cannot be paid from NDIS plan funding.{" "}
          <Link to="/privacy" className="font-medium text-primary underline-offset-2 hover:underline">
            Privacy, terms, refunds and contact
          </Link>
          .
          {user ? (
            <>
              {" "}
              <Link to="/membership" className="font-medium text-primary underline-offset-2 hover:underline">
                Pay and credits
              </Link>
            </>
          ) : (
            <>
              {" "}
              <Link
                to="/login"
                search={LOGIN_CREATE_SEARCH}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                Create a free account
              </Link>{" "}
              to start.
            </>
          )}
        </p>
      </Card>
    </div>
  );
}

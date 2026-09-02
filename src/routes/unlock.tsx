import { Link, createFileRoute } from "@tanstack/react-router";
import { CodeWordUnlock } from "@/components/code-word";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/unlock")({
  component: UnlockPage,
  head: () => ({
    meta: [
      { title: "Unlock the Prep Pack · Plan Decoder" },
      {
        name: "description",
        content: "Enter the code from your Prep Pack email or a gifted word to open Core tools on this device.",
      },
    ],
  }),
});

function UnlockPage() {
  return (
    <div>
      <PageHeader
        title="Unlock your Prep Pack"
        lede="Type the code from your email, or a gifted word. Access stays on this device."
        art="guide"
      />
      <Card className="max-w-md">
        <CodeWordUnlock need="core" />
      </Card>
      <p className="mt-4 text-sm text-muted">
        After a live Stripe purchase, the webhook can email a one-time code. Until that product link is live, use a
        gifted Core word or start from{" "}
        <Link to="/membership" className="font-medium text-primary underline-offset-4 hover:underline">
          Pay & credits
        </Link>
        .
      </p>
    </div>
  );
}

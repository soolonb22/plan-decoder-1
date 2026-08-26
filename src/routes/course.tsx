import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/course")({
  component: RightsCoursePage,
  head: () => ({
    meta: [
      { title: "Know Your NDIS Rights course · Plan Decoder" },
      {
        name: "description",
        content:
          "Free interactive NDIS rights course: eight short modules on access, choice and control, complaints, plans, providers, safety, reviews, and decisions. Independent of the NDIA.",
      },
    ],
  }),
});

function RightsCoursePage() {
  return (
    <div>
      <PageHeader
        title="Know Your NDIS Rights"
        lede="Eight short modules with a quiz in each. Progress stays in this browser. This is education — not the NDIA, and not advice about your plan."
      />
      <p className="mb-4 text-sm text-muted">
        Prefer the written cards?{" "}
        <Link to="/rights" className="font-medium text-primary underline-offset-2 hover:underline">
          Open Know your rights
        </Link>
        . You can also{" "}
        <a className="font-medium text-primary underline-offset-2 hover:underline" href="/courses/know-your-rights.html">
          open the course on its own page
        </a>
        .
      </p>
      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-[var(--shadow-card)]">
        <iframe
          title="Know Your NDIS Rights interactive course"
          src="/courses/know-your-rights.html"
          className="block w-full border-0"
          style={{ minHeight: "calc(100dvh - 11rem)", height: "78dvh" }}
          allow="downloads"
        />
      </div>
    </div>
  );
}

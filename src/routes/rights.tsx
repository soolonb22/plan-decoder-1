import { createFileRoute } from "@tanstack/react-router";
import { RightsCourse, type CourseSearch } from "@/components/rights-course";

export const Route = createFileRoute("/rights")({
  validateSearch: (raw: Record<string, unknown>): CourseSearch => {
    const x = typeof raw.x === "string" ? raw.x : undefined;
    if (x === "x0" || x === "x1") return { x };
    const n = Number(raw.m);
    if (Number.isInteger(n) && n >= 0 && n <= 7) return { m: n };
    return {};
  },
  component: RightsPage,
  head: () => ({
    meta: [
      { title: "Know your NDIS rights — Module 0 preview | Plan Decoder" },
      {
        name: "description",
        content:
          "Preview NDIS rights in plain English. Module 0 is free without an account. The full course, Easy Read, and certificate are part of Core. Independent of the NDIA.",
      },
    ],
  }),
});

function RightsPage() {
  const search = Route.useSearch();
  return <RightsCourse search={search} />;
}

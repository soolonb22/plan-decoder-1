import { createFileRoute } from "@tanstack/react-router";
import { RightsCourse, type CourseSearch } from "@/components/rights-course";

export const Route = createFileRoute("/course")({
  validateSearch: (raw: Record<string, unknown>): CourseSearch => {
    const x = typeof raw.x === "string" ? raw.x : undefined;
    if (x === "x0" || x === "x1") return { x };
    const n = Number(raw.m);
    if (Number.isInteger(n) && n >= 0 && n <= 7) return { m: n };
    return {};
  },
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
  const search = Route.useSearch();
  return <RightsCourse search={search} />;
}

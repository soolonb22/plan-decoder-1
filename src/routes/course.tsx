import { Navigate, createFileRoute } from "@tanstack/react-router";
import type { CourseSearch } from "@/components/rights-course";

export const Route = createFileRoute("/course")({
  validateSearch: (raw: Record<string, unknown>): CourseSearch => {
    const x = typeof raw.x === "string" ? raw.x : undefined;
    if (x === "x0" || x === "x1") return { x };
    const n = Number(raw.m);
    if (Number.isInteger(n) && n >= 0 && n <= 7) return { m: n };
    return {};
  },
  component: CourseRedirect,
});

function CourseRedirect() {
  const search = Route.useSearch();
  return <Navigate to="/rights" search={search} replace />;
}

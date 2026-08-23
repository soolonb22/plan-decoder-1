import { useEffect, useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ResultRow } from "@/lib/assessment/clinical";
import { PRACTICE_THRESHOLD } from "@/lib/assessment/clinical";

const INK = "#3a2a45";
const MUTED = "#6b5b76";
const PRIMARY = "#6e2c92";
const LAVENDER = "#bfa9d9";
const LEAF = "#8bc541";
const PAPER = "#ede6f3";
const ALERT = "#a33b32";

const SHORT: Record<string, string> = {
  cognition: "Thinking",
  mobility: "Moving",
  selfCare: "Self-care",
  gettingAlong: "Getting along",
  lifeActivities: "Daily life",
  participation: "Community",
  "who-total": "Total",
};

function labelOf(row: ResultRow) {
  return SHORT[row.id] ?? row.title.replace("WHODAS-inspired ", "").replace(" (average)", "");
}

function ChartFrame({
  title,
  height,
  children,
}: {
  title: string;
  height: number;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <section className="clinical-chart">
      <h3 className="clinical-chart-title">{title}</h3>
      <div style={{ height }} className="w-full">
        {ready ? (
          children
        ) : (
          <div className="h-full animate-pulse rounded-lg bg-paper-2" aria-hidden />
        )}
      </div>
    </section>
  );
}

export function DomainAverageBars({ rows }: { rows: ResultRow[] }) {
  const data = rows.map((r) => ({
    name: labelOf(r),
    average: Number(r.raw.toFixed(2)),
    fill: r.aboveThreshold ? PRIMARY : LAVENDER,
  }));
  return (
    <ChartFrame title="WHODAS-inspired domain averages compared with the practice threshold" height={320}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={PAPER} />
          <XAxis type="number" domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} stroke={MUTED} fontSize={12} />
          <YAxis type="category" dataKey="name" width={108} stroke={INK} fontSize={11} />
          <Tooltip />
          <ReferenceArea x1={0} x2={0.5} fill="#eaf6dc" fillOpacity={0.45} />
          <ReferenceArea x1={0.5} x2={1.5} fill="#ede6f3" fillOpacity={0.35} />
          <ReferenceArea x1={1.5} x2={2.5} fill="#f8eed9" fillOpacity={0.4} />
          <ReferenceArea x1={2.5} x2={4} fill="#fbecea" fillOpacity={0.45} />
          <ReferenceLine x={PRACTICE_THRESHOLD} stroke={ALERT} strokeDasharray="4 4" label={{ value: "Threshold", fill: ALERT, fontSize: 11 }} />
          <Bar dataKey="average" name="Domain average (0–4)" fill={PRIMARY} radius={[0, 4, 4, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function PracticeIndexBars({ rows }: { rows: ResultRow[] }) {
  const data = rows.map((r) => ({
    name: labelOf(r),
    index: r.practiceIndex,
    fill: r.practiceIndex >= 50 ? PRIMARY : LEAF,
  }));
  return (
    <ChartFrame title="Practice index by domain (simple 0–100 of answered items — not a population percentile)" height={280}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: 8, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={PAPER} />
          <XAxis dataKey="name" interval={0} angle={-28} textAnchor="end" height={70} stroke={MUTED} fontSize={11} />
          <YAxis domain={[0, 100]} stroke={MUTED} fontSize={12} />
          <Tooltip />
          <ReferenceArea y1={50} y2={100} fill="#f3eaf8" fillOpacity={0.7} />
          <ReferenceLine y={50} stroke={LEAF} label={{ value: "Mid-scale", fill: MUTED, fontSize: 11 }} />
          <Bar dataKey="index" name="Practice index" fill={PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={42} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function LongitudinalLines({
  series,
}: {
  series: { date: string; total: number; support: number }[];
}) {
  if (series.length < 2) return null;
  return (
    <ChartFrame title="Change over rehearsals on this device" height={260}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={PAPER} />
          <XAxis dataKey="date" stroke={MUTED} fontSize={11} />
          <YAxis yAxisId="left" domain={[0, 4]} stroke={PRIMARY} fontSize={11} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 10]} stroke={LEAF} fontSize={11} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="total" name="Function average (0–4)" stroke={PRIMARY} strokeWidth={2} dot />
          <Line yAxisId="right" type="monotone" dataKey="support" name="Support intensity (0–10)" stroke={LEAF} strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

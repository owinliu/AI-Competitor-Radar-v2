import { Suspense } from "react";
import { getAllReports, getReportBySlug, type Insight } from "@/lib/reports";
import ReportsTimelineClient from "@/components/reports-timeline-client";
import ReportsTopInsightsClient from "@/components/reports-top-insights-client";
import { TimelineSwitcher } from "@/components/timeline-switcher";
import { TimelineSummary } from "@/components/timeline-summary-client";
import recompare0428Data from "@/data/recompare_0323_0428_reports.json";

const TIMELINES = [
  { key: "0323-0402", label: "0323 → 0402" },
  { key: "0323-0428", label: "0323 → 0428" },
] as const;

export default function ReportsPage() {
  const metas = getAllReports();
  const baseReports = metas
    .filter((m) => (m.period || "").replace(/\s/g, "") !== "0323→0428")
    .map((m) => {
      const d = getReportBySlug(m.slug);
      return {
        slug: m.slug,
        title: m.title,
        date: m.date,
        period: m.period,
        competitors: m.competitors,
        dimensions: m.dimensions,
        insights: d?.insights || [],
      };
    });

  const recompare0428Report = {
    slug: "recompare-0323-0428-local-only",
    title: "0323→0428 明细证据表（本地截图重建）",
    date: "2026-04-30",
    period: "0323→0428",
    competitors: (recompare0428Data as any).meta.competitors,
    dimensions: (recompare0428Data as any).meta.dimensions,
    insights: (recompare0428Data as any).insights || [],
  };

  const reports = [...baseReports, recompare0428Report];

  const baseReport = reports.find((r) => (r.period || "").replace(/\s/g, "") === "0323→0402") || reports[0];
  const base = (baseReport?.insights || []) as Insight[];
  const byDim = ["APP", "客服", "消金", "留存促活运营", "风控"].map((d) => ({ dim: d, c: base.filter((x: Insight) => x.dimension === d && x.impact !== "低").length }));
  const topDim = byDim.sort((a, b) => b.c - a.c)[0];
  const byComp = Array.from(new Set(base.map((x: Insight) => x.competitor))).map((c) => ({
    c,
    rows: base.filter((x: Insight) => x.competitor === c),
    obvious: base.filter((x: Insight) => x.competitor === c && x.impact !== "低"),
  }));
  const diffSummary = byComp.map(({ c, obvious, rows }) => {
    const pick = (obvious[0] || rows[0])?.conclusion || "本期变化不明显";
    return `${c}：${pick}`;
  });

  const report0428Rows = ((recompare0428Data as any).insights || []) as any[];
  const report0428High = report0428Rows.filter((x) => x.impact === "高");
  const report0428Review = report0428Rows.filter((x) => String(x.confidence || "").includes("是"));

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-[#e5edf5] bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-[#061b31]">详细追踪分析｜本轮关键结论总览</h1>
          <Suspense fallback={null}>
            <TimelineSwitcher options={TIMELINES as unknown as { key: string; label: string }[]} defaultValue="0323-0402" />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <TimelineSummary
            data={{
              "0323-0402": {
                period: "2026-W15（0408重读）",
                sample: "5家产品 / APP",
                ratio: "来源于明细证据表截图分析",
                summary: "本轮以可比位点重读为主，结论聚焦高置信变化项。",
                bullets: ["变化主要集中在运营与APP维度。", "客服多为承接体验优化，结构改动有限。"],
              },
              "0323-0428": {
                period: "0323 → 0428",
                sample: "180张全量截图 / 98行对比位点",
                ratio: `高影响${report0428High.length}行 / 建议复核${report0428Review.length}行`,
                summary: "本页 0323→0428 的明细证据表仅来自本地 0323 与 0428 截图重建，不再复用旧 report 数据。",
                bullets: ["上期截图只允许 0323，本期截图只允许 0428。", "对比文案统一按 0323 vs 0428 输出。", "旧的 0402 / 0407 / 0408 明细证据已从这条时间线移除。"],
              },
            }}
          />
        </Suspense>
        <Suspense fallback={null}>
          <ReportsTopInsightsClient
            baseTopDim={topDim?.dim || "APP"}
            baseDiffSummary={diffSummary}
            report0428HighCount={report0428High.length}
            report0428ReviewCount={report0428Review.length}
          />
        </Suspense>
      </section>

      <Suspense fallback={null}>
        <ReportsTimelineClient reports={reports} />
      </Suspense>
    </div>
  );
}

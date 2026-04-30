import { Suspense } from "react";
import { getAllReports, getReportBySlug } from "@/lib/reports";
import ReportsCenterClient from "@/components/reports-center-client";
import { TimelineSwitcher } from "@/components/timeline-switcher";

const TIMELINES = [
  { key: "0323-0402", label: "0323 → 0402" },
  { key: "0323-0428", label: "0323 → 0428" },
] as const;

export default function ReportsPage() {
  const metas = getAllReports();
  const reports = metas.map((m) => {
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

  const base = reports[0]?.insights || [];
  const byDim = ["APP", "客服", "消金", "留存促活运营", "风控"].map((d) => ({ dim: d, c: base.filter((x) => x.dimension === d && x.impact !== "低").length }));
  const topDim = byDim.sort((a, b) => b.c - a.c)[0];
  const byComp = Array.from(new Set(base.map((x) => x.competitor))).map((c) => ({
    c,
    rows: base.filter((x) => x.competitor === c),
    obvious: base.filter((x) => x.competitor === c && x.impact !== "低"),
  }));
  const diffSummary = byComp.map(({ c, obvious, rows }) => {
    const pick = (obvious[0] || rows[0])?.conclusion || "本期变化不明显";
    return `${c}：${pick}`;
  });

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-[#e5edf5] bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-[#061b31]">详细追踪分析｜本轮关键结论总览</h1>
          <Suspense fallback={null}>
            <TimelineSwitcher options={TIMELINES as unknown as { key: string; label: string }[]} defaultValue="0323-0402" />
          </Suspense>
        </div>
        <div className="mt-3 grid gap-2 text-xs text-[#64748d] md:grid-cols-3">
          <p>时间范围：2026-W15（0408重读）</p>
          <p>覆盖样本：5家产品 / APP</p>
          <p>数据说明：来源于明细证据表截图分析。</p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="text-base font-semibold text-[#061b31]">本轮关键结论</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#334155]">
              <li>从明细截图对比看，本轮变化主要集中在{topDim?.dim === "留存促活运营" ? "运营" : topDim?.dim}维度。</li>
              <li>各产品变化以首屏文案与活动位替换为主，结构性改版相对有限。</li>
              <li>业务上呈现“转化信息前置 + 活动触达增强”的共同趋势。</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-base font-semibold text-[#061b31]">差异总结</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#334155]">
              {diffSummary.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <ReportsCenterClient reports={reports} />
    </div>
  );
}

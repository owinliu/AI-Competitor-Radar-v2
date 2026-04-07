import { getAllReports, getReportBySlug } from "@/lib/reports";
import ReportInsightPanel from "@/components/report-insight-panel";

export default function DashboardPage() {
  const reports = getAllReports();
  const latestMeta = reports[0];
  const latest = latestMeta ? getReportBySlug(latestMeta.slug) : null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">竞品追踪工作台</h1>
        <p className="mt-2 text-sm text-muted-foreground">所有分析结果统一在 Dashboard 展示，不再分散到其它页面。</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[["周报总数", String(reports.length)], ["当前周期", latest?.period || "-"], ["高影响项", String(latest?.insights?.filter(i=>i.impact==="高").length || 0)], ["证据图片", String(latest?.insights?.reduce((n,i)=>n+i.evidence.length,0) || 0)]].map(([k, v]) => (
          <div key={k} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="mt-2 text-2xl font-semibold">{v}</p>
          </div>
        ))}
      </section>

      {latest && <ReportInsightPanel insights={latest.insights} />}
    </div>
  );
}

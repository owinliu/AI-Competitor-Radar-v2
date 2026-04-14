import Link from "next/link";
import { getAllReports, getReportBySlug } from "@/lib/reports";
import ReportInsightPanel from "@/components/report-insight-panel";

export function generateStaticParams() {
  return getAllReports().map((r) => ({ slug: r.slug }));
}

export default function HistoryDetailPage({ params }: { params: { slug: string } }) {
  const report = getReportBySlug(params.slug);

  if (!report) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h1 className="text-xl font-semibold">未找到该期记录</h1>
        <Link className="mt-3 inline-block text-sm text-primary" href="/history">返回历史记录</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6">
        <Link className="text-sm text-muted-foreground hover:text-foreground" href="/history">← 返回历史记录</Link>
        <h1 className="mt-2 text-2xl font-semibold">{report.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">周期：{report.period || "-"} · 日期：{report.date} · 全量变动点位：{report.insights.length}</p>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">全量图表对比与读图结论</h2>
        <p className="mt-1 text-xs text-muted-foreground">支持按产品、维度、周期和变化等级筛选，查看全量证据图与结论明细。</p>
        <div className="mt-4">
          <ReportInsightPanel insights={report.insights} showStrategyOverview={true} />
        </div>
      </section>
    </div>
  );
}

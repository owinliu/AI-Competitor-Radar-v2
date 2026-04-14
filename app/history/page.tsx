import Link from "next/link";
import { getAllReports, getReportBySlug, type Insight } from "@/lib/reports";

function countByDimension(insights: Insight[]) {
  const dims = ["APP", "风控", "客服", "消金", "留存促活运营"];
  return dims
    .map((d) => ({ d, n: insights.filter((x) => x.dimension === d).length }))
    .sort((a, b) => b.n - a.n)
    .filter((x) => x.n > 0);
}

export default function HistoryPage() {
  const metas = getAllReports();
  const list = metas.map((m) => {
    const detail = getReportBySlug(m.slug);
    const insights = detail?.insights || [];
    const topDim = countByDimension(insights)[0];
    return {
      slug: m.slug,
      title: m.title,
      date: m.date,
      period: m.period || "-",
      competitors: new Set(insights.map((x) => x.competitor)).size,
      dimensions: new Set(insights.map((x) => x.dimension)).size,
      totalChanges: insights.length,
      topDim: topDim ? `${topDim.d === "留存促活运营" ? "运营" : topDim.d}（${topDim.n}）` : "-",
      summary: m.summary || "-",
    };
  });

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">历史记录</h1>
        <p className="mt-2 text-sm text-muted-foreground">按时间倒序展示历史分析。点击可查看该期全量图表对比与读图结论。</p>
      </section>

      <section className="space-y-4">
        {list.map((item) => (
          <article key={item.slug} className="rounded-xl border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">周期：{item.period} · 日期：{item.date}</p>
              </div>
              <Link href={`/history/${item.slug}`} className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted">查看详细</Link>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-5">
              <div className="rounded border p-3"><p className="text-xs text-muted-foreground">总变动点位</p><p className="text-xl font-semibold">{item.totalChanges}</p></div>
              <div className="rounded border p-3"><p className="text-xs text-muted-foreground">覆盖竞品</p><p className="text-xl font-semibold">{item.competitors}</p></div>
              <div className="rounded border p-3"><p className="text-xs text-muted-foreground">覆盖维度</p><p className="text-xl font-semibold">{item.dimensions}</p></div>
              <div className="rounded border p-3 md:col-span-2"><p className="text-xs text-muted-foreground">Top热度维度</p><p className="text-xl font-semibold">{item.topDim}</p></div>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">{item.summary}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

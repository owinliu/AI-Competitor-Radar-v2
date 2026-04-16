import Link from "next/link";
import { getAllReports, getReportBySlug, type Insight } from "@/lib/reports";

const DIMENSIONS = ["APP", "风控", "客服", "消金", "留存促活运营"] as const;

function dimLabel(dim: string) {
  return dim === "留存促活运营" ? "运营" : dim;
}

function countByDimension(insights: Insight[]) {
  return DIMENSIONS.map((dim) => ({
    dimension: dim,
    count: insights.filter((x) => x.dimension === dim).length,
  })).sort((a, b) => b.count - a.count);
}

function countByCompetitor(insights: Insight[]) {
  const map = new Map<string, number>();
  for (const x of insights) {
    map.set(x.competitor, (map.get(x.competitor) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([competitor, count]) => ({ competitor, count }))
    .sort((a, b) => b.count - a.count);
}

function buildMatrix(insights: Insight[]) {
  const competitors = countByCompetitor(insights).map((x) => x.competitor);
  const rowTotal = (competitor: string) => insights.filter((x) => x.competitor === competitor).length;
  const value = (competitor: string, dimension: string) => insights.filter((x) => x.competitor === competitor && x.dimension === dimension).length;

  return {
    competitors,
    rowTotal,
    value,
  };
}

function keyChanges(insights: Insight[]) {
  const map = new Map<string, { competitor: string; dimension: string; page: string; count: number; sample: string }>();

  for (const x of insights) {
    const page = x.page || "未标注页面";
    const key = `${x.competitor}__${x.dimension}__${page}`;
    const prev = map.get(key);
    if (prev) {
      prev.count += 1;
    } else {
      map.set(key, {
        competitor: x.competitor,
        dimension: x.dimension,
        page,
        count: 1,
        sample: x.conclusion,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 12);
}

function trendByDimension(reports: ReturnType<typeof getAllReports>) {
  return DIMENSIONS.map((dim) => {
    const values = reports.map((r) => {
      const detail = getReportBySlug(r.slug);
      const count = detail?.insights.filter((x) => x.dimension === dim).length || 0;
      return { date: r.date, count };
    });
    return { dimension: dim, values };
  });
}

function trendByCompetitor(reports: ReturnType<typeof getAllReports>) {
  const allCompetitors = new Set<string>();
  const details = reports.map((r) => ({ report: r, detail: getReportBySlug(r.slug) }));
  for (const item of details) {
    for (const i of item.detail?.insights || []) allCompetitors.add(i.competitor);
  }

  return Array.from(allCompetitors)
    .map((competitor) => {
      const values = details.map(({ report, detail }) => ({
        date: report.date,
        count: detail?.insights.filter((x) => x.competitor === competitor).length || 0,
      }));
      const total = values.reduce((n, x) => n + x.count, 0);
      return { competitor, values, total };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
}

export default function DashboardPage() {
  const reports = getAllReports();
  const latestMeta = reports[0];
  const latest = latestMeta ? getReportBySlug(latestMeta.slug) : null;

  if (!latest) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h1 className="text-xl font-semibold">仪表盘</h1>
        <p className="mt-2 text-sm text-muted-foreground">暂无可展示报告数据。</p>
      </div>
    );
  }

  const latestInsights = latest.insights;
  const dimHeat = countByDimension(latestInsights);
  const compHeat = countByCompetitor(latestInsights);
  const matrix = buildMatrix(latestInsights);
  const changes = keyChanges(latestInsights);

  const recentReports = reports.slice(0, 4).sort((a, b) => (a.date > b.date ? 1 : -1));
  const dimTrend = trendByDimension(recentReports);
  const compTrend = trendByCompetitor(recentReports);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">竞品变化仪表盘</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          默认按维度热度展示。当前周期：{latest.period || latest.date}；统计口径：同一页面多个点位变化，按点位条数计数。
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-base font-semibold">维度热度（本期）</h2>
          <div className="mt-4 space-y-3">
            {dimHeat.map((item) => {
              const max = Math.max(dimHeat[0]?.count || 1, 1);
              const width = `${Math.max((item.count / max) * 100, 4)}%`;
              return (
                <div key={item.dimension}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{dimLabel(item.dimension)}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="h-2 rounded bg-slate-100">
                    <div className="h-2 rounded bg-slate-900" style={{ width }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-base font-semibold">产品变动排序（本期）</h2>
          <div className="mt-4 space-y-3">
            {compHeat.map((item) => {
              const max = Math.max(compHeat[0]?.count || 1, 1);
              const width = `${Math.max((item.count / max) * 100, 4)}%`;
              return (
                <div key={item.competitor}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{item.competitor}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="h-2 rounded bg-slate-100">
                    <div className="h-2 rounded bg-slate-700" style={{ width }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">总表概览（产品 × 维度）</h2>
        <p className="mt-1 text-xs text-muted-foreground">用于直观看出哪个产品变动更多、主要发生在哪个维度。</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-600">
                <th className="border-b px-3 py-2">产品</th>
                {DIMENSIONS.map((d) => (
                  <th key={d} className="border-b px-3 py-2">{dimLabel(d)}</th>
                ))}
                <th className="border-b px-3 py-2">总变动数</th>
              </tr>
            </thead>
            <tbody>
              {matrix.competitors.map((c) => (
                <tr key={c}>
                  <td className="border-b px-3 py-2 font-medium">{c}</td>
                  {DIMENSIONS.map((d) => (
                    <td key={`${c}-${d}`} className="border-b px-3 py-2">{matrix.value(c, d)}</td>
                  ))}
                  <td className="border-b px-3 py-2 font-semibold">{matrix.rowTotal(c)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">本期关键变化页面（Top 12）</h2>
        <p className="mt-1 text-xs text-muted-foreground">按“页面内变化点位数量”排序，先定位变化最密集的位置。</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-600">
                <th className="border-b px-3 py-2">排名</th>
                <th className="border-b px-3 py-2">产品</th>
                <th className="border-b px-3 py-2">维度</th>
                <th className="border-b px-3 py-2">页面</th>
                <th className="border-b px-3 py-2">变动点位数</th>
                <th className="border-b px-3 py-2">摘要</th>
              </tr>
            </thead>
            <tbody>
              {changes.map((x, idx) => (
                <tr key={`${x.competitor}-${x.dimension}-${x.page}`}>
                  <td className="border-b px-3 py-2">{idx + 1}</td>
                  <td className="border-b px-3 py-2">{x.competitor}</td>
                  <td className="border-b px-3 py-2">{dimLabel(x.dimension)}</td>
                  <td className="border-b px-3 py-2">{x.page}</td>
                  <td className="border-b px-3 py-2 font-semibold">{x.count}</td>
                  <td className="border-b px-3 py-2 text-muted-foreground">{x.sample || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-base font-semibold">近4周趋势（维度）</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="border-b px-3 py-2">维度</th>
                  {recentReports.map((r) => (
                    <th key={r.slug} className="border-b px-3 py-2">{r.date.slice(5)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dimTrend.map((row) => (
                  <tr key={row.dimension}>
                    <td className="border-b px-3 py-2">{dimLabel(row.dimension)}</td>
                    {row.values.map((v) => (
                      <td key={`${row.dimension}-${v.date}`} className="border-b px-3 py-2">{v.count}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-base font-semibold">近4周趋势（产品）</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="border-b px-3 py-2">产品</th>
                  {recentReports.map((r) => (
                    <th key={r.slug} className="border-b px-3 py-2">{r.date.slice(5)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compTrend.map((row) => (
                  <tr key={row.competitor}>
                    <td className="border-b px-3 py-2">{row.competitor}</td>
                    {row.values.map((v) => (
                      <td key={`${row.competitor}-${v.date}`} className="border-b px-3 py-2">{v.count}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">下一步分析入口</h2>
        <p className="mt-1 text-xs text-muted-foreground">首页仅保留总览决策信息。细分筛选、全量读图结论与证据对比已迁移到「周报中心」。</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Link href="/reports" className="rounded-lg border p-4 hover:bg-muted/40">
            <p className="text-sm font-medium">进入周报中心</p>
            <p className="mt-1 text-xs text-muted-foreground">按时间倒序查看历史分析，先选期次再深挖。</p>
          </Link>
          <Link href={`/history/${latest.slug}`} className="rounded-lg border p-4 hover:bg-muted/40">
            <p className="text-sm font-medium">查看本期全量详情</p>
            <p className="mt-1 text-xs text-muted-foreground">直接进入本期二级页，查看全量图表对比与读图结论。</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { getAllReports, getReportBySlug } from "@/lib/reports";

export default function DashboardPage() {
  const reports = getAllReports();
  const latestMeta = reports[0];
  const latest = latestMeta ? getReportBySlug(latestMeta.slug) : null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">竞品追踪工作台</h1>
        <p className="mt-2 text-sm text-muted-foreground">主区直接展示最新报告重点内容，减少二次点击。</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[["周报总数", String(reports.length)], ["当前周期", "0402 vs 0323"], ["高影响项", "3"], ["证据图片", "10"]].map(([k, v]) => (
          <div key={k} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="mt-2 text-2xl font-semibold">{v}</p>
          </div>
        ))}
      </section>

      {latest && (
        <section className="rounded-xl border bg-card p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">最新报告</p>
          <h2 className="mt-2 text-xl font-semibold">{latest.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{latest.summary}</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold">结论先行</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
                {latest.highlights.slice(0, 4).map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">行动建议</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
                {latest.actions.slice(0, 4).map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

import Link from "next/link";
import { getAllReports, getReportBySlug } from "@/lib/reports";

function trendTag(type: "新增" | "削弱" | "稳定" | "缺口") {
  const color = {
    新增: "bg-blue-50 text-blue-700",
    削弱: "bg-amber-50 text-amber-700",
    稳定: "bg-emerald-50 text-emerald-700",
    缺口: "bg-rose-50 text-rose-700",
  }[type];
  return <span className={`rounded px-2 py-1 text-xs ${color}`}>{type}</span>;
}

export default function ReportsPage({
  searchParams,
}: {
  searchParams?: { p1?: string; p2?: string };
}) {
  const reports = getAllReports();
  const periods = Array.from(new Set(reports.map((r) => r.period).filter(Boolean) as string[]));

  const p2 = searchParams?.p2 || periods[0] || "";
  const p1 = searchParams?.p1 || periods[1] || periods[0] || "";

  const reportP1 = reports.find((r) => r.period === p1);
  const reportP2 = reports.find((r) => r.period === p2);

  const details1 = reportP1 ? getReportBySlug(reportP1.slug) : null;
  const details2 = reportP2 ? getReportBySlug(reportP2.slug) : null;

  const map1 = new Map((details1?.insights || []).map((i) => [`${i.competitor}|${i.dimension}|${i.page}`, i]));
  const map2 = new Map((details2?.insights || []).map((i) => [`${i.competitor}|${i.dimension}|${i.page}`, i]));
  const keys = Array.from(new Set([...map1.keys(), ...map2.keys()]));

  const changes = keys.map((k) => {
    const a = map1.get(k);
    const b = map2.get(k);
    if (!a && b) return { key: k, type: "新增" as const, item: b };
    if (a && !b) return { key: k, type: "缺口" as const, item: a };
    if (!a || !b) return null;
    const same = a.conclusion === b.conclusion && a.impact === b.impact;
    return { key: k, type: same ? ("稳定" as const) : ("削弱" as const), item: b };
  }).filter(Boolean) as { key: string; type: "新增" | "削弱" | "稳定" | "缺口"; item: any }[];

  const latest = reports[0] ? getReportBySlug(reports[0].slug) : null;
  const totalInsights = latest?.insights.length || 0;
  const missingEvidence = (latest?.insights || []).filter((i) => (i.prevEvidence?.length || 0) === 0 || (i.currEvidence?.length || 0) === 0).length;
  const highRisk = (latest?.insights || []).filter((i) => i.confidence?.includes("是")).length;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">周报中心（多期运营）</h1>
        <p className="mt-2 text-sm text-muted-foreground">用于跨期运营与趋势复盘：档案库、对比视图、质量缺口看板。</p>
      </section>

      {/* A. 档案库 */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">A. 周报档案库（按周）</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-600">
                <th className="border-b px-3 py-2">标题</th>
                <th className="border-b px-3 py-2">周期</th>
                <th className="border-b px-3 py-2">竞品</th>
                <th className="border-b px-3 py-2">维度</th>
                <th className="border-b px-3 py-2">更新时间</th>
                <th className="border-b px-3 py-2">状态</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.slug}>
                  <td className="border-b px-3 py-3 font-medium">{r.title}</td>
                  <td className="border-b px-3 py-3">{r.period || "-"}</td>
                  <td className="border-b px-3 py-3">{r.competitors.join("/")}</td>
                  <td className="border-b px-3 py-3">{r.dimensions.join("/")}</td>
                  <td className="border-b px-3 py-3">{r.date}</td>
                  <td className="border-b px-3 py-3"><span className="rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-700">已发布</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* B. 跨期对比 */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">B. 跨期对比视图（核心）</h2>
        <form className="mt-3 flex flex-wrap items-center gap-2">
          <label className="text-sm text-muted-foreground">对比周期</label>
          <select name="p1" defaultValue={p1} className="rounded border px-2 py-1.5 text-sm">
            {periods.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <span className="text-sm text-muted-foreground">vs</span>
          <select name="p2" defaultValue={p2} className="rounded border px-2 py-1.5 text-sm">
            {periods.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground">刷新对比</button>
        </form>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-600">
                <th className="border-b px-3 py-2">变化类型</th>
                <th className="border-b px-3 py-2">竞品</th>
                <th className="border-b px-3 py-2">维度</th>
                <th className="border-b px-3 py-2">页面位点</th>
                <th className="border-b px-3 py-2">当前结论</th>
              </tr>
            </thead>
            <tbody>
              {changes.map((c) => (
                <tr key={c.key}>
                  <td className="border-b px-3 py-3">{trendTag(c.type)}</td>
                  <td className="border-b px-3 py-3">{c.item.competitor}</td>
                  <td className="border-b px-3 py-3">{c.item.dimension}</td>
                  <td className="border-b px-3 py-3">{c.item.page || "-"}</td>
                  <td className="border-b px-3 py-3">{c.item.conclusion}</td>
                </tr>
              ))}
              {changes.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-4 text-sm text-muted-foreground">暂无可对比数据（请先沉淀至少两期不同 period 的报告）。</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* C. 质量看板 */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">C. 质量与缺口看板</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">当前期洞察总数</p>
            <p className="mt-2 text-2xl font-semibold">{totalInsights}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">证据缺口项（上/本期缺图）</p>
            <p className="mt-2 text-2xl font-semibold text-amber-600">{missingEvidence}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">需复核项（confidence 含“是”）</p>
            <p className="mt-2 text-2xl font-semibold text-rose-600">{highRisk}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">注：Dashboard 负责单期深看；周报中心负责多期趋势与质量治理。</p>
      </section>

      <div className="text-sm text-muted-foreground">
        <Link href="/dashboard" className="text-primary underline">返回仪表盘</Link>
      </div>
    </div>
  );
}

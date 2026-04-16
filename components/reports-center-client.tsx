"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ReportInsightPanel from "@/components/report-insight-panel";
import type { Insight } from "@/lib/reports";

type Report = {
  slug: string;
  title: string;
  date: string;
  period?: string;
  competitors: string[];
  dimensions: string[];
  insights: Insight[];
};

export default function ReportsCenterClient({ reports }: { reports: Report[] }) {
  const [view, setView] = useState<"archive" | "compare">("compare");
  const periods = Array.from(new Set(reports.map((r) => r.period).filter(Boolean) as string[]));
  const [p1, setP1] = useState(periods[1] || periods[0] || "");
  const [p2, setP2] = useState(periods[0] || "");

  const [detailSlug, setDetailSlug] = useState(reports[0]?.slug || "");

  const reportP1 = reports.find((r) => r.period === p1);
  const reportP2 = reports.find((r) => r.period === p2);
  const detailReport = reports.find((r) => r.slug === detailSlug) || reports[0];

  const changes = useMemo(() => {
    const map1 = new Map((reportP1?.insights || []).map((i) => [`${i.competitor}|${i.dimension}|${i.page}`, i]));
    const map2 = new Map((reportP2?.insights || []).map((i) => [`${i.competitor}|${i.dimension}|${i.page}`, i]));
    const keys = Array.from(new Set([...map1.keys(), ...map2.keys()]));
    return keys
      .map((k) => {
        const a = map1.get(k);
        const b = map2.get(k);
        if (!a && b) return { key: k, type: "新增", item: b };
        if (a && !b) return { key: k, type: "缺口", item: a };
        if (!a || !b) return null;
        const same = a.conclusion === b.conclusion && a.impact === b.impact;
        return { key: k, type: same ? "稳定" : "变化", item: b };
      })
      .filter(Boolean) as { key: string; type: "新增" | "缺口" | "稳定" | "变化"; item: Insight }[];
  }, [reportP1, reportP2]);

  const compareSummary = useMemo(() => {
    return {
      新增: changes.filter((x) => x.type === "新增").length,
      缺口: changes.filter((x) => x.type === "缺口").length,
      变化: changes.filter((x) => x.type === "变化").length,
      稳定: changes.filter((x) => x.type === "稳定").length,
    };
  }, [changes]);

  const matrix = useMemo(() => {
    const dims = ["APP", "客服", "消金", "留存促活运营", "风控"];
    const competitors = Array.from(new Set(changes.map((x) => x.item.competitor)));
    const data = competitors.map((c) => {
      const byDim = dims.map((d) => {
        const rows = changes.filter((x) => x.item.competitor === c && x.item.dimension === d);
        const net = rows.filter((x) => x.type === "新增" || x.type === "变化").length - rows.filter((x) => x.type === "缺口").length;
        return { dim: d, net, count: rows.length };
      });
      const netTotal = byDim.reduce((n, x) => n + x.net, 0);
      const top = [...byDim].sort((a, b) => b.count - a.count)[0];
      return { competitor: c, byDim, netTotal, topDim: top?.dim || "-", topCount: top?.count || 0 };
    });
    return { dims, data };
  }, [changes]);

  const topDiffs = useMemo(() => {
    const impactScore: Record<string, number> = { 高: 3, 中: 2, 低: 1 };
    const typeScore: Record<string, number> = { 新增: 3, 变化: 2, 缺口: 1, 稳定: 0 };
    return changes
      .filter((x) => x.type !== "稳定")
      .sort((a, b) => (typeScore[b.type] + impactScore[b.item.impact]) - (typeScore[a.type] + impactScore[a.item.impact]))
      .slice(0, 10);
  }, [changes]);

  const latest = reports[0];

  const quality = useMemo(() => {
    if (!latest) return { evidence: 0, comparable: 0, risk: 0 };
    const all = latest.insights;
    if (!all.length) return { evidence: 0, comparable: 0, risk: 0 };
    const evidenceOk = all.filter((i) => (i.prevEvidence?.length || 0) > 0 && (i.currEvidence?.length || 0) > 0).length;
    const comparable = all.filter((i) => i.conclusion && i.page).length;
    const risk = all.filter((i) => String(i.confidence).includes("是")).length;
    return {
      evidence: Math.round((evidenceOk / all.length) * 100),
      comparable: Math.round((comparable / all.length) * 100),
      risk: Math.round((risk / all.length) * 100),
    };
  }, [latest]);

  const exportBrief = () => {
    const lines = [
      "# 管理层简版导出",
      "",
      "## 显著变化",
      ...changes.filter((c) => c.type !== "稳定").map((c) => `- [${c.item.competitor}/${c.item.dimension}] ${c.item.conclusion}`),
      "",
      "## 关键动作",
      "- 高优先补图：风控 + 客服缺口位点",
      "- 保持同位点命名归并，防止假缺口",
      "",
      "## 风险缺口",
      `- 复核风险占比：${quality.risk}%`,
    ].join("\n");
    const blob = new Blob([lines], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `管理层简版-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">已合并「详细分析」能力：用视图切换完成归档浏览与深度对比。</p>
          <div className="inline-flex rounded-lg border p-1">
            <button
              className={`rounded-md px-3 py-1.5 text-sm ${view === "archive" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              onClick={() => setView("archive")}
            >
              档案列表视图
            </button>
            <button
              className={`rounded-md px-3 py-1.5 text-sm ${view === "compare" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              onClick={() => setView("compare")}
            >
              详细对比视图
            </button>
          </div>
        </div>
      </section>

      {view === "archive" && (
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">A. 周报档案库（按周）</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead><tr className="bg-slate-50"><th className="border-b px-3 py-2">标题</th><th className="border-b px-3 py-2">周期</th><th className="border-b px-3 py-2">更新时间</th><th className="border-b px-3 py-2">操作</th></tr></thead>
            <tbody>{reports.map((r) => <tr key={r.slug}><td className="border-b px-3 py-2">{r.title}</td><td className="border-b px-3 py-2">{r.period}</td><td className="border-b px-3 py-2">{r.date}</td><td className="border-b px-3 py-2"><Link href={`/history/${r.slug}`} className="rounded border px-2 py-1 text-xs hover:bg-muted">查看该期详细分析</Link></td></tr>)}</tbody>
          </table>
        </div>
      </section>
      )}

      {view === "compare" && (
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <h2 className="text-lg font-semibold">B. 跨期对比总览（差分视角）</h2>
        <p className="text-sm text-muted-foreground">这里仅展示两个周期的差分结果，不重复首页“本期总量仪表盘”。</p>

        <div className="flex flex-wrap items-center gap-2">
          <select value={p1} onChange={(e) => setP1(e.target.value)} className="rounded border px-2 py-1.5 text-sm">{periods.map((p) => <option key={p}>{p}</option>)}</select>
          <span className="text-sm text-muted-foreground">vs</span>
          <select value={p2} onChange={(e) => setP2(e.target.value)} className="rounded border px-2 py-1.5 text-sm">{periods.map((p) => <option key={p}>{p}</option>)}</select>
          <button
            className="ml-2 rounded border px-2 py-1.5 text-xs hover:bg-muted"
            onClick={() => {
              if (reportP2?.slug) setDetailSlug(reportP2.slug);
              document.getElementById("detail-analysis")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            跳到下方详细证据
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded border p-3"><p className="text-xs text-muted-foreground">新增位点</p><p className="text-2xl font-semibold">{compareSummary.新增}</p></div>
          <div className="rounded border p-3"><p className="text-xs text-muted-foreground">缺口位点</p><p className="text-2xl font-semibold">{compareSummary.缺口}</p></div>
          <div className="rounded border p-3"><p className="text-xs text-muted-foreground">变化位点</p><p className="text-2xl font-semibold">{compareSummary.变化}</p></div>
          <div className="rounded border p-3"><p className="text-xs text-muted-foreground">稳定位点</p><p className="text-2xl font-semibold">{compareSummary.稳定}</p></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border-b px-3 py-2 text-left">产品</th>
                {matrix.dims.map((d) => <th key={d} className="border-b px-3 py-2 text-left">{d === "留存促活运营" ? "运营" : d}净变化</th>)}
                <th className="border-b px-3 py-2 text-left">净变化总计</th>
                <th className="border-b px-3 py-2 text-left">主变化维度</th>
              </tr>
            </thead>
            <tbody>
              {matrix.data.map((row) => (
                <tr key={row.competitor}>
                  <td className="border-b px-3 py-2 font-medium">{row.competitor}</td>
                  {row.byDim.map((x) => (
                    <td key={`${row.competitor}-${x.dim}`} className={`border-b px-3 py-2 ${x.net > 0 ? "text-emerald-700" : x.net < 0 ? "text-red-700" : "text-muted-foreground"}`}>
                      {x.net > 0 ? `+${x.net}` : x.net}
                    </td>
                  ))}
                  <td className={`border-b px-3 py-2 font-semibold ${row.netTotal > 0 ? "text-emerald-700" : row.netTotal < 0 ? "text-red-700" : "text-foreground"}`}>{row.netTotal > 0 ? `+${row.netTotal}` : row.netTotal}</td>
                  <td className="border-b px-3 py-2 text-muted-foreground">{row.topDim === "留存促活运营" ? "运营" : row.topDim}（{row.topCount}）</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead><tr className="bg-slate-50"><th className="border-b px-3 py-2 text-left">类型</th><th className="border-b px-3 py-2 text-left">竞品</th><th className="border-b px-3 py-2 text-left">维度</th><th className="border-b px-3 py-2 text-left">位点</th><th className="border-b px-3 py-2 text-left">摘要</th></tr></thead>
            <tbody>{topDiffs.map((c) => (
              <tr key={`top-${c.key}`}>
                <td className="border-b px-3 py-2">{c.type}</td>
                <td className="border-b px-3 py-2">{c.item.competitor}</td>
                <td className="border-b px-3 py-2">{c.item.dimension === "留存促活运营" ? "运营" : c.item.dimension}</td>
                <td className="border-b px-3 py-2">{c.item.page || "-"}</td>
                <td className="border-b px-3 py-2 text-muted-foreground">{c.item.conclusion}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
      )}

      <section id="detail-analysis" className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">C. 详细分析（含截图、产品维度筛选、结构变化总览）</h2>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">选择期次：</span>
          <select
            value={detailSlug}
            onChange={(e) => setDetailSlug(e.target.value)}
            className="rounded border px-2 py-1.5 text-sm"
          >
            {reports.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.title}（{r.period || r.date}）
              </option>
            ))}
          </select>
          <Link href={`/history/${detailReport?.slug}`} className="rounded border px-2 py-1.5 text-xs hover:bg-muted">
            全屏查看该期
          </Link>
        </div>
        <div className="mt-4">
          {detailReport ? (
            <ReportInsightPanel insights={detailReport.insights} showStrategyOverview={true} />
          ) : (
            <p className="text-sm text-muted-foreground">暂无可展示的详细分析数据。</p>
          )}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">D. 质量与缺口看板</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded border p-3"><p className="text-xs text-muted-foreground">证据完整度</p><p className="text-2xl font-semibold">{quality.evidence}%</p></div>
          <div className="rounded border p-3"><p className="text-xs text-muted-foreground">可比度</p><p className="text-2xl font-semibold">{quality.comparable}%</p></div>
          <div className="rounded border p-3"><p className="text-xs text-muted-foreground">复核风险</p><p className="text-2xl font-semibold">{quality.risk}%</p></div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">P2. 导出管理层简版</h2>
        <button onClick={exportBrief} className="mt-3 rounded bg-primary px-3 py-2 text-sm text-primary-foreground">一键导出（显著变化+关键动作+风险缺口）</button>
      </section>
    </div>
  );
}

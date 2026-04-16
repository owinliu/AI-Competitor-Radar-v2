"use client";

import { useMemo, useState } from "react";

type Insight = {
  id: string;
  competitor: string;
  dimension: string;
  period: string;
  page?: string;
  conclusion: string;
  impact: "高" | "中" | "低";
  confidence: string;
  prevEvidence?: string[];
  currEvidence?: string[];
};

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
  const [view, setView] = useState<"archive" | "compare">("archive");
  const periods = Array.from(new Set(reports.map((r) => r.period).filter(Boolean) as string[]));
  const [p1, setP1] = useState(periods[1] || periods[0] || "");
  const [p2, setP2] = useState(periods[0] || "");

  const [reviewed, setReviewed] = useState<Record<string, "已复核" | "已修正" | undefined>>({});
  const [overrides, setOverrides] = useState<Record<string, { conclusion?: string; impact?: string }>>({});

  const reportP1 = reports.find((r) => r.period === p1);
  const reportP2 = reports.find((r) => r.period === p2);

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
      .filter(Boolean) as { key: string; type: string; item: Insight }[];
  }, [reportP1, reportP2]);

  const latest = reports[0];

  const applyManualFix = (key: string, item: Insight) => {
    const nextConclusion = window.prompt("人工修正-结论", overrides[key]?.conclusion || item.conclusion);
    if (nextConclusion === null) return;
    const nextImpact = window.prompt("人工修正-影响等级（高/中/低）", overrides[key]?.impact || item.impact);
    if (nextImpact === null) return;
    setOverrides((s) => ({ ...s, [key]: { conclusion: nextConclusion, impact: nextImpact } }));
    setReviewed((s) => ({ ...s, [key]: "已修正" }));
  };
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

  const multiPeriodTrend = useMemo(() => {
    if (periods.length < 3) return [] as { key: string; trend: string }[];
    const sorted = [...periods].sort();
    const byKey = new Map<string, { high: number; total: number }>();
    for (const p of sorted) {
      const rpt = reports.find((r) => r.period === p);
      for (const i of rpt?.insights || []) {
        const key = `${i.competitor}|${i.dimension}|${i.page}`;
        const cur = byKey.get(key) || { high: 0, total: 0 };
        cur.total += 1;
        if (i.impact === "高") cur.high += 1;
        byKey.set(key, cur);
      }
    }
    return Array.from(byKey.entries())
      .map(([key, v]) => ({ key, trend: v.high >= 2 ? "持续高变化" : v.high === 1 ? "阶段性变化" : "整体稳定" }))
      .slice(0, 20);
  }, [periods, reports]);

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
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead><tr className="bg-slate-50"><th className="border-b px-3 py-2">标题</th><th className="border-b px-3 py-2">周期</th><th className="border-b px-3 py-2">更新时间</th></tr></thead>
            <tbody>{reports.map((r) => <tr key={r.slug}><td className="border-b px-3 py-2">{r.title}</td><td className="border-b px-3 py-2">{r.period}</td><td className="border-b px-3 py-2">{r.date}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      )}

      {view === "compare" && (
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">B. 跨期对比视图</h2>
        <div className="mt-3 flex gap-2">
          <select value={p1} onChange={(e) => setP1(e.target.value)} className="rounded border px-2 py-1.5 text-sm">{periods.map((p) => <option key={p}>{p}</option>)}</select>
          <span className="text-sm text-muted-foreground">vs</span>
          <select value={p2} onChange={(e) => setP2(e.target.value)} className="rounded border px-2 py-1.5 text-sm">{periods.map((p) => <option key={p}>{p}</option>)}</select>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-sm">
            <thead><tr className="bg-slate-50"><th className="border-b px-3 py-2">类型</th><th className="border-b px-3 py-2">竞品</th><th className="border-b px-3 py-2">维度</th><th className="border-b px-3 py-2">位点</th><th className="border-b px-3 py-2">结论</th><th className="border-b px-3 py-2">复核</th></tr></thead>
            <tbody>{changes.map((c) => {
              const ov = overrides[c.key] || {};
              return (
                <tr key={c.key}>
                  <td className="border-b px-3 py-2">{c.type}</td>
                  <td className="border-b px-3 py-2">{c.item.competitor}</td>
                  <td className="border-b px-3 py-2">{c.item.dimension}</td>
                  <td className="border-b px-3 py-2">{c.item.page}</td>
                  <td className="border-b px-3 py-2">{ov.conclusion || c.item.conclusion} {ov.impact ? <span className="ml-2 text-xs text-blue-700">({ov.impact})</span> : null}</td>
                  <td className="border-b px-3 py-2">
                    <button className="mr-2 rounded border px-2 py-1 text-xs" onClick={() => setReviewed((s) => ({ ...s, [c.key]: "已复核" }))}>标记已复核</button>
                    <button className="mr-2 rounded border px-2 py-1 text-xs" onClick={() => applyManualFix(c.key, c.item)}>人工修正</button>
                    {reviewed[c.key] && <span className="ml-1 text-xs text-emerald-700">{reviewed[c.key]}</span>}
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>

        {periods.length >= 3 && (
          <div className="mt-4 rounded-lg border p-3">
            <p className="text-sm font-medium">多期趋势表（≥3期）</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {multiPeriodTrend.map((t) => <li key={t.key}>{t.key}：{t.trend}</li>)}
            </ul>
          </div>
        )}
      </section>
      )}

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">C. 质量与缺口看板</h2>
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

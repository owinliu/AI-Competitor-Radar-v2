"use client";

import { useMemo, useState } from "react";
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

const DIMS = ["APP", "客服", "消金", "留存促活运营", "风控"] as const;

function dimLabel(d: string) {
  return d === "留存促活运营" ? "运营" : d;
}

export default function ReportsCenterClient({ reports }: { reports: Report[] }) {
  const detailReport = reports[0];
  const insights = detailReport?.insights || [];

  const [competitor, setCompetitor] = useState("全部");
  const [dimension, setDimension] = useState("全部");
  const [impact, setImpact] = useState("高");
  const [changedOnly, setChangedOnly] = useState("全部");
  const [reviewOnly, setReviewOnly] = useState("全部");

  const competitors = useMemo(
    () => Array.from(new Set(insights.map((i) => i.competitor))).filter(Boolean),
    [insights]
  );

  const summaryRows = useMemo(() => {
    return competitors.map((name) => {
      const rows = insights.filter((i) => i.competitor === name);
      const comparable = rows.filter((r) => (r.prevEvidence?.length || 0) > 0 || (r.currEvidence?.length || 0) > 0).length;
      const coverage = `已纳入 ${comparable} 个可比位点`;

      const byDim = (d: string) => rows.filter((r) => r.dimension === d);
      const firstConclusion = (arr: Insight[]) => arr.find((x) => x.conclusion)?.conclusion || "—";

      const app = firstConclusion(byDim("APP"));
      const cs = firstConclusion(byDim("客服"));
      const fin = firstConclusion(byDim("消金"));
      const ops = firstConclusion(byDim("留存促活运营"));
      const risk = firstConclusion(byDim("风控"));

      const allHigh = rows.filter((r) => r.impact === "高").map((r) => r.conclusion).filter(Boolean);
      const strategy = allHigh[0] || app || ops || "—";
      const biz = allHigh.length > 1 ? allHigh.slice(0, 2).join("；") : strategy;

      const dimCounts = DIMS.map((d) => ({ d, c: rows.filter((r) => r.dimension === d && r.impact !== "低").length }));
      const top = dimCounts.sort((a, b) => b.c - a.c)[0];
      const oneLine = top?.c ? `${name}本期以${dimLabel(top.d)}维度变化最明显。` : `${name}本期整体变化不明显。`;

      return { name, coverage, strategy, app, cs, fin, ops, risk, biz, oneLine };
    });
  }, [competitors, insights]);

  const filteredRows = useMemo(() => {
    return insights.filter((r) => {
      if (competitor !== "全部" && r.competitor !== competitor) return false;
      if (dimension !== "全部" && dimLabel(r.dimension) !== dimension) return false;
      if (impact !== "全部" && r.impact !== impact) return false;
      const changed = /变化|新增|增强|切换|调整|升级/.test(`${r.conclusion}${r.compare}`);
      if (changedOnly === "仅变化明显" && !changed) return false;
      const needReview = String(r.confidence || "").includes("是");
      if (reviewOnly === "仅建议人工复核" && !needReview) return false;
      return true;
    });
  }, [insights, competitor, dimension, impact, changedOnly, reviewOnly]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">五产品总览表（核心管理视图）</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[1700px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="border-b px-3 py-2">产品</th>
                <th className="border-b px-3 py-2">证据覆盖度</th>
                <th className="border-b px-3 py-2">主策略变化</th>
                <th className="border-b px-3 py-2">APP</th>
                <th className="border-b px-3 py-2">客服</th>
                <th className="border-b px-3 py-2">消金</th>
                <th className="border-b px-3 py-2">运营</th>
                <th className="border-b px-3 py-2">风控</th>
                <th className="border-b px-3 py-2">业务含义</th>
                <th className="border-b px-3 py-2">一句对外总结</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((r) => (
                <tr key={r.name} className="align-top">
                  <td className="border-b px-3 py-2 font-medium">{r.name}</td>
                  <td className="border-b px-3 py-2">{r.coverage}</td>
                  <td className="border-b px-3 py-2">{r.strategy}</td>
                  <td className="border-b px-3 py-2">{r.app}</td>
                  <td className="border-b px-3 py-2">{r.cs}</td>
                  <td className="border-b px-3 py-2">{r.fin}</td>
                  <td className="border-b px-3 py-2">{r.ops}</td>
                  <td className="border-b px-3 py-2">{r.risk}</td>
                  <td className="border-b px-3 py-2">{r.biz}</td>
                  <td className="border-b px-3 py-2">{r.oneLine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">全局筛选器</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-5 text-sm">
          <select value={competitor} onChange={(e) => setCompetitor(e.target.value)} className="rounded border px-2 py-2">
            <option>全部</option>{competitors.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={dimension} onChange={(e) => setDimension(e.target.value)} className="rounded border px-2 py-2">
            <option>全部</option><option>APP</option><option>客服</option><option>消金</option><option>运营</option><option>风控</option>
          </select>
          <select value={impact} onChange={(e) => setImpact(e.target.value)} className="rounded border px-2 py-2">
            <option>高</option><option>全部</option><option>中</option><option>低</option>
          </select>
          <select value={changedOnly} onChange={(e) => setChangedOnly(e.target.value)} className="rounded border px-2 py-2">
            <option>全部</option><option>仅变化明显</option>
          </select>
          <select value={reviewOnly} onChange={(e) => setReviewOnly(e.target.value)} className="rounded border px-2 py-2">
            <option>全部</option><option>仅建议人工复核</option>
          </select>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">明细证据表</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[1400px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="border-b px-2 py-2">竞品</th><th className="border-b px-2 py-2">分析维度</th><th className="border-b px-2 py-2">页面位点</th><th className="border-b px-2 py-2">结论</th><th className="border-b px-2 py-2">上期截图</th><th className="border-b px-2 py-2">本期截图</th><th className="border-b px-2 py-2">对比过程</th><th className="border-b px-2 py-2">影响等级</th><th className="border-b px-2 py-2">是否建议人工复核</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => {
                const changed = /变化|新增|增强|切换|调整|升级/.test(`${r.conclusion}${r.compare}`);
                const review = String(r.confidence || "").includes("是") ? "是" : "否";
                return (
                  <tr key={r.id} className="align-top">
                    <td className="border-b px-2 py-2">{r.competitor}</td>
                    <td className="border-b px-2 py-2">{dimLabel(r.dimension)}</td>
                    <td className="border-b px-2 py-2">{r.page || "—"}</td>
                    <td className="border-b px-2 py-2">{r.conclusion || "—"}</td>
                    <td className="border-b px-2 py-2">{r.prevEvidence?.[0] ? <a target="_blank" href={r.prevEvidence[0]} className="text-blue-600 underline">查看</a> : "—"}</td>
                    <td className="border-b px-2 py-2">{r.currEvidence?.[0] ? <a target="_blank" href={r.currEvidence[0]} className="text-blue-600 underline">查看</a> : "—"}</td>
                    <td className="border-b px-2 py-2">{changed ? (r.compare || "—") : "—"}</td>
                    <td className="border-b px-2 py-2">{r.impact}</td>
                    <td className="border-b px-2 py-2">{review}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

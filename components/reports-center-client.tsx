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

function withBasePath(url: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!url) return url;
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith(basePath + "/")) return url;
  if (url.startsWith("/")) return `${basePath}${url}`;
  return `${basePath}/${url}`;
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={[
                "h-8 min-w-[48px] px-3 text-sm border transition-colors",
                active
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ReportsCenterClient({ reports }: { reports: Report[] }) {
  const [period, setPeriod] = useState("全部");
  const [competitor, setCompetitor] = useState("全部");
  const [dimension, setDimension] = useState("全部");
  const [impact, setImpact] = useState("高");

  const periodOptions = useMemo(
    () => Array.from(new Set(reports.map((r) => r.period).filter(Boolean) as string[])),
    [reports]
  );

  const detailReport = period === "全部" ? reports[0] : reports.find((r) => r.period === period) || reports[0];
  const insights = detailReport?.insights || [];

  const competitors = useMemo(
    () => Array.from(new Set(insights.map((i) => i.competitor))).filter(Boolean),
    [insights]
  );

  const summaryRows = useMemo(() => {
    return competitors.map((name) => {
      const rows = insights.filter((i) => i.competitor === name);
      const comparable = rows.filter((r) => (r.prevEvidence?.length || 0) > 0 || (r.currEvidence?.length || 0) > 0).length;
      const coverage = String(comparable);

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
      return true;
    });
  }, [insights, competitor, dimension, impact]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">五产品总览表（核心管理视图）</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[1700px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="border-b px-3 py-2 whitespace-nowrap min-w-[5em]">产品</th>
                <th className="border-b px-3 py-2 whitespace-nowrap">截图变化数</th>
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
                  <td className="border-b px-3 py-2 font-medium whitespace-nowrap min-w-[5em]">{r.name}</td>
                  <td className="border-b px-3 py-2 whitespace-nowrap">{r.coverage}</td>
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
        <div className="mt-3 grid gap-3 text-sm lg:grid-cols-3">
          <FilterGroup
            label="竞品"
            options={["全部", ...competitors]}
            value={competitor}
            onChange={setCompetitor}
          />
          <FilterGroup
            label="维度"
            options={["全部", "APP", "客服", "消金", "运营", "风控"]}
            value={dimension}
            onChange={setDimension}
          />
          <FilterGroup
            label="变化等级"
            options={["全部", "高", "中", "低"]}
            value={impact}
            onChange={setImpact}
          />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold">明细证据表</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[1900px] border-collapse text-sm text-slate-800">
            <thead>
              <tr className="bg-slate-100 text-left text-base font-semibold text-slate-700">
                <th className="border-b border-slate-200 px-5 py-4">竞品</th><th className="border-b border-slate-200 px-5 py-4">分析维度</th><th className="border-b border-slate-200 px-5 py-4">页面位点</th><th className="border-b border-slate-200 px-5 py-4">结论</th><th className="border-b border-slate-200 px-5 py-4">上期截图</th><th className="border-b border-slate-200 px-5 py-4">本期截图</th><th className="border-b border-slate-200 px-5 py-4">对比过程（仅变化明显时展示）</th><th className="border-b border-slate-200 px-5 py-4">影响等级</th><th className="border-b border-slate-200 px-5 py-4">是否建议人工复核</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => {
                const changed = /变化|新增|增强|切换|调整|升级/.test(`${r.conclusion}${r.compare}`);
                const review = String(r.confidence || "").includes("是") ? "是" : "否";
                return (
                  <tr key={r.id} className="align-top">
                    <td className="border-b border-slate-200 px-5 py-5 whitespace-nowrap">{r.competitor}</td>
                    <td className="border-b border-slate-200 px-5 py-5 whitespace-nowrap">{dimLabel(r.dimension)}</td>
                    <td className="border-b border-slate-200 px-5 py-5 whitespace-nowrap">{r.page || "—"}</td>
                    <td className="border-b border-slate-200 px-5 py-5 leading-relaxed">{r.conclusion || "—"}</td>
                    <td className="border-b border-slate-200 px-5 py-5">{r.prevEvidence?.[0] ? <a target="_blank" href={withBasePath(r.prevEvidence[0])}><img src={withBasePath(r.prevEvidence[0])} alt="上期截图" className="h-[180px] w-[120px] rounded-md border border-slate-300 object-cover" /></a> : "—"}</td>
                    <td className="border-b border-slate-200 px-5 py-5">{r.currEvidence?.[0] ? <a target="_blank" href={withBasePath(r.currEvidence[0])}><img src={withBasePath(r.currEvidence[0])} alt="本期截图" className="h-[180px] w-[120px] rounded-md border border-slate-300 object-cover" /></a> : "—"}</td>
                    <td className="border-b border-slate-200 px-5 py-5 leading-relaxed">{changed ? (r.compare || "—") : "—"}</td>
                    <td className="border-b border-slate-200 px-5 py-5 whitespace-nowrap">{r.impact}</td>
                    <td className="border-b border-slate-200 px-5 py-5 whitespace-nowrap">{review}</td>
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

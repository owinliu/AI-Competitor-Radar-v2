"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function ReportsCenterClient({ reports, timelineKey = "0323-0402" }: { reports: Report[]; timelineKey?: string }) {
  const is0428 = timelineKey === "0323-0428";
  const [competitor, setCompetitor] = useState("全部");
  const [dimension, setDimension] = useState("全部");
  const [impact, setImpact] = useState("高");

  const detailReport = useMemo(() => {
    const hit = reports.find((r) => (r.period || "").replace(/\s/g, "") === timelineKey);
    return hit || reports[0];
  }, [reports, timelineKey]);
  const insights = detailReport?.insights || [];

  useEffect(() => {
    setCompetitor("全部");
    setDimension("全部");
    setImpact("高");
  }, [timelineKey]);

  const competitors = useMemo(
    () => Array.from(new Set(insights.map((i) => i.competitor))).filter(Boolean),
    [insights]
  );

  const summaryRows = useMemo(() => {
    return competitors.map((name) => {
      const rows = insights.filter((i) => i.competitor === name);
      const coverage = String(rows.length);

      const byDim = (d: string) => rows.filter((r) => r.dimension === d);
      const firstConclusion = (arr: Insight[]) => arr.find((x) => x.conclusion)?.conclusion || "—";

      const highRows = rows.filter((r) => r.impact === "高");
      const highByDim = (d: string) => highRows.filter((r) => r.dimension === d);
      const neutral = (s: string) => (s || "").split("，")[0] || "—";

      const rewriteConclusion = (c: string) => {
        const s = neutral(c || "");
        if (/仅有\d{4}/.test(s) || /缺少\d{4}基线/.test(s)) {
          if (/活动\d+/.test(s) || /活动/.test(s)) return "新增活动位（新周期出现），用于活动触达与转化引导。";
          return "新增展示位（新周期出现），用于运营触达与转化引导。";
        }
        return s;
      };

      const app = rewriteConclusion(firstConclusion(highByDim("APP")));
      const cs = rewriteConclusion(firstConclusion(highByDim("客服")));
      const fin = rewriteConclusion(firstConclusion(highByDim("消金")));
      const ops = rewriteConclusion(firstConclusion(highByDim("留存促活运营")));
      const risk = rewriteConclusion(firstConclusion(highByDim("风控")));
      const highConclusions = highRows.map((r) => rewriteConclusion(r.conclusion)).filter(Boolean);
      const strategy = highConclusions[0] || "本期未识别到可比高影响变化。";
      const biz = highConclusions.length > 1 ? highConclusions.slice(0, 2).join("；") : strategy;

      const dimCounts = DIMS.map((d) => ({ d, c: highRows.filter((r) => r.dimension === d).length }));
      const top = dimCounts.sort((a, b) => b.c - a.c)[0];
      const oneLine = top?.c ? `${name}本期高影响变化主要集中在${dimLabel(top.d)}维度。` : `${name}本期未出现可比高影响变化（如新增活动/入口替换）。`;

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
      {!is0428 && (
        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-base font-semibold">五产品总览表（核心管理视图）</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="border-b px-2 py-2 whitespace-nowrap">产品</th>
                  <th className="border-b px-2 py-2 whitespace-nowrap">截图变化数</th>
                  <th className="border-b px-2 py-2 whitespace-nowrap">主策略变化</th>
                  <th className="border-b px-2 py-2 whitespace-nowrap">APP</th>
                  <th className="border-b px-2 py-2 whitespace-nowrap">客服</th>
                  <th className="border-b px-2 py-2 whitespace-nowrap">消金</th>
                  <th className="border-b px-2 py-2 whitespace-nowrap">运营</th>
                  <th className="border-b px-2 py-2 whitespace-nowrap">风控</th>
                  <th className="border-b px-2 py-2 whitespace-nowrap">业务含义</th>
                  <th className="border-b px-2 py-2 whitespace-nowrap">一句对外总结</th>
                </tr>
              </thead>
              <tbody>
                {summaryRows.map((r) => (
                  <tr key={r.name} className="align-top">
                    <td className="border-b px-2 py-2 font-medium whitespace-nowrap">{r.name}</td>
                    <td className="border-b px-2 py-2 whitespace-nowrap">{r.coverage}</td>
                    <td className="border-b px-2 py-2 break-words leading-5">{r.strategy}</td>
                    <td className="border-b px-2 py-2 break-words leading-5">{r.app}</td>
                    <td className="border-b px-2 py-2 break-words leading-5">{r.cs}</td>
                    <td className="border-b px-2 py-2 break-words leading-5">{r.fin}</td>
                    <td className="border-b px-2 py-2 break-words leading-5">{r.ops}</td>
                    <td className="border-b px-2 py-2 break-words leading-5">{r.risk}</td>
                    <td className="border-b px-2 py-2 break-words leading-5">{r.biz}</td>
                    <td className="border-b px-2 py-2 break-words leading-5">{r.oneLine}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="rounded-xl border bg-card p-5">
        {is0428 && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div>当前默认：<span className="font-semibold text-slate-900">高影响</span></div>
            <div>输入口径：180张全量截图，输出 98 行位点</div>
            <div>当前筛选结果：<span className="font-semibold text-slate-900">{filteredRows.length}</span> 行</div>
          </div>
        )}
        <div className="grid gap-3 text-sm lg:grid-cols-3">
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
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">明细证据表</h2>
            {is0428 && (
              <p className="mt-1 text-sm text-slate-500">字段固定：竞品｜分析维度｜页面位点｜结论｜上期截图｜本期截图｜对比过程（仅明显变化时展示）｜影响等级｜是否人工复核</p>
            )}
          </div>
          {is0428 && (
            <div className="text-sm text-slate-500">默认展示规则：先看高影响，再按竞品 / 维度 / 变化等级筛选</div>
          )}
        </div>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[1900px] border-collapse text-sm text-slate-800">
            <thead>
              <tr className="bg-slate-100 text-left text-base font-semibold text-slate-700">
                <th className="border-b border-slate-200 px-5 py-4">竞品</th><th className="border-b border-slate-200 px-5 py-4">分析维度</th><th className="border-b border-slate-200 px-5 py-4">页面位点</th><th className="border-b border-slate-200 px-5 py-4">结论</th><th className="border-b border-slate-200 px-5 py-4">上期截图</th><th className="border-b border-slate-200 px-5 py-4">本期截图</th><th className="border-b border-slate-200 px-5 py-4">对比过程（仅变化明显时展示）</th><th className="border-b border-slate-200 px-5 py-4">影响等级</th><th className="border-b border-slate-200 px-5 py-4">是否建议人工复核</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => {
                const changed = /变化|新增|增强|切换|调整|升级|前置|替换|扩展|新增露出/.test(`${r.conclusion}${r.compare}`);
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
                    <td className="border-b border-slate-200 px-5 py-5 whitespace-nowrap">
                      <span className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        r.impact === "高" ? "bg-rose-100 text-rose-700" : r.impact === "中" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700",
                      ].join(" ")}>{r.impact}</span>
                    </td>
                    <td className="border-b border-slate-200 px-5 py-5 whitespace-nowrap">
                      <span className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        review === "是" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700",
                      ].join(" ")}>{review}</span>
                    </td>
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

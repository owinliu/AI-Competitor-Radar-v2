"use client";
import { useMemo, useState } from "react";
import type { Insight } from "@/lib/reports";
import { Button } from "@/components/ui/button";

function group(title: string, arr: string[], value: string, onChange: (v: string) => void) {
  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">
        {arr.map((x) => (
          <Button key={x} size="sm" variant={x === value ? "default" : "outline"} onClick={() => onChange(x)}>{x}</Button>
        ))}
      </div>
    </div>
  );
}

export default function ReportInsightPanel({ insights }: { insights: Insight[] }) {
  const [competitor, setCompetitor] = useState("全部");
  const [dimension, setDimension] = useState("全部");
  const [period, setPeriod] = useState("全部");

  const competitors = ["全部", ...Array.from(new Set(insights.map((x) => x.competitor)))];
  const dimensions = ["全部", ...Array.from(new Set(insights.map((x) => x.dimension)))];
  const periods = ["全部", ...Array.from(new Set(insights.map((x) => x.period)))];

  const filtered = useMemo(() => insights.filter((x) => {
    if (competitor !== "全部" && x.competitor !== competitor) return false;
    if (dimension !== "全部" && x.dimension !== dimension) return false;
    if (period !== "全部" && x.period !== period) return false;
    return true;
  }), [insights, competitor, dimension, period]);

  const layeredConclusion = useMemo(() => {
    if (competitor === "全部" && dimension === "全部" && period === "全部") {
      return `全局结论：当前报告共 ${insights.length} 条有效洞察，重点集中在 APP 与留存促活运营。`;
    }
    if (competitor === "全部" && dimension !== "全部") {
      return `维度结论（${dimension}）：命中 ${filtered.length} 条洞察。`;
    }
    return `交叉结论（${competitor}/${dimension}/${period}）：命中 ${filtered.length} 条洞察。`;
  }, [competitor, dimension, period, filtered.length, insights.length]);

  return (
    <section className="rounded-xl border bg-card p-5 space-y-4">
      <h2 className="text-lg font-semibold">动态结论面板（按筛选联动）</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {group("竞品", competitors, competitor, setCompetitor)}
        {group("维度", dimensions, dimension, setDimension)}
        {group("周期", periods, period, setPeriod)}
      </div>

      <div className="rounded-lg border bg-muted/30 p-3 text-sm">
        <p className="font-medium">{layeredConclusion}</p>
      </div>

      <div className="space-y-3">
        {filtered.map((x) => (
          <div key={x.id} className="rounded-lg border p-3">
            <p className="text-sm font-semibold">[{x.competitor} · {x.dimension}] {x.conclusion}</p>
            <p className="mt-1 text-xs text-muted-foreground">影响等级：{x.impact}｜置信度：{x.confidence}</p>
            {x.actions.length > 0 && <ul className="mt-2 list-disc pl-5 text-sm">{x.actions.map((a) => <li key={a}>{a}</li>)}</ul>}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-600">
              <th className="border-b border-slate-200 px-3 py-2">竞品</th>
              <th className="border-b border-slate-200 px-3 py-2">维度</th>
              <th className="border-b border-slate-200 px-3 py-2">周期</th>
              <th className="border-b border-slate-200 px-3 py-2">结论</th>
              <th className="border-b border-slate-200 px-3 py-2">截图证据</th>
              <th className="border-b border-slate-200 px-3 py-2">影响/置信度</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((x) => (
              <tr key={`${x.id}-row`}>
                <td className="border-b border-slate-100 px-3 py-3">{x.competitor}</td>
                <td className="border-b border-slate-100 px-3 py-3">{x.dimension}</td>
                <td className="border-b border-slate-100 px-3 py-3">{x.period}</td>
                <td className="border-b border-slate-100 px-3 py-3 max-w-[320px]">{x.conclusion}</td>
                <td className="border-b border-slate-100 px-3 py-3">
                  <div className="flex flex-wrap gap-2 min-w-[180px]">
                    {x.evidence.length > 0 ? x.evidence.map((src) => (
                      <img key={src} src={src} alt={src} className="h-14 w-20 rounded border object-cover" />
                    )) : <span className="text-xs text-muted-foreground">无</span>}
                  </div>
                </td>
                <td className="border-b border-slate-100 px-3 py-3">{x.impact} / {x.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && <p className="text-sm text-muted-foreground">当前筛选条件下暂无匹配数据。</p>}
    </section>
  );
}

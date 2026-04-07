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
    </section>
  );
}

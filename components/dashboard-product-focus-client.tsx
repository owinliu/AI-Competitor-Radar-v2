"use client";

import { useMemo, useState } from "react";

type DimValue = { dimension: string; count: number };
type Item = { competitor: string; count: number; values: DimValue[]; highlights: string[] };

function dimLabel(dim: string) {
  return dim === "留存促活运营" ? "运营" : dim;
}

function buildConic(values: DimValue[]) {
  const palette: Record<string, string> = {
    APP: "#334155",
    风控: "#7c3aed",
    客服: "#0f766e",
    消金: "#b45309",
    留存促活运营: "#be123c",
  };
  const total = values.reduce((n, x) => n + x.count, 0) || 1;
  let start = 0;
  const parts = values
    .filter((x) => x.count > 0)
    .map((x) => {
      const pct = (x.count / total) * 100;
      const end = start + pct;
      const seg = `${palette[x.dimension] || "#64748b"} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
      start = end;
      return seg;
    });
  return `conic-gradient(${parts.join(", ")})`;
}

export default function DashboardProductFocusClient({ items }: { items: Item[] }) {
  const [selected, setSelected] = useState(items[0]?.competitor || "");

  const selectedItem = useMemo(() => items.find((x) => x.competitor === selected) || items[0], [items, selected]);
  const max = Math.max(items[0]?.count || 1, 1);

  if (!items.length || !selectedItem) return null;

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-3">
        {items.map((item) => {
          const width = `${Math.max((item.count / max) * 100, 4)}%`;
          const active = item.competitor === selectedItem.competitor;
          return (
            <button
              key={item.competitor}
              type="button"
              onClick={() => setSelected(item.competitor)}
              className={`w-full rounded border p-3 text-left ${active ? "border-slate-900 bg-slate-50" : "hover:bg-muted/30"}`}
            >
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{item.competitor}</span>
                <span className="text-muted-foreground">{item.count}</span>
              </div>
              <div className="h-2 rounded bg-slate-100">
                <div className="h-2 rounded bg-slate-800" style={{ width }} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded border bg-white p-4">
        <p className="text-sm font-semibold">{selectedItem.competitor} · 维度构成与关键变化</p>
        <div className="mt-3 flex items-start gap-5">
          <div className="h-40 w-40 shrink-0 rounded-full border" style={{ background: buildConic(selectedItem.values) }} />
          <div className="flex-1 space-y-3">
            <div className="text-xs text-muted-foreground space-y-1">
              {selectedItem.values.filter((x) => x.count > 0).map((x) => (
                <p key={`${selectedItem.competitor}-${x.dimension}`}>{dimLabel(x.dimension)}：{x.count}</p>
              ))}
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">关键结论</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                {selectedItem.highlights.length > 0 ? selectedItem.highlights.map((h, i) => <li key={`${selectedItem.competitor}-h-${i}`}>{h}</li>) : <li>暂无关键结论</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

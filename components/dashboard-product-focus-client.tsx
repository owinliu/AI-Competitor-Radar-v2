"use client";

import { useMemo, useState } from "react";

type DimValue = { dimension: string; count: number };
type Item = { competitor: string; count: number; values: DimValue[]; highlights: string[] };

function dimLabel(dim: string) {
  return dim === "留存促活运营" ? "运营" : dim;
}

function buildConic(values: DimValue[]) {
  const palette: Record<string, string> = {
    APP: "#533afd",
    风控: "#665efd",
    客服: "#2b91df",
    消金: "#9b6829",
    留存促活运营: "#ea2261",
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
              className={`w-full rounded-md border p-3 text-left transition ${active ? "border-[#b9b9f9] bg-[#f6f3ff]" : "border-[#e5edf5] bg-white hover:bg-[#fafbff]"}`}
            >
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{item.competitor}</span>
                <span className="text-muted-foreground">{item.count}</span>
              </div>
              <div className="h-2 rounded bg-[#eef2ff]">
                <div className="h-2 rounded bg-[#533afd]" style={{ width }} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-md border border-[#e5edf5] bg-white p-4">
        <p className="text-sm font-semibold">{selectedItem.competitor} · 维度构成与关键变化</p>
        <div className="mt-3 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mx-auto h-40 w-40 rounded-full border" style={{ background: buildConic(selectedItem.values) }} />
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              {selectedItem.values.filter((x) => x.count > 0).length > 0 ? (
                selectedItem.values.filter((x) => x.count > 0).map((x) => {
                  const total = selectedItem.values.reduce((n, v) => n + v.count, 0) || 1;
                  const pct = Math.round((x.count / total) * 100);
                  return <p key={`${selectedItem.competitor}-${x.dimension}`}>{dimLabel(x.dimension)}：{x.count}（{pct}%）</p>;
                })
              ) : (
                <p>无明显变化</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-foreground">结论（仅展示可判断变化）</p>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
              {selectedItem.highlights.length > 0 ? selectedItem.highlights.map((h, i) => <li key={`${selectedItem.competitor}-h-${i}`}>{h}</li>) : <li>本期暂无可明确判断的变化结论</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

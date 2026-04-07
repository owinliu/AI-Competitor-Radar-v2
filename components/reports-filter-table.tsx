"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Row = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  competitors: string[];
  dimensions: string[];
  period?: string;
};

function OptionGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((x) => {
          const active = x === value;
          return (
            <Button
              key={x}
              type="button"
              variant={active ? "default" : "outline"}
              size="sm"
              className={active ? "bg-primary text-primary-foreground" : ""}
              onClick={() => onChange(x)}
            >
              {x}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default function ReportsFilterTable({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState("");
  const [competitor, setCompetitor] = useState("全部");
  const [dimension, setDimension] = useState("全部");
  const [period, setPeriod] = useState("全部");

  const competitors = ["全部", ...Array.from(new Set(rows.flatMap((r) => r.competitors)))];
  const dimensions = ["全部", ...Array.from(new Set(rows.flatMap((r) => r.dimensions)))];
  const periods = ["全部", ...Array.from(new Set(rows.map((r) => r.period).filter(Boolean) as string[]))];

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (competitor !== "全部" && !r.competitors.includes(competitor)) return false;
        if (dimension !== "全部" && !r.dimensions.includes(dimension)) return false;
        if (period !== "全部" && r.period !== period) return false;
        if (!q) return true;
        const text = `${r.title} ${r.tags.join(" ")} ${r.competitors.join(" ")} ${r.dimensions.join(" ")}`.toLowerCase();
        return text.includes(q.toLowerCase());
      }),
    [rows, q, competitor, dimension, period]
  );

  return (
    <div className="grid gap-4 md:grid-cols-[320px_1fr]">
      <aside className="rounded-xl border bg-card p-4 space-y-4">
        <div>
          <p className="mb-2 text-sm font-semibold">关键词</p>
          <Input placeholder="搜索标题/标签/竞品" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <OptionGroup title="竞品" options={competitors} value={competitor} onChange={setCompetitor} />
        <OptionGroup title="维度" options={dimensions} value={dimension} onChange={setDimension} />
        <OptionGroup title="时间周期" options={periods} value={period} onChange={setPeriod} />
      </aside>

      <div className="rounded-xl border bg-card p-4 overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead>标题</TableHead>
              <TableHead>日期</TableHead>
              <TableHead>竞品</TableHead>
              <TableHead>维度</TableHead>
              <TableHead>周期</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.slug}>
                <TableCell className="font-medium">{r.title}</TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.competitors.join("/")}</TableCell>
                <TableCell>{r.dimensions.join("/")}</TableCell>
                <TableCell>{r.period || "-"}</TableCell>
                <TableCell>
                  <Link href={`/reports/${r.slug}`} className="text-primary">
                    查看详情
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

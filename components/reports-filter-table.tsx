"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Row = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  competitors: string[];
  dimensions: string[];
  period?: string;
};

export default function ReportsFilterTable({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState("");
  const [competitor, setCompetitor] = useState("全部");
  const [dimension, setDimension] = useState("全部");
  const [period, setPeriod] = useState("全部");

  const competitors = ["全部", ...Array.from(new Set(rows.flatMap((r) => r.competitors)))];
  const dimensions = ["全部", ...Array.from(new Set(rows.flatMap((r) => r.dimensions)))];
  const periods = ["全部", ...Array.from(new Set(rows.map((r) => r.period).filter(Boolean) as string[]))];

  const filtered = useMemo(() => rows.filter((r) => {
    if (competitor !== "全部" && !r.competitors.includes(competitor)) return false;
    if (dimension !== "全部" && !r.dimensions.includes(dimension)) return false;
    if (period !== "全部" && r.period !== period) return false;
    if (!q) return true;
    const text = `${r.title} ${r.tags.join(" ")} ${r.competitors.join(" ")} ${r.dimensions.join(" ")}`.toLowerCase();
    return text.includes(q.toLowerCase());
  }), [rows, q, competitor, dimension, period]);

  return (
    <div className="grid gap-4 md:grid-cols-[260px_1fr]">
      <aside className="rounded-xl border bg-card p-4">
        <p className="text-sm font-semibold">筛选器</p>
        <div className="mt-3 space-y-3 text-sm">
          <Input placeholder="关键词搜索" value={q} onChange={(e) => setQ(e.target.value)} />

          <Select value={competitor} onValueChange={(v) => setCompetitor(v ?? "全部")}>
            <SelectTrigger className="w-full"><SelectValue placeholder="竞品" /></SelectTrigger>
            <SelectContent>{competitors.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
          </Select>

          <Select value={dimension} onValueChange={(v) => setDimension(v ?? "全部")}>
            <SelectTrigger className="w-full"><SelectValue placeholder="维度" /></SelectTrigger>
            <SelectContent>{dimensions.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
          </Select>

          <Select value={period} onValueChange={(v) => setPeriod(v ?? "全部")}>
            <SelectTrigger className="w-full"><SelectValue placeholder="时间周期" /></SelectTrigger>
            <SelectContent>{periods.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </aside>

      <div className="rounded-xl border bg-card p-4 overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead>标题</TableHead><TableHead>日期</TableHead><TableHead>竞品</TableHead><TableHead>维度</TableHead><TableHead>周期</TableHead><TableHead>操作</TableHead>
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
                <TableCell><Link href={`/reports/${r.slug}`} className="text-primary">查看详情</Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

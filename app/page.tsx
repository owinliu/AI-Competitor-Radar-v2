import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllReports } from "@/lib/reports";

export default function HomePage() {
  const reports = getAllReports();

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-bold">分析报告中心</h1>
      <p className="mt-2 text-muted">飞书同步 + 网页版展示（Next.js + shadcn/ui）</p>

      <div className="mt-8 grid gap-4">
        {reports.map((report) => (
          <Link key={report.slug} href={`/reports/${report.slug}`}>
            <Card className="transition hover:border-accent">
              <CardHeader>
                <CardTitle>{report.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted">{report.summary || "查看完整分析"}</p>
                <Badge>{report.date}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}

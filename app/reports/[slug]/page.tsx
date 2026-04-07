import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllReports, getReportBySlug } from "@/lib/reports";

export function generateStaticParams() {
  return getAllReports().map((r) => ({ slug: r.slug }));
}

export default function ReportPage({ params }: { params: { slug: string } }) {
  const report = getReportBySlug(params.slug);
  if (!report) return notFound();

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/" className="text-sm text-accent">← 返回报告列表</Link>
      <h1 className="mt-4 text-3xl font-bold">{report.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge>{report.date}</Badge>
        {report.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>结论先行</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
              {(report.highlights.length ? report.highlights : ["请在 frontmatter 中补充 highlights"]).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>建议动作（30天）</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
              {(report.actions.length ? report.actions : ["请在 frontmatter 中补充 actions"]).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>详细分析</CardTitle></CardHeader>
        <CardContent>
          <article className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-table:text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{report.content}</ReactMarkdown>
          </article>
        </CardContent>
      </Card>
    </main>
  );
}

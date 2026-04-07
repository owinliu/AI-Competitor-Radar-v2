import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getAllReports, getReportBySlug } from "@/lib/reports";

export function generateStaticParams() {
  return getAllReports().map((r) => ({ slug: r.slug }));
}

export default function ReportPage({ params }: { params: { slug: string } }) {
  const report = getReportBySlug(params.slug);
  if (!report) return notFound();

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/" className="text-sm text-accent">← 返回报告列表</Link>
      <h1 className="mt-4 text-3xl font-bold">{report.title}</h1>
      <p className="mt-2 text-sm text-muted">{report.date}</p>

      <article className="prose prose-invert mt-8 max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground">
        <ReactMarkdown>{report.content}</ReactMarkdown>
      </article>
    </main>
  );
}

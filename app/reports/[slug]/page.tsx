import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllReports, getReportBySlug } from "@/lib/reports";
import { notFound } from "next/navigation";
import ReportToc from "@/components/report-toc";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReportInsightPanel from "@/components/report-insight-panel";

function slugify(input: string) {
  return input.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, "-").replace(/(^-|-$)/g, "");
}

export function generateStaticParams() {
  return getAllReports().map((r) => ({ slug: r.slug }));
}

export default function ReportPage({ params }: { params: { slug: string } }) {
  const report = getReportBySlug(params.slug);
  if (!report) return notFound();

  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr]">
      <aside className="rounded-xl border bg-card p-4 h-fit sticky top-20">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">章节导航</p>
        <div className="mt-2"><ReportToc items={report.sections} /></div>
      </aside>

      <div className="space-y-6">
        <section className="rounded-xl border bg-card p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">周报详情</p>
          <h1 className="mt-2 text-2xl font-semibold">{report.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{report.summary}</p>
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList>
              <TabsTrigger value="overview">总览</TabsTrigger>
              <TabsTrigger value="table">对比表</TabsTrigger>
              <TabsTrigger value="evidence">证据</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-3 text-sm text-muted-foreground">本页已按结构化周报工作台展示。</TabsContent>
            <TabsContent value="table" className="pt-3 text-sm text-muted-foreground">下方包含固定表头的对比主表。</TabsContent>
            <TabsContent value="evidence" className="pt-3 text-sm text-muted-foreground">图片证据在正文表格与证据库同步。</TabsContent>
          </Tabs>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="text-lg font-semibold">本周结论</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground">
              {report.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h2 className="text-lg font-semibold">行动建议</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground">
              {report.actions.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </section>

        {report.insights.length > 0 && <ReportInsightPanel insights={report.insights} />}

        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">结构化主表与详细分析</h2>
          <article className="prose mt-4 max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => {
                  const text = String(children);
                  const id = `sec-${slugify(text)}`;
                  return <h2 id={id}>{children}</h2>;
                },
              }}
            >
              {report.content}
            </ReactMarkdown>
          </article>
        </section>
      </div>
    </div>
  );
}

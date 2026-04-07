import fs from "fs";
import path from "path";
import matter from "gray-matter";

const reportsDir = path.join(process.cwd(), "content", "reports");

export type ReportMeta = {
  slug: string;
  title: string;
  date: string;
  summary?: string;
};

export function getAllReports(): ReportMeta[] {
  if (!fs.existsSync(reportsDir)) return [];
  return fs
    .readdirSync(reportsDir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(reportsDir, filename), "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: (data.title as string) || slug,
        date: (data.date as string) || "",
        summary: data.summary as string | undefined,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getReportBySlug(slug: string) {
  const fullPath = path.join(reportsDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: (data.title as string) || slug,
    date: (data.date as string) || "",
    summary: data.summary as string | undefined,
    content,
  };
}

"use client";
import ReportsCenterClient from "@/components/reports-center-client";
import { useTimeline } from "@/components/timeline-key-bridge-client";
import recompare0428Data from "@/data/recompare_0323_0428_reports.json";

export default function ReportsTimelineClient({ reports }: { reports: any[] }) {
  const key = useTimeline();
  return <ReportsCenterClient reports={reports} timelineKey={key} override0428Insights={(recompare0428Data as any).insights || []} />;
}

"use client";
import ReportsCenterClient from "@/components/reports-center-client";
import { useTimeline } from "@/components/timeline-key-bridge-client";

export default function ReportsTimelineClient({ reports }: { reports: any[] }) {
  const key = useTimeline();
  return <ReportsCenterClient reports={reports} timelineKey={key} />;
}

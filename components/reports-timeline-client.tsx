"use client";
import ReportsCenterClient from "@/components/reports-center-client";
import { useTimeline } from "@/components/timeline-key-bridge-client";

export default function ReportsTimelineClient({ reports }: { reports: any[] }) {
  const key = useTimeline();
  const sorted = [...reports];
  const mapped = key === "0323-0428" ? sorted : sorted;
  return <ReportsCenterClient reports={mapped} />;
}

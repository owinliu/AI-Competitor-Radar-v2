import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Competitor Radar",
  description: "分析报告中心",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

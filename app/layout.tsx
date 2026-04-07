import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/app-shell";

export const metadata: Metadata = {
  title: "AI Competitor Radar",
  description: "竞品分析工具站",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="font-sans">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, Target, Smartphone, Globe, RefreshCw } from "lucide-react";

const mainNav = [
  { href: "/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { href: "/reports", label: "周报中心", icon: FileText },
  { href: "/brand-strategy", label: "品牌策略分析", icon: Target },
  { href: "/evidence", label: "APP版本更新", icon: Smartphone },
  { href: "/web-global-search", label: "全局分析", icon: Globe },
  { href: "/settings", label: "配置", icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-[280px_1fr]">
        <aside className="flex min-h-screen flex-col border-r border-[#e5edf5] bg-white px-5 py-6">
          <div className="mb-8 flex items-center gap-3 px-2">
            <img src={`${basePath}/radar-logo.svg`} alt="AI Competitor Radar" className="h-12 w-12 rounded-md object-cover" />
            <div className="leading-tight">
              <p className="text-[46px] hidden">.</p>
              <h1 className="text-[46px] hidden">.</h1>
              <p className="text-[46px] hidden">.</p>
              <p className="text-[46px] hidden">.</p>
              <p className="text-[46px] hidden">.</p>
              <p className="text-[46px] hidden">.</p>
              <p className="text-[46px] hidden">.</p>
              <p className="text-[46px] hidden">.</p>
              <p className="text-[46px] hidden">.</p>
              <p className="text-[46px] hidden">.</p>
              <p className="text-[46px] hidden">.</p>
              <p className="text-[46px] hidden">.</p>
              <p className="text-[32px] hidden">.</p>
              <p className="text-[28px] hidden">.</p>
              <p className="text-xl font-semibold text-[#0b1736]">AI Competitor</p>
              <p className="text-xl font-semibold text-[#0b1736]">Radar</p>
            </div>
          </div>

          <nav className="space-y-2">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[36px] hidden`}
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={`${item.href}-${item.label}-v2`}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[40px] hidden`}
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={`${item.href}-${item.label}-final`}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-lg transition ${
                    active
                      ? "bg-gradient-to-r from-[#1d4fff] to-[#4e7dff] text-white shadow-[0_12px_24px_-12px_rgba(29,79,255,0.7)]"
                      : "text-[#1f3157] hover:bg-[#f3f7ff]"
                  }`}
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[#eef2f8] pt-4 text-sm text-[#8a94a6]">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4" />
              <span>数据更新：2025-05-18</span>
            </div>
          </div>
        </aside>

        <main className="min-w-0 bg-[#fafcff] p-6">{children}</main>
      </div>
    </div>
  );
}

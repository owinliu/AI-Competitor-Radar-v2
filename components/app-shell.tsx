"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, FileText, Settings, Target, Smartphone, Globe } from "lucide-react";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const mainNav = [
  { href: "/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { href: "/reports", label: "周报中心", icon: FileText },
  { href: "/brand-strategy", label: "品牌策略分析", icon: Target },
  { href: "/evidence", label: "APP版本更新", icon: Smartphone },
  { href: "/web-global-search", label: "网络全局搜索", icon: Globe },
  { href: "/settings", label: "配置", icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="icon-sm" className="md:hidden" />}>
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader><SheetTitle>导航</SheetTitle></SheetHeader>
                <div className="mt-3 flex flex-col gap-1 px-4">
                  {mainNav.map((item) => {
                    const Icon = item.icon;
                    const active = pathname.startsWith(item.href);
                    return (
                      <Link key={`${item.href}-${item.label}`} href={item.href} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap ${active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"}`}>
                        <Icon className={`size-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
            <img src={`${basePath}/radar-logo.svg`} alt="AI Competitor Radar" className="h-7 w-7 rounded-md object-cover shadow-sm" />
            <span className="text-sm font-semibold">AI Competitor Radar</span>
          </div>
          <Link href="/reports" className="text-sm text-muted-foreground">周报中心</Link>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-56px)] grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-background p-3 md:block md:sticky md:top-14 md:self-start md:h-[calc(100vh-56px)] md:overflow-y-auto">
          <NavigationMenu className="w-full max-w-none justify-start">
            <NavigationMenuList className="flex w-full flex-col items-stretch gap-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <NavigationMenuItem key={`${item.href}-${item.label}`}>
                    <NavigationMenuLink
                      render={<Link href={item.href} />}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"}`}
                    >
                      <Icon className={`size-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </aside>

        <main className="min-w-0 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, FileText, ImageIcon, Settings } from "lucide-react";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const mainNav = [
  { href: "/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { href: "/reports", label: "周报中心", icon: FileText },
  { href: "/evidence", label: "证据库", icon: ImageIcon },
  { href: "/settings", label: "配置", icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
                      <Link key={item.href} href={item.href} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap ${active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"}`}>
                        <Icon className={`size-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
            <div className="h-7 w-7 rounded-md bg-primary shadow-sm" />
            <span className="text-sm font-semibold">AI Competitor Radar</span>
          </div>
          <Link href="/reports" className="text-sm text-muted-foreground">周报中心</Link>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-56px)] grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-background p-3 md:block">
          <NavigationMenu className="w-full max-w-none justify-start">
            <NavigationMenuList className="flex w-full flex-col items-stretch gap-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <NavigationMenuItem key={item.href}>
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

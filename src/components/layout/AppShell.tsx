import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, Settings2, WifiOff } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { formatHijri } from "@/lib/hijri";
import { haptic } from "@/lib/haptics";
import { BottomNav } from "./BottomNav";
import { AnimatedBackground } from "./AnimatedBackground";

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const { settings, updateSettings, online } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative min-h-screen pb-28" dir="rtl">
      {settings.animatedBackground ? (
        <AnimatedBackground />
      ) : (
        <div aria-hidden className="pattern-geo pointer-events-none fixed inset-0 -z-10 opacity-[0.35]" />
      )}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl" style={{ boxShadow: '0 4px 20px rgba(27, 42, 74, 0.08)' }}>
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold leading-tight" style={{ fontFamily: 'Amiri, serif' }}>{title ?? "أحلام الروح"}</h1>
            <p className="truncate text-xs text-muted-foreground">{subtitle ?? formatHijri(new Date())}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {!online && (
              <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-secondary-foreground">
                <WifiOff className="size-3" /> أوفلاين
              </span>
            )}
            <button
              aria-label="تبديل الوضع الليلي"
              onClick={() => {
                haptic("light");
                updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
              }}
              className="press flex size-9 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all duration-300 hover:shadow-md"
              style={{ boxShadow: '0 2px 10px rgba(212, 165, 116, 0.15)' }}
            >
              {settings.theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link
              to="/settings"
              aria-label="الإعدادات"
              onClick={() => haptic("light")}
              className="press flex size-9 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all duration-300 hover:shadow-md"
              style={{ boxShadow: '0 2px 10px rgba(212, 165, 116, 0.15)' }}
            >
              <Settings2 className="size-4" />
            </Link>
          </div>
        </div>
      </header>
      <main key={pathname} className="animate-page mx-auto w-full max-w-xl px-4 py-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
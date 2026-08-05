import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, Settings2, WifiOff } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { formatHijri } from "@/lib/hijri";
import { haptic } from "@/lib/haptics";
import { BottomNav } from "./BottomNav";
import { AnimatedBackground } from "./AnimatedBackground";
import { PrayingPerson } from "@/components/icons/PrayingPerson";

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
      <header className="glass-card sticky top-0 z-30 mx-4 mt-4 rounded-2xl" style={{ 
        boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(212, 175, 55, 0.1)',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
      }}>
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="gradient-gold flex size-9 shrink-0 items-center justify-center rounded-xl text-gold-foreground shadow-[0_4px_12px_rgba(212,175,55,0.3)]">
              <PrayingPerson className="size-6" />
            </span>
            <div className="min-w-0">
              <h1 className="font-display truncate text-lg font-bold leading-tight text-white drop-shadow-md">{title ?? "أحلام الروح"}</h1>
              <p className="truncate text-xs text-white/70">{subtitle ?? formatHijri(new Date())}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!online && (
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
                <WifiOff className="size-3" /> أوفلاين
              </span>
            )}
            <button
              aria-label="تبديل الوضع الليلي"
              onClick={() => {
                haptic("soft");
                updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
              }}
              className="soothing-btn flex size-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm"
            >
              {settings.theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link
              to="/settings"
              aria-label="الإعدادات"
              onClick={() => haptic("soft")}
              className="soothing-btn flex size-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm"
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
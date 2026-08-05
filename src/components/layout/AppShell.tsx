import { useState, useEffect, type ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Settings2, WifiOff, BookOpen, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { formatHijri } from "@/lib/hijri";
import { haptic } from "@/lib/haptics";
import { BottomNav } from "./BottomNav";
import { AnimatedBackground } from "./AnimatedBackground";
import { PrayingPerson } from "@/components/icons/PrayingPerson";
import { useLocalStorage } from "@/lib/use-local-storage";

const READING_MODE_KEY = "islamic:readingMode";

export function AppShell({
  children,
  title,
  subtitle,
  showBack = true,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}) {
  const { settings, updateSettings, online } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [readingMode, setReadingMode] = useLocalStorage<boolean>(READING_MODE_KEY, false);
  
  // تحديد إذا كان يجب إظهار زر الرجوع (ليس في الصفحة الرئيسية)
  const isHomePage = pathname === "/" || pathname === "";

  // تطبيق وضع القراءة على الجسم
  useEffect(() => {
    const root = document.documentElement;
    if (readingMode) {
      root.classList.add("reading-mode");
    } else {
      root.classList.remove("reading-mode");
    }
    return () => {
      root.classList.remove("reading-mode");
    };
  }, [readingMode]);

  const toggleReadingMode = () => {
    haptic("soft");
    setReadingMode(!readingMode);
  };

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
            {/* زر الرجوع */}
            {showBack && !isHomePage && (
              <button
                onClick={() => {
                  haptic("soft");
                  void navigate(-1);
                }}
                aria-label="الرجوع"
                className="soothing-btn flex size-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 transition-colors"
              >
                <ArrowRight className="size-4" />
              </button>
            )}
            <span className="gradient-gold flex size-9 shrink-0 items-center justify-center rounded-xl text-gold-foreground shadow-[0_4px_12px_rgba(212,175,55,0.3)]">
              <PrayingPerson className="size-6" />
            </span>
            <div className="min-w-0">
              <h1 className="font-display truncate text-lg font-bold leading-tight text-white drop-shadow-md">{title ?? "أحلام الروض"}</h1>
              <p className="truncate text-xs text-white/70">{subtitle ?? formatHijri(new Date())}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!online && (
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
                <WifiOff className="size-3" /> أوفلاين
              </span>
            )}
            {/* زر وضع القراءة */}
            <button
              aria-label="تبديل وضع القراءة"
              onClick={toggleReadingMode}
              className={`soothing-btn flex size-9 items-center justify-center rounded-xl backdrop-blur-sm transition-all hover:scale-105 ${
                readingMode 
                  ? "bg-[var(--gold)] text-[#1a1a3a]" 
                  : "bg-white/15 text-white"
              }`}
            >
              <BookOpen className="size-4" />
            </button>
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
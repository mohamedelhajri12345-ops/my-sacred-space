import { useState, useEffect, type ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Settings2, WifiOff, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/app-context";
import { formatHijri } from "@/lib/hijri";
import { haptic } from "@/lib/haptics";
import { BottomNav } from "./BottomNav";
import { AnimatedBackground } from "./AnimatedBackground";
import { PrayingPerson } from "@/components/icons/PrayingPerson";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";

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
  
  const isHomePage = pathname === "/" || pathname === "";

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
        <div aria-hidden className="pattern-geo pointer-events-none fixed inset-0 -z-10 opacity-[0.25]" />
      )}
      
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card sticky top-0 z-30 mx-4 mt-4 rounded-2xl"
      >
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <AnimatePresence>
              {showBack && !isHomePage && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    haptic("soft");
                    void navigate(-1);
                  }}
                  aria-label="الرجوع"
                  className="soothing-btn flex size-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 transition-colors"
                >
                  <ArrowRight className="size-4" />
                </motion.button>
              )}
            </AnimatePresence>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-gold flex size-9 shrink-0 items-center justify-center rounded-xl text-gold-foreground shadow-[var(--shadow-gold)]"
            >
              <PrayingPerson className="size-6" />
            </motion.div>
            
            <div className="min-w-0">
              <h1 className="font-display truncate text-lg font-bold leading-tight">{title ?? "My Sacred Space"}</h1>
              <p className="truncate text-xs text-muted-foreground">{subtitle ?? formatHijri(new Date())}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {!online && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground"
                >
                  <WifiOff className="size-3" /> أوفلاين
                </motion.span>
              )}
            </AnimatePresence>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="تبديل وضع القراءة"
              onClick={toggleReadingMode}
              className={cn(
                "soothing-btn flex size-9 items-center justify-center rounded-xl transition-all",
                readingMode 
                  ? "bg-gold text-card" 
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <BookOpen className="size-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="تبديل الوضع الليلي"
              onClick={() => {
                haptic("soft");
                updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
              }}
              className="soothing-btn flex size-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
            >
              {settings.theme === "dark" ? (
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun className="size-4" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon className="size-4" />
                </motion.div>
              )}
            </motion.button>
            
            <Link
              to="/settings"
              aria-label="الإعدادات"
              onClick={() => haptic("soft")}
              className="soothing-btn flex size-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
            >
              <Settings2 className="size-4" />
            </Link>
          </div>
        </div>
      </motion.header>
      
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-xl px-4 py-4"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      <BottomNav />
    </div>
  );
}
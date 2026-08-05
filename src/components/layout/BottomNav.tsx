import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, CalendarDays, Home, MoonStar, Sparkles, Sun, Library } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

// أيقونات إسلامية مخصصة
function IslamicPrayerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C10 2 8 4 8 6C8 8 10 10 12 10C14 10 16 8 16 6C16 4 14 2 12 2Z" />
      <path d="M12 10V14" />
      <path d="M8 14L12 18L16 14" />
      <path d="M6 20H18" />
    </svg>
  );
}

function TasbihIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4V8" />
      <path d="M12 16V20" />
      <path d="M4 12H8" />
      <path d="M16 12H20" />
    </svg>
  );
}

const ITEMS = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/quran", label: "القرآن", icon: BookOpen },
  { to: "/library", label: "المكتبة", icon: Library },
  { to: "/athkar", label: "الأذكار", icon: Sparkles },
  { to: "/prayer", label: "الصلاة", icon: MoonStar },
  { to: "/calendar", label: "التقويم", icon: CalendarDays },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-4 mb-4 rounded-2xl glass-card" style={{ boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.3)' }}>
      <ul className="mx-auto flex max-w-xl items-stretch justify-between px-1.5 py-2">
        {ITEMS.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                onClick={() => haptic("soft")}
                className={cn(
                  "soothing-btn flex flex-col items-center gap-1 rounded-2xl px-1.5 py-2 text-[10px] font-medium transition-all duration-300",
                  active ? "text-[var(--gold)]" : "text-white/60",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-xl transition-all duration-300",
                    active && "bg-[var(--gold)]/30 text-[var(--gold)]",
                    !active && "text-white/60",
                  )}
                >
                  <Icon className="size-[16px]" />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
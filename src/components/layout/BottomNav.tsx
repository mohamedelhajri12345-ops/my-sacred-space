import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, CalendarDays, Home, MoonStar, Library, Compass } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

// أيقونات إسلامية مخصصة
function IslamicPrayerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C10 2 8 4 8 6C8 8 10 10 12 10C14 10 16 8 16 6C16 4 14 2 12 2Z" />
      <path d="M12 10V14" />
      <path d="M8 14L12 18L16 14" />
      <path d="M6 20H18" />
    </svg>
  );
}

function TasbihIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4V8" />
      <path d="M12 16V20" />
      <path d="M4 12H8" />
      <path d="M16 12H20" />
    </svg>
  );
}

// أيقونة القبلة (بوصلة مع الكعبة)
function QiblaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3L12 6" />
      <path d="M12 18L12 21" />
      <path d="M3 12L6 12" />
      <path d="M18 12L21 12" />
      <rect x="10" y="10" width="4" height="4" rx="0.5" />
    </svg>
  );
}

// أيقونة القرآن (كتاب مفتوح)
function QuranIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </svg>
  );
}

const ITEMS = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/quran", label: "القرآن", icon: QuranIcon },
  { to: "/prayer", label: "الصلاة", icon: IslamicPrayerIcon },
  { to: "/qibla", label: "القبلة", icon: QiblaIcon },
  { to: "/library", label: "المكتبة", icon: Library },
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
                  <Icon className="size-[18px]" />
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
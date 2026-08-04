import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Compass, Home, CalendarDays, Sparkle, Sun } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/quran", label: "القرآن", icon: BookOpen },
  { to: "/athkar", label: "الأذكار", icon: Sparkle },
  { to: "/fasting", label: "الصيام", icon: Sun },
  { to: "/calendar", label: "التقويم", icon: CalendarDays },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/85 backdrop-blur-xl">
      <ul className="mx-auto flex max-w-xl items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                onClick={() => haptic("light")}
                className={cn(
                  "press flex flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl transition-colors",
                    active && "gradient-gold text-gold-foreground shadow-[var(--shadow-soft)]",
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
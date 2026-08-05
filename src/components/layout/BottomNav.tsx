import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
  { to: "/", label: "الرئيسية", icon: (props: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={props.className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )},
  { to: "/quran", label: "القرآن", icon: QuranIcon },
  { to: "/prayer", label: "الصلاة", icon: IslamicPrayerIcon },
  { to: "/qibla", label: "القبلة", icon: QiblaIcon },
  { to: "/library", label: "المكتبة", icon: (props: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={props.className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )},
  { to: "/calendar", label: "التقويم", icon: (props: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={props.className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )},
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <motion.nav 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-0 bottom-0 z-40 mx-4 mb-4 rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-lg"
    >
      <ul className="mx-auto flex max-w-xl items-stretch justify-between px-1.5 py-2">
        {ITEMS.map((item, index) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                onClick={() => haptic("soft")}
                className="soothing-btn relative flex flex-col items-center gap-1 rounded-2xl px-1.5 py-2 text-[10px] font-medium transition-all duration-300"
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-2xl bg-primary/10"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 flex size-9 items-center justify-center rounded-xl transition-all duration-300",
                    active && "text-primary",
                    !active && "text-muted-foreground",
                  )}
                >
                  <Icon className="size-[20px]" />
                </span>
                <span className={cn(
                  "relative z-10 transition-colors duration-300",
                  active ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
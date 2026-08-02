import { Link } from "@tanstack/react-router";
import { BookOpen, Compass, CalendarDays, Sparkle, Clock, Hand } from "lucide-react";
import { haptic } from "@/lib/haptics";

const FEATURES = [
  { to: "/quran", title: "القرآن الكريم", desc: "قراءة وتفسير وبحث", icon: BookOpen },
  { to: "/athkar", title: "الأذكار والأدعية", desc: "صباح ومساء وأدعية", icon: Sparkle },
  { to: "/athkar/tasbih", title: "المسبحة", desc: "عداد تسبيح تفاعلي", icon: Hand },
  { to: "/prayer", title: "مواقيت الصلاة", desc: "حسب موقعك", icon: Clock },
  { to: "/qibla", title: "اتجاه القبلة", desc: "بوصلة تفاعلية", icon: Compass },
  { to: "/calendar", title: "التقويم الهجري", desc: "تحويل ومناسبات", icon: CalendarDays },
] as const;

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {FEATURES.map((f, index) => {
        const Icon = f.icon;
        return (
          <Link
            key={f.to}
            to={f.to}
            onClick={() => haptic("light")}
            className="press surface-card animate-rise flex flex-col gap-2 p-4"
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
              <Icon className="size-5" />
            </span>
            <span className="text-sm font-bold">{f.title}</span>
            <span className="text-[11px] text-muted-foreground">{f.desc}</span>
          </Link>
        );
      })}
    </div>
  );
}
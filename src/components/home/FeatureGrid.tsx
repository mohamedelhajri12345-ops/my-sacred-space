import { Link } from "@tanstack/react-router";
import { BookOpen, Compass, CalendarDays, Sparkles, Clock, Hand, NotebookPen, Trophy, Sun, MapPin } from "lucide-react";
import { haptic } from "@/lib/haptics";

const FEATURES = [
  { to: "/quran", title: "القرآن الكريم", desc: "قراءة وتفسير وبحث", icon: BookOpen, tint: "var(--olive)" },
  { to: "/athkar", title: "الأذكار والأدعية", desc: "صباح ومساء وأدعية", icon: Sparkles, tint: "var(--gold)" },
  { to: "/athkar/tasbih", title: "المسبحة", desc: "عداد تسبيح تفاعلي", icon: Hand, tint: "var(--emerald)" },
  { to: "/prayer", title: "مواقيت الصلاة", desc: "حسب موقعك", icon: Clock, tint: "var(--sky)" },
  { to: "/qibla", title: "اتجاه القبلة", desc: "بوصلة تفاعلية", icon: Compass, tint: "var(--rose)" },
  { to: "/calendar", title: "التقويم الهجري", desc: "تحويل ومناسبات", icon: CalendarDays, tint: "var(--spiritual)" },
  { to: "/khatmah", title: "ختمة القرآن", desc: "تقدّمك وبطاقة مشاركة", icon: Trophy, tint: "var(--gold)" },
  { to: "/journal", title: "المفكرة الروحانية", desc: "خواطر محفوظة محليًا", icon: NotebookPen, tint: "var(--olive-soft)" },
  { to: "/fasting", title: "متابعة الصيام", desc: "سجّل أيام صيامك", icon: Sun, tint: "var(--gold-soft)" },
  { to: "/location", title: "اختيار الموقع", desc: "المدينة والمواقيت", icon: MapPin, tint: "var(--sky)" },
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
            className="press surface-card animate-rise flex flex-col gap-2 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ 
              animationDelay: `${index * 45}ms`,
              borderRadius: '16px'
            }}
          >
            <span
              className="flex size-10 items-center justify-center rounded-xl"
              style={{
                background: `color-mix(in oklab, ${f.tint} 22%, transparent)`,
                color: f.tint,
                boxShadow: `0 6px 18px -12px ${f.tint}`,
              }}
            >
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
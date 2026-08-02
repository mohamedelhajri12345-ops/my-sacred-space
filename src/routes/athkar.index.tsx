import { createFileRoute, Link } from "@tanstack/react-router";
import { Sunrise, Sunset, Moon, HandHeart, Hand, ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ATHKAR } from "@/data/athkar";
import { useApp } from "@/lib/app-context";
import { toArabicNumber } from "@/lib/quran";
import { haptic } from "@/lib/haptics";

const ICONS = {
  sunrise: Sunrise,
  sunset: Sunset,
  moon: Moon,
  prayer: HandHeart,
  hands: HandHeart,
} as const;

export const Route = createFileRoute("/athkar/")({
  head: () => ({
    meta: [
      { title: "الأذكار والأدعية — نور" },
      { name: "description", content: "أذكار الصباح والمساء وبعد الصلاة والنوم وأدعية مأثورة مع عدّاد تفاعلي." },
      { property: "og:title", content: "الأذكار والأدعية — نور" },
      { property: "og:description", content: "حصّن يومك بالأذكار المأثورة مع عدّاد تفاعلي." },
    ],
  }),
  component: AthkarPage,
});

function AthkarPage() {
  const { streak } = useApp();
  return (
    <AppShell title="الأذكار والأدعية" subtitle={`سلسلة الأذكار: ${toArabicNumber(streak.count)} يوم`}>
      <div className="space-y-3">
        <Link
          to="/athkar/tasbih"
          onClick={() => haptic("light")}
          className="press surface-card gradient-gold flex items-center justify-between p-4 text-gold-foreground"
        >
          <div className="flex items-center gap-3">
            <Hand className="size-6" />
            <div>
              <p className="font-bold">المسبحة الإلكترونية</p>
              <p className="text-[11px] opacity-80">عدّاد تفاعلي مع اهتزاز</p>
            </div>
          </div>
          <ChevronLeft className="size-5" />
        </Link>

        {ATHKAR.map((cat, index) => {
          const Icon = ICONS[cat.icon];
          return (
            <Link
              key={cat.id}
              to="/athkar/$categoryId"
              params={{ categoryId: cat.id }}
              onClick={() => haptic("light")}
              className="press surface-card animate-rise flex items-center justify-between p-4"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-bold">{cat.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {cat.subtitle} · {toArabicNumber(cat.items.length)} ذكر
                  </p>
                </div>
              </div>
              <ChevronLeft className="size-5 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { NextPrayerCard } from "@/components/prayer/NextPrayerCard";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { SpiritualStats } from "@/components/home/SpiritualStats";
import { upcomingEvents } from "@/lib/hijri";
import { Star } from "lucide-react";
import { formatGregorianAr } from "@/lib/hijri";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "نور — قرآن وأذكار ومواقيت صلاة" },
      {
        name: "description",
        content: "تطبيق إسلامي شامل يعمل بدون إنترنت: القرآن والتفسير، الأذكار والمسبحة، مواقيت الصلاة، القبلة والتقويم الهجري.",
      },
      { property: "og:title", content: "نور — قرآن وأذكار ومواقيت صلاة" },
      { property: "og:description", content: "رفيقك اليومي في العبادة، يعمل أوفلاين بالكامل." },
    ],
  }),
  component: Index,
});

function Index() {
  const hour = new Date().getHours();
  const greeting =
    hour < 5
      ? "قيام مبارك"
      : hour < 12
        ? "صباح الخير"
        : hour < 17
          ? "طاب نهارك"
          : hour < 20
            ? "مساء الخير"
            : "طابت ليلتك";

  const events = upcomingEvents(new Date(), 3);
  const today = new Date();

  return (
    <AppShell title={greeting} subtitle="رفيقك اليومي في العبادة">
      <div className="space-y-5">
        <NextPrayerCard />
        <SpiritualStats />
        
        {/* المناسبات القادمة */}
        {events.length > 0 && (
          <div className="space-y-2">
            <h2 className="flex items-center gap-2 px-1 text-sm font-bold text-muted-foreground">
              <Star className="size-4 text-gold" />
              المناسبات القادمة
            </h2>
            <div className="space-y-2">
              {events.slice(0, 2).map(({ event, date }) => {
                const daysUntil = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isToday = daysUntil === 0;
                const isTomorrow = daysUntil === 1;

                return (
                  <div
                    key={`${event.hm}-${event.hd}`}
                    className="surface-card flex items-center justify-between p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-gold/10">
                        <Star className="size-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium">{event.name}</p>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium text-primary">
                        {isToday ? "اليوم" : isTomorrow ? "غداً" : `بعد ${daysUntil} يوم`}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {date.toLocaleDateString("ar-SA", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-3 px-1 text-sm font-bold text-muted-foreground">الأقسام</h2>
          <FeatureGrid />
        </div>
        <div className="divider-geo" aria-hidden />
        <div className="surface-card p-4 text-center">
          <p className="font-display text-lg leading-9">
            «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">سورة الرعد — الآية ٢٨</p>
        </div>
      </div>
    </AppShell>
  );
}

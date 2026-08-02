import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarHeart } from "lucide-react";
import {
  HIJRI_MONTHS,
  WEEKDAYS_AR,
  formatGregorianAr,
  formatHijri,
  gregorianToHijri,
  hijriToGregorian,
  upcomingEvents,
  ISLAMIC_EVENTS,
} from "@/lib/hijri";
import { toArabicNumber } from "@/lib/quran";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export function HijriCalendar() {
  const today = useMemo(() => new Date(), []);
  const todayHijri = gregorianToHijri(today);
  const [view, setView] = useState({ hy: todayHijri.hy, hm: todayHijri.hm });
  const [picked, setPicked] = useState<Date>(today);

  const days = useMemo(() => {
    const list: { hd: number; date: Date }[] = [];
    for (let d = 1; d <= 30; d++) {
      const date = hijriToGregorian(view.hy, view.hm, d);
      const back = gregorianToHijri(date);
      if (back.hm !== view.hm) break;
      list.push({ hd: d, date });
    }
    return list;
  }, [view]);

  const leading = days[0] ? days[0].date.getDay() : 0;
  const events = upcomingEvents(today, 6);

  const shift = (delta: number) => {
    haptic("light");
    setView((prev) => {
      const m = prev.hm + delta;
      if (m < 1) return { hy: prev.hy - 1, hm: 12 };
      if (m > 12) return { hy: prev.hy + 1, hm: 1 };
      return { ...prev, hm: m };
    });
  };

  const pickedHijri = gregorianToHijri(picked);

  return (
    <div className="space-y-4">
      <div className="surface-card gradient-warm p-5 text-center text-primary-foreground">
        <p className="text-xs opacity-80">اليوم</p>
        <h2 className="font-display text-2xl font-bold">{formatHijri(today)}</h2>
        <p className="mt-1 text-sm opacity-90">{formatGregorianAr(today)}</p>
      </div>

      <div className="surface-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => shift(-1)} aria-label="الشهر السابق" className="press flex size-9 items-center justify-center rounded-xl bg-secondary">
            <ChevronRight className="size-4" />
          </button>
          <p className="font-display text-lg font-bold">
            {HIJRI_MONTHS[view.hm - 1]} {toArabicNumber(view.hy)} هـ
          </p>
          <button onClick={() => shift(1)} aria-label="الشهر التالي" className="press flex size-9 items-center justify-center rounded-xl bg-secondary">
            <ChevronLeft className="size-4" />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
          {WEEKDAYS_AR.map((d) => (
            <span key={d}>{d.slice(0, 3)}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: leading }).map((_, i) => (
            <span key={`pad-${i}`} />
          ))}
          {days.map((d) => {
            const isToday = d.date.toDateString() === today.toDateString();
            const isPicked = d.date.toDateString() === picked.toDateString();
            const event = ISLAMIC_EVENTS.find((e) => e.hm === view.hm && e.hd === d.hd);
            return (
              <button
                key={d.hd}
                onClick={() => {
                  haptic("light");
                  setPicked(d.date);
                }}
                className={cn(
                  "press relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm",
                  isToday && "gradient-warm text-primary-foreground",
                  !isToday && isPicked && "bg-secondary",
                  !isToday && !isPicked && "hover:bg-secondary/60",
                )}
              >
                {toArabicNumber(d.hd)}
                {event && <span className="absolute bottom-1 size-1 rounded-full bg-accent" />}
              </button>
            );
          })}
        </div>

        <div className="ornament-divider my-4" />
        <div className="text-center text-sm">
          <p className="font-bold">
            {toArabicNumber(pickedHijri.hd)} {HIJRI_MONTHS[pickedHijri.hm - 1]} {toArabicNumber(pickedHijri.hy)} هـ
          </p>
          <p className="text-xs text-muted-foreground">{formatGregorianAr(picked)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="flex items-center gap-2 px-1 text-sm font-bold">
          <CalendarHeart className="size-4 text-accent" /> المناسبات القادمة
        </h3>
        {events.map(({ event, date }) => (
          <div key={`${event.name}-${date.toISOString()}`} className="surface-card flex items-center justify-between p-3.5">
            <div>
              <p className="text-sm font-bold">{event.name}</p>
              <p className="text-[11px] text-muted-foreground">{event.description}</p>
            </div>
            <div className="text-left text-[11px] text-muted-foreground">
              <p>{formatHijri(date)}</p>
              <p>{formatGregorianAr(date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
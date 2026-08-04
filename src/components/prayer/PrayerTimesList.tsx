import { Sunrise, Sun, Sunset, Moon, CloudSun, Star, Loader2 } from "lucide-react";
import { useAdhanScheduler } from "@/hooks/use-adhan-scheduler";
import { formatTime, type PrayerKey } from "@/lib/prayer";
import { cn } from "@/lib/utils";

const ICONS: Record<PrayerKey, typeof Sun> = {
  fajr: CloudSun,
  sunrise: Sunrise,
  dhuhr: Sun,
  asr: Sunset,
  maghrib: Sunset,
  isha: Moon,
};

export function PrayerTimesList() {
  const { timings, next, now, isLoading, error } = useAdhanScheduler();

  // حالة التحميل
  if (isLoading) {
    return (
      <div className="surface-card p-6 flex flex-col items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">جارٍ تحميل مواقيت الصلاة...</p>
      </div>
    );
  }

  // حالة الخطأ
  if (error || !timings || timings.length === 0) {
    return (
      <div className="surface-card p-6 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-muted-foreground mb-2">تعذر تحميل مواقيت الصلاة</p>
        <p className="text-xs text-muted-foreground/70">سيتم استخدام الإعدادات الافتراضية</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {timings.map((p) => {
        const Icon = ICONS[p.key];
        const isNext = next && p.key === next.key && next.date?.toDateString() === p.date?.toDateString();
        const passed = p.date?.getTime() < now.getTime();
        return (
          <li
            key={p.key}
            className={cn(
              "surface-card flex items-center justify-between px-4 py-3.5 transition-colors",
              isNext && "border-[color-mix(in_oklab,var(--gold)_60%,transparent)] bg-accent/10",
              passed && !isNext && "opacity-60",
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground",
                  isNext && "gradient-gold text-gold-foreground",
                )}
              >
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{p.label}</p>
                {p.key === "sunrise" && <p className="text-[11px] text-muted-foreground">ليست صلاة مفروضة</p>}
                {isNext && (
                  <p className="flex items-center gap-1 text-[11px] text-accent-foreground/80">
                    <Star className="size-3" /> التالية
                  </p>
                )}
              </div>
            </div>
            <span dir="ltr" className="text-base font-bold tabular-nums">
              {p.date ? formatTime(p.date) : "--:--"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
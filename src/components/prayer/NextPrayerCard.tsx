import { Link } from "@tanstack/react-router";
import { MapPin, MoonStar } from "lucide-react";
import { useAdhanScheduler } from "@/hooks/use-adhan-scheduler";
import { useApp } from "@/lib/app-context";
import { formatCountdown, formatTime } from "@/lib/prayer";
import { formatHijri } from "@/lib/hijri";

export function NextPrayerCard() {
  const { coords } = useApp();
  const { next, remaining, inKhushuWindow, now } = useAdhanScheduler();

  return (
    <Link to="/prayer" className="press animate-rise block">
      <div className="gradient-night relative overflow-hidden rounded-3xl p-5 text-[oklch(0.95_0.02_84)] shadow-[var(--shadow-soft)]">
        <div className="absolute -left-8 -top-10 size-36 rounded-full bg-[oklch(0.78_0.12_82)]/20 blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between text-xs opacity-80">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" /> {coords.label ?? "موقع محفوظ"}
            </span>
            <span>{formatHijri(now)}</span>
          </div>
          <p className="mt-4 text-sm opacity-85">الصلاة القادمة</p>
          <div className="mt-1 flex items-end justify-between">
            <h2 className="text-4xl font-bold text-gradient-gold">{next.label}</h2>
            <span className="text-lg font-semibold">{formatTime(next.date)}</span>
          </div>
          <p dir="ltr" className="mt-3 text-center font-mono text-3xl tracking-widest">
            {formatCountdown(remaining)}
          </p>
          {inKhushuWindow && (
            <p className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs">
              <MoonStar className="size-3.5" /> وضع الخشوع مُفعّل — الإشعارات صامتة الآن
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
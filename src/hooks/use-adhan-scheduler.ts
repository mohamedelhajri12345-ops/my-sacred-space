import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/app-context";
import { getDayTimings, getNextPrayer, type PrayerEntry } from "@/lib/prayer";
import { playAlertSound, showLocalNotification } from "@/lib/notifications";
import { haptic } from "@/lib/haptics";

export function useAdhanScheduler() {
  const { coords, settings } = useApp();
  const [now, setNow] = useState(() => new Date());
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const next: PrayerEntry = getNextPrayer(coords, settings.method, now);
  const timings = getDayTimings(coords, settings.method, now);

  // Khushu mode: quiet window right after each prayer time.
  const inKhushuWindow =
    settings.khushuMode &&
    timings.some((p) => {
      if (p.key === "sunrise") return false;
      const diff = now.getTime() - p.date.getTime();
      return diff >= 0 && diff < settings.khushuMinutes * 60000;
    });

  useEffect(() => {
    if (!settings.notificationsEnabled) return;
    const fired = firedRef.current;
    for (const p of timings) {
      if (p.key === "sunrise") continue;
      const day = p.date.toDateString();
      const diff = p.date.getTime() - now.getTime();
      const reminderKey = `${day}:${p.key}:pre`;
      const adhanKey = `${day}:${p.key}:adhan`;
      if (
        settings.reminderMinutes > 0 &&
        diff <= settings.reminderMinutes * 60000 &&
        diff > settings.reminderMinutes * 60000 - 1500 &&
        !fired.has(reminderKey)
      ) {
        fired.add(reminderKey);
        showLocalNotification("تذكير بالصلاة", `بقي ${settings.reminderMinutes} دقيقة على صلاة ${p.label}`);
        playAlertSound(settings.alertKind === "silent" ? "silent" : "beep");
        haptic("light");
      }
      if (diff <= 0 && diff > -1500 && !fired.has(adhanKey)) {
        fired.add(adhanKey);
        showLocalNotification("حان وقت الصلاة", `حان الآن موعد صلاة ${p.label}`);
        playAlertSound(settings.alertKind);
        haptic("success");
      }
    }
  }, [now, timings, settings.notificationsEnabled, settings.reminderMinutes, settings.alertKind]);

  return { now, next, timings, inKhushuWindow, remaining: next.date.getTime() - now.getTime() };
}
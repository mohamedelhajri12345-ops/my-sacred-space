import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/app-context";
import { getDayTimings, getLastThird, getNextPrayer, type PrayerEntry } from "@/lib/prayer";
import { playAlertSound, showLocalNotification } from "@/lib/notifications";
import { gregorianToHijri } from "@/lib/hijri";
import { haptic } from "@/lib/haptics";

/** هل هذا اليوم من أيام الصيام المستحب (الاثنين/الخميس أو الأيام البيض)؟ */
export function fastingDayLabel(date: Date): string | null {
  const weekday = date.getDay();
  const h = gregorianToHijri(date);
  if (h.hd === 13 || h.hd === 14 || h.hd === 15) return "الأيام البيض";
  if (weekday === 1) return "صيام الاثنين";
  if (weekday === 4) return "صيام الخميس";
  return null;
}

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

  // وضع الخشوع: نافذة هدوء بعد دخول كل صلاة.
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
    const day = now.toDateString();
    const hit = (target: number) => {
      const diff = target - now.getTime();
      return diff <= 0 && diff > -1500;
    };
    const approaching = (target: number, minutes: number) => {
      const diff = target - now.getTime();
      return diff <= minutes * 60000 && diff > minutes * 60000 - 1500;
    };

    for (const p of timings) {
      if (p.key === "sunrise") continue;
      const t = p.date.getTime();

      // تذكير الوضوء قبل الأذان
      if (settings.wuduReminder && approaching(t, settings.wuduMinutes)) {
        const key = `${day}:${p.key}:wudu`;
        if (!fired.has(key)) {
          fired.add(key);
          showLocalNotification("استعد للصلاة", `بقي ${settings.wuduMinutes} دقيقة على ${p.label} — جدّد وضوءك`);
          playAlertSound(settings.alertKind === "silent" ? "silent" : "beep");
          haptic("light");
        }
      }

      // التذكير المسبق العام
      if (settings.reminderMinutes > 0 && approaching(t, settings.reminderMinutes)) {
        const key = `${day}:${p.key}:pre`;
        if (!fired.has(key)) {
          fired.add(key);
          showLocalNotification("تذكير بالصلاة", `بقي ${settings.reminderMinutes} دقيقة على صلاة ${p.label}`);
          playAlertSound(settings.alertKind === "silent" ? "silent" : "beep");
          haptic("light");
        }
      }

      // الأذان
      if (hit(t)) {
        const key = `${day}:${p.key}:adhan`;
        if (!fired.has(key)) {
          fired.add(key);
          showLocalNotification("حان وقت الصلاة", `حان الآن موعد صلاة ${p.label}`);
          playAlertSound(settings.alertKind);
          haptic("success");
        }
      }
    }

    // تذكير قيام الليل والوتر عند دخول الثلث الأخير
    if (settings.qiyamReminder) {
      const { lastThirdOfTheNight } = getLastThird(coords, settings.method, now);
      if (hit(lastThirdOfTheNight.getTime())) {
        const key = `${day}:qiyam`;
        if (!fired.has(key)) {
          fired.add(key);
          showLocalNotification("قيام الليل", "دخل الثلث الأخير من الليل — لا تنسَ القيام والوتر");
          playAlertSound(settings.alertKind === "silent" ? "silent" : "beep");
          haptic("medium");
        }
      }
    }

    // تذكير الصيام المستحب مساء اليوم السابق (٨ مساءً)
    if (settings.fastingReminder && now.getHours() === 20 && now.getMinutes() === 0 && now.getSeconds() < 2) {
      const tomorrow = new Date(now.getTime() + 86400000);
      const label = fastingDayLabel(tomorrow);
      const key = `${day}:fasting`;
      if (label && !fired.has(key)) {
        fired.add(key);
        showLocalNotification("تذكير بالصيام", `غدًا ${label} — تذكّر نية الصيام والسحور`);
        playAlertSound(settings.alertKind === "silent" ? "silent" : "beep");
        haptic("light");
      }
    }
  }, [
    now,
    timings,
    coords,
    settings.method,
    settings.notificationsEnabled,
    settings.reminderMinutes,
    settings.wuduReminder,
    settings.wuduMinutes,
    settings.qiyamReminder,
    settings.fastingReminder,
    settings.alertKind,
  ]);

  return { now, next, timings, inKhushuWindow, remaining: next.date.getTime() - now.getTime() };
}

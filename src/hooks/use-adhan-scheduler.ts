import { useEffect, useRef, useState, useMemo } from "react";
import { useApp } from "@/lib/app-context";
import { 
  getDayTimings, 
  getLastThird, 
  getNextPrayer, 
  isValidCoords, 
  DEFAULT_COORDS,
  type PrayerEntry,
  OBLIGATORY_PRAYERS 
} from "@/lib/prayer";
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

export type AdhanSchedulerState = {
  now: Date;
  next: PrayerEntry | null;
  timings: PrayerEntry[];
  inKhushuWindow: boolean;
  remaining: number;
  enabledPrayers: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
};

export function useAdhanScheduler(): AdhanSchedulerState {
  const { coords: appCoords, settings } = useApp();
  const [now, setNow] = useState(() => new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const firedRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  // التحقق من صحة الإحداثيات واستخدام الإعدادات الافتراضية
  const coords = useMemo(() => {
    if (!isValidCoords(appCoords)) {
      console.warn("إحداثيات غير صالحة، استخدام الإعدادات الافتراضية:", appCoords);
      return DEFAULT_COORDS;
    }
    return appCoords;
  }, [appCoords]);

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  // حساب المواقيت مع معالجة الأخطاء
  const { next, timings } = useMemo(() => {
    try {
      setError(null);
      
      // حساب الصلاة القادمة
      const nextPrayer = getNextPrayer(
        coords, 
        settings.method, 
        now, 
        settings.prayerAdjustments,
        settings.enabledPrayers
      );
      
      // حساب مواقيت اليوم
      const dayTimings = getDayTimings(
        coords, 
        settings.method, 
        now, 
        settings.prayerAdjustments
      );
      
      // التحقق من صحة النتائج
      if (!dayTimings || dayTimings.length === 0) {
        throw new Error("فشل في حساب مواقيت الصلاة");
      }
      
      return { next: nextPrayer, timings: dayTimings };
    } catch (err) {
      console.error("خطأ في حساب المواقيت:", err);
      setError(err instanceof Error ? err.message : "خطأ غير معروف");
      return { next: null, timings: [] };
    }
  }, [coords, settings.method, now, settings.prayerAdjustments, settings.enabledPrayers]);

  // وضع الخشوع: نافذة هدوء بعد دخول كل صلاة.
  const inKhushuWindow = useMemo(() => {
    if (!settings.khushuMode) return false;
    if (!timings || timings.length === 0) return false;
    
    return timings.some((p) => {
      if (p.key === "sunrise") return false;
      if (settings.enabledPrayers[p.key] === false) return false;
      if (!p.date) return false;
      const diff = now.getTime() - p.date.getTime();
      return diff >= 0 && diff < settings.khushuMinutes * 60000;
    });
  }, [settings.khushuMode, settings.khushuMinutes, settings.enabledPrayers, timings, now]);

  // حساب الوقت المتبقي للصلاة القادمة
  const remaining = useMemo(() => {
    if (!next?.date) return 0;
    return Math.max(0, next.date.getTime() - now.getTime());
  }, [next, now]);

  // تأثير معالجة الإشعارات
  useEffect(() => {
    if (!settings.notificationsEnabled) return;
    if (!timings || timings.length === 0) return;
    
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
      // تخطي الصلوات المعطلة
      if (settings.enabledPrayers[p.key] === false) continue;
      if (p.key === "sunrise") continue;
      if (!p.date) continue;
      
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
      try {
        const { lastThirdOfTheNight } = getLastThird(coords, settings.method, now);
        if (lastThirdOfTheNight && hit(lastThirdOfTheNight.getTime())) {
          const key = `${day}:qiyam`;
          if (!fired.has(key)) {
            fired.add(key);
            showLocalNotification("قيام الليل", "دخل الثلث الأخير من الليل — لا تنسَ القيام والوتر");
            playAlertSound(settings.alertKind === "silent" ? "silent" : "beep");
            haptic("medium");
          }
        }
      } catch (e) {
        console.error("خطأ في تذكير قيام الليل:", e);
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
    settings.enabledPrayers,
    settings.prayerAdjustments,
  ]);

  // تحديد حالة التحميل
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      // إعطاء وقت قصير للتحميل الأولي
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
    setIsLoading(false);
    return undefined;
  }, [next, timings]);

  return { 
    now, 
    next, 
    timings, 
    inKhushuWindow, 
    remaining,
    enabledPrayers: settings.enabledPrayers,
    isLoading,
    error,
  };
}

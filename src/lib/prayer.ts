import { CalculationMethod, Coordinates, PrayerTimes, Qibla, SunnahTimes } from "adhan";
import type { PrayerAdjustments } from "./app-context";

export type MethodKey =
  | "MuslimWorldLeague"
  | "UmmAlQura"
  | "Egyptian"
  | "Karachi"
  | "Dubai"
  | "Qatar"
  | "Kuwait"
  | "MoonsightingCommittee"
  | "NorthAmerica"
  | "Turkey";

export const METHODS: { key: MethodKey; label: string }[] = [
  { key: "UmmAlQura", label: "أم القرى - مكة المكرمة" },
  { key: "MuslimWorldLeague", label: "رابطة العالم الإسلامي" },
  { key: "Egyptian", label: "الهيئة المصرية العامة للمساحة" },
  { key: "Karachi", label: "جامعة العلوم الإسلامية - كراتشي" },
  { key: "Dubai", label: "دبي" },
  { key: "Qatar", label: "قطر" },
  { key: "Kuwait", label: "الكويت" },
  { key: "Turkey", label: "تركيا - ديانت" },
  { key: "MoonsightingCommittee", label: "لجنة رؤية الهلال" },
  { key: "NorthAmerica", label: "أمريكا الشمالية (ISNA)" },
];

export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export const PRAYER_KEYS: PrayerKey[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

export const PRAYER_LABELS: Record<PrayerKey, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

/** الصلاة المفروضة (بدون الشروق) */
export const OBLIGATORY_PRAYERS: PrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export type Coords = { latitude: number; longitude: number; label?: string };

export const DEFAULT_COORDS: Coords = {
  latitude: 21.4225,
  longitude: 39.8262,
  label: "مكة المكرمة",
};

/** التحقق من صحة الإحداثيات */
export function isValidCoords(coords: Coords | undefined | null): coords is Coords {
  if (!coords) return false;
  if (typeof coords.latitude !== "number" || typeof coords.longitude !== "number") return false;
  if (isNaN(coords.latitude) || isNaN(coords.longitude)) return false;
  if (coords.latitude < -90 || coords.latitude > 90) return false;
  if (coords.longitude < -180 || coords.longitude > 180) return false;
  return true;
}

export type PrayerEntry = { key: PrayerKey; label: string; date: Date; adjusted?: boolean };

/** نوع البيانات المرجعة من حساب المواقيت */
export interface PrayerTimesResult {
  success: boolean;
  times?: PrayerTimes;
  error?: string;
}

/**
 * تطبيق تعديلات الصلاة على الوقت
 * @param date الوقت الأصلي
 * @param adjustment التعديل بالدقائق
 */
export function applyAdjustment(date: Date, adjustment: number | undefined): Date {
  if (!adjustment || adjustment === 0) return date;
  return new Date(date.getTime() + adjustment * 60 * 1000);
}

/**
 * حساب مواقيت الصلاة مع معالجة أخطاء شاملة
 */
export function getPrayerTimes(
  coords: Coords,
  method: MethodKey,
  date = new Date(),
  adjustments?: PrayerAdjustments
): PrayerTimes {
  try {
    // التحقق من صحة الإحداثيات
    if (!isValidCoords(coords)) {
      console.error("إحداثيات غير صالحة، استخدام الإعدادات الافتراضية:", coords);
      coords = DEFAULT_COORDS;
    }

    // التحقق من صحة التاريخ
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error("تاريخ غير صالح، استخدام التاريخ الحالي");
      date = new Date();
    }

    const c = new Coordinates(coords.latitude, coords.longitude);
    const params = CalculationMethod[method]();
    const times = new PrayerTimes(c, date, params);
    
    // التحقق من صحة الأوقات المرجعة
    if (!times || !times.fajr || !times.dhuhr || !times.asr || !times.maghrib || !times.isha) {
      throw new Error("فشل في حساب مواقيت الصلاة - أوقات غير صالحة");
    }
    
    // تطبيق التعديلات
    for (const key of PRAYER_KEYS) {
      const adjustment = adjustments?.[key];
      if (adjustment && adjustment !== 0) {
        const original = times[key]?.getTime();
        if (original) {
          times[key] = new Date(original + adjustment * 60 * 1000);
        }
      }
    }
    
    return times;
  } catch (error) {
    console.error("خطأ في حساب مواقيت الصلاة:", error);
    // إرجاع أوقات افتراضية في حالة الخطأ
    const fallbackDate = new Date();
    fallbackDate.setHours(5, 0, 0, 0); // فجر
    return {
      fajr: fallbackDate,
      sunrise: new Date(fallbackDate.getTime() + 45 * 60000),
      dhuhr: new Date(fallbackDate.getTime() + 6 * 3600000),
      asr: new Date(fallbackDate.getTime() + 9 * 3600000),
      maghrib: new Date(fallbackDate.getTime() + 12 * 3600000),
      isha: new Date(fallbackDate.getTime() + 14 * 3600000),
    } as PrayerTimes;
  }
}

/**
 * الحصول على مواقيت اليوم مع معالجة أخطاء
 */
export function getDayTimings(
  coords: Coords,
  method: MethodKey,
  date = new Date(),
  adjustments?: PrayerAdjustments
): PrayerEntry[] {
  try {
    const t = getPrayerTimes(coords, method, date, adjustments);
    
    // التحقق من وجود الأوقات
    if (!t || !t.fajr) {
      console.error("فشل في الحصول على مواقيت اليوم");
      return getDefaultTimings();
    }
    
    return PRAYER_KEYS.map((key) => ({
      key,
      label: PRAYER_LABELS[key],
      date: t[key] ?? new Date(),
      adjusted: adjustments?.[key] !== undefined && adjustments?.[key] !== 0,
    }));
  } catch (error) {
    console.error("خطأ في getDayTimings:", error);
    return getDefaultTimings();
  }
}

/** إرجاع مواقيت افتراضية في حالة الخطأ */
function getDefaultTimings(): PrayerEntry[] {
  const now = new Date();
  const baseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 0, 0);
  
  return PRAYER_KEYS.map((key) => ({
    key,
    label: PRAYER_LABELS[key],
    date: new Date(baseTime.getTime() + PRAYER_KEYS.indexOf(key) * 2 * 3600000),
    adjusted: false,
  }));
}

/**
 * الحصول على الصلاة القادمة مع معالجة أخطاء محسنة
 * @param coords الإحداثيات الجغرافية
 * @param method طريقة حساب المواقيت
 * @param now الوقت الحالي (افتراضي: الآن)
 * @param adjustments تعديلات الصلاة
 * @param enabledPrayers الصلوات المفعلة
 * @returns الصلاة القادمة أو null
 */
export function getNextPrayer(
  coords: Coords,
  method: MethodKey,
  now = new Date(),
  adjustments?: PrayerAdjustments,
  enabledPrayers?: Record<PrayerKey, boolean>
): PrayerEntry | null {
  try {
    // التحقق من صحة الإحداثيات
    if (!isValidCoords(coords)) {
      coords = DEFAULT_COORDS;
    }

    // الحصول على مواقيت اليوم
    let todayTimings = getDayTimings(coords, method, now, adjustments);
    
    // استثناء الشروق والصلوات المعطلة
    todayTimings = todayTimings
      .filter((p) => p.key !== "sunrise")
      .filter((p) => enabledPrayers ? enabledPrayers[p.key] !== false : true);
    
    // التحقق من أن المصفوفة ليست فارغة
    if (todayTimings.length === 0) {
      console.warn("لا توجد صلوات متاحة اليوم");
      return null;
    }
    
    // البحث عن الصلاة القادمة (الأولى التي وقتها أكبر من الوقت الحالي)
    const currentTime = now.getTime();
    const upcoming = todayTimings.find((p) => {
      if (!p.date || !(p.date instanceof Date) || isNaN(p.date.getTime())) {
        return false;
      }
      return p.date.getTime() > currentTime;
    });
    
    if (upcoming) {
      return upcoming;
    }
    
    // إذا لم نجد صلاة قادمة اليوم، ننتقل للغد
    const tomorrow = new Date(now.getTime() + 86400000);
    tomorrow.setHours(0, 0, 0, 0); // بداية يوم الغد
    
    const tomorrowTimings = getDayTimings(coords, method, tomorrow, adjustments)
      .filter((p) => p.key !== "sunrise")
      .filter((p) => enabledPrayers ? enabledPrayers[p.key] !== false : true);
    
    if (tomorrowTimings.length === 0) {
      console.warn("لا توجد صلوات متاحة غداً");
      return null;
    }
    
    // إرجاع أول صلاة في الغد
    return tomorrowTimings[0] ?? null;
  } catch (error) {
    console.error("خطأ في getNextPrayer:", error);
    return null;
  }
}

/**
 * الحصول على ثلث الليل الأخير مع معالجة أخطاء
 */
export function getLastThird(coords: Coords, method: MethodKey, date = new Date()) {
  try {
    if (!isValidCoords(coords)) {
      coords = DEFAULT_COORDS;
    }
    
    const sunnah = new SunnahTimes(getPrayerTimes(coords, method, date));
    
    return { 
      middleOfTheNight: sunnah.middleOfTheNight, 
      lastThirdOfTheNight: sunnah.lastThirdOfTheNight 
    };
  } catch (error) {
    console.error("خطأ في getLastThird:", error);
    // إرجاع قيم افتراضية
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const nextMidnight = new Date(midnight.getTime() + 86400000);
    return {
      middleOfTheNight: new Date((midnight.getTime() + nextMidnight.getTime()) / 2),
      lastThirdOfTheNight: new Date(midnight.getTime() + (2 / 3) * 86400000),
    };
  }
}

/**
 * حساب اتجاه القبلة مع معالجة أخطاء
 */
export function qiblaDirection(coords: Coords) {
  try {
    if (!isValidCoords(coords)) {
      coords = DEFAULT_COORDS;
    }
    return Qibla(new Coordinates(coords.latitude, coords.longitude));
  } catch (error) {
    console.error("خطأ في حساب اتجاه القبلة:", error);
    return 0; // اتجاه مكة افتراضياً
  }
}

/**
 * تنسيق الوقت بتنسيق 12 ساعة مع AM/PM
 * @param date الوقت المراد تنسيقه
 * @returns الوقت منسقاً بتنسيق 12 ساعة (مثال: 09:33 م)
 */
export function formatTime(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "--:--";
  }
  
  // استخدام تنسيق 12 ساعة مع مؤشر AM/PM
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const isPM = hours >= 12;
  const displayHours = hours % 12 || 12; // تحويل 0 إلى 12
  
  const pad = (n: number) => String(n).padStart(2, "0");
  const period = isPM ? "م" : "ص"; // م = مساءً، ص = صباحاً
  
  return `${pad(displayHours)}:${pad(minutes)} ${period}`;
}

/**
 * تنسيق الوقت بتنسيق 24 ساعة
 * @param date الوقت المراد تنسيقه
 * @returns الوقت منسقاً بتنسيق 24 ساعة (مثال: 21:33)
 */
export function formatTime24(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "--:--";
  }
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const pad = (n: number) => String(n).padStart(2, "0");
  
  return `${pad(hours)}:${pad(minutes)}`;
}

export function formatCountdown(ms: number) {
  if (typeof ms !== "number" || isNaN(ms) || ms < 0) {
    return "00:00:00";
  }
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
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

export type PrayerEntry = { key: PrayerKey; label: string; date: Date; adjusted?: boolean };

/**
 * تطبيق تعديلات الصلاة على الوقت
 * @param date الوقت الأصلي
 * @param adjustment التعديل بالدقائق
 */
export function applyAdjustment(date: Date, adjustment: number | undefined): Date {
  if (!adjustment || adjustment === 0) return date;
  return new Date(date.getTime() + adjustment * 60 * 1000);
}

export function getPrayerTimes(
  coords: Coords,
  method: MethodKey,
  date = new Date(),
  adjustments?: PrayerAdjustments
) {
  const c = new Coordinates(coords.latitude, coords.longitude);
  const params = CalculationMethod[method]();
  const times = new PrayerTimes(c, date, params);
  
  // تطبيق التعديلات
  for (const key of PRAYER_KEYS) {
    const adjustment = adjustments?.[key];
    if (adjustment && adjustment !== 0) {
      const original = times[key].getTime();
      times[key] = new Date(original + adjustment * 60 * 1000);
    }
  }
  
  return times;
}

export function getDayTimings(
  coords: Coords,
  method: MethodKey,
  date = new Date(),
  adjustments?: PrayerAdjustments
): PrayerEntry[] {
  const t = getPrayerTimes(coords, method, date, adjustments);
  return PRAYER_KEYS.map((key) => ({
    key,
    label: PRAYER_LABELS[key],
    date: t[key],
    adjusted: adjustments?.[key] !== undefined && adjustments?.[key] !== 0,
  }));
}

export function getNextPrayer(
  coords: Coords,
  method: MethodKey,
  now = new Date(),
  adjustments?: PrayerAdjustments,
  enabledPrayers?: Record<PrayerKey, boolean>
): PrayerEntry {
  const today = getDayTimings(coords, method, now, adjustments)
    .filter((p) => p.key !== "sunrise") // استثناء الشروق من الصلاة المفروضة
    .filter((p) => enabledPrayers ? enabledPrayers[p.key] !== false : true);
  
  const upcoming = today.find((p) => p.date.getTime() > now.getTime());
  if (upcoming) return upcoming;
  
  const tomorrow = new Date(now.getTime() + 86400000);
  const tomorrowTimings = getDayTimings(coords, method, tomorrow, adjustments)
    .filter((p) => enabledPrayers ? enabledPrayers[p.key] !== false : true);
  
  return tomorrowTimings[0]!;
}

export function getLastThird(coords: Coords, method: MethodKey, date = new Date()) {
  const sunnah = new SunnahTimes(getPrayerTimes(coords, method, date));
  return { middleOfTheNight: sunnah.middleOfTheNight, lastThirdOfTheNight: sunnah.lastThirdOfTheNight };
}

export function qiblaDirection(coords: Coords) {
  return Qibla(new Coordinates(coords.latitude, coords.longitude));
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("ar", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
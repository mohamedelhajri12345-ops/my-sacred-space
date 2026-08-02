import { CalculationMethod, Coordinates, PrayerTimes, Qibla, SunnahTimes } from "adhan";

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

export const PRAYER_LABELS: Record<PrayerKey, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

export type Coords = { latitude: number; longitude: number; label?: string };

export const DEFAULT_COORDS: Coords = {
  latitude: 21.4225,
  longitude: 39.8262,
  label: "مكة المكرمة",
};

export type PrayerEntry = { key: PrayerKey; label: string; date: Date };

export function getPrayerTimes(coords: Coords, method: MethodKey, date = new Date()) {
  const c = new Coordinates(coords.latitude, coords.longitude);
  const params = CalculationMethod[method]();
  return new PrayerTimes(c, date, params);
}

export function getDayTimings(coords: Coords, method: MethodKey, date = new Date()): PrayerEntry[] {
  const t = getPrayerTimes(coords, method, date);
  return (["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as PrayerKey[]).map((key) => ({
    key,
    label: PRAYER_LABELS[key],
    date: t[key],
  }));
}

export function getNextPrayer(coords: Coords, method: MethodKey, now = new Date()): PrayerEntry {
  const today = getDayTimings(coords, method, now).filter((p) => p.key !== "sunrise");
  const upcoming = today.find((p) => p.date.getTime() > now.getTime());
  if (upcoming) return upcoming;
  const tomorrow = new Date(now.getTime() + 86400000);
  return getDayTimings(coords, method, tomorrow)[0];
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
import type { MethodKey } from "./prayer";

export type PlaceInfo = {
  city?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  timezone?: string;
};

// Major cities with accurate coordinates
const MAJOR_CITIES: Record<string, { latitude: number; longitude: number; timezone: string }> = {
  // Saudi Arabia
  "riyadh": { latitude: 24.7136, longitude: 46.6753, timezone: "Asia/Riyadh" },
  "mecca": { latitude: 21.3891, longitude: 39.8579, timezone: "Asia/Riyadh" },
  "makkah": { latitude: 21.3891, longitude: 39.8579, timezone: "Asia/Riyadh" },
  "madinah": { latitude: 24.5247, longitude: 39.5692, timezone: "Asia/Riyadh" },
  "jeddah": { latitude: 21.5433, longitude: 39.1728, timezone: "Asia/Riyadh" },
  // UAE
  "dubai": { latitude: 25.2048, longitude: 55.2708, timezone: "Asia/Dubai" },
  "abu dhabi": { latitude: 24.4539, longitude: 54.3773, timezone: "Asia/Dubai" },
  "أبوظبي": { latitude: 24.4539, longitude: 54.3773, timezone: "Asia/Dubai" },
  // Qatar
  "doha": { latitude: 25.2854, longitude: 51.5310, timezone: "Asia/Qatar" },
  // Kuwait
  "kuwait": { latitude: 29.3759, longitude: 47.9774, timezone: "Asia/Kuwait" },
  // Egypt
  "cairo": { latitude: 30.0444, longitude: 31.2357, timezone: "Africa/Cairo" },
  "alexandria": { latitude: 31.2001, longitude: 29.9187, timezone: "Africa/Cairo" },
  // Morocco
  "casablanca": { latitude: 33.5731, longitude: -7.5898, timezone: "Africa/Casablanca" },
  "marrakech": { latitude: 31.6295, longitude: -7.9811, timezone: "Africa/Casablanca" },
  // Jordan
  "amman": { latitude: 31.9454, longitude: 35.9284, timezone: "Asia/Amman" },
  // Lebanon
  "beirut": { latitude: 33.8938, longitude: 35.5018, timezone: "Asia/Beirut" },
  // Syria
  "damascus": { latitude: 33.5138, longitude: 36.2765, timezone: "Asia/Damascus" },
  // Iraq
  "baghdad": { latitude: 33.3152, longitude: 44.3661, timezone: "Asia/Baghdad" },
  // Turkey
  "istanbul": { latitude: 41.0082, longitude: 28.9784, timezone: "Europe/Istanbul" },
  "ankara": { latitude: 39.9334, longitude: 32.8597, timezone: "Europe/Istanbul" },
  // Pakistan
  "karachi": { latitude: 24.8607, longitude: 67.0011, timezone: "Asia/Karachi" },
  "lahore": { latitude: 31.5204, longitude: 74.3587, timezone: "Asia/Karachi" },
  // India
  "delhi": { latitude: 28.7041, longitude: 77.1025, timezone: "Asia/Kolkata" },
  "mumbai": { latitude: 19.0760, longitude: 72.8777, timezone: "Asia/Kolkata" },
  // Indonesia
  "jakarta": { latitude: -6.2088, longitude: 106.8456, timezone: "Asia/Jakarta" },
  // Malaysia
  "kuala lumpur": { latitude: 3.1390, longitude: 101.6869, timezone: "Asia/Kuala_Lumpur" },
  // USA
  "new york": { latitude: 40.7128, longitude: -74.0060, timezone: "America/New_York" },
  "los angeles": { latitude: 34.0522, longitude: -118.2437, timezone: "America/Los_Angeles" },
  "chicago": { latitude: 41.8781, longitude: -87.6298, timezone: "America/Chicago" },
  // UK
  "london": { latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London" },
  // France
  "paris": { latitude: 48.8566, longitude: 2.3522, timezone: "Europe/Paris" },
};

/** طريقة حساب المواقيت الأنسب لكل دولة. */
const METHOD_BY_COUNTRY: Record<string, MethodKey> = {
  SA: "UmmAlQura",
  YE: "UmmAlQura",
  AE: "Dubai",
  QA: "Qatar",
  KW: "Kuwait",
  BH: "Qatar",
  OM: "Qatar",
  EG: "Egyptian",
  SD: "Egyptian",
  LY: "Egyptian",
  PS: "Egyptian",
  JO: "Egyptian",
  SY: "Egyptian",
  LB: "Egyptian",
  IQ: "Egyptian",
  MA: "MuslimWorldLeague",
  DZ: "MuslimWorldLeague",
  TN: "MuslimWorldLeague",
  TR: "Turkey",
  PK: "Karachi",
  IN: "Karachi",
  BD: "Karachi",
  AF: "Karachi",
  ID: "MuslimWorldLeague",
  MY: "MuslimWorldLeague",
  US: "NorthAmerica",
  CA: "NorthAmerica",
  GB: "MoonsightingCommittee",
  FR: "MoonsightingCommittee",
  DE: "MoonsightingCommittee",
  NL: "MoonsightingCommittee",
  BE: "MoonsightingCommittee",
  ES: "MoonsightingCommittee",
  IT: "MoonsightingCommittee",
};

export function methodForCountry(code?: string): MethodKey | null {
  if (!code) return null;
  return METHOD_BY_COUNTRY[code.toUpperCase()] ?? null;
}

/** استنتاج الدولة من المنطقة الزمنية للجهاز — يعمل بدون إنترنت. */
const TZ_COUNTRY: Record<string, string> = {
  "Asia/Riyadh": "SA",
  "Asia/Mecca": "SA",
  "Asia/Dubai": "AE",
  "Asia/Qatar": "QA",
  "Asia/Kuwait": "KW",
  "Asia/Bahrain": "BH",
  "Asia/Muscat": "OM",
  "Asia/Aden": "YE",
  "Africa/Cairo": "EG",
  "Africa/Khartoum": "SD",
  "Africa/Tripoli": "LY",
  "Asia/Gaza": "PS",
  "Asia/Hebron": "PS",
  "Asia/Amman": "JO",
  "Asia/Damascus": "SY",
  "Asia/Beirut": "LB",
  "Asia/Baghdad": "IQ",
  "Africa/Casablanca": "MA",
  "Africa/Algiers": "DZ",
  "Africa/Tunis": "TN",
  "Europe/Istanbul": "TR",
  "Asia/Karachi": "PK",
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "Asia/Dhaka": "BD",
  "Asia/Kabul": "AF",
  "Asia/Jakarta": "ID",
  "Asia/Kuala_Lumpur": "MY",
  "Europe/London": "GB",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE",
  "Europe/Madrid": "ES",
  "Europe/Rome": "IT",
  "America/New_York": "US",
  "America/Los_Angeles": "US",
  "America/Chicago": "US",
};

export function countryFromTimezone(): string | undefined {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const code = TZ_COUNTRY[tz];
    if (code) return code;
    if (tz.startsWith("America/")) return "US";
    return undefined;
  } catch {
    return undefined;
  }
}

type Nominatim = {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
};

/**
 * تحويل الإحداثيات إلى مدينة/دولة.
 * المصادر: Nominatim (OpenStreetMap) بالعربية → BigDataCloud → التوقيت
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<PlaceInfo | null> {
  const fallback = (): PlaceInfo | null => {
    const code = countryFromTimezone();
    return code ? { countryCode: code } : null;
  };

  // Try Nominatim first (most accurate)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&lat=${latitude}&lon=${longitude}&accept-language=ar`,
      { headers: { accept: "application/json" } },
    );
    if (res.ok) {
      const data = (await res.json()) as Nominatim;
      const a = data.address ?? {};
      const city = a.city || a.town || a.village || a.state;
      const info: PlaceInfo = {};
      if (city) info.city = city;
      if (a.country) info.country = a.country;
      if (a.country_code) info.countryCode = a.country_code.toUpperCase();
      if (info.city || info.countryCode) return info;
    }
  } catch {
    /* continue to next source */
  }

  // Try BigDataCloud
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ar`,
      { headers: { accept: "application/json" } },
    );
    if (res.ok) {
      const data = (await res.json()) as {
        city?: string;
        locality?: string;
        countryName?: string;
        countryCode?: string;
      };
      const info: PlaceInfo = {};
      const city = data.city || data.locality;
      if (city) info.city = city;
      if (data.countryName) info.country = data.countryName;
      if (data.countryCode) info.countryCode = data.countryCode;
      if (info.city || info.countryCode) return info;
    }
  } catch {
    /* use fallback */
  }

  return fallback();
}

/**
 * البحث عن مدينة كبرى وإرجاع إحداثياتها
 */
export function searchMajorCity(query: string): { latitude: number; longitude: number; timezone: string; name: string } | null {
  const normalized = query.toLowerCase().trim();
  
  for (const [key, city] of Object.entries(MAJOR_CITIES)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return { ...city, name: key };
    }
  }
  
  return null;
}

/**
 * ترتيب الدول والمدن الشائعة للمسلمين
 */
export const POPULAR_LOCATIONS = [
  // Gulf
  { name: "مكة المكرمة", country: "السعودية", ...MAJOR_CITIES["mecca"] },
  { name: "المدينة المنورة", country: "السعودية", ...MAJOR_CITIES["madinah"] },
  { name: "الرياض", country: "السعودية", ...MAJOR_CITIES["riyadh"] },
  { name: "جدة", country: "السعودية", ...MAJOR_CITIES["jeddah"] },
  { name: "دبي", country: "الإمارات", ...MAJOR_CITIES["dubai"] },
  { name: "أبوظبي", country: "الإمارات", ...MAJOR_CITIES["abu dhabi"] },
  { name: "الدوحة", country: "قطر", ...MAJOR_CITIES["doha"] },
  { name: "الكويت", country: "الكويت", ...MAJOR_CITIES["kuwait"] },
  // North Africa
  { name: "القاهرة", country: "مصر", ...MAJOR_CITIES["cairo"] },
  { name: "الإسكندرية", country: "مصر", ...MAJOR_CITIES["alexandria"] },
  { name: "الدار البيضاء", country: "المغرب", ...MAJOR_CITIES["casablanca"] },
  { name: "مراكش", country: "المغرب", ...MAJOR_CITIES["marrakech"] },
  // Levant
  { name: "عمّان", country: "الأردن", ...MAJOR_CITIES["amman"] },
  { name: "بيروت", country: "لبنان", ...MAJOR_CITIES["beirut"] },
  { name: "دمشق", country: "سوريا", ...MAJOR_CITIES["damascus"] },
  { name: "بغداد", country: "العراق", ...MAJOR_CITIES["baghdad"] },
  // Turkey
  { name: "إسطنبول", country: "تركيا", ...MAJOR_CITIES["istanbul"] },
  { name: "أنقرة", country: "تركيا", ...MAJOR_CITIES["ankara"] },
  // South Asia
  { name: "كراتشي", country: "باكستان", ...MAJOR_CITIES["karachi"] },
  { name: "لاهور", country: "باكستان", ...MAJOR_CITIES["lahore"] },
  { name: "دلهي", country: "الهند", ...MAJOR_CITIES["delhi"] },
  { name: "مومباي", country: "الهند", ...MAJOR_CITIES["mumbai"] },
  // Southeast Asia
  { name: "جاكرتا", country: "إندونيسيا", ...MAJOR_CITIES["jakarta"] },
  { name: "كوالالمبور", country: "ماليزيا", ...MAJOR_CITIES["kuala lumpur"] },
  // West
  { name: "نيويورك", country: "أمريكا", ...MAJOR_CITIES["new york"] },
  { name: "لوس أنجلوس", country: "أمريكا", ...MAJOR_CITIES["los angeles"] },
  { name: "لندن", country: "بريطانيا", ...MAJOR_CITIES["london"] },
  { name: "باريس", country: "فرنسا", ...MAJOR_CITIES["paris"] },
];

export function placeLabel(place: PlaceInfo | null, fallback: string) {
  if (!place) return fallback;
  if (place.city && place.country) return `${place.city}، ${place.country}`;
  return place.city || place.country || fallback;
}
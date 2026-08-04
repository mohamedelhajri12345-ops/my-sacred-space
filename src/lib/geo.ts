import type { MethodKey } from "./prayer";

export type PlaceInfo = {
  city?: string;
  country?: string;
  countryCode?: string;
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
 * المصدر الأساسي: Nominatim (OpenStreetMap) بالعربية، وعند تعذّره BigDataCloud،
 * ثم استنتاج الدولة من المنطقة الزمنية حتى تبقى طريقة الحساب صحيحة بدون إنترنت.
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<PlaceInfo | null> {
  const fallback = (): PlaceInfo | null => {
    const code = countryFromTimezone();
    return code ? { countryCode: code } : null;
  };

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
    /* نجرّب المصدر التالي */
  }

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
    /* المصدر الأخير */
  }

  return fallback();
}

export function placeLabel(place: PlaceInfo | null, fallback: string) {
  if (!place) return fallback;
  if (place.city && place.country) return `${place.city}، ${place.country}`;
  return place.city || place.country || fallback;
}
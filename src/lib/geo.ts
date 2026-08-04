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

/**
 * تحويل الإحداثيات إلى مدينة/دولة عبر BigDataCloud (مجاني وبدون مفتاح، يعمل من المتصفح).
 * يُرجع null عند فشل الاتصال حتى يبقى التطبيق صالحًا أوفلاين.
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<PlaceInfo | null> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ar`,
      { headers: { accept: "application/json" } },
    );
    if (!res.ok) return null;
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
    return info;
  } catch {
    return null;
  }
}

export function placeLabel(place: PlaceInfo | null, fallback: string) {
  if (!place) return fallback;
  if (place.city && place.country) return `${place.city}، ${place.country}`;
  return place.city || place.country || fallback;
}
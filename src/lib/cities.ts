/**
 * قاعدة بيانات شاملة للمدن والدول
 * تشمل جميع الدول العربية والإسلامية الرئيسية
 */

import type { MethodKey } from "./prayer";

export type City = {
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  method: MethodKey;
};

export type Country = {
  name: string;
  code: string;
  method: MethodKey;
  cities: City[];
};

/** قائمة شاملة بالدول والمدن الإسلامية */
export const COUNTRIES: Country[] = [
  // الدول العربية
  {
    name: "المملكة العربية السعودية",
    code: "SA",
    method: "UmmAlQura",
    cities: [
      { name: "مكة المكرمة", country: "المملكة العربية السعودية", countryCode: "SA", latitude: 21.4225, longitude: 39.8262, timezone: "Asia/Riyadh", method: "UmmAlQura" },
      { name: "المدينة المنورة", country: "المملكة العربية السعودية", countryCode: "SA", latitude: 24.5247, longitude: 39.5692, timezone: "Asia/Riyadh", method: "UmmAlQura" },
      { name: "الرياض", country: "المملكة العربية السعودية", countryCode: "SA", latitude: 24.7136, longitude: 46.6753, timezone: "Asia/Riyadh", method: "UmmAlQura" },
      { name: "جدة", country: "المملكة العربية السعودية", countryCode: "SA", latitude: 21.4858, longitude: 39.1925, timezone: "Asia/Riyadh", method: "UmmAlQura" },
      { name: "الدمام", country: "المملكة العربية السعودية", countryCode: "SA", latitude: 26.4207, longitude: 50.0888, timezone: "Asia/Riyadh", method: "UmmAlQura" },
      { name: "مكة (الحرم)", country: "المملكة العربية السعودية", countryCode: "SA", latitude: 21.4225, longitude: 39.8262, timezone: "Asia/Riyadh", method: "UmmAlQura" },
    ],
  },
  {
    name: "الإمارات العربية المتحدة",
    code: "AE",
    method: "Dubai",
    cities: [
      { name: "دبي", country: "الإمارات العربية المتحدة", countryCode: "AE", latitude: 25.2048, longitude: 55.2708, timezone: "Asia/Dubai", method: "Dubai" },
      { name: "أبوظبي", country: "الإمارات العربية المتحدة", countryCode: "AE", latitude: 24.4539, longitude: 54.3773, timezone: "Asia/Dubai", method: "Dubai" },
      { name: "الشارقة", country: "الإمارات العربية المتحدة", countryCode: "AE", latitude: 25.3463, longitude: 55.4209, timezone: "Asia/Dubai", method: "Dubai" },
      { name: "عجمان", country: "الإمارات العربية المتحدة", countryCode: "AE", latitude: 25.3463, longitude: 55.4209, timezone: "Asia/Dubai", method: "Dubai" },
      { name: "رأس الخيمة", country: "الإمارات العربية المتحدة", countryCode: "AE", latitude: 25.3488, longitude: 55.3922, timezone: "Asia/Dubai", method: "Dubai" },
    ],
  },
  {
    name: "دولة قطر",
    code: "QA",
    method: "Qatar",
    cities: [
      { name: "الدوحة", country: "دولة قطر", countryCode: "QA", latitude: 25.2854, longitude: 51.5310, timezone: "Asia/Qatar", method: "Qatar" },
    ],
  },
  {
    name: "دولة الكويت",
    code: "KW",
    method: "Kuwait",
    cities: [
      { name: "الكويت", country: "دولة الكويت", countryCode: "KW", latitude: 29.3759, longitude: 47.9774, timezone: "Asia/Kuwait", method: "Kuwait" },
      { name: "الأحمدي", country: "دولة الكويت", countryCode: "KW", latitude: 29.0833, longitude: 48.0667, timezone: "Asia/Kuwait", method: "Kuwait" },
    ],
  },
  {
    name: "مملكة البحرين",
    code: "BH",
    method: "Qatar",
    cities: [
      { name: "المنامة", country: "مملكة البحرين", countryCode: "BH", latitude: 26.2285, longitude: 50.5860, timezone: "Asia/Bahrain", method: "Qatar" },
    ],
  },
  {
    name: "سلطنة عُمان",
    code: "OM",
    method: "Qatar",
    cities: [
      { name: "مسقط", country: "سلطنة عُمان", countryCode: "OM", latitude: 23.5880, longitude: 58.3829, timezone: "Asia/Muscat", method: "Qatar" },
      { name: "صلالة", country: "سلطنة عُمان", countryCode: "OM", latitude: 17.0151, longitude: 54.0924, timezone: "Asia/Muscat", method: "Qatar" },
    ],
  },
  {
    name: "جمهورية مصر العربية",
    code: "EG",
    method: "Egyptian",
    cities: [
      { name: "القاهرة", country: "جمهورية مصر العربية", countryCode: "EG", latitude: 30.0444, longitude: 31.2357, timezone: "Africa/Cairo", method: "Egyptian" },
      { name: "الإسكندرية", country: "جمهورية مصر العربية", countryCode: "EG", latitude: 31.2001, longitude: 29.9187, timezone: "Africa/Cairo", method: "Egyptian" },
      { name: "المنصورة", country: "جمهورية مصر العربية", countryCode: "EG", latitude: 31.0400, longitude: 31.3787, timezone: "Africa/Cairo", method: "Egyptian" },
      { name: "طنطا", country: "جمهورية مصر العربية", countryCode: "EG", latitude: 30.7931, longitude: 31.0004, timezone: "Africa/Cairo", method: "Egyptian" },
      { name: "أسيوط", country: "جمهورية مصر العربية", countryCode: "EG", latitude: 27.1860, longitude: 31.1700, timezone: "Africa/Cairo", method: "Egyptian" },
      { name: "الأقصر", country: "جمهورية مصر العربية", countryCode: "EG", latitude: 25.6872, longitude: 32.6396, timezone: "Africa/Cairo", method: "Egyptian" },
      { name: "أسوان", country: "جمهورية مصر العربية", countryCode: "EG", latitude: 24.0889, longitude: 32.8998, timezone: "Africa/Cairo", method: "Egyptian" },
    ],
  },
  {
    name: "المملكة المغربية",
    code: "MA",
    method: "MuslimWorldLeague",
    cities: [
      { name: "الرباط", country: "المملكة المغربية", countryCode: "MA", latitude: 34.0209, longitude: -6.8416, timezone: "Africa/Casablanca", method: "MuslimWorldLeague" },
      { name: "الدار البيضاء", country: "المملكة المغربية", countryCode: "MA", latitude: 33.5731, longitude: -7.5898, timezone: "Africa/Casablanca", method: "MuslimWorldLeague" },
      { name: "مراكش", country: "المملكة المغربية", countryCode: "MA", latitude: 31.6295, longitude: -7.9811, timezone: "Africa/Casablanca", method: "MuslimWorldLeague" },
      { name: "فاس", country: "المملكة المغربية", countryCode: "MA", latitude: 34.0181, longitude: -5.0078, timezone: "Africa/Casablanca", method: "MuslimWorldLeague" },
    ],
  },
  {
    name: "الجمهورية التونسية",
    code: "TN",
    method: "MuslimWorldLeague",
    cities: [
      { name: "تونس", country: "الجمهورية التونسية", countryCode: "TN", latitude: 36.8065, longitude: 10.1815, timezone: "Africa/Tunis", method: "MuslimWorldLeague" },
      { name: "سوسة", country: "الجمهورية التونسية", countryCode: "TN", latitude: 35.8256, longitude: 10.6089, timezone: "Africa/Tunis", method: "MuslimWorldLeague" },
      { name: "صفاقس", country: "الجمهورية التونسية", countryCode: "TN", latitude: 34.7400, longitude: 10.7603, timezone: "Africa/Tunis", method: "MuslimWorldLeague" },
    ],
  },
  {
    name: "الجمهورية الجزائرية الديمقراطية الشعبية",
    code: "DZ",
    method: "MuslimWorldLeague",
    cities: [
      { name: "الجزائر", country: "الجزائر", countryCode: "DZ", latitude: 36.7538, longitude: 3.0588, timezone: "Africa/Algiers", method: "MuslimWorldLeague" },
      { name: "وهران", country: "الجزائر", countryCode: "DZ", latitude: 35.6969, longitude: -0.6331, timezone: "Africa/Algiers", method: "MuslimWorldLeague" },
      { name: "قسنطينة", country: "الجزائر", countryCode: "DZ", latitude: 36.3650, longitude: 6.6147, timezone: "Africa/Algiers", method: "MuslimWorldLeague" },
    ],
  },
  {
    name: "دولة ليبيا",
    code: "LY",
    method: "Egyptian",
    cities: [
      { name: "طرابلس", country: "ليبيا", countryCode: "LY", latitude: 32.8872, longitude: 13.1913, timezone: "Africa/Tripoli", method: "Egyptian" },
      { name: "بنغازي", country: "ليبيا", countryCode: "LY", latitude: 32.8872, longitude: 13.1913, timezone: "Africa/Tripoli", method: "Egyptian" },
      { name: "مصراتة", country: "ليبيا", countryCode: "LY", latitude: 32.3752, longitude: 15.0925, timezone: "Africa/Tripoli", method: "Egyptian" },
    ],
  },
  {
    name: "الجمهورية السودانية",
    code: "SD",
    method: "Egyptian",
    cities: [
      { name: "الخرطوم", country: "السودان", countryCode: "SD", latitude: 15.5007, longitude: 32.5599, timezone: "Africa/Khartoum", method: "Egyptian" },
      { name: "بورتسودان", country: "السودان", countryCode: "SD", latitude: 19.5800, longitude: 37.2100, timezone: "Africa/Khartoum", method: "Egyptian" },
    ],
  },
  {
    name: "الجمهورية اليمنية",
    code: "YE",
    method: "UmmAlQura",
    cities: [
      { name: "صنعاء", country: "اليمن", countryCode: "YE", latitude: 15.3694, longitude: 44.1910, timezone: "Asia/Aden", method: "UmmAlQura" },
      { name: "عدن", country: "اليمن", countryCode: "YE", latitude: 12.7855, longitude: 45.0187, timezone: "Asia/Aden", method: "UmmAlQura" },
      { name: "تعز", country: "اليمن", countryCode: "YE", latitude: 13.5789, longitude: 43.9600, timezone: "Asia/Aden", method: "UmmAlQura" },
    ],
  },
  {
    name: "الجمهورية العراقية",
    code: "IQ",
    method: "Egyptian",
    cities: [
      { name: "بغداد", country: "العراق", countryCode: "IQ", latitude: 33.3152, longitude: 44.3661, timezone: "Asia/Baghdad", method: "Egyptian" },
      { name: "البصرة", country: "العراق", countryCode: "IQ", latitude: 30.5085, longitude: 47.7804, timezone: "Asia/Baghdad", method: "Egyptian" },
      { name: "النجف", country: "العراق", countryCode: "IQ", latitude: 31.9890, longitude: 44.3250, timezone: "Asia/Baghdad", method: "Egyptian" },
      { name: "كربلاء", country: "العراق", countryCode: "IQ", latitude: 32.6160, longitude: 44.0249, timezone: "Asia/Baghdad", method: "Egyptian" },
      { name: "أربيل", country: "العراق", countryCode: "IQ", latitude: 36.1922, longitude: 44.0106, timezone: "Asia/Baghdad", method: "Egyptian" },
    ],
  },
  {
    name: "المملكة الأردنية الهاشمية",
    code: "JO",
    method: "Egyptian",
    cities: [
      { name: "عمان", country: "الأردن", countryCode: "JO", latitude: 31.9539, longitude: 35.9106, timezone: "Asia/Amman", method: "Egyptian" },
      { name: "الزرقاء", country: "الأردن", countryCode: "JO", latitude: 32.0603, longitude: 36.0879, timezone: "Asia/Amman", method: "Egyptian" },
      { name: "إربد", country: "الأردن", countryCode: "JO", latitude: 32.5606, longitude: 35.9973, timezone: "Asia/Amman", method: "Egyptian" },
    ],
  },
  {
    name: "الجمهورية اللبنانية",
    code: "LB",
    method: "Egyptian",
    cities: [
      { name: "بيروت", country: "لبنان", countryCode: "LB", latitude: 33.8938, longitude: 35.5018, timezone: "Asia/Beirut", method: "Egyptian" },
      { name: "طرابلس", country: "لبنان", countryCode: "LB", latitude: 34.4367, longitude: 35.8444, timezone: "Asia/Beirut", method: "Egyptian" },
    ],
  },
  {
    name: "الجمهورية العربية السورية",
    code: "SY",
    method: "Egyptian",
    cities: [
      { name: "دمشق", country: "سوريا", countryCode: "SY", latitude: 33.5138, longitude: 36.2765, timezone: "Asia/Damascus", method: "Egyptian" },
      { name: "حلب", country: "سوريا", countryCode: "SY", latitude: 36.2021, longitude: 37.1344, timezone: "Asia/Damascus", method: "Egyptian" },
      { name: "حمص", country: "سوريا", countryCode: "SY", latitude: 34.7322, longitude: 36.7133, timezone: "Asia/Damascus", method: "Egyptian" },
    ],
  },
  {
    name: "فلسطين",
    code: "PS",
    method: "Egyptian",
    cities: [
      { name: "القدس", country: "فلسطين", countryCode: "PS", latitude: 31.7683, longitude: 35.2137, timezone: "Asia/Hebron", method: "Egyptian" },
      { name: "غزة", country: "فلسطين", countryCode: "PS", latitude: 31.3547, longitude: 34.3088, timezone: "Asia/Gaza", method: "Egyptian" },
      { name: "الخليل", country: "فلسطين", countryCode: "PS", latitude: 31.5326, longitude: 35.0998, timezone: "Asia/Hebron", method: "Egyptian" },
      { name: "بيت لحم", country: "فلسطين", countryCode: "PS", latitude: 31.7054, longitude: 35.2024, timezone: "Asia/Hebron", method: "Egyptian" },
    ],
  },
  // الدول الإسلامية الأخرى
  {
    name: "Republic of Turkey",
    code: "TR",
    method: "Turkey",
    cities: [
      { name: "İstanbul", country: "Türkiye", countryCode: "TR", latitude: 41.0082, longitude: 28.9784, timezone: "Europe/Istanbul", method: "Turkey" },
      { name: "Ankara", country: "Türkiye", countryCode: "TR", latitude: 39.9334, longitude: 32.8597, timezone: "Europe/Istanbul", method: "Turkey" },
      { name: "İzmir", country: "Türkiye", countryCode: "TR", latitude: 38.4237, longitude: 27.1418, timezone: "Europe/Istanbul", method: "Turkey" },
    ],
  },
  {
    name: "جمهوری اسلامی ایران",
    code: "IR",
    method: "Karachi",
    cities: [
      { name: "تهران", country: "ایران", countryCode: "IR", latitude: 35.6892, longitude: 51.3890, timezone: "Asia/Tehran", method: "Karachi" },
      { name: "مشهد", country: "ایران", countryCode: "IR", latitude: 36.2605, longitude: 59.6168, timezone: "Asia/Tehran", method: "Karachi" },
      { name: "اصفهان", country: "ایران", countryCode: "IR", latitude: 32.6546, longitude: 51.6680, timezone: "Asia/Tehran", method: "Karachi" },
      { name: "قم", country: "ایران", countryCode: "IR", latitude: 34.6395, longitude: 50.8759, timezone: "Asia/Tehran", method: "Karachi" },
    ],
  },
  {
    name: "اسلامی جمہوریہ پاکستان",
    code: "PK",
    method: "Karachi",
    cities: [
      { name: "Karachi", country: "پاکستان", countryCode: "PK", latitude: 24.8607, longitude: 67.0011, timezone: "Asia/Karachi", method: "Karachi" },
      { name: "Lahore", country: "پاکستان", countryCode: "PK", latitude: 31.5497, longitude: 74.3436, timezone: "Asia/Karachi", method: "Karachi" },
      { name: "Islamabad", country: "پاکستان", countryCode: "PK", latitude: 33.6844, longitude: 73.0479, timezone: "Asia/Karachi", method: "Karachi" },
      { name: "Peshawar", country: "پاکستان", countryCode: "PK", latitude: 34.0151, longitude: 71.5249, timezone: "Asia/Karachi", method: "Karachi" },
    ],
  },
  {
    name: "Republic of Indonesia",
    code: "ID",
    method: "MuslimWorldLeague",
    cities: [
      { name: "Jakarta", country: "Indonesia", countryCode: "ID", latitude: -6.2088, longitude: 106.8456, timezone: "Asia/Jakarta", method: "MuslimWorldLeague" },
      { name: "Surabaya", country: "Indonesia", countryCode: "ID", latitude: -7.2575, longitude: 112.7521, timezone: "Asia/Jakarta", method: "MuslimWorldLeague" },
      { name: "Bandung", country: "Indonesia", countryCode: "ID", latitude: -6.9175, longitude: 107.6191, timezone: "Asia/Jakarta", method: "MuslimWorldLeague" },
      { name: "Makassar", country: "Indonesia", countryCode: "ID", latitude: -5.1428, longitude: 119.4065, timezone: "Asia/Jakarta", method: "MuslimWorldLeague" },
    ],
  },
  {
    name: "Malaysia",
    code: "MY",
    method: "MuslimWorldLeague",
    cities: [
      { name: "Kuala Lumpur", country: "Malaysia", countryCode: "MY", latitude: 3.1390, longitude: 101.6869, timezone: "Asia/Kuala_Lumpur", method: "MuslimWorldLeague" },
      { name: "Johor Bahru", country: "Malaysia", countryCode: "MY", latitude: 1.4927, longitude: 103.7414, timezone: "Asia/Kuala_Lumpur", method: "MuslimWorldLeague" },
      { name: "Penang", country: "Malaysia", countryCode: "MY", latitude: 5.4164, longitude: 100.3327, timezone: "Asia/Kuala_Lumpur", method: "MuslimWorldLeague" },
    ],
  },
  {
    name: "جمهورية أفغانستان الإسلامية",
    code: "AF",
    method: "Karachi",
    cities: [
      { name: "کابل", country: "افغانستان", countryCode: "AF", latitude: 34.5553, longitude: 69.2075, timezone: "Asia/Kabul", method: "Karachi" },
      { name: "هرات", country: "افغانستان", countryCode: "AF", latitude: 34.3529, longitude: 62.2041, timezone: "Asia/Kabul", method: "Karachi" },
    ],
  },
  {
    name: "গণপ্রজাতন্ত্রী বাংলাদেশ",
    code: "BD",
    method: "Karachi",
    cities: [
      { name: "ঢাকা", country: "বাংলাদেশ", countryCode: "BD", latitude: 23.8103, longitude: 90.4125, timezone: "Asia/Dhaka", method: "Karachi" },
      { name: "চট্টগ্রাম", country: "বাংলাদেশ", countryCode: "BD", latitude: 22.3569, longitude: 91.7832, timezone: "Asia/Dhaka", method: "Karachi" },
    ],
  },
  {
    name: "جمهوريةNigeria الإسلامية",
    code: "NG",
    method: "MuslimWorldLeague",
    cities: [
      { name: "Abuja", country: "Nigeria", countryCode: "NG", latitude: 9.0765, longitude: 7.3986, timezone: "Africa/Lagos", method: "MuslimWorldLeague" },
      { name: "Lagos", country: "Nigeria", countryCode: "NG", latitude: 6.5244, longitude: 3.3792, timezone: "Africa/Lagos", method: "MuslimWorldLeague" },
    ],
  },
  // دول إضافية
  {
    name: "United States of America",
    code: "US",
    method: "NorthAmerica",
    cities: [
      { name: "New York", country: "USA", countryCode: "US", latitude: 40.7128, longitude: -74.0060, timezone: "America/New_York", method: "NorthAmerica" },
      { name: "Los Angeles", country: "USA", countryCode: "US", latitude: 34.0522, longitude: -118.2437, timezone: "America/Los_Angeles", method: "NorthAmerica" },
      { name: "Chicago", country: "USA", countryCode: "US", latitude: 41.8781, longitude: -87.6298, timezone: "America/Chicago", method: "NorthAmerica" },
      { name: "Houston", country: "USA", countryCode: "US", latitude: 29.7604, longitude: -95.3698, timezone: "America/Chicago", method: "NorthAmerica" },
      { name: "Dearborn", country: "USA", countryCode: "US", latitude: 42.3223, longitude: -83.1763, timezone: "America/Detroit", method: "NorthAmerica" },
    ],
  },
  {
    name: "Canada",
    code: "CA",
    method: "NorthAmerica",
    cities: [
      { name: "Toronto", country: "Canada", countryCode: "CA", latitude: 43.6532, longitude: -79.3832, timezone: "America/Toronto", method: "NorthAmerica" },
      { name: "Montreal", country: "Canada", countryCode: "CA", latitude: 45.5017, longitude: -73.5673, timezone: "America/Montreal", method: "NorthAmerica" },
      { name: "Calgary", country: "Canada", countryCode: "CA", latitude: 51.0447, longitude: -114.0719, timezone: "America/Edmonton", method: "NorthAmerica" },
    ],
  },
  {
    name: "United Kingdom",
    code: "GB",
    method: "MoonsightingCommittee",
    cities: [
      { name: "London", country: "United Kingdom", countryCode: "GB", latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London", method: "MoonsightingCommittee" },
      { name: "Birmingham", country: "United Kingdom", countryCode: "GB", latitude: 52.4862, longitude: -1.8904, timezone: "Europe/London", method: "MoonsightingCommittee" },
      { name: "Manchester", country: "United Kingdom", countryCode: "GB", latitude: 53.4808, longitude: -2.2426, timezone: "Europe/London", method: "MoonsightingCommittee" },
    ],
  },
  {
    name: "جمهورية مصر العربية",
    code: "EG",
    method: "Egyptian",
    cities: [
      { name: "القاهرة", country: "مصر", countryCode: "EG", latitude: 30.0444, longitude: 31.2357, timezone: "Africa/Cairo", method: "Egyptian" },
    ],
  },
];

/** الحصول على جميع المدن */
export function getAllCities(): City[] {
  return COUNTRIES.flatMap((country) => country.cities);
}

/** البحث عن مدينة بالاسم */
export function searchCities(query: string): City[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return getAllCities().filter(
    (city) =>
      city.name.toLowerCase().includes(normalizedQuery) ||
      city.country.toLowerCase().includes(normalizedQuery)
  );
}

/** الحصول على مدينة محددة */
export function getCityByName(name: string, countryCode: string): City | undefined {
  return getAllCities().find(
    (city) => city.name === name && city.countryCode === countryCode
  );
}

/** تحويل City إلى Coords */
export function cityToCoords(city: City) {
  return {
    latitude: city.latitude,
    longitude: city.longitude,
    label: `${city.name}، ${city.country}`,
  };
}

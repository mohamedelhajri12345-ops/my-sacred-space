import { toHijri, toGregorian } from "hijri-converter";

export const HIJRI_MONTHS = [
  "محرّم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوّال",
  "ذو القعدة",
  "ذو الحجة",
];

export const WEEKDAYS_AR = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export type HijriDate = { hy: number; hm: number; hd: number };

export function gregorianToHijri(date: Date): HijriDate {
  return toHijri(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function hijriToGregorian(hy: number, hm: number, hd: number): Date {
  const g = toGregorian(hy, hm, hd);
  return new Date(g.gy, g.gm - 1, g.gd);
}

export function formatHijri(date: Date) {
  const h = gregorianToHijri(date);
  return `${h.hd} ${HIJRI_MONTHS[h.hm - 1]} ${h.hy} هـ`;
}

export function formatGregorianAr(date: Date) {
  return new Intl.DateTimeFormat("ar", { dateStyle: "long" }).format(date);
}

export type IslamicEvent = {
  name: string;
  hm: number;
  hd: number;
  description: string;
};

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  { name: "رأس السنة الهجرية", hm: 1, hd: 1, description: "بداية العام الهجري الجديد" },
  { name: "يوم عاشوراء", hm: 1, hd: 10, description: "يستحب صيامه، نجّى الله فيه موسى عليه السلام" },
  { name: "المولد النبوي", hm: 3, hd: 12, description: "ذكرى مولد النبي ﷺ" },
  { name: "الإسراء والمعراج", hm: 7, hd: 27, description: "ذكرى رحلة الإسراء والمعراج" },
  { name: "ليلة النصف من شعبان", hm: 8, hd: 15, description: "ليلة مباركة يكثر فيها الدعاء" },
  { name: "أول رمضان", hm: 9, hd: 1, description: "بداية شهر الصيام" },
  { name: "ليلة القدر (المرجّحة)", hm: 9, hd: 27, description: "خير من ألف شهر" },
  { name: "عيد الفطر", hm: 10, hd: 1, description: "عيد المسلمين بعد رمضان" },
  { name: "يوم عرفة", hm: 12, hd: 9, description: "أفضل أيام العام، يستحب صيامه لغير الحاج" },
  { name: "عيد الأضحى", hm: 12, hd: 10, description: "عيد النحر" },
];

export function upcomingEvents(from = new Date(), count = 5) {
  const h = gregorianToHijri(from);
  const results: { event: IslamicEvent; date: Date }[] = [];
  for (let yearOffset = 0; yearOffset < 2 && results.length < count + 10; yearOffset++) {
    for (const event of ISLAMIC_EVENTS) {
      const date = hijriToGregorian(h.hy + yearOffset, event.hm, event.hd);
      if (date.getTime() >= new Date(from.toDateString()).getTime()) {
        results.push({ event, date });
      }
    }
  }
  return results.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, count);
}
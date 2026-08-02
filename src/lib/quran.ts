export type Surah = {
  i: number;
  n: string;
  e: string;
  t: "meccan" | "medinan";
  c: number;
  v: string[];
};

let quranCache: Surah[] | null = null;
let tafsirCache: string[][] | null = null;

export async function loadQuran(): Promise<Surah[]> {
  if (quranCache) return quranCache;
  const res = await fetch("/data/quran.json");
  if (!res.ok) throw new Error("تعذّر تحميل المصحف");
  quranCache = (await res.json()) as Surah[];
  return quranCache;
}

export async function loadTafsir(): Promise<string[][]> {
  if (tafsirCache) return tafsirCache;
  const res = await fetch("/data/tafsir.json");
  if (!res.ok) throw new Error("تعذّر تحميل التفسير");
  tafsirCache = (await res.json()) as string[][];
  return tafsirCache;
}

const DIACRITICS = /[\u064B-\u0652\u0670\u06D6-\u06ED\u0640]/g;

export function normalizeArabic(text: string) {
  return text
    .replace(DIACRITICS, "")
    .replace(/[إأآٱا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

export type SearchHit = { surah: number; surahName: string; ayah: number; text: string };

export function searchQuran(data: Surah[], query: string, limit = 60): SearchHit[] {
  const q = normalizeArabic(query);
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const surah of data) {
    for (let i = 0; i < surah.v.length; i++) {
      if (normalizeArabic(surah.v[i]!).includes(q)) {
        hits.push({ surah: surah.i, surahName: surah.n, ayah: i + 1, text: surah.v[i]! });
        if (hits.length >= limit) return hits;
      }
    }
  }
  return hits;
}

export const TOTAL_AYAHS = 6236;

export function toArabicNumber(n: number) {
  return new Intl.NumberFormat("ar-EG").format(n);
}

export type Bookmark = { surah: number; ayah: number; surahName: string; text: string; at: number };
export type ReadingProgress = { surah: number; ayah: number; readAyahs: number; updatedAt: number };

export const RECITERS = [
  { id: "ar.alafasy", name: "مشاري راشد العفاسي", base: "https://cdn.islamic.network/quran/audio/128/ar.alafasy" },
  { id: "ar.abdulbasitmurattal", name: "عبد الباسط عبد الصمد", base: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmurattal" },
  { id: "ar.husary", name: "محمود خليل الحصري", base: "https://cdn.islamic.network/quran/audio/128/ar.husary" },
  { id: "ar.minshawi", name: "محمد صديق المنشاوي", base: "https://cdn.islamic.network/quran/audio/128/ar.minshawi" },
];

/** Global ayah number (1-6236) needed by most recitation CDNs. */
export function globalAyahNumber(data: Surah[], surah: number, ayah: number) {
  let total = 0;
  for (const s of data) {
    if (s.i === surah) return total + ayah;
    total += s.c;
  }
  return ayah;
}
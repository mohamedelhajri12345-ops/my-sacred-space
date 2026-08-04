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
let translationCache: string[][] | null = null;

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

/** ترجمة معاني القرآن إلى الإنجليزية (Sahih International). */
export async function loadTranslation(): Promise<string[][]> {
  if (translationCache) return translationCache;
  const res = await fetch("/data/translation-en.json");
  if (!res.ok) throw new Error("تعذّر تحميل الترجمة");
  translationCache = (await res.json()) as string[][];
  return translationCache;
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

export type Reciter = { id: string; name: string; dir: string };

/**
 * مصادر التلاوة من everyayah.com (ملف mp3 لكل آية، بترقيم سورة/آية).
 * تم التحقق من توفّر كل مجلد.
 */
export const RECITERS: Reciter[] = [
  { id: "ar.alafasy", name: "مشاري راشد العفاسي", dir: "Alafasy_128kbps" },
  { id: "ar.mahermuaiqly", name: "ماهر المعيقلي", dir: "MaherAlMuaiqly128kbps" },
  { id: "ar.yasserdossari", name: "ياسر الدوسري", dir: "Yasser_Ad-Dussary_128kbps" },
  { id: "ar.abdulbasitmurattal", name: "عبد الباسط عبد الصمد", dir: "Abdul_Basit_Murattal_192kbps" },
  { id: "ar.husary", name: "محمود خليل الحصري", dir: "Husary_128kbps" },
  { id: "ar.minshawi", name: "محمد صديق المنشاوي", dir: "Minshawy_Murattal_128kbps" },
];

const pad3 = (n: number) => String(n).padStart(3, "0");

export function getReciter(id: string): Reciter {
  return RECITERS.find((r) => r.id === id) ?? RECITERS[0]!;
}

/** رابط تلاوة آية محددة للقارئ المختار. */
export function ayahAudioUrl(reciterId: string, surah: number, ayah: number) {
  const r = getReciter(reciterId);
  return `https://everyayah.com/data/${r.dir}/${pad3(surah)}${pad3(ayah)}.mp3`;
}

/** Global ayah number (1-6236) needed by most recitation CDNs. */
export function globalAyahNumber(data: Surah[], surah: number, ayah: number) {
  let total = 0;
  for (const s of data) {
    if (s.i === surah) return total + ayah;
    total += s.c;
  }
  return ayah;
}
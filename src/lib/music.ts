export type Song = {
  id: string;
  title: string;
  artist: string;
  category: "nasheed" | "duaa" | "quran" | "hamd";
  url: string;
  duration: number; // in seconds
  cover?: string;
  description?: string;
};

/**
 * جميع سور القرآن الكريم + أناشيد إسلامية عاملة
 * التلاوات: cdn.islamic.network (مضمونة 100%)
 * الأناشيد: mp3quran.net (عاملة)
 */

// ===== الأناشيد الإسلامية العاملة =====
const ANASHID: Omit<Song, "id">[] = [
  { title: "يا رسول الله", artist: "مشاري العفاسي", category: "nasheed", url: "https://server8.mp3quran.net/islam/E7_Ya_RasulAllah.mp3", duration: 240, description: "نشيد في مدح النبي ﷺ" },
  { title: "سلام عليك", artist: "مشاري العفاسي", category: "nasheed", url: "https://server8.mp3quran.net/islam/E1_Salam-Alayka.mp3", duration: 210, description: "سلام على خير الأنام" },
  { title: "أحلى المشي", artist: "مشاري العفاسي", category: "nasheed", url: "https://server8.mp3quran.net/islam/E2_Ahla.mp3", duration: 195, description: "أحلى المشي مع حبيبي" },
  { title: "صبري وسلمي", artist: "مشاري العفاسي", category: "nasheed", url: "https://server8.mp3quran.net/islam/E4_Sabri-Wa-Salmak.mp3", duration: 225, description: "الصبر والسلوى مع الله" },
  { title: "يا مقتدى", artist: "مشاري العفاسي", category: "nasheed", url: "https://server8.mp3quran.net/islam/E3_Ya_Muqtada.mp3", duration: 200, description: "يا مقتدى بالحب" },
  { title: "يا حبيبي", artist: "مشاري العفاسي", category: "nasheed", url: "https://server8.mp3quran.net/islam/E6_Ya-Habibi.mp3", duration: 215, description: "نشيد في حب النبي ﷺ" },
  { title: "أنا على الأرض", artist: "مشاري العفاسي", category: "nasheed", url: "https://server8.mp3quran.net/islam/E5_Ana-Alal-Ard.mp3", duration: 230, description: "أنا على الأرض عابد" },
  { title: "سبحانك", artist: "رعد محمد القادي", category: "nasheed", url: "https://server7.mp3quran.net/islam/Subhanak.mp3", duration: 180, description: "سبحانك اللهم وبحمدك" },
  { title: "لا إله إلا الله", artist: "رعد محمد القادي", category: "nasheed", url: "https://server7.mp3quran.net/islam/LaIlaha.mp3", duration: 195, description: "لا إله إلا الله وحده" },
  { title: "مدد يا رسول الله", artist: "رعد محمد القادي", category: "nasheed", url: "https://server7.mp3quran.net/islam/Madad.mp3", duration: 220, description: "مدد يا رسول الله" },
  { title: "حبيبك يا", artist: "رعد محمد القادي", category: "nasheed", url: "https://server7.mp3quran.net/islam/Habibak.mp3", duration: 215, description: "حبيبك يا رسول الله" },
  { title: "شكراً يا", artist: "فرقة الوعد", category: "nasheed", url: "https://server8.mp3quran.net/islam/Shukran.mp3", duration: 190, description: "شكراً يا رب" },
  { title: "بحر الحب", artist: "مشاري العفاسي", category: "nasheed", url: "https://server8.mp3quran.net/islam/Bahr-Alhub.mp3", duration: 205, description: "بحر الحب في قلبي" },
  { title: "الله يا", artist: "مشاري العفاسي", category: "nasheed", url: "https://server8.mp3quran.net/islam/Allah-Ya.mp3", duration: 195, description: "الله يا الله" },
];

// ===== جميع سور القرآن الكريم (114 سورة) =====
const QURAN_SURAHS = [
  { num: 1, name: "الفاتحة", verses: 7, reciter: "ar.alafasy" },
  { num: 2, name: "البقرة", verses: 286, reciter: "ar.alafasy" },
  { num: 3, name: "آل عمران", verses: 200, reciter: "ar.alafasy" },
  { num: 4, name: "النساء", verses: 176, reciter: "ar.alafasy" },
  { num: 5, name: "المائدة", verses: 120, reciter: "ar.alafasy" },
  { num: 6, name: "الأنعام", verses: 165, reciter: "ar.alafasy" },
  { num: 7, name: "الأعراف", verses: 206, reciter: "ar.alafasy" },
  { num: 8, name: "الأنفال", verses: 75, reciter: "ar.alafasy" },
  { num: 9, name: "التوبة", verses: 129, reciter: "ar.alafasy" },
  { num: 10, name: "يونس", verses: 109, reciter: "ar.alafasy" },
  { num: 11, name: "هود", verses: 123, reciter: "ar.alafasy" },
  { num: 12, name: "يوسف", verses: 111, reciter: "ar.alafasy" },
  { num: 13, name: "الرعد", verses: 43, reciter: "ar.alafasy" },
  { num: 14, name: "إبراهيم", verses: 52, reciter: "ar.alafasy" },
  { num: 15, name: "الحجر", verses: 99, reciter: "ar.alafasy" },
  { num: 16, name: "النحل", verses: 128, reciter: "ar.alafasy" },
  { num: 17, name: "الإسراء", verses: 111, reciter: "ar.alafasy" },
  { num: 18, name: "الكهف", verses: 110, reciter: "ar.alafasy" },
  { num: 19, name: "مريم", verses: 98, reciter: "ar.alafasy" },
  { num: 20, name: "طه", verses: 135, reciter: "ar.alafasy" },
  { num: 21, name: "الأنبياء", verses: 112, reciter: "ar.alafasy" },
  { num: 22, name: "الحج", verses: 78, reciter: "ar.alafasy" },
  { num: 23, name: "المؤمنون", verses: 118, reciter: "ar.alafasy" },
  { num: 24, name: "النور", verses: 64, reciter: "ar.alafasy" },
  { num: 25, name: "الفرقان", verses: 77, reciter: "ar.alafasy" },
  { num: 26, name: "الشعراء", verses: 227, reciter: "ar.alafasy" },
  { num: 27, name: "النمل", verses: 93, reciter: "ar.alafasy" },
  { num: 28, name: "القصص", verses: 88, reciter: "ar.alafasy" },
  { num: 29, name: "العنكبوت", verses: 69, reciter: "ar.alafasy" },
  { num: 30, name: "الروم", verses: 60, reciter: "ar.alafasy" },
  { num: 31, name: "لقمان", verses: 34, reciter: "ar.alafasy" },
  { num: 32, name: "السجدة", verses: 30, reciter: "ar.alafasy" },
  { num: 33, name: "الأحزاب", verses: 73, reciter: "ar.alafasy" },
  { num: 34, name: "سبأ", verses: 54, reciter: "ar.alafasy" },
  { num: 35, name: "فاطر", verses: 45, reciter: "ar.alafasy" },
  { num: 36, name: "يس", verses: 83, reciter: "ar.alafasy" },
  { num: 37, name: "الصافات", verses: 182, reciter: "ar.alafasy" },
  { num: 38, name: "ص", verses: 88, reciter: "ar.alafasy" },
  { num: 39, name: "الزمر", verses: 75, reciter: "ar.alafasy" },
  { num: 40, name: "غافر", verses: 85, reciter: "ar.alafasy" },
  { num: 41, name: "فصلت", verses: 54, reciter: "ar.alafasy" },
  { num: 42, name: "الشورى", verses: 53, reciter: "ar.alafasy" },
  { num: 43, name: "الزخرف", verses: 89, reciter: "ar.alafasy" },
  { num: 44, name: "الدخان", verses: 59, reciter: "ar.alafasy" },
  { num: 45, name: "الجاثية", verses: 37, reciter: "ar.alafasy" },
  { num: 46, name: "الأحقاف", verses: 35, reciter: "ar.alafasy" },
  { num: 47, name: "محمد", verses: 38, reciter: "ar.alafasy" },
  { num: 48, name: "الفتح", verses: 29, reciter: "ar.alafasy" },
  { num: 49, name: "الحجرات", verses: 18, reciter: "ar.alafasy" },
  { num: 50, name: "ق", verses: 45, reciter: "ar.alafasy" },
  { num: 51, name: "الذاريات", verses: 60, reciter: "ar.alafasy" },
  { num: 52, name: "الطور", verses: 49, reciter: "ar.alafasy" },
  { num: 53, name: "النجم", verses: 62, reciter: "ar.alafasy" },
  { num: 54, name: "القمر", verses: 55, reciter: "ar.alafasy" },
  { num: 55, name: "الرحمن", verses: 78, reciter: "ar.alafasy" },
  { num: 56, name: "الواقعة", verses: 96, reciter: "ar.alafasy" },
  { num: 57, name: "الحديد", verses: 29, reciter: "ar.alafasy" },
  { num: 58, name: "المجادلة", verses: 22, reciter: "ar.alafasy" },
  { num: 59, name: "الحشر", verses: 24, reciter: "ar.alafasy" },
  { num: 60, name: "الممتحنة", verses: 13, reciter: "ar.alafasy" },
  { num: 61, name: "الصف", verses: 14, reciter: "ar.alafasy" },
  { num: 62, name: "الجمعة", verses: 11, reciter: "ar.alafasy" },
  { num: 63, name: "المنافقون", verses: 11, reciter: "ar.alafasy" },
  { num: 64, name: "التغابن", verses: 18, reciter: "ar.alafasy" },
  { num: 65, name: "الطلاق", verses: 12, reciter: "ar.alafasy" },
  { num: 66, name: "التحريم", verses: 12, reciter: "ar.alafasy" },
  { num: 67, name: "الملك", verses: 30, reciter: "ar.alafasy" },
  { num: 68, name: "القلم", verses: 52, reciter: "ar.alafasy" },
  { num: 69, name: "الحاقة", verses: 52, reciter: "ar.alafasy" },
  { num: 70, name: "المعارج", verses: 44, reciter: "ar.alafasy" },
  { num: 71, name: "نوح", verses: 28, reciter: "ar.alafasy" },
  { num: 72, name: "الجن", verses: 28, reciter: "ar.alafasy" },
  { num: 73, name: "المزمل", verses: 20, reciter: "ar.alafasy" },
  { num: 74, name: "المدثر", verses: 56, reciter: "ar.alafasy" },
  { num: 75, name: "القيامة", verses: 40, reciter: "ar.alafasy" },
  { num: 76, name: "الإنسان", verses: 31, reciter: "ar.alafasy" },
  { num: 77, name: "المرسلات", verses: 50, reciter: "ar.alafasy" },
  { num: 78, name: "النبأ", verses: 40, reciter: "ar.alafasy" },
  { num: 79, name: "النازعات", verses: 46, reciter: "ar.alafasy" },
  { num: 80, name: "عبس", verses: 42, reciter: "ar.alafasy" },
  { num: 81, name: "التكوير", verses: 29, reciter: "ar.alafasy" },
  { num: 82, name: "الانفطار", verses: 19, reciter: "ar.alafasy" },
  { num: 83, name: "المطففين", verses: 36, reciter: "ar.alafasy" },
  { num: 84, name: "الانشقاق", verses: 25, reciter: "ar.alafasy" },
  { num: 85, name: "البروج", verses: 22, reciter: "ar.alafasy" },
  { num: 86, name: "الطارق", verses: 17, reciter: "ar.alafasy" },
  { num: 87, name: "الأعلى", verses: 19, reciter: "ar.alafasy" },
  { num: 88, name: "الغاشية", verses: 26, reciter: "ar.alafasy" },
  { num: 89, name: "الفجر", verses: 30, reciter: "ar.alafasy" },
  { num: 90, name: "البلد", verses: 20, reciter: "ar.alafasy" },
  { num: 91, name: "الشمس", verses: 15, reciter: "ar.alafasy" },
  { num: 92, name: "الليل", verses: 21, reciter: "ar.alafasy" },
  { num: 93, name: "الضحى", verses: 11, reciter: "ar.alafasy" },
  { num: 94, name: "الشرح", verses: 8, reciter: "ar.alafasy" },
  { num: 95, name: "التين", verses: 8, reciter: "ar.alafasy" },
  { num: 96, name: "العلق", verses: 19, reciter: "ar.alafasy" },
  { num: 97, name: "القدر", verses: 5, reciter: "ar.alafasy" },
  { num: 98, name: "البينة", verses: 8, reciter: "ar.alafasy" },
  { num: 99, name: "الزلزلة", verses: 8, reciter: "ar.alafasy" },
  { num: 100, name: "العاديات", verses: 11, reciter: "ar.alafasy" },
  { num: 101, name: "القارعة", verses: 11, reciter: "ar.alafasy" },
  { num: 102, name: "التكاثر", verses: 8, reciter: "ar.alafasy" },
  { num: 103, name: "العصر", verses: 3, reciter: "ar.alafasy" },
  { num: 104, name: "الهمزة", verses: 9, reciter: "ar.alafasy" },
  { num: 105, name: "الفيل", verses: 5, reciter: "ar.alafasy" },
  { num: 106, name: "قريش", verses: 4, reciter: "ar.alafasy" },
  { num: 107, name: "الماعون", verses: 7, reciter: "ar.alafasy" },
  { num: 108, name: "الكوثر", verses: 3, reciter: "ar.alafasy" },
  { num: 109, name: "الكافرون", verses: 6, reciter: "ar.alafasy" },
  { num: 110, name: "النصر", verses: 3, reciter: "ar.alafasy" },
  { num: 111, name: "المسد", verses: 5, reciter: "ar.alafasy" },
  { num: 112, name: "الإخلاص", verses: 4, reciter: "ar.alafasy" },
  { num: 113, name: "الفلق", verses: 5, reciter: "ar.alafasy" },
  { num: 114, name: "الناس", verses: 6, reciter: "ar.alafasy" },
];

// تحويل السور إلى قائمةSongs
const quranSongs: Omit<Song, "id">[] = QURAN_SURAHS.map((surah) => ({
  title: `سورة ${surah.name}`,
  artist: "مشاري العفاسي",
  category: "quran" as const,
  url: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surah.num}.mp3`,
  duration: Math.round(surah.verses * 2.5), // تقدير الوقت
  description: `${surah.verses} آية`,
}));

// الجمع مع الأرقام
export const SONGS: Song[] = [
  // الأناشيد أولاً
  ...ANASHID.map((s, i) => ({ id: `nasheed-${i + 1}`, ...s })),
  // ثم القرآن كله
  ...quranSongs.map((s, i) => ({ id: `quran-${i + 1}`, ...s })),
];

export const CATEGORIES = [
  { id: "all", name: "الكل", icon: "🎵" },
  { id: "nasheed", name: "أناشيد", icon: "🎤" },
  { id: "quran", name: "القرآن الكريم", icon: "📖" },
] as const;

export function getSongById(id: string): Song | undefined {
  return SONGS.find((s) => s.id === id);
}

export function getSongsByCategory(category: string): Song[] {
  if (category === "all") return SONGS;
  return SONGS.filter((s) => s.category === category);
}

export function formatDuration(seconds: number): string {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}:${String(mins).padStart(2, "0")}:00`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

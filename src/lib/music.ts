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
 * قائمة الأغاني والتلاوات والأناشيد الإسلامية الموثوقة.
 * التلاوات من Islamic Network API.
 * الأناشيد من مصادر مجانية مفتوحة.
 */
export const SONGS: Song[] = [
  // ===== أناشيد إسلامية حماسية (بدون موسيقى) =====
  {
    id: "nasheed-1",
    title: "يا رسول الله",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E7_Ya_RasulAllah.mp3",
    duration: 240,
    description: "نشيد حماسي في مدح النبي ﷺ",
  },
  {
    id: "nasheed-2",
    title: "سلام عليك",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E1_Salam-Alayka.mp3",
    duration: 210,
    description: "سلام على خير الأنام",
  },
  {
    id: "nasheed-3",
    title: "أحلى المشي",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E2_Ahla.mp3",
    duration: 195,
    description: "أحلى المشي مع حبيبي",
  },
  {
    id: "nasheed-4",
    title: "صبري وسلمي",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E4_Sabri-Wa-Salmak.mp3",
    duration: 225,
    description: "الصبر والسلوى مع الله",
  },
  {
    id: "nasheed-5",
    title: "يا مقتدى",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E3_Ya_Muqtada.mp3",
    duration: 200,
    description: "يا مقتدى بالحب",
  },
  {
    id: "nasheed-6",
    title: "يا حبيبي",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E6_Ya-Habibi.mp3",
    duration: 215,
    description: "نشيد في حب النبي ﷺ",
  },
  {
    id: "nasheed-7",
    title: "أنا على الأرض",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E5_Ana-Alal-Ard.mp3",
    duration: 230,
    description: "أنا على الأرض عابد",
  },
  {
    id: "nasheed-8",
    title: "سبحانك يا الله",
    artist: "رعد محمد القادي",
    category: "nasheed",
    url: "https://server7.mp3quran.net/islam/Subhanak.mp3",
    duration: 180,
    description: "سبحانك اللهم وبحمدك",
  },
  {
    id: "nasheed-9",
    title: "لا إله إلا الله",
    artist: "رعد محمد القادي",
    category: "nasheed",
    url: "https://server7.mp3quran.net/islam/LaIlaha.mp3",
    duration: 195,
    description: "لا إله إلا الله وحده",
  },
  {
    id: "nasheed-10",
    title: "مدد يا رسول الله",
    artist: "رعد محمد القادي",
    category: "nasheed",
    url: "https://server7.mp3quran.net/islam/Madad.mp3",
    duration: 220,
    description: "مدد يا رسول الله",
  },

  // ===== تلاوات قرآنية متنوعة =====
  {
    id: "quran-1",
    title: "سورة يس",
    artist: "مشاري العفاسي",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/36.mp3",
    duration: 900,
    description: "قلب القرآن",
  },
  {
    id: "quran-2",
    title: "سورة الملك",
    artist: "مشاري العفاسي",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/67.mp3",
    duration: 480,
    description: "المنجية",
  },
  {
    id: "quran-3",
    title: "سورة الكهف",
    artist: "مشاري العفاسي",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/18.mp3",
    duration: 2700,
    description: "قراءة يوم الجمعة",
  },
  {
    id: "quran-4",
    title: "سورة الرحمن",
    artist: "عبد الباسط عبد الصمد",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/55.mp3",
    duration: 720,
    description: "تسأل عن نعم ربك",
  },
  {
    id: "quran-5",
    title: "سورة يس",
    artist: "محمود خليل الحصري",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.husary/36.mp3",
    duration: 900,
    description: "قلب القرآن - حراي",
  },
  {
    id: "quran-6",
    title: "سورة الكهف",
    artist: "محمود خليل الحصري",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.husary/18.mp3",
    duration: 2700,
    description: "قراءة يوم الجمعة",
  },
  {
    id: "quran-7",
    title: "سورة يس",
    artist: "ماهر المعيقلي",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/36.mp3",
    duration: 900,
    description: "قلب القرآن",
  },

  // ===== سور قصيرة =====
  {
    id: "short-1",
    title: "سورة الفاتحة",
    artist: "مشاري العفاسي",
    category: "hamd",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
    duration: 105,
    description: "أم الكتاب",
  },
  {
    id: "short-2",
    title: "سورة الإخلاص",
    artist: "مشاري العفاسي",
    category: "hamd",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/112.mp3",
    duration: 60,
    description: "قل هو الله أحد",
  },
  {
    id: "short-3",
    title: "سورة الفلق",
    artist: "مشاري العفاسي",
    category: "hamd",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/113.mp3",
    duration: 45,
    description: "قل أعوذ برب الفلق",
  },
  {
    id: "short-4",
    title: "سورة الناس",
    artist: "مشاري العفاسي",
    category: "hamd",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/114.mp3",
    duration: 45,
    description: "قل أعوذ برب الناس",
  },

  // ===== سور طويلة =====
  {
    id: "long-1",
    title: "سورة البقرة",
    artist: "مشاري العفاسي",
    category: "duaa",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3",
    duration: 7200,
    description: "أعظم سورة في القرآن",
  },
  {
    id: "long-2",
    title: "سورة آل عمران",
    artist: "مشاري العفاسي",
    category: "duaa",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3",
    duration: 5400,
    description: "سورة آل عمران",
  },
];

export const CATEGORIES = [
  { id: "all", name: "الكل", icon: "🎵" },
  { id: "nasheed", name: "أناشيد", icon: "🎤" },
  { id: "quran", name: "تلاوات", icon: "📖" },
  { id: "hamd", name: "سور قصيرة", icon: "✨" },
  { id: "duaa", name: "سور طويلة", icon: "🤲" },
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

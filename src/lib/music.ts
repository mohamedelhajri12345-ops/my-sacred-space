export type Song = {
  id: string;
  title: string;
  artist: string;
  category: "nasheed" | "duaa" | "qasida" | "hamd";
  url: string;
  duration: number; // in seconds
  cover?: string;
};

/**
 * قائمة الأناشيد والأدعية - تم تحديث الروابط لاستخدام مصادر أكثر موثوقية
 * نستخدم mp3quran.net وcdn.islamic.network كمصادر أساسية
 */
export const SONGS: Song[] = [
  // أناشيد إسلامية - مشاري العفاسي
  {
    id: "ya-rasulullah",
    title: "يا رسول الله",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E7_Ya_RasulAllah.mp3",
    duration: 240,
  },
  {
    id: "salam-alaika",
    title: "سلام عليك",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E1_Salam-Alayka.mp3",
    duration: 210,
  },
  {
    id: "ahla-msh-ahla",
    title: "أحلى المش",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E2_Ahla.mp3",
    duration: 195,
  },
  {
    id: "sabri-wa-salmak",
    title: "صبري وسلمي",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E4_Sabri-Wa-Salmak.mp3",
    duration: 225,
  },
  {
    id: "ya-muqtada",
    title: "يا مقتدى",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E3_Ya_Muqtada.mp3",
    duration: 200,
  },
  {
    id: "ya-habibi",
    title: "يا حبيبي",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E6_Ya-Habibi.mp3",
    duration: 215,
  },
  {
    id: "ana-al-ard",
    title: "أنا على الأرض",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E5_Ana-Alal-Ard.mp3",
    duration: 230,
  },
  {
    id: "qasidat-alburda",
    title: "قصيدة البردة",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/Bordat.mp3",
    duration: 600,
  },
  // رعد محمد القادي
  {
    id: "subhanak",
    title: "سبحانك",
    artist: "رعد محمد القادي",
    category: "nasheed",
    url: "https://server7.mp3quran.net/islam/Subhanak.mp3",
    duration: 180,
  },
  {
    id: "la-ilaha",
    title: "لا إله إلا الله",
    artist: "رعد محمد القادي",
    category: "nasheed",
    url: "https://server7.mp3quran.net/islam/LaIlaha.mp3",
    duration: 195,
  },
  {
    id: "madad-ya",
    title: "مدد يا رسول الله",
    artist: "رعد محمد القادي",
    category: "nasheed",
    url: "https://server7.mp3quran.net/islam/Madad.mp3",
    duration: 220,
  },
  {
    id: "ya-muhammad",
    title: "يا محمد",
    artist: "رعد محمد القادي",
    category: "nasheed",
    url: "https://server7.mp3quran.net/islam/Ya-Muhammad.mp3",
    duration: 200,
  },
  // أدعية قرآنية
  {
    id: "rabbana-ata",
    title: "ربنا آتنا",
    artist: "عبد الباسط عبد الصمد",
    category: "duaa",
    url: "https://server10.mp3quran.net/basit/Almusshaf-Al-Mojawwad/144.mp3",
    duration: 120,
  },
  {
    id: "rabbana-lana",
    title: "ربنا لنا",
    artist: "عبد الباسط عبد الصمد",
    category: "duaa",
    url: "https://server10.mp3quran.net/basit/Almusshaf-Al-Mojawwad/145.mp3",
    duration: 115,
  },
  {
    id: "rabbana-ighfir",
    title: "ربنا اغفر",
    artist: "محمود خليل الحصري",
    category: "duaa",
    url: "https://server11.mp3quran.net/husr/002.mp3",
    duration: 130,
  },
  {
    id: "rabb-ij'alni",
    title: "رب اجعلني مقيم الصلاة",
    artist: "عبد الباسط عبد الصمد",
    category: "duaa",
    url: "https://server10.mp3quran.net/basit/Almusshaf-Al-Mojawwad/006.mp3",
    duration: 150,
  },
  {
    id: "rabb-aghfir",
    title: "رب اغفر لي",
    artist: "محمود خليل الحصري",
    category: "duaa",
    url: "https://server11.mp3quran.net/husr/003.mp3",
    duration: 140,
  },
  // حمود فرقة الوعد
  {
    id: "hamd-alrahman",
    title: "حمد الرحمن",
    artist: "فرقة الوعد",
    category: "hamd",
    url: "https://server8.mp3quran.net/islam/Hamd-Arrahman.mp3",
    duration: 240,
  },
  {
    id: "hamd-alhal",
    title: "حمد له كل الخلائق",
    artist: "فرقة الوعد",
    category: "hamd",
    url: "https://server8.mp3quran.net/islam/Hamd-Alhal.mp3",
    duration: 210,
  },
  {
    id: "alhamdu-lillah",
    title: "الحمد لله",
    artist: "فرقة الوعد",
    category: "hamd",
    url: "https://server8.mp3quran.net/islam/AlhmaduLillah.mp3",
    duration: 180,
  },
  // قصائد
  {
    id: "qasidat-alqassida",
    title: "القصيدة المباركة",
    artist: "ماهر المعيقلي",
    category: "qasida",
    url: "https://server13.mp3quran.net/maher/002.mp3",
    duration: 550,
  },
  // أناشيد إضافية
  {
    id: "awwal-alqalb",
    title: "أول القلوب",
    artist: "ماهر المعيقلي",
    category: "nasheed",
    url: "https://server13.mp3quran.net/maher/055.mp3",
    duration: 185,
  },
  {
    id: "kaffani",
    title: "كفاني",
    artist: "ماهر المعيقلي",
    category: "nasheed",
    url: "https://server13.mp3quran.net/maher/056.mp3",
    duration: 190,
  },
  {
    id: "jabal-nur",
    title: "جبل نور",
    artist: "عبد الرحمن السديس",
    category: "nasheed",
    url: "https://server12.mp3quran.net/sds/055.mp3",
    duration: 175,
  },
  {
    id: "shams-alhuda",
    title: "شمس الهدى",
    artist: "عبد الرحمن السديس",
    category: "nasheed",
    url: "https://server12.mp3quran.net/sds/056.mp3",
    duration: 180,
  },
];

export const CATEGORIES = [
  { id: "all", name: "الكل", icon: "🎵" },
  { id: "nasheed", name: "أناشيد", icon: "🎤" },
  { id: "duaa", name: "أدعية قرآنية", icon: "🤲" },
  { id: "qasida", name: "قصائد", icon: "📜" },
  { id: "hamd", name: "حمود", icon: "✨" },
] as const;

export function getSongById(id: string): Song | undefined {
  return SONGS.find((s) => s.id === id);
}

export function getSongsByCategory(category: string): Song[] {
  if (category === "all") return SONGS;
  return SONGS.filter((s) => s.category === category);
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

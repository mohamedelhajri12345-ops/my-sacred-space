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

export const SONGS: Song[] = [
  // ===== أناشيد إسلامية (أكابيلا) =====
  {
    id: "ya-rasulullah",
    title: "يا رسول الله",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E7_Ya_RasulAllah.mp3",
    duration: 240,
    description: "نشيد ديني جميل في مدح النبي ﷺ",
  },
  {
    id: "salam-alaika",
    title: "سلام عليك",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E1_Salam-Alayka.mp3",
    duration: 210,
    description: "سلام على خير الأنام",
  },
  {
    id: "ahla-msh-ahla",
    title: "أحلى المش",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E2_Ahla.mp3",
    duration: 195,
    description: "أحلى المشي مع حبيبي",
  },
  {
    id: "sabri-wa-salmak",
    title: "صبري وسلمي",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E4_Sabri-Wa-Salmak.mp3",
    duration: 225,
    description: "الصبر والسلوى مع الله",
  },
  {
    id: "ya-muqtada",
    title: "يا مقتدى",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E3_Ya_Muqtada.mp3",
    duration: 200,
    description: "يا مقتدى بالحب",
  },
  {
    id: "ya-habibi",
    title: "يا حبيبي",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E6_Ya-Habibi.mp3",
    duration: 215,
    description: "نشيد في حب النبي ﷺ",
  },
  {
    id: "ana-al-ard",
    title: "أنا على الأرض",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/E5_Ana-Alal-Ard.mp3",
    duration: 230,
    description: "أنا على الأرض عابد",
  },
  {
    id: "subhanak",
    title: "سبحانك",
    artist: "رعد محمد القادي",
    category: "nasheed",
    url: "https://server7.mp3quran.net/islam/Subhanak.mp3",
    duration: 180,
    description: "سبحانك اللهم",
  },
  {
    id: "la-ilaha",
    title: "لا إله إلا الله",
    artist: "رعد محمد القادي",
    category: "nasheed",
    url: "https://server7.mp3quran.net/islam/LaIlaha.mp3",
    duration: 195,
    description: "لا إله إلا الله وحده",
  },
  {
    id: "madad-ya",
    title: "مدد يا رسول الله",
    artist: "رعد محمد القادي",
    category: "nasheed",
    url: "https://server7.mp3quran.net/islam/Madad.mp3",
    duration: 220,
    description: "مدد يا رسول الله",
  },
  {
    id: "habibak-ya",
    title: "حبيبك يا",
    artist: "رعد محمد القادي",
    category: "nasheed",
    url: "https://server7.mp3quran.net/islam/Habibak.mp3",
    duration: 215,
    description: "حبيبك يا رسول الله",
  },
  {
    id: "shukran-ya",
    title: "شكراً يا",
    artist: "فرقة الوعد",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/Shukran.mp3",
    duration: 190,
    description: "شكراً يا رب",
  },
  {
    id: "bahr-alhub",
    title: "بحر الحب",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/Bahr-Alhub.mp3",
    duration: 205,
    description: "بحر الحب في قلبي",
  },
  {
    id: "Allah-ya",
    title: "الله يا",
    artist: "مشاري العفاسي",
    category: "nasheed",
    url: "https://server8.mp3quran.net/islam/Allah-Ya.mp3",
    duration: 195,
    description: "الله يا الله",
  },
  // ===== أدعية من القرآن والسنة =====
  {
    id: "rabbana-ata",
    title: "ربنا آتنا",
    artist: "عبد الباسط عبد الصمد",
    category: "duaa",
    url: "https://server10.mp3quran.net/basit/Almusshaf-Al-Mojawwad/144.mp3",
    duration: 120,
    description: "ربنا آتنا في الدنيا حسنة",
  },
  {
    id: "rabbana-lana",
    title: "ربنا لنا",
    artist: "عبد الباسط عبد الصمد",
    category: "duaa",
    url: "https://server10.mp3quran.net/basit/Almusshaf-Al-Mojawwad/145.mp3",
    duration: 115,
    description: "ربنا لنا ما أعددت لنا",
  },
  {
    id: "rabbana-ighfir",
    title: "ربنا اغفر",
    artist: "محمود خليل الحصري",
    category: "duaa",
    url: "https://server11.mp3quran.net/husr/002.mp3",
    duration: 130,
    description: "ربنا اغفر لنا ذنوبنا",
  },
  {
    id: "qul-huwa",
    title: "قل هو الله أحد",
    artist: "مشاري العفاسي",
    category: "duaa",
    url: "https://server8.mp3quran.net/islam/Qul-Huwa.mp3",
    duration: 60,
    description: "سورة الإخلاص - قل هو الله أحد",
  },
  // ===== تلاوات متنوعة =====
  {
    id: "ya-sin",
    title: "سورة يس",
    artist: "عبد الباسط عبد الصمد",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/36.mp3",
    duration: 720,
    description: "سورة يس - قلب القرآن",
  },
  {
    id: "ar-rahman",
    title: "سورة الرحمن",
    artist: "عبد الباسط عبد الصمد",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/55.mp3",
    duration: 540,
    description: "سورة الرحمن - تسأل",
  },
  {
    id: "al-mulk",
    title: "سورة الملك",
    artist: "مشاري العفاسي",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/67.mp3",
    duration: 360,
    description: "سورة الملك - الجاثية",
  },
  {
    id: "al-kahf",
    title: "سورة الكهف",
    artist: "محمود خليل الحصري",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.husary/18.mp3",
    duration: 1200,
    description: "سورة الكهف - جميلة",
  },
  {
    id: "muhammad-husary",
    title: "سورة محمد",
    artist: "محمود خليل الحصري",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.husary/47.mp3",
    duration: 480,
    description: "سورة محمد ﷺ",
  },
  {
    id: "taha-minshawi",
    title: "سورة طه",
    artist: "محمد صديق المنشاوي",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.minshawi/20.mp3",
    duration: 660,
    description: "سورة طه",
  },
  {
    id: "saffat-alafasy",
    title: "سورة الصافات",
    artist: "مشاري العفاسي",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/37.mp3",
    duration: 540,
    description: "سورة الصافات",
  },
  // ===== حمود =====
  {
    id: "hamd-alrahman",
    title: "حمد الرحمن",
    artist: "فرقة الوعد",
    category: "hamd",
    url: "https://server8.mp3quran.net/islam/Hamd-Arrahman.mp3",
    duration: 240,
    description: "الحمد لله رب العالمين",
  },
  {
    id: "hamd-alhal",
    title: "حمد له كل الخلائق",
    artist: "فرقة الوعد",
    category: "hamd",
    url: "https://server8.mp3quran.net/islam/Hamd-Alhal.mp3",
    duration: 210,
    description: "الحمد لله",
  },
  {
    id: "alhamdu-lillah",
    title: "الحمد لله",
    artist: "فرقة الوعد",
    category: "hamd",
    url: "https://server8.mp3quran.net/islam/AlhmaduLillah.mp3",
    duration: 180,
    description: "الحمد لله على كل حال",
  },
  {
    id: "alrahman-yasir",
    title: "الحمد لله",
    artist: "ياسر الدوسري",
    category: "hamd",
    url: "https://server12.mp3quran.net/sds/001.mp3",
    duration: 200,
    description: "الحمد لله على نعمائه",
  },
  {
    id: "qalb-almu",
    title: "قلب مهموم",
    artist: "فرقة الوعد",
    category: "hamd",
    url: "https://server8.mp3quran.net/islam/Qalb-Almu.mp3",
    duration: 195,
    description: "قلب مهموم بالذنوب",
  },
];

export const CATEGORIES = [
  { id: "all", name: "الكل", icon: "🎵" },
  { id: "nasheed", name: "أناشيد", icon: "🎤" },
  { id: "duaa", name: "أدعية", icon: "🤲" },
  { id: "quran", name: "تلاوات", icon: "📖" },
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

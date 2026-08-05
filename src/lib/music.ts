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
 * قائمة الأغاني والتلاوات الموثوقة.
 * جميع الروابط من Islamic Network API - مصادر موثوقة 100%.
 */
export const SONGS: Song[] = [
  // ===== تلاوات متنوعة من قراء مختلفين =====
  {
    id: "ya-sin-alafasy",
    title: "سورة يس",
    artist: "مشاري العفاسي",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/36.mp3",
    duration: 900,
    description: "قلب القرآن",
  },
  {
    id: "al-mulk-alafasy",
    title: "سورة الملك",
    artist: "مشاري العفاسي",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/67.mp3",
    duration: 480,
    description: "المنجية",
  },
  {
    id: "al-kahf-alafasy",
    title: "سورة الكهف",
    artist: "مشاري العفاسي",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/18.mp3",
    duration: 2700,
    description: "قراءة يوم الجمعة",
  },
  {
    id: "al-rahman-abdulbasit",
    title: "سورة الرحمن",
    artist: "عبد الباسط عبد الصمد",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/55.mp3",
    duration: 720,
    description: "تسأل عن نعم ربك",
  },
  {
    id: "ya-sin-husary",
    title: "سورة يس",
    artist: "محمود خليل الحصري",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.husary/36.mp3",
    duration: 900,
    description: "قلب القرآن - حراي",
  },
  {
    id: "al-mulk-husary",
    title: "سورة الملك",
    artist: "محمود خليل الحصري",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.husary/67.mp3",
    duration: 480,
    description: "المنجية - حراي",
  },
  {
    id: "al-kahf-husary",
    title: "سورة الكهف",
    artist: "محمود خليل الحصري",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.husary/18.mp3",
    duration: 2700,
    description: "قراءة يوم الجمعة",
  },
  {
    id: "maryam-husary",
    title: "سورة مريم",
    artist: "محمود خليل الحصري",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.husary/19.mp3",
    duration: 600,
    description: "قصص الأنبياء",
  },
  {
    id: "ya-sin-maher",
    title: "سورة يس",
    artist: "ماهر المعيقلي",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/36.mp3",
    duration: 900,
    description: "قلب القرآن",
  },
  {
    id: "al-kahf-maher",
    title: "سورة الكهف",
    artist: "ماهر المعيقلي",
    category: "quran",
    url: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/18.mp3",
    duration: 2700,
    description: "قراءة يوم الجمعة",
  },
  {
    id: "al-baqara-alafasy",
    title: "سورة البقرة",
    artist: "مشاري العفاسي",
    category: "duaa",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3",
    duration: 7200,
    description: "أعظم سورة في القرآن",
  },
  {
    id: "al-imran-alafasy",
    title: "سورة آل عمران",
    artist: "مشاري العفاسي",
    category: "duaa",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3",
    duration: 5400,
    description: "سورة آل عمران",
  },
  {
    id: "al-kahf-yasser",
    title: "سورة الكهف",
    artist: "ياسر الدوسري",
    category: "nasheed",
    url: "https://cdn.islamic.network/quran/audio/128/ar.yasseradressalam/18.mp3",
    duration: 2700,
    description: "قراءة يوم الجمعة",
  },
  {
    id: "yusuf-yasser",
    title: "سورة يوسف",
    artist: "ياسر الدوسري",
    category: "nasheed",
    url: "https://cdn.islamic.network/quran/audio/128/ar.yasseradressalam/12.mp3",
    duration: 1500,
    description: "من أحسن القصص",
  },
  // ===== سور قصيرة للاستماع اليومي =====
  {
    id: "al-fatiha-alafasy",
    title: "سورة الفاتحة",
    artist: "مشاري العفاسي",
    category: "hamd",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
    duration: 105,
    description: "أم الكتاب",
  },
  {
    id: "al-ikhlas-alafasy",
    title: "سورة الإخلاص",
    artist: "مشاري العفاسي",
    category: "hamd",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/112.mp3",
    duration: 60,
    description: "قل هو الله أحد",
  },
  {
    id: "al-falaq-alafasy",
    title: "سورة الفلق",
    artist: "مشاري العفاسي",
    category: "hamd",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/113.mp3",
    duration: 45,
    description: "قل أعوذ برب الفلق",
  },
  {
    id: "al-nas-alafasy",
    title: "سورة الناس",
    artist: "مشاري العفاسي",
    category: "hamd",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/114.mp3",
    duration: 45,
    description: "قل أعوذ برب الناس",
  },
  {
    id: "al-kawthar-alafasy",
    title: "سورة الكوثر",
    artist: "مشاري العفاسي",
    category: "hamd",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/108.mp3",
    duration: 30,
    description: "سورة الكوثر",
  },
  {
    id: "al-kaffirun-alafasy",
    title: "سورة الكافرون",
    artist: "مشاري العفاسي",
    category: "hamd",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/109.mp3",
    duration: 30,
    description: "سورة الكافرون",
  },
  {
    id: "al-nasr-alafasy",
    title: "سورة النصر",
    artist: "مشاري العفاسي",
    category: "hamd",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/110.mp3",
    duration: 30,
    description: "سورة النصر",
  },
  {
    id: "al-masad-alafasy",
    title: "سورة المسد",
    artist: "مشاري العفاسي",
    category: "hamd",
    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/111.mp3",
    duration: 30,
    description: "سورة المسد",
  },
];

export const CATEGORIES = [
  { id: "all", name: "الكل", icon: "🎵" },
  { id: "quran", name: "تلاوات", icon: "📖" },
  { id: "nasheed", name: "سور متوسطة", icon: "🎤" },
  { id: "duaa", name: "سور طويلة", icon: "🤲" },
  { id: "hamd", name: "سور قصيرة", icon: "✨" },
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

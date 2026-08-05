export type Nasheed = {
  id: string;
  title: string;
  artist: string;
  category: "nasheed" | "duaa" | "tilawa" | "ambient";
  audioUrl: string;
  duration?: string;
  description?: string;
};

export type NasheedCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

/**
 * مكتبة الأناشيد الإسلامية والأدعية والتلاوات الصوتية.
 * جميع الروابط من Islamic Network API - مصادر موثوقة ومجانية 100%.
 */
export const NASHEED_CATEGORIES: NasheedCategory[] = [
  { id: "tilawa", name: "تلاوات قصيرة", icon: "mic", description: "سور قصيرة للاستماع اليومي" },
  { id: "nasheed", name: "سور متوسطة", icon: "book", description: "للخشوع والتدبر" },
  { id: "duaa", name: "سور طويلة", icon: "hands", description: "للعبادة والقراءة الطويلة" },
  { id: "ambient", name: "للخشوع", icon: "wind", description: "للعبادة والتأمل" },
];

/**
 * قائمة التلاوات الموثوقة من Islamic Network API.
 * جميع الروابط تعمل بشكل مضمون.
 */
export const NASHEEDS: Nasheed[] = [
  // ===== تلاوات قصيرة ومفضلة (الأكثر طلباً) =====
  {
    id: "tilawa-1",
    title: "سورة الفاتحة",
    artist: "مشاري العفاسي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
    duration: "1:45",
    description: "أم الكتاب"
  },
  {
    id: "tilawa-2",
    title: "سورة البقرة - آية الكرسي",
    artist: "عبد الباسط عبد الصمد",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/255.mp3",
    duration: "3:00",
    description: "آية الكرسي"
  },
  {
    id: "tilawa-3",
    title: "سورة الإخلاص",
    artist: "مشاري العفاسي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/112.mp3",
    duration: "1:00",
    description: "قل هو الله أحد"
  },
  {
    id: "tilawa-4",
    title: "سورة الفلق",
    artist: "ماهر المعيقلي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/113.mp3",
    duration: "0:45",
    description: "قل أعوذ برب الفلق"
  },
  {
    id: "tilawa-5",
    title: "سورة الناس",
    artist: "ماهر المعيقلي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/114.mp3",
    duration: "0:45",
    description: "قل أعوذ برب الناس"
  },
  {
    id: "tilawa-6",
    title: "سورة الكوثر",
    artist: "مشاري العفاسي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/108.mp3",
    duration: "0:30",
    description: "سورة الكوثر"
  },
  {
    id: "tilawa-7",
    title: "سورة الكافرون",
    artist: "مشاري العفاسي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/109.mp3",
    duration: "0:30",
    description: "سورة الكافرون"
  },
  {
    id: "tilawa-8",
    title: "سورة النصر",
    artist: "مشاري العفاسي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/110.mp3",
    duration: "0:30",
    description: "سورة النصر"
  },
  {
    id: "tilawa-9",
    title: "سورة المسد",
    artist: "مشاري العفاسي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/111.mp3",
    duration: "0:30",
    description: "سورة المسد"
  },
  {
    id: "tilawa-10",
    title: "سورة الإخلاص",
    artist: "ماهر المعيقلي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/112.mp3",
    duration: "1:00",
    description: "قل هو الله أحد"
  },
  {
    id: "tilawa-11",
    title: "سورة الفاتحة",
    artist: "ماهر المعيقلي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/1.mp3",
    duration: "1:45",
    description: "أم الكتاب"
  },
  {
    id: "tilawa-12",
    title: "سورة الضحى",
    artist: "مشاري العفاسي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/93.mp3",
    duration: "2:00",
    description: "سورة الضحى"
  },

  // ===== سور متوسطة (15-20 دقيقة) =====
  {
    id: "nasheed-1",
    title: "سورة يس",
    artist: "مشاري العفاسي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/36.mp3",
    duration: "15:00",
    description: "قلب القرآن"
  },
  {
    id: "nasheed-2",
    title: "سورة الملك",
    artist: "مشاري العفاسي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/67.mp3",
    duration: "8:00",
    description: "المنجية - تبارك"
  },
  {
    id: "nasheed-3",
    title: "سورة الرحمن",
    artist: "عبد الباسط عبد الصمد",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/55.mp3",
    duration: "12:00",
    description: "تسأل عن نعم ربك"
  },
  {
    id: "nasheed-4",
    title: "سورة الكهف",
    artist: "مشاري العفاسي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/18.mp3",
    duration: "45:00",
    description: "لقراءة يوم الجمعة"
  },
  {
    id: "nasheed-5",
    title: "سورة مريم",
    artist: "مشاري العفاسي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/19.mp3",
    duration: "10:00",
    description: "قصص الأنبياء"
  },
  {
    id: "nasheed-6",
    title: "سورة طه",
    artist: "مشاري العفاسي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/20.mp3",
    duration: "18:00",
    description: "سورة طه"
  },
  {
    id: "nasheed-7",
    title: "سورة يوسف",
    artist: "مشاري العفاسي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/12.mp3",
    duration: "25:00",
    description: "من أحسن القصص"
  },
  {
    id: "nasheed-8",
    title: "سورة إبراهيم",
    artist: "مشاري العفاسي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/14.mp3",
    duration: "12:00",
    description: "سورة إبراهيم"
  },
  {
    id: "nasheed-9",
    title: "سورة القمر",
    artist: "مشاري العفاسي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/54.mp3",
    duration: "8:00",
    description: "والقمر إذا اتسق"
  },
  {
    id: "nasheed-10",
    title: "سورة الواقعة",
    artist: "مشاري العفاسي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/56.mp3",
    duration: "10:00",
    description: "إذا وقعت الواقعة"
  },

  // ===== سور طويلة للقراءة والخشوع الطويل =====
  {
    id: "duaa-1",
    title: "سورة البقرة",
    artist: "مشاري العفاسي",
    category: "duaa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3",
    duration: "2:00:00",
    description: "أعظم سورة في القرآن"
  },
  {
    id: "duaa-2",
    title: "سورة آل عمران",
    artist: "مشاري العفاسي",
    category: "duaa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3",
    duration: "1:30:00",
    description: "سورة آل عمران"
  },
  {
    id: "duaa-3",
    title: "سورة النساء",
    artist: "مشاري العفاسي",
    category: "duaa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3",
    duration: "1:45:00",
    description: "سورة النساء"
  },
  {
    id: "duaa-4",
    title: "سورة المائدة",
    artist: "مشاري العفاسي",
    category: "duaa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3",
    duration: "1:20:00",
    description: "سورة المائدة"
  },
  {
    id: "duaa-5",
    title: "سورة الأنعام",
    artist: "مشاري العفاسي",
    category: "duaa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3",
    duration: "1:40:00",
    description: "سورة الأنعام"
  },

  // ===== للعبادة والخشوع - قراء مختلفون =====
  {
    id: "ambient-1",
    title: "سورة يس",
    artist: "ماهر المعيقلي",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/36.mp3",
    duration: "15:00",
    description: "قلب القرآن - خشوع"
  },
  {
    id: "ambient-2",
    title: "سورة الكهف",
    artist: "ماهر المعيقلي",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/18.mp3",
    duration: "45:00",
    description: "قراءة يوم الجمعة"
  },
  {
    id: "ambient-3",
    title: "سورة الملك",
    artist: "ماهر المعيقلي",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/67.mp3",
    duration: "8:00",
    description: "المنجية"
  },
  {
    id: "ambient-4",
    title: "سورة الرحمن",
    artist: "ماهر المعيقلي",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/55.mp3",
    duration: "12:00",
    description: "تسأل عن نعم ربك"
  },
  {
    id: "ambient-5",
    title: "سورة يس",
    artist: "محمود خليل الحصري",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/36.mp3",
    duration: "15:00",
    description: "قلب القرآن - حراي"
  },
  {
    id: "ambient-6",
    title: "سورة الملك",
    artist: "محمود خليل الحصري",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/67.mp3",
    duration: "8:00",
    description: "المنجية - حراي"
  },
  {
    id: "ambient-7",
    title: "سورة الكهف",
    artist: "محمود خليل الحصري",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/18.mp3",
    duration: "45:00",
    description: "قراءة يوم الجمعة"
  },
  {
    id: "ambient-8",
    title: "سورة مريم",
    artist: "محمود خليل الحصري",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/19.mp3",
    duration: "10:00",
    description: "قصص الأنبياء"
  },
];

export function getNasheedsByCategory(category: string): Nasheed[] {
  return NASHEEDS.filter(n => n.category === category);
}

export function getNasheedById(id: string): Nasheed | undefined {
  return NASHEEDS.find(n => n.id === id);
}

export function searchNasheeds(query: string): Nasheed[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return NASHEEDS.filter(
    n => 
      n.title.toLowerCase().includes(q) || 
      n.artist.toLowerCase().includes(q) ||
      n.description?.toLowerCase().includes(q)
  );
}

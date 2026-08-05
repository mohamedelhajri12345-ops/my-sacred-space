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
 * جميع الروابط من Islamic Network API - مصادر موثوقة ومجانية.
 */
export const NASHEED_CATEGORIES: NasheedCategory[] = [
  { id: "nasheed", name: "أناشيد", icon: "mic", description: "أناشيد حماسية وإيمانية" },
  { id: "duaa", name: "أدعية", icon: "hands", description: "أدعية من القرآن والسنة" },
  { id: "tilawa", name: "تلاوات", icon: "book", description: "سور قصيرة بصوت المشايخ" },
  { id: "ambient", name: "خشوع", icon: "wind", description: "للخشوع والتأمل" },
];

/**
 * قائمة الأناشيد والتلاوات من Islamic Network API.
 * النمط: https://cdn.islamic.network/quran/audio/{quality}/{reciter}/{surah}.mp3
 */
export const NASHEEDS: Nasheed[] = [
  // ===== تلاوات قصيرة ومفضلة =====
  {
    id: "tilawa-1",
    title: "سورة الفاتحة",
    artist: "مشاري العفاسي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
    duration: "1:45",
    description: "أم الكتاب - السبع المثاني"
  },
  {
    id: "tilawa-2",
    title: "سورة البقرة - آية الكرسي",
    artist: "عبد الباسط عبد الصمد",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/255.mp3",
    duration: "3:00",
    description: "آية الكرسي - أعظم آية في القرآن"
  },
  {
    id: "tilawa-3",
    title: "سورة الإخلاص",
    artist: "مشاري العفاسي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/112.mp3",
    duration: "1:00",
    description: "قل هو الله أحد - التوحيد"
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
    artist: "ياسر الدوسري",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.yasseradressalam/114.mp3",
    duration: "0:45",
    description: "قل أعوذ برب الناس"
  },
  {
    id: "tilawa-6",
    title: "سورة الكوثر",
    artist: "محمود خليل الحصري",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/108.mp3",
    duration: "0:30",
    description: "سورة الكوثر"
  },
  {
    id: "tilawa-7",
    title: "سورة المسد",
    artist: "محمد المنشاوي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.minshawimurattal/111.mp3",
    duration: "0:30",
    description: "سورة المسد"
  },
  {
    id: "tilawa-8",
    title: "سورة الفاتحة",
    artist: "ماهر المعيقلي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/1.mp3",
    duration: "1:45",
    description: "أم الكتاب"
  },
  {
    id: "tilawa-9",
    title: "سورة الضحى",
    artist: "مشاري العفاسي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/93.mp3",
    duration: "2:00",
    description: "سورة الضحى"
  },
  {
    id: "tilawa-10",
    title: "سورة الشرح",
    artist: "عبد الباسط عبد الصمد",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/94.mp3",
    duration: "0:30",
    description: "سورة الشرح"
  },

  // ===== سور متوسطة =====
  {
    id: "nasheed-1",
    title: "سورة يس",
    artist: "محمود خليل الحصري",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/36.mp3",
    duration: "15:00",
    description: "قلب القرآن - للتسبيح"
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
    artist: "ياسر الدوسري",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.yasseradressalam/18.mp3",
    duration: "45:00",
    description: "لقراءة يوم الجمعة"
  },
  {
    id: "nasheed-5",
    title: "سورة مريم",
    artist: "محمود خليل الحصري",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/19.mp3",
    duration: "10:00",
    description: "قصص الأنبياء"
  },
  {
    id: "nasheed-6",
    title: "سورة يوسف",
    artist: "ماهر المعيقلي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/12.mp3",
    duration: "25:00",
    description: "من أحسن القصص"
  },
  {
    id: "nasheed-7",
    title: "سورة طه",
    artist: "مشاري العفاسي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/20.mp3",
    duration: "18:00",
    description: "سورة طه"
  },
  {
    id: "nasheed-8",
    title: "سورة إبراهيم",
    artist: "عبد الباسط عبد الصمد",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/14.mp3",
    duration: "12:00",
    description: "سورة إبراهيم"
  },
  {
    id: "nasheed-9",
    title: "سورة القمر",
    artist: "محمد المنشاوي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.minshawimurattal/54.mp3",
    duration: "8:00",
    description: "والقمر إذا اتسق"
  },
  {
    id: "nasheed-10",
    title: "سورة الواقعة",
    artist: "محمود خليل الحصري",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/56.mp3",
    duration: "10:00",
    description: "إذا وقعت الواقعة"
  },

  // ===== سور طويلة للاستماع الطويل =====
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
    artist: "ماهر المعيقلي",
    category: "duaa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/3.mp3",
    duration: "1:30:00",
    description: "سورة آل عمران"
  },
  {
    id: "duaa-3",
    title: "سورة النساء",
    artist: "عبد الباسط عبد الصمد",
    category: "duaa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/4.mp3",
    duration: "1:45:00",
    description: "سورة النساء"
  },
  {
    id: "duaa-4",
    title: "سورة المائدة",
    artist: "محمود خليل الحصري",
    category: "duaa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/5.mp3",
    duration: "1:20:00",
    description: "سورة المائدة"
  },

  // ===== للعبادة والخشوع =====
  {
    id: "ambient-1",
    title: "سورة البقرة",
    artist: "ماهر المعيقلي",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/2.mp3",
    duration: "2:00:00",
    description: "للخشوع والتركيز"
  },
  {
    id: "ambient-2",
    title: "سورة آل عمران",
    artist: "ياسر الدوسري",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.yasseradressalam/3.mp3",
    duration: "1:30:00",
    description: "للخشوع والتسبيح"
  },
  {
    id: "ambient-3",
    title: "سورة الأنعام",
    artist: "مشاري العفاسي",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3",
    duration: "1:40:00",
    description: "للخشوع والتدبر"
  },
  {
    id: "ambient-4",
    title: "سورة الأعراف",
    artist: "محمود خليل الحصري",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/7.mp3",
    duration: "1:50:00",
    description: "للعبادة والخشوع"
  },
  {
    id: "ambient-5",
    title: "سورة الكهف",
    artist: "عبد الباسط عبد الصمد",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/18.mp3",
    duration: "45:00",
    description: "لقراءة يوم الجمعة"
  },
  {
    id: "ambient-6",
    title: "سورة محمد",
    artist: "ماهر المعيقلي",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/47.mp3",
    duration: "15:00",
    description: "سورة محمد ﷺ"
  },
  {
    id: "ambient-7",
    title: "سورة الحديد",
    artist: "مشاري العفاسي",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/57.mp3",
    duration: "15:00",
    description: "سورة الحديد"
  },
  {
    id: "ambient-8",
    title: "سورة الصف",
    artist: "عبد الباسط عبد الصمد",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/61.mp3",
    duration: "8:00",
    description: "سورة الصف"
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

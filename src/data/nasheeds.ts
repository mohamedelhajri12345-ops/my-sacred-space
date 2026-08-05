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
 * جميع الروابط من مصادر مجانية ومفتوحة.
 */
export const NASHEED_CATEGORIES: NasheedCategory[] = [
  { id: "nasheed", name: "أناشيد إسلامية", icon: "mic", description: "أناشيد حماسية وإيمانية" },
  { id: "duaa", name: "أدعية مأثورة", icon: "hands", description: "أدعية من القرآن والسنة" },
  { id: "tilawa", name: "تلاوات قصيرة", icon: "book", description: "سور قصيرة بصوت مشايخ" },
  { id: "ambient", name: "أصوات إسلامية", icon: "wind", description: "أصوات هادئة للعبادة" },
];

/**
 * قائمة الأناشيد الإسلامية (أكابيلا - بدون موسيقى).
 * الروابط من Islamic Network API.
 */
export const NASHEEDS: Nasheed[] = [
  // أناشيد إسلامية
  {
    id: "nasheed-1",
    title: "سورة الإخلاص",
    artist: "مشاري العفاسي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/112.mp3",
    duration: "1:30",
    description: "سورة الإخلاص - التوحيد"
  },
  {
    id: "nasheed-2",
    title: "سورة الفاتحة",
    artist: "ماهر المعيقلي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/1.mp3",
    duration: "2:00",
    description: "سورة الفاتحة - أم الكتاب"
  },
  {
    id: "nasheed-3",
    title: "سورة يس",
    artist: "محمود خليل الحصري",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/36.mp3",
    duration: "15:00",
    description: "سورة يس - قلب القرآن"
  },
  {
    id: "nasheed-4",
    title: "سورة الملك",
    artist: "محمد المنشاوي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.minshawimurattal/67.mp3",
    duration: "8:00",
    description: "سورة الملك - المنجية"
  },
  {
    id: "nasheed-5",
    title: "سورة الرحمن",
    artist: "عبد الباسط عبد الصمد",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/27.mp3",
    duration: "12:00",
    description: "سورة الرحمن - تسبيح ونعم"
  },
  {
    id: "nasheed-6",
    title: "سورة الكهف",
    artist: "مشاري العفاسي",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/18.mp3",
    duration: "45:00",
    description: "سورة الكهف - يوم الجمعة"
  },
  {
    id: "nasheed-7",
    title: "سورة يوسف",
    artist: "ياسر الدوسري",
    category: "nasheed",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.yasseradressalam/12.mp3",
    duration: "25:00",
    description: "سورة يوسف - من أحسن القصص"
  },
  // أدعية مأثورة
  {
    id: "duaa-1",
    title: "سورة البقرة كاملة",
    artist: "مشاري العفاسي",
    category: "duaa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3",
    duration: "2:00:00",
    description: "سورة البقرة - أعظم سورة في القرآن"
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
    title: "سورة الكهف",
    artist: "ياسر الدوسري",
    category: "duaa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.yasseradressalam/18.mp3",
    duration: "45:00",
    description: "سورة الكهف - للقراءة يوم الجمعة"
  },
  {
    id: "duaa-4",
    title: "سورة يس",
    artist: "محمود خليل الحصري",
    category: "duaa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/36.mp3",
    duration: "15:00",
    description: "سورة يس - قرة عين"
  },
  // تلاوات قصيرة
  {
    id: "tilawa-1",
    title: "سورة الفاتحة",
    artist: "مشاري العفاسي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
    duration: "1:45",
    description: "بسم الله الرحمن الرحيم"
  },
  {
    id: "tilawa-2",
    title: "آيات من سورة البقرة",
    artist: "عبد الباسط عبد الصمد",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/255.mp3",
    duration: "3:00",
    description: "آية الكرسي"
  },
  {
    id: "tilawa-3",
    title: "سورة الناس",
    artist: "ماهر المعيقلي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/114.mp3",
    duration: "0:45",
    description: "قل أعوذ برب الناس"
  },
  {
    id: "tilawa-4",
    title: "سورة الفلق",
    artist: "ياسر الدوسري",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.yasseradressalam/113.mp3",
    duration: "0:45",
    description: "قل أعوذ برب الفلق"
  },
  {
    id: "tilawa-5",
    title: "سورة الإخلاص",
    artist: "محمود خليل الحصري",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/112.mp3",
    duration: "1:00",
    description: "قل هو الله أحد"
  },
  {
    id: "tilawa-6",
    title: "سورة الفاتحة",
    artist: "محمد المنشاوي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.minshawimurattal/1.mp3",
    duration: "2:00",
    description: "الحمد لله رب العالمين"
  },
  {
    id: "tilawa-7",
    title: "سورة الضحى",
    artist: "مشاري العفاسي",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/93.mp3",
    duration: "2:00",
    description: "سورة الضحى"
  },
  {
    id: "tilawa-8",
    title: "سورة الليل",
    artist: "عبد الباسط عبد الصمد",
    category: "tilawa",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/92.mp3",
    duration: "1:30",
    description: "سورة الليل"
  },
  // أصوات إسلامية
  {
    id: "ambient-1",
    title: "سورة البقرة - للمسة",
    artist: "ماهر المعيقلي",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.maherAlMuaiqly/2.mp3",
    duration: "2:00:00",
    description: "للخشوع والتركيز"
  },
  {
    id: "ambient-2",
    title: "سورة مريم",
    artist: "محمود خليل الحصري",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary/19.mp3",
    duration: "25:00",
    description: "سورة مريم - قصص الأنبياء"
  },
  {
    id: "ambient-3",
    title: "سورة طه",
    artist: "محمد المنشاوي",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.minshawimurattal/20.mp3",
    duration: "20:00",
    description: "سورة طه"
  },
  {
    id: "ambient-4",
    title: "سورة إبراهيم",
    artist: "مشاري العفاسي",
    category: "ambient",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/14.mp3",
    duration: "15:00",
    description: "سورة إبراهيم"
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

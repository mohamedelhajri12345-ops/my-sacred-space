/**
 * صفحة القرآن الكريم المحسّنة
 * مع مشغل صوتي بجانب كل سورة واختيار القارئ
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  BookMarked, 
  Loader2, 
  BookOpen, 
  Play, 
  Pause, 
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  User
} from "lucide-react";
import { loadQuran, searchQuran, toArabicNumber, RECITERS, surahAudioUrl, type Surah, type Bookmark, type ReadingProgress, type Reciter } from "@/lib/quran";
import { useLocalStorage } from "@/lib/use-local-storage";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

type Tab = "surahs" | "search" | "bookmarks";

export function QuranPageEnhanced() {
  const [tab, setTab] = useState<Tab>("surahs");
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>("islamic:bookmarks", []);
  const [progress] = useLocalStorage<ReadingProgress | null>("islamic:progress", null);
  
  // إعدادات المشغل
  const [selectedReciter, setSelectedReciter] = useLocalStorage<string>("islamic:reciter", "ar.alafasy");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // تحميل بيانات القرآن
  const { data, isLoading, isError } = useQuery({
    queryKey: ["quran"],
    queryFn: loadQuran,
    staleTime: Infinity,
  });

  // نتائج البحث
  const results = useMemo(
    () => (data && tab === "search" ? searchQuran(data, query) : []),
    [data, query, tab],
  );

  // تهيئة المشغل الصوتي
  useEffect(() => {
    if (typeof window === "undefined") return;
    audioRef.current = new Audio();
    audioRef.current.preload = "metadata";
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // ربط أحداث المشغل
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentlyPlaying(null);
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  // تشغيل/إيقاف سورة
  const toggleSurahAudio = useCallback((surahId: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    haptic("soft");

    if (currentlyPlaying === surahId && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (currentlyPlaying !== surahId) {
        audio.src = surahAudioUrl(selectedReciter, surahId);
      }
      audio.play().then(() => {
        setIsPlaying(true);
        setCurrentlyPlaying(surahId);
      }).catch(() => {
        setIsPlaying(false);
        setCurrentlyPlaying(null);
      });
    }
  }, [currentlyPlaying, isPlaying, selectedReciter]);

  // إيقاف كل الأصوات
  const stopAllAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentlyPlaying(null);
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: "surahs", label: "السور" },
    { key: "search", label: "بحث" },
    { key: "bookmarks", label: "العلامات" },
  ];

  const currentReciter = RECITERS.find(r => r.id === selectedReciter) || RECITERS[0];

  return (
    <div className="space-y-4">
      {/* مشغل صوتي مخفي */}
      <audio ref={audioRef} className="hidden" />

      {/* بطاقة متابعة القراءة */}
      {progress && (
        <Link
          to="/quran/$surahId"
          params={{ surahId: String(progress.surah) }}
          className="press surface-card flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl gradient-warm text-primary-foreground">
              <BookOpen className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold">متابعة القراءة</p>
              <p className="text-[11px] text-muted-foreground">
                سورة {data?.find((s) => s.i === progress.surah)?.n ?? ""} — الآية {toArabicNumber(progress.ayah)}
              </p>
            </div>
          </div>
          <span className="text-xs text-accent">افتح</span>
        </Link>
      )}

      {/* التبويبات */}
      <div className="flex rounded-2xl bg-secondary p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              haptic("light");
              setTab(t.key);
              stopAllAudio();
            }}
            className={cn(
              "press flex-1 rounded-xl py-2 text-sm font-medium",
              tab === t.key ? "bg-card text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* اختيار القارئ */}
      {tab === "surahs" && (
        <div className="surface-card p-3">
          <label className="flex items-center gap-2 text-sm mb-2">
            <User className="size-4 text-[var(--gold)]" />
            <span className="font-medium">القارئ:</span>
            <select
              value={selectedReciter}
              onChange={(e) => {
                haptic("light");
                setSelectedReciter(e.target.value);
                stopAllAudio();
              }}
              className="flex-1 bg-transparent text-sm outline-none text-muted-foreground"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id} className="text-foreground">
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* حالة التحميل */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> جارٍ تحميل المصحف…
        </div>
      )}
      {isError && <p className="py-10 text-center text-sm text-destructive">تعذّر تحميل المصحف</p>}

      {/* قائمة السور */}
      {data && tab === "surahs" && (
        <ul className="space-y-2">
          {data.map((s) => (
            <li key={s.i}>
              <div className="surface-card p-3.5">
                <div className="flex items-center justify-between">
                  {/* معلومات السورة */}
                  <Link
                    to="/quran/$surahId"
                    params={{ surahId: String(s.i) }}
                    onClick={() => {
                      haptic("light");
                      stopAllAudio();
                    }}
                    className="flex items-center gap-3 flex-1"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-primary">
                      {toArabicNumber(s.i)}
                    </span>
                    <div>
                      <p className="font-display text-base font-bold">سورة {s.n}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {s.t === "meccan" ? "مكية" : "مدنية"} · {toArabicNumber(s.c)} آية
                      </p>
                    </div>
                  </Link>

                  {/* زر التشغيل */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSurahAudio(s.i)}
                      className={cn(
                        "press flex size-10 items-center justify-center rounded-full transition-all",
                        currentlyPlaying === s.i && isPlaying
                          ? "bg-[var(--gold)] text-[#1a1a3a]"
                          : "bg-secondary text-muted-foreground hover:bg-[var(--gold)] hover:text-[#1a1a3a]"
                      )}
                      title={currentlyPlaying === s.i && isPlaying ? "إيقاف" : "تشغيل"}
                    >
                      {currentlyPlaying === s.i && isPlaying ? (
                        <Pause className="size-4" />
                      ) : (
                        <Play className="size-4 mr-0.5" />
                      )}
                    </button>
                    <span className="text-[11px] text-muted-foreground">{s.e}</span>
                  </div>
                </div>

                {/* مؤشر التشغيل */}
                {currentlyPlaying === s.i && isPlaying && (
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-[var(--gold)]">
                    <Volume2 className="size-3 animate-pulse" />
                    <span>جاري التشغيل...</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* البحث */}
      {data && tab === "search" && (
        <div className="space-y-3">
          <div className="surface-card flex items-center gap-2 px-3.5 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في آيات القرآن…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          {query.trim().length >= 2 && (
            <p className="text-[11px] text-muted-foreground">النتائج: {toArabicNumber(results.length)}</p>
          )}
          {results.map((hit) => (
            <Link
              key={`${hit.surah}-${hit.ayah}`}
              to="/quran/$surahId"
              params={{ surahId: String(hit.surah) }}
              search={{ ayah: hit.ayah }}
              onClick={stopAllAudio}
              className="press surface-card block p-4"
            >
              <p className="quran-text text-[1.3rem]">{hit.text}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                سورة {hit.surahName} — الآية {toArabicNumber(hit.ayah)}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* العلامات المرجعية */}
      {tab === "bookmarks" && (
        <div className="space-y-3">
          {bookmarks.length === 0 && (
            <div className="surface-card flex flex-col items-center gap-2 p-10 text-center text-muted-foreground">
              <BookMarked className="size-6" />
              <p className="text-sm">لا توجد علامات مرجعية بعد</p>
            </div>
          )}
          {bookmarks.map((b) => (
            <div key={`${b.surah}-${b.ayah}`} className="surface-card p-4">
              <Link 
                to="/quran/$surahId" 
                params={{ surahId: String(b.surah) }} 
                search={{ ayah: b.ayah }}
                onClick={stopAllAudio}
              >
                <p className="quran-text text-[1.3rem]">{b.text}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  سورة {b.surahName} — الآية {toArabicNumber(b.ayah)}
                </p>
              </Link>
              <button
                onClick={() => {
                  haptic("warn");
                  setBookmarks(bookmarks.filter((x) => !(x.surah === b.surah && x.ayah === b.ayah)));
                }}
                className="press mt-2 text-[11px] text-destructive"
              >
                حذف العلامة
              </button>
            </div>
          ))}
        </div>
      )}

      {/* مسافة إضافية */}
      {currentlyPlaying && <div className="h-20" />}
    </div>
  );
}

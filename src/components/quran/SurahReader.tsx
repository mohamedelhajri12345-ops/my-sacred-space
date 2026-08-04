import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookMarked,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  Languages,
  Loader2,
  Pause,
  Play,
  X,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import {
  ayahAudioUrl,
  getReciter,
  globalAyahNumber,
  loadQuran,
  loadTafsir,
  loadTranslation,
  toArabicNumber,
  type Bookmark,
  type ReadingProgress,
} from "@/lib/quran";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useApp } from "@/lib/app-context";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export function SurahReader({
  surahId,
  initialAyah,
}: {
  surahId: number;
  initialAyah?: number | undefined;
}) {
  const { settings, updateSettings, online } = useApp();
  const [selected, setSelected] = useState<number | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>("islamic:bookmarks", []);
  const [, setProgress] = useLocalStorage<ReadingProgress | null>("islamic:progress", null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showTafsirHint, setShowTafsirHint] = useState(true);

  const { data, isLoading } = useQuery({ queryKey: ["quran"], queryFn: loadQuran, staleTime: Infinity });
  const { data: tafsir } = useQuery({ queryKey: ["tafsir"], queryFn: loadTafsir, staleTime: Infinity });
  const { data: translation } = useQuery({
    queryKey: ["translation-en"],
    queryFn: loadTranslation,
    staleTime: Infinity,
    enabled: settings.showTranslation,
  });

  const surah = data?.find((s) => s.i === surahId);
  const reciter = useMemo(() => getReciter(settings.reciter), [settings.reciter]);

  useEffect(() => {
    if (!initialAyah) return;
    const el = document.getElementById(`ayah-${initialAyah}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [initialAyah, data]);

  const markRead = useCallback(
    (ayah: number) => {
      if (!data) return;
      setProgress({
        surah: surahId,
        ayah,
        readAyahs: globalAyahNumber(data, surahId, ayah),
        updatedAt: Date.now(),
      });
    },
    [data, setProgress, surahId],
  );

  // عنصر صوت واحد يُعاد استخدامه مع كل الأحداث
  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;
    return audio;
  }, []);

  const playAyah = useCallback(
    (ayah: number) => {
      if (!surah) return;
      if (ayah < 1 || ayah > surah.c) return;
      if (!online) {
        toast.error("التلاوة الصوتية تحتاج اتصالًا بالإنترنت");
        return;
      }
      const audio = ensureAudio();
      const src = ayahAudioUrl(settings.reciter, surahId, ayah);
      setCurrent(ayah);
      setBuffering(true);
      setPosition(0);
      setDuration(0);
      audio.src = src;
      audio.load();
      void audio
        .play()
        .then(() => {
          setIsPlaying(true);
          markRead(ayah);
          document.getElementById(`ayah-${ayah}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .catch((err: unknown) => {
          setIsPlaying(false);
          setBuffering(false);
          const name = err instanceof Error ? err.name : "";
          toast.error(
            name === "NotAllowedError"
              ? "اضغط زر التشغيل مرة أخرى للسماح بتشغيل الصوت"
              : "تعذّر تحميل ملف التلاوة، تحقّق من الاتصال أو جرّب قارئًا آخر",
          );
        });
    },
    [ensureAudio, markRead, online, settings.reciter, surah, surahId],
  );

  // ربط أحداث المشغّل
  useEffect(() => {
    const audio = ensureAudio();
    const onTime = () => setPosition(audio.currentTime);
    const onMeta = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setBuffering(false);
    };
    const onPlay = () => {
      setIsPlaying(true);
      setBuffering(false);
    };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setBuffering(true);
    const onError = () => {
      setIsPlaying(false);
      setBuffering(false);
      toast.error("تعذّر تشغيل التلاوة لهذه الآية، جرّب قارئًا آخر من الإعدادات");
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("playing", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("playing", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("error", onError);
    };
  }, [ensureAudio]);

  // تشغيل تلقائي للآية التالية
  useEffect(() => {
    const audio = ensureAudio();
    const onEnded = () => {
      if (current !== null && surah && current < surah.c) playAyah(current + 1);
      else {
        setIsPlaying(false);
        setCurrent(null);
      }
    };
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [current, ensureAudio, playAyah, surah]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  const toggle = (ayah: number) => {
    haptic("light");
    const audio = ensureAudio();
    if (current === ayah && isPlaying) {
      audio.pause();
      return;
    }
    if (current === ayah && !isPlaying && audio.src) {
      void audio.play().catch(() => toast.error("تعذّر متابعة التشغيل"));
      return;
    }
    playAyah(ayah);
  };

  const closePlayer = () => {
    ensureAudio().pause();
    setIsPlaying(false);
    setCurrent(null);
  };

  const seek = (value: number) => {
    const audio = ensureAudio();
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = value;
    setPosition(value);
  };

  const openTafsir = (ayah: number) => {
    haptic("medium");
    setSelected(ayah);
    markRead(ayah);
    // إخفاء التلميح بعد أول استخدام
    if (showTafsirHint) {
      setShowTafsirHint(false);
    }
  };

  if (isLoading || !surah) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-accent" />
        <p className="text-sm">جارٍ تحميل المصحف…</p>
      </div>
    );
  }

  const isBookmarked = (ayah: number) => bookmarks.some((b) => b.surah === surahId && b.ayah === ayah);

  const toggleBookmark = (ayah: number) => {
    haptic("medium");
    if (isBookmarked(ayah)) {
      setBookmarks(bookmarks.filter((b) => !(b.surah === surahId && b.ayah === ayah)));
      toast("تم حذف العلامة");
    } else {
      setBookmarks([
        ...bookmarks,
        { surah: surahId, ayah, surahName: surah.n, text: surah.v[ayah - 1]!, at: Date.now() },
      ]);
      toast.success("تمت إضافة علامة مرجعية");
    }
  };

  const fmt = (s: number) => {
    if (!Number.isFinite(s) || s <= 0) return "٠:٠٠";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 pb-40">
      <div className="surface-card gradient-night p-5 text-center text-primary-foreground">
        <p className="text-xs opacity-80">
          {surah.t === "meccan" ? "مكية" : "مدنية"} · {toArabicNumber(surah.c)} آية
        </p>
        <h2 className="font-display text-3xl font-bold">سورة {surah.n}</h2>
        {surahId !== 1 && surahId !== 9 && (
          <p className="quran-text mt-2 text-[1.3rem] text-primary-foreground">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => {
            haptic("light");
            updateSettings({ showTranslation: !settings.showTranslation });
          }}
          className={cn(
            "press flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium",
            settings.showTranslation ? "gradient-gold border-transparent text-gold-foreground" : "bg-card text-muted-foreground",
          )}
        >
          <Languages className="size-3.5" /> الترجمة الإنجليزية
        </button>
        <span className="truncate text-[11px] text-muted-foreground">القارئ: {reciter.name}</span>
      </div>

      {/* تلميح التفسير */}
      {showTafsirHint && (
        <div className="flex items-start gap-2 rounded-xl bg-[var(--gold)]/10 p-3 text-[11px] text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0 text-[var(--gold)]" />
          <p>اضغط على أي آية لعرض تفسيرها أو تشغيل التلاوة</p>
        </div>
      )}

      {/* نص القرآن الكريم المتصل */}
      <div className="surface-card p-6">
        {/* البسملة للسور التي تحتاجها */}
        {surahId !== 1 && surahId !== 9 && (
          <p className="quran-text mb-4 text-right text-[1.4rem] leading-[2.5] text-primary">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}
        
        {/* الآيات المتصلة */}
        <div className="space-y-1">
          {surah.v.map((text, index) => {
            const ayah = index + 1;
            const active = current === ayah;
            
            return (
              <div
                key={ayah}
                id={`ayah-${ayah}`}
                className={cn(
                  "group relative rounded-xl p-3 transition-all duration-200",
                  active && "bg-[var(--gold)]/10",
                  initialAyah === ayah && "ring-2 ring-ring",
                )}
                onClick={() => openTafsir(ayah)}
              >
                <p className="quran-text text-right text-[1.35rem] leading-[2.4] text-primary cursor-pointer hover:text-[var(--gold)] transition-colors">
                  {text}
                  <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-secondary/60 align-middle font-sans text-[11px] text-muted-foreground">
                    {toArabicNumber(ayah)}
                  </span>
                </p>
                
                {/* أزرار التحكم عند التحويم */}
                <div className={cn(
                  "absolute left-2 top-1/2 flex -translate-y-1/2 items-center gap-1 transition-opacity md:group-hover:opacity-100",
                  "opacity-0 group-hover:opacity-100"
                )}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(ayah);
                    }}
                    className={cn(
                      "press flex size-7 items-center justify-center rounded-lg",
                      active && isPlaying ? "gradient-gold text-gold-foreground" : "bg-secondary text-primary",
                    )}
                    aria-label={active && isPlaying ? "إيقاف التلاوة" : "تشغيل التلاوة"}
                  >
                    {active && buffering ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : active && isPlaying ? (
                      <Pause className="size-3.5" />
                    ) : (
                      <Play className="size-3.5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(ayah);
                    }}
                    className={cn(
                      "press flex size-7 items-center justify-center rounded-lg",
                      isBookmarked(ayah) ? "gradient-gold text-gold-foreground" : "bg-secondary text-primary",
                    )}
                    aria-label="علامة مرجعية"
                  >
                    <BookMarked className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* الترجمة الإنجليزية (اختيارية) */}
        {settings.showTranslation && (
          <>
            <div className="divider-geo my-6" />
            <div className="space-y-1">
              {surah.v.map((_, index) => (
                <p
                  key={index}
                  dir="ltr"
                  className="text-right text-[13px] leading-7 text-muted-foreground"
                >
                  {translation?.[surahId - 1]?.[index] ?? "جارٍ تحميل الترجمة…"}
                </p>
              ))}
            </div>
          </>
        )}
      </div>

      {current !== null && (
        <div className="fixed inset-x-0 bottom-[5.75rem] z-50 mx-auto w-[calc(100%-1.5rem)] max-w-xl rounded-2xl border border-[color-mix(in_oklab,var(--gold)_40%,transparent)] bg-card px-4 py-3 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {surah.n} — الآية {toArabicNumber(current)}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">{reciter.name}</p>
            </div>
            <button
              onClick={closePlayer}
              aria-label="إغلاق المشغل"
              className="press flex size-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-9 text-[10px] tabular-nums text-muted-foreground">{fmt(position)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(position, duration || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="شريط التقدم"
              className="h-1.5 flex-1 accent-[var(--gold)]"
            />
            <span className="w-9 text-[10px] tabular-nums text-muted-foreground">{fmt(duration)}</span>
          </div>

          <div className="mt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                haptic("light");
                playAyah(current - 1);
              }}
              disabled={current <= 1}
              className="press flex size-9 items-center justify-center rounded-xl bg-secondary disabled:opacity-40"
              aria-label="الآية السابقة"
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              onClick={() => toggle(current)}
              className="press flex size-11 items-center justify-center rounded-2xl gradient-warm text-primary-foreground"
              aria-label={isPlaying ? "إيقاف" : "تشغيل"}
            >
              {buffering ? (
                <Loader2 className="size-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="size-5" />
              ) : (
                <Play className="size-5" />
              )}
            </button>
            <button
              onClick={() => {
                haptic("light");
                playAyah(current + 1);
              }}
              disabled={current >= surah.c}
              className="press flex size-9 items-center justify-center rounded-xl bg-secondary disabled:opacity-40"
              aria-label="الآية التالية"
            >
              <ChevronLeft className="size-4" />
            </button>
          </div>
        </div>
      )}

      {selected !== null && (
        <div className="fixed inset-0 z-[55] flex items-end bg-foreground/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="animate-rise max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border-t border-border bg-background" onClick={(e) => e.stopPropagation()}>
            {/* رأس النافذة */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
              <h3 className="text-base font-bold">
                تفسير سورة {surah.n} — الآية {toArabicNumber(selected)}
              </h3>
              <button
                onClick={() => setSelected(null)}
                aria-label="إغلاق"
                className="press flex size-9 items-center justify-center rounded-xl border border-border bg-card"
              >
                <X className="size-4" />
              </button>
            </div>
            
            {/* محتوى النافذة */}
            <div className="px-5 py-5">
              {/* نص الآية */}
              <p className="quran-text mb-4 text-center text-[1.4rem] leading-[2.2] text-primary">
                {surah.v[selected - 1]}
              </p>
              
              <div className="divider-geo mb-5" />
              
              {/* التفسير */}
              <div className="text-sm leading-8 text-muted-foreground">
                {tafsir?.[surahId - 1]?.[selected - 1] ? (
                  <p className="whitespace-pre-wrap">{tafsir[surahId - 1][selected - 1]}</p>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                    <Loader2 className="size-5 animate-spin" />
                    <span>جارٍ تحميل التفسير…</span>
                  </div>
                )}
              </div>
              
              {/* أزرار إضافية */}
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <button
                  onClick={() => toggle(selected)}
                  className={cn(
                    "press flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium",
                    current === selected && isPlaying
                      ? "bg-destructive/10 text-destructive"
                      : "gradient-gold text-gold-foreground",
                  )}
                >
                  {current === selected && isPlaying ? (
                    <>
                      <Pause className="size-4" /> إيقاف التلاوة
                    </>
                  ) : (
                    <>
                      <Play className="size-4" /> تشغيل التلاوة
                    </>
                  )}
                </button>
                <button
                  onClick={() => toggleBookmark(selected)}
                  className={cn(
                    "press flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium",
                    isBookmarked(selected) && "gradient-gold border-transparent text-gold-foreground",
                  )}
                >
                  <BookMarked className="size-4" />
                  {isBookmarked(selected) ? "حذف" : "حفظ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

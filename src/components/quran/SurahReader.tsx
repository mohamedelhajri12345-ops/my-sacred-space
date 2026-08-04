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

      <div className="space-y-2">
        {surah.v.map((text, index) => {
          const ayah = index + 1;
          const active = current === ayah;
          return (
            <div
              key={ayah}
              id={`ayah-${ayah}`}
              className={cn(
                "surface-card p-4 transition-colors",
                active && "border-[color-mix(in_oklab,var(--gold)_65%,transparent)] bg-accent/10",
                initialAyah === ayah && "ring-2 ring-ring",
              )}
            >
              <p
                className="quran-text cursor-pointer text-right"
                onClick={() => {
                  haptic("light");
                  setSelected(ayah);
                  markRead(ayah);
                }}
              >
                {text}
                <span className="mx-1 inline-flex size-7 items-center justify-center rounded-full bg-secondary align-middle font-sans text-[11px] text-primary">
                  {toArabicNumber(ayah)}
                </span>
              </p>
              {settings.showTranslation && (
                <p dir="ltr" className="mt-2 border-t border-border/60 pt-2 text-left text-[13px] leading-6 text-muted-foreground">
                  {translation?.[surahId - 1]?.[index] ?? "Loading translation…"}
                </p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => toggle(ayah)}
                  className={cn(
                    "press flex size-8 items-center justify-center rounded-lg",
                    active && isPlaying ? "gradient-gold text-gold-foreground" : "bg-secondary text-primary",
                  )}
                  aria-label={active && isPlaying ? "إيقاف التلاوة" : "تشغيل التلاوة"}
                >
                  {active && buffering ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : active && isPlaying ? (
                    <Pause className="size-4" />
                  ) : (
                    <Play className="size-4" />
                  )}
                </button>
                <button
                  onClick={() => toggleBookmark(ayah)}
                  className={cn(
                    "press flex size-8 items-center justify-center rounded-lg",
                    isBookmarked(ayah) ? "gradient-gold text-gold-foreground" : "bg-secondary text-primary",
                  )}
                  aria-label="علامة مرجعية"
                >
                  <BookMarked className="size-4" />
                </button>
                <button
                  onClick={() => {
                    haptic("light");
                    setSelected(ayah);
                  }}
                  className="press flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-[11px] text-primary"
                >
                  <BookOpenText className="size-3.5" /> التفسير
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {current !== null && (
        <div className="fixed inset-x-0 bottom-[5.75rem] z-50 mx-auto w-[calc(100%-1.5rem)] max-w-xl rounded-2xl border border-border bg-card/95 px-4 py-3 backdrop-blur-xl">
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
        <div className="fixed inset-0 z-[55] flex items-end bg-foreground/40 backdrop-blur-sm">
          <div className="animate-rise max-h-[75vh] w-full overflow-y-auto rounded-t-3xl border-t border-border bg-background p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold">
                التفسير الميسّر — {surah.n} : {toArabicNumber(selected)}
              </h3>
              <button
                onClick={() => setSelected(null)}
                aria-label="إغلاق"
                className="press flex size-9 items-center justify-center rounded-xl border border-border bg-card"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="quran-text mb-4 text-[1.35rem]">{surah.v[selected - 1]}</p>
            <div className="divider-geo mb-4" />
            <p className="whitespace-pre-wrap text-sm leading-8 text-muted-foreground">
              {tafsir?.[surahId - 1]?.[selected - 1] ?? "جارٍ تحميل التفسير…"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

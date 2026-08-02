import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookMarked, BookOpenText, Loader2, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { toast } from "sonner";
import {
  globalAyahNumber,
  loadQuran,
  loadTafsir,
  RECITERS,
  toArabicNumber,
  type Bookmark,
  type ReadingProgress,
} from "@/lib/quran";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useApp } from "@/lib/app-context";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export function SurahReader({ surahId, initialAyah }: { surahId: number; initialAyah?: number }) {
  const { settings, online } = useApp();
  const [selected, setSelected] = useState<number | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>("islamic:bookmarks", []);
  const [, setProgress] = useLocalStorage<ReadingProgress | null>("islamic:progress", null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["quran"], queryFn: loadQuran, staleTime: Infinity });
  const { data: tafsir } = useQuery({ queryKey: ["tafsir"], queryFn: loadTafsir, staleTime: Infinity });

  const surah = data?.find((s) => s.i === surahId);
  const reciter = useMemo(
    () => RECITERS.find((r) => r.id === settings.reciter) ?? RECITERS[0]!,
    [settings.reciter],
  );

  useEffect(() => {
    if (!initialAyah) return;
    const el = document.getElementById(`ayah-${initialAyah}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [initialAyah, data]);

  const markRead = (ayah: number) => {
    if (!data) return;
    setProgress({
      surah: surahId,
      ayah,
      readAyahs: globalAyahNumber(data, surahId, ayah),
      updatedAt: Date.now(),
    });
  };

  const play = (ayah: number) => {
    if (!data) return;
    if (!online) {
      toast.error("التلاوة الصوتية تحتاج اتصالًا بالإنترنت");
      return;
    }
    const global = globalAyahNumber(data, surahId, ayah);
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    audio.src = `${reciter.base}/${global}.mp3`;
    audio.onended = () => {
      if (surah && ayah < surah.c) play(ayah + 1);
      else setPlaying(null);
    };
    audio.onerror = () => {
      setPlaying(null);
      toast.error("تعذّر تشغيل التلاوة");
    };
    void audio.play();
    setPlaying(ayah);
    markRead(ayah);
  };

  const stop = () => {
    audioRef.current?.pause();
    setPlaying(null);
  };

  useEffect(() => () => audioRef.current?.pause(), []);

  if (isLoading || !surah) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> جارٍ التحميل…
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

  return (
    <div className="space-y-4 pb-24">
      <div className="surface-card gradient-warm p-5 text-center text-primary-foreground">
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

      <div className="space-y-2">
        {surah.v.map((text, index) => {
          const ayah = index + 1;
          return (
            <div
              key={ayah}
              id={`ayah-${ayah}`}
              className={cn(
                "surface-card p-4 transition-colors",
                playing === ayah && "border-[color-mix(in_oklab,var(--gold)_65%,transparent)] bg-accent/10",
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
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => (playing === ayah ? stop() : play(ayah))}
                  className="press flex size-8 items-center justify-center rounded-lg bg-secondary text-primary"
                  aria-label="تشغيل التلاوة"
                >
                  {playing === ayah ? <Pause className="size-4" /> : <Play className="size-4" />}
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

      {playing !== null && (
        <div className="fixed inset-x-0 bottom-20 z-40 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl border border-border bg-card/95 px-4 py-3 backdrop-blur">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              {surah.n} — الآية {toArabicNumber(playing)}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">{reciter.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => playing > 1 && play(playing - 1)}
              className="press flex size-9 items-center justify-center rounded-xl bg-secondary"
              aria-label="السابق"
            >
              <SkipForward className="size-4" />
            </button>
            <button
              onClick={stop}
              className="press flex size-9 items-center justify-center rounded-xl gradient-warm text-primary-foreground"
              aria-label="إيقاف"
            >
              <Pause className="size-4" />
            </button>
            <button
              onClick={() => playing < surah.c && play(playing + 1)}
              className="press flex size-9 items-center justify-center rounded-xl bg-secondary"
              aria-label="التالي"
            >
              <SkipBack className="size-4" />
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
            <div className="ornament-divider mb-4" />
            <p className="whitespace-pre-wrap text-sm leading-8 text-muted-foreground">
              {tafsir?.[surahId - 1]?.[selected - 1] ?? "جارٍ تحميل التفسير…"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
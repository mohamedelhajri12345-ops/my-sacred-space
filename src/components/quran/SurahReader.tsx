import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Pause,
  Play,
  Repeat,
  Volume2,
  VolumeX,
  User,
  SkipBack,
  SkipForward,
  X,
  Gauge,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ayahAudioSources,
  getReciter,
  globalAyahNumber,
  loadQuran,
  loadTafsir,
  loadTranslation,
  toArabicNumber,
  RECITERS,
  type ReadingProgress,
} from "@/lib/quran";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useApp } from "@/lib/app-context";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

const SPEEDS = [0.75, 1, 1.25, 1.5] as const;

export function SurahReader({ surahId }: { surahId: number }) {
  const { settings, online, updateSettings } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [current, setCurrent] = useState(1);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatAyah, setRepeatAyah] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showReciterMenu, setShowReciterMenu] = useState(false);
  const [activeTafsir, setActiveTafsir] = useState<number | null>(null);
  const [, setProgress] = useLocalStorage<ReadingProgress | null>("islamic:progress", null);

  /** عنصران صوتيان: أحدهما يعمل والآخر يحمّل الآية التالية مسبقًا (تلاوة بلا تقطّع). */
  const pairRef = useRef<HTMLAudioElement[]>([]);
  const activeIdx = useRef(0);
  const playingRef = useRef(false);
  const ayahRef = useRef(1);

  const { data, isLoading } = useQuery({ queryKey: ["quran"], queryFn: loadQuran, staleTime: Infinity });
  const { data: tafsir } = useQuery({ queryKey: ["tafsir"], queryFn: loadTafsir, staleTime: Infinity });
  const { data: translation } = useQuery({
    queryKey: ["translation"],
    queryFn: loadTranslation,
    staleTime: Infinity,
    enabled: settings.showTranslation === true,
  });

  const surah = data?.find((s) => s.i === surahId);
  const count = surah?.c ?? 0;
  const reciter = useMemo(() => getReciter(settings.reciter), [settings.reciter]);

  const sourcesFor = useCallback(
    (ayah: number) =>
      ayahAudioSources(settings.reciter, surahId, ayah, data ? globalAyahNumber(data, surahId, ayah) : undefined),
    [data, settings.reciter, surahId],
  );

  const ensurePair = useCallback(() => {
    if (pairRef.current.length === 0 && typeof window !== "undefined") {
      pairRef.current = [new Audio(), new Audio()];
      for (const a of pairRef.current) {
        a.preload = "auto";
        a.crossOrigin = "anonymous";
      }
    }
    return pairRef.current;
  }, []);

  /** تحميل آية في عنصر صوتي مع التنقّل بين المصادر البديلة تلقائيًا. */
  const loadInto = useCallback(
    (audio: HTMLAudioElement, ayah: number) => {
      const list = sourcesFor(ayah);
      let idx = 0;
      const apply = () => {
        audio.src = list[idx] ?? "";
        audio.load();
      };
      audio.onerror = () => {
        idx += 1;
        if (idx < list.length) apply();
        else if (playingRef.current && ayahRef.current === ayah) {
          toast.error("تعذّر تحميل التلاوة، جرّب قارئًا آخر");
          playingRef.current = false;
          setIsPlaying(false);
          setBuffering(false);
        }
      };
      apply();
    },
    [sourcesFor],
  );

  const preloadNext = useCallback(
    (ayah: number) => {
      const pair = ensurePair();
      if (pair.length < 2 || ayah > count) return;
      const idle = pair[1 - activeIdx.current]!;
      loadInto(idle, ayah);
    },
    [count, ensurePair, loadInto],
  );

  const playAyah = useCallback(
    (ayah: number, { reuse = false }: { reuse?: boolean } = {}) => {
      if (!online) {
        toast.error("التلاوة الصوتية تحتاج اتصالًا بالإنترنت");
        return;
      }
      const pair = ensurePair();
      if (pair.length < 2) return;

      ayahRef.current = ayah;
      setCurrent(ayah);
      setPosition(0);
      setDuration(0);
      setBuffering(true);

      const other = pair[1 - activeIdx.current]!;
      const usePreloaded = reuse && other.src && other.src === sourcesFor(ayah)[0];
      if (usePreloaded) {
        pair[activeIdx.current]!.pause();
        activeIdx.current = 1 - activeIdx.current;
      } else {
        pair[1 - activeIdx.current]!.pause();
        loadInto(pair[activeIdx.current]!, ayah);
      }

      const audio = pair[activeIdx.current]!;
      audio.playbackRate = speed;
      audio.volume = muted ? 0 : 1;
      audio
        .play()
        .then(() => {
          playingRef.current = true;
          setIsPlaying(true);
          setBuffering(false);
          if (data) {
            setProgress({
              surah: surahId,
              ayah,
              readAyahs: globalAyahNumber(data, surahId, ayah),
              updatedAt: Date.now(),
            });
          }
          preloadNext(ayah + 1);
        })
        .catch((err: DOMException) => {
          setBuffering(false);
          if (err?.name === "NotAllowedError") toast.error("اضغط زر التشغيل للسماح بالصوت");
        });
    },
    [count, data, ensurePair, loadInto, muted, online, preloadNext, setProgress, sourcesFor, speed, surahId],
  );

  // أحداث المشغّل
  useEffect(() => {
    const pair = ensurePair();
    if (pair.length < 2) return;

    const onTime = (e: Event) => {
      const a = e.currentTarget as HTMLAudioElement;
      if (a !== pair[activeIdx.current]) return;
      setPosition(a.currentTime);
    };
    const onMeta = (e: Event) => {
      const a = e.currentTarget as HTMLAudioElement;
      if (a !== pair[activeIdx.current]) return;
      setDuration(Number.isFinite(a.duration) ? a.duration : 0);
      setBuffering(false);
    };
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    const onEnded = (e: Event) => {
      const a = e.currentTarget as HTMLAudioElement;
      if (a !== pair[activeIdx.current]) return;
      const next = repeatAyah ? ayahRef.current : ayahRef.current + 1;
      if (next > count) {
        playingRef.current = false;
        setIsPlaying(false);
        return;
      }
      playAyah(next, { reuse: !repeatAyah });
    };

    for (const a of pair) {
      a.addEventListener("timeupdate", onTime);
      a.addEventListener("loadedmetadata", onMeta);
      a.addEventListener("waiting", onWaiting);
      a.addEventListener("playing", onPlaying);
      a.addEventListener("ended", onEnded);
    }
    return () => {
      for (const a of pair) {
        a.removeEventListener("timeupdate", onTime);
        a.removeEventListener("loadedmetadata", onMeta);
        a.removeEventListener("waiting", onWaiting);
        a.removeEventListener("playing", onPlaying);
        a.removeEventListener("ended", onEnded);
      }
    };
  }, [count, ensurePair, playAyah, repeatAyah]);

  // إيقاف الصوت عند مغادرة الصفحة
  useEffect(
    () => () => {
      for (const a of pairRef.current) {
        a.pause();
        a.src = "";
      }
      playingRef.current = false;
    },
    [],
  );

  // تمرير تلقائي إلى الآية قيد التلاوة
  useEffect(() => {
    if (!isPlaying) return;
    const el = document.getElementById(`ayah-${current}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [current, isPlaying]);

  const toggle = () => {
    haptic("soft");
    const pair = ensurePair();
    const audio = pair[activeIdx.current];
    if (isPlaying && audio) {
      audio.pause();
      playingRef.current = false;
      setIsPlaying(false);
      return;
    }
    if (audio?.src && audio.currentTime > 0 && !audio.ended) {
      void audio.play().then(() => {
        playingRef.current = true;
        setIsPlaying(true);
      });
      return;
    }
    playAyah(current);
  };

  const goTo = (ayah: number) => {
    if (ayah < 1 || ayah > count) return;
    haptic("light");
    playAyah(ayah);
  };

  const seek = (value: number) => {
    const audio = pairRef.current[activeIdx.current];
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = value;
    setPosition(value);
  };

  const cycleSpeed = () => {
    haptic("light");
    const next = SPEEDS[(SPEEDS.indexOf(speed as (typeof SPEEDS)[number]) + 1) % SPEEDS.length]!;
    setSpeed(next);
    for (const a of pairRef.current) a.playbackRate = next;
  };

  const toggleMute = () => {
    haptic("light");
    const next = !muted;
    setMuted(next);
    for (const a of pairRef.current) a.volume = next ? 0 : 1;
  };

  const selectReciter = (id: string) => {
    haptic("medium");
    updateSettings({ reciter: id });
    setShowReciterMenu(false);
    for (const a of pairRef.current) {
      a.pause();
      a.src = "";
    }
    if (isPlaying) setTimeout(() => playAyah(ayahRef.current), 0);
  };

  if (isLoading || !surah) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">جارٍ تحميل السورة...</p>
      </div>
    );
  }

  const fmt = (s: number) => {
    if (!Number.isFinite(s) || s <= 0) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };
  const percent = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <div className="pb-56">
      {/* ترويسة السورة */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 to-teal/10 p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              {surah.t === "meccan" ? "مكية" : "مدنية"} · {toArabicNumber(surah.c)} آية
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold">{surah.n}</h2>
          </div>
          <button
            onClick={() => {
              haptic("light");
              setShowReciterMenu((v) => !v);
            }}
            className="press card-glass flex items-center gap-2 rounded-xl px-3 py-2 text-xs"
          >
            <User className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">{reciter.name}</span>
          </button>
        </div>

        {surahId !== 1 && surahId !== 9 && (
          <p className="quran-text mt-4 text-center text-xl text-primary">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        )}
      </motion.div>

      {/* اختيار القارئ */}
      <AnimatePresence>
        {showReciterMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card-glass fixed left-4 right-4 top-24 z-50 mx-auto max-w-xl rounded-2xl p-4 shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold">اختر القارئ</h3>
              <button onClick={() => setShowReciterMenu(false)} aria-label="إغلاق" className="text-muted-foreground">
                <X className="size-5" />
              </button>
            </div>
            <div className="max-h-80 space-y-1 overflow-y-auto">
              {RECITERS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => selectReciter(r.id)}
                  className={cn(
                    "press w-full rounded-xl px-4 py-3 text-right text-sm transition-all",
                    settings.reciter === r.id ? "bg-primary/10 text-primary" : "hover:bg-secondary/50",
                  )}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نص السورة */}
      <div className="space-y-3">
        {surah.v.map((text, index) => {
          const n = index + 1;
          const active = isPlaying && current === n;
          return (
            <div
              key={n}
              id={`ayah-${n}`}
              className={cn(
                "rounded-2xl border p-4 transition-colors",
                active ? "border-[var(--gold)]/50 bg-[var(--gold)]/10" : "border-border/50 bg-card",
              )}
            >
              <p
                className="quran-text cursor-pointer text-justify text-xl leading-[2.6]"
                dir="rtl"
                onClick={() => {
                  haptic("light");
                  setActiveTafsir(activeTafsir === n ? null : n);
                }}
              >
                {text}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(n);
                  }}
                  aria-label={`تشغيل الآية ${n}`}
                  className={cn(
                    "mx-1 inline-flex size-7 items-center justify-center rounded-full align-middle font-sans text-xs transition-colors",
                    active ? "bg-[var(--gold)] text-[var(--gold-foreground)]" : "bg-primary/10 text-primary",
                  )}
                >
                  {toArabicNumber(n)}
                </button>
              </p>

              {settings.showTranslation && translation?.[surahId - 1]?.[index] && (
                <p dir="ltr" className="mt-2 text-left text-sm text-muted-foreground">
                  {translation[surahId - 1]![index]}
                </p>
              )}

              {activeTafsir === n && tafsir?.[surahId - 1]?.[index] && (
                <p className="mt-3 rounded-xl bg-secondary/40 p-3 text-sm leading-7 text-muted-foreground">
                  {tafsir[surahId - 1]![index]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* المشغّل الملتصق */}
      <div className="fixed bottom-20 left-0 right-0 z-40 px-3">
        <div className="card-glass mx-auto max-w-xl overflow-hidden rounded-2xl shadow-2xl">
          <div
            className="h-1.5 cursor-pointer bg-secondary/40"
            onClick={(e) => {
              if (duration <= 0) return;
              const rect = e.currentTarget.getBoundingClientRect();
              seek(((e.clientX - rect.left) / rect.width) * duration);
            }}
          >
            <div className="h-full bg-gradient-to-r from-primary to-[var(--gold)]" style={{ width: `${percent}%` }} />
          </div>

          <div className="p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-bold text-foreground">
                {surah.n} · الآية {toArabicNumber(current)}
              </span>
              <span className="tabular-nums">
                {fmt(position)} / {fmt(duration)}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button onClick={cycleSpeed} aria-label="سرعة التلاوة" className="press flex size-10 items-center justify-center gap-0.5 rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">
                <Gauge className="size-3.5" />
                {speed}×
              </button>
              <button
                onClick={() => {
                  haptic("light");
                  setRepeatAyah((v) => !v);
                }}
                aria-label="تكرار الآية"
                className={cn(
                  "press flex size-10 items-center justify-center rounded-full",
                  repeatAyah ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                )}
              >
                <Repeat className="size-4" />
              </button>
              <button onClick={() => goTo(current - 1)} aria-label="الآية السابقة" className="press flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <SkipForward className="size-5" />
              </button>
              <button
                onClick={toggle}
                aria-label={isPlaying ? "إيقاف" : "تشغيل"}
                className="press flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal text-primary-foreground shadow-lg"
              >
                {buffering ? <Loader2 className="size-6 animate-spin" /> : isPlaying ? <Pause className="size-6" /> : <Play className="size-6" />}
              </button>
              <button onClick={() => goTo(current + 1)} aria-label="الآية التالية" className="press flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <SkipBack className="size-5" />
              </button>
              <button onClick={toggleMute} aria-label="كتم الصوت" className="press flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

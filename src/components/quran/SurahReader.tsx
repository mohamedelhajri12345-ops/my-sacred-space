import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pause,
  Play,
  Repeat,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  getReciter,
  globalAyahNumber,
  loadQuran,
  toArabicNumber,
  type ReadingProgress,
} from "@/lib/quran";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useApp } from "@/lib/app-context";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

// Full surah audio URL from mp3quran.net
export function surahAudioUrl(reciterId: string, surah: number) {
  const padded = String(surah).padStart(3, "0");
  const reciterMap: Record<string, string> = {
    "ar.alafasy": "mishary_alafasy",
    "ar.mahermuaiqly": "maher_almuaiqly",
    "ar.yasserdossari": "yasser_ad-dussary",
    "ar.abdulbasitmurattal": "abdulbasit_murattal",
    "ar.husary": "husary",
    "ar.minshawi": "minshawi_murattal",
  };
  const reciterFolder = reciterMap[reciterId] || reciterMap["ar.alafasy"];
  return `https://server${Math.floor(Math.random() * 13) + 8}.mp3quran.net/${reciterFolder}/${padded}.mp3`;
}

export function SurahReader({
  surahId,
  initialAyah,
}: {
  surahId: number;
  initialAyah?: number | undefined;
}) {
  const { settings, online } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [, setProgress] = useLocalStorage<ReadingProgress | null>("islamic:progress", null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["quran"], queryFn: loadQuran, staleTime: Infinity });

  const surah = data?.find((s) => s.i === surahId);
  const reciter = useMemo(() => getReciter(settings.reciter), [settings.reciter]);

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

  // عنصر صوت واحد للسورة الكاملة
  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;
    return audio;
  }, []);

  const playSurah = useCallback(() => {
    if (!surah) return;
    if (!online) {
      toast.error("التلاوة الصوتية تحتاج اتصالًا بالإنترنت");
      return;
    }
    const audio = ensureAudio();
    const src = surahAudioUrl(settings.reciter, surahId);
    setBuffering(true);
    setPosition(0);
    setDuration(0);
    audio.src = src;
    audio.load();
    void audio.play().then(() => {
      setIsPlaying(true);
      markRead(surah.c);
    }).catch((err: unknown) => {
      setIsPlaying(false);
      setBuffering(false);
      const name = err instanceof Error ? err.name : "";
      toast.error(
        name === "NotAllowedError"
          ? "اضغط زر التشغيل مرة أخرى للسماح بتشغيل الصوت"
          : "تعذّر تحميل ملف التلاوة، تحقّق من الاتصال أو جرّب قارئًا آخر",
      );
    });
  }, [ensureAudio, markRead, online, settings.reciter, surah, surahId]);

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
    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        void audio.play();
      } else {
        setIsPlaying(false);
      }
    };
    const onError = () => {
      setIsPlaying(false);
      setBuffering(false);
      toast.error("تعذّر تشغيل التلاوة لهذه السورة، جرّب قارئًا آخر من الإعدادات");
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("playing", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("playing", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [ensureAudio, isLooping]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  const toggle = () => {
    haptic("light");
    const audio = ensureAudio();
    if (isPlaying) {
      audio.pause();
      return;
    }
    if (audio.src && !isPlaying) {
      void audio.play().catch(() => toast.error("تعذّر متابعة التشغيل"));
      return;
    }
    playSurah();
  };

  const closePlayer = () => {
    ensureAudio().pause();
    setIsPlaying(false);
  };

  const seek = (value: number) => {
    const audio = ensureAudio();
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = value;
    setPosition(value);
  };

  const toggleLoop = () => {
    haptic("light");
    setIsLooping(!isLooping);
  };

  if (isLoading || !surah) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-accent" />
        <p className="text-sm">جارٍ تحميل المصحف…</p>
      </div>
    );
  }

  const fmt = (s: number) => {
    if (!Number.isFinite(s) || s <= 0) return "٠:٠٠";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 pb-40">
      {/* Header */}
      <div className="surface-card gradient-night p-6 text-center text-primary-foreground">
        <p className="text-xs opacity-80">
          {surah.t === "meccan" ? "مكية" : "مدنية"} · {toArabicNumber(surah.c)} آية
        </p>
        <h2 className="font-display text-4xl font-bold">سورة {surah.n}</h2>
        {surahId !== 1 && surahId !== 9 && (
          <p className="quran-text mt-3 text-[1.4rem] text-primary-foreground">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}
        <p className="mt-2 text-xs opacity-70">القارئ: {reciter.name}</p>
      </div>

      {/* القرآن المتصل - الآيات مدمجة كسورة واحدة */}
      <div className="surface-card p-6">
        <p className="quran-text text-justify text-xl leading-[2.8] tracking-wide" dir="rtl">
          {surah.v.map((text, index) => (
            <span key={index} className="inline">
              {text}
              <span className="mx-1 inline-flex size-6 items-center justify-center rounded-full bg-secondary align-middle font-sans text-xs text-primary">
                {toArabicNumber(index + 1)}
              </span>
              {" "}
            </span>
          ))}
        </p>
      </div>

      {/* مشغل التلاوة */}
      <div className="surface-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold">تشغيل التلاوة</h3>
          <button
            onClick={closePlayer}
            aria-label="إغلاق المشغل"
            className="press flex size-7 items-center justify-center rounded-lg bg-secondary text-muted-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="w-10 text-[10px] tabular-nums text-muted-foreground">{fmt(position)}</span>
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
          <span className="w-10 text-[10px] tabular-nums text-muted-foreground">{fmt(duration)}</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              haptic("light");
              seek(Math.max(0, position - 10));
            }}
            className="press flex size-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground"
            aria-label="تراجع 10 ثوان"
          >
            <span className="text-xs font-bold">-10</span>
          </button>
          <button
            onClick={toggleLoop}
            className={cn(
              "press flex size-9 items-center justify-center rounded-xl",
              isLooping ? "gradient-gold text-gold-foreground" : "bg-secondary text-muted-foreground",
            )}
            aria-label="تكرار"
          >
            <Repeat className="size-4" />
          </button>
          <button
            onClick={toggle}
            className="press flex size-14 items-center justify-center rounded-2xl gradient-warm text-primary-foreground"
            aria-label={isPlaying ? "إيقاف" : "تشغيل"}
          >
            {buffering ? (
              <Loader2 className="size-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="size-6" />
            ) : (
              <Play className="size-6" />
            )}
          </button>
          <button
            onClick={() => {
              haptic("light");
              seek(Math.min(duration, position + 10));
            }}
            className="press flex size-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground"
            aria-label="تقديم 10 ثوان"
          >
            <span className="text-xs font-bold">+10</span>
          </button>
        </div>
      </div>
    </div>
  );
}

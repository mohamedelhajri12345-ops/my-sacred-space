import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Pause,
  Play,
  Repeat,
} from "lucide-react";
import { toast } from "sonner";
import {
  getReciter,
  globalAyahNumber,
  loadQuran,
  surahAudioUrl,
  toArabicNumber,
  type ReadingProgress,
} from "@/lib/quran";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useApp } from "@/lib/app-context";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export function SurahReader({
  surahId,
}: {
  surahId: number;
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
    audio.crossOrigin = "anonymous";
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
    haptic("soft");
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

  const seek = (value: number) => {
    const audio = ensureAudio();
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = value;
    setPosition(value);
  };

  const toggleLoop = () => {
    haptic("soft");
    setIsLooping(!isLooping);
  };

  if (isLoading || !surah) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-white/80">
        <Loader2 className="size-8 animate-spin text-[var(--gold)]" />
        <p className="text-sm text-white/70">جارٍ تحميل المصحف…</p>
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
    <div className="min-h-screen">
      {/* Header - شفاف مع نص أغمق */}
      <div className="glass-card p-6 text-center mb-4">
        <p className="text-xs text-white/60 mb-1">
          {surah.t === "meccan" ? "مكية" : "مدنية"} · {toArabicNumber(surah.c)} آية
        </p>
        <h2 className="font-display text-4xl font-bold text-white drop-shadow-lg">سورة {surah.n}</h2>
        {surahId !== 1 && surahId !== 9 && (
          <p className="quran-text mt-3 text-[1.4rem] text-[var(--gold)] drop-shadow-sm">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}
        <p className="mt-2 text-xs text-white/50">القارئ: {reciter.name}</p>
      </div>

      {/* القرآن المتصل - شفاف */}
      <div className="glass-card p-6 mb-4">
        <p className="quran-text text-justify text-xl leading-[2.8] tracking-wide text-white drop-shadow-md" dir="rtl">
          {surah.v.map((text, index) => (
            <span key={index} className="inline">
              {text}
              <span className="mx-1 inline-flex size-6 items-center justify-center rounded-full bg-white/20 align-middle font-sans text-xs text-[var(--gold)] backdrop-blur-sm">
                {toArabicNumber(index + 1)}
              </span>
              {" "}
            </span>
          ))}
        </p>
      </div>

      {/* مشغل التلاوة - ثابت مع التمرير */}
      <div className="glass-card p-5 fixed bottom-20 left-4 right-4 z-50 max-w-lg mx-auto rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-12 text-[11px] tabular-nums text-white/50 text-right">{fmt(position)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={Math.min(position, duration || 100)}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="شريط التقدم"
            className="h-1.5 flex-1 accent-[var(--gold)] bg-white/20 rounded-full [&::-webkit-slider-thumb]:bg-[var(--gold)] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
          />
          <span className="w-12 text-[11px] tabular-nums text-white/50 text-left">{fmt(duration)}</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              haptic("soft");
              seek(Math.max(0, position - 10));
            }}
            className="soothing-btn flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm"
            aria-label="تراجع 10 ثوان"
          >
            <span className="text-xs font-bold">-10</span>
          </button>
          <button
            onClick={toggleLoop}
            className={cn(
              "soothing-btn flex size-10 items-center justify-center rounded-full backdrop-blur-sm",
              isLooping ? "bg-[var(--gold)] text-[#1a1a3a]" : "bg-white/15 text-white",
            )}
            aria-label="تكرار"
          >
            <Repeat className="size-5" />
          </button>
          <button
            onClick={toggle}
            className="soothing-btn flex size-16 items-center justify-center rounded-full bg-[var(--gold)] text-[#1a1a3a] shadow-[0_8px_30px_rgba(212,175,55,0.4)] active:scale-95"
            aria-label={isPlaying ? "إيقاف" : "تشغيل"}
          >
            {buffering ? (
              <Loader2 className="size-7 animate-spin" />
            ) : isPlaying ? (
              <Pause className="size-7" />
            ) : (
              <Play className="size-7 mr-1" />
            )}
          </button>
          <button
            onClick={() => {
              haptic("soft");
              seek(Math.min(duration, position + 10));
            }}
            className="soothing-btn flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm"
            aria-label="تقديم 10 ثوان"
          >
            <span className="text-xs font-bold">+10</span>
          </button>
        </div>
      </div>
      
      {/* مسافة إضافية للأسفل */}
      <div className="h-40" />
    </div>
  );
}

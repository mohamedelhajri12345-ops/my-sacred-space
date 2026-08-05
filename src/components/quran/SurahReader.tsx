import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Pause,
  Play,
  Repeat,
  ChevronUp,
  ChevronDown,
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
  const [isMinimized, setIsMinimized] = useState(false);
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
    
    // محاولة التشغيل مع معالجة أفضل للأخطاء
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
        markRead(surah.c);
      }).catch((err: unknown) => {
        setIsPlaying(false);
        setBuffering(false);
        console.error('Audio play error:', err);
        const name = err instanceof Error ? err.name : "";
        if (name === "NotAllowedError") {
          toast.error("اضغط زر التشغيل مرة أخرى للسماح بتشغيل الصوت");
        } else {
          toast.error("تعذّر تحميل ملف التلاوة، تحقّق من الاتصال أو جرّب قارئًا آخر");
        }
      });
    }
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
    if (audio.src && audio.src !== "") {
      audio.play().catch((err) => {
        console.error('Resume playback error:', err);
        toast.error("تعذّر متابعة التشغيل");
      });
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

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

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
      
      {/* مسافة إضافية للأسفل */}
      <div className="h-48" />
    </div>
  );
}

// مشغل التلاوة المتحرك - منفصل عن المحتوى
export function FloatingAudioPlayer({
  isPlaying,
  buffering,
  position,
  duration,
  isLooping,
  onToggle,
  onSeek,
  onToggleLoop,
  onMinimize,
  onMaximize,
  isMinimized,
  surahName,
  reciterName,
}: {
  isPlaying: boolean;
  buffering: boolean;
  position: number;
  duration: number;
  isLooping: boolean;
  onToggle: () => void;
  onSeek: (value: number) => void;
  onToggleLoop: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMinimized: boolean;
  surahName?: string;
  reciterName?: string;
}) {
  const fmt = (s: number) => {
    if (!Number.isFinite(s) || s <= 0) return "٠:٠٠";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <>
      {/* المشغل المصغر */}
      {isMinimized && (
        <button
          onClick={onMaximize}
          className="fixed bottom-24 left-4 z-50 flex items-center gap-3 glass-card rounded-full px-4 py-3 transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.2)'
          }}
        >
          <div className={cn(
            "flex size-10 items-center justify-center rounded-full transition-all duration-300",
            isPlaying ? "bg-[var(--gold)] text-[#1a1a3a]" : "bg-white/20 text-white"
          )}>
            {buffering ? (
              <Loader2 className="size-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5 mr-0.5" />
            )}
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-white">{surahName || "التلاوة"}</p>
            <p className="text-[10px] text-white/60">{reciterName}</p>
          </div>
          <div className="h-8 w-px bg-white/20 mx-1" />
          <span className="text-[10px] text-white/60 tabular-nums">{fmt(position)}</span>
        </button>
      )}

      {/* المشغل الكامل */}
      {!isMinimized && (
        <div 
          className="fixed bottom-20 left-4 right-4 z-50 max-w-lg mx-auto glass-card rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            boxShadow: '0 12px 48px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 175, 55, 0.15)'
          }}
        >
          {/* شريط التقدم */}
          <div className="h-1 bg-white/10 cursor-pointer" onClick={(e) => {
            if (duration <= 0) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            onSeek(percent * duration);
          }}>
            <div 
              className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-soft)] transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <div className="p-4">
            {/* معلومات السورة */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-white drop-shadow-md">{surahName || "التلاوة"}</p>
                <p className="text-[10px] text-white/60">{reciterName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tabular-nums text-white/50">{fmt(position)}</span>
                <span className="text-[10px] text-white/30">/</span>
                <span className="text-[10px] tabular-nums text-white/50">{fmt(duration)}</span>
              </div>
              <button
                onClick={onMinimize}
                className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="تصغير"
              >
                <ChevronDown className="size-4" />
              </button>
            </div>

            {/* أزرار التحكم */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  haptic("soft");
                  onSeek(Math.max(0, position - 10));
                }}
                className="soothing-btn flex size-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 active:scale-90"
                aria-label="تراجع 10 ثوان"
              >
                <span className="text-xs font-bold">-10</span>
              </button>
              
              <button
                onClick={onToggleLoop}
                className={cn(
                  "soothing-btn flex size-11 items-center justify-center rounded-full backdrop-blur-sm transition-all active:scale-90",
                  isLooping ? "bg-[var(--gold)] text-[#1a1a3a] shadow-[0_4px_20px_rgba(212,175,55,0.4)]" : "bg-white/15 text-white hover:bg-white/25"
                )}
                aria-label="تكرار"
              >
                <Repeat className="size-5" />
              </button>
              
              <button
                onClick={onToggle}
                className="soothing-btn flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-soft)] text-[#1a1a3a] shadow-[0_8px_30px_rgba(212,175,55,0.5)] active:scale-90 transition-transform"
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
                  onSeek(Math.min(duration, position + 10));
                }}
                className="soothing-btn flex size-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 active:scale-90"
                aria-label="تقديم 10 ثوان"
              >
                <span className="text-xs font-bold">+10</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

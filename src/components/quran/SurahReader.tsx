import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Pause,
  Play,
  Repeat,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  ListMusic,
  User
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
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
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
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

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio();
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audio.volume = volume;
    audioRef.current = audio;
    return audio;
  }, [volume]);

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
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
        markRead(surah.c);
      }).catch((err: unknown) => {
        setIsPlaying(false);
        setBuffering(false);
        const name = err instanceof Error ? err.name : "";
        if (name === "NotAllowedError") {
          toast.error("اضغط زر التشغيل مرة أخرى للسماح بتشغيل الصوت");
        } else {
          toast.error("تعذّر تحميل ملف التلاوة، جرّب قارئًا آخر");
        }
      });
    }
  }, [ensureAudio, markRead, online, settings.reciter, surah, surahId]);

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
      toast.error("تعذّر تشغيل التلاوة، جرّب قارئًا آخر");
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

  const handleVolumeChange = (value: number) => {
    const audio = audioRef.current;
    setVolume(value);
    setIsMuted(value === 0);
    if (audio) audio.volume = value;
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume || 1;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
    haptic("light");
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
    haptic("light");
  };

  if (isLoading || !surah) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="size-10 text-primary" />
        </motion.div>
        <p className="text-sm text-muted-foreground">جارٍ تحميل السورة...</p>
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
    <div className="min-h-screen pb-36">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 to-teal/10 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              {surah.t === "meccan" ? "مكية" : "مدنية"} · {toArabicNumber(surah.c)} آية
            </p>
            <h2 className="font-display text-3xl font-bold mt-1">{surah.n}</h2>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="size-4" />
            <span className="text-xs">{reciter.name}</span>
          </div>
        </div>
        
        {surahId !== 1 && surahId !== 9 && (
          <p className="quran-text mt-4 text-center text-xl text-primary">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}
      </motion.div>

      {/* القرآن */}
      <div className="rounded-2xl border border-border/50 bg-card p-6">
        <p className="quran-text text-justify text-xl leading-[2.8] tracking-wide" dir="rtl">
          {surah.v.map((text, index) => (
            <span key={index} className="inline">
              {text}
              <motion.span 
                whileHover={{ scale: 1.1 }}
                className="mx-1 inline-flex size-7 items-center justify-center rounded-full bg-primary/10 align-middle font-sans text-xs text-primary"
              >
                {toArabicNumber(index + 1)}
              </motion.span>
              {" "}
            </span>
          ))}
        </p>
      </div>
      
      {/* مشغل التلاوة المتحرك */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl"
          >
            {/* شريط التقدم */}
            <div 
              className="h-1.5 cursor-pointer rounded-t-2xl bg-secondary/30"
              onClick={(e) => {
                if (duration <= 0) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                seek(percent * duration);
              }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-teal transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                    className="flex size-12 items-center justify-center rounded-xl bg-primary/10"
                  >
                    <ListMusic className="size-6 text-primary" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-bold">{surah.n}</p>
                    <p className="text-xs text-muted-foreground">{reciter.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="tabular-nums">{fmt(position)}</span>
                  <span>/</span>
                  <span className="tabular-nums">{fmt(duration)}</span>
                </div>
              </div>

              {/* أزرار التحكم */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => skip(-10)}
                  className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80"
                  aria-label="تراجع 10 ثوان"
                >
                  <span className="text-xs font-bold">-10</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleLoop}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full transition-all",
                    isLooping ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                  aria-label="تكرار"
                >
                  <Repeat className="size-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggle}
                  className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal text-primary-foreground shadow-lg"
                  aria-label={isPlaying ? "إيقاف" : "تشغيل"}
                >
                  {buffering ? (
                    <Loader2 className="size-7 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="size-7" />
                  ) : (
                    <Play className="size-7 mr-1" />
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => skip(10)}
                  className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80"
                  aria-label="تقديم 10 ثوان"
                >
                  <span className="text-xs font-bold">+10</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80"
                  aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                >
                  {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* زر التشغيل السريع */}
      {!isPlaying && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={playSurah}
          disabled={!online}
          className={cn(
            "fixed bottom-24 left-4 right-4 z-50 mx-auto flex max-w-xl items-center justify-center gap-3 rounded-2xl py-4 font-medium shadow-lg transition-all",
            online 
              ? "bg-gradient-to-r from-primary to-teal text-primary-foreground" 
              : "bg-secondary text-muted-foreground cursor-not-allowed"
          )}
        >
          {buffering ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Play className="size-5" />
          )}
          <span>{online ? "تشغيل التلاوة" : "متصل بالإنترنت للتشغيل"}</span>
        </motion.button>
      )}
    </div>
  );
}

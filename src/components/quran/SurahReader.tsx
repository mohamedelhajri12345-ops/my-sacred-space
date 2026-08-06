import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Pause,
  Play,
  Repeat,
  Volume2,
  VolumeX,
  ListMusic,
  User,
  ChevronRight,
  SkipBack,
  SkipForward,
  X,
  Bookmark,
  Share2,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  getReciter,
  globalAyahNumber,
  loadQuran,
  surahAudioUrl,
  toArabicNumber,
  RECITERS,
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
  const { settings, online, updateSettings } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showReciterMenu, setShowReciterMenu] = useState(false);
  const [, setProgress] = useLocalStorage<ReadingProgress | null>("islamic:progress", null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSource, setCurrentSource] = useState(0);

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

  // Try different audio sources with fallback
  const tryPlayWithFallback = useCallback((surahNum: number, sourceIndex: number = 0) => {
    if (!online) {
      toast.error("التلاوة الصوتية تحتاج اتصالًا بالإنترنت");
      return;
    }

    const audio = ensureAudio();
    const sources = [
      surahAudioUrl(settings.reciter, surahNum),
      `https://everyayah.com/data/${reciter.dir}/${String(surahNum).padStart(3, '0')}.mp3`,
      `https://server8.mp3quran.net/${reciter.dir}/${String(surahNum).padStart(3, '0')}.mp3`,
    ];

    if (sourceIndex >= sources.length) {
      toast.error("تعذّر تحميل التلاوة، جرّب قارئًا آخر");
      setBuffering(false);
      return;
    }

    setBuffering(true);
    setPosition(0);
    setDuration(0);
    audio.src = sources[sourceIndex];
    audio.load();
    setCurrentSource(sourceIndex);

    audio.oncanplaythrough = () => {
      setBuffering(false);
      audio.play().then(() => {
        setIsPlaying(true);
        markRead(surah?.c ?? 0);
      }).catch((err) => {
        if (err.name === "NotAllowedError") {
          toast.error("اضغط زر التشغيل مرة أخرى للسماح بتشغيل الصوت");
        } else {
          // Try next source
          tryPlayWithFallback(surahNum, sourceIndex + 1);
        }
      });
    };

    audio.onerror = () => {
      tryPlayWithFallback(surahNum, sourceIndex + 1);
    };
  }, [ensureAudio, markRead, online, reciter.dir, settings.reciter, surah?.c]);

  const playSurah = useCallback(() => {
    if (!surah) return;
    tryPlayWithFallback(surahId, 0);
  }, [surah, surahId, tryPlayWithFallback]);

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

  const selectReciter = (reciterId: string) => {
    haptic("medium");
    updateSettings({ reciter: reciterId });
    setShowReciterMenu(false);
    if (isPlaying) {
      playSurah();
    }
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
          <button
            onClick={() => setShowReciterMenu(!showReciterMenu)}
            className="card-glass flex items-center gap-2 rounded-xl px-3 py-2 text-xs"
          >
            <User className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">{reciter.name}</span>
          </button>
        </div>
        
        {surahId !== 1 && surahId !== 9 && (
          <p className="quran-text mt-4 text-center text-xl text-primary">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}
      </motion.div>

      {/* قائمة القراء */}
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
              <button onClick={() => setShowReciterMenu(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>
            <div className="max-h-80 space-y-1 overflow-y-auto">
              {RECITERS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => selectReciter(r.id)}
                  className={cn(
                    "w-full rounded-xl px-4 py-3 text-right text-sm transition-all",
                    settings.reciter === r.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-secondary/50"
                  )}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            className="card-glass fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl shadow-2xl"
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
                    className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-teal text-primary-foreground"
                  >
                    <ListMusic className="size-6" />
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
              <div className="flex items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => skip(-10)}
                  className="flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80"
                  aria-label="تراجع 10 ثوان"
                >
                  <SkipBack className="size-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleLoop}
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full transition-all",
                    isLooping ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                  aria-label="تكرار"
                >
                  <Repeat className="size-5" />
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
                  className="flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80"
                  aria-label="تقديم 10 ثوان"
                >
                  <SkipForward className="size-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80"
                  aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                >
                  {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
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

/**
 * مشغل صوتي احترافي للتطبيق الإسلامي
 * يدعم التلاوات والأناشيد والأدعية
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Loader2,
  AlertCircle,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export interface AudioSource {
  id: string;
  title: string;
  artist?: string;
  audioUrl: string;
  coverImage?: string;
  duration?: number;
}

interface AudioPlayerProps {
  sources: AudioSource[];
  initialSourceId?: string;
  autoPlay?: boolean;
  onTrackChange?: (source: AudioSource) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  compact?: boolean;
  className?: string;
}

export function AudioPlayer({
  sources,
  initialSourceId,
  autoPlay = false,
  onTrackChange,
  onPlayStateChange,
  compact = false,
  className = ""
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSource, setCurrentSource] = useState<AudioSource | null>(() => {
    if (initialSourceId) {
      return sources.find(s => s.id === initialSourceId) || sources[0] || null;
    }
    return sources[0] || null;
  });
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(compact);
  const [error, setError] = useState<string | null>(null);

  // تهيئة المشغل
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    audioRef.current = new Audio();
    audioRef.current.preload = "metadata";
    audioRef.current.crossOrigin = "anonymous";
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // تحديث مصدر الصوت عند التغيير
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSource) return;

    audio.src = currentSource.audioUrl;
    audio.load();
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setError(null);

    if (autoPlay || isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentSource?.id]);

  // ربط أحداث المشغل
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlers = {
      timeupdate: () => {
        setCurrentTime(audio.currentTime);
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      },
      loadedmetadata: () => {
        setDuration(audio.duration);
        setIsBuffering(false);
        setError(null);
      },
      playing: () => {
        setIsPlaying(true);
        setIsBuffering(false);
        onPlayStateChange?.(true);
      },
      pause: () => {
        setIsPlaying(false);
        onPlayStateChange?.(false);
      },
      waiting: () => setIsBuffering(true),
      canplay: () => setIsBuffering(false),
      ended: () => {
        setIsPlaying(false);
        handleNext();
      },
      error: () => {
        setIsPlaying(false);
        setIsBuffering(false);
        setError("تعذر تحميل الملف الصوتي");
      }
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      audio.addEventListener(event, handler as EventListener);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        audio.removeEventListener(event, handler as EventListener);
      });
    };
  }, [onPlayStateChange]);

  const handlePlayPause = useCallback(() => {
    haptic("soft");
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        setError("اضغط مرة أخرى للتشغيل");
      });
    }
  }, [isPlaying]);

  const handleSeek = useCallback((value: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    
    const time = (value / 100) * duration;
    audio.currentTime = time;
    setProgress(value);
  }, [duration]);

  const handleVolumeChange = useCallback((value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setVolume(value);
    setIsMuted(value === 0);
    audio.volume = value;
  }, []);

  const handleSkip = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    haptic("light");
  }, [currentTime, duration]);

  const handleNext = useCallback(() => {
    if (!currentSource) return;
    const currentIndex = sources.findIndex(s => s.id === currentSource.id);
    const nextSource = sources[currentIndex + 1];
    if (nextSource) {
      setCurrentSource(nextSource);
      onTrackChange?.(nextSource);
      haptic("soft");
    }
  }, [currentSource, sources, onTrackChange]);

  const handlePrevious = useCallback(() => {
    if (!currentSource) return;
    const currentIndex = sources.findIndex(s => s.id === currentSource.id);
    if (currentIndex > 0) {
      setCurrentSource(sources[currentIndex - 1]);
      onTrackChange?.(sources[currentIndex - 1]);
      haptic("soft");
    }
  }, [currentSource, sources, onTrackChange]);

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

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentSource) {
    return null;
  }

  // المشغل المصغر
  if (isMinimized) {
    return (
      <div 
        className={cn(
          "fixed bottom-20 left-4 right-4 z-50 max-w-lg mx-auto",
          "glass-card rounded-2xl overflow-hidden transition-all duration-300",
          className
        )}
      >
        <div 
          className="h-1 bg-white/10 cursor-pointer" 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            handleSeek(percent);
          }}
        >
          <div 
            className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-soft)] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="p-3 flex items-center gap-3">
          <button
            onClick={handlePlayPause}
            className={cn(
              "flex size-10 items-center justify-center rounded-full transition-all",
              isPlaying ? "bg-[var(--gold)] text-[#1a1a3a]" : "bg-white/20 text-white"
            )}
          >
            {isBuffering ? (
              <Loader2 className="size-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5 mr-0.5" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentSource.title}</p>
            {currentSource.artist && (
              <p className="text-[10px] text-white/60 truncate">{currentSource.artist}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/50 tabular-nums">
              {formatTime(currentTime)}
            </span>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1.5 text-white/60 hover:text-white transition-colors"
            >
              <ChevronUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // المشغل الكامل
  return (
    <div className={cn("space-y-4", className)}>
      {/* رسالة الخطأ */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
          <AlertCircle className="size-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* معلومات المقطع */}
      <div className="flex items-center gap-4">
        {currentSource.coverImage && (
          <img 
            src={currentSource.coverImage} 
            alt={currentSource.title}
            className="w-20 h-20 rounded-xl object-cover shadow-lg"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[var(--gold)] text-lg">{currentSource.title}</h3>
          {currentSource.artist && (
            <p className="text-sm text-muted-foreground">{currentSource.artist}</p>
          )}
        </div>
      </div>

      {/* شريط التقدم */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => handleSeek(parseFloat(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--gold)]"
          style={{
            background: `linear-gradient(to left, var(--gold) ${progress}%, rgba(255,255,255,0.1) ${progress}%)`
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrevious}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          title="السابق"
        >
          <SkipBack className="size-5" />
        </button>

        <button
          onClick={() => handleSkip(-10)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          title="رجوع 10 ثوان"
        >
          <span className="text-sm font-bold">-10</span>
        </button>

        <button
          onClick={handlePlayPause}
          className={cn(
            "flex size-14 items-center justify-center rounded-full transition-all",
            "bg-gradient-to-br from-[var(--gold)] to-[var(--gold-soft)]",
            "text-[#1a1a3a] shadow-[0_8px_30px_rgba(212,175,55,0.5)]",
            "active:scale-95 hover:scale-105"
          )}
        >
          {isBuffering ? (
            <Loader2 className="size-7 animate-spin" />
          ) : isPlaying ? (
            <Pause className="size-7" />
          ) : (
            <Play className="size-7 mr-1" />
          )}
        </button>

        <button
          onClick={() => handleSkip(10)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          title="تقدم 10 ثوان"
        >
          <span className="text-sm font-bold">+10</span>
        </button>

        <button
          onClick={handleNext}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          title="التالي"
        >
          <SkipForward className="size-5" />
        </button>
      </div>

      {/* التحكم بالصوت */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMute}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-[var(--gold)]"
          style={{
            background: `linear-gradient(to left, var(--gold) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%)`
          }}
        />
      </div>

      {/* زر التصغير */}
      <button
        onClick={() => setIsMinimized(true)}
        className="w-full py-2 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown className="size-4 mx-auto" />
      </button>
    </div>
  );
}

export default AudioPlayer;

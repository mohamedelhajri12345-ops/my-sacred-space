/**
 * مشغل القرآن العائم المتقدم
 * - يبقى ظاهراً أثناء التنقل
 * - يعمل في الخلفية
 * - قابل للتصغير/التكبير
 * - مع تحكم كامل
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptics";
import { toArabicNumber } from "@/lib/quran";

interface FloatingAudioPlayerProps {
  isVisible: boolean;
  currentAyah?: number;
  currentSurah?: string;
  surahName?: string;
  onClose?: () => void;
}

export function FloatingAudioPlayer({
  isVisible,
  currentAyah = 1,
  currentSurah = "",
  surahName = "",
  onClose,
}: FloatingAudioPlayerProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  
  // Refs for audio control
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window === "undefined") return;
    audioRef.current = new Audio();
    audioRef.current.preload = "metadata";
    
    const audio = audioRef.current;
    
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    });
    
    return () => {
      audio.pause();
      audio.src = "";
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Progress tracking
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      progressInterval.current = window.setInterval(() => {
        if (audioRef.current) {
          const { currentTime, duration } = audioRef.current;
          setCurrentTime(currentTime);
          if (duration > 0) {
            setProgress((currentTime / duration) * 100);
          }
        }
      }, 250);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = useCallback(() => {
    haptic("light");
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const skipForward = useCallback(() => {
    haptic("light");
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        audioRef.current.duration
      );
    }
  }, []);

  const skipBackward = useCallback(() => {
    haptic("light");
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    haptic("light");
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = percent * duration;
      setProgress(percent * 100);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-xl",
            isMinimized ? "w-auto" : "w-full"
          )}
        >
          <div className={cn(
            "glass-card overflow-hidden",
            isMinimized ? "rounded-full px-4 py-2" : "rounded-2xl"
          )}>
            {!isMinimized ? (
              // Expanded View
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                      <Volume2 className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {surahName || "سورة مختارة"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        الآية {toArabicNumber(currentAyah)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="تصغير"
                    >
                      <Minimize2 className="size-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="إغلاق"
                    >
                      <X className="size-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div 
                  className="relative h-1.5 bg-white/20 rounded-full cursor-pointer mb-3"
                  onClick={handleSeek}
                >
                  <motion.div
                    className="absolute inset-y-0 right-0 bg-gradient-to-l from-emerald-400 to-emerald-500 rounded-full"
                    style={{ width: `${progress}%` }}
                    layoutId="progress"
                  />
                </div>

                {/* Time */}
                <div className="flex justify-between text-xs text-white/70 mb-4">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={skipBackward}
                    className="p-3 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="رجوع 10 ثوان"
                  >
                    <SkipBack className="size-6 text-white" />
                  </button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="p-4 rounded-full gradient-gold text-white shadow-lg"
                    aria-label={isPlaying ? "إيقاف" : "تشغيل"}
                  >
                    {isPlaying ? (
                      <Pause className="size-7" />
                    ) : (
                      <Play className="size-7 mr-0.5" />
                    )}
                  </motion.button>
                  
                  <button
                    onClick={skipForward}
                    className="p-3 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="تقديم 10 ثوان"
                  >
                    <SkipForward className="size-6 text-white" />
                  </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                  >
                    {isMuted ? (
                      <VolumeX className="size-4 text-white/70" />
                    ) : (
                      <Volume2 className="size-4 text-white/70" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setVolume(val);
                      if (audioRef.current) {
                        audioRef.current.volume = val;
                      }
                      if (val > 0 && isMuted) {
                        setIsMuted(false);
                        if (audioRef.current) audioRef.current.muted = false;
                      }
                    }}
                    className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  />
                </div>
              </div>
            ) : (
              // Minimized View
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="p-2 rounded-full gradient-gold text-white"
                  aria-label={isPlaying ? "إيقاف" : "تشغيل"}
                >
                  {isPlaying ? (
                    <Pause className="size-5" />
                  ) : (
                    <Play className="size-5 mr-0.5" />
                  )}
                </motion.button>
                
                <div className="flex flex-col min-w-0">
                  <p className="text-xs font-medium truncate text-white">
                    {surahName}
                  </p>
                  <p className="text-[10px] text-white/60">
                    الآية {toArabicNumber(currentAyah)}
                  </p>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="تكبير"
                  >
                    <Maximize2 className="size-4 text-white/70" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="إغلاق"
                  >
                    <X className="size-4 text-white/70" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Context for managing audio player state globally
import { createContext, useContext, useRef, type ReactNode } from "react";

interface AudioPlayerContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  currentAyah: number;
  setCurrentAyah: (ayah: number) => void;
  currentSurah: string;
  setCurrentSurah: (surah: string) => void;
  surahName: string;
  setSurahName: (name: string) => void;
  audioUrl: string | null;
  setAudioUrl: (url: string | null) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [currentSurah, setCurrentSurah] = useState("");
  const [surahName, setSurahName] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  return (
    <AudioPlayerContext.Provider
      value={{
        isVisible,
        setIsVisible,
        currentAyah,
        setCurrentAyah,
        currentSurah,
        setCurrentSurah,
        surahName,
        setSurahName,
        audioUrl,
        setAudioUrl,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used inside AudioPlayerProvider");
  return ctx;
}

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  ChevronDown,
  Music,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptics";
import {
  SONGS,
  CATEGORIES,
  getSongsByCategory,
  formatDuration,
  type Song,
} from "@/lib/music";
import { setupMediaSession, updateMediaSessionState } from "@/lib/notifications";
import { useLocalStorage } from "@/lib/use-local-storage";

const LAST_SONG_KEY = "islamic:lastSong";

export function MusicLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [lastSongId, setLastSongId] = useLocalStorage<string | null>(LAST_SONG_KEY, null);

  const songs = getSongsByCategory(selectedCategory);

  // استعادة آخر أغنية تم تشغيلها
  useEffect(() => {
    if (lastSongId && !currentSong) {
      const song = SONGS.find((s) => s.id === lastSongId);
      if (song) {
        setCurrentSong(song);
      }
    }
  }, [lastSongId, currentSong]);

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio();
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;
    return audio;
  }, []);

  // إعداد Media Session API للتحكم من الشاشة الرئيسية
  useEffect(() => {
    if (typeof navigator === "undefined" || !('mediaSession' in navigator)) return;

    setupMediaSession(
      () => {
        const audio = audioRef.current;
        if (audio && audio.src) {
          void audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      },
      () => {
        const audio = audioRef.current;
        if (audio) {
          audio.pause();
          setIsPlaying(false);
        }
      },
      () => {
        // أغنية التالية
        if (currentSong) {
          const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
          const nextSong = songs[currentIndex + 1];
          if (nextSong) {
            playSong(nextSong);
          }
        }
      },
      () => {
        // أغنية السابقة
        if (currentSong) {
          const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
          if (currentIndex > 0) {
            const prevSong = songs[currentIndex - 1];
            if (prevSong) {
              playSong(prevSong);
            }
          }
        }
      }
    );
  }, [currentSong, songs]);

  // تحديث Media Session عند تغيير الأغنية أو حالة التشغيل
  useEffect(() => {
    if (currentSong && isPlaying) {
      updateMediaSessionState('playing');
      
      if ('mediaSession' in navigator) {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: currentSong.title,
            artist: currentSong.artist,
            album: currentSong.description || "المكتبة الإسلامية",
            artwork: [
              { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
              { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
            ]
          });
        } catch {
          // قد لا يعمل في جميع المتصفحات
        }
      }
    } else if (!isPlaying) {
      updateMediaSessionState('paused');
    }
  }, [currentSong, isPlaying]);

  const playSong = useCallback((song: Song) => {
    const audio = ensureAudio();
    setBuffering(true);
    setPosition(0);
    setDuration(0);
    setAudioError(null);
    audio.src = song.url;
    audio.load();
    setCurrentSong(song);
    setLastSongId(song.id);
    
    void audio.play().then(() => {
      setIsPlaying(true);
      setAudioError(null);
    }).catch((err) => {
      setIsPlaying(false);
      setBuffering(false);
      const errorMsg = "عذراً، حدث خطأ في تحميل الملف الصوتي، يرجى التحقق من الاتصال";
      setAudioError(errorMsg);
      toast.error(errorMsg);
    });
  }, [ensureAudio, setLastSongId]);

  // ربط أحداث المشغّل
  useEffect(() => {
    const audio = ensureAudio();
    const onTime = () => setPosition(audio.currentTime);
    const onMeta = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setBuffering(false);
      setAudioError(null);
    };
    const onPlay = () => {
      setIsPlaying(true);
      setBuffering(false);
      setAudioError(null);
    };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setBuffering(true);
    const onEnded = () => {
      if (isLooping && currentSong) {
        audio.currentTime = 0;
        void audio.play();
      } else {
        const currentIndex = songs.findIndex((s) => s.id === currentSong?.id);
        const nextSong = songs[currentIndex + 1];
        if (nextSong) {
          playSong(nextSong);
        } else {
          setIsPlaying(false);
          updateMediaSessionState('none');
        }
      }
    };
    const onError = () => {
      setIsPlaying(false);
      setBuffering(false);
      const errorMsg = "عذراً، حدث خطأ في تحميل الملف الصوتي، يرجى التحقق من الاتصال";
      setAudioError(errorMsg);
      toast.error(errorMsg);
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
  }, [ensureAudio, isLooping, currentSong, songs, playSong]);

  const toggle = () => {
    haptic("soft");
    const audio = ensureAudio();
    if (isPlaying) {
      audio.pause();
      return;
    }
    if (audio.src) {
      void audio.play().catch(() => {
        const errorMsg = "عذراً، حدث خطأ في متابعة التشغيل";
        setAudioError(errorMsg);
        toast.error(errorMsg);
      });
      return;
    }
    const firstSong = songs[0];
    if (firstSong) {
      playSong(firstSong);
    }
  };

  const seek = (value: number) => {
    const audio = ensureAudio();
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = value;
    setPosition(value);
  };

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* رسالة الخطأ */}
      {audioError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
          <AlertCircle className="size-5 shrink-0" />
          <span>{audioError}</span>
        </div>
      )}

      {/* فئات المكتبة */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              haptic("light");
              setSelectedCategory(cat.id);
            }}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
              selectedCategory === cat.id
                ? "bg-[var(--gold)] text-[#1a1a3a] shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                : "bg-white/10 text-white/70 hover:bg-white/15"
            )}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* قائمة الأغاني */}
      <div className="space-y-2">
        {songs.map((song) => (
          <button
            key={song.id}
            onClick={() => {
              haptic("medium");
              playSong(song);
            }}
            className={cn(
              "w-full glass-card rounded-xl p-4 text-right transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
              currentSong?.id === song.id && isPlaying && "ring-2 ring-[var(--gold)]"
            )}
          >
            <div className="flex items-center gap-4">
              {/* أيقونة التشغيل */}
              <div className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                currentSong?.id === song.id && isPlaying
                  ? "bg-[var(--gold)] text-[#1a1a3a]"
                  : "bg-white/15 text-white/70"
              )}>
                {currentSong?.id === song.id && buffering ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : currentSong?.id === song.id && isPlaying ? (
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="size-1 rounded-full bg-current animate-bounce"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                ) : (
                  <Music className="size-5" />
                )}
              </div>

              {/* معلومات الأغنية */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{song.title}</p>
                <p className="text-xs text-white/60 truncate">{song.artist}</p>
                {song.description && (
                  <p className="text-[10px] text-white/40 truncate mt-0.5">{song.description}</p>
                )}
              </div>

              {/* المدة */}
              <div className="flex items-center gap-2 text-white/50">
                <span className="text-xs tabular-nums">{formatDuration(song.duration)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* مشغل متحرك */}
      {currentSong && (
        <>
          {/* المشغل المصغر */}
          {isMinimized && (
            <button
              onClick={() => setIsMinimized(false)}
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
                <p className="text-xs font-bold text-white max-w-[120px] truncate">{currentSong.title}</p>
                <p className="text-[10px] text-white/60 truncate max-w-[120px]">{currentSong.artist}</p>
              </div>
              <div className="h-8 w-px bg-white/20 mx-1" />
              <span className="text-[10px] text-white/60 tabular-nums">{formatDuration(Math.floor(position))}</span>
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
                seek(percent * duration);
              }}>
                <div 
                  className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-soft)] transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              
              <div className="p-4">
                {/* معلومات الأغنية */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--gold)]/20">
                      <Music className="size-6 text-[var(--gold)]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white drop-shadow-md">{currentSong.title}</p>
                      <p className="text-[10px] text-white/60">{currentSong.artist}</p>
                      {currentSong.description && (
                        <p className="text-[10px] text-white/40 truncate">{currentSong.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tabular-nums text-white/50">{formatDuration(Math.floor(position))}</span>
                    <span className="text-[10px] text-white/30">/</span>
                    <span className="text-[10px] tabular-nums text-white/50">{formatDuration(Math.floor(duration))}</span>
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white mr-2"
                      aria-label="تصغير"
                    >
                      <ChevronDown className="size-4" />
                    </button>
                  </div>
                </div>

                {/* أزرار التحكم */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      haptic("soft");
                      setIsShuffled(!isShuffled);
                    }}
                    className={cn(
                      "soothing-btn flex size-11 items-center justify-center rounded-full backdrop-blur-sm transition-all active:scale-90",
                      isShuffled ? "bg-[var(--gold)]/30 text-[var(--gold)]" : "bg-white/15 text-white/70 hover:bg-white/25"
                    )}
                    aria-label="عشوائي"
                  >
                    <Shuffle className="size-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      haptic("soft");
                      seek(Math.max(0, position - 10));
                    }}
                    className="soothing-btn flex size-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 active:scale-90"
                    aria-label="تراجع 10 ثوان"
                  >
                    <span className="text-xs font-bold">-10</span>
                  </button>
                  
                  <button
                    onClick={toggle}
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
                      seek(Math.min(duration, position + 10));
                    }}
                    className="soothing-btn flex size-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 active:scale-90"
                    aria-label="تقديم 10 ثوان"
                  >
                    <span className="text-xs font-bold">+10</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      haptic("soft");
                      setIsLooping(!isLooping);
                    }}
                    className={cn(
                      "soothing-btn flex size-11 items-center justify-center rounded-full backdrop-blur-sm transition-all active:scale-90",
                      isLooping ? "bg-[var(--gold)] text-[#1a1a3a] shadow-[0_4px_20px_rgba(212,175,55,0.4)]" : "bg-white/15 text-white/70 hover:bg-white/25"
                    )}
                    aria-label="تكرار"
                  >
                    <Repeat className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* مسافة إضافية للأسفل */}
      <div className="h-48" />
    </div>
  );
}

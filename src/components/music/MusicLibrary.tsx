import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  ChevronDown,
  Music2,
  ListMusic,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptics";
import {
  SONGS,
  CATEGORIES,
  getSongsByCategory,
  formatDuration,
  type Song,
} from "@/lib/music";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const songs = getSongsByCategory(selectedCategory);

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio();
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;
    return audio;
  }, []);

  const playSong = useCallback((song: Song) => {
    const audio = ensureAudio();
    setBuffering(true);
    setPosition(0);
    setDuration(0);
    audio.src = song.url;
    audio.load();
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
        setCurrentSong(song);
      }).catch((err) => {
        setIsPlaying(false);
        setBuffering(false);
        toast.error("تعذّر تحميل الأغنية - تأكد من اتصالك بالإنترنت");
      });
    }
  }, [ensureAudio]);

  useEffect(() => {
    const audio = ensureAudio();
    const handlers = {
      timeupdate: () => setPosition(audio.currentTime),
      loadedmetadata: () => { setDuration(Number.isFinite(audio.duration) ? audio.duration : 0); setBuffering(false); },
      playing: () => { setIsPlaying(true); setBuffering(false); },
      pause: () => setIsPlaying(false),
      waiting: () => setBuffering(true),
      ended: () => {
        if (isLooping && currentSong) {
          audio.currentTime = 0;
          void audio.play();
        } else {
          const currentIndex = songs.findIndex((s) => s.id === currentSong?.id);
          if (currentIndex < songs.length - 1) {
            playSong(songs[currentIndex + 1]);
          } else {
            setIsPlaying(false);
          }
        }
      },
      error: () => { setIsPlaying(false); setBuffering(false); toast.error("تعذّر تشغيل الأغنية"); }
    };
    Object.entries(handlers).forEach(([event, handler]) => audio.addEventListener(event, handler as EventListener));
    return () => Object.entries(handlers).forEach(([event, handler]) => audio.removeEventListener(event, handler as EventListener));
  }, [ensureAudio, isLooping, currentSong, songs, playSong]);

  const toggle = () => {
    haptic("soft");
    const audio = ensureAudio();
    if (isPlaying) { audio.pause(); return; }
    if (audio.src && audio.src !== "") { audio.play().catch(() => toast.error("تعذّر متابعة التشغيل")); return; }
    if (songs.length > 0) playSong(songs[0]);
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
      {/* فئات المكتبة */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { haptic("light"); setSelectedCategory(cat.id); }}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            {cat.icon} {cat.name}
          </motion.button>
        ))}
      </div>

      {/* قائمة الأغاني */}
      <div className="space-y-2">
        {songs.map((song) => (
          <motion.button
            key={song.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => { haptic("medium"); playSong(song); }}
            className={cn(
              "w-full rounded-xl border p-4 text-right transition-all duration-300",
              currentSong?.id === song.id && isPlaying 
                ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                : "border-border bg-card hover:bg-secondary/20"
            )}
          >
            <div className="flex items-center gap-4">
              <motion.div 
                animate={currentSong?.id === song.id && isPlaying ? { rotate: 360 } : {}}
                transition={{ duration: 3, repeat: currentSong?.id === song.id && isPlaying ? Infinity : 0, ease: "linear" }}
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                  currentSong?.id === song.id && isPlaying
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {currentSong?.id === song.id && buffering ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : currentSong?.id === song.id && isPlaying ? (
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="size-1 rounded-full bg-current animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                ) : (
                  <Music2 className="size-5" />
                )}
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{currentSong?.id === song.id && isPlaying ? "تشغيل الآن..." : song.title}</p>
                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs tabular-nums">{formatDuration(song.duration)}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* مشغل متحرك */}
      <AnimatePresence>
        {currentSong && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl"
          >
            {/* شريط التقدم */}
            <div 
              className="h-1.5 cursor-pointer rounded-t-2xl bg-secondary/30" 
              onClick={(e) => { if (duration <= 0) return; const rect = e.currentTarget.getBoundingClientRect(); seek(((e.clientX - rect.left) / rect.width) * duration); }}
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
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                    className="flex size-12 items-center justify-center rounded-xl bg-primary/10"
                  >
                    <ListMusic className="size-6 text-primary" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-bold">{currentSong.title}</p>
                    <p className="text-xs text-muted-foreground">{currentSong.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs tabular-nums text-muted-foreground">{formatDuration(Math.floor(position))}</span>
                  <span className="text-xs text-muted-foreground/50">/</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{formatDuration(Math.floor(duration))}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMinimized(true)}
                    className="flex size-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground mr-2"
                    aria-label="تصغير"
                  >
                    <ChevronDown className="size-4" />
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { haptic("soft"); setIsShuffled(!isShuffled); }}
                  className={cn("flex size-10 items-center justify-center rounded-full transition-all", isShuffled ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}
                  aria-label="عشوائي"
                >
                  <Shuffle className="size-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { haptic("soft"); seek(Math.max(0, position - 10)); }}
                  className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80"
                  aria-label="تراجع 10 ثوان"
                >
                  <span className="text-xs font-bold">-10</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggle}
                  className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal text-primary-foreground shadow-lg"
                  aria-label={isPlaying ? "إيقاف" : "تشغيل"}
                >
                  {buffering ? <Loader2 className="size-7 animate-spin" /> : isPlaying ? <Pause className="size-7" /> : <Play className="size-7 mr-1" />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { haptic("soft"); seek(Math.min(duration, position + 10)); }}
                  className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80"
                  aria-label="تقديم 10 ثوان"
                >
                  <span className="text-xs font-bold">+10</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { haptic("soft"); setIsLooping(!isLooping); }}
                  className={cn("flex size-10 items-center justify-center rounded-full transition-all", isLooping ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}
                  aria-label="تكرار"
                >
                  <Repeat className="size-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="h-48" />
    </div>
  );
}

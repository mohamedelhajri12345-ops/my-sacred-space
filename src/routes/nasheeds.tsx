import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  Play, Pause, Volume2, VolumeX,
  Search, Mic, Hand, BookOpen, Wind, X, 
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { NASHEED_CATEGORIES, NASHEEDS, type Nasheed } from "@/data/nasheeds";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useApp } from "@/lib/app-context";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/nasheeds")({
  head: () => ({
    meta: [
      { title: "الأناشيد والأدعية — نور" },
      { name: "description", content: "مكتبة أناشيد إسلامية وأدعية مأثورة وتلاوات قصيرة وأصوات للعبادة." },
      { property: "og:title", content: "الأناشيد والأدعية — نور" },
      { property: "og:description", content: "أناشيد حماسية وأدعية وتلاوات قصيرة بصوت مشايخ معروفين." },
    ],
  }),
  component: NasheedsPage,
});

function CategoryIcon({ categoryId, className }: { categoryId: string; className?: string }) {
  switch (categoryId) {
    case "nasheed":
      return <Mic className={className} />;
    case "duaa":
      return <Hand className={className} />;
    case "tilawa":
      return <BookOpen className={className} />;
    case "ambient":
      return <Wind className={className} />;
    default:
      return <Mic className={className} />;
  }
}

function AudioPlayer({
  currentTrack,
  onClose,
}: {
  currentTrack: Nasheed | null;
  onClose: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      setIsPlaying(true);
      audioRef.current.play().catch(() => {
        toast.error("عذراً، حدث خطأ في تحميل الملف الصوتي");
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  }, [currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleError = () => {
    setIsPlaying(false);
    setIsLoading(false);
    toast.error("عذراً، تعذر تحميل الملف الصوتي. يرجى التحقق من الاتصال بالإنترنت");
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        toast.error("عذراً، حدث خطأ في تشغيل الملف الصوتي");
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed inset-x-0 bottom-[5.75rem] z-50 mx-auto w-[calc(100%-1.5rem)] max-w-xl rounded-2xl border border-[color-mix(in_oklab,var(--gold)_40%,transparent)] bg-card px-4 py-3 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous"
        controls
        className="hidden"
      />
      
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{currentTrack.title}</p>
          <p className="truncate text-[11px] text-muted-foreground">{currentTrack.artist}</p>
        </div>
        <button
          onClick={onClose}
          className="press flex size-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-9 text-[10px] tabular-nums text-muted-foreground">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={handleSeek}
          className="h-1.5 flex-1 accent-[var(--gold)]"
        />
        <span className="w-9 text-[10px] tabular-nums text-muted-foreground">{formatTime(duration)}</span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="press rounded-lg p-1.5 text-muted-foreground hover:bg-secondary">
            {isMuted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="h-1 w-16 accent-[var(--gold)]"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="press flex size-11 items-center justify-center rounded-2xl gradient-warm text-primary-foreground"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function NasheedsPage() {
  const { online } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("nasheed");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTrack, setCurrentTrack] = useLocalStorage<Nasheed | null>("islamic:lastTrack", null);

  const categories = NASHEED_CATEGORIES;
  const filteredNasheeds = searchQuery
    ? NASHEEDS.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : NASHEEDS.filter((n) => n.category === selectedCategory);

  const handlePlayTrack = (nasheed: Nasheed) => {
    if (!online) {
      toast.error("التلاوات والأناشيد تحتاج اتصالًا بالإنترنت");
      return;
    }
    haptic("medium");
    setCurrentTrack(nasheed);
  };

  const handleClosePlayer = () => {
    setCurrentTrack(null);
  };

  return (
    <AppShell title="الأناشيد والأدعية" subtitle="أناشيد إسلامية وأدعية وتلاوات">
      <div className="space-y-4 pb-24">
        {/* شريط البحث */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm pb-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن نشيد أو قارئ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="surface-card w-full rounded-xl border border-border py-2.5 pr-10 text-sm outline-none placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* التصنيفات */}
        {!searchQuery && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  haptic("light");
                  setSelectedCategory(cat.id);
                }}
                className={cn(
                  "press surface-card flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
                  selectedCategory === cat.id
                    ? "gradient-gold border-transparent text-gold-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
                )}
              >
                <CategoryIcon categoryId={cat.id} className="size-6" />
                <span className="text-[11px] font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* قائمة الأناشيد */}
        <div className="space-y-2">
          {filteredNasheeds.length === 0 ? (
            <div className="surface-card rounded-xl p-8 text-center">
              <p className="text-muted-foreground">لم يتم العثور على نتائج</p>
            </div>
          ) : (
            filteredNasheeds.map((nasheed) => (
              <button
                key={nasheed.id}
                onClick={() => handlePlayTrack(nasheed)}
                className={cn(
                  "press surface-card w-full rounded-xl border p-3 text-right transition-all hover:bg-secondary",
                  currentTrack?.id === nasheed.id && "border-[var(--gold)] bg-secondary"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      currentTrack?.id === nasheed.id
                        ? "gradient-gold text-gold-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {currentTrack?.id === nasheed.id ? (
                      <Volume2 className="size-5" />
                    ) : (
                      <CategoryIcon categoryId={nasheed.category} className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{nasheed.title}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{nasheed.artist}</p>
                    {nasheed.description && (
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground/70">
                        {nasheed.description}
                      </p>
                    )}
                  </div>
                  {nasheed.duration && (
                    <span className="text-[10px] text-muted-foreground">{nasheed.duration}</span>
                  )}
                  <div className="size-8 rounded-full bg-primary/10 p-1.5 text-primary">
                    <Play className="size-full" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* مشغل الصوت */}
      <AudioPlayer currentTrack={currentTrack} onClose={handleClosePlayer} />
    </AppShell>
  );
}

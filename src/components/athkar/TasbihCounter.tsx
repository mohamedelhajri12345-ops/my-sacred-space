import { useState } from "react";
import { RotateCcw, Vibrate, Sparkles, Flame, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { TASBIH_PRESETS } from "@/data/athkar";
import { haptic } from "@/lib/haptics";
import { useApp } from "@/lib/app-context";
import { useLocalStorage } from "@/lib/use-local-storage";
import { toArabicNumber } from "@/lib/quran";
import { cn } from "@/lib/utils";

export function TasbihCounter() {
  const { markThikrSession } = useApp();
  const [presetIndex, setPresetIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useLocalStorage<number>("islamic:tasbih-rounds", 0);
  const [vibrate, setVibrate] = useLocalStorage<boolean>("islamic:tasbih-vibrate", true);

  const preset = TASBIH_PRESETS[presetIndex]!;
  const percent = Math.min(100, (count / preset.target) * 100);
  const [pop, setPop] = useState(0);

  const increment = () => {
    const next = count + 1;
    setPop((p) => p + 1);
    if (vibrate) haptic(next % preset.target === 0 ? "success" : "light");
    if (next >= preset.target) {
      setCount(0);
      setRounds((r) => r + 1);
      markThikrSession();
      toast.success(`🎉 أتممت ${toArabicNumber(preset.target)} تسبيحة من ${preset.label}`);
    } else {
      setCount(next);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preset Selection */}
      <div className="flex flex-wrap gap-2 justify-center">
        {TASBIH_PRESETS.map((p, i) => (
          <motion.button
            key={p.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              haptic("light");
              setPresetIndex(i);
              setCount(0);
            }}
            className={cn(
              "press rounded-full border px-4 py-2 text-sm font-medium transition-all",
              i === presetIndex
                ? "gradient-gold border-transparent text-gold-foreground shadow-lg"
                : "border-border/50 bg-card text-muted-foreground hover:bg-secondary",
            )}
          >
            {p.label}
          </motion.button>
        ))}
      </div>

      {/* Main Counter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 p-8"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Label */}
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-bold text-white mb-2">{preset.label}</h2>
            <p className="text-sm text-white/60">اضغط للتسبيح</p>
          </motion.div>

          {/* Circular Counter */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={increment}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 blur-xl opacity-50 animate-pulse" />
            
            {/* Progress Ring */}
            <div className="relative flex size-56 items-center justify-center rounded-full bg-gradient-to-br from-indigo-800 to-purple-900 shadow-2xl ring-4 ring-purple-500/30">
              <svg className="absolute inset-2 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={276}
                  initial={{ strokeDashoffset: 276 }}
                  animate={{ strokeDashoffset: 276 - (276 * percent) / 100 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Count Display */}
              <div className="text-center">
                <motion.span 
                  key={pop}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="block text-5xl font-bold text-white tabular-nums"
                >
                  {toArabicNumber(count)}
                </motion.span>
                <span className="mt-1 block text-sm text-white/60">
                  من {toArabicNumber(preset.target)}
                </span>
              </div>
            </div>
          </motion.button>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptic("medium");
                setCount(0);
              }}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <RotateCcw className="size-4" /> تصفير
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptic("medium");
                setVibrate(!vibrate);
              }}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm backdrop-blur transition-all",
                vibrate 
                  ? "gradient-gold text-gold-foreground shadow-lg" 
                  : "border border-white/20 bg-white/10 text-white hover:bg-white/20",
              )}
            >
              <Vibrate className="size-4" /> اهتزاز
            </motion.button>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 rounded-full bg-white/10 px-6 py-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <Flame className="size-5 text-amber-400" />
              <div className="text-center">
                <p className="text-lg font-bold text-white">{toArabicNumber(rounds)}</p>
                <p className="text-[10px] text-white/60">جولة</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-amber-400" />
              <div className="text-center">
                <p className="text-lg font-bold text-white">{toArabicNumber(rounds * preset.target + count)}</p>
                <p className="text-[10px] text-white/60">إجمالي</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daily Goal */}
      <div className="card-glass rounded-2xl p-4 text-center border border-[var(--gold)]/10">
        <p className="text-sm text-muted-foreground">
          🎯 حافظ على التسبيح يومياً لبناء عادة روحية ثابتة
        </p>
      </div>
    </div>
  );
}
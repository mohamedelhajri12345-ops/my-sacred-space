import { useState } from "react";
import { RotateCcw, Vibrate } from "lucide-react";
import { toast } from "sonner";
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
      toast.success(`أتممت ${toArabicNumber(preset.target)} من ${preset.label}`);
    } else {
      setCount(next);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TASBIH_PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => {
              haptic("light");
              setPresetIndex(i);
              setCount(0);
            }}
            className={cn(
              "press rounded-full border border-border px-3 py-1.5 text-xs font-medium",
              i === presetIndex
                ? "gradient-gold border-transparent text-gold-foreground shadow-[var(--shadow-soft)]"
                : "bg-card text-muted-foreground",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="surface-card flex flex-col items-center gap-6 px-4 py-8">
        <p className="font-display text-2xl">{preset.label}</p>

        <button
          onClick={increment}
          className="press relative flex size-56 items-center justify-center rounded-full gradient-night text-cream shadow-[var(--shadow-glow)]"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="oklch(1 0 0 / 0.12)" strokeWidth="4" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="oklch(0.78 0.12 82)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={289}
              strokeDashoffset={289 - (289 * percent) / 100}
              style={{ transition: "stroke-dashoffset 0.3s ease" }}
            />
          </svg>
          <div className="text-center">
            <span key={pop} className="animate-bead block text-6xl font-bold tabular-nums">
              {toArabicNumber(count)}
            </span>
            <span className="mt-1 block text-xs opacity-75">من {toArabicNumber(preset.target)}</span>
          </div>
        </button>

        <p className="text-xs text-muted-foreground">اضغط الدائرة للتسبيح</p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              haptic("medium");
              setCount(0);
            }}
            className="press flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs"
          >
            <RotateCcw className="size-3.5" /> تصفير
          </button>
          <button
            onClick={() => {
              haptic("medium");
              setVibrate(!vibrate);
            }}
            className={cn(
              "press flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs",
              vibrate ? "gradient-gold border-transparent text-gold-foreground" : "bg-card text-muted-foreground",
            )}
          >
            <Vibrate className="size-3.5" /> الاهتزاز
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          الجولات المكتملة: <span className="font-bold text-foreground">{toArabicNumber(rounds)}</span>
        </p>
      </div>
    </div>
  );
}
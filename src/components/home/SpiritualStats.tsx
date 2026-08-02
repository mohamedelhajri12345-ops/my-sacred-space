import { Flame, BookOpenCheck, Repeat } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useLocalStorage } from "@/lib/use-local-storage";
import { TOTAL_AYAHS, toArabicNumber, type ReadingProgress } from "@/lib/quran";

export function SpiritualStats() {
  const { streak } = useApp();
  const [progress] = useLocalStorage<ReadingProgress | null>("islamic:progress", null);
  const percent = progress ? Math.min(100, Math.round((progress.readAyahs / TOTAL_AYAHS) * 100)) : 0;

  const items = [
    { icon: Flame, label: "أيام متتالية", value: toArabicNumber(streak.count) },
    { icon: Repeat, label: "جلسات ذكر", value: toArabicNumber(streak.totalSessions) },
    { icon: BookOpenCheck, label: "من الختمة", value: `${toArabicNumber(percent)}٪` },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="surface-card flex flex-col items-center gap-1 px-2 py-3">
            <Icon className="size-4 text-accent" />
            <span className="text-lg font-bold">{item.value}</span>
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
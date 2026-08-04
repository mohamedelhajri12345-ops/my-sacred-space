import { useMemo, useState } from "react";
import { Check, RotateCcw, Share2 } from "lucide-react";
import { toast } from "sonner";
import type { AthkarCategory } from "@/data/athkar";
import { haptic } from "@/lib/haptics";
import { useApp } from "@/lib/app-context";
import { toArabicNumber } from "@/lib/quran";
import { cn } from "@/lib/utils";
import { ShareButtons } from "@/components/share/ShareButtons";

export function AthkarReader({ category }: { category: AthkarCategory }) {
  const { markThikrSession } = useApp();
  const [counts, setCounts] = useState<number[]>(() => category.items.map(() => 0));
  const [celebrated, setCelebrated] = useState(false);

  const done = useMemo(
    () => counts.filter((c, i) => c >= category.items[i]!.count).length,
    [counts, category.items],
  );
  const percent = Math.round((done / category.items.length) * 100);

  const tap = (index: number) => {
    const target = category.items[index]!.count;
    setCounts((prev) => {
      const next = [...prev];
      if (next[index]! >= target) return prev;
      next[index] = next[index]! + 1;
      if (next[index] === target) haptic("success");
      else haptic("light");
      const finished = next.filter((c, i) => c >= category.items[i]!.count).length;
      if (finished === category.items.length && !celebrated) {
        setCelebrated(true);
        markThikrSession();
        toast.success("تقبّل الله منك، أتممت الأذكار 🌿");
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <div className="surface-card sticky top-[68px] z-20 flex items-center justify-between px-4 py-3">
        <div className="flex-1">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>{category.subtitle}</span>
            <span>
              {toArabicNumber(done)} / {toArabicNumber(category.items.length)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full gradient-gold transition-all duration-500" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <button
          aria-label="إعادة"
          onClick={() => {
            haptic("medium");
            setCounts(category.items.map(() => 0));
            setCelebrated(false);
          }}
          className="press mr-3 flex size-9 items-center justify-center rounded-xl border border-border bg-card"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>

      {category.items.map((item, index) => {
        const count = counts[index]!;
        const complete = count >= item.count;
        return (
          <button
            key={index}
            onClick={() => tap(index)}
            className={cn(
              "press surface-card animate-rise w-full p-4 text-right",
              complete && "border-[color-mix(in_oklab,var(--primary)_45%,transparent)] bg-primary/5",
            )}
            style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
          >
            <p className="font-display text-[1.15rem] leading-[2.1]">{item.text}</p>
            {item.note && <p className="mt-2 text-[11px] text-muted-foreground">{item.note}</p>}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">
                  التكرار: {toArabicNumber(item.count)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    haptic("light");
                    ShareButtons({
                      text: `${item.text}\n\n${item.note ?? ""}`,
                      source: category.title,
                    });
                  }}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
                >
                  <Share2 className="size-3.5" />
                </button>
              </div>
              <span
                className={cn(
                  "flex min-w-14 items-center justify-center gap-1 rounded-full px-3 py-1 text-sm font-bold",
                  complete ? "gradient-warm text-primary-foreground" : "bg-secondary text-secondary-foreground",
                )}
              >
                {complete ? <Check className="size-4" /> : `${toArabicNumber(count)} / ${toArabicNumber(item.count)}`}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
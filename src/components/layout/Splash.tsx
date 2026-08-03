import { useEffect, useState } from "react";
import { Moon } from "lucide-react";

export function Splash() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setHidden(true), 1100);
    return () => window.clearTimeout(t);
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 gradient-night text-cream transition-opacity duration-500"
      style={{ opacity: hidden ? 0 : 1 }}
    >
      <div className="pattern-geo absolute inset-0 opacity-40" />
      <div className="animate-soft-pulse relative flex size-24 items-center justify-center rounded-full border border-gold/40">
        <Moon className="size-10 text-gold" />
      </div>
      <p className="relative font-display text-3xl font-bold">نور</p>
      <p className="relative text-xs opacity-75">رفيقك اليومي في العبادة</p>
    </div>
  );
}

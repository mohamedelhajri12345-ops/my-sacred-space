/**
 * خلفية روحانية متحركة: أشكال إسلامية هندسية (نجمة ثمانية، طبق نجمي، هلال)
 * تسبح ببطء شديد خلف الزجاج، بشفافية منخفضة حتى لا تشتّت القارئ.
 */
function EightPointStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path
        d="M50 2 61 25 86 14 75 39 98 50 75 61 86 86 61 75 50 98 39 75 14 86 25 61 2 50 25 39 14 14 39 25Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarPlate({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="30" />
        <path d="M50 4 84 50 50 96 16 50Z" />
        <path d="M4 50 50 16 96 50 50 84Z" />
        <path d="M22 22 78 78M78 22 22 78" />
      </g>
    </svg>
  );
}

function Crescent({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path
        d="M68 8a46 46 0 1 0 24 74A38 38 0 1 1 68 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
    </svg>
  );
}

const SHAPES = [
  { Comp: StarPlate, cls: "left-[-14%] top-[6%] size-64 text-[var(--gold)] animate-drift-slow" },
  { Comp: EightPointStar, cls: "right-[-10%] top-[26%] size-52 text-primary animate-drift-slower" },
  { Comp: Crescent, cls: "left-[8%] top-[58%] size-40 text-[var(--gold)] animate-drift-slow [animation-delay:-9s]" },
  { Comp: EightPointStar, cls: "right-[12%] bottom-[4%] size-44 text-[var(--gold)] animate-drift-slower [animation-delay:-14s]" },
  { Comp: StarPlate, cls: "left-[38%] top-[38%] size-72 text-primary animate-spin-very-slow" },
] as const;

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      {/* هالات ضوئية ناعمة */}
      <div className="animate-glow-float absolute -top-24 right-[-15%] size-[26rem] rounded-full bg-[color-mix(in_oklab,var(--gold)_28%,transparent)] blur-3xl opacity-40" />
      <div className="animate-glow-float absolute bottom-[-18%] left-[-18%] size-[30rem] rounded-full bg-[color-mix(in_oklab,var(--primary)_26%,transparent)] blur-3xl opacity-45 [animation-delay:-11s]" />
      {/* أشكال هندسية */}
      <div className="absolute inset-0 opacity-[0.22] dark:opacity-[0.24]">
        {SHAPES.map(({ Comp, cls }, i) => (
          <Comp key={i} className={`absolute ${cls}`} />
        ))}
      </div>
      <div className="pattern-geo absolute inset-0 opacity-[0.28]" />
      {/* طبقة زجاجية توحّد المشهد */}
      <div className="absolute inset-0 bg-background/35 backdrop-blur-[10px]" />
    </div>
  );
}
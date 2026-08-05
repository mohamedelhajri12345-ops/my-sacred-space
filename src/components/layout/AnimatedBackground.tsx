/**
 * خلفية روحانية متحركة: أشكال إسلامية هندسية (نجمة ثمانية، طبق نجمي، هلال، زخرفة)
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

// New Islamic Pattern Component
function IslamicPattern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        {/* Main octagon */}
        <polygon points="50,5 80,20 95,50 80,80 50,95 20,80 5,50 20,20" />
        {/* Inner details */}
        <circle cx="50" cy="50" r="25" />
        <circle cx="50" cy="50" r="15" />
        {/* Radiating lines */}
        <line x1="50" y1="5" x2="50" y2="25" />
        <line x1="50" y1="75" x2="50" y2="95" />
        <line x1="5" y1="50" x2="25" y2="50" />
        <line x1="75" y1="50" x2="95" y2="50" />
        {/* Diagonal lines */}
        <line x1="20" y1="20" x2="35" y2="35" />
        <line x1="65" y1="65" x2="80" y2="80" />
        <line x1="80" y1="20" x2="65" y2="35" />
        <line x1="35" y1="65" x2="20" y2="80" />
      </g>
    </svg>
  );
}

// Small decorative dots
function FloatingDots({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="50" cy="15" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="80" cy="30" r="2.5" fill="currentColor" opacity="0.35" />
      <circle cx="15" cy="60" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="70" cy="70" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="85" cy="85" r="2" fill="currentColor" opacity="0.35" />
      <circle cx="40" cy="80" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="60" cy="40" r="2" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

// Floating blur circles for warm, cozy background
function FloatingBlurCircle({ 
  className, 
  color, 
  size = "large" 
}: { 
  className?: string; 
  color: string; 
  size?: "small" | "medium" | "large";
}) {
  const sizes = {
    small: "w-48 h-48",
    medium: "w-72 h-72",
    large: "w-96 h-96"
  };
  
  return (
    <div 
      className={`absolute rounded-full animate-float ${sizes[size]} ${className}`}
      style={{ 
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(80px)',
        opacity: 0.2,
      }}
    />
  );
}

const SHAPES = [
  { Comp: StarPlate, cls: "left-[-14%] top-[6%] size-64 text-[var(--gold)] animate-drift-slow" },
  { Comp: EightPointStar, cls: "right-[-10%] top-[26%] size-52 text-primary animate-drift-slower" },
  { Comp: Crescent, cls: "left-[8%] top-[58%] size-40 text-[var(--gold)] animate-drift-slow [animation-delay:-9s]" },
  { Comp: EightPointStar, cls: "right-[12%] bottom-[4%] size-44 text-[var(--gold)] animate-drift-slower [animation-delay:-14s]" },
  { Comp: StarPlate, cls: "left-[38%] top-[38%] size-72 text-primary animate-spin-very-slow" },
  { Comp: IslamicPattern, cls: "left-[55%] bottom-[10%] size-56 text-[var(--gold)] animate-drift-slow [animation-delay:-6s]" },
  { Comp: FloatingDots, cls: "right-[5%] top-[15%] size-32 text-primary/30 animate-drift-slower [animation-delay:-8s]" },
] as const;

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* تدرّج زيتي/سماوي فضي هادئ يتبع الوضع النهاري والليلي */}
      <div className="absolute inset-0 bg-gradient-to-b from-[color-mix(in_oklab,var(--olive)_16%,var(--background))] via-[var(--background)] to-[color-mix(in_oklab,var(--sky)_18%,var(--background))]" />
      
      {/* Islamic geometric border pattern at top */}
      <div className="absolute inset-x-0 top-0 h-2 overflow-hidden opacity-20">
        <div className="flex h-full animate-[slide_20s_linear_infinite]">
          {[...Array(20)].map((_, i) => (
            <svg key={i} viewBox="0 0 60 20" className="h-full w-8 flex-shrink-0 text-[var(--gold)]">
              <path d="M0,10 L15,0 L30,10 L45,0 L60,10" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="15" cy="5" r="2" fill="currentColor" />
              <circle cx="45" cy="5" r="2" fill="currentColor" />
            </svg>
          ))}
        </div>
      </div>
      
      {/* Floating blur circles - warm, cozy background */}
      <FloatingBlurCircle color="var(--gold)" size="large" className="left-[-20%] top-[-10%]" />
      <FloatingBlurCircle color="var(--olive)" size="medium" className="right-[-15%] top-[20%] [animation-delay:-8s]" />
      <FloatingBlurCircle color="var(--sky)" size="small" className="left-[10%] bottom-[15%] [animation-delay:-15s]" />
      <FloatingBlurCircle color="var(--gold-soft)" size="medium" className="right-[20%] bottom-[25%] [animation-delay:-5s]" />
      <FloatingBlurCircle color="var(--silver)" size="small" className="left-[50%] top-[50%] [animation-delay:-12s]" />
      
      {/* هالات ضوئية ناعمة - Spiritual glows */}
      <div className="animate-glow-float absolute -top-24 right-[-15%] size-[26rem] rounded-full bg-[color-mix(in_oklab,var(--gold)_28%,transparent)] blur-3xl opacity-30" />
      <div className="animate-glow-float absolute bottom-[-18%] left-[-18%] size-[30rem] rounded-full bg-[color-mix(in_oklab,var(--primary)_26%,transparent)] blur-3xl opacity-35 [animation-delay:-11s]" />
      
      {/* Additional spiritual glow */}
      <div className="animate-glow-float absolute top-[40%] left-[60%] size-[18rem] rounded-full bg-[color-mix(in_oklab,var(--gold)_20%,transparent)] blur-3xl opacity-25 [animation-delay:-5s]" />
      
      {/* أشكال هندسية إسلامية */}
      <div className="absolute inset-0 opacity-[0.18] dark:opacity-[0.20]">
        {SHAPES.map(({ Comp, cls }, i) => (
          <Comp key={i} className={`absolute ${cls}`} />
        ))}
      </div>
      
      {/* زخرفة نقطية إسلامية */}
      <div className="pattern-geo absolute inset-0 opacity-[0.15]" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        <div className="animate-[float_15s_ease-in-out_infinite] absolute left-[20%] top-[30%] size-1 rounded-full bg-[var(--gold)] opacity-25 [animation-delay:-3s]" />
        <div className="animate-[float_20s_ease-in-out_infinite] absolute right-[25%] top-[50%] size-1.5 rounded-full bg-[var(--gold)] opacity-20 [animation-delay:-7s]" />
        <div className="animate-[float_18s_ease-in-out_infinite] absolute left-[40%] bottom-[30%] size-1 rounded-full bg-[var(--gold)] opacity-30 [animation-delay:-10s]" />
        <div className="animate-[float_22s_ease-in-out_infinite] absolute right-[35%] bottom-[20%] size-1.5 rounded-full bg-[var(--gold)] opacity-15 [animation-delay:-2s]" />
        <div className="animate-[float_25s_ease-in-out_infinite] absolute left-[60%] top-[70%] size-1 rounded-full bg-[var(--gold)] opacity-20 [animation-delay:-18s]" />
        <div className="animate-[float_28s_ease-in-out_infinite] absolute right-[10%] top-[80%] size-1.5 rounded-full bg-[var(--gold)] opacity-15 [animation-delay:-12s]" />
      </div>
      
      {/* طبقة زجاجية خفيفة توحّد المشهد */}
      <div className="absolute inset-0 bg-background/25 backdrop-blur-[8px]" />
    </div>
  );
}
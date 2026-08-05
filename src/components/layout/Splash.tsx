import { useEffect, useMemo, useState } from "react";

/** نجوم تتلألأ بمواضع ثابتة (بلا عشوائية غير مستقرة بين الخادم والمتصفح). */
const STARS = [
  [8, 12, 2], [18, 26, 1.5], [27, 8, 2.5], [36, 20, 1.5], [44, 6, 2],
  [55, 16, 1.5], [63, 9, 2.5], [72, 22, 1.5], [81, 12, 2], [90, 24, 1.5],
  [12, 34, 1.5], [30, 40, 2], [50, 30, 1.5], [68, 36, 2], [86, 40, 1.5],
  [5, 20, 1], [40, 12, 1], [76, 5, 1.5], [95, 15, 1], [22, 16, 1],
] as const;

/** مشهد المسجد الحرام: الكعبة والأروقة والمآذن تحت سماء ليلية. */
function HaramScene({ appear }: { appear: boolean }) {
  return (
    <svg
      viewBox="0 0 320 190"
      className={`w-[min(88vw,420px)] transition-all duration-1000 ${appear ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      aria-hidden
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1f19" />
          <stop offset="100%" stopColor="#20342c" />
        </linearGradient>
        <linearGradient id="marble" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8eef0" />
          <stop offset="100%" stopColor="#b9c6c8" />
        </linearGradient>
        <radialGradient id="halo" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#e3c27a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e3c27a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="320" height="190" fill="url(#sky)" rx="18" />
      <ellipse cx="160" cy="150" rx="120" ry="60" fill="url(#halo)" />

      {/* هلال */}
      <g className="animate-soft-pulse" style={{ color: "#e3c27a" }}>
        <path d="M232 22a17 17 0 1 0 12 27 13 13 0 1 1-12-27Z" fill="currentColor" />
      </g>

      {/* المآذن */}
      {[42, 278].map((x) => (
        <g key={x} fill="url(#marble)">
          <rect x={x - 5} y={62} width="10" height="86" rx="3" />
          <rect x={x - 7} y={92} width="14" height="3" fill="#e3c27a" />
          <rect x={x - 7} y={116} width="14" height="3" fill="#e3c27a" />
          <path d={`M${x - 8} 62 L${x} 44 L${x + 8} 62 Z`} />
          <circle cx={x} cy={40} r="3" fill="#e3c27a" />
        </g>
      ))}

      {/* الأروقة */}
      <g>
        <rect x="16" y="104" width="288" height="44" fill="url(#marble)" opacity="0.95" />
        <rect x="16" y="100" width="288" height="5" fill="#e3c27a" opacity="0.75" />
        {Array.from({ length: 16 }).map((_, i) => {
          const x = 24 + i * 18;
          return (
            <path
              key={i}
              d={`M${x} 148 L${x} 124 a7 7 0 0 1 14 0 L${x + 14} 148 Z`}
              fill="#1c3128"
              opacity="0.85"
            />
          );
        })}
      </g>

      {/* الكعبة */}
      <g>
        <rect x="128" y="86" width="64" height="62" rx="2" fill="#12130f" />
        <rect x="128" y="102" width="64" height="12" fill="#c9a24a" opacity="0.9" />
        <rect x="152" y="118" width="16" height="30" rx="2" fill="#c9a24a" opacity="0.85" />
        <rect x="128" y="142" width="64" height="6" fill="#2c4a3a" />
      </g>

      {/* الطواف */}
      <g stroke="#dbe6e8" fill="none" opacity="0.35">
        <ellipse cx="160" cy="160" rx="86" ry="16" />
        <ellipse cx="160" cy="163" rx="108" ry="20" />
      </g>
    </svg>
  );
}

export function Splash() {
  const [hidden, setHidden] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [appear, setAppear] = useState(false);
  const [showBismillah, setShowBismillah] = useState(false);

  const stars = useMemo(() => STARS, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setAppear(true), 80),
      setTimeout(() => setShowBismillah(true), 1100),
      setTimeout(() => setFadeOut(true), 2900),
      setTimeout(() => setHidden(true), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-600 ${fadeOut ? "opacity-0" : "opacity-100"}`}
      style={{ background: "linear-gradient(180deg, #0c1a15 0%, #16281f 55%, #1d3140 100%)" }}
    >
      {/* سماء النجوم */}
      <div className="absolute inset-0">
        {stars.map(([left, top, size], i) => (
          <span
            key={i}
            className="absolute rounded-full animate-soft-pulse"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: i % 3 === 0 ? "#e3c27a" : "#dfeaec",
              boxShadow: i % 3 === 0 ? "0 0 6px rgba(227,194,122,0.7)" : "0 0 4px rgba(223,234,236,0.5)",
              animationDelay: `${(i % 7) * 0.35}s`,
              opacity: 0.45 + (i % 5) * 0.11,
            }}
          />
        ))}
      </div>

      {/* هالات ضوئية */}
      <div className="animate-glow-float absolute -top-24 left-[-15%] size-[24rem] rounded-full bg-[#4c6b4f]/25 blur-3xl" />
      <div className="animate-glow-float absolute bottom-[-20%] right-[-15%] size-[26rem] rounded-full bg-[#8fb3c4]/20 blur-3xl [animation-delay:-8s]" />

      <div className="relative z-10 flex flex-col items-center px-6">
        <HaramScene appear={appear} />

        <h1
          className={`mt-6 text-4xl font-bold transition-all duration-1000 ${appear ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ fontFamily: '"Aref Ruqaa", Amiri, serif', color: "#e3c27a", textShadow: "0 0 18px rgba(227,194,122,0.45)" }}
        >
          أحلام الروح
        </h1>

        <p
          className={`mt-3 text-lg transition-opacity duration-1000 ${showBismillah ? "opacity-80" : "opacity-0"}`}
          style={{ fontFamily: '"Amiri Quran", Amiri, serif', color: "#e6eef0" }}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        <div className={`mt-7 flex gap-2.5 transition-opacity duration-500 ${showBismillah ? "opacity-100" : "opacity-0"}`}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-2 rounded-full animate-bounce"
              style={{ background: "#e3c27a", animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-0.5"
        style={{ background: "linear-gradient(90deg, transparent, rgba(227,194,122,0.45), transparent)" }}
      />
    </div>
  );
}

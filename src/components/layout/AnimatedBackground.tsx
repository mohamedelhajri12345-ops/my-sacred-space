/**
 * خلفية متحركة خضراء زيتية هادئة بروح إسلامية:
 * تدرّج ليلي زيتي + هالات ضوئية بطيئة + نجوم خافتة + زخرفة نجمة ثمانية.
 * كل القيم ثابتة (بلا عشوائية) لتفادي اختلاف الترطيب وللحفاظ على الأداء.
 */

const ORBS = [
  { left: -12, top: -8, size: 26, color: "var(--olive, #4c6b4f)", opacity: 0.28, dur: 34, delay: 0 },
  { left: 68, top: 4, size: 22, color: "var(--gold, #e3c27a)", opacity: 0.16, dur: 42, delay: -8 },
  { left: 10, top: 58, size: 24, color: "var(--sky, #8fb3c4)", opacity: 0.16, dur: 48, delay: -16 },
  { left: 62, top: 66, size: 28, color: "var(--olive, #4c6b4f)", opacity: 0.22, dur: 38, delay: -24 },
] as const;

const STARS = [
  [9, 14], [21, 31], [33, 9], [45, 24], [57, 12], [69, 28],
  [81, 8], [92, 22], [16, 47], [38, 55], [60, 44], [86, 52],
  [12, 74], [42, 82], [72, 71], [95, 86],
] as const;

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* تدرّج زيتي ليلي كشاشة التحميل */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0c1a15_0%,#16281f_55%,#12222c_100%)] opacity-100 dark:opacity-100" />
      <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--background)_78%,transparent)] dark:bg-[color-mix(in_oklab,var(--background)_45%,transparent)]" />

      {/* هالات ضوئية بطيئة */}
      {ORBS.map((o, i) => (
        <div
          key={`orb-${i}`}
          className="ab-orb absolute rounded-full blur-3xl"
          style={{
            left: `${o.left}%`,
            top: `${o.top}%`,
            width: `${o.size}rem`,
            height: `${o.size}rem`,
            background: `radial-gradient(circle, color-mix(in oklab, ${o.color} 60%, transparent) 0%, transparent 70%)`,
            opacity: o.opacity,
            animationDuration: `${o.dur}s`,
            animationDelay: `${o.delay}s`,
          }}
        />
      ))}

      {/* نجوم خافتة */}
      {STARS.map(([left, top], i) => (
        <span
          key={`star-${i}`}
          className="ab-star absolute rounded-full"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            background: i % 3 === 0 ? "var(--gold, #e3c27a)" : "var(--silver, #dfeaec)",
            animationDelay: `${(i % 6) * 0.7}s`,
          }}
        />
      ))}

      {/* نجمة ثمانية زخرفية تدور ببطء شديد */}
      <svg className="ab-spin absolute -right-24 top-1/3 size-[28rem] opacity-[0.06]" viewBox="0 0 100 100">
        <g fill="none" stroke="var(--gold, #e3c27a)" strokeWidth="1">
          <rect x="20" y="20" width="60" height="60" />
          <rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="34" />
        </g>
      </svg>

      <style>{`
        .ab-orb { animation-name: ab-float; animation-timing-function: ease-in-out; animation-iteration-count: infinite; will-change: transform; }
        .ab-star { animation: ab-twinkle 4.5s ease-in-out infinite; }
        .ab-spin { animation: ab-rotate 180s linear infinite; }
        @keyframes ab-float {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(2.5rem,-2rem,0) scale(1.08); }
        }
        @keyframes ab-twinkle { 0%,100% { opacity: .2 } 50% { opacity: .75 } }
        @keyframes ab-rotate { to { transform: rotate(360deg) } }
        @media (prefers-reduced-motion: reduce) {
          .ab-orb, .ab-star, .ab-spin { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

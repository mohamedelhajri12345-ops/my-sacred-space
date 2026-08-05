/**
 * خلفية بنجوم متحركة رائعة - مشابهة لقناة الغامضة
 * نجوم لامعة متحركة بتأثيرات متعددة
 */

export function AnimatedBackground() {
  // Generate random stars
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.3,
  }));

  // Shooting stars
  const shootingStars = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 50,
    duration: Math.random() * 2 + 1.5,
    delay: Math.random() * 8 + i * 3,
  }));

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* خلفية ليلية عميقة */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#1a1a3a]" />
      
      {/* هالة مركزية */}
      <div className="absolute inset-0 bg-gradient-radial from-[color-mix(in_oklab,var(--gold)_8%,transparent)] via-transparent to-transparent" />
      
      {/* النجوم الثابتة */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
              boxShadow: star.size > 2 ? "0 0 6px 2px rgba(255,255,255,0.3)" : "none",
            }}
          />
        ))}
      </div>
      
      {/* النجوم المتحركة */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={`moving-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: 0.6,
              animation: `drift-star ${Math.random() * 20 + 15}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
      
      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <div
          key={`shooting-${star.id}`}
          className="absolute h-0.5 w-20 rounded-full bg-gradient-to-r from-white via-[var(--gold)] to-transparent"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animation: `shooting ${star.duration}s linear infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      
      {/* ضوء القمر الخافت */}
      <div className="absolute -right-20 -top-20 size-64 rounded-full bg-gradient-to-br from-[color-mix(in_oklab,var(--gold)_15%,white)] to-transparent blur-3xl opacity-40" />
      
      {/* طبقة زجاجية */}
      <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_oklab,var(--background)_60%,transparent)] via-transparent to-transparent" />
      
      {/* CSS Animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes drift-star {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
          }
          75% {
            transform: translateY(-30px) translateX(15px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        @keyframes shooting {
          0% {
            transform: translateX(0) rotate(-45deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px) rotate(-45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

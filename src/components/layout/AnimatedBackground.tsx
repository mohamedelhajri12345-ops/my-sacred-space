/**
 * خلفية متحركة دافئة ورطبة مستوحاة من أجواء المساجد
 * جزيئات ذهبية متحركة مع تأثيرات ضوئية دافئة
 */

import { useEffect, useMemo, useState } from "react";

export function AnimatedBackground() {
  // نولّد العناصر العشوائية بعد الترطيب فقط لتفادي اختلاف SSR
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Generate floating particles
  const particles = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 15 + 20,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.4 + 0.2,
  })), []);

  // Light orbs
  const orbs = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 150 + 100,
    duration: Math.random() * 20 + 25,
    delay: Math.random() * 8,
    hue: 35 + Math.random() * 20, // Warm gold/amber hues
  })), []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* خلفية دافئة رطبة - تدرج من الكهرماني الدافئ */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1510] via-[#252015] to-[#1a1a25]" />
      
      {/* طبقة ضباب خفيف */}
      <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_oklab,var(--background)_40%,transparent)] via-transparent to-transparent" />
      
      {/* كرات ضوئية دافئة */}
      {mounted && orbs.map((orb) => (
        <div
          key={`orb-${orb.id}`}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `radial-gradient(circle, hsla(${orb.hue}, 60%, 50%, 0.15) 0%, hsla(${orb.hue}, 50%, 40%, 0.05) 50%, transparent 70%)`,
            animation: `float-orb ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
      
      {/* الجزيئات المتحركة */}
      <div className="absolute inset-0">
        {mounted && particles.map((particle) => (
          <div
            key={`particle-${particle.id}`}
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, rgba(227, 194, 122, ${particle.opacity}) 0%, rgba(227, 194, 122, 0.1) 50%, transparent 70%)`,
              animation: `float-particle ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
              boxShadow: `0 0 ${particle.size * 2}px rgba(227, 194, 122, ${particle.opacity * 0.5})`,
            }}
          />
        ))}
      </div>
      
      {/* تأثير شروق خفيف من الأسفل */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[color-mix(in_oklab,var(--gold)_8%,transparent)] via-transparent to-transparent" />
      
      {/* جزيئات ضوئية صغيرة */}
      <div className="absolute inset-0">
        {mounted && [...Array(15)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `sparkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes float-orb {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(30px, -40px) scale(1.1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-20px, -60px) scale(0.95);
            opacity: 0.4;
          }
          75% {
            transform: translate(40px, -30px) scale(1.05);
            opacity: 0.45;
          }
        }
        
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-30px) translateX(15px);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) translateX(-10px);
            opacity: 0.35;
          }
          75% {
            transform: translateY(-40px) translateX(20px);
            opacity: 0.45;
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
}

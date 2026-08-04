import { useEffect, useState, useRef } from "react";

export function Splash() {
  const [hidden, setHidden] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showBismillah, setShowBismillah] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Timeline-based animation
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: Show background and stars (0-0.5s)
    timers.push(setTimeout(() => {
      setShowContent(true);
    }, 100));

    // Phase 2: Show crescent and star (0.5-2s)
    timers.push(setTimeout(() => {
      setShowContent(true);
    }, 500));

    // Phase 3: Show app name (1-2.5s)
    timers.push(setTimeout(() => {
      setShowContent(true);
    }, 1000));

    // Phase 4: Show Bismillah (2-3s)
    timers.push(setTimeout(() => {
      setShowBismillah(true);
    }, 2000));

    // Phase 5: Show loading dots (2.5-3.5s)
    timers.push(setTimeout(() => {
      setShowLoader(true);
    }, 2500));

    // Phase 6: Fade out and hide (3.5-4s)
    timers.push(setTimeout(() => {
      setFadeOut(true);
    }, 3500));

    timers.push(setTimeout(() => {
      setHidden(true);
    }, 4000));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-600 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background: 'linear-gradient(180deg, #1B2A4A 0%, #2C3E6B 100%)',
      }}
    >
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: Math.random() > 0.5 ? '3px' : '2px',
              height: Math.random() > 0.5 ? '3px' : '2px',
              background: Math.random() > 0.5 ? '#D4A574' : '#F5EFE0',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.7,
              boxShadow: Math.random() > 0.5 ? '0 0 4px rgba(212, 165, 116, 0.5)' : 'none',
            }}
          />
        ))}
        
        {/* Decorative circles */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            border: '1px solid rgba(212, 175, 55, 0.08)',
          }}
        />
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            border: '1px solid rgba(212, 175, 55, 0.1)',
          }}
        />
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            border: '1px solid rgba(212, 175, 55, 0.12)',
          }}
        />
      </div>

      {/* Floating blur circles */}
      <div 
        className="absolute rounded-full animate-float"
        style={{
          width: '400px',
          height: '400px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(212, 165, 116, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 25s ease-in-out infinite',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Crescent Moon with Star and Glow */}
        <div className="relative mb-8">
          {/* Glow effect */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212, 165, 116, 0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
              animation: 'soft-pulse 3s ease-in-out infinite',
            }}
          />
          
          {/* Crescent and Star SVG */}
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 120 120"
            className="relative animate-spin-very-slow"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(212, 165, 116, 0.6))',
            }}
          >
            {/* Crescent */}
            <path
              d="M85 10 A50 50 0 1 1 85 110 A40 40 0 1 0 85 10"
              fill="#D4A574"
            />
            
            {/* Star inside crescent */}
            <polygon
              points="95,40 99,50 109,51 101,58 104,68 95,62 86,68 89,58 81,51 91,50"
              fill="#D4A574"
            />
          </svg>
        </div>

        {/* App Name */}
        <h1 
          className="text-4xl font-bold animate-fade-in-up"
          style={{
            fontFamily: 'Amiri, serif',
            color: '#D4A574',
            textShadow: '0 0 10px rgba(212, 165, 116, 0.5)',
            animationDelay: '1s',
            animationFillMode: 'both',
          }}
        >
          أحلام الروح
        </h1>
        
        {/* Bismillah */}
        <p 
          className={`mt-4 text-xl transition-opacity duration-1000 ${showBismillah ? 'opacity-80' : 'opacity-0'}`}
          style={{ 
            fontFamily: 'Amiri, serif',
            color: '#F5EFE0',
            animationDelay: '2s',
          }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        
        {/* Loading Dots */}
        <div className={`mt-8 flex gap-3 transition-opacity duration-500 ${showLoader ? 'opacity-100' : 'opacity-0'}`}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full animate-bounce"
              style={{
                background: '#D4A574',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom decoration */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.4), transparent)',
        }}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1.5s ease-out;
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translate(-50%, -50%) translate(0, 0) scale(1); 
          }
          33% { 
            transform: translate(-50%, -50%) translate(30px, -30px) scale(1.1); 
          }
          66% { 
            transform: translate(-50%, -50%) translate(-20px, 20px) scale(0.9); 
          }
        }
      `}</style>
    </div>
  );
}

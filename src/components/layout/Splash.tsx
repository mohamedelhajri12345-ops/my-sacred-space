import { useEffect, useState, useRef } from "react";

export function Splash() {
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Smooth progress animation
    const startTime = Date.now();
    const duration = 2000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressValue = Math.min((elapsed / duration) * 100, 100);
      setProgress(progressValue);
      
      if (progressValue < 100) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);

    const t = window.setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setHidden(true), 600);
    }, 2200);

    return () => {
      window.clearTimeout(t);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-600 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background: 'linear-gradient(135deg, #1a3a2a 0%, #0d2818 50%, #0a1f12 100%)',
      }}
    >
      {/* Geometric Islamic Patterns - Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large decorative circle */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            border: '1px solid rgba(212, 175, 55, 0.15)',
          }}
        />
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        />
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            border: '1px solid rgba(212, 175, 55, 0.25)',
          }}
        />
        
        {/* Islamic Star Pattern */}
        <svg 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-very-slow" 
          style={{ width: '200px', height: '200px', opacity: 0.3 }}
          viewBox="0 0 100 100"
        >
          <polygon
            points="50,2 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
            fill="none"
            stroke="rgba(212, 175, 55, 0.4)"
            strokeWidth="0.5"
          />
        </svg>

        {/* Corner decorations */}
        <div className="absolute left-0 top-0 size-32 opacity-20">
          <svg viewBox="0 0 100 100" className="h-full w-full text-[#d4af37]">
            <path d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z" fill="currentColor" />
            <path d="M15,15 L35,15 L35,18 L18,18 L18,35 L15,35 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute right-0 top-0 size-32 rotate-90 opacity-20">
          <svg viewBox="0 0 100 100" className="h-full w-full text-[#d4af37]">
            <path d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z" fill="currentColor" />
            <path d="M15,15 L35,15 L35,18 L18,18 L18,35 L15,35 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 size-32 -rotate-90 opacity-20">
          <svg viewBox="0 0 100 100" className="h-full w-full text-[#d4af37]">
            <path d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z" fill="currentColor" />
            <path d="M15,15 L35,15 L35,18 L18,18 L18,35 L15,35 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 size-32 rotate-180 opacity-20">
          <svg viewBox="0 0 100 100" className="h-full w-full text-[#d4af37]">
            <path d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z" fill="currentColor" />
            <path d="M15,15 L35,15 L35,18 L18,18 L18,35 L15,35 Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Glowing orbs */}
      <div 
        className="absolute rounded-full opacity-30"
        style={{
          width: '300px',
          height: '300px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div 
        className="absolute rounded-full opacity-20"
        style={{
          width: '200px',
          height: '200px',
          left: '30%',
          top: '30%',
          background: 'radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Main Logo */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Crescent Moon with Star */}
        <div className="relative mb-6">
          <svg 
            width="120" 
            height="120" 
            viewBox="0 0 120 120"
            className="animate-soft-pulse"
          >
            {/* Outer glow */}
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(212, 175, 55, 0.3)" />
                <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
              </radialGradient>
            </defs>
            <circle cx="60" cy="60" r="55" fill="url(#glow)" />
            
            {/* Crescent */}
            <path
              d="M75 15 A45 45 0 1 1 75 105 A35 35 0 1 0 75 15"
              fill="none"
              stroke="#d4af37"
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            {/* Star */}
            <polygon
              points="85,45 88,52 96,53 90,58 92,66 85,62 78,66 80,58 74,53 82,52"
              fill="#d4af37"
              className="animate-pulse"
              style={{ animationDuration: '2s' }}
            />
          </svg>
        </div>

        {/* App Name */}
        <h1 
          className="font-display text-5xl font-bold tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #f5e6a3 50%, #d4af37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
          }}
        >
          نُور
        </h1>
        
        {/* Bismillah */}
        <p 
          className="mt-3 font-quran text-xl opacity-80"
          style={{ color: 'rgba(212, 175, 55, 0.8)' }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        
        {/* Tagline */}
        <p 
          className="mt-6 text-sm tracking-wide opacity-70"
          style={{ color: 'rgba(245, 230, 163, 0.8)' }}
        >
          رفيقك اليومي في العبادة
        </p>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-20 left-1/2 w-48 -translate-x-1/2">
        <div 
          className="h-1 overflow-hidden rounded-full"
          style={{ background: 'rgba(212, 175, 55, 0.2)' }}
        >
          <div 
            className="h-full rounded-full transition-all duration-100"
            style={{ 
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #d4af37, #f5e6a3)',
              boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
            }}
          />
        </div>
      </div>

      {/* Bottom decoration */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)',
        }}
      />
    </div>
  );
}

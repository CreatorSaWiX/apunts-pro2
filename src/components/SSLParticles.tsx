import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;       // percentage 0-100
  size: number;       // size in pixels
  duration: number;   // duration in seconds
  drift: number;      // horizontal drift in pixels
  isStar: boolean;    // whether it's a star or circle
}

interface SSLParticlesProps {
  isHovered?: boolean;
}

export const SSLParticles: React.FC<SSLParticlesProps> = ({ isHovered = false }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    let idCounter = 0;
    const intervalTime = isHovered ? 900 : 1600; // Twice as slow spawns (1.6s standard / 900ms hover)
    
    const interval = setInterval(() => {
      const isStar = Math.random() > 0.65;
      const size = isStar ? Math.random() * 4 + 4 : Math.random() * 1.5 + 1.5; // Delicate tiny particles: Stars 4-8px, Circles 1.5-3px
      
      const newParticle: Particle = {
        id: idCounter++,
        left: Math.random() * 100,
        size,
        duration: Math.random() * 6 + 12, // Doubled float duration: 12s to 18s for extremely peaceful, slow magic
        drift: (Math.random() - 0.5) * 30, // Subtle horizontal drift: -15px to +15px
        isStar
      };

      setParticles(prev => {
        // Keep active particles limit low for clean minimalism
        const maxParticles = isHovered ? 12 : 6;
        return [...prev.slice(-maxParticles), newParticle];
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className="absolute -inset-x-8 -top-16 -bottom-2 pointer-events-none overflow-visible z-10">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute bottom-0 opacity-0 pointer-events-none"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            '--drift': `${p.drift}px`,
            '--duration': `${p.duration}s`,
            animation: `ssl-float var(--duration) ease-out forwards`
          } as React.CSSProperties}
        >
          {p.isStar ? (
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full fill-white drop-shadow-[0_0_8px_rgba(255,255,255,1)] animate-spin-slow"
            >
              <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
            </svg>
          ) : (
            <div className="w-full h-full bg-gradient-to-t from-slate-200 to-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.8),0_0_12px_rgba(226,232,240,0.4)]" />
          )}
        </div>
      ))}
    </div>
  );
};

export default SSLParticles;

import React, { useState, useRef, useEffect } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Check } from 'lucide-react';

export const THINKING_LEVELS = [
  { id: 'auto', label: 'Auto' },
  { id: 'low', label: 'Baix' },
  { id: 'medium', label: 'Mig' },
  { id: 'high', label: 'Alt' }
] as const;

export type ThinkingLevel = typeof THINKING_LEVELS[number]['id'];

interface ThinkingLevelSelectorProps {
  value: ThinkingLevel;
  onChange: (val: ThinkingLevel) => void;
}

export const ThinkingLevelSelector: React.FC<ThinkingLevelSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative flex items-center" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`shrink-0 px-2 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
          isOpen ? 'text-slate-200 bg-white/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
        title="Nivell de Raonament"
      >
        <span className="text-[13px] font-medium leading-none mt-[1px]">
          {THINKING_LEVELS.find((l) => l.id === value)?.label}
        </span>
        <ChevronUp size={14} className={`transition-transform mt-[1px] ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 8, scale: 0.95, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute bottom-[calc(100%+12px)] left-0 bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-1.5 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8),_0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col gap-0.5 z-50 origin-bottom-left min-w-[100px]"
          >
            {THINKING_LEVELS.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => {
                  onChange(level.id);
                  setIsOpen(false);
                }}
                className="relative px-3 py-2 text-[13px] rounded-xl transition-colors group text-center"
              >
                {value === level.id && (
                  <motion.div
                    layoutId="thinking-active-bg"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-center justify-between gap-3 w-full">
                  <span
                    className={`transition-colors whitespace-nowrap ${
                      value === level.id ? 'text-white font-medium' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {level.label}
                  </span>
                  {value === level.id && <Check size={14} className="text-white" />}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState, useRef, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { m as motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Check } from 'lucide-react';

export const THINKING_LEVEL_IDS = ['auto', 'low', 'medium', 'high'] as const;
export type ThinkingLevel = (typeof THINKING_LEVEL_IDS)[number];

export interface ThinkingLevelOption {
  id: ThinkingLevel;
  labelKey: string;
  defaultLabel: string;
}

export const THINKING_LEVELS: readonly ThinkingLevelOption[] = [
  { id: 'auto', labelKey: 'chat.thinkingLevels.auto', defaultLabel: 'Auto' },
  { id: 'low', labelKey: 'chat.thinkingLevels.low', defaultLabel: 'Baix' },
  { id: 'medium', labelKey: 'chat.thinkingLevels.medium', defaultLabel: 'Mig' },
  { id: 'high', labelKey: 'chat.thinkingLevels.high', defaultLabel: 'Alt' },
] as const;

interface ThinkingLevelSelectorProps {
  value: ThinkingLevel;
  onChange: (val: ThinkingLevel) => void;
}

export const ThinkingLevelSelector: React.FC<ThinkingLevelSelectorProps> = React.memo(
  ({ value, onChange }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listboxId = useId();

    useEffect(() => {
      if (!isOpen) return;

      const handlePointerDown = (e: MouseEvent | TouchEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('touchstart', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handlePointerDown);
        document.removeEventListener('touchstart', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen]);

    const currentOption = THINKING_LEVELS.find((l) => l.id === value) || THINKING_LEVELS[0];
    const currentLabel = t(currentOption.labelKey, currentOption.defaultLabel);
    const selectorTitle = t('chat.thinkingLevel', 'Nivell de Raonament');

    return (
      <div className="relative flex items-center" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-label={`${selectorTitle}: ${currentLabel}`}
          className={`shrink-0 px-2 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
            isOpen ? 'text-slate-200 bg-white/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title={selectorTitle}
        >
          <span className="text-[13px] font-medium leading-none mt-[1px]">
            {currentLabel}
          </span>
          <ChevronUp size={14} className={`transition-transform mt-[1px] ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id={listboxId}
              role="listbox"
              aria-label={selectorTitle}
              initial={{ opacity: 0, y: 12, scale: 0.95, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 8, scale: 0.95, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute bottom-[calc(100%+12px)] left-0 bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-1.5 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8),_0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col gap-0.5 z-50 origin-bottom-left min-w-[100px]"
            >
              {THINKING_LEVELS.map((level) => {
                const label = t(level.labelKey, level.defaultLabel);
                const isSelected = value === level.id;

                return (
                  <button
                    key={level.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(level.id);
                      setIsOpen(false);
                    }}
                    className="relative px-3 py-2 text-[13px] rounded-xl transition-colors group text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="thinking-active-bg"
                        className="absolute inset-0 bg-white/10 rounded-xl"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center justify-between gap-3 w-full">
                      <span
                        className={`transition-colors whitespace-nowrap ${
                          isSelected ? 'text-white font-medium' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {label}
                      </span>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ThinkingLevelSelector.displayName = 'ThinkingLevelSelector';

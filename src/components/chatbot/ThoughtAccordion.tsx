import React, { useId, useMemo, useState } from 'react';
import type { TFunction } from 'i18next';
import { ChevronDown } from 'lucide-react';
import { ThoughtBlock, parseThoughtText } from '../ThoughtBlock';

/**
 * Format milliseconds into a human-readable duration string (e.g., '<1s', '4s', '1m 12s').
 */
export const formatThoughtDuration = (ms?: number): string => {
  if (!ms || ms <= 0 || Number.isNaN(ms)) return '';
  const totalSeconds = Math.floor(ms / 1000);
  if (totalSeconds < 1) return '<1s';
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
};

interface ThoughtAccordionProps {
  thoughtText: string;
  thoughtTimeMs?: number;
  t: TFunction;
}

export const ThoughtAccordion: React.FC<ThoughtAccordionProps> = React.memo(
  ({ thoughtText, thoughtTimeMs, t }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentId = useId();

    const trimmedText = thoughtText?.trim();
    const blocks = useMemo(() => {
      if (!trimmedText) return [];
      return parseThoughtText(trimmedText, t);
    }, [trimmedText, t]);

    if (!trimmedText) return null;

    const timeString = formatThoughtDuration(thoughtTimeMs);
    const processLabel = t('chat.process.worked', 'Process');

    return (
      <div className="mb-1 w-full flex flex-col">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors py-1 w-fit select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded"
        >
          <span className="text-[14px] font-medium tracking-tight">
            {timeString
              ? t('chat.process.workedTime', 'Worked for {{time}}', { time: timeString })
              : processLabel}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
          />
        </button>

        {isOpen && (
          <div
            id={contentId}
            role="region"
            aria-label={processLabel}
            className="flex flex-col gap-1.5 mt-2 mb-1 pl-1 max-w-2xl"
          >
            {blocks.map((block, idx) => (
              <ThoughtBlock key={`${block.title || 'block'}-${idx}`} block={block} />
            ))}
          </div>
        )}
      </div>
    );
  }
);

ThoughtAccordion.displayName = 'ThoughtAccordion';

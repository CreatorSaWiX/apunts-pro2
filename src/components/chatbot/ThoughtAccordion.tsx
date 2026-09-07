import React from 'react';
import type { TFunction } from 'i18next';
import { ChevronDown } from 'lucide-react';
import { ThoughtBlock, parseThoughtText } from '../ThoughtBlock';

const formatTime = (ms: number | undefined) => {
  if (!ms) return '';
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const remainingS = s % 60;
  return remainingS > 0 ? `${m}m ${remainingS}s` : `${m}m`;
};

interface ThoughtAccordionProps {
  thoughtText: string;
  thoughtTimeMs?: number;
  t: TFunction;
}

export const ThoughtAccordion: React.FC<ThoughtAccordionProps> = React.memo(
  ({ thoughtText, thoughtTimeMs, t }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const blocks = React.useMemo(() => parseThoughtText(thoughtText || '', t), [thoughtText, t]);

    if (!thoughtText || !thoughtText.trim()) return null;
    const timeString = formatTime(thoughtTimeMs);

    return (
      <div className="mb-1 w-full flex flex-col">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors py-1 w-fit select-none focus:outline-none"
        >
          <span className="text-[14px] font-medium tracking-tight">
            {timeString
              ? t('chat.process.workedTime', 'Worked for {{time}}', { time: timeString })
              : t('chat.process.worked', 'Process')}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : '-rotate-90'}`}
          />
        </button>

        {isOpen && (
          <div className="flex flex-col gap-1.5 mt-2 mb-1 pl-1 max-w-2xl">
            {blocks.map((block, idx) => (
              <ThoughtBlock key={idx} block={block} />
            ))}
          </div>
        )}
      </div>
    );
  }
);
ThoughtAccordion.displayName = 'ThoughtAccordion';

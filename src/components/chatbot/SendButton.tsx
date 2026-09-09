import React, { useState, useEffect } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SendButtonProps {
  onClick: () => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled: boolean;
  hasInput: boolean;
  lastSentAt: React.RefObject<number | null | undefined>;
  cooldownMs: number;
}

export const SendButton = React.memo<SendButtonProps>(
  ({
    onClick,
    onStop,
    isStreaming = false,
    disabled,
    hasInput,
    lastSentAt,
    cooldownMs,
  }) => {
    const [cooldown, setCooldown] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
      // While actively streaming, cooldown is not shown or needed
      if (isStreaming) {
        setCooldown(0);
        return;
      }

      const calculateRemaining = () => {
        const elapsed = Date.now() - (lastSentAt.current ?? 0);
        return Math.max(0, Math.ceil((cooldownMs - elapsed) / 1000));
      };

      const initialRemaining = calculateRemaining();
      setCooldown(initialRemaining);

      if (initialRemaining <= 0) return;

      const timer = setInterval(() => {
        const remaining = calculateRemaining();
        setCooldown(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }, [lastSentAt, cooldownMs, isStreaming]);

    if (isStreaming) {
      const stopLabel = t('chat.stop', 'Atura la generació');
      return (
        <button
          type="button"
          onClick={onStop}
          title={stopLabel}
          aria-label={stopLabel}
          className="shrink-0 w-9 h-9 rounded-full mb-0.5 mr-1 flex items-center justify-center bg-white text-black hover:bg-slate-200 shadow-md ring-1 ring-black/10 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          <Square size={13} className="fill-current" />
        </button>
      );
    }

    const isCooldownActive = cooldown > 0;
    const sendLabel = isCooldownActive
      ? t('chat.wait', 'Espera {{cooldown}}s', { cooldown })
      : t('common.send', 'Enviar');

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isCooldownActive}
        title={sendLabel}
        aria-label={sendLabel}
        className={`shrink-0 w-9 h-9 rounded-full mb-0.5 mr-1 flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
          isCooldownActive
            ? 'bg-white/10 text-slate-500 cursor-not-allowed text-xs font-mono font-semibold'
            : hasInput && !disabled
            ? 'bg-white text-black hover:bg-slate-200 shadow-md active:scale-95'
            : 'bg-white/10 text-slate-500 cursor-not-allowed'
        }`}
      >
        {isCooldownActive ? cooldown : <ArrowUp size={18} strokeWidth={3} />}
      </button>
    );
  }
);

SendButton.displayName = 'SendButton';

import React, { useState, useEffect } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SendButtonProps {
    onClick: () => void;
    onStop?: () => void;
    isStreaming?: boolean;
    disabled: boolean;
    hasInput: boolean;
    lastSentAt: React.RefObject<number>;
    cooldownMs: number;
}

export const SendButton = React.memo<SendButtonProps>(({ 
    onClick, 
    onStop,
    isStreaming = false,
    disabled, 
    hasInput, 
    lastSentAt, 
    cooldownMs 
}) => {
    const [cooldown, setCooldown] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
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
        return (
            <button
                type="button"
                onClick={onStop}
                title={t('chat.stop', 'Atura la generació')}
                className="shrink-0 rounded-full transition mb-0.5 mr-1 flex items-center justify-center p-2 bg-white text-black hover:bg-slate-200 shadow-md ring-1 ring-black/10 active:scale-95"
            >
                <Square size={13} className="fill-current" />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || cooldown > 0}
            title={cooldown > 0 ? t('chat.wait', 'Espera {{cooldown}}s', { cooldown }) : t('common.send', 'Enviar')}
            className={`shrink-0 rounded-full transition mb-0.5 mr-1 flex items-center justify-center
                ${cooldown > 0
                ? 'w-9 h-9 bg-white/10 text-slate-500 cursor-not-allowed text-xs font-mono font-semibold'
                : hasInput
                    ? 'p-2 bg-white text-black hover:bg-slate-200 shadow-md active:scale-95'
                    : 'p-2 bg-white/10 text-slate-500'
                }`}
        >
            {cooldown > 0 ? cooldown : <ArrowUp size={18} strokeWidth={3} />}
        </button>
    );
});

SendButton.displayName = 'SendButton';


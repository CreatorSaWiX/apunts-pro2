import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SendButtonProps {
    onClick: () => void;
    disabled: boolean;
    hasInput: boolean;
    lastSentAt: React.RefObject<number>;
    cooldownMs: number;
}

export const SendButton = React.memo<SendButtonProps>(({ 
    onClick, 
    disabled, 
    hasInput, 
    lastSentAt, 
    cooldownMs 
}) => {
    const [cooldown, setCooldown] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        const check = () => {
             const elapsed = Date.now() - (lastSentAt.current ?? 0);
             const remaining = Math.ceil((cooldownMs - elapsed) / 1000);
             setCooldown(remaining > 0 ? remaining : 0);
        };
        // Poll every second to pick up ref changes
        const timer = setInterval(check, 1000);
        check();
        return () => clearInterval(timer);
    }, [lastSentAt, cooldownMs]);

    return (
        <button type="button"
            onClick={onClick}
            disabled={disabled || cooldown > 0}
            title={cooldown > 0 ? t('chat.wait', 'Espera {{cooldown}}s', { cooldown }) : t('common.send', 'Enviar')}
            className={`shrink-0 rounded-full transition mb-0.5 mr-1 flex items-center justify-center
                ${cooldown > 0
                ? 'w-9 h-9 bg-white/10 text-slate-500 cursor-not-allowed text-xs font-mono font-semibold'
                : hasInput
                    ? 'p-2 bg-white text-black hover:bg-slate-200 shadow-md'
                    : 'p-2 bg-white/10 text-slate-500'
                }`}
        >
            {cooldown > 0 ? cooldown : <ArrowUp size={18} strokeWidth={3} />}
        </button>
    );
});

SendButton.displayName = 'SendButton';

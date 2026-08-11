import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SendButtonProps {
    onClick: () => void;
    disabled: boolean;
    hasInput: boolean;
    lastSentTime: number;
    cooldownMs: number;
}

export const SendButton: React.FC<SendButtonProps> = ({ 
    onClick, 
    disabled, 
    hasInput, 
    lastSentTime, 
    cooldownMs 
}) => {
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        const check = () => {
             const elapsed = Date.now() - lastSentTime;
             const remaining = Math.ceil((cooldownMs - elapsed) / 1000);
             if (remaining > 0) setCooldown(remaining);
             else setCooldown(0);
        };
        check();
        if (Date.now() - lastSentTime < cooldownMs) {
            const timer = setInterval(check, 1000);
            return () => clearInterval(timer);
        }
    }, [lastSentTime, cooldownMs]);

    const { t } = useTranslation();

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
};

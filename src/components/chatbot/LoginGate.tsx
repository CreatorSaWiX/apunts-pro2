import React from 'react';
import { LogIn, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LoginGateProps {
    aiName?: string;
    setIsOpen: (isOpen: boolean) => void;
    renderAIAvatar: (size: number, cls: string) => React.ReactNode;
}

export const LoginGate: React.FC<LoginGateProps> = ({ aiName, setIsOpen, renderAIAvatar }) => {
    const { t } = useTranslation();

    return (
        <div className="absolute inset-0 z-[50] flex flex-col">
            {/* Mini header */}
            <div className="shrink-0 h-16 px-4 border-b border-white/5 flex items-center justify-between bg-[#020617]/50 backdrop-blur-xl">
                <span className="text-sm font-medium text-slate-300 ml-2">{aiName}</span>
                <button type="button" onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-slate-200 rounded-md transition-colors">
                    <X size={18} />
                </button>
            </div>
            {/* Login content */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center overflow-hidden">
                    {renderAIAvatar(28, "text-slate-400")}
                </div>
                <div>
                    <h2 className="text-slate-100 font-semibold text-lg mb-2">{aiName}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                        {t('chat.loginRequired', "L'assistent d'IA és exclusiu per als membres registrats\nInicia sessió per accedir a l'historial i al xat")}
                    </p>
                </div>
                <a
                    href="/login"
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-2xl hover:bg-slate-100 transition-colors shadow-lg"
                >
                    <LogIn size={18} />
                    {t('chat.login', 'Inicia sessió')}
                </a>
            </div>
        </div>
    );
};

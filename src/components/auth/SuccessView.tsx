import React from 'react';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { m as motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface SuccessViewProps {
    email: string;
    onBackToLogin: () => void;
    customEasing: [number, number, number, number];
}

export const SuccessView: React.FC<SuccessViewProps> = ({ email, onBackToLogin, customEasing }) => {
    const { t } = useTranslation();

    return (
        <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: customEasing }}
            className="relative z-10 flex flex-col items-center justify-center py-8 text-center w-full"
        >
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
                <CheckCircle2 size={40} className="text-emerald-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-3">{t('auth.login.emailSent', 'Correu Enviat!')}</h2>
            <p className="text-slate-400 text-sm font-light mb-8 max-w-70">
                {t('auth.login.emailSentDesc1', "T'hem enviat un correu a ")}<span className="text-white font-medium">{email}</span>{t('auth.login.emailSentDesc2', ' amb instruccions per restablir la teva contrasenya.')}
            </p>
            <button type="button" 
                onClick={onBackToLogin}
                className="text-sky-400 font-semibold hover:text-sky-300 transition-colors flex items-center gap-2 group"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                {t('auth.login.backToLogin', 'Tornar a Iniciar Sessió')}
            </button>
        </motion.div>
    );
};

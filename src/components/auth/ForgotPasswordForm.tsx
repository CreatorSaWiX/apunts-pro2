import React, { useState } from 'react';
import { ChevronLeft, ArrowRight, Mail } from 'lucide-react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { PremiumInput } from '../ui/inputs/PremiumInput';
import Spinner from '../ui/Spinner';

interface ForgotPasswordFormProps {
    initialEmail: string;
    onBackToLogin: () => void;
    onSuccess: (email: string) => void;
    customEasing: [number, number, number, number];
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
    initialEmail, 
    onBackToLogin, 
    onSuccess, 
    customEasing 
}) => {
    const { t } = useTranslation();
    const { resetPassword } = useAuth();
    
    const [email, setEmail] = useState(initialEmail);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError(t('auth.login.enterEmail', 'Introdueix el teu correu electrònic.'));
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            await resetPassword(email);
            onSuccess(email);
        } catch (err: unknown) {
            console.error(err);
            setError(t('auth.login.errorReset', "No s'ha pogut enviar el correu. Comprova que l'adreça sigui correcta."));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            key="forgot-password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: customEasing }}
            className="relative z-10 w-full"
        >
            <button
                type="button"
                onClick={onBackToLogin}
                className="absolute -top-4 -left-4 p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5 z-20"
                aria-label="Enrere"
            >
                <ChevronLeft size={24} />
            </button>
            
            <div className="text-center mb-10 mt-4">
                <h2 className="text-3xl font-bold text-white mb-3">{t('auth.login.recoverTitle', 'Recuperar')}</h2>
                <p className="text-slate-400 text-sm font-light">{t('auth.login.recoverSubtitle', "T'enviarem un enllaç per restablir la teva contrasenya.")}</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                    <PremiumInput
                        id="reset-email"
                        type="email"
                        label={t('auth.login.email', 'Correu Electrònic')}
                        icon={Mail}
                        theme="sky"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        required
                    />
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="overflow-hidden"
                        >
                            <div className="p-3 mt-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
                                {error}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="relative w-full group overflow-hidden rounded-xl bg-sky-500/90 text-white font-bold py-4 transition duration-500 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_40px_rgba(14,165,233,0.6)]"
                        aria-label="Botó interactiu"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative flex items-center justify-center gap-2 h-6 overflow-hidden">
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div key="loading" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }}>
                                        <Spinner size="sm" variant="sky" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="text" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }} className="flex items-center gap-2">
                                        <span>{t('auth.login.sendLink', 'Enviar Enllaç')}</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-500" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

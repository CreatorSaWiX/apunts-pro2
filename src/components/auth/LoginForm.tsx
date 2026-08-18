import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Mail } from 'lucide-react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { PremiumInput } from '../ui/inputs/PremiumInput';
import Spinner from '../ui/Spinner';
import { getFirebaseErrorMessage } from '../../utils/authErrors';

interface LoginFormProps {
    onForgotPassword: (email: string) => void;
    customEasing: [number, number, number, number];
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, customEasing }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err: unknown) {
            console.error(err);
            setError(getFirebaseErrorMessage(err, t));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: customEasing }}
            className="relative z-10 w-full"
        >
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-3">{t('auth.login.title', 'Iniciar Sessió')}</h2>
                <p className="text-slate-400 text-sm font-light">{t('auth.login.subtitle', 'Entén les bases tecnològiques del món digital.')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <PremiumInput
                        id="email"
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

                <div className="space-y-2">
                    <PremiumInput
                        id="password"
                        type="password"
                        label={t('auth.login.password', 'Contrasenya')}
                        icon={Lock}
                        theme="sky"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        required
                    />
                    <div className="flex justify-end pr-2">
                        <button 
                            type="button" 
                            onClick={() => onForgotPassword(email)} 
                            className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                        >
                            {t('auth.login.forgotPassword', 'Has oblidat la contrasenya?')}
                        </button>
                    </div>
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
                                        <span>{t('auth.login.submit', 'Accedir al compte')}</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-500" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-slate-500">
                {t('auth.login.noAccount', 'No tens un compte encara? ')}
                <Link to="/register" className="text-white hover:text-sky-400 transition-colors inline-flex items-center gap-1 group relative">
                    {t('auth.login.registerNow', "Registra't ara")}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-sky-400 transition group-hover:w-full"></span>
                </Link>
            </div>
        </motion.div>
    );
};

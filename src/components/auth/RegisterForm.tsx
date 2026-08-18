import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, Mail } from 'lucide-react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { PremiumInput } from '../ui/inputs/PremiumInput';
import Spinner from '../ui/Spinner';
import { getFirebaseErrorMessage } from '../../utils/authErrors';

interface RegisterFormProps {
    onOpenPrivacy: () => void;
    customEasing: [number, number, number, number];
}

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
    // Note: transition is injected by parent or merged
};

export const RegisterForm: React.FC<RegisterFormProps> = ({ onOpenPrivacy, customEasing }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { signup } = useAuth();
    
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await signup(email, password, username);
            navigate('/');
        } catch (err: unknown) {
            console.error(err);
            setError(getFirebaseErrorMessage(err, t));
        } finally {
            setIsLoading(false);
        }
    };

    // Include transition dynamically
    const fadeInUpWithTransition = {
        ...fadeInUp,
        show: { ...fadeInUp.show, transition: { duration: 0.8, ease: customEasing } }
    };

    return (
        <>
            <motion.div variants={fadeInUpWithTransition} className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-3">{t('auth.register.title', 'Crear compte')}</h2>
                <p className="text-slate-400 text-sm font-light">{t('auth.register.subtitle', "Accedeix a l'arquitectura del coneixement.")}</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Username Field */}
                <motion.div variants={fadeInUpWithTransition}>
                    <PremiumInput
                        id="username"
                        type="text"
                        label={t('auth.register.username', "Nom d'usuari")}
                        icon={User}
                        theme="emerald"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError('');
                        }}
                        required
                    />
                </motion.div>

                {/* Email Field */}
                <motion.div variants={fadeInUpWithTransition}>
                    <PremiumInput
                        id="email"
                        type="email"
                        label={t('auth.login.email', 'Correu Electrònic')}
                        icon={Mail}
                        theme="emerald"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        required
                    />
                </motion.div>

                {/* Password Field */}
                <motion.div variants={fadeInUpWithTransition}>
                    <PremiumInput
                        id="password"
                        type="password"
                        label={t('auth.login.password', 'Contrasenya')}
                        icon={Lock}
                        theme="emerald"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        minLength={6}
                        required
                    />
                </motion.div>

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

                <motion.div variants={fadeInUpWithTransition} className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="relative w-full group overflow-hidden rounded-xl bg-emerald-500/90 text-white font-bold py-4 transition duration-500 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]"
                        aria-label="Botó interactiu"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
                        
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-400 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative flex items-center justify-center gap-2 h-6 overflow-hidden">
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Spinner size="sm" variant="emerald" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="text"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span>{t('auth.register.submit', 'Crear compte ara')}</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-500" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </button>
                </motion.div>

                <motion.div variants={fadeInUpWithTransition} className="text-center mt-4">
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                        {t('auth.register.acceptTerms', 'En registrar-vos, accepteu la nostra ')}
                        <button 
                            type="button" 
                            onClick={onOpenPrivacy}
                            className="text-slate-300 hover:text-emerald-400 underline decoration-slate-600 hover:decoration-emerald-400/50 underline-offset-2 transition"
                        >
                            {t('auth.register.privacyPolicy', 'Política de Privacitat')}
                        </button>
                    </p>
                </motion.div>
            </form>

            <motion.div variants={fadeInUpWithTransition} className="mt-8 text-center text-sm font-medium text-slate-500">
                {t('auth.register.hasAccount', 'Ja tens un compte? ')}
                <Link to="/login" className="text-white hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group relative">
                    {t('auth.register.login', 'Iniciar sessió')}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-400 transition group-hover:w-full"></span>
                </Link>
            </motion.div>
        </>
    );
};

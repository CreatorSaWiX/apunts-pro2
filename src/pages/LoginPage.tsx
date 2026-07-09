import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, ArrowRight, Mail, CheckCircle2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthCanvasBackground } from '../components/ui/AuthCanvasBackground';
import { PremiumInput } from '../components/ui/PremiumInput';
import Spinner from '../components/ui/Spinner';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [view, setView] = useState<'login' | 'forgot-password' | 'success'>('login');
    const { login, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Credencials incorrectes. Torna-ho a provar.');
            } else {
                setError('Hi ha hagut un error en iniciar sessió: ' + err.code);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Introdueix el teu correu electrònic.');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            await resetPassword(email);
            setView('success');
        } catch (err: any) {
            console.error(err);
            setError("No s'ha pogut enviar el correu. Comprova que l'adreça sigui correcta.");
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants
    const customEasing: any = [0.16, 1, 0.3, 1]; // Premium smooth ease

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: customEasing } }
    };

    return (
        <div className="min-h-screen flex w-full bg-[#020617] text-slate-200 font-sans selection:bg-sky-500/30 overflow-hidden relative">
            <AuthCanvasBackground variant="login" />

            {/* Form Panel */}
            <div className="w-full h-screen flex items-center justify-center lg:justify-end lg:pr-[10%] xl:pr-[15%] p-6 sm:p-12 relative z-10 pointer-events-none">
                <div className="w-full max-w-md relative pointer-events-auto">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="bg-[#020617]/10 backdrop-blur-[2px] border border-white/5 border-t-white/10 border-l-white/10 sm:p-10 p-8 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] relative"
                    >
                        {/* Contenidor intern per retallar efectes sense trencar el blur a Chrome */}
                        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
                            {/* Noise texture overlay for premium feel */}
                            <div className="absolute inset-0 opacity-[0.01] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                            {/* Shimmer light effect over the panel */}
                            <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg] animate-pulse opacity-100" />
                        </div>

                        <AnimatePresence mode="wait">
                            {view === 'login' && (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.4, ease: customEasing }}
                                    className="relative z-10 w-full"
                                >
                                    <div className="text-center mb-10">
                                        <h2 className="text-3xl font-bold text-white mb-3">Iniciar Sessió</h2>
                                        <p className="text-slate-400 text-sm font-light">Entén les bases tecnològiques del món digital.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <PremiumInput
                                                id="email"
                                                type="email"
                                                label="Correu Electrònic"
                                                icon={Mail}
                                                theme="sky"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <PremiumInput
                                                id="password"
                                                type="password"
                                                label="Contrasenya"
                                                icon={Lock}
                                                theme="sky"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <div className="flex justify-end pr-2">
                                                <button type="button" onClick={() => { setView('forgot-password'); setError(''); }} className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 transition-colors">Has oblidat la contrasenya?</button>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                    exit={{ opacity: 0, height: 0, y: -10 }}
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
                                                className="relative w-full group overflow-hidden rounded-xl bg-sky-500/90 text-white font-bold py-4 transition-all duration-500 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_40px_rgba(14,165,233,0.6)]"
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
                                                                <span>Accedir al compte</span>
                                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-500" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </button>
                                        </div>
                                    </form>

                                    <div className="mt-8 text-center text-sm font-medium text-slate-500">
                                        No tens un compte encara?{' '}
                                        <Link to="/register" className="text-white hover:text-sky-400 transition-colors inline-flex items-center gap-1 group relative">
                                            Registra't ara
                                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-sky-400 transition-all group-hover:w-full"></span>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {view === 'forgot-password' && (
                                <motion.div
                                    key="forgot-password"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4, ease: customEasing }}
                                    className="relative z-10 w-full"
                                >
                                    <button onClick={() => { setView('login'); setError(''); }} className="absolute -top-4 -left-4 p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5 z-20">
                                        <ChevronLeft size={24} />
                                    </button>
                                    
                                    <div className="text-center mb-10 mt-4">
                                        <h2 className="text-3xl font-bold text-white mb-3">Recuperar</h2>
                                        <p className="text-slate-400 text-sm font-light">T'enviarem un enllaç per restablir la teva contrasenya.</p>
                                    </div>

                                    <form onSubmit={handleResetPassword} className="space-y-6">
                                        <div>
                                            <PremiumInput
                                                id="reset-email"
                                                type="email"
                                                label="Correu Electrònic"
                                                icon={Mail}
                                                theme="sky"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <AnimatePresence>
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                    exit={{ opacity: 0, height: 0, y: -10 }}
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
                                                className="relative w-full group overflow-hidden rounded-xl bg-sky-500/90 text-white font-bold py-4 transition-all duration-500 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_40px_rgba(14,165,233,0.6)]"
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
                                                                <span>Enviar Enllaç</span>
                                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-500" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {view === 'success' && (
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
                                    <h2 className="text-2xl font-bold text-white mb-3">Correu Enviat!</h2>
                                    <p className="text-slate-400 text-sm font-light mb-8 max-w-[280px]">
                                        T'hem enviat un correu a <span className="text-white font-medium">{email}</span> amb instruccions per restablir la teva contrasenya.
                                    </p>
                                    <button 
                                        onClick={() => { setView('login'); setPassword(''); }}
                                        className="text-sky-400 font-semibold hover:text-sky-300 transition-colors flex items-center gap-2 group"
                                    >
                                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                        Tornar a Iniciar Sessió
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User, ArrowRight, Loader, Mail, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await signup(email, password, username, inviteCode);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Aquest correu electrònic ja està registrat.');
            } else if (err.code === 'auth/weak-password') {
                setError('La contrasenya ha de tenir almenys 6 caràcters.');
            } else if (err.message && err.message.includes('validació')) {
                setError(err.message);
            } else {
                setError('Error al registrar-se. Verifica el codi d\'invitació.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative z-10 pt-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-sky-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                        <User className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Crear compte</h1>
                    <p className="text-slate-400 text-sm">Registra't per accedir a la comunitat</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Nom d'usuari</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                                placeholder="el_teu_nom"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Correu Electrònic</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                                placeholder="exemple@correu.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Contrasenya</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                                placeholder="••••••••"
                                minLength={6}
                                required
                            />
                        </div>
                    </div>

                    {/* Invitation Code */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                            <Key size={12} /> Codi d'Invitació <span className="text-slate-500 normal-case tracking-normal">(Opcional)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                className="w-full bg-slate-950/50 border border-emerald-500/30 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-center tracking-widest font-mono"
                                placeholder="Només editors"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                    >
                        {isLoading ? (
                            <Loader className="animate-spin" size={20} />
                        ) : (
                            <>
                                Crear compte
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Ja tens compte?{' '}
                    <Link to="/login" className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors font-medium">
                        Vés a iniciar sessió
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;

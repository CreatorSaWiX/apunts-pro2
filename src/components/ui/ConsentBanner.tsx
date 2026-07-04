import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X } from 'lucide-react';

export const ConsentBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('analytics-consent');
        if (!consent) {
            // Un petit retard perquè no aparegui de cop només carregar la pàgina
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleConsent = (accepted: boolean) => {
        localStorage.setItem('analytics-consent', accepted ? 'granted' : 'denied');
        setIsVisible(false);
        if (accepted) {
            // Refrescar per aplicar l'Analytics, o es podria gestionar via un Context
            window.location.reload();
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed bottom-6 right-6 z-50 max-w-sm w-full md:w-auto"
                >
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl overflow-hidden relative">
                        {/* Elegant glow effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />
                        
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 shrink-0">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-medium mb-1.5 text-sm">Privacitat i Experiència</h3>
                                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                                    Fem servir dades anònimes per entendre com interactues amb la plataforma i millorar l'experiència d'usuari.
                                </p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleConsent(true)}
                                        className="flex-1 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-colors border border-white/5"
                                    >
                                        Acceptar
                                    </button>
                                    <button
                                        onClick={() => handleConsent(false)}
                                        className="flex-1 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white text-xs font-medium py-2 px-4 rounded-xl transition-colors"
                                    >
                                        Rebutjar
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition-colors p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePWA } from '../../../contexts/PWAContext';
import { m as motion, AnimatePresence } from 'framer-motion';
import { WifiOff, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SWOfflineIndicator = () => {
    const { t } = useTranslation();
    const { offlineReady, setOfflineReady } = usePWA();
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const dismiss = useCallback(() => {
        setIsVisible(false);
        setOfflineReady(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, [setOfflineReady]);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            dismiss();
        }, 4000);
    }, [dismiss]);

    const pauseTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (offlineReady) {
            setIsVisible(true);
            startTimer();
        }
    }, [offlineReady, startTimer]);

    // Expose dev helper to trigger and verify the toast on-demand
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as unknown as { __triggerOfflineToast?: () => void }).__triggerOfflineToast = () => {
                setOfflineReady(true);
            };
        }
    }, [setOfflineReady]);

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-6 md:left-6 md:translate-x-0 z-[100] pointer-events-auto px-4 md:px-0 max-w-[calc(100vw-1.5rem)] md:max-w-max w-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        onMouseEnter={pauseTimer}
                        onMouseLeave={startTimer}
                        className="group relative flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#0B1120]/85 border border-white/[0.12] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-[24px] select-none"
                        style={{
                            WebkitBackdropFilter: 'blur(24px)',
                            WebkitTransform: 'translateZ(0)',
                            transform: 'translateZ(0)'
                        }}
                    >
                        {/* Top specular reflection line */}
                        <div className="absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[0.5px] pointer-events-none" />

                        {/* Single Offline Icon (Wifi tatxat) */}
                        <WifiOff size={14} strokeWidth={2.2} className="text-slate-300 shrink-0" />

                        {/* Minimalist Copy (Apple / Linear style) */}
                        <span className="text-[12px] sm:text-[13px] font-medium tracking-tight text-slate-200 whitespace-nowrap">
                            {t('sw.offlineReady', t('sw.offlineReadyTitle', 'Disponible sense connexió'))}
                        </span>

                        {/* Subtle Dismiss Button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                dismiss();
                            }}
                            aria-label="Tancar notificació"
                            className="p-0.5 -mr-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer ml-1"
                        >
                            <X size={12} strokeWidth={2.4} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

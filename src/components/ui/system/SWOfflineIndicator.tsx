import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Wifi, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SWOfflineIndicator = () => {
    const { t } = useTranslation();
    const {
        offlineReady: [offlineReady, setOfflineReady],
    } = useRegisterSW();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (offlineReady) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setOfflineReady(false);
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [offlineReady, setOfflineReady]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 backdrop-blur-md"
                >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <Wifi size={16} className="text-emerald-400" />
                    </div>
                    <div className="flex flex-col pr-2">
                        <span className="text-sm font-bold text-white">
                            {t('sw.offlineReadyTitle', 'App llesta per funcionar sense connexió')}
                        </span>
                        <span className="text-xs text-slate-400">
                            {t('sw.offlineReadyDesc', 'Els apunts bàsics s\'han descarregat correctament.')}
                        </span>
                    </div>
                    <button 
                        onClick={() => {
                            setIsVisible(false);
                            setOfflineReady(false);
                        }}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors ml-2"
                    >
                        <X size={14} className="text-slate-400 hover:text-white" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

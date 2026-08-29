import { m as motion } from 'framer-motion';
import { Globe, BellRing, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePushNotifications } from '../../hooks/usePushNotifications';
export const GeneralSection = () => {
    const { t, i18n } = useTranslation();
    const preferredLang = i18n.language;
    const { status, canRequest, requestPermission, isStandalone, isMobile } = usePushNotifications();

    return (
        <div id="general" className="flex flex-col items-start gap-8 w-full pt-4 pb-12">
            <div className="w-full flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{t('settings.language', 'Idioma')}</h2>
                    <p className="text-slate-400 text-sm font-medium">{t('settings.languageDesc', "L'idioma principal de l'aplicació.")}</p>
                </div>

                <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto relative flex-wrap sm:flex-nowrap gap-1">
                    <button type="button"
                        onClick={() => i18n.changeLanguage('ca')}
                        className="relative flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition duration-300 outline-none z-10 group"
                    >
                        {preferredLang === 'ca' && (
                            <motion.div layoutId="lang-active-bg" className="absolute inset-0 bg-white/10 rounded-xl shadow-sm border border-white/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                        )}
                        <Globe size={16} className={`shrink-0 relative z-10 transition-colors duration-300 ${preferredLang === 'ca' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <span className={`relative z-10 text-sm font-semibold transition-colors duration-300 ${preferredLang === 'ca' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{t('common.languages.ca', 'Català')}</span>
                    </button>

                    <button type="button"
                        onClick={() => i18n.changeLanguage('es')}
                        className="relative flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition duration-300 outline-none z-10 group"
                    >
                        {preferredLang === 'es' && (
                            <motion.div layoutId="lang-active-bg" className="absolute inset-0 bg-white/10 rounded-xl shadow-sm border border-white/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                        )}
                        <Globe size={16} className={`shrink-0 relative z-10 transition-colors duration-300 ${preferredLang === 'es' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <span className={`relative z-10 text-sm font-semibold transition-colors duration-300 ${preferredLang === 'es' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{t('common.languages.es', 'Español')}</span>
                    </button>

                    <button type="button"
                        onClick={() => i18n.changeLanguage('en')}
                        className="relative flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition duration-300 outline-none z-10 group"
                    >
                        {preferredLang === 'en' && (
                            <motion.div layoutId="lang-active-bg" className="absolute inset-0 bg-white/10 rounded-xl shadow-sm border border-white/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                        )}
                        <Globe size={16} className={`shrink-0 relative z-10 transition-colors duration-300 ${preferredLang === 'en' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <span className={`relative z-10 text-sm font-semibold transition-colors duration-300 ${preferredLang === 'en' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{t('common.languages.en', 'English')}</span>
                    </button>
                </div>
            </div>

            {/* Notificacions Push */}
            <div className="w-full flex flex-col md:flex-row md:items-center justify-between pb-6 gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{t('settings.push.title', 'Notificacions Push')}</h2>
                    <p className="text-slate-400 text-sm font-medium">{t('settings.push.desc', "Alertes de la comunitat i del planificador.")}</p>
                </div>

                <div className="flex bg-white/[0.03] p-4 rounded-2xl border border-white/10 w-full md:w-[350px] relative items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                        status === 'granted' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                        status === 'denied' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                    }`}>
                        {status === 'granted' ? <CheckCircle2 size={20} /> : status === 'denied' ? <AlertCircle size={20} /> : (isMobile && !isStandalone ? <Smartphone size={20} /> : <BellRing size={20} />)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        {status === 'granted' ? (
                            <div className="text-sm font-bold text-emerald-400">{t('settings.push.status.active', 'Activat')}</div>
                        ) : status === 'denied' ? (
                            <div className="text-sm font-bold text-red-400">{t('settings.push.status.denied', 'Bloquejat')}</div>
                        ) : (
                            <div className="text-sm font-bold text-slate-300">{t('settings.push.status.inactive', 'Desactivat')}</div>
                        )}
                        <div className="text-[11px] text-slate-500 truncate">
                            {status === 'granted' ? t('settings.push.status.activeDesc', 'Rep alertes en aquest dispositiu') : 
                             status === 'denied' ? t('settings.push.status.deniedDesc', 'Permisos denegats al navegador') : 
                             (isMobile && !isStandalone ? t('settings.push.status.pwaHint', "Cal instal·lar com a PWA (Pantalla d'inici)") : t('settings.push.status.inactiveDesc', 'Requereix acció manual'))}
                        </div>
                    </div>

                    {canRequest && (
                        <button
                            onClick={requestPermission}
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] shrink-0"
                        >
                            {t('settings.push.enable', 'Activar')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

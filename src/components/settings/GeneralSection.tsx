import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
export const GeneralSection = () => {
    const { t, i18n } = useTranslation();
    const preferredLang = i18n.language;

    return (
        <div id="general" className="flex flex-col items-start gap-8 w-full pt-4 pb-12">
            <div className="w-full flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{t('settings.language', 'Idioma')}</h2>
                    <p className="text-slate-400 text-sm font-medium">{t('settings.languageDesc', "L'idioma principal de l'aplicació.")}</p>
                </div>

                <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto relative flex-wrap sm:flex-nowrap gap-1">
                    <button
                        onClick={() => i18n.changeLanguage('ca')}
                        className="relative flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 outline-none z-10 group"
                    >
                        {preferredLang === 'ca' && (
                            <motion.div layoutId="lang-active-bg" className="absolute inset-0 bg-white/10 rounded-xl shadow-sm border border-white/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                        )}
                        <Globe size={16} className={`relative z-10 transition-colors duration-300 ${preferredLang === 'ca' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <span className={`relative z-10 text-sm font-semibold transition-colors duration-300 ${preferredLang === 'ca' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{t('common.languages.ca', 'Català')}</span>
                    </button>

                    <button
                        onClick={() => i18n.changeLanguage('es')}
                        className="relative flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 outline-none z-10 group"
                    >
                        {preferredLang === 'es' && (
                            <motion.div layoutId="lang-active-bg" className="absolute inset-0 bg-white/10 rounded-xl shadow-sm border border-white/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                        )}
                        <Globe size={16} className={`relative z-10 transition-colors duration-300 ${preferredLang === 'es' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <span className={`relative z-10 text-sm font-semibold transition-colors duration-300 ${preferredLang === 'es' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{t('common.languages.es', 'Español')}</span>
                    </button>

                    <button
                        onClick={() => i18n.changeLanguage('en')}
                        className="relative flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 outline-none z-10 group"
                    >
                        {preferredLang === 'en' && (
                            <motion.div layoutId="lang-active-bg" className="absolute inset-0 bg-white/10 rounded-xl shadow-sm border border-white/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                        )}
                        <Globe size={16} className={`relative z-10 transition-colors duration-300 ${preferredLang === 'en' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <span className={`relative z-10 text-sm font-semibold transition-colors duration-300 ${preferredLang === 'en' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{t('common.languages.en', 'English')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

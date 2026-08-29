import { useState, useMemo, lazy, Suspense } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Settings2, Sparkles, Bot, Database, Keyboard, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';

import { GeneralSection } from '../components/settings/GeneralSection';
import { SubjectsSection } from '../components/settings/SubjectsSection';

// Seccions secundàries carregades amb Lazy Load (Code Splitting)
const PlannerSection = lazy(() => import('../components/settings/PlannerSection').then(m => ({ default: m.PlannerSection })));
const PrivacySection = lazy(() => import('../components/settings/PrivacySection').then(m => ({ default: m.PrivacySection })));
const DeleteAccSection = lazy(() => import('../components/settings/DeleteAccSection').then(m => ({ default: m.DeleteAccSection })));
const AISection = lazy(() => import('../components/settings/AISection').then(m => ({ default: m.AISection })));
const AboutSection = lazy(() => import('../components/settings/AboutSection').then(m => ({ default: m.AboutSection })));
const OfflineSection = lazy(() => import('../components/settings/OfflineSection').then(m => ({ default: m.OfflineSection })));
const ShortcutsSection = lazy(() => import('../components/settings/ShortcutsSection').then(m => ({ default: m.ShortcutsSection })));

type TabId = 'general' | 'shortcuts' | 'offline' | 'ai' | 'about';

const SettingsPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<TabId>('general');
    const [mobileView, setMobileView] = useState<'menu' | 'content'>('menu');

    const TABS = useMemo<{ id: TabId; label: string; icon: LucideIcon }[]>(() => [
        { id: 'general', label: t('nav.general', 'General'), icon: Settings2 },
        { id: 'shortcuts', label: t('nav.shortcuts', 'Dreceres'), icon: Keyboard },
        { id: 'offline', label: t('nav.offline', 'Emmagatzematge'), icon: Database },
        { id: 'ai', label: t('nav.ai', 'Assistent IA'), icon: Bot },
        { id: 'about', label: t('nav.about', 'Quant a'), icon: Sparkles },
    ], [t]);

    const availableTabs = useMemo(() => TABS.filter(tab => {
        if (tab.id === 'ai' && !user) return false;
        return true;
    }), [TABS, user]);

    const handleTabClick = (id: TabId) => {
        setActiveTab(id);
        if (isMobile) setMobileView('content');
    };

    const renderActiveSection = () => {
        switch (activeTab) {
            case 'general': return (
                <div className="flex flex-col">
                    <GeneralSection />
                    <SubjectsSection />
                    {user && (
                        <>
                            <PlannerSection />
                            <PrivacySection />
                            <DeleteAccSection />
                        </>
                    )}
                </div>
            );
            case 'shortcuts': return <ShortcutsSection />;
            case 'offline': return <OfflineSection />;
            case 'ai': return user ? <AISection /> : null;
            case 'about': return <AboutSection />;
            default: return null;
        }
    };

    return (
        <div className="w-full h-dvh bg-[#0a0d16] text-slate-300 overflow-hidden relative selection:bg-sky-500/30 selection:text-sky-200">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="hidden md:block absolute top-0 right-0 w-[800px] h-[800px] bg-sky-500/10 rounded-full blur-[150px] opacity-70" />
                <div className="hidden md:block absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[150px] opacity-70" />
                <div className="md:hidden absolute inset-0 bg-linear-to-br from-sky-900/10 to-rose-900/10" />
                <div className="noise-bg absolute inset-0 opacity-[0.03]" />
            </div>

            {/* Scrolling Wrapper (Scrollbar at the far right) */}
            <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10">
                <div className="w-full max-w-[1100px] mx-auto min-h-full flex flex-col md:flex-row relative">
                    {/* Sidebar (Desktop) / Header (Mobile) */}
                    {(!isMobile || mobileView === 'menu') && (
                        <aside className={`${isMobile ? 'w-full' : 'w-full md:w-[280px]'} shrink-0 flex flex-col z-20 md:sticky md:top-0 md:h-dvh relative bg-transparent border-none`}>
                            {isMobile && (
                                <div className="px-6 pt-12 pb-2">
                                    <h1 className="text-2xl font-bold text-white">Configuració</h1>
                                </div>
                            )}
                            <nav className="flex-1 flex flex-col justify-start md:justify-center px-6 md:px-8 gap-2 py-4 md:py-2">
                                {availableTabs.map(tab => {
                                    const isActive = !isMobile && activeTab === tab.id;
                                    return (
                                        <button type="button"
                                            key={tab.id}
                                            onClick={() => handleTabClick(tab.id)}
                                            className={`w-full group relative flex items-center justify-between px-4 py-4 md:py-3 transition duration-300 outline-none text-left rounded-xl ${isMobile ? 'bg-white/5 mb-1' : ''}`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="sidebar-active-tab"
                                                    className="absolute inset-0 bg-white/10 rounded-xl"
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                            <div className="relative z-10 flex items-center gap-3">
                                                <tab.icon
                                                    size={18}
                                                    className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}
                                                />
                                                <span className={`font-semibold text-[15px] md:text-[14px] transition-colors duration-300 ${isActive ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                                    {tab.label}
                                                </span>
                                            </div>
                                            {isMobile && (
                                                <ChevronRight size={18} className="text-slate-500 relative z-10" />
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </aside>
                    )}

                    {/* Main Content Area */}
                    {(!isMobile || mobileView === 'content') && (
                        <main className="flex-1 h-auto relative z-20 pb-28 md:pb-20 safe-area-bottom">
                            <div className="w-full px-6 py-6 md:px-12 md:py-20 flex flex-col items-start justify-start min-h-full">
                                {isMobile && (
                                    <button
                                        onClick={() => setMobileView('menu')}
                                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                        <span className="font-medium text-[15px]">{t('common.back', 'Tornar')}</span>
                                    </button>
                                )}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 10, filter: isMobile ? 'none' : 'blur(4px)' }}
                                        animate={{ opacity: 1, y: 0, filter: isMobile ? 'none' : 'blur(0px)' }}
                                        exit={{ opacity: 0, y: -10, filter: isMobile ? 'none' : 'blur(4px)' }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className="w-full"
                                    >
                                        <Suspense fallback={<div className="w-full flex items-center justify-center p-12 text-slate-500 animate-pulse font-medium">Carregant secció...</div>}>
                                            {renderActiveSection()}
                                        </Suspense>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </main>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
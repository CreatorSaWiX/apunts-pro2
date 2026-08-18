import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Settings2, Sparkles, Bot, Database, Keyboard, type LucideIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';

import { GeneralSection } from '../components/settings/GeneralSection';
import { PlannerSection } from '../components/settings/PlannerSection';
import { SubjectsSection } from '../components/settings/SubjectsSection';
import { PrivacySection } from '../components/settings/PrivacySection';
import { DeleteAccSection } from '../components/settings/DeleteAccSection';
import { AISection } from '../components/settings/AISection';
import { AboutSection } from '../components/settings/AboutSection';
import { OfflineSection } from '../components/settings/OfflineSection';
import { ShortcutsSection } from '../components/settings/ShortcutsSection';

type TabId = 'general' | 'shortcuts' | 'offline' | 'ai' | 'about';

const SettingsContent = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<TabId>('general');

    const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
        { id: 'general', label: t('nav.general', 'General'), icon: Settings2 },
        { id: 'shortcuts', label: t('nav.shortcuts', 'Dreceres'), icon: Keyboard },
        { id: 'offline', label: t('nav.offline', 'Emmagatzematge'), icon: Database },
        { id: 'ai', label: t('nav.ai', 'Assistent IA'), icon: Bot },
        { id: 'about', label: t('nav.about', 'Quant a'), icon: Sparkles },
    ];

    const availableTabs = TABS.filter(tab => {
        if (tab.id === 'ai' && !user) return false;
        return true;
    });

    const renderActiveSection = () => {
        switch (activeTab) {
            case 'general': return (
                <div className="flex flex-col">
                    {!isMobile && <GeneralSection />}
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
                    <aside className="w-full md:w-[280px] shrink-0 flex flex-col z-20 md:sticky md:top-0 md:h-dvh relative bg-transparent border-none">
                        <nav className="flex-1 flex md:flex-col justify-start md:justify-center overflow-x-auto custom-scrollbar px-6 md:px-8 gap-1 md:overflow-x-hidden hide-scrollbar py-2">
                            {availableTabs.map(tab => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button type="button"
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`shrink-0 group relative flex items-center px-4 py-3 transition duration-300 outline-none text-left rounded-xl`}
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
                                            <span className={`font-semibold text-[14px] transition-colors duration-300 ${isActive ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                                {tab.label}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 h-auto relative z-20 pb-28 md:pb-20 safe-area-bottom">
                        <div className="w-full px-6 py-8 md:px-12 md:py-20 flex flex-col items-start justify-start min-h-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10, filter: isMobile ? 'none' : 'blur(4px)' }}
                                    animate={{ opacity: 1, y: 0, filter: isMobile ? 'none' : 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -10, filter: isMobile ? 'none' : 'blur(4px)' }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="w-full"
                                >
                                    {renderActiveSection()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

const SettingsPage = () => {
    return <SettingsContent />;
};

export default SettingsPage;
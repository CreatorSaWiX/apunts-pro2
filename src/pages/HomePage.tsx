import { useEffect, useState, useRef, useMemo, lazy, Suspense } from 'react';
import { useSubjectStore } from '../stores/useSubjectStore';
import { useSettingsStore, DEFAULT_HOME_SUBJECTS } from '../stores/useSettingsStore';
import Hero from '../components/Hero';
import { m as motion } from 'framer-motion';
import TopicCarousel from '../components/TopicCarousel';
import NavigationPill from '../components/ui/NavigationPill';
import { useIsMobile } from '../hooks/useIsMobile';

const MobileActionMenu = lazy(() => import('../components/MobileActionMenu'));

const HomePage = () => {
    const { subject, setSubject } = useSubjectStore();
    const { homeSubjects } = useSettingsStore();

    // Ensure displaySubjects has a fallback and is stable
    const displaySubjects = useMemo(() => {
        return homeSubjects.length > 0 ? homeSubjects : DEFAULT_HOME_SUBJECTS;
    }, [homeSubjects]);

    // If current subject is not in the active subjects list (e.g. deleted from Settings),
    // immediately fall back to the first available subject.
    const isCurrentSubjectValid = displaySubjects.some(
        s => s.toUpperCase() === subject.toUpperCase()
    );
    const activeSubject = isCurrentSubjectValid ? subject : displaySubjects[0];

    const [displaySubject, setDisplaySubject] = useState(activeSubject);
    const [prevSubject, setPrevSubject] = useState(activeSubject);
    const [isExiting, setIsExiting] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync activeSubject to displaySubject during render to avoid cascading renders
    if (activeSubject !== prevSubject) {
        setPrevSubject(activeSubject);
        if (!isExiting) {
            setDisplaySubject(activeSubject);
        }
    }

    // Sync store if current subject is invalid (e.g. after returning from settings)
    useEffect(() => {
        if (!isCurrentSubjectValid && displaySubjects.length > 0) {
            setSubject(displaySubjects[0]);
        }
    }, [isCurrentSubjectValid, displaySubjects, setSubject]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleSubjectChange = (newSubj: string) => {
        if (newSubj.toUpperCase() === activeSubject.toUpperCase() || isExiting) return;
        
        // Canviar colors, targetes i menú instantàniament
        setSubject(newSubj);
        setDisplaySubject(newSubj);
        
        // Activar animació de sortida només pel títol
        setIsExiting(true);
        
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        // Esperar a que acabi la sortida per fer l'entrada del nou títol
        timeoutRef.current = setTimeout(() => {
            setIsExiting(false);
        }, 200);
    };

    // Lock scroll on mount
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const isMobile = useIsMobile();

    return (
        <div className="h-dvh w-full flex flex-col overflow-hidden leading-tight">
            {/* Mobile Action Menu (Lazy loaded) */}
            {isMobile && (
                <Suspense fallback={null}>
                    <MobileActionMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
                </Suspense>
            )}

            {/* Subject Switcher - Premium Animated Pill */}
            <div className="hidden md:flex absolute top-4 right-4 md:top-6 md:right-8 z-50 scale-90 md:scale-100 origin-top-right transition">
                <NavigationPill>
                    {displaySubjects.map(subj => {
                        const isActive = activeSubject.toUpperCase() === subj.toUpperCase();
                        return (
                            <button type="button"
                                key={subj}
                                onClick={() => handleSubjectChange(subj)}
                                className={`relative px-4 md:px-5 h-9 md:h-10 flex items-center justify-center rounded-full text-[11px] md:text-[13px] font-black tracking-widest transition duration-300 z-10 ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 rounded-full border border-white/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_15px_rgba(var(--primary-rgb),0.5)] z-[-1]"
                                        style={{ 
                                            background: 'linear-gradient(to right, var(--primary), var(--accent))',
                                            borderRadius: 9999,
                                            WebkitTransform: 'translateZ(0)',
                                            transform: 'translateZ(0)'
                                        }}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    >
                                        <div className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                                    </motion.div>
                                )}
                                {subj.toUpperCase()}
                            </button>
                        );
                    })}
                </NavigationPill>
            </div>

            <div className="flex-none pt-4 z-20 pointer-events-none">
                <div className="pointer-events-auto">
                    <Hero isMenuOpen={isMenuOpen} subjectOverride={displaySubject} isExiting={isExiting} />
                </div>
            </div>
            <div className="flex-1 min-h-0 relative z-10 flex flex-col justify-center md:pt-0 md:-mt-4 pb-16">
                <TopicCarousel isMenuOpen={isMenuOpen} subjectOverride={displaySubject} />
            </div>
        </div>
    );
};

export default HomePage;

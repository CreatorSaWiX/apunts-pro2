import { useEffect, useState, useDeferredValue } from 'react';
import { useSubject } from '../contexts/SubjectContext';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';
import TopicCarousel from '../components/TopicCarousel';
import NavigationPill from '../components/ui/NavigationPill';
import { useIsMobile } from '../hooks/useIsMobile';
import { lazy, Suspense } from 'react';

const MobileActionMenu = lazy(() => import('../components/MobileActionMenu'));

const HomePage = () => {
    const { subject, setSubject } = useSubject();
    const deferredSubject = useDeferredValue(subject);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Lock scroll on mount
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const isMobile = useIsMobile();

    return (
        <div className="h-[100dvh] w-full flex flex-col overflow-hidden leading-tight">
            {/* Mobile Action Menu (Lazy loaded) */}
            {isMobile && (
                <Suspense fallback={null}>
                    <MobileActionMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
                </Suspense>
            )}

            {/* Subject Switcher - Premium Animated Pill */}
            <div className="hidden md:flex absolute top-4 right-4 md:top-6 md:right-8 z-50 scale-90 md:scale-100 origin-top-right transition-all">
                <NavigationPill>
                    <button
                        onClick={() => setSubject('pro2')}
                        className={`relative px-4 md:px-5 h-9 md:h-10 flex items-center justify-center rounded-full text-[11px] md:text-[13px] font-black tracking-widest transition-all duration-300 z-10 ${subject === 'pro2' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        {subject === 'pro2' && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-linear-to-r from-sky-400 to-blue-500 rounded-full border border-white/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_15px_rgba(56,189,248,0.5)] z-[-1]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            >
                                <div className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                            </motion.div>
                        )}
                        PRO2
                    </button>
                    <button
                        onClick={() => setSubject('m1')}
                        className={`relative px-4 md:px-5 h-9 md:h-10 flex items-center justify-center rounded-full text-[11px] md:text-[13px] font-black tracking-widest transition-all duration-300 z-10 ${subject === 'm1' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        {subject === 'm1' && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-linear-to-r from-violet-500 to-fuchsia-500 rounded-full border border-white/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_15px_rgba(139,92,246,0.5)] z-[-1]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            >
                                <div className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                            </motion.div>
                        )}
                        M1
                    </button>
                    <button
                        onClick={() => setSubject('m2')}
                        className={`relative px-4 md:px-5 h-9 md:h-10 flex items-center justify-center rounded-full text-[11px] md:text-[13px] font-black tracking-widest transition-all duration-300 z-10 ${subject === 'm2' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        {subject === 'm2' && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full border border-white/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_15px_rgba(16,185,129,0.5)] z-[-1]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            >
                                <div className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                            </motion.div>
                        )}
                        M2
                    </button>
                </NavigationPill>
            </div>

            <div className="flex-none pt-4 z-20 pointer-events-none">
                <div className="pointer-events-auto">
                    <Hero isMenuOpen={isMenuOpen} subjectOverride={deferredSubject} />
                </div>
            </div>
            <div className="flex-1 min-h-0 relative z-10 flex flex-col justify-center md:pt-0 md:-mt-4 pb-16">
                <TopicCarousel isMenuOpen={isMenuOpen} subjectOverride={deferredSubject} />
            </div>
        </div>
    );
};

export default HomePage;

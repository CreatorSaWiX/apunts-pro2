import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSubjectStore } from '../stores/useSubjectStore';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useNavigate } from 'react-router-dom';
import type { allPersonalNotes } from 'content-collections';
import { Book } from 'lucide-react';
import { m as motion, MotionConfig, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';
import { hapticSelection, hapticLight } from '../lib/haptics';
import { useTopicNotes } from '../hooks/useTopicNotes';
import { useSeenTopics } from '../hooks/useSeenTopics';
import { CarouselCard } from './TopicCarouselParts/CarouselCard';
import { LandscapeTopicCard } from './TopicCarouselParts/LandscapeTopicCard';

import type { MotionValue } from 'framer-motion';

type TopicNote = (typeof allPersonalNotes)[number];

interface PremiumScrubberProps {
    sortedTopics: TopicNote[];
    activeIndex: number;
    scrollToCard: (index: number, isRealDrag?: boolean) => void;
    scrollX: MotionValue<number>;
    itemWidth: number;
    t: TFunction;
}

const PremiumScrubber = React.memo(({ sortedTopics, activeIndex, scrollToCard, scrollX, itemWidth, t }: PremiumScrubberProps) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [pointerDownX, setPointerDownX] = useState<number | null>(null);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        setPointerDownX(e.clientX);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        handlePointerMove(e, true);
        hapticSelection();
    };

    const handlePointerMove = (e: React.PointerEvent, forceScroll = false) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        
        const percentage = x / rect.width;
        let newIndex = Math.round(percentage * (sortedTopics.length - 1));
        newIndex = Math.max(0, Math.min(newIndex, sortedTopics.length - 1));
        
        setHoverIndex(newIndex);
        
        let isRealDrag = false;
        if (pointerDownX !== null && Math.abs(e.clientX - pointerDownX) > 5) {
             isRealDrag = true;
        }
        
        if (isDragging || forceScroll) {
            if (newIndex !== activeIndex) {
                 scrollToCard(newIndex, isRealDrag);
                 if (isRealDrag) hapticLight();
            }
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        setPointerDownX(null);
        setHoverIndex(null);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    // The PHYSICAL position of the thumb is strictly bound to the real carousel scroll
    const scrollPercentage = useTransform(scrollX, [0, Math.max(1, sortedTopics.length - 1) * itemWidth], [0, 100]);
    const scrollTooltipX = useTransform(scrollPercentage, p => `${Math.max(0, Math.min(p as number, 100))}%`);

    if (sortedTopics.length <= 1) return null;

    // The text in the floating tooltip uses hoverIndex during drag, or activeIndex
    const displayIndex = isDragging && hoverIndex !== null ? hoverIndex : activeIndex;
    const safeDisplayIndex = Math.min(displayIndex, Math.max(0, sortedTopics.length - 1));
    const tooltipTextX = `${(safeDisplayIndex / Math.max(1, sortedTopics.length - 1)) * 100}%`;

    return (
        <div className="w-full flex justify-center mt-4 mb-2 px-6 z-40 touch-none pointer-events-auto">
            <div 
                ref={trackRef}
                className="relative w-full max-w-70 h-10 flex items-center cursor-grab active:cursor-grabbing group"
                onPointerDown={handlePointerDown}
                onPointerMove={isDragging ? handlePointerMove : undefined}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                {/* Ultra-sleek Track */}
                <div className="absolute left-0 right-0 h-1.5 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur-md border border-white/5">
                     <motion.div 
                        className="absolute top-0 bottom-0 left-0 bg-linear-to-r from-primary to-accent rounded-full"
                        style={{ width: scrollTooltipX }}
                     />
                </div>

                {/* Elegant Ticks */}
                <div className="absolute left-0 right-0 h-1.5 flex justify-between px-[2px] pointer-events-none">
                    {sortedTopics.map((_, i: number) => (
                         <div key={i} className={`w-0.5 h-full rounded-full transition-colors duration-300 ${safeDisplayIndex === i ? 'bg-white' : 'bg-white/20'}`} />
                    ))}
                </div>

                {/* Invisible, larger hit area for thumb */}
                <motion.div 
                    className="absolute top-1/2 -mt-4 -ml-4 w-8 h-8 z-20 flex items-center justify-center pointer-events-none"
                    style={{ left: scrollTooltipX }}
                >
                    {/* Minimalist dot indicator instead of the bulky handle */}
                    <motion.div 
                        className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] border border-primary/50"
                        animate={{ scale: isDragging ? 1.5 : 1 }}
                    />
                </motion.div>

                {/* Floating Tooltip - Redesigned for Awwwards */}
                <AnimatePresence>
                    {isDragging && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: -28, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="absolute top-0 -ml-[40px] w-[80px] flex flex-col items-center pointer-events-none"
                            style={{ left: tooltipTextX }}
                        >
                            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] whitespace-nowrap">
                                {t('topics.topic', 'Tema')} {safeDisplayIndex + 1}
                            </div>
                            <div className="w-1.5 h-1.5 bg-slate-900/95 border-b border-r border-white/20 rotate-45 -mt-[1px] z-[-1]" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
});

interface TopicCarouselProps {
    isMenuOpen?: boolean;
    subjectOverride?: string;
}

const PortraitCarousel = React.memo(({ isMenuOpen = false, subjectOverride }: TopicCarouselProps) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { subject: contextSubject } = useSubjectStore();
    const subject = (subjectOverride || contextSubject || '').toLowerCase();
    const { t, i18n } = useTranslation();
    const preferredLang = i18n.language;
    
    const [activeIndex, setActiveIndex] = useState(0);
    const { seenNewTopics, seenVersions, markAsSeen } = useSeenTopics();
    const seenNewTopicsSet = useMemo(() => new Set(seenNewTopics), [seenNewTopics]);
    const [allPersonalNotes, setAllPersonalNotes] = useState<(typeof import('content-collections'))['allPersonalNotes'][number][]>([]);

    useEffect(() => {
        import('content-collections').then(m => setAllPersonalNotes(m.allPersonalNotes)).catch(console.error);
    }, []);
    
    const isInteractive = !(isMobile && isMenuOpen);

    const { sortedTopics, topicMeta } = useTopicNotes(allPersonalNotes, subject, preferredLang);

    const carouselRef = useRef<HTMLDivElement>(null);
    const { scrollX } = useScroll({ container: carouselRef });
    
    const [itemWidth, setItemWidth] = useState(0);
    const [paddingOffset, setPaddingOffset] = useState(0);

    useEffect(() => {
        const updateMeasurements = () => {
            if (typeof window !== 'undefined') {
                // Perfect Apple App Store proportions: 82vw
                const idealWidth = Math.min(window.innerWidth * 0.82, 380);
                setItemWidth(idealWidth);
                setPaddingOffset((window.innerWidth - idealWidth) / 2);
            }
        };
        updateMeasurements();
        window.addEventListener('resize', updateMeasurements);
        return () => window.removeEventListener('resize', updateMeasurements);
    }, []);

    useMotionValueEvent(scrollX, "change", (latest) => {
        if (!isInteractive || itemWidth === 0) return;
        const newIndex = Math.round(latest / itemWidth);
        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < sortedTopics.length) {
            setActiveIndex(newIndex);
            hapticSelection();
        }
    });

    const scrollToCard = useCallback((index: number, instant = false) => {
        if (!isInteractive || !carouselRef.current) return;
        if (index >= 0 && index < sortedTopics.length) {
            if (instant) {
                carouselRef.current.style.scrollBehavior = 'auto';
                carouselRef.current.scrollTo({ left: index * itemWidth, behavior: 'auto' });
                // Reset back to smooth for normal interactions
                setTimeout(() => {
                    if (carouselRef.current) carouselRef.current.style.scrollBehavior = 'smooth';
                }, 10);
            } else {
                carouselRef.current.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
            }
        }
    }, [isInteractive, sortedTopics.length, itemWidth]);



    const lastRestoredSubject = useRef('');
    useEffect(() => {
        if (carouselRef.current && itemWidth > 0) {
            let newIndex = activeIndex;
            
            // Only load from session storage if subject actually changed
            if (lastRestoredSubject.current !== subject) {
                const saved = sessionStorage.getItem(`topic-carousel-h-${subject}`);
                if (saved) {
                    const index = parseInt(saved, 10);
                    if (!isNaN(index) && index >= 0 && index < sortedTopics.length) {
                        newIndex = index;
                    }
                }
                lastRestoredSubject.current = subject;
            } else {
                newIndex = Math.min(activeIndex, Math.max(0, sortedTopics.length - 1));
            }
            
            // Disable scroll animation for instant subject switch snap or remount snap
            carouselRef.current.style.scrollBehavior = 'auto';
            carouselRef.current.scrollLeft = newIndex * itemWidth;
            
            // Force layout reflow
            void carouselRef.current.offsetWidth;
            
            carouselRef.current.style.scrollBehavior = 'smooth';
            
            if (newIndex !== activeIndex) {
                setActiveIndex(newIndex);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subject, itemWidth, sortedTopics.length]); // removed isLandscape

    useEffect(() => {
        sessionStorage.setItem(`topic-carousel-h-${subject}`, activeIndex.toString());
    }, [activeIndex, subject]);


    if (sortedTopics.length === 0) {
        return (
            <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xs w-full p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center"
                >
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 text-amber-400">
                        <Book size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                        {t('subjects.emptyStateTitle', 'No hi ha apunts disponibles')}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        {t('subjects.emptyStateDesc', "Els apunts d'aquesta assignatura estan en procés de redacció o en esborrany.")}
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <MotionConfig reducedMotion={!isInteractive ? "always" : "never"}>
            <div className="w-full flex-1 relative group/carousel flex flex-col justify-center pb-2">
                
                {/* Horizontal Cinematic Snap Container (App Store Style) */}
                <div 
                    ref={carouselRef}
                    className="relative w-full h-[60dvh] min-h-[420px] flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    style={{ 
                        scrollBehavior: 'smooth', 
                        WebkitOverflowScrolling: 'touch',
                        paddingLeft: `${paddingOffset}px`,
                        paddingRight: `${paddingOffset}px`
                    }}
                >
                    {/* Placeholder to prevent layout shift while calculating measurements */}
                    {itemWidth === 0 && <div className="h-full w-full shrink-0" />}

                    {itemWidth > 0 && sortedTopics.map((topic, index) => (
                        <CarouselCard
                            key={topic.slug}
                            topic={topic}
                            index={index}
                            activeIndex={activeIndex}
                            itemWidth={itemWidth}
                            scrollX={scrollX}
                            subject={subject}
                            navigate={navigate}
                            markAsSeen={markAsSeen}
                            isInteractive={isInteractive}
                            seenNewTopics={seenNewTopicsSet}
                            seenVersions={seenVersions}
                            onCardClick={scrollToCard}
                            topicMeta={topicMeta.get(topic.slug)}
                            t={t}
                        />
                    ))}
                </div>

                {/* Awwwards-grade Interactive Scrubber for 1-Click Fast Navigation */}
                <PremiumScrubber 
                    sortedTopics={sortedTopics} 
                    activeIndex={activeIndex} 
                    scrollToCard={scrollToCard}
                    scrollX={scrollX}
                    itemWidth={itemWidth}
                    t={t}
                />
            </div>
        </MotionConfig>
    );
});

interface TopicCarouselProps {
    isMenuOpen?: boolean;
    subjectOverride?: string;
}

const TopicCarouselMobile: React.FC<TopicCarouselProps> = React.memo(({ isMenuOpen = false, subjectOverride }) => {
    const [isLandscape, setIsLandscape] = useState(false);
    useEffect(() => {
        const updateOrientation = () => {
            if (typeof window !== 'undefined') {
                setIsLandscape(window.innerHeight < 550 && window.innerWidth > window.innerHeight);
            }
        };
        updateOrientation();
        window.addEventListener('resize', updateOrientation);
        return () => window.removeEventListener('resize', updateOrientation);
    }, []);

    if (isLandscape) {
        return <LandscapeView subjectOverride={subjectOverride} />;
    }

    return <PortraitCarousel isMenuOpen={isMenuOpen} subjectOverride={subjectOverride} />;
});

const LandscapeView = React.memo(({ subjectOverride }: { subjectOverride?: string }) => {
    const navigate = useNavigate();
    const { subject: contextSubject } = useSubjectStore();
    const subject = (subjectOverride || contextSubject || '').toLowerCase();
    const { t, i18n } = useTranslation();
    const preferredLang = i18n.language;
    
    const { seenNewTopics, seenVersions, markAsSeen } = useSeenTopics();
    const seenNewTopicsSet = useMemo(() => new Set(seenNewTopics), [seenNewTopics]);
    const [allPersonalNotes, setAllPersonalNotes] = useState<(typeof import('content-collections'))['allPersonalNotes'][number][]>([]);

    useEffect(() => {
        import('content-collections').then(m => setAllPersonalNotes(m.allPersonalNotes)).catch(console.error);
    }, []);
    


    const { sortedTopics, topicMeta } = useTopicNotes(allPersonalNotes, subject, preferredLang);

    if (sortedTopics.length === 0) {
        return (
            <div className="fixed inset-0 z-0 w-full flex flex-col items-center justify-center p-6 text-center select-none pointer-events-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-sm w-full p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center"
                >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 text-amber-400">
                        <Book size={24} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1.5">
                        {t('subjects.emptyStateTitle', 'No hi ha apunts disponibles')}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        {t('subjects.emptyStateDesc', "Els apunts d'aquesta assignatura estan en procés de redacció o en esborrany.")}
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
            <div className="fixed inset-0 z-0 w-full flex flex-col overflow-hidden pointer-events-none">
                <div className="flex-1 w-full h-full overflow-y-auto px-6 pt-24 pb-12 pointer-events-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="grid grid-cols-2 gap-4 max-w-5xl mx-auto h-max">
                        {sortedTopics.map((topic, index) => (
                            <LandscapeTopicCard
                                key={topic.slug}
                                topic={topic}
                                index={index}
                                subject={subject}
                                navigate={navigate}
                                markAsSeen={markAsSeen}
                                seenNewTopics={seenNewTopicsSet}
                                seenVersions={seenVersions}
                                topicMeta={topicMeta.get(topic.slug)}
                                t={t}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
});

export default TopicCarouselMobile;

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { useSubjectStore } from '../stores/useSubjectStore';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useNavigate } from 'react-router-dom';
import type { allPersonalNotes } from 'content-collections';
import { Book } from 'lucide-react';
import { m as motion, MotionConfig, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';
import { hapticSelection, hapticLight } from '../lib/haptics';
import { useTopicNotes } from '../hooks/useTopicNotes';
import { useSeenTopics } from '../hooks/useSeenTopics';
import { loadAllPersonalNotes, getCachedNotes } from '../hooks/useAvailableSubjects';
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
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const isDraggingRef = useRef(false);
    const pointerDownXRef = useRef<number | null>(null);
    const lastTriggeredIndexRef = useRef<number>(activeIndex);

    useEffect(() => {
        lastTriggeredIndexRef.current = activeIndex;
    }, [activeIndex]);

    const getIndexFromPointer = useCallback((clientX: number) => {
        if (!trackRef.current || sortedTopics.length <= 1) return 0;
        const rect = trackRef.current.getBoundingClientRect();
        if (rect.width <= 0) return 0;
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = x / rect.width;
        const rawIndex = Math.round(percentage * (sortedTopics.length - 1));
        return Math.max(0, Math.min(rawIndex, sortedTopics.length - 1));
    }, [sortedTopics.length]);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        isDraggingRef.current = true;
        setIsDragging(true);
        pointerDownXRef.current = e.clientX;

        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            // ignore
        }

        const newIndex = getIndexFromPointer(e.clientX);
        setHoverIndex(newIndex);
        lastTriggeredIndexRef.current = newIndex;
        scrollToCard(newIndex, false);
        hapticSelection();
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return;
        const newIndex = getIndexFromPointer(e.clientX);
        setHoverIndex(newIndex);

        const isRealDrag = pointerDownXRef.current !== null && Math.abs(e.clientX - pointerDownXRef.current) > 3;

        if (newIndex !== lastTriggeredIndexRef.current) {
            lastTriggeredIndexRef.current = newIndex;
            scrollToCard(newIndex, isRealDrag);
            if (isRealDrag) hapticLight();
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        setIsDragging(false);
        pointerDownXRef.current = null;
        setHoverIndex(null);

        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // ignore
        }
    };

    // The PHYSICAL position of the thumb is strictly bound to the real carousel scroll
    const maxScroll = Math.max(1, (sortedTopics.length - 1) * Math.max(1, itemWidth));
    const scrollPercentage = useTransform(scrollX, currentScroll => {
        const pct = (currentScroll / maxScroll) * 100;
        return Math.max(0, Math.min(pct, 100));
    });
    const scrollTooltipX = useTransform(scrollPercentage, p => `${p}%`);

    if (sortedTopics.length <= 1) return null;

    // The text in the floating tooltip uses hoverIndex during drag, or activeIndex
    const displayIndex = isDragging && hoverIndex !== null ? hoverIndex : activeIndex;
    const safeDisplayIndex = Math.min(Math.max(0, displayIndex), Math.max(0, sortedTopics.length - 1));
    const tooltipTextX = `${(safeDisplayIndex / Math.max(1, sortedTopics.length - 1)) * 100}%`;

    return (
        <div className="w-full flex justify-center mt-4 mb-2 px-6 z-40 touch-none pointer-events-auto">
            <div 
                ref={trackRef}
                className="relative w-full max-w-70 h-10 flex items-center cursor-grab active:cursor-grabbing select-none group touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                {/* Ultra-sleek Track */}
                <div className="absolute left-0 right-0 h-1.5 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur-md border border-white/5 pointer-events-none">
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

PremiumScrubber.displayName = 'PremiumScrubber';

interface PortraitCarouselProps {
    sortedTopics: TopicNote[];
    topicMeta: Map<string, { hasNew: boolean; newestUpdate: number }>;
    isMenuOpen: boolean;
    subject: string;
}

const getInitialMeasurements = () => {
    if (typeof window === 'undefined') return { width: 320, padding: 30 };
    const width = Math.round(Math.min(window.innerWidth * 0.82, 380));
    const padding = Math.max(0, Math.round((window.innerWidth - width) / 2));
    return { width, padding };
};

const PortraitCarousel = React.memo(({ sortedTopics, topicMeta, isMenuOpen, subject }: PortraitCarouselProps) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    const { seenNewTopics, seenVersions, markAsSeen } = useSeenTopics();
    const seenNewTopicsSet = useMemo(() => new Set(seenNewTopics), [seenNewTopics]);

    const getSavedIndex = useCallback(() => {
        const saved = sessionStorage.getItem(`topic-carousel-h-${subject}`);
        if (saved) {
            const index = parseInt(saved, 10);
            if (!isNaN(index) && index >= 0 && index < sortedTopics.length) {
                return index;
            }
        }
        return 0;
    }, [subject, sortedTopics.length]);

    const [activeIndex, setActiveIndex] = useState(getSavedIndex);
    const activeIndexRef = useRef(activeIndex);
    
    const isInteractive = !(isMobile && isMenuOpen);

    const [measurements, setMeasurements] = useState(getInitialMeasurements);
    const { width: itemWidth, padding: paddingOffset } = measurements;

    const carouselRef = useRef<HTMLDivElement>(null);
    const scrollX = useMotionValue(activeIndex * itemWidth);
    const resetScrollBehaviorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const updateMeasurements = () => {
            setMeasurements(getInitialMeasurements());
        };
        window.addEventListener('resize', updateMeasurements, { passive: true });
        return () => window.removeEventListener('resize', updateMeasurements);
    }, []);

    // Sync active index & scroll position on initial layout or restoration
    useLayoutEffect(() => {
        if (carouselRef.current && itemWidth > 0) {
            const initialLeft = activeIndexRef.current * itemWidth;
            carouselRef.current.style.scrollBehavior = 'auto';
            carouselRef.current.scrollLeft = initialLeft;
            scrollX.set(initialLeft);
            carouselRef.current.style.scrollBehavior = 'smooth';
        }
    }, [itemWidth, scrollX]);

    // Save active position to session storage
    useEffect(() => {
        sessionStorage.setItem(`topic-carousel-h-${subject}`, activeIndex.toString());
    }, [activeIndex, subject]);

    // Direct, ultra-responsive scroll handler that guarantees synchronization
    const handleScroll = useCallback(() => {
        if (!carouselRef.current || itemWidth <= 0) return;
        const currentScrollLeft = carouselRef.current.scrollLeft;
        scrollX.set(currentScrollLeft);

        const newIndex = Math.round(currentScrollLeft / itemWidth);
        const clampedIndex = Math.max(0, Math.min(newIndex, sortedTopics.length - 1));
        if (clampedIndex !== activeIndexRef.current) {
            activeIndexRef.current = clampedIndex;
            setActiveIndex(clampedIndex);
            hapticSelection();
        }
    }, [itemWidth, sortedTopics.length, scrollX]);

    // Attach native scroll listener to guarantee 0-lag updates on all mobile browsers
    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;
        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => el.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollToCard = useCallback((index: number, instant = false) => {
        if (!isInteractive || !carouselRef.current || itemWidth <= 0) return;
        const clampedIndex = Math.max(0, Math.min(index, sortedTopics.length - 1));

        // Immediately update active index so active card styles & buttons activate without waiting
        setActiveIndex(clampedIndex);
        activeIndexRef.current = clampedIndex;

        const targetLeft = clampedIndex * itemWidth;

        if (instant) {
            carouselRef.current.style.scrollBehavior = 'auto';
            carouselRef.current.scrollLeft = targetLeft;
            scrollX.set(targetLeft);
            if (resetScrollBehaviorTimeoutRef.current) {
                clearTimeout(resetScrollBehaviorTimeoutRef.current);
            }
            resetScrollBehaviorTimeoutRef.current = setTimeout(() => {
                if (carouselRef.current) carouselRef.current.style.scrollBehavior = 'smooth';
            }, 80);
        } else {
            carouselRef.current.style.scrollBehavior = 'smooth';
            carouselRef.current.scrollTo({ left: targetLeft, behavior: 'smooth' });
        }
    }, [isInteractive, sortedTopics.length, itemWidth, scrollX]);

    useEffect(() => {
        return () => {
            if (resetScrollBehaviorTimeoutRef.current) {
                clearTimeout(resetScrollBehaviorTimeoutRef.current);
            }
        };
    }, []);

    return (
        <MotionConfig reducedMotion={!isInteractive ? "always" : "never"}>
            <div className="w-full flex-1 relative group/carousel flex flex-col justify-center pb-2">
                
                {/* Horizontal Cinematic Snap Container (App Store Style) */}
                <div 
                    ref={carouselRef}
                    onScroll={handleScroll}
                    className="relative w-full h-[60dvh] min-h-[420px] flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    style={{ 
                        WebkitOverflowScrolling: 'touch',
                        paddingLeft: `${paddingOffset}px`,
                        paddingRight: `${paddingOffset}px`
                    }}
                >
                    {sortedTopics.map((topic, index) => (
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

PortraitCarousel.displayName = 'PortraitCarousel';

const EmptyTopicsView: React.FC<{ t: TFunction }> = ({ t }) => (
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

interface TopicCarouselProps {
    isMenuOpen?: boolean;
    subjectOverride?: string;
}

const TopicCarouselMobile: React.FC<TopicCarouselProps> = React.memo(({ isMenuOpen = false, subjectOverride }) => {
    const { subject: contextSubject } = useSubjectStore();
    const subject = (subjectOverride || contextSubject || '').toLowerCase();
    const { t, i18n } = useTranslation();
    const preferredLang = i18n.language;

    const [allPersonalNotes, setAllPersonalNotes] = useState<TopicNote[]>(() => (getCachedNotes() || []) as TopicNote[]);

    useEffect(() => {
        if (allPersonalNotes.length === 0) {
            loadAllPersonalNotes()
                .then(notes => {
                    if (notes && notes.length > 0) setAllPersonalNotes(notes as TopicNote[]);
                })
                .catch(console.error);
        }
    }, [allPersonalNotes.length]);

    const { sortedTopics, topicMeta } = useTopicNotes(allPersonalNotes, subject, preferredLang);

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
        return <LandscapeView sortedTopics={sortedTopics} topicMeta={topicMeta} subject={subject} t={t} />;
    }

    if (sortedTopics.length === 0) {
        return <EmptyTopicsView t={t} />;
    }

    return (
        <PortraitCarousel 
            key={subject}
            sortedTopics={sortedTopics}
            topicMeta={topicMeta}
            isMenuOpen={isMenuOpen}
            subject={subject}
        />
    );
});

interface LandscapeViewProps {
    sortedTopics: TopicNote[];
    topicMeta: Map<string, { hasNew: boolean; newestUpdate: number }>;
    subject: string;
    t: TFunction;
}

const LandscapeView = React.memo(({ sortedTopics, topicMeta, subject, t }: LandscapeViewProps) => {
    const navigate = useNavigate();
    const { seenNewTopics, seenVersions, markAsSeen } = useSeenTopics();
    const seenNewTopicsSet = useMemo(() => new Set(seenNewTopics), [seenNewTopics]);

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

LandscapeView.displayName = 'LandscapeView';

TopicCarouselMobile.displayName = 'TopicCarouselMobile';

export default TopicCarouselMobile;

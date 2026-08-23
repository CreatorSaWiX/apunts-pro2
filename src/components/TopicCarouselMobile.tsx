import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSubjectStore } from '../stores/useSubjectStore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { allPersonalNotes } from 'content-collections';
import { ArrowRight, Book, Terminal, Calculator, RefreshCw, Sparkles } from 'lucide-react';
import { m as motion, MotionConfig, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';
import { hapticSelection, hapticLight } from '../lib/haptics';

import type { MotionValue } from 'framer-motion';

type TopicNote = (typeof allPersonalNotes)[number];

interface PremiumScrubberProps {
    sortedTopics: TopicNote[];
    activeIndex: number;
    scrollToCard: (index: number, isRealDrag?: boolean) => void;
    scrollX: MotionValue<number>;
    itemWidth: number;
    t: any;
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

interface CarouselCardProps {
    topic: TopicNote;
    index: number;
    activeIndex: number;
    itemWidth: number;
    scrollX: MotionValue<number>;
    subject: string;
    navigate: (to: string) => void;
    markAsSeen: (slug: string, updateTime: number) => void;
    isInteractive: boolean;
    seenNewTopics: string[];
    seenVersions: Record<string, number>;
    onCardClick: (index: number) => void;
    topicMeta?: { hasNew: boolean; newestUpdate: number };
    t: any;
}

const CarouselCard = React.memo(({
    topic, index, activeIndex, itemWidth, scrollX,
    subject, navigate, markAsSeen, isInteractive, seenNewTopics, seenVersions, onCardClick, topicMeta, t
}: CarouselCardProps) => {
    
    // Smooth Scale & Opacity Transforms optimized for Horizontal Snap (App Store Style)
    const input = [
        (index - 1) * itemWidth,
        index * itemWidth,
        (index + 1) * itemWidth
    ];
    
    // Minimal, solid physical transform - NO ROTATION
    const scale = useTransform(scrollX, input, [0.92, 1, 0.92]);
    const opacity = useTransform(scrollX, input, [0.5, 1, 0.5]);
    
    const isActive = activeIndex === index;

    const hasNewTag = topicMeta?.hasNew ?? false;
    const newestUpdate = topicMeta?.newestUpdate ?? 0;

    const isTopicNew = hasNewTag && !seenNewTopics.includes(topic.slug);
    const isTopicUpdated = !isTopicNew && newestUpdate > (seenVersions[topic.slug] || 0);

    return (
        <div style={{ width: `${itemWidth}px` }} className="shrink-0 snap-center flex items-center justify-center h-full px-2 py-4">
            <motion.div 
                style={{ scale, opacity, WebkitFontSmoothing: "antialiased" }} 
                className="w-full h-full max-h-125 min-h-[420px] relative rounded-[32px] transform-gpu flex flex-col"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.click(); } }}
                onClick={(e) => {
                    if (!isActive) {
                        e.preventDefault();
                        onCardClick(index);
                    } else if (isInteractive) {
                        markAsSeen(topic.slug, newestUpdate);
                        navigate(`/tema/${topic.slug}`);
                    }
                }}
            >
                {/* Premium Glassmorphism Background */}
                <div 
                    className={`absolute inset-0 rounded-[32px] overflow-hidden transform-gpu border transition duration-700 ${isActive ? 'bg-slate-900/80 border-primary/30 shadow-[0_20px_50px_rgba(var(--primary-rgb),0.2)] ring-1 ring-primary/20 backdrop-blur-xl' : 'bg-slate-900/40 border-white/5 shadow-none backdrop-blur-md cursor-pointer'}`}
                    style={{
                        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                        WebkitTransform: 'translateZ(0)',
                        transform: 'translateZ(0)'
                    }}
                >
                    
                    {/* Glowing Accent Orb */}
                    <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full blur-3xl pointer-events-none transition duration-700 delay-100 ${isActive ? 'bg-primary/20 opacity-100 scale-100' : 'bg-transparent opacity-0 scale-50'}`} />
                    
                    <div className="relative z-10 h-full flex flex-col p-6 min-[390px]:p-8 pointer-events-none">
                        
                        {/* Header Area */}
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3.5 rounded-2xl border backdrop-blur-md transition duration-500 shadow-md ${isActive ? 'bg-primary/10 border-primary/20 text-accent shadow-[0_0_20px_rgba(56,189,248,0.2)]' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                                <Book size={24} strokeWidth={1.5} />
                            </div>
                            <span className={`font-mono text-6xl font-black transition duration-500 tracking-tighter ${isActive ? 'text-white/10' : 'text-white/5'}`}>
                                {(() => {
                                    const match = topic.title.match(/^Tema (\d+)/);
                                    if (match) return match[1].padStart(2, '0');
                                    if (topic.title.toLowerCase().includes('parcial')) return 'P1';
                                    if (topic.title.toLowerCase().includes('final')) return 'EF';
                                    return String(index + 1).padStart(2, '0');
                                })()}
                            </span>
                        </div>

                        {/* Status Badges */}
                        {(isTopicNew || isTopicUpdated) && (
                            <div className={`absolute top-6 right-6 z-30 transition duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md ${isTopicNew ? 'bg-linear-to-r from-rose-500/90 to-pink-500/90 border-rose-300/30 shadow-rose-500/40' : 'bg-linear-to-r from-emerald-500/90 to-teal-500/90 border-emerald-300/30 shadow-emerald-500/40'}`}>
                                    <Sparkles size={10} className="text-white animate-pulse" />
                                    <span className="text-[9px] font-extrabold text-white uppercase tracking-wider drop-shadow-sm">
                                        {isTopicNew ? t('topics.new', 'Nou') : t('topics.updated', 'Actualitzat')}
                                    </span>
                                </div>
                            </div>
                        )}

                        <h3 className={`text-2xl min-[390px]:text-[28px] font-bold leading-[1.35] tracking-tight mb-3 pb-1 transition-colors duration-500 line-clamp-2 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                            {topic.title}
                        </h3>

                        <div className="flex items-center gap-3 mb-4">
                            <div className={`h-[2px] rounded-full transition duration-500 ${isActive ? 'w-10 bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]' : 'w-6 bg-slate-700'}`} />
                            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                                {topic.readTime || '10 Min'}
                            </span>
                        </div>

                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 font-medium mb-auto opacity-90">
                            {topic.description}
                        </p>

                        {/* Interactive Buttons Footer */}
                        <div className={`pt-5 mt-auto transition duration-500 transform-gpu ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                            <div className="flex flex-col gap-3">
                                <motion.div
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.click(); } }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        hapticLight();
                                        markAsSeen(topic.slug, newestUpdate); 
                                        navigate(`/tema/${topic.slug}`);
                                    }}
                                    className="group/btn relative overflow-hidden flex items-center justify-between text-white font-semibold bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-5 py-4 rounded-xl shadow-[0_12px_24px_rgba(var(--primary-rgb),0.25)] transition-colors duration-300 cursor-pointer"
                                >
                                    <span className="relative z-10 text-[15px] tracking-wide">{t('topics.explore', 'Explorar tema')}</span>
                                    <div className="relative z-10 bg-white/20 p-1.5 rounded-lg group-hover/btn:bg-white/30 transition-colors">
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </motion.div>

                                <div className="flex items-center gap-2.5">
                                    <motion.div
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.click(); } }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            hapticLight();
                                            markAsSeen(topic.slug, newestUpdate); 
                                            navigate(`/tema/${topic.slug}/test`);
                                        }}
                                        className="flex-1 text-slate-300 hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors bg-slate-800/50 py-3 rounded-lg border border-white/5 hover:bg-amber-500/10 hover:border-amber-500/20 shadow-inner cursor-pointer"
                                    >
                                        <RefreshCw size={14} /> Test
                                    </motion.div>

                                    <motion.div
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.click(); } }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            hapticLight();
                                            markAsSeen(topic.slug, newestUpdate); 
                                            navigate(subject === 'pro2' && topic.slug === 'pro2-tema-1' ? '/tema/pro2-lab-1' : subject === 'pro2' && topic.slug === 'pro2-tema-2' ? '/tema/pro2-lab-2' : subject === 'pro2' && topic.slug === 'pro2-tema-9' ? '/tema/pro2-lab-7' : `/tema/${topic.slug}/solucionaris`);
                                        }}
                                        className="flex-1 text-slate-300 hover:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors bg-slate-800/50 py-3 rounded-lg border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 shadow-inner cursor-pointer"
                                    >
                                        {subject === 'pro2' ? <Terminal size={14} /> : <Calculator size={14} />} {t('topic.solutions', 'Solucionaris')}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

interface LandscapeTopicCardProps {
    topic: TopicNote;
    index: number;
    subject: string;
    navigate: (to: string) => void;
    markAsSeen: (slug: string, updateTime?: number) => void;
    seenNewTopics: string[];
    seenVersions: Record<string, number>;
    topicMeta?: { hasNew: boolean; newestUpdate: number };
    t: any;
}

const LandscapeTopicCard = React.memo(({ topic, index, subject, navigate, markAsSeen, seenNewTopics, seenVersions, topicMeta, t }: LandscapeTopicCardProps) => {
    const hasNewTag = topicMeta?.hasNew ?? false;
    const newestUpdate = topicMeta?.newestUpdate ?? 0;

    const isTopicNew = hasNewTag && !seenNewTopics.includes(topic.slug);
    const isTopicUpdated = !isTopicNew && newestUpdate > (seenVersions[topic.slug] || 0);

    return (
        <motion.div 
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.click(); } }}
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
                e.stopPropagation();
                hapticLight();
                markAsSeen(topic.slug, newestUpdate);
                navigate(`/tema/${topic.slug}`);
            }}
            className="group relative w-full h-full bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-primary/30 rounded-[20px] p-5 flex flex-col shadow-lg backdrop-blur-md cursor-pointer transition-colors duration-300 overflow-hidden"
        >
            {/* Subtle glow effect on hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -mr-10 -mt-10" />

            <div className="flex items-start justify-between w-full mb-4 relative z-10">
                <div className="w-11 h-11 bg-primary/10 text-accent rounded-2xl flex items-center justify-center font-bold text-lg border border-primary/20 shadow-sm">
                    {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className="flex gap-1.5">
                    {isTopicNew && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase shadow-sm">{t('topics.new', 'Nou')}</span>}
                    {isTopicUpdated && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase shadow-sm">{t('topics.updated', 'Act')}</span>}
                </div>
            </div>
            
            <div className="flex-1 min-w-0 relative z-10 flex flex-col">
                <h3 className="text-white font-bold text-base leading-tight mb-2 line-clamp-2">{topic.title}</h3>
                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 mb-4">{topic.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 font-semibold tracking-wider uppercase">
                        {topic.readTime || '10 Min'}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <ArrowRight size={12} className="text-slate-400 group-hover:text-accent group-hover:translate-x-0.5 transition" />
                    </div>
                </div>
            </div>
        </motion.div>
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
    const [seenNewTopics, setSeenNewTopics] = useState<string[]>([]);
    const [seenVersions, setSeenVersions] = useState<Record<string, number>>({});
    const [allPersonalNotes, setAllPersonalNotes] = useState<any[]>([]);

    useEffect(() => {
        import('content-collections').then(m => setAllPersonalNotes(m.allPersonalNotes)).catch(console.error);
    }, []);
    
    const isInteractive = !(isMobile && isMenuOpen);

    const { sortedTopics, topicMeta } = useMemo(() => {
        const meta = new Map<string, { hasNew: boolean; newestUpdate: number }>();
        for (const note of allPersonalNotes) {
            const existing = meta.get(note.slug);
            if (!existing) {
                meta.set(note.slug, { hasNew: !!note.isNew, newestUpdate: note.isUpdated || 0 });
            } else {
                if (note.isNew) existing.hasNew = true;
                const upd = note.isUpdated || 0;
                if (upd > existing.newestUpdate) existing.newestUpdate = upd;
            }
        }

        const topics = [...allPersonalNotes]
            .filter(note => {
                const isMatch = note.subject === subject && !note.slug.includes('-lab-');
                if (!isMatch) return false;
                if (note.draft) return false;

                const versions = allPersonalNotes.filter(n => n.slug === note.slug && !n.draft);
                const hasPreferred = versions.some(n => n.lang === preferredLang);
                return hasPreferred ? note.lang === preferredLang : note.lang === 'ca';
            })
            .sort((a, b) => a.order - b.order);

        return { sortedTopics: topics, topicMeta: meta };
    }, [subject, preferredLang, allPersonalNotes]);

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

    useEffect(() => {
        try {
            const savedNew = localStorage.getItem('v1_seen-new-topics');
            if (savedNew) setSeenNewTopics(JSON.parse(savedNew));
            const savedVersions = localStorage.getItem('v1_seen-topic-versions');
            if (savedVersions) setSeenVersions(JSON.parse(savedVersions));
        } catch (e) {
            console.debug('LocalStorage v1 read silenced:', e);
        }
    }, []);

    const markAsSeen = useCallback((slug: string, version?: number) => {
        try {
            const savedNew = localStorage.getItem('v1_seen-new-topics');
            const prevNew = savedNew ? JSON.parse(savedNew) : [];
            if (!prevNew.includes(slug)) {
                const updatedNew = [...prevNew, slug];
                localStorage.setItem('v1_seen-new-topics', JSON.stringify(updatedNew));
            }

            if (version !== undefined) {
                const savedVersions = localStorage.getItem('v1_seen-topic-versions');
                const prevVersions = savedVersions ? JSON.parse(savedVersions) : {};
                if (prevVersions[slug] !== version) {
                    const updatedVersions = { ...prevVersions, [slug]: version };
                    localStorage.setItem('v1_seen-topic-versions', JSON.stringify(updatedVersions));
                }
            }
        } catch (e) {
            console.debug('LocalStorage v1 write silenced:', e);
        }
    }, []);

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
                            seenNewTopics={seenNewTopics}
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
    
    const [seenNewTopics, setSeenNewTopics] = useState<string[]>([]);
    const [seenVersions, setSeenVersions] = useState<Record<string, number>>({});
    const [allPersonalNotes, setAllPersonalNotes] = useState<any[]>([]);

    useEffect(() => {
        import('content-collections').then(m => setAllPersonalNotes(m.allPersonalNotes)).catch(console.error);
    }, []);
    
    useEffect(() => {
        try {
            const savedNew = localStorage.getItem('seen-new-topics');
            if (savedNew) setSeenNewTopics(JSON.parse(savedNew));
            const savedVersions = localStorage.getItem('seen-topic-versions');
            if (savedVersions) setSeenVersions(JSON.parse(savedVersions));
        } catch (e) {
            console.debug('LocalStorage read silenced:', e);
        }
    }, []);

    const markAsSeen = useCallback((slug: string, version?: number) => {
        try {
            const savedNew = localStorage.getItem('seen-new-topics');
            const prevNew = savedNew ? JSON.parse(savedNew) : [];
            if (!prevNew.includes(slug)) {
                const updatedNew = [...prevNew, slug];
                localStorage.setItem('seen-new-topics', JSON.stringify(updatedNew));
            }

            if (version !== undefined) {
                const savedVersions = localStorage.getItem('seen-topic-versions');
                const prevVersions = savedVersions ? JSON.parse(savedVersions) : {};
                if (prevVersions[slug] !== version) {
                    const updatedVersions = { ...prevVersions, [slug]: version };
                    localStorage.setItem('seen-topic-versions', JSON.stringify(updatedVersions));
                }
            }
        } catch (e) {
            console.debug('LocalStorage write silenced:', e);
        }
    }, []);

    const { sortedTopics, topicMeta } = useMemo(() => {
        const meta = new Map<string, { hasNew: boolean; newestUpdate: number }>();
        for (const note of allPersonalNotes) {
            const existing = meta.get(note.slug);
            if (!existing) {
                meta.set(note.slug, { hasNew: !!note.isNew, newestUpdate: note.isUpdated || 0 });
            } else {
                if (note.isNew) existing.hasNew = true;
                const upd = note.isUpdated || 0;
                if (upd > existing.newestUpdate) existing.newestUpdate = upd;
            }
        }

        const topics = [...allPersonalNotes]
            .filter(note => {
                const isMatch = note.subject === subject && !note.slug.includes('-lab-');
                if (!isMatch) return false;
                if (note.draft) return false;

                const versions = allPersonalNotes.filter(n => n.slug === note.slug && !n.draft);
                const hasPreferred = versions.some(n => n.lang === preferredLang);
                return hasPreferred ? note.lang === preferredLang : note.lang === 'ca';
            })
            .sort((a, b) => a.order - b.order);

        return { sortedTopics: topics, topicMeta: meta };
    }, [subject, preferredLang, allPersonalNotes]);
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
                                seenNewTopics={seenNewTopics}
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

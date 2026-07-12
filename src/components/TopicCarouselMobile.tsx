import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSubject } from '../contexts/SubjectContext';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { allPersonalNotes } from 'content-collections';
import { ArrowRight, Book, Terminal, Calculator, RefreshCw, Sparkles } from 'lucide-react';
import { m as motion, MotionConfig, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

const PremiumScrubber = React.memo(({ sortedTopics, activeIndex, scrollToCard, scrollX, itemWidth, t }: any) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [pointerDownX, setPointerDownX] = useState<number | null>(null);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        setPointerDownX(e.clientX);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        handlePointerMove(e, true);
        if (navigator.vibrate) navigator.vibrate(10);
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
                 if (navigator.vibrate && isRealDrag) navigator.vibrate(15);
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
                className="relative w-full max-w-[280px] h-10 flex items-center cursor-grab active:cursor-grabbing group"
                onPointerDown={handlePointerDown}
                onPointerMove={isDragging ? handlePointerMove : undefined}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                {/* Ultra-sleek Track */}
                <div className="absolute left-0 right-0 h-1.5 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur-md border border-white/5">
                     <motion.div 
                        className="absolute top-0 bottom-0 left-0 bg-linear-to-r from-primary to-accent rounded-full will-change-transform"
                        style={{ width: scrollTooltipX }}
                     />
                </div>

                {/* Elegant Ticks */}
                <div className="absolute left-0 right-0 h-1.5 flex justify-between px-[2px] pointer-events-none">
                    {sortedTopics.map((_: any, i: number) => (
                         <div key={i} className={`w-0.5 h-full rounded-full transition-colors duration-300 ${safeDisplayIndex === i ? 'bg-white' : 'bg-white/20'}`} />
                    ))}
                </div>

                {/* Invisible, larger hit area for thumb */}
                <motion.div 
                    className="absolute top-1/2 -mt-4 -ml-4 w-8 h-8 z-20 flex items-center justify-center pointer-events-none will-change-transform"
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

const CarouselCard = React.memo(({
    topic, index, activeIndex, itemWidth, scrollX,
    subject, navigate, markAsSeen, isInteractive, seenNewTopics, seenVersions, onCardClick, t
}: any) => {
    
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

    const versions = allPersonalNotes.filter((n: any) => n.slug === topic.slug);
    const hasNewTag = versions.some((n: any) => n.isNew);
    const newestUpdate = Math.max(0, ...versions.map((n: any) => n.isUpdated || 0));

    const isTopicNew = hasNewTag && !seenNewTopics.includes(topic.slug);
    const isTopicUpdated = !isTopicNew && newestUpdate > (seenVersions[topic.slug] || 0);

    return (
        <div style={{ width: `${itemWidth}px` }} className="shrink-0 snap-center flex items-center justify-center h-full px-2 py-4">
            <motion.div 
                style={{ scale, opacity, WebkitFontSmoothing: "antialiased" }} 
                className="w-full h-full max-h-[500px] min-h-[420px] relative rounded-[32px] transform-gpu will-change-transform flex flex-col"
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
                    className={`absolute inset-0 rounded-[32px] overflow-hidden transform-gpu border transition-all duration-700 ${isActive ? 'bg-slate-900/80 border-primary/30 shadow-[0_20px_50px_rgba(var(--primary-rgb),0.2)] ring-1 ring-primary/20 backdrop-blur-xl' : 'bg-slate-900/40 border-white/5 shadow-none backdrop-blur-md cursor-pointer'}`}
                    style={{
                        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                        WebkitTransform: 'translateZ(0)',
                        transform: 'translateZ(0)'
                    }}
                >
                    
                    {/* Glowing Accent Orb */}
                    <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 delay-100 ${isActive ? 'bg-primary/20 opacity-100 scale-100' : 'bg-transparent opacity-0 scale-50'}`} />
                    
                    <div className="relative z-10 h-full flex flex-col p-6 min-[390px]:p-8 pointer-events-none">
                        
                        {/* Header Area */}
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3.5 rounded-2xl border backdrop-blur-md transition-all duration-500 shadow-md ${isActive ? 'bg-primary/10 border-primary/20 text-accent shadow-[0_0_20px_rgba(56,189,248,0.2)]' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                                <Book size={24} strokeWidth={1.5} />
                            </div>
                            <span className={`font-mono text-6xl font-black transition-all duration-500 tracking-tighter ${isActive ? 'text-white/10' : 'text-white/5'}`}>
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
                            <div className={`absolute top-6 right-6 z-30 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
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
                            <div className={`h-[2px] rounded-full transition-all duration-500 ${isActive ? 'w-10 bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]' : 'w-6 bg-slate-700'}`} />
                            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                                {topic.readTime || '10 Min'}
                            </span>
                        </div>

                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 font-medium mb-auto opacity-90">
                            {topic.description}
                        </p>

                        {/* Interactive Buttons Footer */}
                        <div className={`pt-5 mt-auto transition-all duration-500 transform-gpu ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                            <div className="flex flex-col gap-3">
                                <Link
                                    to={`/tema/${topic.slug}`}
                                    onClick={(e) => { e.stopPropagation(); markAsSeen(topic.slug, newestUpdate); }}
                                    className="group/btn relative overflow-hidden flex items-center justify-between text-white font-semibold bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-5 py-4 rounded-xl shadow-[0_12px_24px_rgba(var(--primary-rgb),0.25)] transition-all duration-300 active:scale-95"
                                >
                                    <span className="relative z-10 text-[15px] tracking-wide">{t('topics.explore', 'Explorar tema')}</span>
                                    <div className="relative z-10 bg-white/20 p-1.5 rounded-lg group-hover/btn:bg-white/30 transition-colors">
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </Link>

                                <div className="flex items-center gap-2.5">
                                    <Link
                                        to={`/tema/${topic.slug}/test`}
                                        onClick={(e) => { e.stopPropagation(); markAsSeen(topic.slug, newestUpdate); }}
                                        className="flex-1 text-slate-300 hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-slate-800/50 py-3 rounded-lg border border-white/5 hover:bg-amber-500/10 hover:border-amber-500/20 shadow-inner"
                                    >
                                        <RefreshCw size={14} /> Test
                                    </Link>

                                    <Link
                                        to={subject === 'pro2' && topic.slug === 'pro2-tema-1' ? '/tema/pro2-lab-1' : subject === 'pro2' && topic.slug === 'pro2-tema-2' ? '/tema/pro2-lab-2' : subject === 'pro2' && topic.slug === 'pro2-tema-9' ? '/tema/pro2-lab-7' : `/tema/${topic.slug}/solucionaris`}
                                        onClick={(e) => { e.stopPropagation(); markAsSeen(topic.slug, newestUpdate); }}
                                        className="flex-1 text-slate-300 hover:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-slate-800/50 py-3 rounded-lg border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 shadow-inner"
                                    >
                                        {subject === 'pro2' ? <Terminal size={14} /> : <Calculator size={14} />} {t('topic.solutions', 'Solucionaris')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

interface TopicCarouselProps {
    isMenuOpen?: boolean;
    subjectOverride?: string;
}

const TopicCarouselMobile: React.FC<TopicCarouselProps> = React.memo(({ isMenuOpen = false, subjectOverride }) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { subject: contextSubject } = useSubject();
    const subject = (subjectOverride || contextSubject || '').toLowerCase();
    const { t, i18n } = useTranslation();
    const preferredLang = i18n.language;
    
    const [activeIndex, setActiveIndex] = useState(0);
    const [seenNewTopics, setSeenNewTopics] = useState<string[]>([]);
    const [seenVersions, setSeenVersions] = useState<Record<string, number>>({});
    
    const isInteractive = !(isMobile && isMenuOpen);

    const sortedTopics = useMemo(() => {
        return [...allPersonalNotes]
            .filter(note => {
                const isMatch = (note as any).subject === subject && !note.slug.includes('-lab-');
                if (!isMatch) return false;
                if ((note as any).draft) return false;

                const versions = allPersonalNotes.filter(n => n.slug === note.slug && !(n as any).draft);
                const hasPreferred = versions.some(n => n.lang === preferredLang);
                return hasPreferred ? note.lang === preferredLang : note.lang === 'ca';
            })
            .sort((a, b) => a.order - b.order);
    }, [subject, preferredLang]);

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
            if (navigator.vibrate) navigator.vibrate(8);
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
        if (lastRestoredSubject.current !== subject && carouselRef.current && itemWidth > 0) {
            const saved = sessionStorage.getItem(`topic-carousel-h-${subject}`);
            let newIndex = 0;
            if (saved) {
                const index = parseInt(saved, 10);
                if (!isNaN(index) && index >= 0 && index < sortedTopics.length) {
                    newIndex = index;
                }
            } else {
                newIndex = Math.min(activeIndex, Math.max(0, sortedTopics.length - 1));
            }
            
            // Disable scroll animation for instant subject switch snap
            carouselRef.current.style.scrollBehavior = 'auto';
            carouselRef.current.scrollLeft = newIndex * itemWidth;
            carouselRef.current.style.scrollBehavior = 'smooth';
            
            setActiveIndex(newIndex);
            lastRestoredSubject.current = subject;
        }
    }, [subject, itemWidth, sortedTopics.length, activeIndex]);

    useEffect(() => {
        sessionStorage.setItem(`topic-carousel-h-${subject}`, activeIndex.toString());
    }, [activeIndex, subject]);

    useEffect(() => {
        try {
            const savedNew = localStorage.getItem('seen-new-topics');
            if (savedNew) setSeenNewTopics(JSON.parse(savedNew));
            const savedVersions = localStorage.getItem('seen-topic-versions');
            if (savedVersions) setSeenVersions(JSON.parse(savedVersions));
        } catch (e) { }
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
        } catch (e) { }
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

export default TopicCarouselMobile;

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSubject } from '../contexts/SubjectContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { allPersonalNotes } from 'content-collections';
import { ArrowRight, Book, Terminal, Calculator, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, MotionConfig, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

const SpotlightCard = React.memo(({
    children,
    className = "",
    isActive = false,
    isMenuOpen = false,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    isActive?: boolean;
    isMenuOpen?: boolean;
    [key: string]: any;
}) => {
    const isMobile = useIsMobile();
    const shouldDisable = isMobile && isMenuOpen;
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const backgroundStyle = useMotionTemplate`
        radial-gradient(
          650px circle at ${mouseX}px ${mouseY}px,
          rgba(var(--primary-rgb), 0.15),
          transparent 80%
        )
    `;

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        if (shouldDisable) return;
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={`group/card relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            {...props}
        >
            {!shouldDisable && (
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover/card:opacity-100 z-50"
                    style={{ background: backgroundStyle }}
                />
            )}
            <div className="relative z-10 h-full flex flex-col">
                {children}
            </div>
        </div>
    );
});

const CarouselCard = React.memo(({
    topic, index, activeIndex, itemWidth, scrollX,
    subject, preferredLang, navigate, markAsSeen, isInteractive, isMenuOpen, seenNewTopics, seenVersions, onCardClick
}: any) => {
    const input = [
        (index - 2) * itemWidth,
        (index - 1) * itemWidth,
        index * itemWidth,
        (index + 1) * itemWidth,
        (index + 2) * itemWidth
    ];
    
    // Transform values mapped natively to scroll position
    const scale = useTransform(scrollX, input, [0.75, 0.85, 1, 0.85, 0.75]);
    const opacity = useTransform(scrollX, input, [0, 0.35, 1, 0.35, 0]);
    const rotateY = useTransform(scrollX, input, [25, 15, 0, -15, -25]);
    const xShift = useTransform(scrollX, input, [itemWidth * 0.7, itemWidth * 0.35, 0, -itemWidth * 0.35, -itemWidth * 0.7]);
    
    const zIndex = useTransform(scrollX, (v: number) => {
        return 50 - Math.round(Math.abs(v - index * itemWidth) / 20);
    });

    const isActive = activeIndex === index;
    const versions = allPersonalNotes.filter((n: any) => n.slug === topic.slug);
    const hasNewTag = versions.some((n: any) => n.isNew);
    const newestUpdate = Math.max(0, ...versions.map((n: any) => n.isUpdated || 0));

    const isTopicNew = hasNewTag && !seenNewTopics.includes(topic.slug);
    const isTopicUpdated = !isTopicNew && newestUpdate > (seenVersions[topic.slug] || 0);

    return (
        <div style={{ width: `${itemWidth}px` }} className="shrink-0 snap-center h-full relative perspective-1000">
            <motion.div 
                style={{ scale, opacity, rotateY, x: xShift, zIndex, WebkitFontSmoothing: "antialiased", backfaceVisibility: "hidden" }} 
                className="absolute inset-0 flex items-center justify-center transform-gpu will-change-transform"
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
                <div className="w-[86vw] max-w-[360px] md:max-w-none md:w-[400px] h-full">
                    <SpotlightCard
                        isActive={isActive}
                        isMenuOpen={isMenuOpen}
                        className={`
                            w-full h-full rounded-[32px] md:rounded-[40px] border flex flex-col justify-between transition-colors duration-500
                            ${isActive
                                ? 'bg-slate-900/80 border-primary/20 shadow-[0_20px_50px_rgba(14,165,233,0.15)] ring-1 ring-primary/20 backdrop-blur-xl'
                                : 'bg-slate-900/40 border-white/5 shadow-none backdrop-blur-md'
                            }
                        `}
                    >
                        {/* Glow Orb - follows the card dynamically */}
                        <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${isActive ? 'bg-primary/20 opacity-100 scale-100' : 'bg-transparent opacity-0 scale-50'}`} />

                        {/* Badges */}
                        {(isTopicNew || isTopicUpdated) && (
                            <div className={`absolute top-5 right-5 md:top-8 md:right-8 z-30 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md ${isTopicNew ? 'bg-linear-to-r from-rose-500/90 to-pink-500/90 border-rose-300/30 shadow-rose-500/40' : 'bg-linear-to-r from-emerald-500/90 to-teal-500/90 border-emerald-300/30 shadow-emerald-500/40'}`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_5px_white]" />
                                    <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider drop-shadow-sm">
                                        {isTopicNew 
                                            ? (preferredLang === 'es' ? 'Nuevo' : 'Nou') 
                                            : (preferredLang === 'es' ? 'Actualizado' : 'Actualitzat')}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Card Header */}
                        <div className="p-6 md:p-10 pb-2 relative z-20">
                            <div className="flex justify-between items-start mb-5 md:mb-6">
                                <div className={`
                                    p-3 md:p-4 rounded-2xl border backdrop-blur-md transition-all duration-500
                                    ${isActive
                                        ? 'bg-primary/10 border-primary/20 text-accent shadow-[0_0_20px_rgba(56,189,248,0.15)]'
                                        : 'bg-white/5 border-white/5 text-slate-500'
                                    }
                                `}>
                                    <Book size={24} strokeWidth={1.5} className="md:w-7 md:h-7" />
                                </div>
                                <span className={`
                                    font-mono text-5xl md:text-7xl font-bold transition-all duration-500 mt-2
                                    ${isActive ? 'text-white/10' : 'text-white/5'}
                                `}>
                                    {(() => {
                                        const match = topic.title.match(/^Tema (\d+)/);
                                        if (match) return match[1].padStart(2, '0');
                                        if (topic.title.toLowerCase().includes('parcial')) return 'P1';
                                        if (topic.title.toLowerCase().includes('final')) return 'EF';
                                        return String(index + 1).padStart(2, '0');
                                    })()}
                                </span>
                            </div>

                            <h3 className={`
                                text-2xl md:text-4xl font-bold leading-tight tracking-tight mb-4 md:mb-5 transition-colors duration-500
                                ${isActive ? 'text-white' : 'text-slate-400'}
                            `}>
                                {topic.title}
                            </h3>

                            <div className="flex items-center gap-3">
                                <div className={`h-px transition-all duration-500 ${isActive ? 'w-12 bg-primary' : 'w-6 bg-slate-700'}`} />
                                <span className="text-[11px] md:text-xs font-mono text-slate-400 uppercase tracking-widest font-semibold">
                                    {topic.readTime || '10 Min'}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 md:px-10 mt-3 md:mt-2 relative z-20 overflow-hidden">
                            <p className="text-slate-400 text-[13px] md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 font-light">
                                {topic.description}
                            </p>
                        </div>

                        {/* Actions Footer */}
                        <div className={`
                            p-6 md:p-10 pt-4 mt-auto relative z-20 transition-all duration-500 transform-gpu
                            ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
                        `}>
                            <div className="flex flex-col gap-3 md:gap-4">
                                <Link
                                    to={`/tema/${topic.slug}`}
                                    onClick={(e) => { e.stopPropagation(); markAsSeen(topic.slug, newestUpdate); }}
                                    className="group/btn relative overflow-hidden flex items-center justify-between gap-3 text-white font-semibold bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-4 py-3 md:px-5 md:py-3.5 rounded-2xl shadow-[0_10px_20px_rgba(14,165,233,0.3)] transition-all duration-300 transform active:scale-95 text-[14px] md:text-[15px]"
                                >
                                    <span className="relative z-10">Explorar tema</span>
                                    <ArrowRight size={18} className="relative z-10 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                                </Link>

                                <div className="flex items-center gap-4 mt-1">
                                    <Link
                                        to={`/tema/${topic.slug}/test`}
                                        onClick={(e) => { e.stopPropagation(); markAsSeen(topic.slug, newestUpdate); }}
                                        className="flex-1 text-slate-400 hover:text-amber-400 text-[13px] md:text-sm font-medium flex items-center gap-2.5 transition-colors group/test py-1"
                                    >
                                        <div className="p-1.5 rounded-lg bg-white/5 group-hover/test:bg-amber-500/10 border border-transparent group-hover/test:border-amber-500/20 transition-all">
                                            <RefreshCw size={14} className="group-hover/test:rotate-180 transition-transform duration-500" />
                                        </div>
                                        <span>Test</span>
                                    </Link>

                                    <Link
                                        to={subject === 'pro2' && topic.slug === 'pro2-tema-1' ? '/tema/pro2-lab-1' : subject === 'pro2' && topic.slug === 'pro2-tema-2' ? '/tema/pro2-lab-2' : subject === 'pro2' && topic.slug === 'pro2-tema-9' ? '/tema/pro2-lab-7' : `/tema/${topic.slug}/solucionaris`}
                                        onClick={(e) => { e.stopPropagation(); markAsSeen(topic.slug, newestUpdate); }}
                                        className="flex-1 text-slate-400 hover:text-emerald-400 text-[13px] md:text-sm font-medium flex items-center gap-2.5 transition-colors group/sol py-1"
                                    >
                                        <div className="p-1.5 rounded-lg bg-white/5 group-hover/sol:bg-emerald-500/10 border border-transparent group-hover/sol:border-emerald-500/20 transition-all">
                                            {subject === 'pro2' ? <Terminal size={14} /> : <Calculator size={14} />}
                                        </div>
                                        <span className="truncate">Solucionaris</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SpotlightCard>
                </div>
            </motion.div>
        </div>
    );
});

const TopicScrubber = React.memo(({ sortedTopics, activeIndex, scrollToCard }: any) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        handlePointerMove(e);
        if (navigator.vibrate) navigator.vibrate(10);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        
        const percentage = x / rect.width;
        let newIndex = Math.round(percentage * (sortedTopics.length - 1));
        newIndex = Math.max(0, Math.min(newIndex, sortedTopics.length - 1));
        
        setHoverIndex(newIndex);
        
        if (isDragging) {
            if (newIndex !== activeIndex) {
                 scrollToCard(newIndex);
                 if (navigator.vibrate) navigator.vibrate(15);
            }
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        setHoverIndex(null);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    if (sortedTopics.length <= 1) return null;

    const displayIndex = hoverIndex !== null ? hoverIndex : activeIndex;
    const tooltipX = `${(displayIndex / (sortedTopics.length - 1)) * 100}%`;

    return (
        <div className="mt-6 md:mt-8 w-full flex justify-center z-50 touch-none pointer-events-auto">
            <div 
                ref={trackRef}
                className="relative w-[80%] max-w-md h-12 flex items-center cursor-grab active:cursor-grabbing group"
                onPointerDown={handlePointerDown}
                onPointerMove={isDragging ? handlePointerMove : undefined}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                {/* Visual Track */}
                <div className="absolute left-0 right-0 h-2 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur-md border border-white/5">
                     <motion.div 
                        className="absolute top-0 bottom-0 left-0 bg-linear-to-r from-primary to-accent rounded-full"
                        animate={{ width: tooltipX }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                     />
                </div>

                {/* Ticks for topics */}
                <div className="absolute left-0 right-0 h-2 flex justify-between px-[2px] pointer-events-none">
                    {sortedTopics.map((_, i) => (
                         <div key={i} className={`w-1 h-full rounded-full transition-colors duration-300 ${activeIndex === i ? 'bg-white' : 'bg-white/20'}`} />
                    ))}
                </div>

                {/* Handle/Thumb */}
                <motion.div 
                    className="absolute top-1/2 -mt-3 -ml-3 w-6 h-6 bg-white rounded-full shadow-[0_0_20px_rgba(56,189,248,0.8)] border-2 border-primary z-20 flex items-center justify-center pointer-events-none"
                    animate={{ left: tooltipX, scale: isDragging ? 1.3 : 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    <div className="w-2 h-2 bg-primary rounded-full opacity-60" />
                </motion.div>

                {/* Floating Tooltip */}
                <AnimatePresence>
                    {(isDragging) && (
                        <motion.div 
                            initial={{ opacity: 0, y: 15, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 15, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="absolute -top-16 -ml-[60px] w-[120px] flex flex-col items-center pointer-events-none"
                            style={{ left: tooltipX }}
                        >
                            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white text-[11px] font-bold px-3 py-2 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-center line-clamp-2 w-full border-b-2 border-b-primary">
                                {sortedTopics[displayIndex]?.title || 'Tema'}
                            </div>
                            <div className="w-2 h-2 bg-slate-900/95 border-b border-r border-white/10 rotate-45 -mt-1 z-[-1]" />
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

const TopicCarousel: React.FC<TopicCarouselProps> = React.memo(({ isMenuOpen = false, subjectOverride }) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { subject: contextSubject } = useSubject();
    const subject = (subjectOverride || contextSubject || '').toLowerCase();
    const { preferredLang } = useLanguage();
    
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
    
    const calculateItemWidth = () => typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.75, 400) : 300;
    const [itemWidth, setItemWidth] = useState(calculateItemWidth());
    const paddingLeft = typeof window !== 'undefined' ? (window.innerWidth - itemWidth) / 2 : 50;

    useEffect(() => {
        const handleResize = () => setItemWidth(calculateItemWidth());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useMotionValueEvent(scrollX, "change", (latest) => {
        if (!isInteractive) return;
        const newIndex = Math.round(latest / itemWidth);
        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < sortedTopics.length) {
            setActiveIndex(newIndex);
        }
    });

    const hasRestoredScroll = useRef(false);
    useEffect(() => {
        if (!hasRestoredScroll.current && carouselRef.current) {
            const saved = sessionStorage.getItem(`topic-carousel-${subject}`);
            if (saved) {
                const index = parseInt(saved, 10);
                if (!isNaN(index) && index >= 0 && index < sortedTopics.length) {
                    carouselRef.current.scrollLeft = index * itemWidth;
                    setActiveIndex(index);
                }
            }
            hasRestoredScroll.current = true;
        }
    }, [subject, itemWidth, sortedTopics.length]);

    useEffect(() => {
        sessionStorage.setItem(`topic-carousel-${subject}`, activeIndex.toString());
    }, [activeIndex, subject]);

    useEffect(() => {
        try {
            const savedNew = localStorage.getItem('seen-new-topics');
            if (savedNew) setSeenNewTopics(JSON.parse(savedNew));
            const savedVersions = localStorage.getItem('seen-topic-versions');
            if (savedVersions) setSeenVersions(JSON.parse(savedVersions));
        } catch (e) { }
    }, []);

    const markAsSeen = (slug: string, version?: number) => {
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
    };

    const scrollToCard = (index: number) => {
        if (!isInteractive || !carouselRef.current) return;
        if (index >= 0 && index < sortedTopics.length) {
            carouselRef.current.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
        }
    };

    return (
        <MotionConfig reducedMotion={!isInteractive ? "always" : "never"}>
            <div className="w-full flex-1 flex flex-col justify-center relative group/carousel">
                {/* Navigation Arrows */}
                <AnimatePresence>
                    {activeIndex > 0 && isInteractive && (
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onClick={() => scrollToCard(activeIndex - 1)}
                            className="hidden md:flex absolute left-8 lg:left-16 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-slate-900/60 border border-white/10 hover:bg-slate-800 hover:border-primary/50 text-slate-400 hover:text-primary transition-colors backdrop-blur-xl shadow-2xl"
                            aria-label="Previous topic"
                        >
                            <ChevronLeft size={28} />
                        </motion.button>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {activeIndex < sortedTopics.length - 1 && isInteractive && (
                        <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            onClick={() => scrollToCard(activeIndex + 1)}
                            className="hidden md:flex absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-slate-900/60 border border-white/10 hover:bg-slate-800 hover:border-primary/50 text-slate-400 hover:text-primary transition-colors backdrop-blur-xl shadow-2xl"
                            aria-label="Next topic"
                        >
                            <ChevronRight size={28} />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* 3D Coverflow Container with NATIVE SCROLL for 120Hz ProMotion on iOS */}
                <div 
                    ref={carouselRef}
                    className="relative w-full h-[420px] md:h-[520px] flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    style={{ 
                        scrollBehavior: 'smooth', 
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        paddingLeft: `${paddingLeft}px`,
                        paddingRight: `${paddingLeft}px`
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
                            preferredLang={preferredLang}
                            navigate={navigate}
                            markAsSeen={markAsSeen}
                            isInteractive={isInteractive}
                            isMenuOpen={isMenuOpen}
                            seenNewTopics={seenNewTopics}
                            seenVersions={seenVersions}
                            onCardClick={scrollToCard}
                        />
                    ))}
                </div>

                {/* Awwwards-grade Interactive Scrubber */}
                <TopicScrubber 
                    sortedTopics={sortedTopics} 
                    activeIndex={activeIndex} 
                    scrollToCard={scrollToCard} 
                />
            </div>
        </MotionConfig>
    );
});

export default TopicCarousel;

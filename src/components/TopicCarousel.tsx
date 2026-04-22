import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useSubject } from '../contexts/SubjectContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { allPersonalNotes } from 'content-collections';
import { ArrowRight, Book, Terminal, Calculator, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, MotionConfig } from 'framer-motion';
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
            className={`group/card relative border border-white/10 overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            {...props}
        >
            {!shouldDisable && (
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover/card:opacity-100 z-50"
                    style={{ background: backgroundStyle }}
                />
            )}
            {children}
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
    const subject = subjectOverride || contextSubject;
    const { preferredLang } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const restoringRef = useRef(true);
    const [seenNewTopics, setSeenNewTopics] = useState<string[]>([]);
    const [seenVersions, setSeenVersions] = useState<Record<string, number>>({});
    const metricsRef = useRef<{ center: number, index: number }[]>([]);

    const sortedTopics = useMemo(() => {
        return [...allPersonalNotes]
            .filter(note => {
                const isMatch = (note as any).subject === subject && !note.slug.includes('-lab-');
                if (!isMatch) return false;

                // Hide notes marked as draft
                if ((note as any).draft) {
                    return false;
                }

                // Filtrar duplicats: quins idiomes té disponibles aquest slug?
                const versions = allPersonalNotes.filter(n => n.slug === note.slug && !(n as any).draft);
                const hasPreferred = versions.some(n => n.lang === preferredLang);

                if (hasPreferred) {
                    return note.lang === preferredLang;
                } else {
                    return note.lang === 'ca';
                }
            })
            .sort((a, b) => a.order - b.order);
    }, [subject, preferredLang]);

    // Save activeIndex to session storage whenever it updates (skip during restoration)
    useEffect(() => {
        if (restoringRef.current) return;
        sessionStorage.setItem(`topic-carousel-${subject}`, activeIndex.toString());
    }, [activeIndex, subject]);

    // Load seen topics from localStorage on mount
    useEffect(() => {
        try {
            const savedNew = localStorage.getItem('seen-new-topics');
            if (savedNew) {
                setSeenNewTopics(JSON.parse(savedNew));
            }
            const savedVersions = localStorage.getItem('seen-topic-versions');
            if (savedVersions) {
                setSeenVersions(JSON.parse(savedVersions));
            }
        } catch (e) { }
    }, []);

    const markAsSeen = (slug: string, version?: number) => {
        try {
            // Mark as new-seen
            const savedNew = localStorage.getItem('seen-new-topics');
            const prevNew = savedNew ? JSON.parse(savedNew) : [];
            if (!prevNew.includes(slug)) {
                const updatedNew = [...prevNew, slug];
                localStorage.setItem('seen-new-topics', JSON.stringify(updatedNew));
                // We don't update state here to avoid the badge disappearing before navigation
            }

            // Mark version as seen
            if (version !== undefined) {
                const savedVersions = localStorage.getItem('seen-topic-versions');
                const prevVersions = savedVersions ? JSON.parse(savedVersions) : {};
                if (prevVersions[slug] !== version) {
                    const updatedVersions = { ...prevVersions, [slug]: version };
                    localStorage.setItem('seen-topic-versions', JSON.stringify(updatedVersions));
                    // We don't update state here to avoid the badge disappearing before navigation
                }
            }
        } catch (e) { }
    };

    // Pre-calculate card metrics for ultra-fast scroll performance
    const updateMetrics = useCallback(() => {
        if (isMobile && isMenuOpen) return;
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const children = container.children;
        const newMetrics: { center: number, index: number }[] = [];

        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            if (child.classList.contains('carousel-card')) {
                const indexStr = child.getAttribute('data-index');
                if (indexStr !== null) {
                    newMetrics.push({
                        center: child.offsetLeft + child.clientWidth / 2,
                        index: parseInt(indexStr, 10)
                    });
                }
            }
        }
        metricsRef.current = newMetrics;
    }, []);

    // Initialize layout scales on mount & restore saved position
    useEffect(() => {
        const saved = sessionStorage.getItem(`topic-carousel-${subject}`);
        const savedIndex = saved ? parseInt(saved, 10) : 0;

        if (savedIndex > 0) {
            restoringRef.current = true;
            setActiveIndex(savedIndex);
        }

        const restoreScroll = () => {
            if (scrollRef.current && savedIndex > 0) {
                const container = scrollRef.current;
                const targetCard = Array.from(container.children).find(child =>
                    child.classList.contains('carousel-card') && child.getAttribute('data-index') === savedIndex.toString()
                ) as HTMLElement;

                if (targetCard) {
                    const containerWidth = container.clientWidth;
                    const cardWidth = targetCard.offsetWidth;
                    const centerPosition = targetCard.offsetLeft - (containerWidth / 2) + (cardWidth / 2);
                    container.scrollTo({ left: centerPosition, behavior: 'instant' as ScrollBehavior });
                }
            }

            // Important: Update metrics after scroll restoration but before first scroll event
            updateMetrics();

            setTimeout(() => {
                restoringRef.current = false;
                // Only trigger handleScroll if we're not in a low-priority background render (menu open)
                if (!(isMobile && isMenuOpen)) {
                    handleScroll();
                }
            }, 100);
        };

        requestAnimationFrame(() => requestAnimationFrame(restoreScroll));

        const handleGlobalResize = () => {
            updateMetrics();
            handleScroll();
        };
        window.addEventListener('resize', handleGlobalResize, { passive: true });

        return () => {
            window.removeEventListener('resize', handleGlobalResize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, [subject, updateMetrics, isMobile, isMenuOpen]);

    const scrollTo = useCallback((index: number) => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const card = container.children[index] as HTMLElement;

        if (card) {
            const containerWidth = container.clientWidth;
            const cardWidth = card.offsetWidth;
            const centerPosition = card.offsetLeft - (containerWidth / 2) + (cardWidth / 2);

            container.scrollTo({
                left: centerPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    const handlePrev = () => {
        if (activeIndex > 0) scrollTo(activeIndex - 1);
    };

    const handleNext = () => {
        if (activeIndex < sortedTopics.length - 1) scrollTo(activeIndex + 1);
    };

    // Optimized with requestAnimationFrame + Cached Metrics for 120fps Zero-Lag Sync
    const handleScroll = () => {
        if (restoringRef.current || (isMobile && isMenuOpen)) return;
        if (requestRef.current) cancelAnimationFrame(requestRef.current);

        requestRef.current = requestAnimationFrame(() => {
            if (!scrollRef.current || metricsRef.current.length === 0) return;
            const container = scrollRef.current;

            const containerWidth = container.clientWidth;
            const scrollCenter = container.scrollLeft + containerWidth / 2;
            const maxDist = containerWidth * 0.6;
            const children = container.children;

            let closestIndex = activeIndex;
            let minDistance = Infinity;

            for (let i = 0; i < metricsRef.current.length; i++) {
                const metric = metricsRef.current[i];
                const child = children[i] as HTMLElement;
                if (!child) continue;

                const distance = Math.abs(metric.center - scrollCenter);
                const progress = Math.max(0, 1 - distance / maxDist);
                const easeProgress = Math.pow(progress, 1.8);

                // DIRECT DOM WRITE (Fastest)
                child.style.transform = `scale(${0.85 + (easeProgress * 0.15)})`;
                child.style.opacity = `${0.3 + (easeProgress * 0.7)}`;

                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = metric.index;
                }
            }

            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = setTimeout(() => {
                React.startTransition(() => {
                    setActiveIndex((prev) => prev !== closestIndex ? closestIndex : prev);
                });
            }, 10);
        });
    };

    return (
        <MotionConfig reducedMotion={isMobile && isMenuOpen ? "always" : "never"}>
            <div className="w-full flex-1 flex flex-col justify-center relative group/carousel">
                {/* Desktop Navigation Arrows */}
                {activeIndex > 0 && (
                    <button
                        onClick={handlePrev}
                        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-slate-900/50 border border-white/10 hover:bg-slate-800 hover:border-primary/50 text-slate-400 hover:text-primary transition-all backdrop-blur-md opacity-0 group-hover/carousel:opacity-100"
                        aria-label="Previous topic"
                    >
                        <ChevronLeft size={28} />
                    </button>
                )}

                {activeIndex < sortedTopics.length - 1 && (
                    <button
                        onClick={handleNext}
                        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-slate-900/50 border border-white/10 hover:bg-slate-800 hover:border-primary/50 text-slate-400 hover:text-primary transition-all backdrop-blur-md opacity-0 group-hover/carousel:opacity-100"
                        aria-label="Next topic"
                    >
                        <ChevronRight size={28} />
                    </button>
                )}

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-2 md:gap-3 overflow-x-auto pb-20 pt-12 md:pb-24 md:pt-16 hide-scrollbar snap-x snap-mandatory px-[9vw] md:px-[calc(50%-190px)] scroll-smooth"
                >
                    {sortedTopics.map((topic, i) => {
                        const isActive = activeIndex === i;
                        // Check if ANY language version of this topic is marked as new or updated
                        const versions = allPersonalNotes.filter(n => n.slug === topic.slug);
                        const hasNewTag = versions.some(n => (n as any).isNew);
                        const newestUpdate = Math.max(0, ...versions.map(n => (n as any).isUpdated || 0));

                        const isTopicNew = hasNewTag && !seenNewTopics.includes(topic.slug);
                        const isTopicUpdated = !isTopicNew && newestUpdate > (seenVersions[topic.slug] || 0);

                        return (
                            <div
                                key={topic.slug}
                                data-index={i}
                                className="carousel-card shrink-0 snap-center outline-none"
                                style={{
                                    // Initial styles explicitly set to prevent flash before JS kicks in
                                    transform: isActive ? 'scale(1)' : 'scale(0.85)',
                                    opacity: isActive ? 1 : 0.3
                                }}
                                onClick={(e) => {
                                    if (!isActive) {
                                        e.preventDefault();
                                        scrollTo(i);
                                    } else {
                                        markAsSeen(topic.slug, newestUpdate);
                                        navigate(`/tema/${topic.slug}`);
                                    }
                                }}
                            >
                                <SpotlightCard
                                    isActive={isActive}
                                    isMenuOpen={isMenuOpen}
                                    className={`
                                        w-[82vw] md:w-[380px] h-[410px] md:h-[520px]
                                        rounded-[32px] md:rounded-[40px]
                                        flex flex-col justify-between
                                        cursor-pointer transition-colors duration-200
                                        ${isActive
                                            ? 'bg-slate-900/80 border-primary/20 shadow-2xl shadow-primary/20 ring-1 ring-primary/20 backdrop-blur-md'
                                            : 'bg-slate-900/40 border-white/5 shadow-none'
                                        }
                                    `}
                                >
                                    {/* Decorative Gradient Orb */}
                                    <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                                    {/* "New" Badge */}
                                    {isTopicNew && (
                                        <div className={`absolute top-6 right-6 md:top-8 md:right-8 z-30 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-90'}`}>
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-rose-500/90 to-pink-500/90 border border-rose-300/30 shadow-[0_0_20px_rgba(244,63,94,0.4)] backdrop-blur-md">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_5px_white]" />
                                                <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider drop-shadow-sm">
                                                    {preferredLang === 'es' ? 'Nuevo' : 'Nou'}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* "Updated" Badge */}
                                    {isTopicUpdated && (
                                        <div className={`absolute top-6 right-6 md:top-8 md:right-8 z-30 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-90'}`}>
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-emerald-500/90 to-teal-500/90 border border-emerald-300/30 shadow-[0_0_20px_rgba(16,185,129,0.4)] backdrop-blur-md">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_5px_white]" />
                                                <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider drop-shadow-sm">
                                                    {preferredLang === 'es' ? 'Actualizado' : 'Actualitzat'}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card Header */}
                                    <div className="p-5 md:p-10 relative z-20">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`
                                                p-3.5 rounded-2xl border backdrop-blur-md transition-colors duration-200
                                                ${isActive
                                                    ? 'bg-primary/10 border-primary/20 text-accent shadow-lg shadow-primary/10'
                                                    : 'bg-white/5 border-white/5 text-slate-500'
                                                }
                                            `}>
                                                <Book size={24} strokeWidth={1.5} />
                                            </div>
                                            <span className={`
                                                font-mono text-6xl font-bold transition-colors duration-200
                                                ${isActive ? 'text-white/10' : 'text-white/5'}
                                            `}>
                                                {(() => {
                                                    const match = topic.title.match(/^Tema (\d+)/);
                                                    if (match) return match[1].padStart(2, '0');
                                                    if (topic.title.toLowerCase().includes('parcial')) return 'P1';
                                                    if (topic.title.toLowerCase().includes('final')) return 'EF';
                                                    return String(i + 1).padStart(2, '0');
                                                })()}
                                            </span>
                                        </div>

                                        <h3 className={`
                                            text-2xl md:text-4xl font-bold leading-[1.1] tracking-tight mb-4 transition-colors duration-200
                                            ${isActive ? 'text-white' : 'text-slate-400'}
                                        `}>
                                            {topic.title}
                                        </h3>

                                        <div className="flex items-center gap-2.5">
                                            <div className={`h-px transition-all duration-200 ${isActive ? 'w-12 bg-primary' : 'w-6 bg-slate-700'}`} />
                                            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                                                {topic.readTime || '10 Min'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-5 md:px-10 relative z-20 flex-1">
                                        <p className="text-slate-400 text-[13px] md:text-base leading-relaxed line-clamp-3 font-light">
                                            {topic.description}
                                        </p>
                                    </div>

                                    {/* Link / Action */}
                                    <div className={`
                                        px-5 md:px-10 pb-5 md:pb-8 mt-auto relative z-20 transition-all duration-200
                                        ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                                    `}>
                                        <div className="flex flex-col gap-3 md:gap-4">
                                            <Link
                                                to={`/tema/${topic.slug}`}
                                                onClick={(e) => { e.stopPropagation(); markAsSeen(topic.slug, newestUpdate); }}
                                                className="group/btn flex items-center justify-between gap-3 text-white font-semibold bg-linear-to-r from-primary/80 to-accent/80 hover:from-primary hover:to-accent px-3.5 py-2 md:px-4 md:py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 text-[13px] md:text-sm"
                                            >
                                                <span>Explorar tema</span>
                                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:scale-110 transition-all duration-300" />
                                            </Link>

                                            <Link
                                                to={`/tema/${topic.slug}/test`}
                                                onClick={(e) => { e.stopPropagation(); markAsSeen(topic.slug, newestUpdate); }}
                                                className="text-slate-500 hover:text-amber-400 text-sm font-medium flex items-center gap-2 transition-colors w-fit group/test"
                                            >
                                                <div className="p-1 rounded bg-white/5 group-hover/test:bg-amber-500/10 transition-colors">
                                                    <RefreshCw size={12} className="group-hover/test:rotate-180 transition-transform duration-500" />
                                                </div>
                                                <span>Test</span>
                                            </Link>

                                            <Link
                                                to={subject === 'pro2' && topic.slug === 'pro2-tema-1' ? '/tema/pro2-lab-1' : subject === 'pro2' && topic.slug === 'pro2-tema-2' ? '/tema/pro2-lab-2' : `/tema/${topic.slug}/solucionaris`}
                                                onClick={(e) => { e.stopPropagation(); markAsSeen(topic.slug, newestUpdate); }}
                                                className="text-slate-500 hover:text-emerald-400 text-sm font-medium flex items-center gap-2 transition-colors w-fit group/sol"
                                            >
                                                <div className="p-1 rounded bg-white/5 group-hover/sol:bg-emerald-500/10 transition-colors">
                                                    {subject === 'pro2' ? <Terminal size={12} /> : <Calculator size={12} />}
                                                </div>
                                                <span>{subject === 'm1' ? 'Solucionaris M1' : subject === 'm2' ? 'Solucionaris M2' : (subject === 'pro2' && (topic.slug === 'pro2-tema-1' || topic.slug === 'pro2-tema-2') ? 'Solucionaris Lab' : 'Solucionaris Jutge')}</span>
                                            </Link>
                                        </div>
                                    </div>

                                </SpotlightCard>
                            </div>
                        );
                    })}
                </div>

                {/* Elegant Pagination Indicators */}
                <div className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:bottom-6 left-0 right-0 flex justify-center gap-2 z-50">
                    {sortedTopics.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollTo(i)}
                            className="group p-2 cursor-pointer focus:outline-none"
                            aria-label={`Go to slide ${i + 1}`}
                        >
                            <div className={`
                                transition-all duration-500 rounded-full
                                ${activeIndex === i
                                    ? 'w-12 h-1.5 bg-accent shadow-[0_0_15px_rgba(56,189,248,0.6)]'
                                    : 'w-2 h-2 bg-slate-600 group-hover:bg-slate-400'
                                }
                            `} />
                        </button>
                    ))}
                </div>
            </div>
        </MotionConfig>
    );
});

export default TopicCarousel;

import React, { useRef, useState } from 'react';
import { useSubject } from '../contexts/SubjectContext';
import { Link, useNavigate } from 'react-router-dom';
import { allPersonalNotes } from 'content-collections';
import { ArrowRight, Book, Terminal, Calculator, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

function SpotlightCard({
    children,
    className = "",
    isActive = false,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    isActive?: boolean;
    [key: string]: any;
}) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Fix: Hook must be at top level, not inside conditional
    const backgroundStyle = useMotionTemplate`
        radial-gradient(
          650px circle at ${mouseX}px ${mouseY}px,
          rgba(var(--primary-rgb), 0.15),
          transparent 80%
        )
    `;

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={`group/card relative border border-white/10 bg-slate-900/50 overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            {...props}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover/card:opacity-100 z-50"
                style={{ background: backgroundStyle }}
            />
            {children}
        </div>
    );
}

const TopicCarousel: React.FC = () => {
    const navigate = useNavigate();
    const { subject } = useSubject();
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const sortedTopics = [...allPersonalNotes]
        .filter(note => (note as any).subject === subject && !note.slug.includes('-lab-'))
        .sort((a, b) => a.order - b.order);

    const scrollTo = (index: number) => {
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
    };

    const handlePrev = () => {
        if (activeIndex > 0) scrollTo(activeIndex - 1);
    };

    const handleNext = () => {
        if (activeIndex < sortedTopics.length - 1) scrollTo(activeIndex + 1);
    };

    // Calculate the closest card to the center on scroll
    const handleScroll = () => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const scrollCenter = container.scrollLeft + container.clientWidth / 2;

        let closestIndex = activeIndex;
        let minDistance = Infinity;

        const children = container.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            // Only process the actual carousel cards
            if (child.classList.contains('carousel-card')) {
                const childCenter = child.offsetLeft + child.clientWidth / 2;
                const distance = Math.abs(childCenter - scrollCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    const index = child.getAttribute('data-index');
                    if (index !== null) {
                        closestIndex = parseInt(index, 10);
                    }
                }
            }
        }

        if (closestIndex !== activeIndex) {
            setActiveIndex(closestIndex);
        }
    };

    return (
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
                className="
                    flex overflow-x-auto items-center
                    snap-x snap-mandatory 
                    scroll-smooth hide-scrollbar 
                    relative
                    pt-12 pb-20 md:pt-16 md:pb-24 gap-2 md:gap-3
                    px-[calc(50%_-_160px)] md:px-[calc(50%_-_190px)]
                "
            >
                {sortedTopics.map((topic, i) => {
                    const isActive = activeIndex === i;

                    return (
                        <div
                            key={topic.slug}
                            data-index={i}
                            className={`carousel-card flex-shrink-0 snap-center outline-none transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform-gpu ${isActive ? 'scale-100 z-10 opacity-100' : 'scale-90 opacity-40 hover:opacity-60 hover:scale-95'
                                }`}
                            onClick={(e) => {
                                if (!isActive) {
                                    e.preventDefault();
                                    scrollTo(i);
                                } else {
                                    navigate(`/tema/${topic.slug}`);
                                }
                            }}
                        >
                            <SpotlightCard
                                isActive={isActive}
                                className={`
                                    w-[320px] md:w-[380px] h-[460px] md:h-[520px]
                                    rounded-[32px] md:rounded-[40px]
                                    flex flex-col justify-between
                                    cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform-gpu
                                    ${isActive
                                        ? 'bg-slate-900/80 border-primary/20 shadow-2xl shadow-primary/10 ring-1 ring-primary/20 backdrop-blur-xl'
                                        : 'bg-slate-900/40 border-white/5 shadow-none backdrop-blur-xl'
                                    }
                                `}
                            >
                                {/* Decorative Gradient Orb */}
                                <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                                {/* Card Header */}
                                <div className="p-8 md:p-10 relative z-20">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`
                                            p-3.5 rounded-2xl border backdrop-blur-md transition-all duration-300
                                            ${isActive
                                                ? 'bg-primary/10 border-primary/20 text-accent shadow-lg shadow-primary/10'
                                                : 'bg-white/5 border-white/5 text-slate-500'
                                            }
                                        `}>
                                            <Book size={24} strokeWidth={1.5} />
                                        </div>
                                        <span className={`
                                            font-mono text-6xl font-bold transition-all duration-500
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
                                        text-3xl md:text-4xl font-bold leading-[0.9] tracking-tight mb-4 transition-colors duration-300
                                        ${isActive ? 'text-white' : 'text-slate-400'}
                                    `}>
                                        {topic.title}
                                    </h3>

                                    <div className="flex items-center gap-2.5">
                                        <div className={`h-px transition-all duration-500 ${isActive ? 'w-12 bg-primary' : 'w-6 bg-slate-700'}`} />
                                        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                                            {topic.readTime || '10 Min'}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-8 md:px-10 relative z-20 flex-1">
                                    <p className="text-slate-400 text-sm md:text-base leading-relaxed line-clamp-3 font-light">
                                        {topic.description}
                                    </p>
                                </div>

                                {/* Link / Action */}
                                <div className={`
                                    p-8 md:p-10 mt-auto relative z-20 transition-all duration-500 delay-100
                                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                                `}>
                                    <div className="flex flex-col gap-4">
                                        <div className="group/btn flex items-center gap-3 text-accent font-medium">
                                            <span className="group-hover/btn:underline decoration-primary/30 underline-offset-4">Explorar tema</span>
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </div>

                                        <Link
                                            to={`/tema/${topic.slug}/test`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-slate-500 hover:text-amber-400 text-sm font-medium flex items-center gap-2 transition-colors w-fit group/test"
                                        >
                                            <div className="p-1 rounded bg-white/5 group-hover/test:bg-amber-500/10 transition-colors">
                                                <RefreshCw size={12} className="group-hover/test:rotate-180 transition-transform duration-500" />
                                            </div>
                                            <span>Test</span>
                                        </Link>

                                        <Link
                                            to={subject === 'pro2' && topic.slug === 'pro2-tema-1' ? '/tema/pro2-lab-1' : subject === 'pro2' && topic.slug === 'pro2-tema-2' ? '/tema/pro2-lab-2' : `/tema/${topic.slug}/solucionaris`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-slate-500 hover:text-emerald-400 text-sm font-medium flex items-center gap-2 transition-colors w-fit group/sol"
                                        >
                                            <div className="p-1 rounded bg-white/5 group-hover/sol:bg-emerald-500/10 transition-colors">
                                                {subject === 'm1' ? <Calculator size={12} /> : <Terminal size={12} />}
                                            </div>
                                            <span>{subject === 'm1' ? 'Solucionaris M1' : (subject === 'pro2' && (topic.slug === 'pro2-tema-1' || topic.slug === 'pro2-tema-2') ? 'Solucionaris Lab' : 'Solucionaris Jutge')}</span>
                                        </Link>
                                    </div>
                                </div>

                            </SpotlightCard>
                        </div>
                    );
                })}
            </div>

            {/* Elegant Pagination Indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-50">
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
    );
};

export default TopicCarousel;

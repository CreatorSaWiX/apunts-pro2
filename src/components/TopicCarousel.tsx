import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { topics } from '../data/notes';
import { ArrowRight, Book, Terminal } from 'lucide-react';
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
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover/card:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(56, 189, 248, 0.15),
              transparent 80%
            )
          `,
                }}
            />
            {children}
        </div>
    );
}

const TopicCarousel: React.FC = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

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

    // Track active index based on scroll position using getBoundingClientRect for absolute precision
    const handleScroll = () => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + (containerRect.width / 2);

        let closestIndex = 0;
        let minDistance = Number.MAX_VALUE;

        // Find card closest to center
        Array.from(container.children).forEach((child, index) => {
            if (!child.classList.contains('carousel-card')) return;

            const card = child as HTMLElement;
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + (cardRect.width / 2);
            const distance = Math.abs(containerCenter - cardCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        if (closestIndex !== activeIndex) {
            setActiveIndex(closestIndex);
        }
    };

    // Keep active index updated on mount, scroll, and resize
    useEffect(() => {
        // Initial check
        // Small timeout to ensure layout is stable especially with snaps
        setTimeout(handleScroll, 100);

        const container = scrollRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('resize', handleScroll, { passive: true });

            return () => {
                container.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleScroll);
            };
        }
    }, [activeIndex]); // Depend on activeIndex to access latest state if needed, though mostly functional state

    return (
        <div className="w-full flex-1 flex flex-col justify-center relative">
            <div
                ref={scrollRef}
                className="
                    flex overflow-x-auto items-center
                    snap-x snap-mandatory 
                    scroll-smooth hide-scrollbar 
                    relative
                    pt-12 pb-20
                    px-[calc(50%-160px)] md:px-[calc(50%-190px)]
                "
            >
                {topics.map((topic, i) => {
                    const isActive = activeIndex === i;

                    return (
                        <div
                            key={topic.id}
                            draggable="false"
                            data-index={i}
                            className={`carousel-card flex-shrink-0 snap-center outline-none transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isActive ? 'scale-100 z-10' : 'scale-90 opacity-40 blur-[2px] grayscale-[0.5] hover:opacity-60 hover:scale-95'
                                }`}
                            onClick={(e) => {
                                if (!isActive) {
                                    e.preventDefault();
                                    scrollTo(i);
                                } else {
                                    // Navigate to topic on click
                                    navigate(`/tema/${topic.id}`);
                                }
                            }}
                        >
                            <SpotlightCard
                                isActive={isActive}
                                className={`
                                    w-[320px] md:w-[380px] h-[460px] md:h-[520px]
                                    rounded-[32px] md:rounded-[40px]
                                    flex flex-col justify-between
                                    backdrop-blur-xl cursor-pointer
                                    ${isActive
                                        ? 'bg-slate-900/80 border-sky-500/20 shadow-2xl shadow-sky-500/10 ring-1 ring-sky-500/20'
                                        : 'bg-slate-900/40 border-white/5 shadow-none'
                                    }
                                `}
                            >
                                {/* Decorative Gradient Orb */}
                                {isActive && (
                                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
                                )}

                                {/* Card Header */}
                                <div className="p-8 md:p-10 relative z-20">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`
                                            p-3.5 rounded-2xl border backdrop-blur-md transition-all duration-300
                                            ${isActive
                                                ? 'bg-sky-500/10 border-sky-500/20 text-sky-400 shadow-lg shadow-sky-500/10'
                                                : 'bg-white/5 border-white/5 text-slate-500'
                                            }
                                        `}>
                                            <Book size={24} strokeWidth={1.5} />
                                        </div>
                                        <span className={`
                                            font-mono text-6xl font-bold transition-all duration-500
                                            ${isActive ? 'text-white/10' : 'text-white/5'}
                                        `}>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    <h3 className={`
                                        text-3xl md:text-4xl font-bold leading-[0.9] tracking-tight mb-4 transition-colors duration-300
                                        ${isActive ? 'text-white' : 'text-slate-400'}
                                    `}>
                                        {topic.title}
                                    </h3>

                                    <div className="flex items-center gap-2.5">
                                        <div className={`h-px transition-all duration-500 ${isActive ? 'w-12 bg-sky-500' : 'w-6 bg-slate-700'}`} />
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
                                        <div className="group/btn flex items-center gap-3 text-sky-400 font-medium">
                                            <span className="group-hover/btn:underline decoration-sky-500/30 underline-offset-4">Explorar Tema</span>
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </div>

                                        <Link
                                            to={`/tema/${topic.id}/solucionaris`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-slate-500 hover:text-emerald-400 text-sm font-medium flex items-center gap-2 transition-colors w-fit group/sol"
                                        >
                                            <div className="p-1 rounded bg-white/5 group-hover/sol:bg-emerald-500/10 transition-colors">
                                                <Terminal size={12} />
                                            </div>
                                            <span>Solucionaris Jutge</span>
                                        </Link>
                                    </div>
                                </div>

                            </SpotlightCard>
                        </div>
                    );
                })}
            </div>

            {/* Elegant Pagination Indicators */}
            {/* Elegant Pagination Indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-50">
                {topics.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        className="group p-2 cursor-pointer focus:outline-none"
                        aria-label={`Go to slide ${i + 1}`}
                    >
                        <div className={`
                            transition-all duration-500 rounded-full
                            ${activeIndex === i
                                ? 'w-12 h-1.5 bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.6)]'
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


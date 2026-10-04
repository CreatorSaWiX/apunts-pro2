import React from 'react';
import type { TFunction } from 'i18next';
import { ArrowRight, Book, Terminal, Calculator, RefreshCw, Sparkles } from 'lucide-react';
import { m as motion, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import type { allPersonalNotes } from 'content-collections';
import { hapticLight } from '../../lib/haptics';
import { getTopicSolutionRoute, getTopicSolutionLabel, isProgrammingSubject } from '../../utils/solutionUtils';

type TopicNote = (typeof allPersonalNotes)[number];

export interface CarouselCardProps {
    topic: TopicNote;
    index: number;
    activeIndex: number;
    itemWidth: number;
    scrollX: MotionValue<number>;
    subject: string;
    navigate: (to: string) => void;
    markAsSeen: (slug: string, updateTime: number) => void;
    isInteractive: boolean;
    seenNewTopics: Set<string>;
    seenVersions: Record<string, number>;
    onCardClick: (index: number) => void;
    topicMeta?: { hasNew: boolean; newestUpdate: number };
    t: TFunction;
}

export const CarouselCard = React.memo(({
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

    const isTopicNew = hasNewTag && !seenNewTopics.has(topic.slug);
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
                            <div className={`p-3.5 rounded-2xl border backdrop-blur-md transition duration-500 shadow-md ${isActive ? 'bg-primary/10 border-primary/20 text-accent shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]' : 'bg-white/5 border-white/5 text-slate-500'}`}>
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
                                            navigate(getTopicSolutionRoute(topic.slug));
                                        }}
                                        className="flex-1 text-slate-300 hover:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors bg-slate-800/50 py-3 rounded-lg border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 shadow-inner cursor-pointer"
                                    >
                                        {isProgrammingSubject(subject) ? <Terminal size={14} /> : <Calculator size={14} />} {getTopicSolutionLabel(subject, topic.slug, t)}
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

CarouselCard.displayName = 'CarouselCard';

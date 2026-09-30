import React from 'react';
import type { TFunction } from 'i18next';
import { ArrowRight } from 'lucide-react';
import { m as motion } from 'framer-motion';
import type { allPersonalNotes } from 'content-collections';
import { hapticLight } from '../../lib/haptics';

type TopicNote = (typeof allPersonalNotes)[number];

export interface LandscapeTopicCardProps {
    topic: TopicNote;
    index: number;
    subject: string;
    navigate: (to: string) => void;
    markAsSeen: (slug: string, updateTime?: number) => void;
    seenNewTopics: Set<string>;
    seenVersions: Record<string, number>;
    topicMeta?: { hasNew: boolean; newestUpdate: number };
    t: TFunction;
}

export const LandscapeTopicCard = React.memo(({ 
    topic, 
    index, 
    navigate, 
    markAsSeen, 
    seenNewTopics, 
    seenVersions, 
    topicMeta, 
    t 
}: LandscapeTopicCardProps) => {
    const hasNewTag = topicMeta?.hasNew ?? false;
    const newestUpdate = topicMeta?.newestUpdate ?? 0;

    const isTopicNew = hasNewTag && !seenNewTopics.has(topic.slug);
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

LandscapeTopicCard.displayName = 'LandscapeTopicCard';

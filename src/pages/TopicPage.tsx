import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { allPersonalNotes } from 'content-collections';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MarkdownRenderer } from "../markdown/MarkdownRenderer";


const TopicPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const topic = allPersonalNotes.find(note => note.slug === id);

    // Scroll Progress
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const sortedTopics = [...allPersonalNotes]
        .filter(t => t.subject === topic?.subject)
        .sort((a, b) => a.order - b.order);
    const currentIndex = sortedTopics.findIndex(t => t.slug === id);
    const prevTopic = currentIndex > 0 ? sortedTopics[currentIndex - 1] : undefined;
    const nextTopic = currentIndex < sortedTopics.length - 1 ? sortedTopics[currentIndex + 1] : undefined;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!topic) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen relative z-10">
            {/* Reading Progress Bar - Sticky Top */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 origin-left z-50 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                style={{ scaleX }}
            />

            <div className="pt-28 pb-20 px-4 sm:px-8 max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 border-b border-white/5 pb-8"
                >
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
                        {topic.title}
                    </h1>
                    <div className="flex items-center gap-4 text-slate-400 text-sm font-mono">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {topic.readTime || '5 min'} lectura
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <span>{topic.description}</span>
                    </div>
                </motion.div>

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none heading-reset">
                    <MarkdownRenderer content={topic.content} />
                </div>

                {/* Navigation Footer */}
                <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {prevTopic ? (
                        <Link
                            to={`/tema/${prevTopic.slug}`}
                            className="group relative p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all overflow-hidden"
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/0 to-sky-500/0 group-hover:via-sky-500/5 transition-all duration-500" />
                            <div className="relative z-10">
                                <div
                                    className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <ArrowLeft size={12} /> Anterior
                                </div>
                                <div
                                    className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
                                    {prevTopic.title}
                                </div>
                            </div>
                        </Link>
                    ) : <div />}

                    {nextTopic ? (
                        <Link
                            to={`/tema/${nextTopic.slug}`}
                            className="group relative p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all overflow-hidden text-right"
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-l from-sky-500/0 via-sky-500/0 to-sky-500/0 group-hover:via-sky-500/5 transition-all duration-500" />
                            <div className="relative z-10">
                                <div
                                    className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-end gap-2">
                                    Següent <ArrowRight size={12} />
                                </div>
                                <div
                                    className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
                                    {nextTopic.title}
                                </div>
                            </div>
                        </Link>
                    ) : <div />}
                </div>
            </div>
        </div>
    );
};

export default TopicPage;

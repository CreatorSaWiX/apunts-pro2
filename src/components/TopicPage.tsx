import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { topics } from '../data/notes';
import NoteSection from './NoteSection';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const TopicPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const topicIndex = topics.findIndex(t => t.id === id);
    const topic = topics[topicIndex];

    // Scroll Progress
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const prevTopic = topics[topicIndex - 1];
    const nextTopic = topics[topicIndex + 1];

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

            <div className="pt-14 pb-20 px-4 max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-2 border-b border-white/5 pb-4"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-sky-400 transition-colors mb-6 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Tornar a l'inici
                    </Link>

                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
                        {topic.title}
                    </h1>
                </motion.div>

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none">
                    <NoteSection section={topic} index={0} />
                </div>

                {/* Navigation Footer */}
                <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {prevTopic ? (
                        <Link
                            to={`/tema/${prevTopic.id}`}
                            className="group relative p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/0 to-sky-500/0 group-hover:via-sky-500/5 transition-all duration-500" />
                            <div className="relative z-10">
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <ArrowLeft size={12} /> Anterior
                                </div>
                                <div className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
                                    {prevTopic.title}
                                </div>
                            </div>
                        </Link>
                    ) : <div />}

                    {nextTopic ? (
                        <Link
                            to={`/tema/${nextTopic.id}`}
                            className="group relative p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all overflow-hidden text-right"
                        >
                            <div className="absolute inset-0 bg-gradient-to-l from-sky-500/0 via-sky-500/0 to-sky-500/0 group-hover:via-sky-500/5 transition-all duration-500" />
                            <div className="relative z-10">
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-end gap-2">
                                    Següent <ArrowRight size={12} />
                                </div>
                                <div className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
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

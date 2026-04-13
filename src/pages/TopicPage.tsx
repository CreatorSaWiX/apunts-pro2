import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { allPersonalNotes } from 'content-collections';

import { useLanguage } from '../contexts/LanguageContext';

import { ArrowLeft, ArrowRight, FileText, X } from 'lucide-react';
import { MarkdownRenderer } from "../markdown/MarkdownRenderer";


const TopicPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { preferredLang } = useLanguage();
    
    // PDF Download state
    const [availablePdfs, setAvailablePdfs] = useState<{ ca: boolean; es: boolean }>({ ca: false, es: false });
    const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);

    let topic = allPersonalNotes.find(note => note.slug === id && note.lang === preferredLang);
    
    if (!topic) {
        topic = allPersonalNotes.find(note => note.slug === id && note.lang === 'ca');
    }

    // Scroll Progress
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const isLab = topic?.slug.includes('-lab-');

    // Redirigir si el tema no existeix o està en draft sempre
    if (!topic || (topic as any).draft) {
        return <Navigate to="/" replace />;
    }

    const sortedTopics = [...allPersonalNotes]
        .filter(t => t.subject === topic?.subject)
        .filter(t => {
            const tIsLab = t.slug.includes('-lab-');
            const isMatch = isLab ? tIsLab : !tIsLab;
            if (!isMatch) return false;

            // Hide notes marked as draft
            if ((t as any).draft) return false;
            return true;
        })
        .sort((a, b) => a.order - b.order);

    const currentIndex = sortedTopics.findIndex(t => t.slug === id);
    const prevTopic = currentIndex > 0 ? sortedTopics[currentIndex - 1] : undefined;
    const nextTopic = currentIndex < sortedTopics.length - 1 ? sortedTopics[currentIndex + 1] : undefined;

    useEffect(() => {
        window.scrollTo(0, 0);
        setIsPdfMenuOpen(false); // amagar menú al canviar de tema

        if (topic) {
            const filename = topic.slug.replace(new RegExp(`^${topic.subject}-`), '');
            
            const checkPdfs = async () => {
                try {
                    const [caRes, esRes] = await Promise.all([
                        fetch(`/pdfs/${topic.subject}/ca/${filename}.pdf`, { method: 'HEAD' }),
                        fetch(`/pdfs/${topic.subject}/es/${filename}.pdf`, { method: 'HEAD' })
                    ]);
                    
                    const isValidPdf = (res: Response) => {
                        return res.ok && res.headers.get('content-type')?.includes('application/pdf');
                    };

                    setAvailablePdfs({ 
                        ca: !!isValidPdf(caRes), 
                        es: !!isValidPdf(esRes) 
                    });
                } catch (e) {
                    console.error("Error comprovant PDFs", e);
                    setAvailablePdfs({ ca: false, es: false });
                }
            };
            checkPdfs();
        }
    }, [id, topic]);

    if (!topic) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen relative z-10">
            {/* Reading Progress Bar - Sticky Top */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-sky-400 to-indigo-500 origin-left z-50 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                style={{ scaleX }}
            />

            <div className="pt-28 pb-20 px-4 sm:px-8 max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 border-b border-white/5 pb-8 relative"
                >
                    {/* PDF Download Button UI - Absolute Floating */}
                    {(availablePdfs.ca || availablePdfs.es) && (
                        <div className="absolute top-0 right-0 z-20">
                            <button 
                                onClick={() => setIsPdfMenuOpen(!isPdfMenuOpen)}
                                className="flex flex-col items-center justify-center gap-1 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all select-none bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 shadow-lg shadow-red-950/10 group min-w-[60px]"
                            >
                                <FileText size={18} className="group-hover:scale-110 transition-transform duration-300" />
                                <span>PDF</span>
                            </button>
                            
                            <AnimatePresence>
                                {isPdfMenuOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-[#0b1221] border border-red-500/20 rounded-xl shadow-[0_10px_40px_-10px_rgba(239,68,68,0.2)] overflow-hidden"
                                    >
                                        <div className="p-2 border-b border-red-500/10 flex justify-between items-center text-[10px] text-red-400/70 font-bold uppercase tracking-widest">
                                            Idioma
                                            <button onClick={() => setIsPdfMenuOpen(false)} className="hover:text-red-300 p-1 rounded-md hover:bg-red-500/10 transition-colors">
                                                <X size={12} />
                                            </button>
                                        </div>
                                        <div className="p-1">
                                            {availablePdfs.ca && (
                                                <a 
                                                    href={`/pdfs/${topic.subject}/ca/${topic.slug.replace(new RegExp(`^${topic.subject}-`), '')}.pdf`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => setIsPdfMenuOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors group"
                                                >
                                                    <FileText size={14} className="text-red-400/50 group-hover:text-red-400 transition-colors" />
                                                    CA
                                                </a>
                                            )}
                                            {availablePdfs.es && (
                                                <a 
                                                    href={`/pdfs/${topic.subject}/es/${topic.slug.replace(new RegExp(`^${topic.subject}-`), '')}.pdf`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => setIsPdfMenuOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors group"
                                                >
                                                    <FileText size={14} className="text-red-400/50 group-hover:text-red-400 transition-colors" />
                                                    ES
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4 pr-20">
                        {topic.title}
                    </h1>

                    <div className="flex flex-col gap-4">
                        {topic.description && (
                            <div className="text-slate-400 text-sm font-mono max-w-4xl leading-relaxed">
                                {topic.description}
                            </div>
                        )}
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
                            className="group relative p-6 rounded-3xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-all overflow-hidden"
                        >
                            <div
                                className="absolute inset-0 bg-linear-to-r from-sky-500/0 via-sky-500/0 to-sky-500/0 group-hover:via-sky-500/5 transition-all duration-500" />
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
                            className="group relative p-6 rounded-3xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-all overflow-hidden text-right"
                        >
                            <div
                                className="absolute inset-0 bg-linear-to-l from-sky-500/0 via-sky-500/0 to-sky-500/0 group-hover:via-sky-500/5 transition-all duration-500" />
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

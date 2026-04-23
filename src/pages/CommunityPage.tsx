import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CommunityPost } from '../types/community';
import PostComposer from '../components/community/PostComposer';
import PublicationCard from '../components/community/PublicationCard';
import { SUBJECTS } from '../config/subjects';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Filter, Flame, Award, Zap, Ghost } from 'lucide-react';

const CommunityPage = () => {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeRankFilter, setActiveRankFilter] = useState<number | null>(null);

    useEffect(() => {
        let q = query(
            collection(db, 'community_posts'),
            orderBy('isPinned', 'desc'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        if (activeFilter !== 'all') {
            q = query(q, where('subject', '==', activeFilter));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const rawPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CommunityPost[];
            setPosts(rawPosts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [activeFilter]);

    const filteredPosts = activeRankFilter === null 
        ? posts 
        : posts.filter(p => p.rank === activeRankFilter);

    return (
        <div className="pt-24 pb-20 px-4 max-w-4xl mx-auto relative z-10">
            {/* Header Area */}
            <div className="mb-10 text-center">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-accent text-sm font-medium mb-4"
                >
                    <Users size={16} />
                    <span>Espai Comunitari</span>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                    Mur de la <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">Comunitat</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-xl mx-auto font-light">
                    Comparteix recursos, dubtes i inspiració amb altres estudiants del GEI.
                </p>
            </div>

            {/* Main Composition Area */}
            <div className="mb-12">
                <PostComposer />
            </div>

            {/* Filters Bar */}
            <div className="sticky top-20 z-40 bg-slate-950/80 backdrop-blur-xl border border-white/5 p-2 rounded-2xl mb-8 flex flex-wrap items-center gap-2 shadow-2xl">
                <div className="flex items-center gap-2 px-3 mr-2 border-r border-white/10 hidden md:flex">
                    <Filter size={14} className="text-slate-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filtres</span>
                </div>
                
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${activeFilter === 'all' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    Tots
                </button>
                {SUBJECTS.map(subject => {
                    const colorClasses: Record<string, string> = {
                        sky: 'bg-sky-500',
                        violet: 'bg-violet-500',
                        emerald: 'bg-emerald-500',
                        slate: 'bg-slate-500'
                    };
                    return (
                        <button
                            key={subject.id}
                            onClick={() => setActiveFilter(subject.id)}
                            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeFilter === subject.id ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <div className={`w-2 h-2 rounded-full ${colorClasses[subject.color] || 'bg-slate-500'}`} />
                            {subject.label}
                        </button>
                    );
                })}

                <div className="ml-auto flex items-center gap-2 pl-4 border-l border-white/10">
                    <button 
                        onClick={() => setActiveRankFilter(activeRankFilter === 4 ? null : 4)}
                        className={`p-2 rounded-lg transition-all ${activeRankFilter === 4 ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/50' : 'text-slate-500 hover:text-purple-400'}`}
                        title="Només Mythic"
                    >
                        <Zap size={18} />
                    </button>
                    <button 
                        onClick={() => setActiveRankFilter(activeRankFilter === 3 ? null : 3)}
                        className={`p-2 rounded-lg transition-all ${activeRankFilter === 3 ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50' : 'text-slate-500 hover:text-amber-400'}`}
                        title="Només Legendary"
                    >
                        <Award size={18} />
                    </button>
                    <button 
                        onClick={() => setActiveRankFilter(activeRankFilter === 2 ? null : 2)}
                        className={`p-2 rounded-lg transition-all ${activeRankFilter === 2 ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/50' : 'text-slate-500 hover:text-rose-400'}`}
                        title="Només Epic"
                    >
                        <Flame size={18} />
                    </button>
                </div>
            </div>

            {/* Feed */}
            <div className="space-y-6">
                <AnimatePresence mode='popLayout'>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm font-mono tracking-widest text-slate-500">CARREGANT FEED...</span>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-32 text-slate-500 gap-4"
                        >
                            <Ghost size={48} className="opacity-20 translate-y-2 animate-bounce" />
                            <p className="font-medium">No s'ha trobat cap publicació.</p>
                        </motion.div>
                    ) : (
                        filteredPosts.map((post) => (
                            <PublicationCard key={post.id} post={post} />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CommunityPage;

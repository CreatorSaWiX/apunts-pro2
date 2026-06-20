import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot, where, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CommunityPost } from '../types/community';
import PublicationCard from '../components/community/PublicationCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import SubjectSelectorModal from '../components/community/SubjectSelectorModal';
import { SUBJECTS } from '../config/subjects';
import CreatePostModal from '../components/community/CreatePostModal';
import PostDetailModal from '../components/community/PostDetailModal';
import NavigationPill from '../components/ui/NavigationPill';
import { LayoutDashboard, FileText as FileTextIcon } from 'lucide-react';
import NotesView from '../components/community/NotesView';

const CommunityPage = () => {
    const [activeView, setActiveView] = useState<'aparador' | 'apunts'>('aparador');
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastVisible, setLastVisible] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);
    
    const [activeSubject, setActiveSubject] = useState('all');
    const [showSubjectFilter, setShowSubjectFilter] = useState(false);
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

    const observer = useRef<IntersectionObserver | null>(null);
    const POSTS_PER_PAGE = 24;

    useEffect(() => {
        setLoading(true);
        setHasMore(true);
        setPosts([]);
        
        let q = query(
            collection(db, 'community_posts'),
            orderBy('isPinned', 'desc'),
            orderBy('createdAt', 'desc'),
            limit(POSTS_PER_PAGE)
        );

        if (activeSubject !== 'all') {
            q = query(q, where('subject', '==', activeSubject));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const rawPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CommunityPost[];
            setPosts(rawPosts);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [activeSubject]);

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore || !lastVisible) return;
        setLoadingMore(true);

        let q = query(
            collection(db, 'community_posts'),
            orderBy('isPinned', 'desc'),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(POSTS_PER_PAGE)
        );

        if (activeSubject !== 'all') {
            q = query(q, where('subject', '==', activeSubject));
        }

        const snapshot = await getDocs(q);
        const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CommunityPost[];

        setPosts(prev => [...prev, ...newPosts]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
        setLoadingMore(false);
    }, [loadingMore, hasMore, lastVisible, activeSubject]);

    const lastPostRef = useCallback((node: HTMLDivElement | null) => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore, loadMore]);

    return (
        <div className="w-full min-h-screen pt-24 pb-32 flex justify-center bg-[#050505] text-white overflow-x-hidden selection:bg-white selection:text-black">
            {/* Custom Background Noise/Glow (Awwwards feel) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[150px] opacity-30 mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-purple-500/20 rounded-full blur-[150px] opacity-30 mix-blend-screen" />
            </div>

            <main className="w-full max-w-[1600px] px-6 sm:px-12 relative z-10">
                
                {/* Dynamic Island Navigator (Fixed Top Right) */}
                <div className="fixed top-5 md:top-6 right-4 sm:right-6 z-50">
                    <NavigationPill>
                        {[
                            { id: 'aparador', label: 'Aparador', icon: LayoutDashboard },
                            { id: 'apunts', label: 'Apunts', icon: FileTextIcon }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeView === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveView(tab.id as 'aparador' | 'apunts')}
                                    className={`relative flex items-center justify-center gap-2 px-4 sm:px-6 h-9 md:h-10 rounded-full transition-all duration-300 text-[11px] sm:text-sm font-bold tracking-wide z-10 group hover:scale-[1.02] active:scale-[0.98] ${
                                        isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="community-active-tab"
                                            className="absolute inset-0 bg-white/[0.12] border border-white/[0.15] rounded-full z-[-1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.1),0_0_8px_rgba(255,255,255,0.05)]"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        >
                                            <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                                        </motion.div>
                                    )}
                                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={`transition-colors ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'group-hover:text-slate-200'}`} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </NavigationPill>
                </div>

                <AnimatePresence mode="wait">
                    {activeView === 'aparador' ? (
                        <motion.div 
                            key="aparador"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                        >


                {/* Toolbar */}
                <div className="sticky top-24 z-40 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                    {/* Left: Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button 
                            onClick={() => setActiveSubject('all')}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeSubject === 'all' ? 'bg-white text-black' : 'bg-transparent text-slate-400 hover:text-white border border-white/10 hover:border-white/30'}`}
                        >
                            Descobrir
                        </button>
                        
                        {SUBJECTS.slice(0, 4).map(subj => (
                            <button
                                key={subj.id}
                                onClick={() => setActiveSubject(subj.id)}
                                className={`hidden sm:block px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeSubject === subj.id ? 'bg-white text-black' : 'bg-transparent text-slate-400 hover:text-white border border-white/10 hover:border-white/30'}`}
                            >
                                {subj.label}
                            </button>
                        ))}
                        
                        <button 
                            onClick={() => setShowSubjectFilter(true)}
                            className="px-6 py-2.5 rounded-full text-sm font-bold bg-transparent text-slate-400 hover:text-white border border-white/10 hover:border-white/30 flex items-center gap-2"
                        >
                            Filtres
                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">
                                {SUBJECTS.length}
                            </div>
                        </button>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button className="w-11 h-11 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-slate-400 hover:text-white transition-colors bg-[#0a0a0a]">
                            <Search size={18} />
                        </button>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
                        >
                            <Plus size={18} />
                            <span>Pujar Visual</span>
                        </button>
                    </div>
                </div>

                {/* Feed (Masonry Style Grid) */}
                <div className="w-full">
                    <AnimatePresence mode='wait'>
                        {loading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex justify-center py-32"
                            >
                                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </motion.div>
                        ) : posts.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-32 text-slate-500"
                            >
                                <h3 className="font-bold text-3xl text-white mb-2 font-serif italic">Res per aquí... encara.</h3>
                                <p className="text-slate-400">Pensa en gran i puja la primera obra mestra.</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="feed"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8"
                            >
                                {posts.map((post, index) => {
                                    if (posts.length === index + 1) {
                                        return (
                                            <div ref={lastPostRef} key={post.id} onClick={() => setSelectedPost(post)} className="cursor-pointer">
                                                <PublicationCard post={post} />
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={post.id} onClick={() => setSelectedPost(post)} className="cursor-pointer">
                                            <PublicationCard post={post} />
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {loadingMore && (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="apunts"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <NotesView />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Modals */}
            <SubjectSelectorModal 
                isOpen={showSubjectFilter}
                onClose={() => setShowSubjectFilter(false)}
                onSelect={(id) => { setActiveSubject(id); setShowSubjectFilter(false); }}
                selectedId={activeSubject}
                allowAll={true}
            />

            <CreatePostModal 
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            {selectedPost && (
                <PostDetailModal 
                    post={selectedPost}
                    isOpen={!!selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </div>
    );
};

export default CommunityPage;

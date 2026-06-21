import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, where, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { CommunityPost } from '../types/community';
import PublicationCard from '../components/community/PublicationCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import SubjectSelectorModal from '../components/community/SubjectSelectorModal';
import { SUBJECTS } from '../config/subjects';
import CreatePostModal from '../components/community/CreatePostModal';
import PostDetailModal from '../components/community/PostDetailModal';
import NavigationPill from '../components/ui/NavigationPill';

const CommunityPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastVisible, setLastVisible] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);
    
    const [activeSubject, setActiveSubject] = useState('all');
    const [showSubjectFilter, setShowSubjectFilter] = useState(false);
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

    const handleUploadClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            setIsCreateOpen(true);
        }
    };

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
        <div className="w-full min-h-screen pt-12 pb-32 flex justify-center bg-[#050505] text-white overflow-x-hidden selection:bg-white selection:text-black">
            {/* Very subtle noise bg for texture, no heavy 3D */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-20 noise-bg" />

            <main className="w-full max-w-[1600px] px-6 sm:px-12 relative z-10">
                
                {/* Feed Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                >


                {/* High-Performance Sticky Header */}
                <div className="sticky top-6 sm:top-20 z-40 flex items-center justify-between gap-4 mb-8 py-3 px-2 sm:px-4 rounded-2xl bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                    {/* Left: Filter Pills */}
                    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
                        <button 
                            onClick={() => setActiveSubject('all')}
                            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeSubject === 'all' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Descobrir
                        </button>
                        
                        {SUBJECTS.slice(0, 4).map(subj => (
                            <button
                                key={subj.id}
                                onClick={() => setActiveSubject(subj.id)}
                                className={`shrink-0 hidden sm:block px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeSubject === subj.id ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                {subj.label}
                            </button>
                        ))}
                        
                        <button 
                            onClick={() => setShowSubjectFilter(true)}
                            className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-all"
                        >
                            Filtres
                            <span className="text-[10px] bg-white/10 px-1.5 rounded text-white">{SUBJECTS.length}</span>
                        </button>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                            <Search size={16} />
                        </button>
                        <button
                            onClick={handleUploadClick}
                            className="px-5 py-2 bg-white text-black hover:bg-slate-200 text-sm font-bold rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">Pujar Recurs</span>
                        </button>
                    </div>
                </div>

                {/* Feed (Masonry Style Grid) */}
                <div className="w-full mt-16 md:mt-24">
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
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center py-20 px-4 text-center"
                            >
                                <div className="w-full max-w-lg rounded-3xl p-10 sm:p-14 flex flex-col items-center bg-linear-to-b from-white/5 to-transparent border border-white/10 relative overflow-hidden group">
                                    {/* Ambient Glow */}
                                    <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none" />
                                    
                                    <div className="relative w-20 h-20 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                        <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-50 rounded-2xl pointer-events-none" />
                                        <FileTextIcon size={36} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                                    </div>
                                    
                                    <h3 className="font-bold text-3xl text-white mb-3 tracking-tight relative z-10">Encara no hi ha apunts</h3>
                                    <p className="text-slate-400 mb-10 max-w-sm text-sm leading-relaxed relative z-10">No hi ha cap recurs compartit per a aquesta matèria. Sigues el primer en aportar valor a la comunitat i destacar.</p>
                                    
                                    <button
                                        onClick={handleUploadClick}
                                        className="relative px-8 py-3.5 bg-white text-black hover:bg-slate-200 font-bold rounded-2xl transition-all hover:-translate-y-1 flex items-center gap-2 shadow-[0_10px_40px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.3)] z-10 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shine_3s_infinite]" />
                                        <Plus size={20} className="text-black" />
                                        Pujar el primer recurs
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-8">
                                {posts.map((post, index) => {
                                    const cardProps = {
                                        key: post.id,
                                        onClick: () => setSelectedPost(post),
                                        className: "w-full cursor-pointer",
                                    };

                                    if (posts.length === index + 1) {
                                        return (
                                            <div ref={lastPostRef} {...cardProps}>
                                                <PublicationCard post={post} />
                                            </div>
                                        );
                                    }
                                    return (
                                        <div {...cardProps}>
                                            <PublicationCard post={post} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </AnimatePresence>
                    
                    {loadingMore && (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                </div>
                </motion.div>
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

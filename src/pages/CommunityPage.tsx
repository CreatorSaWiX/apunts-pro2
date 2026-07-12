import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, where, limit, startAfter, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { CommunityPost } from '../types/community';
import PublicationCard from '../components/community/PublicationCard';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, FileText as FileTextIcon, BookOpen, Sparkles, X } from 'lucide-react';
import CommunityHero3D from '../components/community/CommunityHero3D';
import SubjectSelectorModal from '../components/community/SubjectSelectorModal';
import CreatePostModal from '../components/community/CreatePostModal';
import PostDetailModal from '../components/community/PostDetailModal';
import Spinner from '../components/ui/Spinner';
import { useSettings } from '../contexts/SettingsContext';
import { SUBJECTS } from '../config/subjects';
import { useTranslation } from 'react-i18next';

import LiquidDropdown from '../components/ui/glass/LiquidDropdown';
import { LiquidToolbar, LiquidToolbarButton } from '../components/ui/glass/LiquidToolbar';

const mockEpicPost: CommunityPost = {
    id: 'mock-epic',
    userId: 'system',
    username: 'AlexDev',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    content: 'Guia completa d\'Estructures de Dades. Arbres AVL i Grafs amb exemples en C++.',
    subject: 'pro2',
    type: 'resource',
    createdAt: Timestamp.now(),
    reactions: {'user1': {userId: 'user1', username: 'Bob', emoji: '❤️'}, 'user2': {userId: 'user2', username: 'Alice', emoji: '❤️'}},
    rank: 2,
    isPinned: false,
    views: 1240,
    attachments: [{ url: '', name: 'apunts_pro2_complets.pdf', type: 'application/pdf', size: 1024 }]
};

const mockLegendaryPost: CommunityPost = {
    id: 'mock-legendary',
    userId: 'system',
    username: 'Maria_UI',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    content: 'Resum interactiu de Fonaments d\'Ordinadors amb esquemes de circuits.',
    subject: 'm1',
    type: 'resource',
    createdAt: Timestamp.now(),
    reactions: {'u1': {userId:'1',username:'',emoji:'❤️'},'u2':{userId:'2',username:'',emoji:'❤️'},'u3':{userId:'3',username:'',emoji:'❤️'},'u4':{userId:'4',username:'',emoji:'❤️'},'u5':{userId:'5',username:'',emoji:'❤️'}},
    rank: 3,
    isPinned: true,
    views: 3500,
    attachments: [{ url: '', name: 'esquemes_m1.png', type: 'image/png', size: 1024, thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800' }]
};

const mockMythicPost: CommunityPost = {
    id: 'mock-mythic',
    userId: 'system',
    username: 'CreatorSaWiX',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sawix',
    content: 'Projecte Final: Simulador de Processadors. Codi font sencer i documentació.',
    subject: 'm2',
    type: 'resource',
    createdAt: Timestamp.now(),
    reactions: {'1':{userId:'1',username:'',emoji:'❤️'},'2':{userId:'2',username:'',emoji:'❤️'},'3':{userId:'3',username:'',emoji:'❤️'},'4':{userId:'4',username:'',emoji:'❤️'},'5':{userId:'5',username:'',emoji:'❤️'},'6':{userId:'6',username:'',emoji:'❤️'},'7':{userId:'7',username:'',emoji:'❤️'},'8':{userId:'8',username:'',emoji:'❤️'}},
    rank: 4,
    isPinned: true,
    views: 12500,
    attachments: [{ url: '', name: 'simulador_cpu.zip', type: 'application/zip', size: 1024 }]
};

const CommunityPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastVisible, setLastVisible] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);
    
    const [activeSubject, setActiveSubject] = useState<string>('all');
    const [showSubjectFilter, setShowSubjectFilter] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
    const { customSubjectColors } = useSettings();

    // New Filter States
    const [showRarityFilter, setShowRarityFilter] = useState(false);
    const [activeRank, setActiveRank] = useState<number | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    // Hero 3D Showcase State
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Offline state
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const heroWords = [t('hero.word1', "el curs."), t('hero.word2', "el semestre."), t('hero.word3', "la carrera.")];
    const [heroWordIndex, setHeroWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setHeroWordIndex((prev) => (prev + 1) % heroWords.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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
        if (isOffline) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setHasMore(true);
        setPosts([]);
        
        const currentLimit = debouncedSearch ? 100 : POSTS_PER_PAGE;
        
        let q = query(
            collection(db, 'community_posts'),
            orderBy('isPinned', 'desc'),
            orderBy('createdAt', 'desc'),
            limit(currentLimit)
        );

        if (activeSubject !== 'all') {
            q = query(q, where('subject', '==', activeSubject));
        }

        if (activeRank !== null) {
            q = query(q, where('rank', '==', activeRank));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let rawPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CommunityPost[];
            
            if (debouncedSearch.trim()) {
                const lowerQ = debouncedSearch.toLowerCase();
                rawPosts = rawPosts.filter(p => 
                    p.content.toLowerCase().includes(lowerQ) || 
                    (p.username && p.username.toLowerCase().includes(lowerQ)) ||
                    (p.attachments && p.attachments.some(a => a.name.toLowerCase().includes(lowerQ)))
                );
            }

            setPosts(rawPosts);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === currentLimit);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [activeSubject, activeRank, debouncedSearch, isOffline]);

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore || !lastVisible || isOffline) return;
        setLoadingMore(true);

        const currentLimit = debouncedSearch ? 100 : POSTS_PER_PAGE;

        let q = query(
            collection(db, 'community_posts'),
            orderBy('isPinned', 'desc'),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(currentLimit)
        );

        if (activeSubject !== 'all') {
            q = query(q, where('subject', '==', activeSubject));
        }

        if (activeRank !== null) {
            q = query(q, where('rank', '==', activeRank));
        }

        const snapshot = await getDocs(q);
        let newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CommunityPost[];

        if (debouncedSearch.trim()) {
            const lowerQ = debouncedSearch.toLowerCase();
            newPosts = newPosts.filter(p => 
                p.content.toLowerCase().includes(lowerQ) || 
                (p.username && p.username.toLowerCase().includes(lowerQ)) ||
                (p.attachments && p.attachments.some(a => a.name.toLowerCase().includes(lowerQ)))
            );
        }

        setPosts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
            return [...prev, ...uniqueNewPosts];
        });
        setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === currentLimit);
        setLoadingMore(false);
    }, [loadingMore, hasMore, lastVisible, activeSubject, activeRank, debouncedSearch, isOffline]);

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
        <div className="w-full min-h-screen pb-32 flex flex-col items-center text-white overflow-x-hidden selection:bg-primary selection:text-black relative">

            {/* Awwwards Hero Section */}
            <section className="relative w-full min-h-[55vh] flex items-center justify-center z-10 overflow-hidden pt-28 pb-8">
                <CommunityHero3D />
                
                <div className="w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center relative z-20">
                    {/* Left Text */}
                    <div className="flex flex-col items-start text-left mt-4 lg:mt-0">
                        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black mb-6 tracking-tighter flex flex-col items-start leading-[0.95] md:leading-[0.9]">
                            <motion.span 
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                                className="text-white drop-shadow-2xl"
                            >{t('hero.superem', 'Superem')}</motion.span>
                            <motion.span 
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                className="text-slate-300 drop-shadow-xl"
                            >{t('hero.junts', 'junts')}</motion.span>
                            
                            {/* Dynamic Word container */}
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                                className="h-[1.2em] relative w-full flex items-center justify-start overflow-visible mt-1"
                            >
                                <AnimatePresence mode="popLayout">
                                    <motion.span
                                        key={heroWordIndex}
                                        initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
                                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                                        exit={{ y: -30, opacity: 0, filter: 'blur(8px)' }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] absolute left-0 py-2 drop-shadow-lg whitespace-nowrap"
                                    >
                                        {heroWords[heroWordIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.div>
                        </h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                            className="text-slate-400 text-base md:text-lg font-medium max-w-xl mb-8 leading-relaxed"
                        >
                            {t('hero.subtitle', "Comparteix els teus recursos, troba els millors apunts i ajuda als teus companys. Perquè aquí l'èxit és col·lectiu i ")}<span className="text-white font-bold">{t('hero.nobodyBehind', 'no deixem a ningú enrere')}</span>.
                        </motion.p>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                        >
                            <button type="button"
                                onClick={handleUploadClick}
                                className="group relative px-8 py-4 bg-[var(--glass-bg)] backdrop-blur-3xl backdrop-saturate-150 border border-[var(--glass-border)] border-t-[var(--glass-border-light)] border-l-[var(--glass-border-light)] shadow-[var(--glass-shadow-inner),0_0_40px_rgba(255,255,255,0.05)] text-white font-bold text-lg rounded-full flex items-center gap-3 transition-all duration-500 hover:bg-white hover:text-black hover:border-white hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-accent/20 to-primary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out opacity-0 group-hover:opacity-100" />
                                <Plus size={20} className="transition-transform group-hover:rotate-90 duration-300 relative z-10" />
                                <span className="relative z-10">{t('hero.uploadResource', 'Pujar Recurs')}</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Visuals (Floating Cards Showcase - Awwwards Style) */}
                    <div 
                        className="hidden lg:flex relative h-[450px] w-full items-center justify-center perspective-[1200px]"
                    >
                        <div className="relative w-full h-full max-w-[550px]">
                            {/* Decorational backglow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] rounded-full pointer-events-none" />
                            
                            {/* Orchestrated Animations Setup */}
                            {[
                                { id: 0, align: 'left', post: mockEpicPost, glow: 'bg-purple-500/20' },
                                { id: 1, align: 'right', post: mockLegendaryPost, glow: 'bg-amber-500/20' },
                                { id: 2, align: 'center', post: mockMythicPost, glow: 'bg-linear-to-r from-rose-500/30 via-purple-500/30 to-cyan-500/30' }
                            ].map((card) => {
                                const isHovered = hoveredCard === card.id;
                                const isOtherHovered = hoveredCard !== null && hoveredCard !== card.id;
                                
                                // Simpler algorithmic calculation instead of hardcoded objects
                                const animateState = {
                                    x: isHovered 
                                        ? (card.align === 'left' ? -140 : card.align === 'right' ? 140 : 0)
                                        : isOtherHovered 
                                            ? (card.align === 'left' ? -50 : card.align === 'right' ? 50 : 0)
                                            : (card.align === 'left' ? -90 : card.align === 'right' ? 90 : 0),
                                    y: isHovered
                                        ? (card.align === 'center' ? -10 : card.align === 'left' ? -40 : -50)
                                        : isOtherHovered
                                            ? (card.align === 'center' ? 35 : card.align === 'left' ? -10 : -20)
                                            : (card.align === 'center' ? 15 : card.align === 'left' ? -20 : -30),
                                    rotateZ: isHovered
                                        ? (card.align === 'left' ? -2 : card.align === 'right' ? 2 : 0)
                                        : isOtherHovered
                                            ? (card.align === 'left' ? -12 : card.align === 'right' ? 12 : 0)
                                            : (card.align === 'left' ? -8 : card.align === 'right' ? 8 : 0),
                                    rotateY: isHovered ? 0 : (card.align === 'left' ? 15 : card.align === 'right' ? -15 : 0),
                                    scale: isHovered
                                        ? (card.align === 'center' ? 1.15 : 1.05)
                                        : isOtherHovered
                                            ? (card.align === 'center' ? 0.85 : 0.75)
                                            : (card.align === 'center' ? 1 : 0.85),
                                    zIndex: isHovered ? 50 : (card.align === 'center' ? 20 : 10),
                                    opacity: isHovered ? 1 : isOtherHovered ? (card.align === 'center' ? 0.6 : 0.4) : (card.align === 'center' ? 1 : 0.9),
                                    filter: isHovered ? 'blur(0px)' : isOtherHovered ? (card.align === 'center' ? 'blur(2px)' : 'blur(4px)') : 'blur(0px)',
                                };

                                return (
                                    <motion.div 
                                        key={card.id}
                                        animate={animateState}
                                        transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
                                        onMouseEnter={() => setHoveredCard(card.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer origin-center ${card.align === 'center' ? 'w-[300px]' : card.align === 'right' ? 'w-[260px]' : 'w-[240px]'}`}
                                    >
                                        <motion.div
                                            animate={{ y: hoveredCard === null ? [0, card.align === 'center' ? -12 : -8, 0] : 0 }}
                                            transition={{ duration: card.align === 'center' ? 5 : 4, repeat: Infinity, ease: "easeInOut", delay: card.id * 0.5 }}
                                        >
                                            <div className={`absolute ${card.align === 'center' ? '-inset-10 blur-[50px]' : '-inset-8 blur-[40px]'} rounded-full pointer-events-none transition-opacity duration-700 ${card.glow} ${isHovered ? 'opacity-100' : (hoveredCard === null && card.align === 'center' ? 'opacity-50' : 'opacity-0')}`} />
                                            <div className="relative"><PublicationCard post={card.post} isHeroMode={true} /></div>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </section>

            <main className="w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 relative z-10">
                
                {/* Floating Glassmorphic Pill Filter (Awwwards Style) */}
                <LiquidToolbar delay={0.5}>
                    {/* Assignatures */}
                    <LiquidToolbarButton 
                        key="assignatures"
                        onClick={() => setShowSubjectFilter(true)}
                        active={activeSubject !== 'all'}
                    >
                        <BookOpen size={16} />
                        <span className="hidden sm:inline">{t('community.subjects', 'Assignatures')}</span>
                        <span className="sm:hidden">{t('community.subjectsShort', 'Assig.')}</span>
                        {activeSubject !== 'all' && <span className="ml-1 text-[10px] bg-black/20 text-current px-1.5 py-0.5 rounded-md uppercase">{activeSubject}</span>}
                    </LiquidToolbarButton>
                    
                    <div key="divider-1" className="w-px h-6 bg-white/10 mx-1" />

                    {/* Raresa */}
                    <div key="raresa" className="relative">
                        <LiquidToolbarButton
                            onClick={() => setShowRarityFilter(!showRarityFilter)}
                            active={activeRank !== null}
                        >
                            <Sparkles size={16} />
                            <span className="hidden sm:inline">{t('community.rarity', 'Raresa')}</span>
                            <span className="sm:hidden">{t('community.rarityShort', 'Rar.')}</span>
                            {activeRank !== null && <span className="ml-1 text-[10px] bg-primary/20 text-current px-1.5 py-0.5 rounded-md uppercase">Lv.{activeRank}</span>}
                        </LiquidToolbarButton>

                        {/* Raresa Dropdown */}
                        <AnimatePresence>
                            {showRarityFilter && (
                                <LiquidDropdown 
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 origin-bottom z-50 w-44"
                                    panelClassName="p-2 flex flex-col gap-1"
                                >
                                    <button type="button" 
                                        onClick={() => { setActiveRank(null); setShowRarityFilter(false); }}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold text-left transition-colors ${activeRank === null ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {t('community.anyRarity', 'Qualsevol raresa')}
                                    </button>
                                    {[0, 1, 2, 3, 4].map(rank => (
                                        <button type="button"
                                            key={rank}
                                            onClick={() => { setActiveRank(rank); setShowRarityFilter(false); }}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold text-left transition-colors flex items-center justify-between group ${activeRank === rank ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <span>{['Normal', 'Featured', 'Epic', 'Legendary', 'Mythic'][rank]}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeRank === rank ? 'bg-primary/30 text-primary' : 'bg-white/10 text-slate-400 group-hover:text-white'}`}>Lv.{rank}</span>
                                        </button>
                                    ))}
                                </LiquidDropdown>
                            )}
                        </AnimatePresence>
                    </div>

                    <div key="divider-2" className="w-px h-6 bg-white/10 mx-1" />

                    {/* Buscar */}
                    <div key="buscar" className={`flex items-center transition-all duration-500 overflow-hidden ${isSearchOpen || searchQuery ? 'w-[180px] sm:w-[280px] ml-1' : 'w-10 ml-0'}`}>
                        <button type="button" 
                            onClick={() => {
                                if (isSearchOpen && !searchQuery) setIsSearchOpen(false);
                                else setIsSearchOpen(true);
                            }}
                            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSearchOpen || searchQuery ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                            title={t('community.search', 'Buscar')}
                        >
                            <Search size={18} />
                        </button>
                        
                        <div className="flex-1 relative h-10 flex items-center">
                            <input 
                                autoFocus={isSearchOpen}
                                type="text"
                                placeholder={t('community.searchPlaceholder', 'Cerca apunts...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="absolute inset-0 w-full h-full bg-transparent text-white text-sm font-medium focus:outline-none pl-2 pr-8 placeholder:text-slate-600"
                            />
                            {(searchQuery || isSearchOpen) && (
                                <button type="button" 
                                    onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                                    className="absolute right-2 p-1 text-slate-500 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </LiquidToolbar>

                {/* Feed Section */}
                <div className="w-full">
                    <AnimatePresence mode='wait'>
                        {loading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex justify-center py-32"
                            >
                                <Spinner 
                                    size="2xl" 
                                    variant={
                                        activeSubject !== 'all' 
                                            ? customSubjectColors[SUBJECTS.find(s => s.id === activeSubject)?.label || ''] || SUBJECTS.find(s => s.id === activeSubject)?.color || 'primary'
                                            : 'primary'
                                    } 
                                />
                            </motion.div>
                        ) : isOffline ? (
                            <motion.div 
                                key="offline"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center py-20 px-4 text-center"
                            >
                                <div className="w-full max-w-lg rounded-3xl p-10 sm:p-14 flex flex-col items-center bg-linear-to-b from-red-500/5 to-transparent border border-red-500/10 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full group-hover:bg-red-500/10 transition-colors duration-700 pointer-events-none" />
                                    
                                    <div className="relative w-20 h-20 bg-black/50 backdrop-blur-xl border border-red-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                        <div className="absolute inset-0 bg-linear-to-br from-red-500/10 to-transparent opacity-50 rounded-2xl pointer-events-none" />
                                        <div className="relative text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l20 20"/><path d="M8.53 8.53C5.58 9.5 3 11 3 11l3.5 4.5"/><path d="M14.12 14.12A12.53 12.53 0 0 1 12 14c-1.3 0-2.58.19-3.8.53"/><path d="M21 11s-1.87-1.3-4.5-2.2"/><path d="M12 20h.01"/></svg>
                                        </div>
                                    </div>
                                    
                                    <h3 className="font-bold text-3xl text-white mb-3 tracking-tight relative z-10">{t('community.offlineTitle', 'Sense connexió')}</h3>
                                    <p className="text-slate-400 max-w-sm text-sm leading-relaxed relative z-10">{t('community.offlineSubtitle', 'Actualment estàs offline. Per consultar els recursos de la comunitat o pujar-ne un de nou cal que et connectis a Internet.')}</p>
                                </div>
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
                                    
                                    <h3 className="font-bold text-3xl text-white mb-3 tracking-tight relative z-10">{t('community.emptyTitle', 'Encara no hi ha apunts')}</h3>
                                    <p className="text-slate-400 mb-10 max-w-sm text-sm leading-relaxed relative z-10">{t('community.emptySubtitle', 'No hi ha cap recurs compartit per a aquesta matèria. Sigues el primer en aportar valor a la comunitat i destacar.')}</p>
                                    
                                    <button type="button"
                                        onClick={handleUploadClick}
                                        className="relative px-8 py-3.5 bg-white text-black hover:bg-slate-200 font-bold rounded-2xl transition-all hover:-translate-y-1 flex items-center gap-2 shadow-[0_10px_40px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.3)] z-10 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shine_3s_infinite]" />
                                        <Plus size={20} className="text-black" />
                                        {t('community.uploadFirst', 'Pujar el primer recurs')}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-8">
                                {posts.map((post, index) => {
                                    const cardProps = {
                                        onClick: () => setSelectedPost(post),
                                        className: "w-full cursor-pointer",
                                    };
                                    
                                    const cardContent = (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: (index % 10) * 0.05 }}
                                        >
                                            <PublicationCard post={post} />
                                        </motion.div>
                                    );

                                    if (posts.length === index + 1) {
                                        return (
                                            <div key={post.id} ref={lastPostRef} {...cardProps}>
                                                {cardContent}
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={post.id} {...cardProps}>
                                            {cardContent}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </AnimatePresence>
                    
                    {loadingMore && (
                        <div className="flex justify-center py-10">
                            <Spinner 
                                size="lg" 
                                variant={
                                    activeSubject !== 'all' 
                                        ? customSubjectColors[SUBJECTS.find(s => s.id === activeSubject)?.label || ''] || SUBJECTS.find(s => s.id === activeSubject)?.color || 'white'
                                        : 'white'
                                } 
                            />
                        </div>
                    )}
                </div>
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
                    post={posts.find(p => p.id === selectedPost.id) || selectedPost}
                    isOpen={!!selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </div>
    );
};

export default CommunityPage;

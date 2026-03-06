import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useSubject } from '../contexts/SubjectContext';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ArrowLeft, LogIn } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const LazyNavigationMenu = lazy(() => import('./NavigationMenu'));

const Navigation: React.FC = () => {
    const { subject, theme } = useSubject();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        let unsubscribe = () => { };

        // Import Firestore dynamically to avoid blocking the main bundle FCP
        Promise.all([
            import('firebase/firestore'),
            import('../lib/firebase')
        ]).then(([{ collection, query, where, onSnapshot }, { db }]) => {
            const q = query(
                collection(db, 'messages'),
                where('receiverId', '==', user.id),
                where('read', '==', false)
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                setUnreadCount(snapshot.size);
            });
        }).catch(err => console.error("Failed to load firestore in navigation", err));

        return () => { unsubscribe() };
    }, [user]);

    // Mobile Navbar states
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isPillExpanded, setIsPillExpanded] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    // Track scroll and window size for mobile navbar behaviour
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 40;
            setIsScrolled(scrolled);
            if (!scrolled) setIsPillExpanded(false);
        };
        const handleResize = () => setIsMobile(window.innerWidth < 768);

        handleScroll();
        handleResize();

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Handle click outside to close expanded pill on mobile
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsPillExpanded(false);
            }
        };
        if (isPillExpanded && isMobile) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isPillExpanded, isMobile]);

    // Close on navigation
    useEffect(() => {
        setIsPillExpanded(false);
    }, [location.pathname]);

    const showCompact = isMobile && isScrolled && !isPillExpanded;

    return (
        <>
            {/* Top-Left Floating Navigation Pill */}
            <div ref={navRef} className={`nav-pill-container fixed top-5 md:top-6 z-50 transition-all duration-300 ease-out ${showCompact ? 'left-0' : 'left-4 sm:left-6'}`}>
                {showCompact ? (
                    <button
                        onClick={() => setIsPillExpanded(true)}
                        className="flex flex-col gap-1 items-center justify-center p-2.5 py-3 bg-slate-900/90 backdrop-blur-xl border border-white/10 border-l-0 rounded-r-xl shadow-[5px_5px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-slate-800 group"
                        title="Expandir Navegació"
                    >
                        <div className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-emerald-400 transition-colors"></div>
                        <div className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-emerald-400 transition-colors"></div>
                        <div className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-emerald-400 transition-colors"></div>
                    </button>
                ) : (
                    <div className="flex items-center p-1.5 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all hover:bg-slate-900/80">

                        {location.pathname !== '/' && (
                            <>
                                <Link
                                    to="/"
                                    className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                                    title="Tornar a l'Inici"
                                >
                                    <ArrowLeft size={20} />
                                </Link>
                                <div className="w-px h-5 bg-white/10 mx-1" />
                            </>
                        )}

                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                            title="Obrir Menú"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="w-px h-5 bg-white/10 mx-1" />

                        {user ? (
                            <Link
                                to="/profile"
                                className="p-1.5 pr-3 rounded-full flex items-center gap-2 hover:bg-white/5 transition-colors relative"
                                title="El meu perfil"
                            >
                                <div className="relative">
                                    <img src={user.avatar} alt={user.username} className="w-7 h-7 rounded-full bg-slate-800 border border-white/10" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 shadow-sm" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-slate-300 hidden sm:inline">{user.username}</span>
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="p-2.5 rounded-full text-slate-400 hover:text-sky-400 hover:bg-white/5 transition-colors"
                                title="Iniciar Sessió"
                            >
                                <LogIn size={20} />
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Menu Drawer - Slides from LEFT */}
            <AnimatePresence>
                {isMenuOpen && (
                    <Suspense fallback={null}>
                        <LazyNavigationMenu
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                            subject={subject}
                            theme={theme}
                        />
                    </Suspense>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navigation;

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useSubject } from '../contexts/SubjectContext';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ArrowLeft, LogIn } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LazyNavigationMenu = lazy(() => import('./NavigationMenu'));

const Navigation: React.FC = () => {
    const { subject, theme } = useSubject();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();
    const { user } = useAuth();
    const { preferredLang, setPreferredLang } = useLanguage();

    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            return;
        }
        let isMounted = true;
        let unsubscribe = () => { };

        // Import Firestore dynamically to avoid blocking the main bundle FCP
        Promise.all([
            import('firebase/firestore'),
            import('../lib/firebase')
        ]).then(([{ collection, query, where, onSnapshot }, { db }]) => {
            if (!isMounted) return;

            const q = query(
                collection(db, 'messages'),
                where('receiverId', '==', user.id),
                where('read', '==', false)
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                setUnreadCount(snapshot.size);
            });
        }).catch(err => console.error("Failed to load firestore in navigation", err));

        return () => {
            isMounted = false;
            unsubscribe();
        };
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
                        className={`flex flex-col gap-1 items-center justify-center p-2.5 py-3 border border-white/10 border-l-0 rounded-r-xl shadow-[5px_5px_15px_rgba(0,0,0,0.5)] transition-all group ${isMobile ? 'bg-slate-900 pb-safe' : 'bg-slate-900/90 backdrop-blur-xl hover:bg-slate-800'}`}
                        title="Expandir Navegació"
                    >
                        <div className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-emerald-400 transition-colors"></div>
                        <div className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-emerald-400 transition-colors"></div>
                        <div className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-emerald-400 transition-colors"></div>
                    </button>
                ) : (
                    <div className={`flex items-center p-1.5 border border-white/10 rounded-full shadow-2xl transition-all ${isMobile ? 'bg-slate-900 shadow-xl' : 'bg-slate-900/60 backdrop-blur-xl hover:bg-slate-900/80'}`}>

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

                        {/* <Link
                            to="/comunitat"
                            className={`p-2.5 rounded-full transition-colors ${location.pathname === '/comunitat' ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            title="Comunitat"
                        >
                            <Users size={20} />
                        </Link> */}

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

            {/* Bottom-Left Floating Language Selector - Grayscale High Contrast */}
            {location.pathname === '/' && (
                <div className={`hidden md:block nav-pill-container fixed bottom-5 md:bottom-6 z-50 transition-all duration-300 ease-out left-4 sm:left-6 ${showCompact ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}`}>
                    <div className={`flex items-center p-1 border border-white/10 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all relative ${isMobile ? 'bg-slate-900' : 'bg-slate-900/80 backdrop-blur-xl hover:bg-slate-900/90 hover:border-white/20'}`}>
                        {/* CSS Slider Pill */}
                        <div
                            className={`absolute left-1 top-1 bottom-1 w-9 md:w-10 bg-linear-to-br from-white to-slate-400 rounded-full border border-white/20 shadow-md transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0 ${preferredLang === 'es' ? 'translate-x-full' : 'translate-x-0'
                                }`}
                        />

                        <button
                            onClick={() => setPreferredLang('ca')}
                            className={`relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-[11px] md:text-xs font-black transition-colors duration-300 z-10 ${preferredLang === 'ca' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                            title="Català"
                        >
                            CA
                        </button>
                        <button
                            onClick={() => setPreferredLang('es')}
                            className={`relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-[11px] md:text-xs font-black transition-colors duration-300 z-10 ${preferredLang === 'es' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                            title="Castellano"
                        >
                            ES
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navigation;

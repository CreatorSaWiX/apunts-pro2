import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useSubject } from '../contexts/SubjectContext';
import { Link, useLocation } from 'react-router-dom';
import { Users, Home, LogIn, CalendarDays, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
// import { useLanguage } from '../contexts/LanguageContext';
import NavigationPill from './ui/NavigationPill';

const LazyNavigationMenu = lazy(() => import('./NavigationMenu'));

// --- Helper Components for Awwwards-grade Navigation ---

const TooltipItem = ({ children, text, disabled = false, tooltipPosition = "bottom" }: { children: React.ReactNode, text?: string, disabled?: boolean, tooltipPosition?: "top" | "bottom" }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const tooltipYOffset = tooltipPosition === "bottom" ? 10 : -10;
    const tooltipPositionClass = tooltipPosition === "bottom" 
        ? "top-[calc(100%+8px)]" 
        : "bottom-[calc(100%+8px)]";

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative flex items-center justify-center z-10"
        >
            {children}
            {text && !disabled && (
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: tooltipYOffset, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: tooltipYOffset, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={`absolute ${tooltipPositionClass} left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-[#0F172A]/90 backdrop-blur-md text-slate-200 text-xs font-semibold rounded-lg whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10 z-[100] pointer-events-none`}
                        >
                            {text}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

const NavLinkItem = ({ to, icon: Icon, children, label, isActive, text, className }: { to: string, icon?: any, children?: React.ReactNode, label: string, isActive: boolean, text?: string, className?: string }) => {
    return (
        <TooltipItem text={label}>
            <Link
                to={to}
                className={`group relative flex items-center justify-center rounded-full transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'} ${className || 'w-9 h-9 md:w-10 md:h-10'}`}
            >
                {isActive && (
                    <motion.div
                        layoutId="main-nav-active"
                        className="absolute inset-0 bg-white/10 rounded-full z-[-1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    >
                        <div className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                    </motion.div>
                )}
                <motion.div 
                    whileHover={{ scale: 1.15, rotate: Icon === Settings ? 45 : 0 }} 
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    {Icon ? <Icon size={20} /> : children}
                </motion.div>
                {text && <span className="text-sm font-medium hidden sm:inline">{text}</span>}
            </Link>
        </TooltipItem>
    );
};

const Navigation: React.FC = () => {
    const { subject, theme } = useSubject();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();
    const { user } = useAuth();
    // const { preferredLang, setPreferredLang } = useLanguage();

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
    const [isMobile, setIsMobile] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    // Track window size for mobile navbar behaviour
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* Main Floating Navigation Pill (Bottom on Mobile, Top-Left on Desktop) */}
            <div ref={navRef} className={`nav-pill-container fixed z-50 transition-all duration-300 ease-out bottom-6 md:bottom-auto md:top-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 w-[max-content]`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <NavigationPill className={`!p-1.5 ${isMobile ? 'bg-[#0F172A]/90 shadow-[0_10px_40px_rgba(0,0,0,0.8)]' : ''}`}>

                            <NavLinkItem 
                                to="/" 
                                icon={Home} 
                                label="Inici" 
                                isActive={location.pathname === '/'} 
                            />
                            <NavLinkItem 
                                to="/comunitat" 
                                icon={Users} 
                                label="Comunitat" 
                                isActive={location.pathname === '/comunitat'} 
                            />
                            <NavLinkItem 
                                to="/planner" 
                                icon={CalendarDays} 
                                label="Planificador" 
                                isActive={location.pathname === '/planner'} 
                            />
                            <NavLinkItem 
                                to="/settings" 
                                icon={Settings} 
                                label="Configuració" 
                                isActive={location.pathname === '/settings'} 
                            />

                            <div className="w-px h-5 bg-white/10 mx-1" />

                            {user ? (
                                <NavLinkItem
                                    to="/profile"
                                    label="El meu perfil"
                                    isActive={location.pathname === '/profile'}
                                    text={user.username}
                                    className="h-9 md:h-10 pl-1.5 pr-3 md:pl-2 md:pr-4 gap-2"
                                >
                                    <div className="relative flex items-center justify-center">
                                        <img src={user.avatar} alt={user.username} className="w-7 h-7 rounded-full bg-slate-800 border border-white/20 shadow-sm object-cover" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 shadow-sm" />
                                        )}
                                    </div>
                                </NavLinkItem>
                            ) : (
                                <NavLinkItem
                                    to="/login"
                                    icon={LogIn}
                                    label="Iniciar Sessió"
                                    isActive={location.pathname === '/login'}
                                />
                            )}
                        </NavigationPill>
                    </motion.div>
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

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useSubject } from '../contexts/SubjectContext';
import { Link, useLocation } from 'react-router-dom';
import { Users, Home, LogIn, CalendarDays, Settings } from 'lucide-react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
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
                className={`group relative flex items-center justify-center rounded-full transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'} ${className || 'h-11 md:w-10 md:h-10'} ${!className ? (isActive ? 'w-auto px-4 md:px-0 md:w-10' : 'w-11 md:w-10') : ''}`}
            >
                {isActive && (
                    <motion.div
                        layoutId="main-nav-active"
                        className="absolute inset-0 bg-white/[0.12] border border-white/[0.15] rounded-full z-[-1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.1),0_0_8px_rgba(255,255,255,0.05)]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                        <div className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                    </motion.div>
                )}
                <motion.div 
                    whileHover={{ scale: 1.15, rotate: Icon === Settings ? 45 : 0 }} 
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="flex items-center justify-center"
                >
                    {Icon ? <Icon size={isActive ? 20 : 22} className={`transition-all duration-500 md:w-5 md:h-5 ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'group-hover:text-slate-200'}`} /> : children}
                    
                    <AnimatePresence mode="popLayout">
                        {isActive && !text && Icon && (
                            <motion.span 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className="text-[13px] font-bold tracking-wide whitespace-nowrap overflow-hidden md:hidden shrink-0 block ml-2"
                            >
                                {label}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.div>
                {text && <span className="text-[13px] font-bold tracking-wide hidden md:inline ml-2">{text}</span>}
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
    const { t } = useTranslation();

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
            <div ref={navRef} className={`nav-pill-container fixed z-50 transition-all duration-300 ease-out bottom-4 md:bottom-auto md:top-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 w-[calc(100%-2rem)] max-w-[400px] md:w-[max-content] md:max-w-none`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-full"
                >
                    <NavigationPill className={`!p-2 md:!p-1.5 ${isMobile ? '!bg-[#0B1120]/85 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] w-full justify-between px-3 md:px-2' : 'w-[max-content] justify-start'}`}>

                            <NavLinkItem 
                                to="/" 
                                icon={Home} 
                                label={t('nav.home', 'Inici')} 
                                isActive={location.pathname === '/'} 
                            />
                            <NavLinkItem 
                                to="/comunitat" 
                                icon={Users} 
                                label={t('nav.community', 'Comunitat')} 
                                isActive={location.pathname === '/comunitat'} 
                            />
                            <NavLinkItem 
                                to="/planner" 
                                icon={CalendarDays} 
                                label={t('nav.planner', 'Planificador')} 
                                isActive={location.pathname === '/planner'} 
                            />
                            <NavLinkItem 
                                to="/settings" 
                                icon={Settings} 
                                label={t('nav.settings', 'Configuració')} 
                                isActive={location.pathname === '/settings'} 
                            />

                            <div className="hidden md:block w-px h-5 bg-white/10 mx-1" />

                            {user ? (
                                <NavLinkItem
                                    to="/profile"
                                    label={t('nav.profile', 'El meu perfil')}
                                    isActive={location.pathname === '/profile'}
                                    text={user.username}
                                    className={`h-11 md:h-10 pl-1.5 pr-4 md:pl-1.5 md:pr-4 transition-all duration-300 ${location.pathname === '/profile' ? 'w-auto' : 'w-auto'}`}
                                >
                                    <div className="relative flex items-center justify-center shrink-0">
                                        <img src={user.avatar} alt={user.username} className={`rounded-full bg-slate-800 border-2 shadow-sm object-cover transition-all duration-500 ${location.pathname === '/profile' ? 'w-7 h-7 border-primary shadow-[0_0_10px_rgba(56,189,248,0.5)] md:w-7 md:h-7 md:border-white/20' : 'w-8 h-8 border-white/20 md:w-7 md:h-7'}`} loading="lazy" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-3 md:h-3 bg-rose-500 rounded-full border-2 border-[#0F172A] shadow-sm animate-pulse" />
                                        )}
                                    </div>
                                    <AnimatePresence mode="popLayout">
                                        {location.pathname === '/profile' && (
                                            <motion.span 
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                className="text-[13px] font-bold tracking-wide whitespace-nowrap overflow-hidden md:hidden ml-1"
                                            >
                                                {user.username}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </NavLinkItem>
                            ) : (
                                <NavLinkItem
                                    to="/login"
                                    icon={LogIn}
                                    label={t('nav.login', 'Iniciar Sessió')}
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

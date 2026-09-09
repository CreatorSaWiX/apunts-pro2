import { useState, useEffect, useMemo, lazy, Suspense, memo } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Timestamp } from 'firebase/firestore';
import type { CommunityPost } from '../../../types/community';
import PublicationCard from '../PublicationCard';

const CommunityHero3D = lazy(() => import('../CommunityHero3D'));

/* ==========================================================================
   Publicacions de demostració (Mocks per a l'aparador 3D)
   ========================================================================== */

const mockEpicPost: CommunityPost = {
    id: 'mock-epic',
    userId: 'system',
    username: 'AlexDev',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    content: "Guia completa d'Estructures de Dades. Arbres AVL i Grafs amb exemples en C++.",
    subject: 'pro2',
    createdAt: new Timestamp(Math.floor(Date.now() / 1000), 0),
    reactions: { 'user1': { userId: 'user1', username: 'Bob', emoji: '❤️' }, 'user2': { userId: 'user2', username: 'Alice', emoji: '❤️' } },
    isPinned: false,
    views: 1240,
    attachments: [{ url: '', name: 'apunts_pro2_complets.pdf', type: 'application/pdf', size: 1024 }]
};

const mockLegendaryPost: CommunityPost = {
    id: 'mock-legendary',
    userId: 'system',
    username: 'Maria_UI',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    content: "Resum interactiu de Fonaments d'Ordinadors amb esquemes de circuits.",
    subject: 'm1',
    createdAt: new Timestamp(Math.floor(Date.now() / 1000), 0),
    reactions: { 'u1': { userId: '1', username: '', emoji: '❤️' }, 'u2': { userId: '2', username: '', emoji: '❤️' }, 'u3': { userId: '3', username: '', emoji: '❤️' }, 'u4': { userId: '4', username: '', emoji: '❤️' }, 'u5': { userId: '5', username: '', emoji: '❤️' } },
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
    createdAt: new Timestamp(Math.floor(Date.now() / 1000), 0),
    reactions: { '1': { userId: '1', username: '', emoji: '❤️' }, '2': { userId: '2', username: '', emoji: '❤️' }, '3': { userId: '3', username: '', emoji: '❤️' }, '4': { userId: '4', username: '', emoji: '❤️' }, '5': { userId: '5', username: '', emoji: '❤️' }, '6': { userId: '6', username: '', emoji: '❤️' }, '7': { userId: '7', username: '', emoji: '❤️' }, '8': { userId: '8', username: '', emoji: '❤️' } },
    isPinned: true,
    views: 12500,
    attachments: [{ url: '', name: 'simulador_cpu.zip', type: 'application/zip', size: 1024 }]
};

interface HeroShowcaseCard {
    id: number;
    align: 'left' | 'right' | 'center';
    post: CommunityPost;
    glow: string;
    widthClass: string;
}

const HERO_SHOWCASE_CARDS: readonly HeroShowcaseCard[] = [
    { id: 0, align: 'left', post: mockEpicPost, glow: 'bg-purple-500/20', widthClass: 'w-60' },
    { id: 1, align: 'right', post: mockLegendaryPost, glow: 'bg-amber-500/20', widthClass: 'w-65' },
    { id: 2, align: 'center', post: mockMythicPost, glow: 'bg-linear-to-r from-rose-500/30 via-purple-500/30 to-cyan-500/30', widthClass: 'w-75' }
] as const;

/* ==========================================================================
   Funció pura per calcular l'estat de transformació de les targetes 3D
   ========================================================================== */

function getHeroCardAnimation(
    align: 'left' | 'right' | 'center',
    isHovered: boolean,
    isOtherHovered: boolean
) {
    if (isHovered) {
        return {
            x: align === 'left' ? -140 : align === 'right' ? 140 : 0,
            y: align === 'center' ? -10 : align === 'left' ? -40 : -50,
            rotateZ: align === 'left' ? -2 : align === 'right' ? 2 : 0,
            rotateY: 0,
            scale: align === 'center' ? 1.15 : 1.05,
            zIndex: 50,
            opacity: 1,
            filter: 'blur(0px)'
        };
    }

    if (isOtherHovered) {
        return {
            x: align === 'left' ? -50 : align === 'right' ? 50 : 0,
            y: align === 'center' ? 35 : align === 'left' ? -10 : -20,
            rotateZ: align === 'left' ? -12 : align === 'right' ? 12 : 0,
            rotateY: align === 'left' ? 15 : align === 'right' ? -15 : 0,
            scale: align === 'center' ? 0.85 : 0.75,
            zIndex: align === 'center' ? 20 : 10,
            opacity: align === 'center' ? 0.6 : 0.4,
            filter: align === 'center' ? 'blur(2px)' : 'blur(4px)'
        };
    }

    // Posició per defecte en repòs
    return {
        x: align === 'left' ? -90 : align === 'right' ? 90 : 0,
        y: align === 'center' ? 15 : align === 'left' ? -20 : -30,
        rotateZ: align === 'left' ? -8 : align === 'right' ? 8 : 0,
        rotateY: align === 'left' ? 15 : align === 'right' ? -15 : 0,
        scale: align === 'center' ? 1 : 0.85,
        zIndex: align === 'center' ? 20 : 10,
        opacity: align === 'center' ? 1 : 0.9,
        filter: 'blur(0px)'
    };
}

/* Fallback lleuger mentre es descarrega el chunk Three.js */
const LiteHeroFallback = () => (
    <div
        className="absolute inset-0 top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 opacity-70"
        style={{
            maskImage: 'linear-gradient(to bottom, white 0%, white 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, white 0%, white 60%, transparent 100%)'
        }}
    >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(56,189,248,0.1)_0%,rgba(30,58,138,0.05)_50%,transparent_80%)]" />
    </div>
);

/* ==========================================================================
   Component Principal CommunityHero
   ========================================================================== */

interface Props {
    isCanvasFullyOpen: boolean;
    onUploadClick: () => void;
}

const CommunityHero = memo(({ isCanvasFullyOpen, onUploadClick }: Props) => {
    const { t } = useTranslation();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const heroWords = useMemo(
        () => [t('hero.word1', 'el curs.'), t('hero.word2', 'el semestre.'), t('hero.word3', 'la carrera.')],
        [t]
    );
    const [heroWordIndex, setHeroWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setHeroWordIndex(prev => (prev + 1) % heroWords.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [heroWords.length]);

    return (
        <section className="hidden md:flex touch-landscape:hidden relative w-full min-h-[55vh] items-center justify-center z-10 overflow-hidden pt-28 pb-8">
            <Suspense fallback={<LiteHeroFallback />}>
                <CommunityHero3D isPaused={isCanvasFullyOpen} />
            </Suspense>

            <div className="w-full max-w-400 mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center relative z-20">
                {/* Text Esquerre */}
                <div className="flex flex-col items-start text-left mt-4 lg:mt-0">
                    <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black mb-6 tracking-tighter flex flex-col items-start leading-[0.95] md:leading-[0.9]">
                        <motion.span
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                            className="text-white drop-shadow-2xl"
                        >
                            {t('hero.superem', 'Superem')}
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                            className="text-slate-300 drop-shadow-xl"
                        >
                            {t('hero.junts', 'junts')}
                        </motion.span>

                        {/* Contenidor de Paraules Dinàmiques */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                            className="h-[1.2em] relative w-full flex items-center justify-start overflow-visible mt-1"
                        >
                            <AnimatePresence mode="popLayout">
                                <motion.span
                                    key={heroWordIndex}
                                    initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
                                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                                    exit={{ y: -30, opacity: 0, filter: 'blur(8px)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary bg-size-[200%_auto] animate-[gradient_3s_linear_infinite] absolute left-0 py-2 drop-shadow-lg whitespace-nowrap"
                                >
                                    {heroWords[heroWordIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </motion.div>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                        className="text-slate-400 text-base md:text-lg font-medium max-w-xl mb-8 leading-relaxed"
                    >
                        {t('hero.subtitle', "Comparteix els teus recursos, troba els millors apunts i ajuda als teus companys. Perquè aquí l'èxit és col·lectiu i ")}
                        <span className="text-white font-bold">{t('hero.nobodyBehind', 'no deixem a ningú enrere')}</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
                    >
                        <button
                            type="button"
                            onClick={onUploadClick}
                            className="group relative px-8 py-4 bg-(--glass-bg) backdrop-blur-3xl backdrop-saturate-150 border border-(--glass-border) border-t-(--glass-border-light) border-l-(--glass-border-light) shadow-[var(--glass-shadow-inner),0_0_40px_rgba(255,255,255,0.05)] text-white font-bold text-lg rounded-full flex items-center gap-3 transition duration-500 hover:bg-white hover:text-black hover:border-white hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] overflow-hidden cursor-pointer"
                            aria-label={t('hero.uploadResource', 'Pujar Recurs')}
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-accent/20 to-primary/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out opacity-0 group-hover:opacity-100" />
                            <Plus size={20} className="transition-transform group-hover:rotate-90 duration-300 relative z-10" />
                            <span className="relative z-10">{t('hero.uploadResource', 'Pujar Recurs')}</span>
                        </button>
                    </motion.div>
                </div>

                {/* Visual Dreta (Floating Cards Showcase) */}
                <div className="hidden lg:flex relative h-112.5 w-full items-center justify-center perspective-distant">
                    <div className="relative w-full h-full max-w-137.5">
                        {/* Glow decoratiu de fons */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] rounded-full pointer-events-none" />

                        {/* Renderització orquestrada de les targetes */}
                        {HERO_SHOWCASE_CARDS.map(card => {
                            const isHovered = hoveredCard === card.id;
                            const isOtherHovered = hoveredCard !== null && hoveredCard !== card.id;
                            const animateState = getHeroCardAnimation(card.align, isHovered, isOtherHovered);

                            return (
                                <motion.div
                                    key={card.id}
                                    animate={animateState}
                                    transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.8 }}
                                    onMouseEnter={() => setHoveredCard(card.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer origin-center ${card.widthClass}`}
                                >
                                    <motion.div
                                        animate={{ y: hoveredCard === null ? [0, card.align === 'center' ? -12 : -8, 0] : 0 }}
                                        transition={{ duration: card.align === 'center' ? 5 : 4, repeat: Infinity, ease: 'easeInOut', delay: card.id * 0.5 }}
                                    >
                                        <div className={`absolute ${card.align === 'center' ? '-inset-10 blur-[50px]' : '-inset-8 blur-2xl'} rounded-full pointer-events-none transition-opacity duration-700 ${card.glow} ${isHovered ? 'opacity-100' : hoveredCard === null && card.align === 'center' ? 'opacity-50' : 'opacity-0'}`} />
                                        <div className="relative">
                                            <PublicationCard post={card.post} isHeroMode={true} />
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
});

CommunityHero.displayName = 'CommunityHero';
export default CommunityHero;


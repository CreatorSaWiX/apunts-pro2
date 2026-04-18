import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, X } from 'lucide-react';
import { InteractionProvider } from '../../contexts/InteractionContext';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Import assets to ensure Vite bundles them correctly
import p1 from '../../assets/particles/1.png';
import p2 from '../../assets/particles/2.png';
import p3 from '../../assets/particles/3.png';

interface InteractionLockProps {
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export const InteractionLock: React.FC<InteractionLockProps> = ({ children, className = "", disabled = false }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Highly optimized GLSL-style particle field for the entry card
    const ParticlePortal = () => {
        const textures = useLoader(THREE.TextureLoader, [p1, p2, p3]);

        const pointsRef = useRef<THREE.Group>(null!);

        // Generate positions once, split into 3 groups for different textures
        const [particleGroups] = useState(() => {
            const groups = [];
            for (let g = 0; g < 3; g++) {
                const pos = new Float32Array(20 * 3);
                for (let i = 0; i < 20; i++) {
                    pos[i * 3] = (Math.random() - 0.5) * 8;
                    pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
                    pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
                }
                groups.push(pos);
            }
            return groups;
        });

        useFrame((state) => {
            // Use performance.now to avoid THREE.Clock deprecation warnings in newer Three.js versions
            const t = performance.now() / 1000;
            if (pointsRef.current) {
                // Group movement for all particle types
                pointsRef.current.position.y = (t * 0.1) % 2;
                pointsRef.current.rotation.z = Math.sin(t * 0.05) * 0.05;
                // Parallax based on pointer
                pointsRef.current.position.x += (state.pointer.x * 0.4 - pointsRef.current.position.x) * 0.05;
            }
        });

        return (
            <group ref={pointsRef}>
                {particleGroups.map((pos, idx) => (
                    <Points key={idx} positions={pos} stride={3}>
                        <PointMaterial
                            transparent
                            map={textures[idx]}
                            size={0.7}
                            sizeAttenuation={true}
                            depthWrite={false}
                            color={idx === 1 ? "#93c5fd" : "#818cf8"} // Slight color variation
                            blending={THREE.AdditiveBlending}
                            opacity={0.5}
                        />
                    </Points>
                ))}
            </group>
        );
    };

    // Portal background component with the new particles
    const PortalBackground = () => {
        const [isVisible, setIsVisible] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const observer = new IntersectionObserver(([entry]) => {
                setIsVisible(entry.isIntersecting);
            }, {
                threshold: 0.01,
                rootMargin: '100px' // Start loading slightly before it enters view
            });

            if (containerRef.current) {
                observer.observe(containerRef.current);
            }

            return () => observer.disconnect();
        }, []);

        return (
            <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-slate-900">
                {isVisible ? (
                    <Canvas
                        camera={{ position: [0, 0, 5], fov: 60 }}
                        gl={{ antialias: false, powerPreference: "low-power" }}
                        dpr={1}
                    >
                        <React.Suspense fallback={null}>
                            <ParticlePortal />
                        </React.Suspense>
                    </Canvas>
                ) : (
                    <div className="absolute inset-0 bg-slate-900 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2),transparent_70%)] animate-pulse" />
                )}
                {/* Subtle overlay to bridge CSS and 3D */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950 pointer-events-none" />
            </div>
        );
    };
    const [resizeKey, setResizeKey] = useState(0);
    const [shouldMountChildren, setShouldMountChildren] = useState(false);
    const [isInViewport, setIsInViewport] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollPosRef = useRef(0);

    // Observer for Desktop Auto-loading
    useEffect(() => {
        if (isMobile || disabled) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInViewport(entry.isIntersecting);
            },
            { threshold: 0.1, rootMargin: '200px' }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [isMobile, disabled]);

    // Manage mounting state
    useEffect(() => {
        if (isFullScreen) {
            setShouldMountChildren(true);
        } else if (!isMobile && !disabled) {
            setShouldMountChildren(isInViewport);
        } else {
            setShouldMountChildren(false);
        }
    }, [isFullScreen, isMobile, disabled, isInViewport]);

    useEffect(() => {
        const checkMobile = () => {
            const mql = window.matchMedia('(pointer: coarse)');
            // Combine touch detection with screen width for maximum reliability
            setIsMobile(mql.matches || window.innerWidth < 800);
        };

        checkMobile();
        const mql = window.matchMedia('(pointer: coarse)');

        try {
            mql.addEventListener('change', checkMobile);
            window.addEventListener('resize', checkMobile);
            return () => {
                mql.removeEventListener('change', checkMobile);
                window.removeEventListener('resize', checkMobile);
            }
        } catch (e) {
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }
    }, []);

    // Detect and signal resize events to children
    useEffect(() => {
        if (!isFullScreen) return;

        const handleResize = () => setResizeKey(prev => prev + 1);
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, [isFullScreen]);

    // Handle body scroll locking with robust restoration
    useEffect(() => {
        if (!isFullScreen) return;

        // Save current scroll
        const scrollY = window.scrollY;
        scrollPosRef.current = scrollY;

        // Use a simpler scroll locking that doesn't trigger massive layout shifts/unmounts
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isFullScreen]);

    // Standard render - we ALWAYS use the interaction lock system to implement 
    // lazy loading and context management, preventing "Context Lost" errors 
    // caused by too many simultaneous WebGL canvases.
    if (disabled) {
        return <div className={className}>{children}</div>;
    }

    return (
        <InteractionProvider value={{ isFullScreen, setIsFullScreen, resizeKey }}>
            <div
                ref={containerRef}
                className={`relative group ${className}`}
            >
                {/* 1. DESKTOP VIEW: Auto-renders when visible in viewport (Lazy Load) */}
                {!isMobile && !isFullScreen && !disabled && (
                    <div className="w-full min-h-[500px] h-auto rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-slate-900/40 relative">
                        {shouldMountChildren ? (
                            <div className="w-full h-full min-h-[500px]">
                                {children}
                            </div>
                        ) : (
                            <div className="w-full h-[500px] bg-slate-950 flex items-center justify-center">
                                <div className="w-10 h-10 border-2 border-white/5 border-t-white/40 rounded-full animate-spin" />
                            </div>
                        )}

                        {/* Immersive Entry Badge - Desktop (Removed as per user request to keep UI clean) */}
                    </div>
                )}

                {/* 2. MOBILE VIEW: Manual lock (Compact High-End Card) */}
                {(isMobile || disabled) && !isFullScreen && (
                    <div className={isMobile ? "flex justify-center my-4" : ""}>
                        <div
                            onClick={() => setIsFullScreen(true)}
                            className="relative w-full max-w-[280px] h-28 overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-black/60 transition-all shadow-2xl group/card"
                        >
                            {/* Interactive Nebula Background */}
                            <div className="absolute inset-0 opacity-40 pointer-events-none -z-10">
                                <PortalBackground />
                            </div>

                            {/* Top Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />

                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover/card:bg-indigo-500/20 group-hover/card:border-indigo-500/30 transition-all">
                                    <Maximize2 className="text-white/80 group-hover:text-indigo-400 w-5 h-5" />
                                </div>
                                <div className="text-center">
                                    <h4 className="text-white font-bold text-[10px] tracking-[0.2em] uppercase mb-0.5">Mode Interactiu</h4>
                                    <p className="text-[8px] text-slate-500 font-medium">ES RECOMANA MIRAR DES D'UNA PANTALLA MÉS GRAN</p>
                                </div>
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute bottom-2 right-2 opacity-20">
                                <div className="w-1 h-1 bg-white rounded-full" />
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. FULL SCREEN OVERLAY: Immersive state */}
                {isFullScreen && (
                    <div
                        className="fixed inset-0 z-[2147483647] bg-slate-950 flex flex-col overflow-hidden"
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                    >
                        {/* Floating Close Button - Premium Glassmorphism */}
                        <div className="absolute top-6 right-6 z-[2147483648]">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsFullScreen(false);
                                }}
                                className="group bg-white/5 hover:bg-white/10 p-3.5 rounded-2xl border border-white/10 backdrop-blur-xl transition-all active:scale-90 shadow-2xl"
                                aria-label="Tancar"
                            >
                                <X className="text-white/70 group-hover:text-white w-5 h-5 transition-colors" />
                            </button>
                        </div>

                        {/* Edge-to-Edge Main Content */}
                        <div className="flex-1 relative bg-slate-950 overflow-hidden">
                            {shouldMountChildren ? (
                                <div className="absolute inset-0 w-full h-full" key={resizeKey}>
                                    {children}
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </InteractionProvider>
    );
};

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';

import { useSubject } from '../../contexts/SubjectContext';
import { useIsMobile } from '../../hooks/useIsMobile';

const ParticleNetwork = ({ count }: { count: number }) => {
    const { theme } = useSubject();
    const ref = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 3.5 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return positions;
    }, [count]);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 25;
            ref.current.rotation.y -= delta / 35;
            ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={theme.accent}
                    size={0.015}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    opacity={0.8}
                />
            </Points>
        </group>
    );
};

const LiteHeroBanner = () => {
    const { theme } = useSubject();
    return (
        <div 
            className="absolute inset-0 top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 opacity-80 transition-opacity duration-1000"
            style={{ 
                maskImage: 'linear-gradient(to bottom, white 0%, white 60%, transparent 100%)', 
                WebkitMaskImage: 'linear-gradient(to bottom, white 0%, white 60%, transparent 100%)' 
            }}
        >
            <div 
                className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] animate-[spin_40s_linear_infinite] opacity-30 will-change-transform"
                style={{
                    backgroundImage: `radial-gradient(circle at 30% 40%, ${theme.accent}33 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(14, 165, 233, 0.2) 0%, transparent 50%)`
                }}
            />
            <div 
                className="absolute inset-0"
                style={{ 
                    backgroundImage: `radial-gradient(ellipse at 50% 30%, ${theme.accent}22 0%, rgba(30, 58, 138, 0.1) 50%, transparent 80%)`
                }}
            />
        </div>
    );
};

const CommunityHero3D = ({ isPaused = false }: { isPaused?: boolean }) => {
    const isMobile = useIsMobile();
    const useLiteFallback = false;

    const initialDpr = isMobile ? 1 : 1.5;
    const particleCount = isMobile ? 600 : 3000;

    const [dpr, setDpr] = useState(initialDpr);
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setDpr(initialDpr);
    }, [initialDpr]);

    useEffect(() => {
        if (useLiteFallback) return;
        const timer = setTimeout(() => setMounted(true), 500);
        return () => clearTimeout(timer);
    }, [useLiteFallback]);

    useEffect(() => {
        if (useLiteFallback || !containerRef.current) return;
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, { threshold: 0.05 });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [useLiteFallback, mounted]);

    if (useLiteFallback) {
        return <LiteHeroBanner />;
    }

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            style={{ maskImage: 'linear-gradient(to bottom, white 0%, white 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, white 0%, white 60%, transparent 100%)' }}
        >
            {mounted && (
                <Canvas frameloop={(isPaused || !isVisible) ? "never" : "always"} camera={{ position: [0, 0, 3], fov: 60 }} dpr={dpr}>
                    <PerformanceMonitor onIncline={() => setDpr(initialDpr)} onDecline={() => setDpr(0.5)} />
                    <ParticleNetwork count={particleCount} />
                </Canvas>
            )}
        </div>
    );
};

export default CommunityHero3D;



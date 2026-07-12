import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';

import { useSubject } from '../../contexts/SubjectContext';

const ParticleNetwork = () => {
    const { theme } = useSubject();
    const ref = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const count = 3000;
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
    }, []);

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

const CommunityHero3D = () => {
    const [dpr, setDpr] = useState(1.5);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Wait 500ms for the page transition to finish before initializing WebGL
        const timer = setTimeout(() => setMounted(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`absolute inset-0 top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none -z-10 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            style={{ maskImage: 'linear-gradient(to bottom, white 0%, white 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, white 0%, white 60%, transparent 100%)' }}
        >
            {mounted && (
                <Canvas camera={{ position: [0, 0, 3], fov: 60 }} dpr={dpr}>
                    <PerformanceMonitor onIncline={() => setDpr(1.5)} onDecline={() => setDpr(1)} />
                    <ParticleNetwork />
                </Canvas>
            )}
        </div>
    );
};

export default CommunityHero3D;

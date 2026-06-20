import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleNetwork = () => {
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
                    color="#38bdf8"
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
    return (
        <div className="absolute inset-0 top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none -z-10 mix-blend-screen">
            <div className="absolute inset-0 bg-linear-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505] z-10" />
            <div className="absolute inset-0 opacity-40 mix-blend-overlay noise-bg z-20" />
            <Canvas camera={{ position: [0, 0, 3], fov: 60 }} dpr={[1, 2]}>
                <ParticleNetwork />
            </Canvas>
        </div>
    );
};

export default CommunityHero3D;

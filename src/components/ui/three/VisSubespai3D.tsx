import React, { useMemo, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Stars, Text, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { Mafs, Coordinates, Plot, Theme, LaTeX as MafsLaTeX, Circle, Polygon, MovablePoint, Line as MafsLine, Vector } from "mafs";
import { InlineMath } from 'react-katex';
import "mafs/core.css";
import { InteractionLock } from "../InteractionLock";
import { useInteraction } from '../../../contexts/InteractionContext';

interface ThreeVisualizerProps {
    type: string;
}

import { Arrow, DirectionalCurvePoints, hasWebGL, ThreeErrorBoundary, FunctionSurface, Point } from './utils3d';



const VisSubespai3D = () => {
    const isMobile = useIsMobile();
    const { isFullScreen } = useInteraction();
    const u = new THREE.Vector3(2, 1, 1);
    const v = new THREE.Vector3(-1, 2, 0.5);
    const sum = new THREE.Vector3().addVectors(u, v);

    return (
        <div className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-950 ${isFullScreen ? 'h-screen' : 'h-[500px] rounded-2xl border border-white/10 my-8'}`}>
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg">Subespai a ℝ³</span>
                <div className="bg-black/40 backdrop-blur-md p-2 rounded border border-white/10 text-[10px] text-slate-300 font-mono">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <InlineMath math="\vec{u}" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <InlineMath math="\vec{v}" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <InlineMath math="\vec{u} + \vec{v}" />
                    </div>
                </div>
            </div>

            <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                <PerspectiveCamera makeDefault position={[5, 5, 5]} />
                <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                {/* Subspace Plane (Passing through origin) */}
                <mesh rotation={[-Math.PI / 4, 0, 0]}>
                    <planeGeometry args={[10, 10]} />
                    <meshStandardMaterial color="#6366f1" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
                </mesh>

                {/* Vectors */}
                <Arrow memoDir={u.clone().normalize()} length={u.length()} color="#3b82f6" head={0.2} width={0.05} />
                <Arrow memoDir={v.clone().normalize()} length={v.length()} color="#ef4444" head={0.2} width={0.05} />
                <Arrow memoDir={sum.clone().normalize()} length={sum.length()} color="#10b981" head={0.2} width={0.05} />

                {/* Parallelogram Lines */}
                <Line points={[u.toArray(), sum.toArray()]} color="#ffffff" lineWidth={1} dashed opacity={0.3} />
                <Line points={[v.toArray(), sum.toArray()]} color="#ffffff" lineWidth={1} dashed opacity={0.3} />

                {/* Point at Origin */}
                <Point position={[0, 0, 0]} color="white" />
                <Text position={[0.2, 0.2, 0.2]} color="white" fontSize={0.2}>0</Text>
            </Canvas>

            <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
                <p className="text-[10px] text-slate-500 italic bg-black/20 backdrop-blur-sm inline-block px-3 py-1 rounded-full border border-white/5">
                    Un pla que passa per l'origen és un subespai vectorial. Conté el zero i és tancat per operacions.
                </p>
            </div>
        </div>
    );
};

export default VisSubespai3D;

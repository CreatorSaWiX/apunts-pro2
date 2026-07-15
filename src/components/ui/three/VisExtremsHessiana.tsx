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



const VisExtremsHessiana = () => {
    const [tipus, setTipus] = React.useState<'min' | 'max' | 'sella' | 'inconcloent'>('min');
    const { isFullScreen, resizeKey } = useInteraction();
    const isMobile = useIsMobile();

    const config = {
        min: {
            f: (x: number, y: number) => 0.2 * (x * x + y * y),
            title: 'Mínim Relatiu',
            delta: 1,
            fxx: 2,
            desc: 'La superfície creix en totes les direccions (Delta > 0, fxx > 0).',
            color: '#10b981'
        },
        max: {
            f: (x: number, y: number) => -0.2 * (x * x + y * y),
            title: 'Màxim Relatiu',
            delta: 1,
            fxx: -2,
            desc: 'La superfície decreix en totes les direccions (Delta > 0, fxx < 0).',
            color: '#f43f5e'
        },
        sella: {
            f: (x: number, y: number) => 0.2 * (x * x - y * y),
            title: 'Punt de Sella',
            delta: -1,
            fxx: 2,
            desc: 'La superfície puja en una direcció i baixa en l\'altra (Delta < 0).',
            color: '#818cf8'
        },
        inconcloent: {
            f: (x: number, y: number) => 0.05 * (x * x * x * x + y * y * y * y),
            title: 'Cas Inconcloent (Δ=0)',
            delta: 0,
            fxx: 0,
            desc: 'La Hessiana és nul·la a l\'origen. Cal un estudi local (en aquest cas és un mínim).',
            color: '#f59e0b'
        }
    };

    const current = config[tipus];

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 rounded-3xl border border-white/10 ${isFullScreen ? 'h-full' : ''}`}>
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner">
                    {(Object.keys(config) as Array<keyof typeof config>).map((k) => (
                        <button type="button"
                            key={k}
                            onClick={() => setTipus(k)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tipus === k ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {k}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col items-center px-4 py-2 bg-black/20 rounded-xl border border-white/5 min-w-[100px]">
                        <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Determinant Δ</span>
                        <span className={`text-xs font-mono font-bold ${current.delta > 0 ? 'text-emerald-400' : current.delta < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                            {current.delta > 0 ? '> 0' : current.delta < 0 ? '< 0' : '= 0'}
                        </span>
                    </div>
                </div>
            </div>

            <div className={`${isFullScreen ? 'flex-1' : 'h-[500px]'} relative bg-slate-950/50 overflow-hidden border-b border-white/5`}>
                <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5 italic">{current.title}</div>
                <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                    <PerspectiveCamera makeDefault position={[5, 4, 5]} fov={40} />
                    <OrbitControls enableZoom={true} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                    <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                    <FunctionSurface f={current.f} showWireframe={true} opacity={0.8} colorScale={2} />
                    <Point position={[0, 0, 0]} color={current.color} />
                </Canvas>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/10 text-center">
                <p className="text-[11px] text-slate-300 italic max-w-2xl mx-auto leading-relaxed">
                    <span className="text-white font-bold uppercase mr-2">{current.title}:</span>
                    {current.desc}
                </p>
            </div>
        </div>
    );
};


export default VisExtremsHessiana;

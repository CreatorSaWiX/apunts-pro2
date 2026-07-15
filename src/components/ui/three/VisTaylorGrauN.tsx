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



const VisTaylorGrauN = () => {
    const [p, setP] = React.useState<[number, number]>([0, 0]);
    const [grau, setGrau] = React.useState<0 | 1 | 2>(2);
    const { isFullScreen, resizeKey } = useInteraction();
    const isMobile = useIsMobile();

    // Funció base: f(x,y) = cos(x) * exp(-y^2/4)
    const f = (x: number, y: number) => Math.cos(x) * Math.exp(-(y * y) / 4);

    // Derivades en (a,b)
    const a = p[0], b = p[1];
    const fa = f(a, b);

    const dax = -Math.sin(a) * Math.exp(-(b * b) / 4);
    const day = f(a, b) * (-b / 2);

    const daxx = -Math.cos(a) * Math.exp(-(b * b) / 4);
    const dayy = f(a, b) * (-(1 / 2) + (b * b / 4));
    const daxy = -Math.sin(a) * Math.exp(-(b * b) / 4) * (-b / 2);

    // Polinomi de Taylor
    const taylor = (x: number, y: number) => {
        const h = x - a;
        const k = y - b;
        if (grau === 0) return fa;
        if (grau === 1) return fa + dax * h + day * k;
        // Grau 2
        return fa + (dax * h + day * k) + 0.5 * (daxx * h * h + 2 * daxy * h * k + dayy * k * k);
    };

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 ${isFullScreen ? 'h-full' : ''}`}>
            {/* Control Panel */}
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner">
                    {([0, 1, 2] as const).map((g) => (
                        <button type="button"
                            key={g}
                            onClick={() => setGrau(g)}
                            className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${grau === g ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Grau {g}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex flex-col">
                        <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1 text-center">Punt (a, b)</span>
                        <div className="flex gap-2">
                            <input type="range" min="-2" max="2" step="0.1" value={p[0]} onChange={e => setP([parseFloat(e.target.value), p[1]])} className="w-16 accent-indigo-500" />
                            <input type="range" min="-2" max="2" step="0.1" value={p[1]} onChange={e => setP([p[0], parseFloat(e.target.value)])} className="w-16 accent-indigo-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={`flex-none md:flex-1 grid grid-cols-1 ${isFullScreen ? 'h-full grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'h-[500px] grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                {/* 2D: Mapa de calor i Error */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/30 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-indigo-300 font-bold uppercase tracking-widest border border-white/5">Error d'aproximació |f - P|</div>
                    <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <MovablePoint point={p} onMove={setP} color={Theme.indigo} />
                    </Mafs>
                    <div className="absolute bottom-4 left-4 text-[10px] text-slate-300 italic font-bold">Mou el punt per veure com canvia l'aproximació en 3D.</div>
                </div>

                {/* 3D: Superfície i Taylor */}
                <div className="relative bg-slate-950/50 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-rose-300 font-bold uppercase tracking-widest border border-white/5">Vista 3D: Superfície vs Polinomi</div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 5, 8]} fov={40} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        {/* Superfície original */}
                        <FunctionSurface f={f} opacity={0.6} showWireframe={false} />

                        {/* Polinomi de Taylor */}
                        <FunctionSurface
                            f={taylor}
                            colorScale={1.5}
                            showWireframe={true}
                            opacity={0.8}
                        />

                        <Point position={[a, fa, b]} color="white" />
                    </Canvas>
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/10">
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">Aproximació</span>
                        <div className="text-[11px] font-mono text-indigo-300">
                            <InlineMath math={`P_{${grau}}(x,y) \\approx f(a,b)`} />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">Geometria</span>
                        <span className="text-[11px] font-bold text-white">
                            {grau === 0 ? 'Punt d\'ancoratge' : grau === 1 ? 'Pla Tangent (Lineal)' : 'Paraboloide (Curvatura)'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default VisTaylorGrauN;

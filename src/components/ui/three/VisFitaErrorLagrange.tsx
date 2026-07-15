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



const VisFitaErrorLagrange = () => {
    const [delta, setDelta] = React.useState(0.5); // Radi de la regió
    const { isFullScreen, resizeKey } = useInteraction();
    const isMobile = useIsMobile();

    // Funció d'examen: f(x,y) = ln(1 + 0.5x + 0.3y)
    // Aproximació a (0,0): P1 = 0.5x + 0.3y
    const f = (x: number, y: number) => Math.log(1 + 0.5 * x + 0.3 * y);
    const p1 = (x: number, y: number) => 0.5 * x + 0.3 * y;

    // Derivades segones per a la fita M:
    // fxx = -0.25 / (1 + 0.5x + 0.3y)^2
    // fyy = -0.09 / (1 + 0.5x + 0.3y)^2
    // fxy = -0.15 / (1 + 0.5x + 0.3y)^2
    // El màxim valor absolut d'aquestes és a la cantonada on el denominador és mínim (x=-delta, y=-delta)
    const getM = (d: number) => {
        const denom = Math.pow(1 - 0.5 * d - 0.3 * d, 2);
        return {
            xx: 0.25 / denom,
            yy: 0.09 / denom,
            xy: 0.15 / denom
        };
    };

    const M = getM(delta);
    const fitaTeorica = 0.5 * (M.xx * delta * delta + 2 * M.xy * delta * delta + M.yy * delta * delta);

    // Error real màxim (aproximat per mostreig a les cantonades)
    const errorReal = Math.max(
        Math.abs(f(delta, delta) - p1(delta, delta)),
        Math.abs(f(-delta, -delta) - p1(-delta, -delta))
    );

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 rounded-3xl border border-white/10 ${isFullScreen ? 'h-full' : ''}`}>
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Fita d'Error de Lagrange</span>
                    <span className="text-[9px] text-slate-500 font-mono italic">f(x,y) = ln(1 + 0.5x + 0.3y)</span>
                </div>

                <div className="flex gap-2">
                    <div className="bg-black/40 px-3 py-2 rounded-xl border border-white/5 flex flex-col items-center min-w-[100px]">
                        <span className="text-[7px] text-slate-400 font-black uppercase mb-0.5">Radi Regió (δ)</span>
                        <input type="range" min="0.1" max="0.9" step="0.05" value={delta} onChange={e => setDelta(parseFloat(e.target.value))} className="w-20 accent-rose-500" />
                    </div>
                    <div className="bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-500/20 flex flex-col items-center min-w-[100px]">
                        <span className="text-[7px] text-rose-400 font-black uppercase mb-0.5">Fita Lagrange</span>
                        <span className="text-xs font-mono text-rose-300">≤ {fitaTeorica.toFixed(4)}</span>
                    </div>
                    <div className="bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20 flex flex-col items-center min-w-[100px]">
                        <span className="text-[7px] text-emerald-400 font-black uppercase mb-0.5">Error Real</span>
                        <span className="text-xs font-mono text-emerald-300">≈ {errorReal.toFixed(4)}</span>
                    </div>
                </div>
            </div>

            <div className={`flex-none md:flex-1 grid grid-cols-1 ${isFullScreen ? 'h-full grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'h-[500px] grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                {/* 2D: Regió de control */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/30 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5 italic">Domini de l'aproximació</div>
                    <Mafs viewBox={{ x: [-1.5, 1.5], y: [-1.5, 1.5] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Polygon points={[[-delta, -delta], [delta, -delta], [delta, delta], [-delta, delta]]} color={Theme.pink} fillOpacity={0.1} />
                        <MafsLaTeX at={[delta + 0.2, delta + 0.2]} tex="\delta" color={Theme.pink} />
                    </Mafs>
                </div>

                {/* 3D: Error Visual */}
                <div className="relative bg-slate-950/50 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5">Vista 3D: La "Resta" de Lagrange</div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[5, 4, 5]} fov={40} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        <FunctionSurface f={f} showWireframe={false} opacity={0.6} />
                        <FunctionSurface f={p1} colorScale={3} showWireframe={true} opacity={0.4} />

                        {/* Indicadors a les cantonades on l'error és màxim */}
                        <Line points={[[-delta, f(-delta, -delta), -delta], [-delta, p1(-delta, -delta), -delta]]} color="#f43f5e" lineWidth={4} />
                        <Point position={[0, 0, 0]} color="white" />
                    </Canvas>
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/10 text-center">
                <p className="text-[10px] text-slate-300 italic max-w-2xl mx-auto leading-relaxed">
                    Com més gran és la regió (més $\delta$), més creixen les derivades segones ($M$) i el factor quadrat. Fixa't que la **Fita de Lagrange** (teòrica) sempre és una mica superior a l'**Error Real**; és un "paraigua" de seguretat que ens garanteix que l'error mai superarà aquest valor.
                </p>
            </div>
        </div>
    );
};


export default VisFitaErrorLagrange;

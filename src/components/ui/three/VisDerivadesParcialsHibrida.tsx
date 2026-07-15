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



const VisDerivadesParcialsHibrida = () => {
    const [a, setA] = React.useState<[number, number]>([1, 1]);
    const [mode, setMode] = React.useState<'x' | 'y'>('x');
    const { isFullScreen, resizeKey } = useInteraction();

    const f = (x: number, y: number) => 4 - (x * x + y * y) * 0.1;
    const z0 = f(a[0], a[1]);
    const currentSlope = mode === 'x' ? -0.2 * a[0] : -0.2 * a[1];

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'relative h-[100dvh]' : ''}`}>
            <div className={`${isFullScreen ? 'absolute top-0 left-0 right-0 z-20 h-[14dvh] landscape:h-[20dvh] px-2 py-1 bg-black/60 backdrop-blur-md border-b border-white/5 flex flex-wrap justify-start items-center gap-x-4 gap-y-0.5 pr-16' : 'p-4 bg-slate-800/50 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4'}`}>
                <div className="flex gap-3 items-center">
                    <div className="flex bg-black/40 p-0.5 rounded border border-white/5">
                        <button type="button" onClick={() => setMode('x')} className={`${isFullScreen ? 'px-2 py-0.5 text-[8px]' : 'px-4 py-1.5 text-[10px]'} rounded font-bold tracking-wider transition-all ${mode === 'x' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>X</button>
                        <button type="button" onClick={() => setMode('y')} className={`${isFullScreen ? 'px-2 py-0.5 text-[8px]' : 'px-4 py-1.5 text-[10px]'} rounded font-bold tracking-wider transition-all ${mode === 'y' ? 'bg-rose-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Y</button>
                    </div>
                </div>
                <div className={`${isFullScreen ? 'px-1.5 py-0 text-[10px]' : 'px-3 py-1 text-xs md:text-sm'} bg-black/30 rounded-full border border-white/5 font-mono text-white whitespace-nowrap`}>
                    <InlineMath math={mode === 'x' ? `\\frac{\\partial f}{\\partial x} = ${currentSlope.toFixed(2)}` : `\\frac{\\partial f}{\\partial y} = ${currentSlope.toFixed(2)}`} />
                </div>
            </div>

            <div className={`${isFullScreen ? 'absolute inset-0 pt-[14dvh] landscape:pt-[20dvh] grid grid-cols-1 grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 min-h-[600px] md:min-h-[350px]'}`}>
                <div className={`relative border-white/5 bg-slate-950/20 overflow-hidden ${isFullScreen ? 'border-b landscape:border-b-0 landscape:border-r h-full' : 'border-b md:border-b-0 md:border-r h-full'}`}>
                    <div className="absolute top-2 left-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-slate-300 font-bold border border-white/10 italic">
                        MAPA DE CORBES DE NIVELL
                    </div>
                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        {[1, 2, 3, 4, 5, 6].map(r => (
                            <Circle key={r} center={[0, 0]} radius={Math.sqrt(r * 4)} color={Theme.foreground} weight={1} fillOpacity={0.1} />
                        ))}
                        {mode === 'x' ? (
                            <Plot.OfX y={() => a[1]} color={Theme.indigo} weight={2} opacity={0.5} />
                        ) : (
                            <Plot.OfY x={() => a[0]} color={Theme.pink} weight={2} opacity={0.5} />
                        )}
                        <MovablePoint point={a} onMove={setA} color={mode === 'x' ? Theme.indigo : Theme.pink} />
                    </Mafs>
                </div>

                <div className={`relative bg-slate-950/40 overflow-hidden h-full`}>
                    <div className="absolute top-2 left-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-slate-300 font-bold border border-white/10 italic">
                        FUNCIÓ CONGELADA (1 VARIABLE)
                    </div>
                    <Mafs viewBox={{ x: [-4, 4], y: [0, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        <Plot.OfX y={t => mode === 'x' ? f(t, a[1]) : f(a[0], t)} color={mode === 'x' ? Theme.indigo : Theme.pink} weight={3} />
                        <Plot.OfX y={t => z0 + currentSlope * (t - (mode === 'x' ? a[0] : a[1]))} color={Theme.yellow} weight={2} style="dashed" />
                        <Circle center={[mode === 'x' ? a[0] : a[1], z0]} radius={0.15} color={Theme.yellow} fillOpacity={1} />
                    </Mafs>
                </div>
            </div>
            <div className="p-3 bg-slate-800/30 text-[10px] text-slate-400 text-center border-t border-white/5 italic">
                A l'esquerra triem on som. A la dreta veiem la derivada "de tota la vida" que resulta de mantenir una variable fixa.
            </div>
        </div>
    );
};


export default VisDerivadesParcialsHibrida;

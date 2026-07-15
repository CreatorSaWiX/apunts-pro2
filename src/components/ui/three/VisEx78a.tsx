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



const VisEx78a = () => {
    const isMobile = useIsMobile();
    const [k, setK] = React.useState<number>(1);
    const f3D = React.useMemo(() => (x: number, y: number) => (x * x * y) * 0.1, []);
    const { isFullScreen, resizeKey } = useInteraction();

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full bg-slate-900' : 'h-[600px]'}`}>
            <div className={`p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center ${isFullScreen ? 'justify-start pr-16' : 'justify-between'} gap-4`}>
                <div className="flex items-center gap-3">
                    <span className="bg-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20">Apartat A</span>
                    <span className="text-sm font-mono text-slate-300"><InlineMath math="z = x^2 y" /></span>
                </div>
                <div className="flex-1 w-full max-w-sm">
                    <div className="flex justify-between mb-1.5 px-1">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest text-slate-500">Nivell (z)</span>
                        <span className="text-xs font-mono text-white bg-blue-600 px-2 py-0.5 rounded">{k.toFixed(1)}</span>
                    </div>
                    <input
                        type="range" min="-2" max="2" step="1" value={k}
                        onChange={(e) => setK(parseFloat(e.target.value))}
                        className="w-full h-1.2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="relative bg-slate-950/50 h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                    <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        {k === 0 ? (
                            <>
                                <Plot.OfX y={() => 0} color={Theme.blue} weight={3} />
                                <Plot.OfY x={() => 0} color={Theme.blue} weight={3} />
                            </>
                        ) : (
                            <>
                                <Plot.OfX y={(x) => (x ** 2 > 0.01 ? k / (x ** 2) : NaN)} color={Theme.blue} weight={3} />
                                <Plot.OfX y={(x) => (x ** 2 > 0.01 ? k / (x ** 2) : NaN)} color={Theme.blue} weight={3} />
                            </>
                        )}
                        <MafsLaTeX at={[0, -4]} tex={`x^2 y = ${k.toFixed(1)}`} color={Theme.blue} />
                    </Mafs>
                </div>
                <div className="relative h-full overflow-hidden">
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <FunctionSurface f={f3D} showWireframe={true} colorScale={1} />
                        <mesh position={[0, k * 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[10, 10]} />
                            <meshPhongMaterial color="#3b82f6" transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
                        </mesh>
                    </Canvas>
                </div>
            </div>
        </div>
    );
};


export default VisEx78a;

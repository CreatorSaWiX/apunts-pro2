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



const VisEx73b = () => {

    const isMobile = useIsMobile();
    const [k, setK] = React.useState<number>(0);
    const f3D = React.useMemo(() => (x: number, y: number) => (1 - Math.abs(x) - Math.abs(y)) * 1.5, []);
    const { isFullScreen, resizeKey } = useInteraction();

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full bg-slate-900' : 'h-[600px]'}`}>
            <div className={`p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center ${isFullScreen ? 'justify-start pr-16' : 'justify-between'} gap-4`}>
                <div className="flex items-center gap-3">
                    <span className="bg-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20">Apartat B</span>
                    <span className="text-sm font-mono text-slate-300"><InlineMath math="f(x,y) = 1 - |x| - |y|" /></span>
                </div>
                <div className="flex-1 w-full max-w-sm">
                    <div className="flex justify-between mb-1.5 px-1">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest text-slate-500">Nivell (z)</span>
                        <span className="text-xs font-mono text-white bg-emerald-600 px-2 py-0.5 rounded">{k.toFixed(1)}</span>
                    </div>
                    <input
                        type="range" min="-2" max="1" step="0.5" value={k}
                        onChange={(e) => setK(parseFloat(e.target.value))}
                        className="w-full h-1.2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>
            </div>

            <div className={`flex-none md:flex-1 grid grid-cols-1 ${isFullScreen ? 'h-full grid-rows-[1fr_1fr]' : 'h-[500px] grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="relative bg-slate-950/50 h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                    <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        {1 - k > 0 ? (
                            <Polygon
                                points={[
                                    [1 - k, 0], [0, 1 - k], [-(1 - k), 0], [0, -(1 - k)]
                                ]}
                                color={Theme.green} weight={3} fillOpacity={0.1}
                            />
                        ) : (1 - k === 0) ? (
                            <Circle center={[0, 0]} radius={0.1} color={Theme.green} fillOpacity={1} />
                        ) : null}
                        <MafsLaTeX at={[0, -4]} tex={`1 - |x| - |y| = ${k.toFixed(1)}`} color={Theme.green} />
                    </Mafs>
                </div>
                <div className="relative h-full overflow-hidden">
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <FunctionSurface f={f3D} showWireframe={true} colorScale={1.5} />
                        <mesh position={[0, k * 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[10, 10]} />
                            <meshPhongMaterial color="#10b981" transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
                        </mesh>
                    </Canvas>
                </div>
            </div>
        </div>
    );
};


export default VisEx73b;

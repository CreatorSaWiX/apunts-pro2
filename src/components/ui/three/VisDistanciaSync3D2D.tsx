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



const VisDistanciaSync3D2D = () => {
    const isMobile = useIsMobile();
    const [p1, setP1] = React.useState<[number, number, number]>([1, 1, 0.5]);
    const [p2, setP2] = React.useState<[number, number, number]>([4, 3, 2]);
    const { isFullScreen, resizeKey } = useInteraction();

    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const dz = p2[2] - p1[2];
    const dist2D = Math.sqrt(dx * dx + dy * dy);
    const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full' : 'h-[500px]'}`}>
            <div className={`p-4 bg-slate-800/50 border-b border-white/10 flex flex-wrap items-center justify-between gap-4`}>
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase">Alçada P1 (z)</span>
                        <input type="range" min="0" max="4" step="0.1" value={p1[2]} onChange={(e) => setP1([p1[0], p1[1], parseFloat(e.target.value)])} className="w-24 accent-blue-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase">Alçada P2 (z)</span>
                        <input type="range" min="0" max="4" step="0.1" value={p2[2]} onChange={(e) => setP2([p2[0], p2[1], parseFloat(e.target.value)])} className="w-24 accent-red-500" />
                    </div>
                </div>
                <div className="bg-black/30 px-4 py-2 rounded-xl border border-white/5 flex gap-6">
                    <div className="text-center">
                        <div className="text-[8px] text-slate-500 uppercase">Distància 2D</div>
                        <div className="text-sm font-mono font-bold text-blue-400">{dist2D.toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[8px] text-slate-500 uppercase">Distància 3D</div>
                        <div className="text-sm font-mono font-bold text-indigo-400">{dist3D.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="border-b md:border-b-0 md:border-r border-white/5 relative bg-slate-950/20 h-full overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 pointer-events-none">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Projecció XY (2D)</span>
                    </div>
                    <Mafs viewBox={{ x: [-1, 6], y: [-1, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        <Plot.OfX y={() => p1[1]} color={Theme.blue} style="dashed" opacity={0.3} />
                        <MafsLine.Segment point1={[p1[0], p1[1]]} point2={[p2[0], p2[1]]} color={Theme.blue} weight={3} />
                        <MovablePoint point={[p1[0], p1[1]]} onMove={([x, y]) => setP1([x, y, p1[2]])} color={Theme.blue} />
                        <MovablePoint point={[p2[0], p2[1]]} onMove={([x, y]) => setP2([x, y, p2[2]])} color={Theme.red} />
                        <MafsLaTeX at={[(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 + 0.4]} tex="d_{2D}" color={Theme.blue} />
                    </Mafs>
                </div>

                <div className="relative h-full overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 pointer-events-none">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Espai R3 (3D)</span>
                    </div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 5, 8]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        {/* Punts i Línia 3D */}
                        <Point position={p1} color="#3b82f6" />
                        <Point position={p2} color="#ef4444" />
                        <mesh>
                            <Line points={[p1, p2]} color="#6366f1" lineWidth={3} />
                        </mesh>

                        {/* Components de distància */}
                        <Line points={[p1, [p2[0], p1[1], p1[2]]]} color="#ffffff" lineWidth={1} dashed />
                        <Line points={[[p2[0], p1[1], p1[2]], [p2[0], p2[1], p1[2]]]} color="#ffffff" lineWidth={1} dashed />
                        <Line points={[[p2[0], p2[1], p1[2]], p2]} color="#ffffff" lineWidth={1} dashed />
                    </Canvas>
                </div>
            </div>
        </div>
    );
};


export default VisDistanciaSync3D2D;

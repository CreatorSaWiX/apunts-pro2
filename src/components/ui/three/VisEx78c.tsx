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



const VisEx78c = () => {
    const isMobile = useIsMobile();
    const [k, setK] = React.useState<number>(2);
    const f3D = React.useMemo(() => (x: number, y: number) => (Math.abs(x + y) + Math.abs(x - y)) * 0.2, []);
    const { isFullScreen, resizeKey } = useInteraction();

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full bg-slate-900' : 'h-[600px]'}`}>
            <div className={`p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center ${isFullScreen ? 'justify-start pr-16' : 'justify-between'} gap-4`}>
                <div className="flex items-center gap-3">
                    <span className="bg-rose-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-rose-500/20">Apartat C</span>
                    <span className="text-sm font-mono text-slate-300"><InlineMath math="z = |x+y| + |x-y|" /></span>
                </div>
                <div className="flex-1 w-full max-w-sm">
                    <div className="flex justify-between mb-1.5 px-1">
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest text-slate-500">Nivell (z)</span>
                        <span className="text-xs font-mono text-white bg-rose-600 px-2 py-0.5 rounded">{k.toFixed(1)}</span>
                    </div>
                    <input
                        type="range" min="0" max="4" step="1" value={k}
                        onChange={(e) => setK(parseFloat(e.target.value))}
                        className="w-full h-1.2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="relative bg-slate-950/50 h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                    <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        {k > 0 ? (
                            <Polygon
                                points={[
                                    [k / 2, k / 2], [-k / 2, k / 2], [-k / 2, -k / 2], [k / 2, -k / 2]
                                ]}
                                color={Theme.pink} weight={3} fillOpacity={0.1}
                            />
                        ) : k === 0 ? (
                            <Circle center={[0, 0]} radius={0.1} color={Theme.pink} fillOpacity={1} />
                        ) : null}
                        <MafsLaTeX at={[0, -2.5]} tex={`2 \\max(|x|, |y|) = ${k.toFixed(1)}`} color={Theme.pink} />
                    </Mafs>
                </div>
                <div className="relative h-full overflow-hidden">
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <FunctionSurface f={f3D} showWireframe={true} colorScale={2} />
                        <mesh position={[0, k * 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[10, 10]} />
                            <meshPhongMaterial color="#f43f5e" transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
                        </mesh>
                    </Canvas>
                </div>
            </div>
        </div>
    );
};


export default VisEx78c;

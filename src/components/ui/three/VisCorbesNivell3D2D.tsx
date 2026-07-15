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



const VisCorbesNivell3D2D = () => {
    const isMobile = useIsMobile();
    const [k, setK] = React.useState(1.5);
    const f = (x: number, y: number) => (x * x + y * y) * 0.1;
    const { isFullScreen, resizeKey } = useInteraction();

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full bg-slate-900' : 'h-[600px] md:h-[600px]'}`}>
            <div className={`p-4 md:p-6 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center ${isFullScreen ? 'justify-start pr-16' : 'justify-between'} gap-4 md:gap-6`}>
                <div className="flex-1 w-full">
                    <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Alçada de tall (k)</span>
                        <span className="text-xs font-mono text-white bg-indigo-600 px-2 py-0.5 rounded shadow-lg shadow-indigo-500/20">z = {k.toFixed(2)}</span>
                    </div>
                    <input
                        type="range" min="0" max="4.5" step="0.1" value={k}
                        onChange={(e) => setK(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                    />
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="border-b md:border-b-0 md:border-r border-white/5 relative bg-slate-950/50 h-full overflow-hidden">
                    <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Circle
                            center={[0, 0]}
                            radius={Math.sqrt(Math.max(0, k / 0.1))}
                            color={Theme.indigo}
                            weight={3}
                            fillOpacity={0.1}
                        />
                        <MafsLaTeX at={[0, -4.5]} tex={`x^2 + y^2 = ${(k / 0.1).toFixed(1)}`} color={Theme.indigo} />
                    </Mafs>
                </div>
                <div className="relative h-full overflow-hidden">
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <gridHelper args={[20, 20, "#333", "#222"]} rotation={[0, 0, 0]} position={[0, -0.01, 0]} />

                        <FunctionSurface f={f} showWireframe={true} />

                        <mesh position={[0, k, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[10, 10]} />
                            <meshPhongMaterial color="#a855f7" transparent opacity={0.5} side={THREE.DoubleSide} />
                        </mesh>
                    </Canvas>
                </div>
            </div>

            <div className="p-3 bg-slate-950 text-center border-t border-white/10">
                <p className="text-[10px] text-slate-500 italic">
                    La corba 2D a l'esquerra correspon al tall horitzontal a altura <span className="text-indigo-400 font-bold">k</span> de la figura 3D.
                </p>
            </div>
        </div>
    );
};


export default VisCorbesNivell3D2D;

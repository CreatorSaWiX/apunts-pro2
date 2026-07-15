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



const VisVectorDirectorAngle = () => {
    const isMobile = useIsMobile();
    const { isFullScreen, resizeKey } = useInteraction();
    const [alpha, setAlpha] = React.useState(Math.PI / 4);
    const [p, setP] = React.useState<[number, number]>([1, 1]);

    const f = (x: number, y: number) => 0.1 * (x * x + y * y);

    // Gradients: df/dx = 0.2x, df/dy = 0.2y
    const grad = { x: 0.2 * p[0], y: 0.2 * p[1] };
    const v = { x: Math.cos(alpha), y: Math.sin(alpha) };
    const dotProduct = grad.x * v.x + grad.y * v.y;
    const gradNorm = Math.sqrt(grad.x ** 2 + grad.y ** 2);

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 ${isFullScreen ? 'h-full' : 'h-[650px] md:h-[650px]'}`}>
            {/* Header Control Panel */}
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex-1 w-full max-w-sm">
                    <div className="flex justify-between items-center mb-1.5 px-1">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Angle de direcció (α)</span>
                        <span className="text-xs font-mono text-white bg-indigo-600 px-2 py-0.5 rounded shadow-lg shadow-indigo-500/20">α = {(alpha * 180 / Math.PI).toFixed(0)}°</span>
                    </div>
                    <input
                        type="range" min="0" max={Math.PI * 2} step="0.01" value={alpha}
                        onChange={(e) => setAlpha(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>

                <div className="flex gap-4 md:gap-8 bg-black/40 px-6 py-3 rounded-2xl border border-white/5 shadow-inner">
                    <div className="text-center">
                        <div className="text-[9px] text-slate-500 uppercase font-black tracking-tighter mb-1">Derivada (∇f · v)</div>
                        <div className={`text-xl font-mono font-black ${dotProduct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {dotProduct.toFixed(2)}
                        </div>
                    </div>
                    <div className="w-px h-8 bg-white/10 self-center" />
                    <div className="text-center">
                        <div className="text-[9px] text-slate-500 uppercase font-black tracking-tighter mb-1">Màxim (||∇f||)</div>
                        <div className="text-xl font-mono font-black text-indigo-400">
                            {gradNorm.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                {/* 2D Domain Section */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/30 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] text-slate-300 font-bold uppercase tracking-widest border border-white/5">Domini (XY)</div>
                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />

                        {/* Escala visual per a que els vectors es vegin (x4) */}
                        {(() => {
                            const vScale = 1.5;
                            const gScale = 5; // El gradient és petit (0.2), el multipliquem més

                            return (
                                <>
                                    {/* Direction Vector v */}
                                    <MafsLine.Segment point1={p} point2={[p[0] + v.x * vScale, p[1] + v.y * vScale]} color={Theme.green} weight={4} />
                                    <MafsLaTeX at={[p[0] + v.x * vScale * 1.2, p[1] + v.y * vScale * 1.2]} tex="\vec{v}" color={Theme.green} />

                                    {/* Gradient Vector grad */}
                                    <MafsLine.Segment point1={p} point2={[p[0] + grad.x * gScale, p[1] + grad.y * gScale]} color={Theme.indigo} weight={4} />
                                    <MafsLaTeX at={[p[0] + grad.x * gScale, p[1] + grad.y * gScale + 0.3]} tex="\nabla f" color={Theme.indigo} />

                                    {/* Projecció visual */}
                                    <MafsLine.Segment point1={p} point2={[p[0] + v.x * dotProduct * vScale, p[1] + v.y * dotProduct * vScale]} color={Theme.pink} weight={6} opacity={0.6} />
                                </>
                            );
                        })()}

                        <MovablePoint point={p} onMove={setP} color={Theme.foreground} />
                    </Mafs>
                    <div className="absolute bottom-4 left-4 flex flex-col gap-1 pointer-events-none">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-green-500" />
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Direcció (Unitari)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-indigo-500" />
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Gradient (Pendents)</span>
                        </div>
                    </div>
                </div>

                {/* 3D Space Section */}
                <div className="relative h-full overflow-hidden bg-slate-950/50">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] text-slate-300 font-bold uppercase tracking-widest border border-white/5">Espai (XYZ)</div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 5, 8]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        <FunctionSurface f={f} showWireframe />

                        {/* Active Point */}
                        <Point position={[p[0], f(p[0], p[1]), p[1]]} color="white" />

                        {/* Directional Plane (Vertical) */}
                        <mesh position={[p[0], 2, p[1]]} rotation={[0, -alpha, 0]}>
                            <planeGeometry args={[10, 8]} />
                            <meshPhongMaterial color="#818cf8" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
                        </mesh>

                        {/* Intersection Curve */}
                        <DirectionalCurvePoints a={p} vx={v.x} vy={v.y} f={f} />

                        {/* Gradient Arrow on surface */}
                        <group position={[p[0], f(p[0], p[1]) + 0.1, p[1]]}>
                            <Arrow memoDir={new THREE.Vector3(grad.x, 0, grad.y).normalize()} length={gradNorm * 2} color={Theme.indigo} head={0.2} width={0.1} />
                        </group>
                    </Canvas>
                </div>
            </div>

            <div className="p-3 bg-slate-950 text-center border-t border-white/10 shrink-0">
                <p className="text-[10px] text-slate-500 italic">
                    Mou el <span className="text-white font-bold">punt blanc</span> al domini per canviar la posició. La derivada és el pendent de la <span className="text-indigo-400 font-bold">corba blava</span> en el punt.
                </p>
            </div>
        </div>
    );
};


export default VisVectorDirectorAngle;

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



const VisDiferencialIncrement = () => {
    const [d, setD] = React.useState<[number, number]>([0.8, 0.8]); // dx, dy
    const a = 1, b = 1; // Punt base fix
    const { isFullScreen, resizeKey } = useInteraction();
    const isMobile = useIsMobile();

    // Funció: f(x,y) = 0.2 * (x^2 + y^2)
    const f = (x: number, y: number) => 0.2 * (x * x + y * y);
    const fx = (x: number) => 0.4 * x;
    const fy = (y: number) => 0.4 * y;

    const f0 = f(a, b);
    const dfx = fx(a), dfy = fy(b);

    const dx = d[0], dy = d[1];
    const incrementReal = f(a + dx, b + dy) - f0;
    const diferencialLineal = dfx * dx + dfy * dy;
    const error = Math.abs(incrementReal - diferencialLineal);

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 rounded-3xl border border-white/10 ${isFullScreen ? 'h-full' : ''}`}>
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest text-slate-500">Diferencial vs Increment</span>
                    <span className="text-[9px] text-slate-500 font-mono italic">Punt base P(1, 1)</span>
                </div>

                <div className="flex gap-2">
                    <div className="bg-black/40 px-3 py-2 rounded-xl border border-white/5 flex flex-col items-center min-w-[80px]">
                        <span className="text-[7px] text-emerald-400 font-black uppercase mb-0.5">Increment (Δf)</span>
                        <span className="text-xs font-mono text-white">{incrementReal.toFixed(3)}</span>
                    </div>
                    <div className="bg-black/40 px-3 py-2 rounded-xl border border-white/5 flex flex-col items-center min-w-[80px]">
                        <span className="text-[7px] text-amber-400 font-black uppercase mb-0.5">Diferencial (df)</span>
                        <span className="text-xs font-mono text-white">{diferencialLineal.toFixed(3)}</span>
                    </div>
                    <div className="bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-500/20 flex flex-col items-center min-w-[80px]">
                        <span className="text-[7px] text-rose-400 font-black uppercase mb-0.5">Error (R_1)</span>
                        <span className="text-xs font-mono text-rose-300">{error.toFixed(4)}</span>
                    </div>
                </div>
            </div>

            <div className={`flex-none md:flex-1 grid grid-cols-1 ${isFullScreen ? 'h-full grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'h-[500px] grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                {/* 2D Control of dx, dy */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/30 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5">Plànol XY: Variació (dx, dy)</div>
                    <Mafs viewBox={{ x: [-2, 2], y: [-2, 2] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Vector tail={[0, 0]} tip={d} color={Theme.yellow} weight={4} />
                        <MovablePoint point={d} onMove={setD} color={Theme.yellow} />
                        <MafsLaTeX at={[d[0], d[1] + 0.3]} tex={`(dx, dy) = (${dx.toFixed(1)}, ${dy.toFixed(1)})`} color={Theme.yellow} />
                    </Mafs>
                </div>

                {/* 3D View */}
                <div className="relative bg-slate-950/50 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5 italic">Geometria de l'aproximació</div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[6, 4, 6]} fov={40} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        <FunctionSurface f={f} showWireframe={true} opacity={0.6} colorScale={1.5} />

                        {/* Punt Base */}
                        <Point position={[a, f0, b]} color="#fbbf24" />

                        {/* Punt Real sobre superfície */}
                        <Point position={[a + dx, f(a + dx, b + dy), b + dy]} color="#10b981" />

                        {/* Punt sobre Pla Tangent */}
                        <Point position={[a + dx, f0 + diferencialLineal, b + dy]} color="#fbbf24" />

                        {/* Línia d'error */}
                        <Line
                            points={[[a + dx, f0 + diferencialLineal, b + dy], [a + dx, f(a + dx, b + dy), b + dy]]}
                            color="#f43f5e"
                            lineWidth={3}
                        />

                        {/* Pla Tangent parcial */}
                        <group position={[a, f0, b]}>
                            <mesh rotation={[-Math.atan(dfx), 0, -Math.atan(dfy)]}>
                                <planeGeometry args={[3, 3]} />
                                <meshPhongMaterial color="#fbbf24" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
</mesh>
                        </group>
                    </Canvas>
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/10 text-center">
                <p className="text-[10px] text-slate-300 italic max-w-2xl mx-auto leading-relaxed">
                    La diferència entre el canvi real de la funció i el diferencial lineal és l'error de l'aproximació ($R_1$). Com més gran és la distància (dx, dy), més gran és aquest error.
                </p>
            </div>
        </div>
    );
};


export default VisDiferencialIncrement;

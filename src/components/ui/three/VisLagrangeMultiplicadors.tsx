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



const VisLagrangeMultiplicadors = () => {
    const [p, setP] = React.useState<[number, number]>([1.5, 1.5]);
    const { isFullScreen, resizeKey } = useInteraction();
    const isMobile = useIsMobile();

    const f = (x: number, y: number) => 0.4 * (x + 2 * y);
    const gradF = { x: 0.4, y: 0.8 };

    const radius = Math.sqrt(5);
    const gradG = (x: number, y: number) => ({ x: 2 * x, y: 2 * y });

    const currentGradG = gradG(p[0], p[1]);
    const gMag = Math.sqrt(currentGradG.x ** 2 + currentGradG.y ** 2);
    const fMag = Math.sqrt(gradF.x ** 2 + gradF.y ** 2);

    const nGradF = { x: gradF.x / fMag, y: gradF.y / fMag };
    const nGradG = { x: currentGradG.x / gMag, y: currentGradG.y / gMag };

    const dot = nGradF.x * nGradG.x + nGradF.y * nGradG.y;
    const isParallel = Math.abs(Math.abs(dot) - 1) < 0.05;

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 rounded-3xl border border-white/10 ${isFullScreen ? 'h-full' : ''}`}>
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Multiplicadors de Lagrange</span>
                    <span className="text-[9px] text-slate-500 font-mono">f(x,y) = x+2y | g(x,y) = x²+y²-5=0</span>
                </div>

                <div className="flex gap-2">
                    <div className={`px-3 py-2 rounded-xl border flex flex-col items-center min-w-[100px] transition-colors ${isParallel ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-black/40 border-white/5'}`}>
                        <span className={`text-[8px] font-black uppercase mb-1 ${isParallel ? 'text-emerald-400' : 'text-slate-500'}`}>Condició ∇f = λ∇g</span>
                        <span className={`text-[10px] font-bold ${isParallel ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {isParallel ? 'EXTREM TROBAT!' : 'EN BUSCA D\'EXTREMS'}
                        </span>
                    </div>
                </div>
            </div>

            <div className={`flex-none md:flex-1 grid grid-cols-1 ${isFullScreen ? 'h-full grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'h-[550px] grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/30 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5 italic">Tangència de Gradients</div>
                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Circle center={[0, 0]} radius={radius} color={Theme.indigo} weight={3} />
                        
                        {[-4, -2, 0, 2, 4].map(k => (
                            <Plot.OfX key={k} y={x => (k - x) / 2} color={Theme.foreground} weight={1} opacity={0.15} />
                        ))}
                        
                        <Plot.OfX y={x => (p[0] + 2 * p[1] - x) / 2} color={Theme.yellow} weight={2} opacity={0.6} />

                        <Vector tail={p} tip={[p[0] + nGradF.x, p[1] + nGradF.y]} color={Theme.yellow} weight={3} />
                        <Vector tail={p} tip={[p[0] + nGradG.x, p[1] + nGradG.y]} color={Theme.indigo} weight={3} />

                        <MovablePoint point={p} onMove={(newP) => {
                            const dist = Math.sqrt(newP[0]**2 + newP[1]**2);
                            setP([newP[0] * radius / dist, newP[1] * radius / dist]);
                        }} color={Theme.foreground} />
                    </Mafs>
                    <div className="absolute bottom-4 left-4 flex flex-col gap-1 pointer-events-none">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-yellow-400" />
                            <span className="text-[8px] text-slate-400 font-black uppercase">Gradient ∇f</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-indigo-500" />
                            <span className="text-[8px] text-slate-400 font-black uppercase">Normal Restricció ∇g</span>
                        </div>
                    </div>
                </div>

                <div className="relative bg-slate-950/50 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5 italic">L'extrem a la muntanya</div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[6, 4, 6]} fov={40} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        <FunctionSurface f={f} showWireframe={true} opacity={0.4} colorScale={3} />
                        
                        <Point position={[p[0], f(p[0], p[1]), p[1]]} color={isParallel ? "#10b981" : "#fbbf24"} />

                        <mesh rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0]}>
                            <torusGeometry args={[radius, 0.05, 16, 100]} />
                            <meshBasicMaterial color="#6366f1" />
                        </mesh>

                        {(() => {
                            const points = Array.from({ length: 100 }, (_, i) => {
                                const angle = (i / 99) * Math.PI * 2;
                                const px = Math.cos(angle) * radius;
                                const py = Math.sin(angle) * radius;
                                return new THREE.Vector3(px, f(px, py), py);
                            });
                            return <Line points={points} color="#6366f1" lineWidth={3} />;
                        })()}
                    </Canvas>
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/10 text-center">
                <p className="text-[10px] text-slate-300 italic max-w-2xl mx-auto leading-relaxed">
                    L'extrem condicionat es troba on les **corbes de nivell** de la funció (grogues) són **tangents** a la restricció (blava). 
                    En aquest punt, els gradients són paral·lels ($\nabla f = \lambda \nabla g$).
                </p>
            </div>
        </div>
    );
};


export default VisLagrangeMultiplicadors;

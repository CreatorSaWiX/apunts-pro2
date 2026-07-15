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



const VisOptimitzacioCompacte = () => {
    const [showCandidates, setShowCandidates] = React.useState(true);
    const { isFullScreen, resizeKey } = useInteraction();
    const isMobile = useIsMobile();

    const f = (x: number, y: number) => 0.2 * (x * x + y * y - 4 * x - 2 * y + 5);
    const critP = [2, 1];
    const center = [1, 1];
    const radius = 2;

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 rounded-3xl border border-white/10 ${isFullScreen ? 'h-full' : ''}`}>
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Optimització en Dominis Compactes</span>
                    <span className="text-[9px] text-slate-500 font-mono italic">Teorema de Weierstrass</span>
                </div>

                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner">
                    <button type="button"
                        onClick={() => setShowCandidates(!showCandidates)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${showCandidates ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {showCandidates ? 'Amagar Candidats' : 'Mostrar Candidats'}
                    </button>
                </div>
            </div>

            <div className={`${isFullScreen ? 'flex-1' : 'h-[500px]'} relative bg-slate-950/50 overflow-hidden border-b border-white/5`}>
                <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5 italic">Candidats: Interior vs Frontera</div>
                <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                    <PerspectiveCamera makeDefault position={[5, 6, 8]} fov={40} />
                    <OrbitControls enableZoom={true} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                    <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                    <FunctionSurface f={f} showWireframe={true} opacity={0.7} colorScale={2} />
                    
                    {(() => {
                        const points = Array.from({ length: 100 }, (_, i) => {
                            const angle = (i / 99) * Math.PI * 2;
                            const px = center[0] + Math.cos(angle) * radius;
                            const py = center[1] + Math.sin(angle) * radius;
                            return new THREE.Vector3(px, f(px, py), py);
                        });
                        return <Line points={points} color="#f43f5e" lineWidth={4} />;
                    })()}

                    {showCandidates && (
                        <>
                            <Point position={[critP[0], f(critP[0], critP[1]), critP[1]]} color="#10b981" />
                            
                            {(() => {
                                const dx = critP[0] - center[0];
                                const dy = critP[1] - center[1];
                                const d = Math.sqrt(dx*dx + dy*dy);
                                const pMin = [center[0] + dx*radius/d, center[1] + dy*radius/d];
                                const pMax = [center[0] - dx*radius/d, center[1] - dy*radius/d];
                                return (
                                    <>
                                        <Point position={[pMin[0], f(pMin[0], pMin[1]), pMin[1]]} color="#f59e0b" />
                                        <Point position={[pMax[0], f(pMax[0], pMax[1]), pMax[1]]} color="#f43f5e" />
                                    </>
                                );
                            })()}
                        </>
                    )}
                </Canvas>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/10 text-center">
                <p className="text-[10px] text-slate-300 italic max-w-2xl mx-auto leading-relaxed">
                    El valor màxim i mínim absolut en un domini compacte sempre es troba o bé en un **punt crític interior** (verd) o bé en la **frontera** (taronja/rosa). 
                    Cal comparar els valors de $f$ en tots els candidats.
                </p>
            </div>
        </div>
    );
};


export default VisOptimitzacioCompacte;

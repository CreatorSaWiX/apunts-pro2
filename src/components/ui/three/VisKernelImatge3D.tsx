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



const VisKernelImatge3D = () => {
    const isMobile = useIsMobile();
    const [p, setP] = React.useState<[number, number, number]>([2, 2, 2]);

    return (
        <div className="w-full h-[600px] relative group flex flex-col bg-slate-950 overflow-hidden border border-white/5 rounded-2xl shadow-2xl">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                        <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">Vector Original (v)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                        <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">Imatge f(v) ∈ Im(f)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" />
                        <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">Nucli Ker(f) (Eix Y)</span>
                    </div>
                </div>
            </div>

            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Alçada (Altura Ker)</span>
                            <input type="range" min="-4" max="4" step="0.1" value={p[1]} onChange={(e) => setP([p[0], parseFloat(e.target.value), p[2]])} className="w-32 accent-rose-500" />
                        </div>
                        <div className="text-[10px] text-slate-400 italic max-w-[150px]">
                            Si l'alçada és 0, el vector cau totalment a la Imatge. Si X i Z són 0, el vector "mor" al Nucli.
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative">
                <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                    <PerspectiveCamera makeDefault position={[8, 5, 8]} />
                    <OrbitControls enableZoom={true} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                    {/* IMAGE PLANE (XY en matema, XZ en ThreeJS grid) */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                        <planeGeometry args={[10, 10]} />
                        <meshStandardMaterial color="#10b981" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
                    </mesh>
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                        <planeGeometry args={[10, 10, 10, 10]} />
                        <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.1} />
                    </mesh>

                    {/* KERNEL LINE (Z axis en matema, Y axis en ThreeJS) */}
                    <Line points={[[0, -5, 0], [0, 5, 0]]} color="#f43f5e" lineWidth={4} opacity={0.6} />

                    {/* Vectors */}
                    <Arrow memoDir={new THREE.Vector3(p[0], p[1], p[2]).normalize()} length={new THREE.Vector3(p[0], p[1], p[2]).length()} color="#3b82f6" head={0.2} width={0.06} />
                    <Arrow memoDir={new THREE.Vector3(p[0], 0, p[2]).normalize()} length={new THREE.Vector3(p[0], 0, p[2]).length()} color="#10b981" head={0.2} width={0.06} />

                    {/* Vertical Projection Line */}
                    <Line points={[[p[0], 0, p[2]], [p[0], p[1], p[2]]]} color="white" lineWidth={1} dashed opacity={0.3} />

                    {/* Points */}
                    <Point position={[p[0], p[1], p[2]]} color="#3b82f6" />
                    <Point position={[p[0], 0, p[2]]} color="#10b981" />

                    {/* Interaction Domain */}
                    <Html position={[p[0], p[1] + 0.5, p[2]]}>
                        <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] text-white font-mono border border-white/10 whitespace-nowrap">
                            v = ({p[0].toFixed(1)}, {p[1].toFixed(1)}, {p[2].toFixed(1)})
                        </div>
                    </Html>

                    {/* Labels */}
                    <Text position={[5, 0.2, 5]} color="#10b981" fontSize={0.3} rotation={[-Math.PI / 2, 0, 0]}>Imatge (Pla)</Text>
                    <Text position={[0.5, 4.5, 0]} color="#f43f5e" fontSize={0.3}>Nucli (Eix)</Text>
                </Canvas>
            </div>

            <div className="p-4 bg-slate-900 border-t border-white/10 flex justify-between items-center px-8">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 uppercase font-black">Control Domini (XZ)</span>
                    <div className="flex items-center gap-4">
                        <input type="range" min="-4" max="4" step="0.1" value={p[0]} onChange={(e) => setP([parseFloat(e.target.value), p[1], p[2]])} className="w-24 accent-blue-500" />
                        <input type="range" min="-4" max="4" step="0.1" value={p[2]} onChange={(e) => setP([p[0], p[1], parseFloat(e.target.value)])} className="w-24 accent-blue-500" />
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 italic max-w-sm text-right leading-tight">
                    Projectem el vector blava sobre el pla verd. <br />
                    Si el vector cau a l'eix vermell, la seva imatge és zero $\to$ és del **Nucli**.
                </p>
            </div>
        </div>
    );
};


export default VisKernelImatge3D;

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



const VisPlaTangentINormalHibrid = () => {
    const isMobile = useIsMobile();
    const { isFullScreen, resizeKey } = useInteraction();
    const [p, setP] = React.useState<[number, number]>([1, 0.5]);

    // Funció z = 5 * exp(-(x^2 + y^2)/15) (muntanya majestuosa)
    const f = React.useCallback((x: number, y: number) => 5 * Math.exp(-(x * x + y * y) / 15), []);
    const dfx = (x: number, y: number) => f(x, y) * (-2 * x / 15);
    const dfy = (x: number, y: number) => f(x, y) * (-2 * y / 15);

    const a = p[0], b = p[1];
    const fa = f(a, b);
    const da = dfx(a, b);
    const db = dfy(a, b);

    // Vector normal en (da, 1, db) - R3F usa Y com a vertical
    const normalDir = new THREE.Vector3(da, 1, db).normalize();

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full bg-slate-900' : 'h-[600px]'}`}>
            <div className={`p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center ${isFullScreen ? 'justify-start pr-16' : 'justify-between'} gap-4`}>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Pla Tangent i Vector Normal</span>
                    <div className="text-xs font-mono text-white/70">
                        <InlineMath math="z = 5 \cdot e^{-(x^2+y^2)/15}" />
                    </div>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-indigo-300">
                    <InlineMath math={`z \\approx ${fa.toFixed(2)} ${da >= 0 ? '+' : ''} ${da.toFixed(2)}(x ${a >= 0 ? '-' : '+'} ${Math.abs(a).toFixed(1)}) ${db >= 0 ? '+' : ''} ${db.toFixed(2)}(y ${b >= 0 ? '-' : '+'} ${Math.abs(b).toFixed(1)})`} />
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="relative h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/20">
                    <div className="absolute top-2 left-2 z-10 bg-black/40 px-2 py-0.5 rounded text-[9px] text-emerald-300 font-bold uppercase border border-emerald-500/20">Domini (2D)</div>
                    <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        <MovablePoint point={p} onMove={setP} color={Theme.green} />
                    </Mafs>
                </div>

                <div className="relative h-full overflow-hidden bg-slate-950/40">
                    <div className="absolute top-2 left-2 z-10 bg-black/40 px-2 py-0.5 rounded text-[9px] text-indigo-300 font-bold uppercase border border-indigo-500/20">Espai R3 (3D)</div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={40} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        {!isMobile && <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />}

                        <FunctionSurface f={f} showWireframe={true} opacity={0.9} colorScale={5} />

                        {/* Grup del Plànol i Normal */}
                        <group position={[a, fa, b]}>
                            <mesh onUpdate={(self) => self.lookAt(normalDir.clone().add(self.position))}>
                                <planeGeometry args={[4, 4]} />
                                <meshPhongMaterial color="#6366f1" transparent opacity={0.6} side={THREE.DoubleSide} shininess={100} depthWrite={false} />
                            </mesh>

                            <Arrow memoDir={normalDir} color="#fbbf24" length={2.5} head={0.5} width={0.25} />

                            <mesh>
                                <sphereGeometry args={[0.1]} />
                                <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
                            </mesh>
                        </group>

                        <gridHelper args={[10, 10, 0x334155, 0x1e293b]} position={[0, -0.01, 0]} />
                    </Canvas>
                </div>
            </div>
            {!isFullScreen && (
                <div className="p-3 bg-slate-800/30 text-[10px] text-slate-400 text-center border-t border-white/10 italic">
                    El plànol blau és l'únic que "toca" la superfície de forma suau en el punt verd.
                </div>
            )}
        </div>
    );
};


export default VisPlaTangentINormalHibrid;

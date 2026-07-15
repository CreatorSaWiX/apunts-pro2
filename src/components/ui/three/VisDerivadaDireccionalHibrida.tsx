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



const VisDerivadaDireccionalHibrida = () => {
    const isMobile = useIsMobile();
    const [a, setA] = React.useState<[number, number]>([1, 1]);
    const [angle, setAngle] = React.useState(Math.PI / 4);
    const { isFullScreen, resizeKey } = useInteraction();

    const f = (x: number, y: number) => 4 - (x * x + y * y) * 0.2;
    const z0 = f(a[0], a[1]);
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);

    const slope = -0.4 * a[0] * vx - 0.4 * a[1] * vy;

    const curvePoints = Array.from({ length: 50 }, (_, i) => {
        const t = (i / 49) * 8 - 4;
        return [t, f(a[0] + t * vx, a[1] + t * vy)] as [number, number];
    });

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'relative h-[100dvh]' : 'h-[600px] md:min-h-[400px]'}`}>
            <div className={`${isFullScreen ? 'absolute top-0 left-0 right-0 z-20 h-[14dvh] landscape:h-[20dvh] px-2 py-1 bg-black/60 backdrop-blur-md border-b border-white/5 flex flex-wrap justify-start items-center gap-x-4 gap-y-0.5 pr-16' : 'p-4 bg-slate-800/50 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4'}`}>
                <div className="flex gap-3 items-center">
                    <div className="flex flex-col">
                        <span className={`${isFullScreen ? 'text-[7px]' : 'text-[10px]'} text-slate-400 uppercase font-black leading-none mb-0.5`}>Punt a</span>
                        <div className="flex gap-1">
                            <input type="range" min="-2" max="2" step="0.1" value={a[0]} onChange={e => setA([parseFloat(e.target.value), a[1]])} className={`${isFullScreen ? 'w-10 h-0.5' : 'w-16'} accent-indigo-500`} />
                            <input type="range" min="-2" max="2" step="0.1" value={a[1]} onChange={e => setA([a[0], parseFloat(e.target.value)])} className={`${isFullScreen ? 'w-10 h-0.5' : 'w-16'} accent-indigo-500`} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className={`${isFullScreen ? 'text-[7px]' : 'text-[10px]'} text-slate-400 uppercase font-black leading-none mb-0.5`}>Direcció θ</span>
                        <input type="range" min="0" max={Math.PI * 2} step="0.1" value={angle} onChange={e => setAngle(parseFloat(e.target.value))} className={`${isFullScreen ? 'w-16 h-0.5' : 'w-32'} accent-rose-500`} />
                    </div>
                </div>
                <div className={`${isFullScreen ? 'px-1.5 py-0 text-[10px]' : 'px-3 py-1 text-xs md:text-sm'} bg-black/30 rounded-full border border-white/5 font-mono text-white whitespace-nowrap`}>
                    <InlineMath math={`D_{\\vec{v}}f(\\vec{a}) = ${slope.toFixed(2)}`} />
                </div>
            </div>

            <div className={`${isFullScreen ? 'absolute inset-0 pt-[14dvh] landscape:pt-[20dvh] grid grid-cols-1 grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 min-h-[600px] md:min-h-[400px]'}`}>
                <div className={`relative border-white/5 bg-slate-950/20 overflow-hidden ${isFullScreen ? 'border-b landscape:border-b-0 landscape:border-r h-full' : 'border-b md:border-b-0 md:border-r h-full'}`}>
                    <div className="absolute top-2 left-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-indigo-300 font-bold border border-indigo-500/30">
                        VISTA DEL TALL (Plànol π)
                    </div>
                    <Mafs viewBox={{ x: [-4, 4], y: [0, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        <Polygon points={[...curvePoints, [4, 0], [-4, 0]]} color={Theme.indigo} fillOpacity={0.05} weight={0} />
                        <Plot.OfX y={t => f(a[0] + t * vx, a[1] + t * vy)} color={Theme.indigo} weight={3} />
                        <Plot.OfX y={t => z0 + slope * t} color={Theme.pink} weight={2} style="dashed" />
                        <Circle center={[0, z0]} radius={0.1} color={Theme.pink} fillOpacity={1} />
                        <MafsLaTeX at={[0, z0 + 0.5]} tex="f(\vec{a})" color={Theme.foreground} />
                    </Mafs>
                </div>

                <div className={`relative bg-slate-950/40 overflow-hidden h-full`}>
                    <div className="absolute top-2 left-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-rose-300 font-bold border border-rose-500/30">
                        CONTEXT 3D (Pastís)
                    </div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[6, 6, 6]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <FunctionSurface f={(x, y) => f(x, y)} showWireframe={true} opacity={0.6} colorScale={1.2} />
                        <group rotation={[0, -angle, 0]} position={[a[0], 0, a[1]]}>
                            <mesh position={[0, 2.5, 0]}>
                                <planeGeometry args={[10, 5]} />
                                <meshPhongMaterial color="#f43f5e" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
                            </mesh>
                        </group>

                        <DirectionalCurvePoints a={a} vx={vx} vy={vy} f={f} />

                        <mesh position={[a[0], z0, a[1]]}>
                            <sphereGeometry args={[0.15]} />
                            <meshStandardMaterial color="#f43f5e" />
                        </mesh>
                        <gridHelper args={[10, 10, 0x334155, 0x1e293b]} position={[0, 0.01, 0]} />
                    </Canvas>
                </div>
            </div>
            <div className="p-3 bg-slate-800/30 text-[10px] text-slate-400 italic text-center border-t border-white/5">
                Fixa't que a l'esquerra veiem un problema de càlcul 1 (una corba i una tangent), mentre que a la dreta veiem el context 3D d'on prové aquesta corba.
            </div>
        </div>
    );
};


export default VisDerivadaDireccionalHibrida;

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
import VisParaboloide from './VisParaboloide';

interface ThreeVisualizerProps {
    type: string;
}

import { Arrow, DirectionalCurvePoints, hasWebGL, ThreeErrorBoundary, FunctionSurface, Point } from './utils3d';



const VisSuperficiesBasiques3D = () => {
    const [mode, setMode] = React.useState('pla');

    const renderSurface = () => {
        switch (mode) {
            case 'pla':
                return (
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[10, 10, 20, 20]} />
                        <meshPhongMaterial color="#4488ff" side={THREE.DoubleSide} transparent opacity={0.6} />
                        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.2} side={THREE.DoubleSide} />
                    </mesh>
                );
            case 'esfera':
                return (
                    <group>
                        <mesh>
                            <sphereGeometry args={[3, 32, 32]} />
                            <meshPhongMaterial color="#ff4488" transparent opacity={0.6} />
                        </mesh>
                        <mesh>
                            <sphereGeometry args={[3.01, 32, 20]} />
                            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.15} />
                        </mesh>
                    </group>
                );
            case 'cilindre':
                return (
                    <group>
                        <mesh>
                            <cylinderGeometry args={[2, 2, 10, 32, 10]} />
                            <meshPhongMaterial color="#44ff88" transparent opacity={0.6} />
                        </mesh>
                        <mesh>
                            <cylinderGeometry args={[2.01, 2.01, 10, 32, 10]} />
                            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.15} />
                        </mesh>
                    </group>
                );
            case 'paraboloide':
                return <VisParaboloide showWireframe={true} />;
            default: return null;
        }
    };

    return (
        <>
            <group>
                {renderSurface()}
            </group>
            <Html position={[-8, 6, 0]}>
                <div className="flex flex-col gap-2 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 w-40">
                    {['pla', 'esfera', 'cilindre', 'paraboloide'].map((m) => (
                        <button type="button"
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all ${mode === m ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </Html>
        </>
    );
};



export default VisSuperficiesBasiques3D;

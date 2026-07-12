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

// Helper to avoid thousands of ArrowHelper allocations
const Arrow = ({ memoDir, length, color, head, width }: any) => {
    const helper = useMemo(() => new THREE.ArrowHelper(memoDir, new THREE.Vector3(0, 0, 0), length, color, head, width), [memoDir, length, color, head, width]);
    return <primitive object={helper} />;
}

// Helper to avoid heavy geometry recalculations every frame
const DirectionalCurvePoints = ({ a, vx, vy, f }: any) => {
    const curvePoints = useMemo(() => {
        const points = Array.from({ length: 50 }, (_, i) => {
            const t = (i / 49) * 8 - 4;
            return [a[0] + t * vx, f(a[0] + t * vx, a[1] + t * vy), a[1] + t * vy];
        });
        return new Float32Array(points.flat());
    }, [a, vx, vy, f]);

    return (
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[curvePoints, 3]}
                    count={curvePoints.length / 3}
                />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="#818cf8" linewidth={3} />
        </line>
    );
}

// Detecció de suport WebGL per a Windows/Linux amb drivers antics
function hasWebGL(): boolean {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!ctx;
    } catch {
        return false;
    }
}

// Error Boundary per capturar errors de R3F sense fer petar la pàgina
class ThreeErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean, error: string }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: '' };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error: error.message };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-[500px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 my-8 flex flex-col items-center justify-center gap-4 p-8">
                    <div className="text-4xl">⚠️</div>
                    <p className="text-amber-400 font-semibold text-center">No s'ha pogut carregar la visualització 3D</p>
                    <p className="text-slate-500 text-sm text-center max-w-sm">
                        El teu navegador o sistema no suporta WebGL (necessari per a gràfics 3D).
                        Prova amb Chrome o Firefox actualitzats, o comprova que els drivers de gràfics estan al dia.
                    </p>
                    <code className="text-xs text-slate-600 bg-slate-900 px-3 py-1 rounded-lg">{this.state.error}</code>
                </div>
            );
        }
        return this.props.children;
    }
}

const FunctionSurface = ({ f, colorScale = 5, showWireframe = false, opacity = 1 }: { f: (x: number, y: number) => number, colorScale?: number, showWireframe?: boolean, opacity?: number }) => {
    const isMobile = useIsMobile();
    const size = 10;
    const segments = isMobile ? 50 : 64;

    const geometry = useMemo(() => {
        const positions = [];
        const indices = [];
        const colors = [];

        const step = size / segments;

        for (let j = 0; j <= segments; j++) {
            for (let i = 0; i <= segments; i++) {
                const x = i * step - size / 2;
                const y = j * step - size / 2;
                const z = f(x, y);
                positions.push(x, z, y);

                // Color basat en l'alçada (gradient)
                const color = new THREE.Color();
                color.setHSL(0.6 - Math.min(Math.max(z / colorScale, -0.5), 0.5), 0.8, 0.5);
                colors.push(color.r, color.g, color.b);
            }
        }

        for (let j = 0; j < segments; j++) {
            for (let i = 0; i < segments; i++) {
                const a = i + (segments + 1) * j;
                const b = (i + 1) + (segments + 1) * j;
                const c = i + (segments + 1) * (j + 1);
                const d = (i + 1) + (segments + 1) * (j + 1);

                indices.push(a, d, b);
                indices.push(a, c, d);
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geo.setIndex(indices);
        geo.computeVertexNormals();
        return geo;
    }, [f]);

    return (
        <group>
            <mesh geometry={geometry}>
                <meshPhongMaterial
                    transparent={opacity < 1}
                    opacity={opacity}
                    side={THREE.DoubleSide}
                    shininess={100}
                    vertexColors
                />
            </mesh>
            {showWireframe && (
                <mesh geometry={geometry}>
                    <meshBasicMaterial
                        color="#ffffff"
                        wireframe
                        transparent
                        opacity={0.15}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}
        </group>
    );
};

const Point = ({ position, color = "white" }: { position: [number, number, number], color?: string }) => (
    <mesh position={position}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
);


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

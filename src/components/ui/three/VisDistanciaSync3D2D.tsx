import React, { useMemo, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Stars, Text, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '../../hooks/useIsMobile';
import { Mafs, Coordinates, Plot, Theme, LaTeX as MafsLaTeX, Circle, Polygon, MovablePoint, Line as MafsLine, Vector } from "mafs";
import { InlineMath } from 'react-katex';
import "mafs/core.css";
import { InteractionLock } from "../InteractionLock";
import { useInteraction } from '../../contexts/InteractionContext';

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


const VisDistanciaSync3D2D = () => {
    const isMobile = useIsMobile();
    const [p1, setP1] = React.useState<[number, number, number]>([1, 1, 0.5]);
    const [p2, setP2] = React.useState<[number, number, number]>([4, 3, 2]);
    const { isFullScreen, resizeKey } = useInteraction();

    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const dz = p2[2] - p1[2];
    const dist2D = Math.sqrt(dx * dx + dy * dy);
    const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full' : 'h-[500px]'}`}>
            <div className={`p-4 bg-slate-800/50 border-b border-white/10 flex flex-wrap items-center justify-between gap-4`}>
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase">Alçada P1 (z)</span>
                        <input type="range" min="0" max="4" step="0.1" value={p1[2]} onChange={(e) => setP1([p1[0], p1[1], parseFloat(e.target.value)])} className="w-24 accent-blue-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase">Alçada P2 (z)</span>
                        <input type="range" min="0" max="4" step="0.1" value={p2[2]} onChange={(e) => setP2([p2[0], p2[1], parseFloat(e.target.value)])} className="w-24 accent-red-500" />
                    </div>
                </div>
                <div className="bg-black/30 px-4 py-2 rounded-xl border border-white/5 flex gap-6">
                    <div className="text-center">
                        <div className="text-[8px] text-slate-500 uppercase">Distància 2D</div>
                        <div className="text-sm font-mono font-bold text-blue-400">{dist2D.toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[8px] text-slate-500 uppercase">Distància 3D</div>
                        <div className="text-sm font-mono font-bold text-indigo-400">{dist3D.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="border-b md:border-b-0 md:border-r border-white/5 relative bg-slate-950/20 h-full overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 pointer-events-none">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Projecció XY (2D)</span>
                    </div>
                    <Mafs viewBox={{ x: [-1, 6], y: [-1, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        <Plot.OfX y={() => p1[1]} color={Theme.blue} style="dashed" opacity={0.3} />
                        <MafsLine.Segment point1={[p1[0], p1[1]]} point2={[p2[0], p2[1]]} color={Theme.blue} weight={3} />
                        <MovablePoint point={[p1[0], p1[1]]} onMove={([x, y]) => setP1([x, y, p1[2]])} color={Theme.blue} />
                        <MovablePoint point={[p2[0], p2[1]]} onMove={([x, y]) => setP2([x, y, p2[2]])} color={Theme.red} />
                        <MafsLaTeX at={[(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 + 0.4]} tex="d_{2D}" color={Theme.blue} />
                    </Mafs>
                </div>

                <div className="relative h-full overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 pointer-events-none">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Espai R3 (3D)</span>
                    </div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 5, 8]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        {/* Punts i Línia 3D */}
                        <Point position={p1} color="#3b82f6" />
                        <Point position={p2} color="#ef4444" />
                        <mesh>
                            <Line points={[p1, p2]} color="#6366f1" lineWidth={3} />
                        </mesh>

                        {/* Components de distància */}
                        <Line points={[p1, [p2[0], p1[1], p1[2]]]} color="#ffffff" lineWidth={1} dashed />
                        <Line points={[[p2[0], p1[1], p1[2]], [p2[0], p2[1], p1[2]]]} color="#ffffff" lineWidth={1} dashed />
                        <Line points={[[p2[0], p2[1], p1[2]], p2]} color="#ffffff" lineWidth={1} dashed />
                    </Canvas>
                </div>
            </div>
        </div>
    );
};


export default VisDistanciaSync3D2D;

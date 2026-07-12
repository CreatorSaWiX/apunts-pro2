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

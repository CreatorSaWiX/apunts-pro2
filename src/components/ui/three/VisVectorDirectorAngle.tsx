import React, { useMemo, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Stars, Text, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '../../hooks/useIsMobile';
import { Mafs, Coordinates, Plot, Theme, LaTeX as MafsLaTeX, Circle, Polygon, MovablePoint, Line as MafsLine, Vector } from "mafs";
import { InlineMath } from 'react-katex';
import "mafs/core.css";
import { InteractionLock } from './InteractionLock';
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


const VisVectorDirectorAngle = () => {
    const isMobile = useIsMobile();
    const { isFullScreen, resizeKey } = useInteraction();
    const [alpha, setAlpha] = React.useState(Math.PI / 4);
    const [p, setP] = React.useState<[number, number]>([1, 1]);

    const f = (x: number, y: number) => 0.1 * (x * x + y * y);

    // Gradients: df/dx = 0.2x, df/dy = 0.2y
    const grad = { x: 0.2 * p[0], y: 0.2 * p[1] };
    const v = { x: Math.cos(alpha), y: Math.sin(alpha) };
    const dotProduct = grad.x * v.x + grad.y * v.y;
    const gradNorm = Math.sqrt(grad.x ** 2 + grad.y ** 2);

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 ${isFullScreen ? 'h-full' : 'h-[650px] md:h-[650px]'}`}>
            {/* Header Control Panel */}
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex-1 w-full max-w-sm">
                    <div className="flex justify-between items-center mb-1.5 px-1">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Angle de direcció (α)</span>
                        <span className="text-xs font-mono text-white bg-indigo-600 px-2 py-0.5 rounded shadow-lg shadow-indigo-500/20">α = {(alpha * 180 / Math.PI).toFixed(0)}°</span>
                    </div>
                    <input
                        type="range" min="0" max={Math.PI * 2} step="0.01" value={alpha}
                        onChange={(e) => setAlpha(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>

                <div className="flex gap-4 md:gap-8 bg-black/40 px-6 py-3 rounded-2xl border border-white/5 shadow-inner">
                    <div className="text-center">
                        <div className="text-[9px] text-slate-500 uppercase font-black tracking-tighter mb-1">Derivada (∇f · v)</div>
                        <div className={`text-xl font-mono font-black ${dotProduct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {dotProduct.toFixed(2)}
                        </div>
                    </div>
                    <div className="w-px h-8 bg-white/10 self-center" />
                    <div className="text-center">
                        <div className="text-[9px] text-slate-500 uppercase font-black tracking-tighter mb-1">Màxim (||∇f||)</div>
                        <div className="text-xl font-mono font-black text-indigo-400">
                            {gradNorm.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                {/* 2D Domain Section */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/30 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] text-slate-300 font-bold uppercase tracking-widest border border-white/5">Domini (XY)</div>
                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />

                        {/* Escala visual per a que els vectors es vegin (x4) */}
                        {(() => {
                            const vScale = 1.5;
                            const gScale = 5; // El gradient és petit (0.2), el multipliquem més

                            return (
                                <>
                                    {/* Direction Vector v */}
                                    <MafsLine.Segment point1={p} point2={[p[0] + v.x * vScale, p[1] + v.y * vScale]} color={Theme.green} weight={4} />
                                    <MafsLaTeX at={[p[0] + v.x * vScale * 1.2, p[1] + v.y * vScale * 1.2]} tex="\vec{v}" color={Theme.green} />

                                    {/* Gradient Vector grad */}
                                    <MafsLine.Segment point1={p} point2={[p[0] + grad.x * gScale, p[1] + grad.y * gScale]} color={Theme.indigo} weight={4} />
                                    <MafsLaTeX at={[p[0] + grad.x * gScale, p[1] + grad.y * gScale + 0.3]} tex="\nabla f" color={Theme.indigo} />

                                    {/* Projecció visual */}
                                    <MafsLine.Segment point1={p} point2={[p[0] + v.x * dotProduct * vScale, p[1] + v.y * dotProduct * vScale]} color={Theme.pink} weight={6} opacity={0.6} />
                                </>
                            );
                        })()}

                        <MovablePoint point={p} onMove={setP} color={Theme.foreground} />
                    </Mafs>
                    <div className="absolute bottom-4 left-4 flex flex-col gap-1 pointer-events-none">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-green-500" />
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Direcció (Unitari)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-indigo-500" />
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Gradient (Pendents)</span>
                        </div>
                    </div>
                </div>

                {/* 3D Space Section */}
                <div className="relative h-full overflow-hidden bg-slate-950/50">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] text-slate-300 font-bold uppercase tracking-widest border border-white/5">Espai (XYZ)</div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 5, 8]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        <FunctionSurface f={f} showWireframe />

                        {/* Active Point */}
                        <Point position={[p[0], f(p[0], p[1]), p[1]]} color="white" />

                        {/* Directional Plane (Vertical) */}
                        <mesh position={[p[0], 2, p[1]]} rotation={[0, -alpha, 0]}>
                            <planeGeometry args={[10, 8]} />
                            <meshPhongMaterial color="#818cf8" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
                        </mesh>

                        {/* Intersection Curve */}
                        <DirectionalCurvePoints a={p} vx={v.x} vy={v.y} f={f} />

                        {/* Gradient Arrow on surface */}
                        <group position={[p[0], f(p[0], p[1]) + 0.1, p[1]]}>
                            <Arrow memoDir={new THREE.Vector3(grad.x, 0, grad.y).normalize()} length={gradNorm * 2} color={Theme.indigo} head={0.2} width={0.1} />
                        </group>
                    </Canvas>
                </div>
            </div>

            <div className="p-3 bg-slate-950 text-center border-t border-white/10 shrink-0">
                <p className="text-[10px] text-slate-500 italic">
                    Mou el <span className="text-white font-bold">punt blanc</span> al domini per canviar la posició. La derivada és el pendent de la <span className="text-indigo-400 font-bold">corba blava</span> en el punt.
                </p>
            </div>
        </div>
    );
};


export default VisVectorDirectorAngle;

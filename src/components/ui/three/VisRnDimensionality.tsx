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


const VisRnDimensionality = () => {
    const [n, setN] = React.useState(2);
    const [mode, setMode] = React.useState<'single' | 'sum' | 'product'>('single');
    const isMobile = useIsMobile();
    const { isFullScreen, resizeKey } = useInteraction();

    // Primary Vector State
    const [v1_2d, setV1_2d] = React.useState<[number, number]>([2, 1]);
    const [v1_3d, setV1_3d] = React.useState<[number, number, number]>([2, 2, 2]);

    // Secondary Vector State (for Sum)
    const [v2_2d, setV2_2d] = React.useState<[number, number]>([1, 2]);
    const [v2_3d, setV2_3d] = React.useState<[number, number, number]>([-1, 2, 1]);

    // Scalar State (for Product)
    const [scalar, setScalar] = React.useState<number>(1.5);

    const renderContent = () => {
        if (n === 1) {
            const vSum = v1_2d[0] + v2_2d[0];
            const vProd = v1_2d[0] * scalar;
            return (
                <div className="h-full bg-slate-950/20">
                    <Mafs viewBox={{ x: [-5, 5], y: [-1, 1] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian subdivisions={5} />

                        {mode === 'single' && (
                            <>
                                <MovablePoint point={[v1_2d[0], 0]} onMove={(p) => setV1_2d([p[0], 0])} color={Theme.blue} />
                                <MafsLaTeX at={[v1_2d[0], 0.4]} tex={`x = ${v1_2d[0].toFixed(1)}`} color={Theme.blue} />
                            </>
                        )}

                        {mode === 'sum' && (
                            <>
                                <MovablePoint point={[v1_2d[0], 0]} onMove={(p) => setV1_2d([p[0], 0])} color={Theme.blue} />
                                <MovablePoint point={[v2_2d[0], 0]} onMove={(p) => setV2_2d([p[0], 0])} color={Theme.red} />
                                <Circle center={[vSum, 0]} radius={0.15} color={Theme.yellow} fillOpacity={1} />
                                <MafsLaTeX at={[v1_2d[0], 0.4]} tex="x" color={Theme.blue} />
                                <MafsLaTeX at={[v2_2d[0], 0.4]} tex="y" color={Theme.red} />
                                <MafsLaTeX at={[vSum, -0.4]} tex="x+y" color={Theme.yellow} />
                            </>
                        )}

                        {mode === 'product' && (
                            <>
                                <MovablePoint point={[v1_2d[0], 0]} onMove={(p) => setV1_2d([p[0], 0])} color={Theme.blue} />
                                <Circle center={[vProd, 0]} radius={0.15} color={Theme.yellow} fillOpacity={1} />
                                <MafsLaTeX at={[v1_2d[0], 0.4]} tex="x" color={Theme.blue} />
                                <MafsLaTeX at={[vProd, -0.4]} tex={`\\lambda x`} color={Theme.yellow} />
                            </>
                        )}

                        <MafsLaTeX at={[0, -0.7]} tex="\mathbb{R}^1 \text{ (La Recta Real)}" color={Theme.foreground} />
                    </Mafs>
                </div>
            );
        }
        if (n === 2) {
            const vSum: [number, number] = [v1_2d[0] + v2_2d[0], v1_2d[1] + v2_2d[1]];
            const vProd: [number, number] = [v1_2d[0] * scalar, v1_2d[1] * scalar];
            return (
                <div className="h-full bg-slate-950/20">
                    <Mafs viewBox={{ x: [-5, 5], y: [-4, 4] }} pan={true} zoom={true}>
                        <Coordinates.Cartesian />

                        {mode === 'single' && (
                            <>
                                <MafsLine.Segment point1={[0, 0]} point2={v1_2d} color={Theme.indigo} weight={3} />
                                <MovablePoint point={v1_2d} onMove={setV1_2d} color={Theme.indigo} />
                                <MafsLaTeX at={[v1_2d[0], v1_2d[1] + 0.4]} tex={`v = (${v1_2d[0].toFixed(1)}, ${v1_2d[1].toFixed(1)})`} color={Theme.indigo} />
                            </>
                        )}

                        {mode === 'sum' && (
                            <>
                                <MafsLine.Segment point1={[0, 0]} point2={v1_2d} color={Theme.blue} weight={2} />
                                <MafsLine.Segment point1={[0, 0]} point2={v2_2d} color={Theme.red} weight={2} />
                                <MafsLine.Segment point1={v1_2d} point2={vSum} color={Theme.red} weight={1} style="dashed" />
                                <MafsLine.Segment point1={v2_2d} point2={vSum} color={Theme.blue} weight={1} style="dashed" />
                                <MafsLine.Segment point1={[0, 0]} point2={vSum} color={Theme.yellow} weight={3} />

                                <MovablePoint point={v1_2d} onMove={setV1_2d} color={Theme.blue} />
                                <MovablePoint point={v2_2d} onMove={setV2_2d} color={Theme.red} />

                                <MafsLaTeX at={v1_2d} tex="u" color={Theme.blue} />
                                <MafsLaTeX at={v2_2d} tex="v" color={Theme.red} />
                                <MafsLaTeX at={vSum} tex="u+v" color={Theme.yellow} />
                            </>
                        )}

                        {mode === 'product' && (
                            <>
                                <MafsLine.Segment point1={[0, 0]} point2={v1_2d} color={Theme.blue} weight={2} />
                                <MafsLine.Segment point1={[0, 0]} point2={vProd} color={Theme.yellow} weight={3} />
                                <MovablePoint point={v1_2d} onMove={setV1_2d} color={Theme.blue} />
                                <MafsLaTeX at={v1_2d} tex="v" color={Theme.blue} />
                                <MafsLaTeX at={vProd} tex="\lambda v" color={Theme.yellow} />
                            </>
                        )}

                        <MafsLaTeX at={[0, -3.5]} tex="\mathbb{R}^2 \text{ (El Pla)}" color={Theme.foreground} />
                    </Mafs>
                </div>
            );
        }

        // 3D Render
        const vSum3d: [number, number, number] = [v1_3d[0] + v2_3d[0], v1_3d[1] + v2_3d[1], v1_3d[2] + v2_3d[2]];
        const vProd3d: [number, number, number] = [v1_3d[0] * scalar, v1_3d[1] * scalar, v1_3d[2] * scalar];

        return (
            <div className="h-full bg-slate-950/40 relative">
                <Canvas shadows dpr={isMobile ? 1 : [1, 2]}>
                    <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
                    <OrbitControls enableZoom={true} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                    {/* Primary Vector */}
                    <group>
                        <Arrow memoDir={new THREE.Vector3(...v1_3d).normalize()} length={new THREE.Vector3(...v1_3d).length()} color={mode === 'single' ? "#6366f1" : "rgba(99, 102, 241, 0.6)"} head={0.4} width={0.2} />
                        <Html position={v1_3d}>
                            <div className="bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[10px] text-indigo-300 font-mono">
                                {mode === 'single' ? `v = (${v1_3d.map(c => c.toFixed(1)).join(',')})` : 'u'}
                            </div>
                        </Html>
                    </group>

                    {/* Sum Mode Visuals */}
                    {mode === 'sum' && (
                        <>
                            <Arrow memoDir={new THREE.Vector3(...v2_3d).normalize()} length={new THREE.Vector3(...v2_3d).length()} color="rgba(239, 68, 68, 0.6)" head={0.4} width={0.15} />
                            <Arrow memoDir={new THREE.Vector3(...vSum3d).normalize()} length={new THREE.Vector3(...vSum3d).length()} color="#eab308" head={0.4} width={0.2} />

                            {/* Dotted Parallelogram lines */}
                            <Line points={[v1_3d, vSum3d]} color="#ef4444" lineWidth={1} dashed dashScale={5} />
                            <Line points={[v2_3d, vSum3d]} color="#6366f1" lineWidth={1} dashed dashScale={5} />

                            <Html position={v2_3d}><div className="text-[10px] text-red-400 font-mono">v</div></Html>
                            <Html position={vSum3d}><div className="bg-yellow-500/20 backdrop-blur-sm px-1.5 rounded text-[10px] text-yellow-500 font-bold">u+v</div></Html>
                        </>
                    )}

                    {/* Product Mode Visuals */}
                    {mode === 'product' && (
                        <>
                            <Arrow memoDir={new THREE.Vector3(...vProd3d).normalize()} length={new THREE.Vector3(...vProd3d).length()} color="#eab308" head={0.4} width={0.2} />
                            <Html position={vProd3d}><div className="text-[10px] text-yellow-500 font-bold bg-black/40 px-1 rounded">λv</div></Html>
                        </>
                    )}

                    <axesHelper args={[3]} />
                </Canvas>

                {/* Right Control Panel (for n=3 or complex modes) */}
                <div className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl w-56 space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Configuració</span>
                    </div>

                    {/* Vector 1 Controls */}
                    <div className="space-y-2">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{mode === 'sum' ? 'Vector u' : 'Vector v'}</span>
                        {(['x', 'y', 'z'] as const).slice(0, n).map((axis, i) => (
                            <div key={axis} className="space-y-1">
                                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                                    <span>{axis.toUpperCase()}</span>
                                    <span className={mode === 'sum' ? 'text-indigo-400' : 'text-white'}>{n === 3 ? v1_3d[i].toFixed(1) : v1_2d[i].toFixed(1)}</span>
                                </div>
                                <input
                                    type="range" min="-4" max="4" step="0.1"
                                    value={n === 3 ? v1_3d[i] : v1_2d[i]}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        if (n === 3) {
                                            const next = [...v1_3d] as [number, number, number];
                                            next[i] = val;
                                            setV1_3d(next);
                                        } else {
                                            const next = [...v1_2d] as [number, number];
                                            next[i] = val;
                                            setV1_2d(next);
                                        }
                                    }}
                                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Vector 2 Controls (Sum Mode ONLY) */}
                    {mode === 'sum' && (
                        <div className="space-y-2 pt-2 border-t border-white/5">
                            <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider">Vector v</span>
                            {(['x', 'y', 'z'] as const).slice(0, n).map((axis, i) => (
                                <div key={axis} className="space-y-1">
                                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                                        <span>{axis.toUpperCase()}</span>
                                        <span className="text-red-400">{n === 3 ? v2_3d[i].toFixed(1) : v2_2d[i].toFixed(1)}</span>
                                    </div>
                                    <input
                                        type="range" min="-4" max="4" step="0.1"
                                        value={n === 3 ? v2_3d[i] : v2_2d[i]}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (n === 3) {
                                                const next = [...v2_3d] as [number, number, number];
                                                next[i] = val;
                                                setV2_3d(next);
                                            } else {
                                                const next = [...v2_2d] as [number, number];
                                                next[i] = val;
                                                setV2_2d(next);
                                            }
                                        }}
                                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Escalar Controls (Product Mode ONLY) */}
                    {mode === 'product' && (
                        <div className="space-y-2 pt-2 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] text-yellow-500 font-bold uppercase tracking-wider">Escalar λ</span>
                                <span className="text-white text-xs font-mono">{scalar.toFixed(1)}</span>
                            </div>
                            <input
                                type="range" min="-3" max="3" step="0.1" value={scalar}
                                onChange={(e) => setScalar(parseFloat(e.target.value))}
                                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                            />
                        </div>
                    )}
                </div>

                <div className="absolute top-4 left-4 z-10 bg-black/40 px-3 py-1 rounded-lg border border-white/10 text-[10px] text-slate-300 font-bold tracking-widest uppercase">
                    R{n === 1 ? ' (Recta)' : n === 2 ? '² (Pla)' : '³ (Espai)'}
                </div>
            </div>
        );
    };

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full bg-slate-900 border-none rounded-none' : 'h-[600px] border border-white/5 rounded-2xl shadow-2xl'}`}>
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Dimensió n</span>
                    <input
                        type="range" min="1" max="3" step="1" value={n}
                        onChange={(e) => setN(parseInt(e.target.value))}
                        className="flex-1 md:w-32 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                    />
                    <span className="text-xs font-mono text-white bg-indigo-600 px-2 py-0.5 rounded shadow-lg shadow-indigo-500/20">n = {n}</span>
                </div>

                {/* Mode Selector */}
                <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                    <button type="button" onClick={() => setMode('single')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${mode === 'single' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Vector</button>
                    <button type="button" onClick={() => setMode('sum')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${mode === 'sum' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Suma</button>
                    <button type="button" onClick={() => setMode('product')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${mode === 'product' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Producte</button>
                </div>

                <div className="hidden lg:block text-[10px] font-mono text-slate-400 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                    <InlineMath math={mode === 'single' ? `v \\in \\mathbb{R}^${n}` : mode === 'sum' ? `u+v \\in \\mathbb{R}^${n}` : `\\lambda v \\in \\mathbb{R}^${n}`} />
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
                {renderContent()}
            </div>

            <div className="p-3 bg-slate-950/80 text-[10px] text-slate-500 text-center border-t border-white/5 italic">
                {mode === 'single' && (n === 1 ? "Un vector en 1D és només un component x." : n === 2 ? "En 2D, el vector té dues coordenades." : "En 3D, afegim l'alçada z.")}
                {mode === 'sum' && "Suma component a component (regla del paral·lelogram)."}
                {mode === 'product' && "Escalar el vector manté la direcció (o la inverteix si λ < 0)."}
            </div>
        </div>
    );
};


export default VisRnDimensionality;

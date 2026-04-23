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

const VisPuntsSella = () => {
    const f = (x: number, y: number) => (x * x - y * y) * 0.1;
    return (
        <>
            <FunctionSurface f={f} />
            <Text position={[0, 2, 0]} color="white" fontSize={0.5} maxWidth={200} textAlign="center">
                Punt de Sella (f(x,y) = x² - y²)
            </Text>
        </>
    );
};

const VisParaboloide = ({ showWireframe = false }: { showWireframe?: boolean }) => {
    const f = (x: number, y: number) => (x * x + y * y) * 0.1;
    return (
        <>
            <FunctionSurface f={f} showWireframe={showWireframe} />
            <Text position={[0, 3, 0]} color="white" fontSize={0.5}>
                Paraboloide (f(x,y) = x² + y²)
            </Text>
        </>
    );
};



const VisVectorGradient = () => {
    const f = (x: number, y: number) => 3 * Math.sin(0.3 * x) * Math.cos(0.3 * y);

    // Memoize the arrows to avoid creating thousands of Three.js objects on every render
    const arrows = useMemo(() => {
        return [[-3, -3], [0, 0], [3, 0], [0, 3]].map(([px, py]) => {
            const z = f(px, py);
            const gx = 3 * 0.3 * Math.cos(0.3 * px) * Math.cos(0.3 * py);
            const gy = -3 * 0.3 * Math.sin(0.3 * px) * Math.sin(0.3 * py);
            const dir = new THREE.Vector3(gx, 0, gy).normalize();
            return {
                position: [px, z, py] as [number, number, number],
                helper: new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), 1.5, "#ff4400", 0.3, 0.2)
            };
        });
    }, []);

    return (
        <group>
            <FunctionSurface f={f} />
            {arrows.map((arrow, i) => (
                <group key={i} position={arrow.position}>
                    <primitive object={arrow.helper} />
                    <Point position={[0, 0, 0]} color="white" />
                </group>
            ))}
            <Text position={[0, 4, 0]} color="white" fontSize={0.5} textAlign="center">
                Camps de Vectors: El Gradient (∇f)
            </Text>
        </group>
    );
};

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

const VisMaximLocal = () => {
    const f = (x: number, y: number) => 4 - 0.2 * (x * x + y * y);
    return (
        <>
            <FunctionSurface f={f} colorScale={4} />
            <Point position={[0, 4, 0]} color="#ff4400" />
            <Text position={[0, 5, 0]} color="white" fontSize={0.5} textAlign="center">
                Màxim Relatiu (∇f = 0, Hf {"<"} 0)
            </Text>
        </>
    );
};

const VisMinimLocal = () => {
    const f = (x: number, y: number) => 0.2 * (x * x + y * y);
    return (
        <>
            <FunctionSurface f={f} colorScale={4} />
            <Point position={[0, 0, 0]} color="#00ffff" />
            <Text position={[0, 4, 0]} color="white" fontSize={0.5} textAlign="center">
                Mínim Relatiu (∇f = 0, Hf {">"} 0)
            </Text>
        </>
    );
};

const VisPuntSellaOptim = () => {
    const f = (x: number, y: number) => 0.2 * (x * x - y * y);
    return (
        <>
            <FunctionSurface f={f} colorScale={2} />
            <Point position={[0, 0, 0]} color="#ffff00" />
            <Text position={[0, 3, 0]} color="white" fontSize={0.5} textAlign="center">
                Punt de Sella (Δ {"<"} 0)
            </Text>
        </>
    );
};

const VisTaylor3d = () => {
    const f = (x: number, y: number) => Math.cos(x / 2) * Math.sin(y / 2) * 2;
    const p1 = (_: number, y: number) => y * 0.5;

    return (
        <>
            <FunctionSurface f={f} showWireframe />
            <group position={[0, 0.1, 0]}>
                <FunctionSurface f={p1} showWireframe colorScale={3} />
            </group>
            <Text position={[0, 4, 0]} color="white" fontSize={0.4} textAlign="center">
                Aproximació de Taylor: Superfície vs Pla Tangent
            </Text>
        </>
    );
};


const VisDistancia3D = () => {
    return (
        <>
            <Point position={[-2, 1, -2]} color="#ff4444" />
            <Point position={[3, 4, 3]} color="#ff4444" />
            <Line points={[[-2, 1, -2], [3, 4, 3]]} color="#ff8888" lineWidth={2} />
            <Text position={[0.5, 3, 0.5]} color="white" fontSize={0.4}>
                Distància en R³
            </Text>
        </>
    );
};

const VisEx76c = () => {
    const center = new THREE.Vector3(1 / 3, 1 / 3, 1 / 3);
    const radius = Math.sqrt(2 / 3);
    const normal = new THREE.Vector3(1, 1, 1).normalize();

    return (
        <group>
            {/* Unit Sphere (Transparent) */}
            <mesh>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial color="#3b82f6" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.1} />
            </mesh>

            {/* Plane x + y + z = 1 (Cutout) */}
            <mesh position={center} onUpdate={(self) => self.lookAt(center.clone().add(normal))}>
                <planeGeometry args={[4, 4]} />
                <meshStandardMaterial color="#8b5cf6" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>

            {/* Intersection Disk (The set C) */}
            <mesh position={center} onUpdate={(self) => self.lookAt(center.clone().add(normal))}>
                <circleGeometry args={[radius, 64]} />
                <meshStandardMaterial color="#f43f5e" side={THREE.DoubleSide} emissive="#f43f5e" emissiveIntensity={0.2} />
            </mesh>

            {/* Labels */}
            <Point position={[1, 0, 0]} color="white" />
            <Point position={[0, 1, 0]} color="white" />
            <Point position={[0, 0, 1]} color="white" />

            <Text position={[1.2, 0, 0]} color="white" fontSize={0.2}>(1,0,0)</Text>
            <Text position={[0, 1.2, 0]} color="white" fontSize={0.2}>(0,1,0)</Text>
            <Text position={[0, 0, 1.2]} color="white" fontSize={0.2}>(0,0,1)</Text>
        </group>
    );
};


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
                        <button
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

const VisEx73a = () => {
    const isMobile = useIsMobile();
    const [k, setK] = React.useState<number>(1);
    const f3D = React.useMemo(() => (x: number, y: number) => (x * x - y * y) * 0.2, []);
    const { isFullScreen, resizeKey } = useInteraction();

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full bg-slate-900' : 'h-[600px]'}`}>
            <div className={`p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center ${isFullScreen ? 'justify-start pr-16' : 'justify-between'} gap-4`}>
                <div className="flex items-center gap-3">
                    <span className="bg-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20">Apartat A</span>
                    <span className="text-sm font-mono text-slate-300"><InlineMath math="f(x,y) = x^2 - y^2" /></span>
                </div>
                <div className="flex-1 w-full max-w-sm">
                    <div className="flex justify-between mb-1.5 px-1">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest text-slate-500">Nivell (z)</span>
                        <span className="text-xs font-mono text-white bg-indigo-600 px-2 py-0.5 rounded">{k.toFixed(1)}</span>
                    </div>
                    <input
                        type="range" min="-3" max="3" step="0.5" value={k}
                        onChange={(e) => setK(parseFloat(e.target.value))}
                        className="w-full h-1.2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="relative bg-slate-950/50 h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                    <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        {k > 0 ? (
                            <>
                                <Plot.OfX y={(x) => Math.sqrt(Math.max(0, x * x - k))} color={Theme.indigo} weight={3} />
                                <Plot.OfX y={(x) => -Math.sqrt(Math.max(0, x * x - k))} color={Theme.indigo} weight={3} />
                            </>
                        ) : k < 0 ? (
                            <>
                                <Plot.OfY x={(y) => Math.sqrt(Math.max(0, y * y + k))} color={Theme.indigo} weight={3} />
                                <Plot.OfY x={(y) => -Math.sqrt(Math.max(0, y * y + k))} color={Theme.indigo} weight={3} />
                            </>
                        ) : (
                            <>
                                <Plot.OfX y={(x) => x} color={Theme.indigo} weight={3} />
                                <Plot.OfX y={(x) => -x} color={Theme.indigo} weight={3} />
                            </>
                        )}
                        <MafsLaTeX at={[0, -4]} tex={`x^2 - y^2 = ${k.toFixed(1)}`} color={Theme.indigo} />
                    </Mafs>
                </div>
                <div className="relative h-full overflow-hidden">
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <FunctionSurface f={f3D} showWireframe={true} colorScale={2} />
                        <mesh position={[0, k * 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[10, 10]} />
                            <meshPhongMaterial color="#a855f7" transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
                        </mesh>
                    </Canvas>
                </div>
            </div>
        </div>
    );
};

const VisSubespai3D = () => {
    const isMobile = useIsMobile();
    const { isFullScreen } = useInteraction();
    const u = new THREE.Vector3(2, 1, 1);
    const v = new THREE.Vector3(-1, 2, 0.5);
    const sum = new THREE.Vector3().addVectors(u, v);

    return (
        <div className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-950 ${isFullScreen ? 'h-screen' : 'h-[500px] rounded-2xl border border-white/10 my-8'}`}>
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg">Subespai a ℝ³</span>
                <div className="bg-black/40 backdrop-blur-md p-2 rounded border border-white/10 text-[10px] text-slate-300 font-mono">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <InlineMath math="\vec{u}" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <InlineMath math="\vec{v}" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <InlineMath math="\vec{u} + \vec{v}" />
                    </div>
                </div>
            </div>

            <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                <PerspectiveCamera makeDefault position={[5, 5, 5]} />
                <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                {/* Subspace Plane (Passing through origin) */}
                <mesh rotation={[-Math.PI / 4, 0, 0]}>
                    <planeGeometry args={[10, 10]} />
                    <meshStandardMaterial color="#6366f1" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
                </mesh>

                {/* Vectors */}
                <Arrow memoDir={u.clone().normalize()} length={u.length()} color="#3b82f6" head={0.2} width={0.05} />
                <Arrow memoDir={v.clone().normalize()} length={v.length()} color="#ef4444" head={0.2} width={0.05} />
                <Arrow memoDir={sum.clone().normalize()} length={sum.length()} color="#10b981" head={0.2} width={0.05} />

                {/* Parallelogram Lines */}
                <Line points={[u.toArray(), sum.toArray()]} color="#ffffff" lineWidth={1} dashed opacity={0.3} />
                <Line points={[v.toArray(), sum.toArray()]} color="#ffffff" lineWidth={1} dashed opacity={0.3} />

                {/* Point at Origin */}
                <Point position={[0, 0, 0]} color="white" />
                <Text position={[0.2, 0.2, 0.2]} color="white" fontSize={0.2}>0</Text>
            </Canvas>

            <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
                <p className="text-[10px] text-slate-500 italic bg-black/20 backdrop-blur-sm inline-block px-3 py-1 rounded-full border border-white/5">
                    Un pla que passa per l'origen és un subespai vectorial. Conté el zero i és tancat per operacions.
                </p>
            </div>
        </div>
    );
};

const VisEx78a = () => {
    const isMobile = useIsMobile();
    const [k, setK] = React.useState<number>(1);
    const f3D = React.useMemo(() => (x: number, y: number) => (x * x * y) * 0.1, []);
    const { isFullScreen, resizeKey } = useInteraction();

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full bg-slate-900' : 'h-[600px]'}`}>
            <div className={`p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center ${isFullScreen ? 'justify-start pr-16' : 'justify-between'} gap-4`}>
                <div className="flex items-center gap-3">
                    <span className="bg-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20">Apartat A</span>
                    <span className="text-sm font-mono text-slate-300"><InlineMath math="z = x^2 y" /></span>
                </div>
                <div className="flex-1 w-full max-w-sm">
                    <div className="flex justify-between mb-1.5 px-1">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest text-slate-500">Nivell (z)</span>
                        <span className="text-xs font-mono text-white bg-blue-600 px-2 py-0.5 rounded">{k.toFixed(1)}</span>
                    </div>
                    <input
                        type="range" min="-2" max="2" step="1" value={k}
                        onChange={(e) => setK(parseFloat(e.target.value))}
                        className="w-full h-1.2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="relative bg-slate-950/50 h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                    <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        {k === 0 ? (
                            <>
                                <Plot.OfX y={() => 0} color={Theme.blue} weight={3} />
                                <Plot.OfY x={() => 0} color={Theme.blue} weight={3} />
                            </>
                        ) : (
                            <>
                                <Plot.OfX y={(x) => (x ** 2 > 0.01 ? k / (x ** 2) : NaN)} color={Theme.blue} weight={3} />
                                <Plot.OfX y={(x) => (x ** 2 > 0.01 ? k / (x ** 2) : NaN)} color={Theme.blue} weight={3} />
                            </>
                        )}
                        <MafsLaTeX at={[0, -4]} tex={`x^2 y = ${k.toFixed(1)}`} color={Theme.blue} />
                    </Mafs>
                </div>
                <div className="relative h-full overflow-hidden">
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <FunctionSurface f={f3D} showWireframe={true} colorScale={1} />
                        <mesh position={[0, k * 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[10, 10]} />
                            <meshPhongMaterial color="#3b82f6" transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
                        </mesh>
                    </Canvas>
                </div>
            </div>
        </div>
    );
};

const VisEx78b = () => {
    const isMobile = useIsMobile();
    const [k, setK] = React.useState<number>(1);
    const f3D = React.useMemo(() => (x: number, y: number) => (x * x + y * y - 1) * 0.1, []);
    const { isFullScreen, resizeKey } = useInteraction();

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full bg-slate-900' : 'h-[600px]'}`}>
            <div className={`p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center ${isFullScreen ? 'justify-start pr-16' : 'justify-between'} gap-4`}>
                <div className="flex items-center gap-3">
                    <span className="bg-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20">Apartat B</span>
                    <span className="text-sm font-mono text-slate-300"><InlineMath math="z = x^2 + y^2 - 1" /></span>
                </div>
                <div className="flex-1 w-full max-w-sm">
                    <div className="flex justify-between mb-1.5 px-1">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest text-slate-500">Nivell (z)</span>
                        <span className="text-xs font-mono text-white bg-emerald-600 px-2 py-0.5 rounded">{k.toFixed(1)}</span>
                    </div>
                    <input
                        type="range" min="-2" max="2" step="1" value={k}
                        onChange={(e) => setK(parseFloat(e.target.value))}
                        className="w-full h-1.2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="relative bg-slate-950/50 h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                    <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        {k + 1 > 0 ? (
                            <Circle center={[0, 0]} radius={Math.sqrt(k + 1)} color={Theme.green} weight={3} />
                        ) : k + 1 === 0 ? (
                            <Circle center={[0, 0]} radius={0.1} color={Theme.green} fillOpacity={1} />
                        ) : null}
                        <MafsLaTeX at={[0, -4]} tex={`x^2 + y^2 = ${k + 1}`} color={Theme.green} />
                    </Mafs>
                </div>
                <div className="relative h-full overflow-hidden">
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <FunctionSurface f={f3D} showWireframe={true} colorScale={1.5} />
                        <mesh position={[0, k * 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[10, 10]} />
                            <meshPhongMaterial color="#10b981" transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
                        </mesh>
                    </Canvas>
                </div>
            </div>
        </div>
    );
};

const VisEx78c = () => {
    const isMobile = useIsMobile();
    const [k, setK] = React.useState<number>(2);
    const f3D = React.useMemo(() => (x: number, y: number) => (Math.abs(x + y) + Math.abs(x - y)) * 0.2, []);
    const { isFullScreen, resizeKey } = useInteraction();

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full bg-slate-900' : 'h-[600px]'}`}>
            <div className={`p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center ${isFullScreen ? 'justify-start pr-16' : 'justify-between'} gap-4`}>
                <div className="flex items-center gap-3">
                    <span className="bg-rose-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-rose-500/20">Apartat C</span>
                    <span className="text-sm font-mono text-slate-300"><InlineMath math="z = |x+y| + |x-y|" /></span>
                </div>
                <div className="flex-1 w-full max-w-sm">
                    <div className="flex justify-between mb-1.5 px-1">
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest text-slate-500">Nivell (z)</span>
                        <span className="text-xs font-mono text-white bg-rose-600 px-2 py-0.5 rounded">{k.toFixed(1)}</span>
                    </div>
                    <input
                        type="range" min="0" max="4" step="1" value={k}
                        onChange={(e) => setK(parseFloat(e.target.value))}
                        className="w-full h-1.2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="relative bg-slate-950/50 h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                    <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        {k > 0 ? (
                            <Polygon
                                points={[
                                    [k / 2, k / 2], [-k / 2, k / 2], [-k / 2, -k / 2], [k / 2, -k / 2]
                                ]}
                                color={Theme.pink} weight={3} fillOpacity={0.1}
                            />
                        ) : k === 0 ? (
                            <Circle center={[0, 0]} radius={0.1} color={Theme.pink} fillOpacity={1} />
                        ) : null}
                        <MafsLaTeX at={[0, -2.5]} tex={`2 \\max(|x|, |y|) = ${k.toFixed(1)}`} color={Theme.pink} />
                    </Mafs>
                </div>
                <div className="relative h-full overflow-hidden">
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <FunctionSurface f={f3D} showWireframe={true} colorScale={2} />
                        <mesh position={[0, k * 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[10, 10]} />
                            <meshPhongMaterial color="#f43f5e" transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
                        </mesh>
                    </Canvas>
                </div>
            </div>
        </div>
    );
};

const VisEx73b = () => {

    const isMobile = useIsMobile();
    const [k, setK] = React.useState<number>(0);
    const f3D = React.useMemo(() => (x: number, y: number) => (1 - Math.abs(x) - Math.abs(y)) * 1.5, []);
    const { isFullScreen, resizeKey } = useInteraction();

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full bg-slate-900' : 'h-[600px]'}`}>
            <div className={`p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center ${isFullScreen ? 'justify-start pr-16' : 'justify-between'} gap-4`}>
                <div className="flex items-center gap-3">
                    <span className="bg-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20">Apartat B</span>
                    <span className="text-sm font-mono text-slate-300"><InlineMath math="f(x,y) = 1 - |x| - |y|" /></span>
                </div>
                <div className="flex-1 w-full max-w-sm">
                    <div className="flex justify-between mb-1.5 px-1">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest text-slate-500">Nivell (z)</span>
                        <span className="text-xs font-mono text-white bg-emerald-600 px-2 py-0.5 rounded">{k.toFixed(1)}</span>
                    </div>
                    <input
                        type="range" min="-2" max="1" step="0.5" value={k}
                        onChange={(e) => setK(parseFloat(e.target.value))}
                        className="w-full h-1.2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>
            </div>

            <div className={`flex-none md:flex-1 grid grid-cols-1 ${isFullScreen ? 'h-full grid-rows-[1fr_1fr]' : 'h-[500px] grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="relative bg-slate-950/50 h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                    <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        {1 - k > 0 ? (
                            <Polygon
                                points={[
                                    [1 - k, 0], [0, 1 - k], [-(1 - k), 0], [0, -(1 - k)]
                                ]}
                                color={Theme.green} weight={3} fillOpacity={0.1}
                            />
                        ) : (1 - k === 0) ? (
                            <Circle center={[0, 0]} radius={0.1} color={Theme.green} fillOpacity={1} />
                        ) : null}
                        <MafsLaTeX at={[0, -4]} tex={`1 - |x| - |y| = ${k.toFixed(1)}`} color={Theme.green} />
                    </Mafs>
                </div>
                <div className="relative h-full overflow-hidden">
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <FunctionSurface f={f3D} showWireframe={true} colorScale={1.5} />
                        <mesh position={[0, k * 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[10, 10]} />
                            <meshPhongMaterial color="#10b981" transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
                        </mesh>
                    </Canvas>
                </div>
            </div>
        </div>
    );
};

const VisDiferencialIncrement = () => {
    const [d, setD] = React.useState<[number, number]>([0.8, 0.8]); // dx, dy
    const a = 1, b = 1; // Punt base fix
    const { isFullScreen, resizeKey } = useInteraction();
    const isMobile = useIsMobile();

    // Funció: f(x,y) = 0.2 * (x^2 + y^2)
    const f = (x: number, y: number) => 0.2 * (x * x + y * y);
    const fx = (x: number) => 0.4 * x;
    const fy = (y: number) => 0.4 * y;

    const f0 = f(a, b);
    const dfx = fx(a), dfy = fy(b);
    
    const dx = d[0], dy = d[1];
    const incrementReal = f(a + dx, b + dy) - f0;
    const diferencialLineal = dfx * dx + dfy * dy;
    const error = Math.abs(incrementReal - diferencialLineal);

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 rounded-3xl border border-white/10 ${isFullScreen ? 'h-full' : ''}`}>
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest text-slate-500">Diferencial vs Increment</span>
                    <span className="text-[9px] text-slate-500 font-mono italic">Punt base P(1, 1)</span>
                </div>
                
                <div className="flex gap-2">
                    <div className="bg-black/40 px-3 py-2 rounded-xl border border-white/5 flex flex-col items-center min-w-[80px]">
                        <span className="text-[7px] text-emerald-400 font-black uppercase mb-0.5">Increment (Δf)</span>
                        <span className="text-xs font-mono text-white">{incrementReal.toFixed(3)}</span>
                    </div>
                    <div className="bg-black/40 px-3 py-2 rounded-xl border border-white/5 flex flex-col items-center min-w-[80px]">
                        <span className="text-[7px] text-amber-400 font-black uppercase mb-0.5">Diferencial (df)</span>
                        <span className="text-xs font-mono text-white">{diferencialLineal.toFixed(3)}</span>
                    </div>
                    <div className="bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-500/20 flex flex-col items-center min-w-[80px]">
                        <span className="text-[7px] text-rose-400 font-black uppercase mb-0.5">Error (R_1)</span>
                        <span className="text-xs font-mono text-rose-300">{error.toFixed(4)}</span>
                    </div>
                </div>
            </div>

            <div className={`flex-none md:flex-1 grid grid-cols-1 ${isFullScreen ? 'h-full grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'h-[500px] grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                {/* 2D Control of dx, dy */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/30 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5">Plànol XY: Variació (dx, dy)</div>
                    <Mafs viewBox={{ x: [-2, 2], y: [-2, 2] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Vector tail={[0, 0]} tip={d} color={Theme.yellow} weight={4} />
                        <MovablePoint point={d} onMove={setD} color={Theme.yellow} />
                        <MafsLaTeX at={[d[0], d[1] + 0.3]} tex={`(dx, dy) = (${dx.toFixed(1)}, ${dy.toFixed(1)})`} color={Theme.yellow} />
                    </Mafs>
                </div>

                {/* 3D View */}
                <div className="relative bg-slate-950/50 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5 italic">Geometria de l'aproximació</div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[6, 4, 6]} fov={40} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        <FunctionSurface f={f} showWireframe={true} opacity={0.6} colorScale={1.5} />
                        
                        {/* Punt Base */}
                        <Point position={[a, f0, b]} color="#fbbf24" />
                        
                        {/* Punt Real sobre superfície */}
                        <Point position={[a + dx, f(a + dx, b + dy), b + dy]} color="#10b981" />
                        
                        {/* Punt sobre Pla Tangent */}
                        <Point position={[a + dx, f0 + diferencialLineal, b + dy]} color="#fbbf24" />

                        {/* Línia d'error */}
                        <Line 
                            points={[[a + dx, f0 + diferencialLineal, b + dy], [a + dx, f(a + dx, b + dy), b + dy]]} 
                            color="#f43f5e" 
                            lineWidth={3} 
                        />
                        
                        {/* Pla Tangent parcial */}
                        <group position={[a, f0, b]}>
                            <mesh rotation={[-Math.atan(dfx), 0, -Math.atan(dfy)]}>
                                <planeGeometry args={[3, 3]} />
                                <meshPhongMaterial color="#fbbf24" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
                            </mesh>
                        </group>
                    </Canvas>
                </div>
            </div>
            
            <div className="p-4 bg-slate-950 border-t border-white/10 text-center">
                <p className="text-[10px] text-slate-300 italic max-w-2xl mx-auto leading-relaxed">
                    L'**Increment (Δf)** és el salt real per la muntanya (verd). El **Diferencial (df)** és el salt que faríem si ens moguéssim pel plànol inclinat (groc). L'error (vermell) es fa més petit com més a prop estem del punt base.
                </p>
            </div>
        </div>
    );
};

const VisExtremsHessiana = () => {
    const [tipus, setTipus] = React.useState<'min' | 'max' | 'sella' | 'inconcloent'>('min');
    const { isFullScreen, resizeKey } = useInteraction();
    const isMobile = useIsMobile();

    const config = {
        min: {
            f: (x: number, y: number) => 0.2 * (x * x + y * y),
            title: 'Mínim Relatiu',
            delta: 1,
            fxx: 2,
            desc: 'La superfície creix en totes les direccions (Delta > 0, fxx > 0).',
            color: '#10b981'
        },
        max: {
            f: (x: number, y: number) => -0.2 * (x * x + y * y),
            title: 'Màxim Relatiu',
            delta: 1,
            fxx: -2,
            desc: 'La superfície decreix en totes les direccions (Delta > 0, fxx < 0).',
            color: '#f43f5e'
        },
        sella: {
            f: (x: number, y: number) => 0.2 * (x * x - y * y),
            title: 'Punt de Sella',
            delta: -1,
            fxx: 2,
            desc: 'La superfície puja en una direcció i baixa en l\'altra (Delta < 0).',
            color: '#818cf8'
        },
        inconcloent: {
            f: (x: number, y: number) => 0.05 * (x * x * x * x + y * y * y * y),
            title: 'Cas Inconcloent (Δ=0)',
            delta: 0,
            fxx: 0,
            desc: 'La Hessiana és nul·la a l\'origen. Cal un estudi local (en aquest cas és un mínim).',
            color: '#f59e0b'
        }
    };

    const current = config[tipus];

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 rounded-3xl border border-white/10 ${isFullScreen ? 'h-full' : ''}`}>
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner">
                    {(Object.keys(config) as Array<keyof typeof config>).map((k) => (
                        <button
                            key={k}
                            onClick={() => setTipus(k)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tipus === k ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {k}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col items-center px-4 py-2 bg-black/20 rounded-xl border border-white/5 min-w-[100px]">
                        <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Determinant Δ</span>
                        <span className={`text-xs font-mono font-bold ${current.delta > 0 ? 'text-emerald-400' : current.delta < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                            {current.delta > 0 ? '> 0' : current.delta < 0 ? '< 0' : '= 0'}
                        </span>
                    </div>
                </div>
            </div>

            <div className={`${isFullScreen ? 'flex-1' : 'h-[500px]'} relative bg-slate-950/50 overflow-hidden border-b border-white/5`}>
                <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5 italic">{current.title}</div>
                <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                    <PerspectiveCamera makeDefault position={[5, 4, 5]} fov={40} />
                    <OrbitControls enableZoom={true} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                    <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                    <FunctionSurface f={current.f} showWireframe={true} opacity={0.8} colorScale={2} />
                    <Point position={[0, 0, 0]} color={current.color} />
                </Canvas>
            </div>
            
            <div className="p-4 bg-slate-950 border-t border-white/10 text-center">
                <p className="text-[11px] text-slate-300 italic max-w-2xl mx-auto leading-relaxed">
                    <span className="text-white font-bold uppercase mr-2">{current.title}:</span>
                    {current.desc}
                </p>
            </div>
        </div>
    );
};

const VisFitaErrorLagrange = () => {
    const [delta, setDelta] = React.useState(0.5); // Radi de la regió
    const { isFullScreen, resizeKey } = useInteraction();
    const isMobile = useIsMobile();

    // Funció d'examen: f(x,y) = ln(1 + 0.5x + 0.3y)
    // Aproximació a (0,0): P1 = 0.5x + 0.3y
    const f = (x: number, y: number) => Math.log(1 + 0.5 * x + 0.3 * y);
    const p1 = (x: number, y: number) => 0.5 * x + 0.3 * y;

    // Derivades segones per a la fita M:
    // fxx = -0.25 / (1 + 0.5x + 0.3y)^2
    // fyy = -0.09 / (1 + 0.5x + 0.3y)^2
    // fxy = -0.15 / (1 + 0.5x + 0.3y)^2
    // El màxim valor absolut d'aquestes és a la cantonada on el denominador és mínim (x=-delta, y=-delta)
    const getM = (d: number) => {
        const denom = Math.pow(1 - 0.5 * d - 0.3 * d, 2);
        return {
            xx: 0.25 / denom,
            yy: 0.09 / denom,
            xy: 0.15 / denom
        };
    };

    const M = getM(delta);
    const fitaTeorica = 0.5 * (M.xx * delta * delta + 2 * M.xy * delta * delta + M.yy * delta * delta);
    
    // Error real màxim (aproximat per mostreig a les cantonades)
    const errorReal = Math.max(
        Math.abs(f(delta, delta) - p1(delta, delta)),
        Math.abs(f(-delta, -delta) - p1(-delta, -delta))
    );

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 rounded-3xl border border-white/10 ${isFullScreen ? 'h-full' : ''}`}>
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Fita d'Error de Lagrange</span>
                    <span className="text-[9px] text-slate-500 font-mono italic">f(x,y) = ln(1 + 0.5x + 0.3y)</span>
                </div>
                
                <div className="flex gap-2">
                    <div className="bg-black/40 px-3 py-2 rounded-xl border border-white/5 flex flex-col items-center min-w-[100px]">
                        <span className="text-[7px] text-slate-400 font-black uppercase mb-0.5">Radi Regió (δ)</span>
                        <input type="range" min="0.1" max="0.9" step="0.05" value={delta} onChange={e => setDelta(parseFloat(e.target.value))} className="w-20 accent-rose-500" />
                    </div>
                    <div className="bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-500/20 flex flex-col items-center min-w-[100px]">
                        <span className="text-[7px] text-rose-400 font-black uppercase mb-0.5">Fita Lagrange</span>
                        <span className="text-xs font-mono text-rose-300">≤ {fitaTeorica.toFixed(4)}</span>
                    </div>
                    <div className="bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20 flex flex-col items-center min-w-[100px]">
                        <span className="text-[7px] text-emerald-400 font-black uppercase mb-0.5">Error Real</span>
                        <span className="text-xs font-mono text-emerald-300">≈ {errorReal.toFixed(4)}</span>
                    </div>
                </div>
            </div>

            <div className={`flex-none md:flex-1 grid grid-cols-1 ${isFullScreen ? 'h-full grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'h-[500px] grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                {/* 2D: Regió de control */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/30 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5 italic">Domini de l'aproximació</div>
                    <Mafs viewBox={{ x: [-1.5, 1.5], y: [-1.5, 1.5] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Polygon points={[[-delta, -delta], [delta, -delta], [delta, delta], [-delta, delta]]} color={Theme.pink} fillOpacity={0.1} />
                        <MafsLaTeX at={[delta + 0.2, delta + 0.2]} tex="\delta" color={Theme.pink} />
                    </Mafs>
                </div>

                {/* 3D: Error Visual */}
                <div className="relative bg-slate-950/50 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5">Vista 3D: La "Resta" de Lagrange</div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[5, 4, 5]} fov={40} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        <FunctionSurface f={f} showWireframe={false} opacity={0.6} />
                        <FunctionSurface f={p1} colorScale={3} showWireframe={true} opacity={0.4} />
                        
                        {/* Indicadors a les cantonades on l'error és màxim */}
                        <Line points={[[-delta, f(-delta, -delta), -delta], [-delta, p1(-delta, -delta), -delta]]} color="#f43f5e" lineWidth={4} />
                        <Point position={[0, 0, 0]} color="white" />
                    </Canvas>
                </div>
            </div>
            
            <div className="p-4 bg-slate-950 border-t border-white/10 text-center">
                <p className="text-[10px] text-slate-300 italic max-w-2xl mx-auto leading-relaxed">
                    Com més gran és la regió (més $\delta$), més creixen les derivades segones ($M$) i el factor quadrat. Fixa't que la **Fita de Lagrange** (teòrica) sempre és una mica superior a l'**Error Real**; és un "paraigua" de seguretat que ens garanteix que l'error mai superarà aquest valor.
                </p>
            </div>
        </div>
    );
};

const VisTaylorGrauN = () => {
    const [p, setP] = React.useState<[number, number]>([0, 0]);
    const [grau, setGrau] = React.useState<0 | 1 | 2>(2);
    const { isFullScreen, resizeKey } = useInteraction();
    const isMobile = useIsMobile();

    // Funció base: f(x,y) = cos(x) * exp(-y^2/4)
    const f = (x: number, y: number) => Math.cos(x) * Math.exp(-(y * y) / 4);

    // Derivades en (a,b)
    const a = p[0], b = p[1];
    const fa = f(a, b);

    const dax = -Math.sin(a) * Math.exp(-(b * b) / 4);
    const day = f(a, b) * (-b / 2);

    const daxx = -Math.cos(a) * Math.exp(-(b * b) / 4);
    const dayy = f(a, b) * (-(1 / 2) + (b * b / 4));
    const daxy = -Math.sin(a) * Math.exp(-(b * b) / 4) * (-b / 2);

    // Polinomi de Taylor
    const taylor = (x: number, y: number) => {
        const h = x - a;
        const k = y - b;
        if (grau === 0) return fa;
        if (grau === 1) return fa + dax * h + day * k;
        // Grau 2
        return fa + (dax * h + day * k) + 0.5 * (daxx * h * h + 2 * daxy * h * k + dayy * k * k);
    };

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 ${isFullScreen ? 'h-full' : ''}`}>
            {/* Control Panel */}
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner">
                    {([0, 1, 2] as const).map((g) => (
                        <button
                            key={g}
                            onClick={() => setGrau(g)}
                            className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${grau === g ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Grau {g}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex flex-col">
                        <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1 text-center">Punt (a, b)</span>
                        <div className="flex gap-2">
                            <input type="range" min="-2" max="2" step="0.1" value={p[0]} onChange={e => setP([parseFloat(e.target.value), p[1]])} className="w-16 accent-indigo-500" />
                            <input type="range" min="-2" max="2" step="0.1" value={p[1]} onChange={e => setP([p[0], parseFloat(e.target.value)])} className="w-16 accent-indigo-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={`flex-none md:flex-1 grid grid-cols-1 ${isFullScreen ? 'h-full grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'h-[500px] grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                {/* 2D: Mapa de calor i Error */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/30 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-indigo-300 font-bold uppercase tracking-widest border border-white/5">Error d'aproximació |f - P|</div>
                    <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <MovablePoint point={p} onMove={setP} color={Theme.indigo} />
                    </Mafs>
                    <div className="absolute bottom-4 left-4 text-[10px] text-slate-300 italic font-bold">Mou el punt per veure com canvia l'aproximació en 3D.</div>
                </div>

                {/* 3D: Superfície i Taylor */}
                <div className="relative bg-slate-950/50 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-rose-300 font-bold uppercase tracking-widest border border-white/5">Vista 3D: Superfície vs Polinomi</div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 5, 8]} fov={40} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        {/* Superfície original */}
                        <FunctionSurface f={f} opacity={0.6} showWireframe={false} />

                        {/* Polinomi de Taylor */}
                        <FunctionSurface
                            f={taylor}
                            colorScale={1.5}
                            showWireframe={true}
                            opacity={0.8}
                        />

                        <Point position={[a, fa, b]} color="white" />
                    </Canvas>
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/10">
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">Aproximació</span>
                        <div className="text-[11px] font-mono text-indigo-300">
                            <InlineMath math={`P_{${grau}}(x,y) \\approx f(a,b)`} />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">Geometria</span>
                        <span className="text-[11px] font-bold text-white">
                            {grau === 0 ? 'Punt d\'ancoratge' : grau === 1 ? 'Pla Tangent (Lineal)' : 'Paraboloide (Curvatura)'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VisTeoremaSchwarz = () => {
    const [p, setP] = React.useState<[number, number]>([1, 1]);
    const { isFullScreen, resizeKey } = useInteraction();
    const isMobile = useIsMobile();

    // Funció amb "gir" (twist): f(x,y) = sin(x)*sin(y)
    const f = (x: number, y: number) => Math.sin(x) * Math.sin(y);

    // Derivades
    const fx = (x: number, y: number) => Math.cos(x) * Math.sin(y);
    const fy = (x: number, y: number) => Math.sin(x) * Math.cos(y);

    const fxx = (x: number, y: number) => -Math.sin(x) * Math.sin(y);
    const fyy = (x: number, y: number) => -Math.sin(x) * Math.sin(y);
    const fxy = (x: number, y: number) => Math.cos(x) * Math.cos(y);
    const fyx = (x: number, y: number) => Math.cos(x) * Math.cos(y);

    const valFxy = fxy(p[0], p[1]);
    const valFyx = fyx(p[0], p[1]);

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 ${isFullScreen ? 'h-full' : ''}`}>
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Teorema de Schwarz</span>
                    <span className="text-[9px] text-slate-500 font-mono">f(x,y) = sin(x) · sin(y)</span>
                </div>

                <div className="flex gap-2">
                    <div className="bg-black/40 px-3 py-2 rounded-xl border border-white/5 flex flex-col items-center">
                        <span className="text-[8px] text-indigo-400 font-black uppercase mb-1">f_xy</span>
                        <span className="text-xs font-mono text-white">{valFxy.toFixed(3)}</span>
                    </div>
                    <div className="bg-black/40 px-3 py-2 rounded-xl border border-white/5 flex flex-col items-center">
                        <span className="text-[8px] text-rose-400 font-black uppercase mb-1">f_yx</span>
                        <span className="text-xs font-mono text-white">{valFyx.toFixed(3)}</span>
                    </div>
                    <div className="bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20 flex flex-col items-center">
                        <span className="text-[8px] text-emerald-400 font-black uppercase mb-1">Estat</span>
                        <span className="text-[10px] font-bold text-emerald-400">SIMÈTRIC</span>
                    </div>
                </div>
            </div>

            <div className={`flex-none md:flex-1 grid grid-cols-1 ${isFullScreen ? 'h-full grid-rows-[1fr_1fr]' : 'h-[500px] grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                {/* Hessiana Interactiva */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/30 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5 italic">Domini (x, y)</div>

                    {/* Floating Hessian Matrix - Moved to top right and smaller */}
                    <div className="absolute top-4 right-4 z-20 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col items-center p-1.5 rounded-lg bg-white/5 border border-white/5">
                                    <span className="text-[6px] text-slate-500 font-black mb-0.5">f_xx</span>
                                    <span className="text-[10px] font-mono text-white">{fxx(p[0], p[1]).toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col items-center p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                    <span className="text-[6px] text-indigo-400 font-black mb-0.5">f_xy</span>
                                    <span className="text-[10px] font-mono text-indigo-300">{valFxy.toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col items-center p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                    <span className="text-[6px] text-rose-400 font-black mb-0.5">f_yx</span>
                                    <span className="text-[10px] font-mono text-rose-300">{valFyx.toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col items-center p-1.5 rounded-lg bg-white/5 border border-white/5">
                                    <span className="text-[6px] text-slate-500 font-black mb-0.5">f_yy</span>
                                    <span className="text-[10px] font-mono text-white">{fyy(p[0], p[1]).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Mafs viewBox={{ x: [-Math.PI, Math.PI], y: [-Math.PI, Math.PI] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <MovablePoint point={p} onMove={setP} color={Theme.indigo} />
                    </Mafs>
                    <div className="absolute bottom-2 left-4 z-10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Arrossega el punt per provar Schwarz</span>
                    </div>
                </div>

                {/* 3D View */}
                <div className="relative bg-slate-950/50 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5 italic">Geometria del "Twist"</div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[6, 4, 6]} fov={40} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        <FunctionSurface f={f} showWireframe={true} opacity={0.7} colorScale={2} />

                        <Point position={[p[0], f(p[0], p[1]), p[1]]} color="white" />

                        {/* Tangent Plane to show twist */}
                        <group position={[p[0], f(p[0], p[1]), p[1]]}>
                            <mesh onUpdate={(self) => self.lookAt(new THREE.Vector3(fx(p[0], p[1]), 1, fy(p[0], p[1])).normalize().add(self.position))}>
                                <planeGeometry args={[2, 2]} />
                                <meshPhongMaterial color="#818cf8" transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
                            </mesh>
                        </group>
                    </Canvas>
                </div>
            </div>

            <div className="p-4 bg-slate-950 text-center border-t border-white/10">
                <p className="text-[10px] text-slate-300 italic max-w-xl mx-auto leading-relaxed">
                    Moure el punt en el domini (esquerra) actualitza la matriu Hessiana. Fixa't que, independentment de la posició, les derivades creuades (blau i rosa) són exactament iguals. Això és el cor del Teorema de Schwarz.
                </p>
            </div>
        </div>
    );
};

const VisRegularitatHibrida = () => {
    const [classe, setClasse] = React.useState<'C0' | 'C1' | 'C2' | 'Cinf'>('C0');
    const { isFullScreen, resizeKey } = useInteraction();
    const isMobile = useIsMobile();

    // Funció en 2D (per al tall x)
    const f2d = (x: number) => {
        if (classe === 'C0') return Math.abs(x) * 0.5;
        if (classe === 'C1') return x * Math.abs(x) * 0.2;
        if (classe === 'C2') return x * x * 0.15;
        return (Math.sin(x) + 1) * 0.8;
    };

    const df2d = (x: number) => {
        if (classe === 'C0') return x > 0 ? 0.5 : -0.5;
        if (classe === 'C1') return Math.abs(x) * 0.4;
        if (classe === 'C2') return 0.3 * x;
        return Math.cos(x) * 0.8;
    };

    // Funció en 3D
    const f3d = (x: number, y: number) => {
        if (classe === 'C0') return (Math.abs(x) + Math.abs(y)) * 0.5;
        if (classe === 'C1') return (x * Math.abs(x) + y * Math.abs(y)) * 0.2;
        if (classe === 'C2') return (x * x + y * y) * 0.2;
        return (Math.sin(x) + Math.cos(y)) * 0.5;
    };

    // Derivades parcials per al pla tangent (R3F usa Y com a vertical, i Z en math és Y en Three)
    const grad = (x: number, y: number) => {
        if (classe === 'C0') return { dx: x > 0 ? 0.5 : -0.5, dy: y > 0 ? 0.5 : -0.5 };
        if (classe === 'C1') return { dx: Math.abs(x) * 0.4, dy: Math.abs(y) * 0.4 };
        if (classe === 'C2') return { dx: 0.4 * x, dy: 0.4 * y };
        return { dx: 0.5 * Math.cos(x), dy: -0.5 * Math.sin(y) };
    };

    const [p, setP] = React.useState<[number, number]>([1, 1]);
    const g = grad(p[0], p[1]);
    const z0 = f3d(p[0], p[1]);

    // Normal vector for lookAt: (dx, 1, dy)
    const normalDir = new THREE.Vector3(g.dx, 1, g.dy).normalize();

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 ${isFullScreen ? 'h-full' : 'h-[650px] md:h-[650px]'}`}>
            {/* Header Panel */}
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner">
                    {(['C0', 'C1', 'C2', 'Cinf'] as const).map((c) => (
                        <button
                            key={c}
                            onClick={() => setClasse(c)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${classe === c ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {c === 'Cinf' ? 'C∞' : c}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col items-center px-4 py-2 bg-black/20 rounded-xl border border-white/5 min-w-[120px]">
                        <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Diferenciabilitat</span>
                        <span className={`text-[10px] font-bold ${classe === 'C0' ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {classe === 'C0' ? 'NO DIFERENCIABLE' : 'DIFERENCIABLE'}
                        </span>
                    </div>
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                {/* 2D View: The "Cut" analysis */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/30 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-indigo-500/20 backdrop-blur-md px-2 py-1 rounded text-[9px] text-indigo-300 font-bold uppercase tracking-widest border border-indigo-500/30">Anàlisi del pendent (2D)</div>
                    <Mafs viewBox={{ x: [-4, 4], y: [-1, 2.5] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Plot.OfX y={f2d} color={Theme.indigo} weight={4} />
                        <Plot.OfX y={df2d} color={Theme.pink} weight={2} opacity={0.4} />

                        <MovablePoint point={[p[0], 0]} onMove={(pt) => setP([pt[0], p[1]])} color={Theme.foreground} />
                        <Circle center={[p[0], f2d(p[0])]} radius={0.12} color={Theme.indigo} fillOpacity={1} />

                        {/* Tangent line in 2D */}
                        <Plot.OfX y={(x) => f2d(p[0]) + df2d(p[0]) * (x - p[0])} color={Theme.yellow} weight={2} style="dashed" opacity={0.6} />
                    </Mafs>
                    <div className="absolute bottom-4 left-4 flex flex-col gap-1 pointer-events-none">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-indigo-500" />
                            <span className="text-[8px] text-slate-500 font-black uppercase">Funció f(x)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-rose-500" />
                            <span className="text-[8px] text-slate-500 font-black uppercase">Derivada f'(x)</span>
                        </div>
                    </div>
                </div>

                {/* 3D View: The surface and Tangent Plane */}
                <div className="relative bg-slate-950/50 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-rose-500/20 backdrop-blur-md px-2 py-1 rounded text-[9px] text-rose-300 font-bold uppercase tracking-widest border border-rose-500/30">Superfície i Pla Tangent</div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[8, 5, 8]} fov={40} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        <FunctionSurface f={f3d} showWireframe={true} opacity={0.8} colorScale={classe === 'C0' ? 1.5 : 2} />

                        {/* Current Point */}
                        <Point position={[p[0], z0, p[1]]} color="white" />

                        {/* Tangent Plane: Only show if derivatives exist (or approximate for visualization) */}
                        <group position={[p[0], z0, p[1]]}>
                            <mesh onUpdate={(self) => self.lookAt(normalDir.clone().add(self.position))}>
                                <planeGeometry args={[4, 4]} />
                                <meshPhongMaterial
                                    color="#6366f1"
                                    transparent
                                    opacity={classe === 'C0' && Math.abs(p[0]) < 0.1 ? 0 : 0.5}
                                    side={THREE.DoubleSide}
                                    depthWrite={false}
                                />
                            </mesh>
                            {/* Normal Vector */}
                            <Arrow memoDir={normalDir} color="#fbbf24" length={2} head={0.4} width={0.15} />
                        </group>
                    </Canvas>
                </div>
            </div>

            <div className="p-4 bg-slate-950 text-center border-t border-white/10">
                <p className="text-[10px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    <span className="text-white font-bold uppercase mr-2">{classe}:</span>
                    {classe === 'C0' && "Contínua però amb una 'cresta' o punxa a l'origen. Fixa't que la derivada (rosa) té un salt i el pla tangent balla bruscament."}
                    {classe === 'C1' && "La primera derivada és contínua. El pla tangent existeix a tot arreu i es mou de forma suau, tot i que la curvatura pot ser brusca."}
                    {classe === 'C2' && "Dues vegades derivable amb continuïtat. És el mínim necessari per a una aproximació quadràtica (Taylor grau 2) fiable."}
                    {classe === 'Cinf' && "Infinitament derivable. Representa les funcions més 'nobles' de les matemàtiques, totalment suaus en qualsevol ordre."}
                </p>
            </div>
        </div>
    );
};

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

const VisDerivadesParcialsHibrida = () => {
    const [a, setA] = React.useState<[number, number]>([1, 1]);
    const [mode, setMode] = React.useState<'x' | 'y'>('x');
    const { isFullScreen, resizeKey } = useInteraction();

    const f = (x: number, y: number) => 4 - (x * x + y * y) * 0.1;
    const z0 = f(a[0], a[1]);
    const currentSlope = mode === 'x' ? -0.2 * a[0] : -0.2 * a[1];

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'relative h-[100dvh]' : ''}`}>
            <div className={`${isFullScreen ? 'absolute top-0 left-0 right-0 z-20 h-[14dvh] landscape:h-[20dvh] px-2 py-1 bg-black/60 backdrop-blur-md border-b border-white/5 flex flex-wrap justify-start items-center gap-x-4 gap-y-0.5 pr-16' : 'p-4 bg-slate-800/50 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4'}`}>
                <div className="flex gap-3 items-center">
                    <div className="flex bg-black/40 p-0.5 rounded border border-white/5">
                        <button onClick={() => setMode('x')} className={`${isFullScreen ? 'px-2 py-0.5 text-[8px]' : 'px-4 py-1.5 text-[10px]'} rounded font-bold tracking-wider transition-all ${mode === 'x' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>X</button>
                        <button onClick={() => setMode('y')} className={`${isFullScreen ? 'px-2 py-0.5 text-[8px]' : 'px-4 py-1.5 text-[10px]'} rounded font-bold tracking-wider transition-all ${mode === 'y' ? 'bg-rose-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Y</button>
                    </div>
                </div>
                <div className={`${isFullScreen ? 'px-1.5 py-0 text-[10px]' : 'px-3 py-1 text-xs md:text-sm'} bg-black/30 rounded-full border border-white/5 font-mono text-white whitespace-nowrap`}>
                    <InlineMath math={mode === 'x' ? `\\frac{\\partial f}{\\partial x} = ${currentSlope.toFixed(2)}` : `\\frac{\\partial f}{\\partial y} = ${currentSlope.toFixed(2)}`} />
                </div>
            </div>

            <div className={`${isFullScreen ? 'absolute inset-0 pt-[14dvh] landscape:pt-[20dvh] grid grid-cols-1 grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 min-h-[600px] md:min-h-[350px]'}`}>
                <div className={`relative border-white/5 bg-slate-950/20 overflow-hidden ${isFullScreen ? 'border-b landscape:border-b-0 landscape:border-r h-full' : 'border-b md:border-b-0 md:border-r h-full'}`}>
                    <div className="absolute top-2 left-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-slate-300 font-bold border border-white/10 italic">
                        MAPA DE CORBES DE NIVELL
                    </div>
                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        {[1, 2, 3, 4, 5, 6].map(r => (
                            <Circle key={r} center={[0, 0]} radius={Math.sqrt(r * 4)} color={Theme.foreground} weight={1} fillOpacity={0.1} />
                        ))}
                        {mode === 'x' ? (
                            <Plot.OfX y={() => a[1]} color={Theme.indigo} weight={2} opacity={0.5} />
                        ) : (
                            <Plot.OfY x={() => a[0]} color={Theme.pink} weight={2} opacity={0.5} />
                        )}
                        <MovablePoint point={a} onMove={setA} color={mode === 'x' ? Theme.indigo : Theme.pink} />
                    </Mafs>
                </div>

                <div className={`relative bg-slate-950/40 overflow-hidden h-full`}>
                    <div className="absolute top-2 left-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-slate-300 font-bold border border-white/10 italic">
                        FUNCIÓ CONGELADA (1 VARIABLE)
                    </div>
                    <Mafs viewBox={{ x: [-4, 4], y: [0, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        <Plot.OfX y={t => mode === 'x' ? f(t, a[1]) : f(a[0], t)} color={mode === 'x' ? Theme.indigo : Theme.pink} weight={3} />
                        <Plot.OfX y={t => z0 + currentSlope * (t - (mode === 'x' ? a[0] : a[1]))} color={Theme.yellow} weight={2} style="dashed" />
                        <Circle center={[mode === 'x' ? a[0] : a[1], z0]} radius={0.15} color={Theme.yellow} fillOpacity={1} />
                    </Mafs>
                </div>
            </div>
            <div className="p-3 bg-slate-800/30 text-[10px] text-slate-400 text-center border-t border-white/5 italic">
                A l'esquerra triem on som. A la dreta veiem la derivada "de tota la vida" que resulta de mantenir una variable fixa.
            </div>
        </div>
    );
};

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
                    <button onClick={() => setMode('single')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${mode === 'single' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Vector</button>
                    <button onClick={() => setMode('sum')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${mode === 'sum' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Suma</button>
                    <button onClick={() => setMode('product')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${mode === 'product' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Producte</button>
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

const VISUALIZERS: Record<string, React.ComponentType<any>> = {
    'vis_rn_dimensionality': VisRnDimensionality,
    'vis_derivades_parcials_hibrida': VisDerivadesParcialsHibrida,
    'vis_derivada_direccional_hibrida': VisDerivadaDireccionalHibrida,
    'vis_distancia_3d': VisDistancia3D,
    'vis_superficies_basiques_3d': VisSuperficiesBasiques3D,
    'vis_corbes_nivell_3d_2d': VisCorbesNivell3D2D,
    'vis_distancia_sync_3d_2d': VisDistanciaSync3D2D,
    'vis_ex7_3_a': VisEx73a,
    'vis_ex7_3_b': VisEx73b,
    'vis_subespai_3d': VisSubespai3D,
    'vis_ex_7_8_a': VisEx78a,
    'vis_ex_7_8_b': VisEx78b,
    'vis_ex_7_8_c': VisEx78c,
    'vis_ex_7_6_c': VisEx76c,
    'punts_sella': VisPuntsSella,
    'paraboloide': VisParaboloide,
    'pla_tangent': VisPlaTangentINormalHibrid,
    'vector_gradient': VisVectorGradient,
    'maxim_local': VisMaximLocal,
    'minim_local': VisMinimLocal,
    'punt_sella_optim': VisPuntSellaOptim,
    'taylor_3d': VisTaylor3d,
    'vis_vector_director_angle': VisVectorDirectorAngle,
    'vis_regularitat_hibrida': VisRegularitatHibrida,
    'vis_teorema_schwarz': VisTeoremaSchwarz,
    'vis_taylor_graun': VisTaylorGrauN,
    'vis_diferencial_increment': VisDiferencialIncrement,
    'vis_extrems_hessiana': VisExtremsHessiana,
    'vis_fita_error_lagrange': VisFitaErrorLagrange,
};


const ThreeVisualizerContent = ({ SurfaceComponent, isHybrid }: { SurfaceComponent: React.ComponentType<any>, isHybrid: boolean }) => {
    const isMobile = useIsMobile();
    const { isFullScreen } = useInteraction();

    if (isHybrid) {
        return <SurfaceComponent />;
    }

    return (
        <ThreeErrorBoundary>
            <div className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full bg-slate-900' : 'h-[500px]'}`}>

                <div className="flex-1 relative">
                    <Canvas
                        shadows={{ type: THREE.PCFShadowMap }}
                        dpr={isMobile ? 1 : [1, 2]}
                        gl={{ antialias: true, powerPreference: "high-performance" }}
                    >
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={50} />
                        <OrbitControls enableDamping dampingFactor={0.05} />

                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                        <Grid
                            infiniteGrid
                            fadeDistance={50}
                            cellColor="#444"
                            sectionColor="#888"
                            sectionSize={5}
                            cellSize={1}
                        />

                        <SurfaceComponent />
                        <axesHelper args={[5]} />
                    </Canvas>
                </div>

                {!isFullScreen && (
                    <div className="absolute bottom-4 right-4 text-[10px] text-white/50 bg-black/30 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                        Fes clic i arrossega per rotar • Roda per zoom
                    </div>
                )}
            </div>
        </ThreeErrorBoundary>
    );
};

const ThreeVisualizer: React.FC<ThreeVisualizerProps> = (props) => {
    // We explicitly destructure only the 'type' and ignore any 'children' 
    // passed by the MDX parser to avoid layout leakage in immersive mode.
    const { type } = props;
    const SurfaceComponent = VISUALIZERS[type];

    if (!SurfaceComponent) return <div className="p-4 bg-red-900/20 text-red-400 rounded-xl border border-red-500/30">Tipus 3D no trobat: {type}</div>;

    const hybridTypes = [
        'vis_rn_dimensionality',
        'vis_subespai_3d',
        'vis_corbes_nivell_3d_2d',
        'vis_distancia_sync_3d_2d',
        'vis_ex7_3_a',
        'vis_ex7_3_b',
        'vis_ex_7_8_a',
        'vis_ex_7_8_b',
        'vis_ex_7_8_c',
        'vis_derivada_direccional_hibrida',
        'vis_derivades_parcials_hibrida',
        'pla_tangent',
        'vis_vector_director_angle',
        'vis_regularitat_hibrida',
        'vis_teorema_schwarz',
        'vis_taylor_graun',
        'vis_diferencial_increment',
        'vis_extrems_hessiana',
        'vis_fita_error_lagrange'
    ];

    const isHybrid = hybridTypes.includes(type);

    if (!hasWebGL()) {
        return (
            <div className="w-full h-[500px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 my-8 flex flex-col items-center justify-center gap-4 p-8">
                <div className="text-4xl">🖥️</div>
                <p className="text-amber-400 font-semibold text-center">Visualització 3D no disponible</p>
                <p className="text-slate-500 text-sm text-center max-w-sm">
                    El teu navegador no té WebGL activat. Prova d'activar l'acceleració de hardware.
                </p>
            </div>
        );
    }

    return (
        <InteractionLock className="my-8" key={type}>
            <ThreeVisualizerContent SurfaceComponent={SurfaceComponent} isHybrid={isHybrid} />
        </InteractionLock>
    );
};

export default ThreeVisualizer;

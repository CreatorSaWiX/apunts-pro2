import React, { useMemo, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Stars, Text, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Mafs, Coordinates, Plot, Theme, LaTeX as MafsLaTeX, Circle, Polygon, MovablePoint, Line as MafsLine } from "mafs";
import { InlineMath } from 'react-katex';
import "mafs/core.css";

interface ThreeVisualizerProps {
    type: string;
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
    const size = 10;
    const segments = 60;

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

const VisPlaTangentINormalHibrid = () => {
    const [p, setP] = React.useState<[number, number]>([1, 0.5]);

    // Funció z = 5 * exp(-(x^2 + y^2)/15) (muntanya molt més ampla i majestuosa)
    const f = (x: number, y: number) => 5 * Math.exp(-(x * x + y * y) / 15);
    const dfx = (x: number, y: number) => f(x, y) * (-2 * x / 15);
    const dfy = (x: number, y: number) => f(x, y) * (-2 * y / 15);

    const a = p[0], b = p[1];
    const fa = f(a, b);
    const da = dfx(a, b);
    const db = dfy(a, b);

    // Vector normal en (da, 1, db)
    const normalDir = new THREE.Vector3(da, 1, db).normalize();

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 my-8">
            <div className="p-4 bg-slate-800/50 border-b border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Pla Tangent en (a, b)</span>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-bold">a:</span>
                                <input type="range" min="-4" max="4" step="0.1" value={a} onChange={e => setP([parseFloat(e.target.value), b])} className="w-24 accent-indigo-500" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-bold">b:</span>
                                <input type="range" min="-4" max="4" step="0.1" value={b} onChange={e => setP([a, parseFloat(e.target.value)])} className="w-24 accent-indigo-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-[11px] text-indigo-300">
                        <div className="opacity-50 text-[10px] mb-1 italic">Equació de l'aproximació lineal:</div>
                        <InlineMath math={`z \\approx ${fa.toFixed(2)} ${da >= 0 ? '+' : ''} ${da.toFixed(2)}(x ${a >= 0 ? '-' : '+'} ${Math.abs(a).toFixed(1)}) ${db >= 0 ? '+' : ''} ${db.toFixed(2)}(y ${b >= 0 ? '-' : '+'} ${Math.abs(b).toFixed(1)})`} />
                    </div>
                </div>
            </div>

            <div className="relative h-[600px] bg-slate-950/40">
                <Canvas shadows dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={40} />
                    <OrbitControls enableZoom={true} />
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, -10]} intensity={2} castShadow />
                    <pointLight position={[-10, 10, 10]} intensity={1} />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    <FunctionSurface f={f} opacity={0.9} colorScale={4} showWireframe={false} />

                    {/* Grup del Plànol i Normal */}
                    <group position={[a, fa, b]}>
                        <mesh onUpdate={(self) => self.lookAt(normalDir.clone().add(self.position))}>
                            <planeGeometry args={[4, 4]} />
                            <meshPhongMaterial color="#6366f1" transparent opacity={0.6} side={THREE.DoubleSide} shininess={100} />
                        </mesh>

                        <primitive
                            object={new THREE.ArrowHelper(
                                normalDir,
                                new THREE.Vector3(0, 0, 0),
                                2.5,
                                "#fbbf24",
                                0.5,
                                0.25
                            )}
                        />

                        <mesh>
                            <sphereGeometry args={[0.1]} />
                            <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
                        </mesh>
                    </group>

                    <gridHelper args={[10, 10, 0x334155, 0x1e293b]} position={[0, -0.01, 0]} />
                </Canvas>

                <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                    <div className="bg-indigo-600/40 px-3 py-1 rounded text-[10px] text-white font-bold border border-indigo-500/50 shadow-lg shadow-indigo-500/20 backdrop-blur-sm">
                        PLA TANGENT (Aprox. Lineal)
                    </div>
                    <div className="bg-amber-600/40 px-3 py-1 rounded text-[10px] text-white font-bold border border-amber-500/50 shadow-lg shadow-amber-500/20 backdrop-blur-sm">
                        RECTA NORMAL ($\nabla f$)
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-800/30 text-[11px] text-slate-400 text-center border-t border-white/10">
                MOU ELS SLIDERS: El plànol blau és l'únic plànol que "toca" la superfície de forma suau. El vector normal <InlineMath math={"(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, -1)"} /> indica la direcció perpendicular al punt.
            </div>
        </div>
    );
};

const VisVectorGradient = () => {
    const f = (x: number, y: number) => 3 * Math.sin(0.3 * x) * Math.cos(0.3 * y);
    return (
        <>
            <FunctionSurface f={f} />
            {/* Vectors gradient en punts clau */}
            {[[-3, -3], [0, 0], [3, 0], [0, 3]].map(([px, py], i) => {
                const z = f(px, py);
                // Grad f = (f_x, f_y)
                const gx = 3 * 0.3 * Math.cos(0.3 * px) * Math.cos(0.3 * py);
                const gy = -3 * 0.3 * Math.sin(0.3 * px) * Math.sin(0.3 * py);
                const dir = new THREE.Vector3(gx, 0, gy).normalize();
                return (
                    <group key={i} position={[px, z, py]}>
                        <primitive object={new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), 1.5, "#ff4400", 0.3, 0.2)} />
                        <Point position={[0, 0, 0]} color="white" />
                    </group>
                )
            })}
            <Text position={[0, 4, 0]} color="white" fontSize={0.5} textAlign="center">
                Camps de Vectors: El Gradient (∇f)
            </Text>
        </>
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
    const p1 = (_x: number, y: number) => y * 0.5;

    return (
        <>
            <FunctionSurface f={f} colorScale={3} />
            <group position={[0, 0.1, 0]}>
                <FunctionSurface f={p1} colorScale={3} />
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
    const [k, setK] = React.useState(1.5);
    const f = (x: number, y: number) => (x * x + y * y) * 0.1;

    return (
        <div className="w-full h-full min-h-[500px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
            <div className="p-6 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
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

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                <div className="border-r border-white/5 relative bg-slate-950/50 min-h-[300px]">
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

                <div className="relative min-h-[300px]">
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
                        <OrbitControls enableZoom={false} />
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

            <div className="p-4 bg-slate-950 text-center border-t border-white/10">
                <p className="text-[10px] text-slate-500 italic">
                    La corba 2D a l'esquerra correspon al tall horitzontal a altura <span className="text-indigo-400 font-bold">k</span> de la figura 3D.
                </p>
            </div>
        </div>
    );
};

const VisDistanciaSync3D2D = () => {
    const [p1, setP1] = React.useState<[number, number, number]>([1, 1, 0.5]);
    const [p2, setP2] = React.useState<[number, number, number]>([4, 3, 2]);

    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const dz = p2[2] - p1[2];
    const dist2D = Math.sqrt(dx * dx + dy * dy);
    const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

    return (
        <div className="w-full h-full min-h-[550px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col my-8">
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
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

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                <div className="border-r border-white/5 relative bg-slate-950/50 min-h-[300px]">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 pointer-events-none">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Projecció XY (2D)</span>
                    </div>
                    <Mafs viewBox={{ x: [-1, 6], y: [-1, 5] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Plot.OfX y={() => p1[1]} color={Theme.blue} style="dashed" opacity={0.3} />
                        <MafsLine.Segment point1={[p1[0], p1[1]]} point2={[p2[0], p2[1]]} color={Theme.blue} weight={3} />
                        <MovablePoint point={[p1[0], p1[1]]} onMove={([x, y]) => setP1([x, y, p1[2]])} color={Theme.blue} />
                        <MovablePoint point={[p2[0], p2[1]]} onMove={([x, y]) => setP2([x, y, p2[2]])} color={Theme.red} />
                        <MafsLaTeX at={[(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 + 0.4]} tex="d_{2D}" color={Theme.blue} />
                    </Mafs>
                </div>

                <div className="relative min-h-[300px]">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 pointer-events-none">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Espai R3 (3D)</span>
                    </div>
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[8, 5, 8]} />
                        <OrbitControls enableZoom={false} />
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
    const [k, setK] = React.useState<number>(1);
    const f3D = React.useMemo(() => (x: number, y: number) => (x * x - y * y) * 0.2, []);

    return (
        <div className="w-full min-h-[550px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col my-8">
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
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

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                <div className="relative bg-slate-950/50 min-h-[300px] border-r border-white/5">
                    <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false} zoom={false}>
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
                <div className="relative min-h-[300px]">
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
                        <OrbitControls enableZoom={false} />
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

const VisEx73b = () => {
    const [k, setK] = React.useState<number>(0);
    const f3D = React.useMemo(() => (x: number, y: number) => (1 - Math.abs(x) - Math.abs(y)) * 1.5, []);

    return (
        <div className="w-full min-h-[550px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col my-8">
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
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

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                <div className="relative bg-slate-950/50 min-h-[300px] border-r border-white/5">
                    <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false} zoom={false}>
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
                <div className="relative min-h-[300px]">
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
                        <OrbitControls enableZoom={false} />
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

const VisDerivadaDireccionalHibrida = () => {
    const [a, setA] = React.useState<[number, number]>([1, 1]);
    const [angle, setAngle] = React.useState(Math.PI / 4);

    // Funció z = 4 - 0.25(x^2 + y^2)
    const f = (x: number, y: number) => 4 - 0.25 * (x * x + y * y);
    const dfx = (x: number) => -0.5 * x;
    const dfy = (y: number) => -0.5 * y;

    const vx = Math.cos(angle);
    const vy = Math.sin(angle);

    // Derivada direccional: grad(f) * v
    const slope = dfx(a[0]) * vx + dfy(a[1]) * vy;
    const z0 = f(a[0], a[1]);

    // Punts per a la corba del tall 2D: f(a + t*v)
    const curvePoints = Array.from({ length: 41 }, (_, i) => {
        const t = -4 + i * 0.2;
        const x = a[0] + t * vx;
        const y = a[1] + t * vy;
        return [t, f(x, y)] as [number, number];
    });

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 my-8">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-black">Punt a</span>
                        <div className="flex gap-2">
                            <input type="range" min="-2" max="2" step="0.1" value={a[0]} onChange={e => setA([parseFloat(e.target.value), a[1]])} className="w-16 accent-indigo-500" />
                            <input type="range" min="-2" max="2" step="0.1" value={a[1]} onChange={e => setA([a[0], parseFloat(e.target.value)])} className="w-16 accent-indigo-500" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-black">Direcció θ</span>
                        <input type="range" min="0" max={Math.PI * 2} step="0.1" value={angle} onChange={e => setAngle(parseFloat(e.target.value))} className="w-32 accent-rose-500" />
                    </div>
                </div>
                <div className="bg-black/30 px-3 py-1 rounded-full border border-white/5 font-mono text-sm text-white">
                    <InlineMath math={`D_{\\vec{v}}f(\\vec{a}) = ${slope.toFixed(2)}`} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
                {/* 2D Slice View */}
                <div className="relative border-r border-white/5 bg-slate-950/20">
                    <div className="absolute top-2 left-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-indigo-300 font-bold border border-indigo-500/30">
                        VISTA DEL TALL (Plànol π)
                    </div>
                    <Mafs viewBox={{ x: [-4, 4], y: [0, 5] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Polygon points={[...curvePoints, [4, 0], [-4, 0]]} color={Theme.indigo} fillOpacity={0.05} weight={0} />
                        <Plot.OfX y={t => f(a[0] + t * vx, a[1] + t * vy)} color={Theme.indigo} weight={3} />

                        {/* Recta Tangent */}
                        <Plot.OfX y={t => z0 + slope * t} color={Theme.pink} weight={2} style="dashed" />

                        <Circle center={[0, z0]} radius={0.1} color={Theme.pink} fillOpacity={1} />
                        <MafsLaTeX at={[0, z0 + 0.5]} tex="f(\vec{a})" color={Theme.foreground} />
                    </Mafs>
                </div>

                {/* 3D Scene */}
                <div className="relative bg-slate-950/40">
                    <div className="absolute top-2 left-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-rose-300 font-bold border border-rose-500/30">
                        CONTEXT 3D (Pastís)
                    </div>
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[6, 6, 6]} />
                        <OrbitControls enableZoom={false} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />

                        <FunctionSurface f={(x, y) => f(x, y)} opacity={0.6} colorScale={1.2} />

                        {/* Plànol de tall vertical π */}
                        <group rotation={[0, -angle, 0]} position={[a[0], 0, a[1]]}>
                            <mesh position={[0, 2.5, 0]}>
                                <planeGeometry args={[10, 5]} />
                                <meshPhongMaterial color="#f43f5e" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
                            </mesh>
                        </group>

                        {/* Corba de tall ressaltada */}
                        <line>
                            <bufferGeometry attach="geometry">
                                <float32BufferAttribute
                                    attach="attributes-position"
                                    args={[new Float32Array(curvePoints.flatMap(([t, z]) => [a[0] + t * vx, z, a[1] + t * vy])), 3]}
                                />
                            </bufferGeometry>
                            <lineBasicMaterial attach="material" color="#818cf8" linewidth={3} />
                        </line>

                        {/* Punt i Vector director */}
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

    const f = (x: number, y: number) => 4 - 0.25 * (x * x + y * y);
    const dfx = (x: number) => -0.5 * x;
    const dfy = (y: number) => -0.5 * y;

    const z0 = f(a[0], a[1]);
    const currentSlope = mode === 'x' ? dfx(a[0]) : dfy(a[1]);



    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 my-8">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                        <button onClick={() => setMode('x')} className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${mode === 'x' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>RESPECTE A X</button>
                        <button onClick={() => setMode('y')} className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${mode === 'y' ? 'bg-rose-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>RESPECTE A Y</button>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                        Punt: ({a[0].toFixed(1)}, {a[1].toFixed(1)})
                    </div>
                </div>
                <div className="font-mono text-sm text-white bg-black/30 px-3 py-1 rounded-full border border-white/5">
                    <InlineMath math={mode === 'x' ? `\\frac{\\partial f}{\\partial x} = ${currentSlope.toFixed(2)}` : `\\frac{\\partial f}{\\partial y} = ${currentSlope.toFixed(2)}`} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[350px]">
                {/* Left: 2D Contour Map */}
                <div className="relative border-r border-white/5 bg-slate-950/20">
                    <div className="absolute top-2 left-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-slate-300 font-bold border border-white/10 italic">
                        MAPA DE CORBES DE NIVELL
                    </div>
                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        {/* Cercles de nivell aproximats: x^2 + y^2 = R^2 */}
                        {[1, 2, 3, 4, 5, 6].map(r => (
                            <Circle key={r} center={[0, 0]} radius={Math.sqrt(r * 4)} color={Theme.foreground} weight={1} fillOpacity={0.1} />
                        ))}

                        {/* Línia de tall */}
                        {mode === 'x' ? (
                            <Plot.OfX y={() => a[1]} color={Theme.indigo} weight={2} opacity={0.5} />
                        ) : (
                            <Plot.OfY x={() => a[0]} color={Theme.pink} weight={2} opacity={0.5} />
                        )}

                        <MovablePoint point={a} onMove={setA} color={mode === 'x' ? Theme.indigo : Theme.pink} />
                    </Mafs>
                </div>

                {/* Right: 1D Frozen Function */}
                <div className="relative bg-slate-950/40">
                    <div className="absolute top-2 left-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-slate-300 font-bold border border-white/10 italic">
                        FUNCIÓ CONGELADA (1 VARIABLE)
                    </div>
                    <Mafs viewBox={{ x: [-4, 4], y: [0, 5] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Plot.OfX y={t => mode === 'x' ? f(t, a[1]) : f(a[0], t)} color={mode === 'x' ? Theme.indigo : Theme.pink} weight={3} />

                        {/* Recta Tangent */}
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

const VisJacobianaDeformacioHibrida = () => {
    const [uv, setUv] = React.useState<[number, number]>([1, 1]);

    // Funció vectorial f: R2 -> R2 (transformació ondulada)
    const f = (u: number, v: number): [number, number] => [
        u + Math.cos(v),
        v + Math.sin(u)
    ];

    // Matriu Jacobiana Local Jf
    const df1dv = -Math.sin(uv[1]);
    const df2du = Math.cos(uv[0]);

    const eps = 0.5;
    const p0 = f(uv[0], uv[1]);
    const p1 = f(uv[0] + eps, uv[1]);
    const p12 = f(uv[0] + eps, uv[1] + eps);
    const p2 = f(uv[0], uv[1] + eps);

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 my-8">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Matriu Jacobiana Local</span>
                    <div className="text-xs text-slate-400 mt-1 italic">Transformació de (u,v) → (x,y)</div>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-indigo-300">
                    <InlineMath math={`\\mathcal{J}f(\\mathbf{a}) = \\begin{pmatrix} 1 & ${df1dv.toFixed(2)} \\\\ ${df2du.toFixed(2)} & 1 \\end{pmatrix}`} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 h-[500px]">
                {/* Espai Original */}
                <div className="relative border-r border-white/5 bg-slate-950/20">
                    <div className="absolute top-2 left-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-slate-300 font-bold">ESPAI ORIGINAL (u, v)</div>
                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false}>
                        <Coordinates.Cartesian />
                        <Polygon points={[[uv[0], uv[1]], [uv[0] + eps, uv[1]], [uv[0] + eps, uv[1] + eps], [uv[0], uv[1] + eps]]} color={Theme.indigo} fillOpacity={0.2} />
                        <MovablePoint point={uv} onMove={setUv} color={Theme.indigo} />
                    </Mafs>
                </div>

                {/* Espai Transformat */}
                <div className="relative bg-slate-950/40">
                    <div className="absolute top-2 left-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-slate-300 font-bold">ESPAI DEFORMAT (x, y)</div>
                    <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false}>
                        <Coordinates.Cartesian />
                        {/* Dibuixem una graella deformada simplificada */}
                        {[-4, -2, 0, 2, 4].map(t => (
                            <React.Fragment key={t}>
                                <Plot.Parametric xy={u => f(u, t)} t={[-4, 4]} color={Theme.foreground} opacity={0.1} />
                                <Plot.Parametric xy={v => f(t, v)} t={[-4, 4]} color={Theme.foreground} opacity={0.1} />
                            </React.Fragment>
                        ))}
                        <Polygon points={[p0, p1, p12, p2]} color={Theme.pink} fillOpacity={0.4} />
                        <Circle center={p0} radius={0.1} color={Theme.pink} />
                    </Mafs>
                </div>
            </div>
            <div className="p-4 bg-slate-800/30 text-[11px] text-slate-400 text-center border-t border-white/10">
                La matriu Jacobiana descriu com el quadrat blau del domini es converteix en el paral·lelogram rosa de la imatge.
            </div>
        </div>
    );
};

const VISUALIZERS: Record<string, React.FC> = {
    'vis_derivades_parcials_hibrida': VisDerivadesParcialsHibrida,
    'vis_derivada_direccional_hibrida': VisDerivadaDireccionalHibrida,
    'vis_distancia_3d': VisDistancia3D,
    'vis_superficies_basiques_3d': VisSuperficiesBasiques3D,
    'vis_corbes_nivell_3d_2d': VisCorbesNivell3D2D,
    'vis_distancia_sync_3d_2d': VisDistanciaSync3D2D,
    'vis_ex7_3_a': VisEx73a,
    'vis_ex7_3_b': VisEx73b,
    'punts_sella': VisPuntsSella,
    'paraboloide': VisParaboloide,
    'pla_tangent': VisPlaTangentINormalHibrid,
    'vector_gradient': VisVectorGradient,
    'maxim_local': VisMaximLocal,
    'minim_local': VisMinimLocal,
    'punt_sella_optim': VisPuntSellaOptim,
    'taylor_3d': VisTaylor3d,
    'vis_jacobiana': VisJacobianaDeformacioHibrida,
};

const ThreeVisualizer: React.FC<ThreeVisualizerProps> = ({ type }) => {
    const Component = VISUALIZERS[type];

    if (!Component) return <div className="p-4 bg-red-900/20 text-red-400 rounded-xl border border-red-500/30">Tipus 3D no trobat: {type}</div>;

    // Cas especial per a components HÍBRIDS (gestionen el seu propi Canvas/Layout)
    if (type === 'vis_corbes_nivell_3d_2d' || type === 'vis_distancia_sync_3d_2d' || type === 'vis_ex7_3_a' || type === 'vis_ex7_3_b' || type === 'vis_derivada_direccional_hibrida' || type === 'vis_derivades_parcials_hibrida' || type === 'pla_tangent' || type === 'vis_jacobiana') {
        return <Component />;
    }

    // Fallback per a navegadors sense WebGL (Windows amb drivers antics, etc.)
    if (!hasWebGL()) {
        return (
            <div className="w-full h-[500px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 my-8 flex flex-col items-center justify-center gap-4 p-8">
                <div className="text-4xl">🖥️</div>
                <p className="text-amber-400 font-semibold text-center">Visualització 3D no disponible</p>
                <p className="text-slate-500 text-sm text-center max-w-sm">
                    El teu navegador no té WebGL activat, necessari per als gràfics 3D interactius.
                    Prova d'activar l'acceleració de hardware a la configuració del navegador, o obre la web directament a <strong className="text-slate-400">chrome://flags</strong> i activa "Override software rendering list".
                </p>
            </div>
        );
    }

    return (
        <ThreeErrorBoundary>
            <div className="w-full h-[500px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10 my-8 relative group">
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-blue-400 font-mono flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        Vista en 3D
                    </div>
                </div>

                <Canvas shadows dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={50} />
                    <OrbitControls enableDamping dampingFactor={0.05} />

                    {/* Il·luminació Premium */}
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                    <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                    {/* Entorn */}
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <Grid
                        infiniteGrid
                        fadeDistance={50}
                        cellColor="#444"
                        sectionColor="#888"
                        sectionSize={5}
                        cellSize={1}
                    />

                    <Component />

                    {/* Eixos */}
                    <axesHelper args={[5]} />
                </Canvas>

                <div className="absolute bottom-4 left-4 flex flex-col gap-2 pointer-events-none">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                        <div className="w-24 h-2 rounded-full bg-linear-to-r from-blue-500 via-emerald-500 via-orange-500 to-red-500" />
                        <span className="text-[9px] text-white/70 font-mono uppercase tracking-tighter">Escala: alçada eix z</span>
                    </div>
                    <div className="flex gap-4 text-[9px] text-white/40 font-mono px-3">
                        <span>mínim (blau)</span>
                        <span className="ml-auto">màxim (vermell)</span>
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 text-[10px] text-white/50 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                    Fes clic i arrossega per rotar • Roda per zoom
                </div>
            </div>
        </ThreeErrorBoundary>
    );
};

export default ThreeVisualizer;

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
                        <button type="button"
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


export default VisRegularitatHibrida;

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


const VisTransformacionsHibrida = () => {
    const { isFullScreen, resizeKey } = useInteraction();
    const [type, setType] = React.useState<'rot' | 'ref' | 'proj' | 'esc'>('rot');
    const [alpha, setAlpha] = React.useState(45);
    const [k, setK] = React.useState(1.5);
    const [axis, setAxis] = React.useState<'x' | 'y' | 'z'>('z');
    const [showWireframe, setShowWireframe] = React.useState(true);

    const rad = (alpha * Math.PI) / 180;

    const matrix = useMemo(() => {
        const m = new THREE.Matrix3();
        const s = Math.sin(rad);
        const c = Math.cos(rad);

        switch (type) {
            case 'rot':
                // Rotation matrices (standard 3D)
                if (axis === 'z') m.set(c, -s, 0, s, c, 0, 0, 0, 1);
                else if (axis === 'x') m.set(1, 0, 0, 0, c, -s, 0, s, c);
                else if (axis === 'y') m.set(c, 0, s, 0, 1, 0, -s, 0, c);
                break;
            case 'ref':
                if (axis === 'z') m.set(1, 0, 0, 0, 1, 0, 0, 0, -1); // Reflection XY plane
                else if (axis === 'x') m.set(-1, 0, 0, 0, 1, 0, 0, 0, 1); // Reflection YZ plane
                else if (axis === 'y') m.set(1, 0, 0, 0, -1, 0, 0, 0, 1); // Reflection XZ plane
                break;
            case 'proj':
                if (axis === 'z') m.set(1, 0, 0, 0, 1, 0, 0, 0, 0); // Projection onto XY plane
                else if (axis === 'x') m.set(0, 0, 0, 0, 1, 0, 0, 0, 1); // Projection onto YZ plane
                else if (axis === 'y') m.set(1, 0, 0, 0, 0, 0, 0, 0, 1); // Projection onto XZ plane
                break;
            case 'esc':
                m.set(k, 0, 0, 0, k, 0, 0, 0, k);
                break;
        }
        return m;
    }, [type, alpha, k, axis]);

    const shape2D = [
        [0, 0], [0, 3], [2, 3], [2, 2.5], [0.5, 2.5], [0.5, 1.8], [1.5, 1.8], [1.5, 1.3], [0.5, 1.3], [0.5, 0], [0, 0]
    ];

    const f2D = (x: number, y: number): [number, number] => {
        const e = matrix.elements;
        // matrix.elements is column-major: [m11, m21, m31, m12, m22, m32, m13, m23, m33]
        return [e[0] * x + e[3] * y, e[1] * x + e[4] * y];
    };

    return (
        <div key={isFullScreen ? resizeKey : 'static'} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-950 ${isFullScreen ? 'h-full' : 'h-[650px] md:h-[700px]'}`}>
            {/* Header Control Panel */}
            <div className="p-4 bg-slate-900/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                    {[
                        { id: 'rot', label: 'Rotació', color: 'bg-indigo-600' },
                        { id: 'ref', label: 'Reflexió', color: 'bg-rose-600' },
                        { id: 'proj', label: 'Projecció', color: 'bg-amber-600' },
                        { id: 'esc', label: 'Escalat', color: 'bg-emerald-600' }
                    ].map((btn) => (
                        <button type="button"
                            key={btn.id}
                            onClick={() => setType(btn.id as any)}
                            className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${type === btn.id ? `${btn.color} text-white shadow-lg` : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-1 w-full max-w-sm gap-4">
                    {type === 'rot' && (
                        <div className="flex-1">
                            <div className="flex justify-between mb-1 px-1">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Angle: {alpha}º</span>
                            </div>
                            <input type="range" min="0" max="360" value={alpha} onChange={(e) => setAlpha(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                        </div>
                    )}
                    {type === 'esc' && (
                        <div className="flex-1">
                            <div className="flex justify-between mb-1 px-1">
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Factor: {k.toFixed(1)}x</span>
                            </div>
                            <input type="range" min="0.1" max="2.5" step="0.1" value={k} onChange={(e) => setK(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                        </div>
                    )}
                    {(type === 'rot' || type === 'ref' || type === 'proj') && (
                        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 h-fit self-end">
                            {(['x', 'y', 'z'] as const).map((a) => (
                                <button type="button"
                                    key={a}
                                    onClick={() => setAxis(a)}
                                    className={`w-6 h-6 flex items-center justify-center text-[9px] font-black uppercase rounded transition-all ${axis === a ? 'bg-slate-700 text-white' : 'text-slate-600 hover:text-slate-400'}`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button type="button"
                    onClick={() => setShowWireframe(!showWireframe)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${showWireframe ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-slate-800/50 border-white/5 text-slate-500'}`}
                >
                    <div className={`w-2 h-2 rounded-sm border ${showWireframe ? 'bg-indigo-400 border-indigo-300' : 'border-slate-500'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Wireframe</span>
                </button>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${isFullScreen ? 'grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                {/* 2D View */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/30 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] text-slate-400 font-bold uppercase tracking-widest border border-white/5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Pla XY (R²)
                    </div>
                    <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />

                        {/* Shadow Original */}
                        <Plot.Parametric
                            t={[0, shape2D.length - 1]}
                            xy={(t: number) => {
                                const i = Math.floor(t);
                                const next = Math.min(i + 1, shape2D.length - 1);
                                const alpha = t - i;
                                return [
                                    shape2D[i][0] * (1 - alpha) + shape2D[next][0] * alpha,
                                    shape2D[i][1] * (1 - alpha) + shape2D[next][1] * alpha
                                ];
                            }}
                            color={Theme.blue} opacity={0.1} weight={2}
                        />

                        {/* Transformed */}
                        <Plot.Parametric
                            t={[0, shape2D.length - 1]}
                            xy={(t: number) => {
                                const i = Math.floor(t);
                                const next = Math.min(i + 1, shape2D.length - 1);
                                const alpha = t - i;
                                const px = shape2D[i][0] * (1 - alpha) + shape2D[next][0] * alpha;
                                const py = shape2D[i][1] * (1 - alpha) + shape2D[next][1] * alpha;
                                return f2D(px, py);
                            }}
                            color={type === 'rot' ? Theme.indigo : (type === 'ref' ? Theme.red : (type === 'proj' ? Theme.orange : Theme.green))}
                            weight={4}
                        />
                    </Mafs>
                </div>

                {/* 3D View */}
                <div className="relative h-full overflow-hidden bg-slate-900/20">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] text-slate-400 font-bold uppercase tracking-widest border border-white/5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Espai R³
                    </div>
                    <Canvas shadows dpr={[1, 2]} camera={{ position: [6, 6, 6], fov: 40 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />

                        <OrbitControls enableZoom={true} makeDefault />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />
                        <axesHelper args={[5]} />

                        <TransformMesh matrix={matrix} type={type} showWireframe={showWireframe} />
                    </Canvas>
                </div>
            </div>

            {/* Matrix Panel */}
            <div className="p-4 bg-slate-900/90 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-x-auto">
                <div className="flex flex-col gap-1 min-w-fit">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Matriu Associada (M)</span>
                    <div className="flex items-center gap-3 font-mono text-sm">
                        <span className="text-3xl font-light text-slate-800 leading-none">[</span>
                        <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-center">
                            {matrix.elements.map((val, i) => (
                                <span key={i} className={`transition-all duration-300 ${val === 0 ? 'text-slate-700' : 'text-indigo-400 font-bold'}`}>
                                    {val.toFixed(2)}
                                </span>
                            ))}
                        </div>
                        <span className="text-3xl font-light text-slate-800 leading-none">]</span>
                    </div>
                </div>

                <div className="flex-1 max-w-md bg-black/30 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-400 leading-relaxed italic">
                        {type === 'rot' && `Rotació d'un objecte 3D respecte a l'eix ${axis.toUpperCase()}. Fixa't com el determinant es manté igual a 1.`}
                        {type === 'ref' && `Reflexió especular. El determinant canvia de signe (-1), indicant un canvi d'orientació (l'objecte "es gira" com un guant).`}
                        {type === 'proj' && `Projecció ortogonal. El determinant és 0 perquè l'espai s'ha "col·lapsat" cap a una dimensió inferior.`}
                        {type === 'esc' && `Homotècia o escalat uniforme. El determinant és k³, que és el factor de canvi del volum.`}
                    </p>
                </div>
            </div>
        </div>
    );
};

const TransformMesh = ({ matrix, type, showWireframe }: { matrix: THREE.Matrix3, type: string, showWireframe: boolean }) => {
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        s.lineTo(0, 3);
        s.lineTo(2, 3);
        s.lineTo(2, 2.5);
        s.lineTo(0.5, 2.5);
        s.lineTo(0.5, 1.8);
        s.lineTo(1.5, 1.8);
        s.lineTo(1.5, 1.3);
        s.lineTo(0.5, 1.3);
        s.lineTo(0.5, 0);
        s.lineTo(0, 0);
        return s;
    }, []);

    const meshRef = React.useRef<THREE.Mesh>(null);
    const color = type === 'rot' ? '#6366f1' : (type === 'ref' ? '#f43f5e' : (type === 'proj' ? '#f59e0b' : '#10b981'));

    React.useEffect(() => {
        if (meshRef.current) {
            const e = matrix.elements;
            const m4 = new THREE.Matrix4();
            m4.set(
                e[0], e[3], e[6], 0,
                e[1], e[4], e[7], 0,
                e[2], e[5], e[8], 0,
                0, 0, 0, 1
            );
            meshRef.current.matrixAutoUpdate = false;
            meshRef.current.matrix.copy(m4);
        }
    }, [matrix]);

    return (
        <group>
            <mesh scale={[1, 1, 1]}>
                <extrudeGeometry args={[shape, { depth: 0.2, bevelEnabled: false }]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.05} wireframe />
            </mesh>
            <mesh ref={meshRef}>
                <extrudeGeometry args={[shape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 }]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.2}
                    metalness={0.8}
                    roughness={0.2}
                    transparent
                    opacity={0.9}
                />

                {/* Wireframe Overlay for structural clarity */}
                {showWireframe && <meshBasicMaterial color="white" wireframe transparent opacity={0.5} />}
            </mesh>
        </group>
    );
};


export default VisTransformacionsHibrida;

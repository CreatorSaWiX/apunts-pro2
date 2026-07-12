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
                        <button type="button"
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


export default VisTaylorGrauN;

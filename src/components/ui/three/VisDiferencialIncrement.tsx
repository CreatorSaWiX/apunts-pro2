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
                    La diferència entre el canvi real de la funció i el diferencial lineal és l'error de l'aproximació ($R_1$). Com més gran és la distància (dx, dy), més gran és aquest error.
                </p>
            </div>
        </div>
    );
};


export default VisDiferencialIncrement;

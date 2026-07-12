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


const VisLagrangeMultiplicadors = () => {
    const [p, setP] = React.useState<[number, number]>([1.5, 1.5]);
    const { isFullScreen, resizeKey } = useInteraction();
    const isMobile = useIsMobile();

    const f = (x: number, y: number) => 0.4 * (x + 2 * y);
    const gradF = { x: 0.4, y: 0.8 };

    const radius = Math.sqrt(5);
    const gradG = (x: number, y: number) => ({ x: 2 * x, y: 2 * y });

    const currentGradG = gradG(p[0], p[1]);
    const gMag = Math.sqrt(currentGradG.x ** 2 + currentGradG.y ** 2);
    const fMag = Math.sqrt(gradF.x ** 2 + gradF.y ** 2);

    const nGradF = { x: gradF.x / fMag, y: gradF.y / fMag };
    const nGradG = { x: currentGradG.x / gMag, y: currentGradG.y / gMag };

    const dot = nGradF.x * nGradG.x + nGradF.y * nGradG.y;
    const isParallel = Math.abs(Math.abs(dot) - 1) < 0.05;

    return (
        <div key={resizeKey} className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col bg-slate-900 rounded-3xl border border-white/10 ${isFullScreen ? 'h-full' : ''}`}>
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Multiplicadors de Lagrange</span>
                    <span className="text-[9px] text-slate-500 font-mono">f(x,y) = x+2y | g(x,y) = x²+y²-5=0</span>
                </div>

                <div className="flex gap-2">
                    <div className={`px-3 py-2 rounded-xl border flex flex-col items-center min-w-[100px] transition-colors ${isParallel ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-black/40 border-white/5'}`}>
                        <span className={`text-[8px] font-black uppercase mb-1 ${isParallel ? 'text-emerald-400' : 'text-slate-500'}`}>Condició ∇f = λ∇g</span>
                        <span className={`text-[10px] font-bold ${isParallel ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {isParallel ? 'EXTREM TROBAT!' : 'EN BUSCA D\'EXTREMS'}
                        </span>
                    </div>
                </div>
            </div>

            <div className={`flex-none md:flex-1 grid grid-cols-1 ${isFullScreen ? 'h-full grid-rows-[1fr_1fr] landscape:grid-cols-2 landscape:grid-rows-1' : 'h-[550px] grid-rows-2 md:grid-cols-2 md:grid-rows-1'}`}>
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/30 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5 italic">Tangència de Gradients</div>
                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Circle center={[0, 0]} radius={radius} color={Theme.indigo} weight={3} />
                        
                        {[-4, -2, 0, 2, 4].map(k => (
                            <Plot.OfX key={k} y={x => (k - x) / 2} color={Theme.foreground} weight={1} opacity={0.15} />
                        ))}
                        
                        <Plot.OfX y={x => (p[0] + 2 * p[1] - x) / 2} color={Theme.yellow} weight={2} opacity={0.6} />

                        <Vector tail={p} tip={[p[0] + nGradF.x, p[1] + nGradF.y]} color={Theme.yellow} weight={3} />
                        <Vector tail={p} tip={[p[0] + nGradG.x, p[1] + nGradG.y]} color={Theme.indigo} weight={3} />

                        <MovablePoint point={p} onMove={(newP) => {
                            const dist = Math.sqrt(newP[0]**2 + newP[1]**2);
                            setP([newP[0] * radius / dist, newP[1] * radius / dist]);
                        }} color={Theme.foreground} />
                    </Mafs>
                    <div className="absolute bottom-4 left-4 flex flex-col gap-1 pointer-events-none">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-yellow-400" />
                            <span className="text-[8px] text-slate-400 font-black uppercase">Gradient ∇f</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-indigo-500" />
                            <span className="text-[8px] text-slate-400 font-black uppercase">Normal Restricció ∇g</span>
                        </div>
                    </div>
                </div>

                <div className="relative bg-slate-950/50 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-black/40 px-2 py-1 rounded text-[9px] text-slate-300 font-bold uppercase tracking-widest border border-white/5 italic">L'extrem a la muntanya</div>
                    <Canvas shadows={!isMobile ? { type: THREE.PCFShadowMap } : false} dpr={isMobile ? 1 : [1, 2]}>
                        <PerspectiveCamera makeDefault position={[6, 4, 6]} fov={40} />
                        <OrbitControls enableZoom={true} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <Grid infiniteGrid fadeDistance={30} cellColor="#333" sectionColor="#555" />

                        <FunctionSurface f={f} showWireframe={true} opacity={0.4} colorScale={3} />
                        
                        <Point position={[p[0], f(p[0], p[1]), p[1]]} color={isParallel ? "#10b981" : "#fbbf24"} />

                        <mesh rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0]}>
                            <torusGeometry args={[radius, 0.05, 16, 100]} />
                            <meshBasicMaterial color="#6366f1" />
                        </mesh>

                        {(() => {
                            const points = Array.from({ length: 100 }, (_, i) => {
                                const angle = (i / 99) * Math.PI * 2;
                                const px = Math.cos(angle) * radius;
                                const py = Math.sin(angle) * radius;
                                return new THREE.Vector3(px, f(px, py), py);
                            });
                            return <Line points={points} color="#6366f1" lineWidth={3} />;
                        })()}
                    </Canvas>
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/10 text-center">
                <p className="text-[10px] text-slate-300 italic max-w-2xl mx-auto leading-relaxed">
                    L'extrem condicionat es troba on les **corbes de nivell** de la funció (grogues) són **tangents** a la restricció (blava). 
                    En aquest punt, els gradients són paral·lels ($\nabla f = \lambda \nabla g$).
                </p>
            </div>
        </div>
    );
};


export default VisLagrangeMultiplicadors;

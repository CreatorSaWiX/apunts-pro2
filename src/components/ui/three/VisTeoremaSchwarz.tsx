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


export default VisTeoremaSchwarz;

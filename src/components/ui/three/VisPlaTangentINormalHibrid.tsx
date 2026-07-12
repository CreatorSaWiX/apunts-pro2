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


export default VisPlaTangentINormalHibrid;

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

export default VisSubespai3D;

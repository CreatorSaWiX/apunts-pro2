import React, { useMemo, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

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

const FunctionSurface = ({ f, colorScale = 5 }: { f: (x: number, y: number) => number, colorScale?: number }) => {
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
        <mesh geometry={geometry}>
            <meshPhongMaterial
                vertexColors
                side={THREE.DoubleSide}
                shininess={100}
                transparent
                opacity={0.8}
                wireframe={false}
            />
        </mesh>
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

const VisParaboloide = () => {
        const f = (x: number, y: number) => (x * x + y * y) * 0.1;
        return (
            <>
                <FunctionSurface f={f} />
                <Text position={[0, 3, 0]} color="white" fontSize={0.5}>
                    Paraboloide (f(x,y) = x² + y²)
                </Text>
            </>
        );
    };

const VisPlaTangent = () => {
        const f = (x: number, y: number) => 0.05 * (x * x + y * y);
        // Punt de tangència a (2, 2) -> f(2,2) = 0.05 * 8 = 0.4
        // f_x = 0.1x -> f_x(2,2) = 0.2
        // f_y = 0.1y -> f_y(2,2) = 0.2
        // Pla: z = 0.4 + 0.2(x-2) + 0.2(y-2)
        const a = 2, b = 2;
        const fa = 0.4;
        const dfx = 0.2, dfy = 0.2;

        return (
            <>
                <FunctionSurface f={f} />
                <Point position={[a, fa, b]} color="#00ff88" />
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[a, fa, b]}>
                    {/* El pla tangent dibuixat com un quatrat semi-transparent */}
                    <mesh rotation={[Math.PI / 2 - Math.atan(dfy), Math.atan(dfx), 0]}>
                       <planeGeometry args={[4, 4]} />
                       <meshPhongMaterial color="#00ccff" transparent opacity={0.5} side={THREE.DoubleSide} />
                    </mesh>
                </mesh>
                <Text position={[0, 4, 0]} color="white" fontSize={0.4} textAlign="center">
                    Aproximació Lineal: Pla Tangent en (2, 2)
                </Text>
            </>
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
                            <primitive object={new THREE.ArrowHelper(dir, new THREE.Vector3(0,0,0), 1.5, "#ff4400", 0.3, 0.2)} />
                            <Point position={[0,0,0]} color="white" />
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
        const f = (x: number, y: number) => Math.cos(x/2) * Math.sin(y/2) * 2;
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


const VISUALIZERS: Record<string, React.FC> = {
    'punts_sella': VisPuntsSella,
    'paraboloide': VisParaboloide,
    'pla_tangent': VisPlaTangent,
    'vector_gradient': VisVectorGradient,
    'maxim_local': VisMaximLocal,
    'minim_local': VisMinimLocal,
    'punt_sella_optim': VisPuntSellaOptim,
    'taylor_3d': VisTaylor3d,
};

const ThreeVisualizer: React.FC<ThreeVisualizerProps> = ({ type }) => {
    const Component = VISUALIZERS[type];

    if (!Component) return <div className="p-4 bg-red-900/20 text-red-400 rounded-xl border border-red-500/30">Tipus 3D no trobat: {type}</div>;

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

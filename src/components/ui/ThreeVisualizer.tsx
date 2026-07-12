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

import { lazy, Suspense } from 'react';

const VisPuntsSella = lazy(() => import('./three/VisPuntsSella'));
const VisParaboloide = lazy(() => import('./three/VisParaboloide'));
const VisVectorGradient = lazy(() => import('./three/VisVectorGradient'));
const VisVectorDirectorAngle = lazy(() => import('./three/VisVectorDirectorAngle'));
const VisTaylor3d = lazy(() => import('./three/VisTaylor3d'));
const VisDistancia3D = lazy(() => import('./three/VisDistancia3D'));
const VisEx76c = lazy(() => import('./three/VisEx76c'));
const VisSuperficiesBasiques3D = lazy(() => import('./three/VisSuperficiesBasiques3D'));
const VisCorbesNivell3D2D = lazy(() => import('./three/VisCorbesNivell3D2D'));
const VisDistanciaSync3D2D = lazy(() => import('./three/VisDistanciaSync3D2D'));
const VisEx73a = lazy(() => import('./three/VisEx73a'));
const VisSubespai3D = lazy(() => import('./three/VisSubespai3D'));
const VisKernelImatge3D = lazy(() => import('./three/VisKernelImatge3D'));
const VisEx78a = lazy(() => import('./three/VisEx78a'));
const VisEx78b = lazy(() => import('./three/VisEx78b'));
const VisEx78c = lazy(() => import('./three/VisEx78c'));
const VisEx73b = lazy(() => import('./three/VisEx73b'));
const VisDiferencialIncrement = lazy(() => import('./three/VisDiferencialIncrement'));
const VisExtremsHessiana = lazy(() => import('./three/VisExtremsHessiana'));
const VisLagrangeMultiplicadors = lazy(() => import('./three/VisLagrangeMultiplicadors'));
const VisOptimitzacioCompacte = lazy(() => import('./three/VisOptimitzacioCompacte'));
const VisFitaErrorLagrange = lazy(() => import('./three/VisFitaErrorLagrange'));
const VisTaylorGrauN = lazy(() => import('./three/VisTaylorGrauN'));
const VisTeoremaSchwarz = lazy(() => import('./three/VisTeoremaSchwarz'));
const VisRegularitatHibrida = lazy(() => import('./three/VisRegularitatHibrida'));
const VisPlaTangentINormalHibrid = lazy(() => import('./three/VisPlaTangentINormalHibrid'));
const VisDerivadaDireccionalHibrida = lazy(() => import('./three/VisDerivadaDireccionalHibrida'));
const VisDerivadesParcialsHibrida = lazy(() => import('./three/VisDerivadesParcialsHibrida'));
const VisRnDimensionality = lazy(() => import('./three/VisRnDimensionality'));
const VisTransformacionsHibrida = lazy(() => import('./three/VisTransformacionsHibrida'));

const VISUALIZERS: Record<string, React.ComponentType<any>> = {
    'vis_transformacions_hibrida': VisTransformacionsHibrida,
    'vis_rn_dimensionality': VisRnDimensionality,
    'vis_derivades_parcials_hibrida': VisDerivadesParcialsHibrida,
    'vis_derivada_direccional_hibrida': VisDerivadaDireccionalHibrida,
    'vis_distancia_3d': VisDistancia3D,
    'vis_superficies_basiques_3d': VisSuperficiesBasiques3D,
    'vis_corbes_nivell_3d_2d': VisCorbesNivell3D2D,
    'vis_distancia_sync_3d_2d': VisDistanciaSync3D2D,
    'vis_ex7_3_a': VisEx73a,
    'vis_ex7_3_b': VisEx73b,
    'vis_subespai_3d': VisSubespai3D,
    'vis_ex_7_8_a': VisEx78a,
    'vis_ex_7_8_b': VisEx78b,
    'vis_ex_7_8_c': VisEx78c,
    'vis_ex_7_6_c': VisEx76c,
    'punts_sella': VisPuntsSella,
    'paraboloide': VisParaboloide,
    'pla_tangent': VisPlaTangentINormalHibrid,
    'vector_gradient': VisVectorGradient,
    'taylor_3d': VisTaylor3d,
    'vis_vector_director_angle': VisVectorDirectorAngle,
    'vis_regularitat_hibrida': VisRegularitatHibrida,
    'vis_teorema_schwarz': VisTeoremaSchwarz,
    'vis_taylor_graun': VisTaylorGrauN,
    'vis_diferencial_increment': VisDiferencialIncrement,
    'vis_extrems_hessiana': VisExtremsHessiana,
    'vis_fita_error_lagrange': VisFitaErrorLagrange,
    'vis_kernel_imatge_3d': VisKernelImatge3D,
    'vis_lagrange_multiplicadors': VisLagrangeMultiplicadors,
    'vis_optimitzacio_compacte': VisOptimitzacioCompacte,
};


const ThreeVisualizerContent = ({ SurfaceComponent, isHybrid }: { SurfaceComponent: React.ComponentType<any>, isHybrid: boolean }) => {
    const isMobile = useIsMobile();
    const { isFullScreen } = useInteraction();

    if (isHybrid) {
        return <SurfaceComponent />;
    }

    return (
        <ThreeErrorBoundary>
            <div className={`w-full overflow-hidden relative group transition-all duration-500 flex flex-col ${isFullScreen ? 'h-full bg-slate-900' : 'h-[500px]'}`}>

                <div className="flex-1 relative">
                    <Canvas
                        shadows={{ type: THREE.PCFShadowMap }}
                        dpr={isMobile ? 1 : [1, 2]}
                        gl={{ antialias: true, powerPreference: "high-performance" }}
                    >
                        <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={50} />
                        <OrbitControls enableDamping dampingFactor={0.05} />

                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                        <Grid
                            infiniteGrid
                            fadeDistance={50}
                            cellColor="#444"
                            sectionColor="#888"
                            sectionSize={5}
                            cellSize={1}
                        />

                        <SurfaceComponent />
                        <axesHelper args={[5]} />
                    </Canvas>
                </div>

                {!isFullScreen && (
                    <div className="absolute bottom-4 right-4 text-[10px] text-white/50 bg-black/30 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                        Fes clic i arrossega per rotar • Roda per zoom
                    </div>
                )}
            </div>
        </ThreeErrorBoundary>
    );
};

const ThreeVisualizer: React.FC<ThreeVisualizerProps> = (props) => {
    // We explicitly destructure only the 'type' and ignore any 'children' 
    // passed by the MDX parser to avoid layout leakage in immersive mode.
    const { type } = props;
    const SurfaceComponent = VISUALIZERS[type];

    if (!SurfaceComponent) return <div className="p-4 bg-red-900/20 text-red-400 rounded-xl border border-red-500/30">Tipus 3D no trobat: {type}</div>;

    const hybridTypes = [
        'vis_transformacions_hibrida',
        'vis_rn_dimensionality',
        'vis_subespai_3d',
        'vis_corbes_nivell_3d_2d',
        'vis_distancia_sync_3d_2d',
        'vis_ex7_3_a',
        'vis_ex7_3_b',
        'vis_ex_7_8_a',
        'vis_ex_7_8_b',
        'vis_ex_7_8_c',
        'vis_derivada_direccional_hibrida',
        'vis_derivades_parcials_hibrida',
        'pla_tangent',
        'vis_vector_director_angle',
        'vis_regularitat_hibrida',
        'vis_teorema_schwarz',
        'vis_taylor_graun',
        'vis_diferencial_increment',
        'vis_extrems_hessiana',
        'vis_fita_error_lagrange',
        'vis_kernel_imatge_3d',
        'vis_lagrange_multiplicadors',
        'vis_optimitzacio_compacte'
    ];

    const isHybrid = hybridTypes.includes(type);

    if (!hasWebGL()) {
        return (
            <div className="w-full h-[500px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 my-8 flex flex-col items-center justify-center gap-4 p-8">
                <div className="text-4xl">🖥️</div>
                <p className="text-amber-400 font-semibold text-center">Visualització 3D no disponible</p>
                <p className="text-slate-500 text-sm text-center max-w-sm">
                    El teu navegador no té WebGL activat. Prova d'activar l'acceleració de hardware.
                </p>
            </div>
        );
    }

    return (
        <InteractionLock className="my-8" key={type}>
            <Suspense fallback={<div className="p-4 flex items-center justify-center h-[400px]">Carregant visualització 3D...</div>}><ThreeVisualizerContent SurfaceComponent={SurfaceComponent} isHybrid={isHybrid} /></Suspense>
        </InteractionLock>
    );
};

export default ThreeVisualizer;

import { useState, useEffect, useMemo } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Grid, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import GraphVisualizer from './GraphVisualizer';
import { Mafs, Coordinates, Plot } from 'mafs';
import "mafs/core.css";

interface AuthCanvasBackgroundProps {
    variant?: 'login' | 'register';
}

// ---------------------------
// Phase 1: Space (Three.js)
// ---------------------------
const AnimatedSurface = ({ variant }: { variant: 'login' | 'register' }) => {
    const geometry = useMemo(() => {
        const size = 30;
        const segments = 45; // Optimized from 60 to 45 (approx 44% less vertices) to save CPU
        const geo = new THREE.PlaneGeometry(size, size, segments, segments);
        geo.rotateX(-Math.PI / 2);

        const count = geo.attributes.position.count;
        geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));

        return geo;
    }, []);

    const color = useMemo(() => new THREE.Color(), []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime() * 0.8;
        const position = geometry.attributes.position;
        const colorAttr = geometry.attributes.color;

        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const z = position.getZ(i);

            let y = 0;
            if (variant === 'login') {
                // Inverted paraboloid amb ondulació
                const distSq = x * x + z * z;
                y = 8 - distSq * 0.15 + Math.sin(x * 0.5 + t) * Math.cos(z * 0.5 + t) * 0.5;
                // Gradient HSL de blau a vermell
                color.setHSL(0.7 - Math.min(Math.max((y + 5) / 15, 0), 0.7), 0.8, 0.5);
            } else {
                // Ripple / Drop interference per Register
                const dist = Math.sqrt(x * x + z * z);
                y = Math.sin(dist * 1.5 - t * 3) * 1.5 + 2;
                // Gradient HSL diferent (Tons càlids i maragda)
                color.setHSL(0.4 - Math.min(Math.max((y + 2) / 8, -0.2), 0.4), 0.8, 0.5);
            }

            position.setY(i, y);
            colorAttr.setXYZ(i, color.r, color.g, color.b);
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.computeVertexNormals();
    });

    return (
        <group>
            {/* Wireframe layer */}
            <mesh geometry={geometry}>
                <meshBasicMaterial
                    color="#ffffff"
                    wireframe={true}
                    transparent
                    opacity={0.15}
                    side={THREE.DoubleSide}
                />
            </mesh>
            {/* Solid colored layer */}
            <mesh geometry={geometry} position={[0, -0.05, 0]}>
                <meshPhongMaterial
                    vertexColors={true}
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                    shininess={50}
                />
            </mesh>
        </group>
    );
};

const SpaceBackground = ({ variant }: { variant: 'login' | 'register' }) => {
    const [dpr, setDpr] = useState(1.5);
    
    return (
        <div className="absolute inset-0 w-full h-full bg-[#020617] pointer-events-auto">
            <Canvas camera={{ position: [0, 8, 18], fov: 60 }} dpr={dpr}>
                <PerformanceMonitor onIncline={() => setDpr(1.5)} onDecline={() => setDpr(1)} />
                <fog attach="fog" args={['#020617', 10, 40]} />
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />
                <AnimatedSurface variant={variant} />
                <Grid infiniteGrid fadeDistance={50} cellColor="#334155" sectionColor="#475569" sectionThickness={1} cellThickness={0.5} position={[0, -5, 0]} />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} maxPolarAngle={Math.PI / 2 - 0.05} minPolarAngle={Math.PI / 4} target={[0, 2, 0]} />
                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} />
            </Canvas>
        </div>
    );
};

// ---------------------------
// Phase 2: Network (Force Graph)
// ---------------------------
const NetworkBackground = ({ variant }: { variant: 'login' | 'register' }) => {
    const graphData = useMemo(() => {
        const N = 70;
        const nodes = Array.from({ length: N }).map((_, id) => {
            let color = id % 3 === 0 ? '#10b981' : id % 3 === 1 ? '#38bdf8' : '#8b5cf6';
            if (variant === 'register') {
                color = id % 3 === 0 ? '#f43f5e' : id % 3 === 1 ? '#fbbf24' : '#34d399';
            }
            return {
                id: String(id),
                label: `Concepte ${id}`,
                color,
                group: id % 3
            };
        });
        const links = [];

        // Generate an organic scale-free-like structure
        for (let i = 1; i < N; i++) {
            links.push({ source: String(i), target: String(Math.floor(Math.pow(Math.random(), 2) * i)) });
        }

        // Add random cross connections
        for (let i = 0; i < N * 0.5; i++) {
            const src = Math.floor(Math.random() * N);
            const tgt = Math.floor(Math.random() * N);
            if (src !== tgt) {
                links.push({ source: String(src), target: String(tgt) });
            }
        }
        return { nodes, links };
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full bg-[#020617] pointer-events-auto">
            {/* Utilitzem el component GraphVisualizer del projecte, que ja té configurat el drag, zoom automàtic i detecció de col·lisions de ratolí */}
            <GraphVisualizer
                initialData={graphData}
                transparentBg={true}
                showControls={false}
                autoCenter={true}
            />
        </div>
    );
};

// ---------------------------
// Phase 3: Math (Mafs)
// ---------------------------
const MathBackground = ({ variant }: { variant: 'login' | 'register' }) => {
    const [time, setTime] = useState(0);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let frameId: number;
        let lastTime = 0;
        const render = (t: number) => {
            if (t - lastTime >= 33) {
                setTime(t / 1000);
                lastTime = t;
            }
            frameId = requestAnimationFrame(render);
        };
        frameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(frameId);
    }, []);

    const taylorT = (Math.sin(time * 0.8) + 1) * 2; // Oscil·la entre 0 i 4 termes

    // Centrat perfecte usant les dimensions de la finestra
    return (
        <div className="absolute inset-0 w-full h-full bg-[#020617] flex items-center justify-center opacity-80 pointer-events-none">
            <Mafs
                viewBox={{ x: [-10, 10], y: [-5, 5] }}
                pan={false}
                zoom={false}
                width={dimensions.width}
                height={dimensions.height}
            >
                <Coordinates.Cartesian subdivisions={5} />

                {variant === 'login' ? (
                    <>
                        {/* Integració Animada */}
                        <Plot.OfX y={(x) => Math.sin(x - time) * 3} color="#8b5cf6" weight={3} />
                        <Plot.Inequality
                            y={{ '<=': (x) => Math.max(0, Math.sin(x - time) * 3), '>=': () => 0 }}
                            color="#10b981"
                        />
                        <Plot.Inequality
                            y={{ '>=': (x) => Math.min(0, Math.sin(x - time) * 3), '<=': () => 0 }}
                            color="#f43f5e"
                        />
                        {/* Ona d'interferència */}
                        <Plot.OfX y={(x) => Math.cos(x * 1.5 + time * 1.2) * 2} color="#0ea5e9" weight={2} opacity={0.7} />
                    </>
                ) : (
                    <>
                        {/* Sèrie de Taylor Animada */}
                        <Plot.OfX y={(x) => Math.sin(x) * 3} color="#475569" weight={4} opacity={0.5} />

                        <Plot.OfX
                            y={(x) => {
                                const t1 = x;
                                const t3 = -(x * x * x) / 6;
                                const t5 = (x * x * x * x * x) / 120;
                                const t7 = -(x * x * x * x * x * x * x) / 5040;

                                const w3 = Math.max(0, Math.min(1, taylorT));
                                const w5 = Math.max(0, Math.min(1, taylorT - 1));
                                const w7 = Math.max(0, Math.min(1, taylorT - 2));

                                return (t1 + t3 * w3 + t5 * w5 + t7 * w7) * 3;
                            }}
                            color="#fbbf24"
                            weight={3}
                        />

                        {/* Paramètrica de Lissajous */}
                        <Plot.Parametric
                            t={[0, Math.PI * 2]}
                            xy={(t_param) => [
                                (5 + Math.sin(time)) * Math.cos(3 * t_param + time),
                                (5 + Math.cos(time)) * Math.sin(4 * t_param)
                            ]}
                            color="#38bdf8"
                            weight={2}
                            opacity={0.6}
                        />
                    </>
                )}
            </Mafs>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#020617_75%)] pointer-events-none z-10" />
        </div>
    );
};

// ---------------------------
// Main Orchestrator
// ---------------------------
export const AuthCanvasBackground = ({ variant = 'login' }: AuthCanvasBackgroundProps) => {
    const [phase, setPhase] = useState<'space' | 'network' | 'math'>('space');

    useEffect(() => {
        const phases: ('space' | 'network' | 'math')[] = ['space', 'network', 'math'];
        let currentIndex = 0;

        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % phases.length;
            setPhase(phases[currentIndex]);
        }, 12000); // 12s per phase

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-[#020617] pointer-events-auto">
            <AnimatePresence mode="popLayout">
                {phase === 'space' && (
                    <motion.div
                        key="space"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <SpaceBackground variant={variant} />
                    </motion.div>
                )}
                {phase === 'network' && (
                    <motion.div
                        key="network"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <NetworkBackground variant={variant} />
                    </motion.div>
                )}
                {phase === 'math' && (
                    <motion.div
                        key="math"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <MathBackground variant={variant} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlays for depth and readability */}
            <div className="absolute inset-0 bg-[#020617]/30 pointer-events-none z-10" />

            {/* Dark gradient on the right so the form is readable */}
            <div className="absolute inset-0 bg-gradient-to-l from-[#020617] via-[#020617]/40 to-transparent pointer-events-none z-10" />
            {/* Dark gradient on the bottom for the story text */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 pointer-events-none z-10" />

            {/* Storytelling Text based on Phase */}
            <div className="absolute bottom-12 left-12 max-w-sm z-20 hidden lg:block pointer-events-none">
                <AnimatePresence mode="wait">
                    {phase === 'space' && (
                        <motion.div
                            key="t-space"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 1 }}
                        >
                            <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                I. Renderització i Shaders
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">
                                Darrere d'un wireframe 3D s'amaguen grafs de vèrtexs. Apliquem corbes de Bézier per a animacions, shaders GLSL i Raytracing. Les matemàtiques fan possible el món virtual.
                            </p>
                        </motion.div>
                    )}
                    {phase === 'network' && (
                        <motion.div
                            key="t-network"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 1 }}
                        >
                            <h3 className="text-sky-400 font-bold uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                                II. Teoria de Grafs i Xarxes
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">
                                Els grafs mouen el món. Defineixen algorismes en xarxes de servidors, estructuren xarxes neuronals de la IA i organitzen la lògica amb nodes a Unity o TSL a Three.js.
                            </p>
                        </motion.div>
                    )}
                    {phase === 'math' && (
                        <motion.div
                            key="t-math"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 1 }}
                        >
                            <h3 className="text-violet-400 font-bold uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                                III. Àlgebra i GPGPU
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">
                                Les funcions i l'àlgebra lineal processen matrius de transformació 3D i aprofiten el poder massiu del GPGPU. Tot allò que s'estudia té una aplicació real i fascinant.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

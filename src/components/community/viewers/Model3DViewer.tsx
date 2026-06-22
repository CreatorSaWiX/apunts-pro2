import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

import Spinner from '../../ui/Spinner';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Maximize2 } from 'lucide-react';

interface Model3DViewerProps {
    url: string;
    filename: string;
}

const Model = ({ url }: { url: string }) => {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
};

const Model3DViewer = ({ url, filename }: Model3DViewerProps) => {
    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-linear-to-b from-[#111] to-[#050505] shadow-[0_0_40px_rgba(0,0,0,0.5)] group">
            
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">Interactive 3D</span>
                <span className="text-xs text-slate-400 ml-1">({filename})</span>
            </div>

            <button className="absolute bottom-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10">
                <Maximize2 size={16} />
            </button>

            <Suspense fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                    <Spinner size="xl" variant="primary" className="mb-4" />
                    <span className="text-sm font-medium text-slate-400">Carregant entorn 3D...</span>
                </div>
            }>
                <Canvas shadows camera={{ position: [0, 0, 150], fov: 45 }}>
                    <Stage environment="city" intensity={0.5} adjustCamera>
                        <Model url={url} />
                    </Stage>
                    <OrbitControls makeDefault autoRotate autoRotateSpeed={1} enableZoom={true} />
                </Canvas>
            </Suspense>
            
            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                <p className="text-[10px] text-white/50 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">Clica i arrossega per rotar • Fes scroll per zoom</p>
            </div>
        </div>
    );
};

// Pre-load the common types
// useGLTF.preload(url) should ideally be called outside the component if url is static, but here it's dynamic.

export default Model3DViewer;

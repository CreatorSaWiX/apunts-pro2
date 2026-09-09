import { Suspense, useRef, memo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import Spinner from '../../ui/Spinner';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Model3DViewerProps {
    url: string;
    filename: string;
}

const Model = ({ url }: { url: string }) => {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
};

const Model3DViewer = ({ url, filename }: Model3DViewerProps) => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(console.error);
        } else {
            containerRef.current.requestFullscreen().catch(console.error);
        }
    }, []);

    return (
        <div 
            ref={containerRef}
            className={`relative w-full rounded-xl overflow-hidden border border-white/10 bg-linear-to-b from-[#111] to-[#050505] shadow-[0_0_40px_rgba(0,0,0,0.5)] group ${isFullscreen ? 'h-screen w-screen border-none rounded-none' : 'aspect-video'}`}
        >
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">Interactive 3D</span>
                <span className="text-xs text-slate-400 ml-1 truncate max-w-40 sm:max-w-none">({filename})</span>
            </div>

            <button
                type="button"
                onClick={toggleFullscreen}
                className="absolute bottom-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 cursor-pointer"
                title={isFullscreen ? t('common.minimize', "Minimitzar") : t('common.fullscreen', "Pantalla completa")}
                aria-label={isFullscreen ? t('common.minimize', "Minimitzar") : t('common.fullscreen', "Pantalla completa")}
            >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            <Suspense fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                    <Spinner size="xl" variant="primary" className="mb-4" />
                    <span className="text-sm font-medium text-slate-400">{t('community.viewers.loading3D', 'Carregant entorn 3D...')}</span>
                </div>
            }>
                <Canvas shadows camera={{ position: [0, 0, 150], fov: 45 }} dpr={[1, 1.5]}>
                    <Stage environment="city" intensity={0.5} adjustCamera>
                        <Model url={url} />
                    </Stage>
                    <OrbitControls makeDefault autoRotate autoRotateSpeed={1} enableZoom={true} />
                </Canvas>
            </Suspense>

            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                <p className="text-[10px] text-white/50 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                    {t('community.viewers.controls3D', 'Clica i arrossega per rotar • Fes scroll per zoom')}
                </p>
            </div>
        </div>
    );
};

export default memo(Model3DViewer);

import { lazy, Suspense } from 'react';
import Model3DViewer from './Model3DViewer';
import VideoViewer from './VideoViewer';
import { Download, File, Box } from 'lucide-react';
import Spinner from '../../ui/Spinner';

const PdfViewer = lazy(() => import('./PdfViewer'));
const CodeViewer = lazy(() => import('./CodeViewer'));

const ViewerSkeleton = ({ text }: { text: string }) => (
    <div className="w-full h-64 md:h-96 bg-slate-900/50 animate-pulse rounded-xl border border-white/10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500">
            <Spinner />
            <span className="text-sm font-medium">{text}</span>
        </div>
    </div>
);

interface FileViewerRendererProps {
    url: string;
    filename: string;
    type: string;
    size: number;
}

const CODE_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css', 'cpp', 'c', 'h', 'hpp', 'py', 'java', 'go', 'rs', 'php', 'rb'];
const MODEL_EXTENSIONS = ['gltf', 'glb', 'obj'];

const FileViewerRenderer = ({ url, filename, type, size }: FileViewerRendererProps) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    // Route to the correct viewer based on type or extension
    if (type.startsWith('video/')) {
        return <VideoViewer url={url} filename={filename} />;
    }

    if (type === 'application/pdf') {
        return (
            <Suspense fallback={<ViewerSkeleton text="Carregant visor PDF..." />}>
                <PdfViewer url={url} filename={filename} />
            </Suspense>
        );
    }

    if (CODE_EXTENSIONS.includes(ext) || type.startsWith('text/')) {
        return (
            <Suspense fallback={<ViewerSkeleton text="Carregant codi..." />}>
                <CodeViewer url={url} filename={filename} />
            </Suspense>
        );
    }

    if (MODEL_EXTENSIONS.includes(ext) || type.includes('model')) {
        return <Model3DViewer url={url} filename={filename} />;
    }

    // Default fallback: a premium styled download card for unsupported files (ZIP, etc)
    return (
        <div className="w-full p-6 rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/[0.01] flex flex-col sm:flex-row items-center gap-6 justify-between group hover:border-primary/50 transition-colors shadow-xl">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                    {ext === 'zip' || ext === 'rar' || ext === 'tar' ? (
                        <Box size={32} className="text-slate-400 group-hover:text-primary transition-colors" />
                    ) : (
                        <File size={32} className="text-slate-400 group-hover:text-primary transition-colors" />
                    )}
                </div>
                <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{filename}</h4>
                    <p className="text-sm text-slate-400 mt-1">
                        {(size / 1024 / 1024).toFixed(2)} MB • Arxiu .{ext.toUpperCase()}
                    </p>
                </div>
            </div>
            
            <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-primary text-white font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg shrink-0"
            >
                <Download size={18} />
                Descarregar
            </a>
        </div>
    );
};

export default FileViewerRenderer;

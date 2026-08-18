
import React, { useRef, useState, useEffect, useCallback, lazy, Suspense } from 'react';
const ForceGraph2D = lazy(() => import('react-force-graph-2d'));
import { useSubjectStore } from '../../../stores/useSubjectStore';
import { RotateCcw } from 'lucide-react';
import { useInView } from 'framer-motion';
import { InteractionLock } from '../system/InteractionLock';
import { useInteraction } from '../../../contexts/InteractionContext';
import Spinner from '../Spinner';

interface GraphNodeObject {
    id: string | number;
    label?: string;
    group?: number;
    color?: string;
    x?: number;
    y?: number;
}

interface GraphLinkObject {
    source: string | number | GraphNodeObject;
    target: string | number | GraphNodeObject;
    label?: string;
    color?: string;
    curvature?: number;
}

interface ForceGraphMethods {
    zoomToFit: (duration?: number, padding?: number) => void;
    d3ReheatSimulation: () => void;
    zoom: (val?: number) => number;
    pauseAnimation: () => void;
    resumeAnimation: () => void;
}

interface GraphVisualizerProps {
    initialData?: {
        nodes: { id: string | number; label?: string; group?: number; color?: string }[];
        links: { source: string | number; target: string | number; label?: string }[];
    };
    edges?: string;
    nodes?: string;
    height?: number;
    showControls?: boolean;
    updateTrigger?: unknown;
    isAnimating?: boolean;
    transparentBg?: boolean;
    autoCenter?: boolean;
    directed?: boolean;
}

const defaultData = {
    nodes: [
        { id: 0, label: '0', group: 1 },
        { id: 1, label: '1', group: 1 },
        { id: 2, label: '2', group: 1 },
        { id: 3, label: '3', group: 1 },
        { id: 4, label: '4', group: 1 },
    ],
    links: [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 0, target: 3 },
        { source: 1, target: 3 },
    ]
};

const extractText = (node: React.ReactNode): string => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (typeof node === 'object' && node !== null && 'props' in node) {
        const props = (node as { props?: { code?: string; children?: React.ReactNode } }).props;
        if (props?.code && typeof props.code === 'string') return props.code;
        if (props?.children) return extractText(props.children);
    }
    return '';
};

const GraphVisualizer: React.FC<GraphVisualizerProps & { children?: React.ReactNode }> = ({
    initialData,
    edges,
    nodes,
    height = 300,
    children,
    showControls = true,
    updateTrigger,
    isAnimating,
    transparentBg = false,
    autoCenter = false,
    directed
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fgRef = useRef<ForceGraphMethods | null>(null);
    const numericHeight = Number(height);
    const [dimensions, setDimensions] = useState({ width: 0, height: numericHeight });
    const { subject, theme } = useSubjectStore();
    const [isHovered, setIsHovered] = useState(false);

    // Default to undirected for Math subjects (M1, M2), directed otherwise.
    const isDirected = directed !== undefined 
        ? directed 
        : (subject !== 'M1' && subject !== 'M2');

    // Performance optimization: only render heavy 2D Canvas when visible.
    // We remove once: true so we can pause/resume simulation dynamically based on scroll.
    const isInView = useInView(containerRef, { margin: "50px" });
    const [hasMounted, setHasMounted] = useState(false);

    // Initial mount flag
    useEffect(() => {
        if (isInView && !hasMounted) {
            setHasMounted(true);
        }
    }, [isInView, hasMounted]);

    // Pause canvas simulation when out of viewport to save 100% CPU loops on pages with many graphs
    useEffect(() => {
        if (fgRef.current && hasMounted) {
            if (isInView || isAnimating) {
                fgRef.current.resumeAnimation();
            } else {
                fgRef.current.pauseAnimation();
            }
        }
    }, [isInView, hasMounted, isAnimating]);

    // Force repaint or request auto-center when updateTrigger changes
    const zoomToggle = useRef(false);
    const needsFit = useRef(false);

    useEffect(() => {
        if (fgRef.current && hasMounted && initialZoomDone.current) {
            if (autoCenter) {
                needsFit.current = true;
                // Force physics to run so engineStop will definitely fire
                fgRef.current.d3ReheatSimulation();
            } else {
                // We use a microscopic zoom delta to force a redraw of the canvas instantly
                // without triggering the N-body physics simulation
                const z = fgRef.current.zoom();
                zoomToggle.current = !zoomToggle.current;
                fgRef.current.zoom(zoomToggle.current ? z - 0.000001 : z + 0.000001);
            }
        }
    }, [updateTrigger, hasMounted, autoCenter]);

    // Parse Data
    const graphData = React.useMemo(() => {
        if (initialData) {
            return initialData;
        } 
        
        if (children) {
            const text = extractText(children).trim();
            if (text.startsWith('{') && text.endsWith('}')) {
                try {
                    const json = JSON.parse(text);
                    if (json.nodes && json.links) {
                        return json;
                    }
                } catch (e) {
                    console.warn("Failed to parse graph JSON:", e);
                }
            }
        }

        if (edges) {
            const linkList: { source: string | number; target: string | number }[] = [];
            const nodeList = new Set<string>(); // Use Set to avoid duplicates

            // Parse edges: "A-B, B-C"
            edges.split(',').forEach(pair => {
                const parts = pair.trim().split(/[-=]/);
                if (parts.length >= 2) {
                    const source = parts[0].trim();
                    const target = parts[1].trim();
                    linkList.push({ source, target });
                    nodeList.add(source);
                    nodeList.add(target);
                }
            });

            if (nodes) {
                nodes.split(',').forEach((n: string) => nodeList.add(n.trim()));
            }

            return {
                nodes: Array.from(nodeList).map(id => ({ id, label: id, group: 1 })),
                links: linkList
            };
        }
        
        return defaultData;
    }, [initialData, edges, nodes, children]);

    // Resize Handler
    useEffect(() => {

        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: transparentBg ? (containerRef.current.clientHeight || numericHeight) : numericHeight
                });
            }
        };
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        const debouncedUpdate = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(updateDimensions, 100);
        };

        window.addEventListener('resize', debouncedUpdate);

        let observer: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
            observer = new ResizeObserver(() => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(updateDimensions, 100);
            });
            observer.observe(containerRef.current);
        }

        updateDimensions();

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', debouncedUpdate);
            if (observer) observer.disconnect();
        };
    }, [numericHeight, transparentBg]);

    const drawNode = useCallback((node: GraphNodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const label = node.label || String(node.id);
        const fontSize = 12 / globalScale;
        const r = 6;
        const color = node.color || theme.primary || '#8b5cf6';

        ctx.beginPath();
        ctx.arc((node.x || 0), (node.y || 0), r, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2 / globalScale;
        ctx.stroke();

        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(label, (node.x || 0), (node.y || 0) + r + fontSize);
    }, [theme]);

    const initialZoomDone = useRef(false);
    const [hasCanvasProtection, setHasCanvasProtection] = useState(false);

    useEffect(() => {
        const checkBrowser = async () => {
            const nav = window.navigator as unknown as { brave?: { isBrave?: () => Promise<boolean> } };
            if (nav.brave?.isBrave && (await nav.brave.isBrave())) {
                setHasCanvasProtection(true);
                return;
            }

            const ua = window.navigator.userAgent || '';
            if (ua.includes('OPR/') || ua.includes('Opera GX')) {
                setHasCanvasProtection(true);
            }
        };

        checkBrowser();
    }, []);

    const getNodeColor = useCallback((node: GraphNodeObject) => node.color || theme.primary || '#8b5cf6', [theme.primary]);
    const getNodeCanvasObjectMode = useCallback(() => 'after' as const, []);
    const getLinkColor = useCallback((link: GraphLinkObject) => link.color || '#475569', []);
    const getLinkCurvature = useCallback((link: GraphLinkObject) => link.curvature || 0, []);

    const handleEngineStop = useCallback(() => {
        if (fgRef.current) {
            if (!initialZoomDone.current || needsFit.current) {
                fgRef.current.zoomToFit(400, numericHeight <= 150 ? 12 : 30);
                initialZoomDone.current = true;
                needsFit.current = false;
            }
        }
    }, [numericHeight]);

    const handleReset = () => {
        if (fgRef.current) {
            fgRef.current.zoomToFit(400, numericHeight <= 150 ? 12 : 20);
            fgRef.current.d3ReheatSimulation();
        }
    };

    const handleNodeHover = useCallback((node: GraphNodeObject | null) => {
        if (node) {
            if (containerRef.current) containerRef.current.style.cursor = 'grab';
        } else {
            if (containerRef.current) containerRef.current.style.cursor = 'default';
        }
    }, []);

    const { isFullScreen } = useInteraction();

    return (
        <InteractionLock disabled className={transparentBg ? 'h-full w-full' : 'my-8'}>
            <div
                className={`relative group overflow-hidden ${transparentBg ? 'h-full w-full' : 'bg-slate-900/40 rounded-2xl'} transition duration-500 ${isFullScreen ? 'h-full bg-slate-900' : ''}`}
                style={transparentBg ? {} : { height: isFullScreen ? '100%' : numericHeight }}
                ref={containerRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Controls */}
                {showControls && (
                    <div className={`absolute bottom-2 right-2 z-10 flex gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors pointer-events-auto"
                            title="Reset View"
                            aria-label="Reset View">
                            <RotateCcw size={14} />
                        </button>
                        {/* Notice for Brave/Opera GX Users with Canvas Poisoning Active */}
                        {hasCanvasProtection && (
                            <div className="hidden group-hover:flex items-center text-[10px] text-slate-500 bg-slate-800/80 px-2 rounded-lg border border-slate-700 h-7">
                                Brave / Escuts actius? Apaga'ls per arrossegar nodes.
                            </div>
                        )}
                    </div>
                )}

                {/* Placeholder for when graph is out of view */}
                {(!hasMounted && dimensions.width > 0) && (
                    <div
                        className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-900/50 pointer-events-none"
                        style={{ height: dimensions.height }}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <Spinner size="md" variant="primary" />
                            <span className="text-xs font-mono uppercase tracking-widest opacity-40">Renderitzant Graf...</span>
                        </div>
                    </div>
                )}

                {(hasMounted && dimensions.width > 0) && (
                    <Suspense fallback={null}>
                        <ForceGraph2D
                            ref={fgRef as any}
                            width={dimensions.width}
                            height={dimensions.height}
                            graphData={graphData}
                            nodeRelSize={6} // Increased size
                            nodeColor={getNodeColor as any}
                            nodeCanvasObjectMode={getNodeCanvasObjectMode}
                            nodeCanvasObject={drawNode as any}
                            onNodeHover={handleNodeHover as any}
                            nodeLabel="label"
                            linkColor={getLinkColor as any}
                            linkCurvature={getLinkCurvature as any}
                            linkDirectionalParticles={isDirected ? 2 : 0}
                            linkDirectionalParticleSpeed={0.005}
                            linkDirectionalParticleWidth={2}
                            linkDirectionalArrowLength={isDirected ? 6 : 0}
                            linkDirectionalArrowRelPos={1}
                            backgroundColor="rgba(0,0,0,0)"
                            linkWidth={2.5} // Thicker connections
                            d3VelocityDecay={0.15} // Slightly more floaty
                            cooldownTicks={100}
                            onEngineStop={handleEngineStop}
                        />
                    </Suspense>
                )}
            </div>
        </InteractionLock>
    );
};

export default GraphVisualizer;

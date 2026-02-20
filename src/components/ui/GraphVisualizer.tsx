
import React, { useRef, useState, useEffect, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useSubject } from '../../contexts/SubjectContext';
import { RotateCcw } from 'lucide-react';
import { useInView } from 'framer-motion';

interface GraphVisualizerProps {
    initialData?: {
        nodes: { id: string | number; label?: string; group?: number; color?: string }[];
        links: { source: string | number; target: string | number; label?: string }[];
    };
    edges?: string;
    nodes?: string;
    height?: number;
    showControls?: boolean;
    updateTrigger?: any;
    isAnimating?: boolean;
    transparentBg?: boolean;
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
    if (typeof node === 'object' && 'props' in node) {
        const props = (node as any).props;
        if (props.code && typeof props.code === 'string') return props.code;
        if (props.children) return extractText(props.children);
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
    transparentBg = false
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fgRef = useRef<any>(null);
    const numericHeight = Number(height);
    const [dimensions, setDimensions] = useState({ width: 0, height: numericHeight });
    const { theme } = useSubject();
    const [graphData, setGraphData] = useState<NonNullable<GraphVisualizerProps['initialData']>>(defaultData);
    const [isHovered, setIsHovered] = useState(false);

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

    // Force repaint when updateTrigger changes without reheating hot physics (Solves 100% CPU lockup)
    const zoomToggle = useRef(false);
    useEffect(() => {
        if (fgRef.current && hasMounted && initialZoomDone.current) {
            // We use a microscopic zoom delta to force a redraw of the canvas instantly
            // without triggering the N-body physics simulation
            const z = fgRef.current.zoom();
            zoomToggle.current = !zoomToggle.current;
            fgRef.current.zoom(zoomToggle.current ? z - 0.000001 : z + 0.000001);
        }
    }, [updateTrigger, hasMounted]);

    // Parse Data
    useEffect(() => {
        let dataFound = false;

        if (initialData) {
            setGraphData(initialData);
            dataFound = true;
        } else if (children) {
            const text = extractText(children).trim();
            if (text.startsWith('{') && text.endsWith('}')) {
                try {
                    const json = JSON.parse(text);
                    if (json.nodes && json.links) {
                        setGraphData(json);
                        dataFound = true;
                    }
                } catch (e) {
                    console.warn("Failed to parse graph JSON:", e);
                }
            }
        }

        if (!dataFound && edges) {
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

            setGraphData({
                nodes: Array.from(nodeList).map(id => ({ id, label: id, group: 1 })),
                links: linkList
            });
        }
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

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, [numericHeight]);

    // Custom Node Rendering (We only draw outlines and text, let the library handle the node-body for perfect hit-detection)
    const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const label = node.label || node.id;
        const fontSize = 12 / globalScale;
        const r = 5;

        // Draw Border
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1.5 / globalScale;
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        // Draw Label
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        // Position label slightly below the node
        ctx.fillText(label, node.x, node.y + r + fontSize);
    }, [theme]);



    const initialZoomDone = useRef(false);
    const [hasCanvasProtection, setHasCanvasProtection] = useState(false);

    // Detect if browser (Brave, Opera GX) is known to natively break canvas tracking components
    // via fingerprinting defense mechanisms. (Brave spoofs 1x1 canvas reads but breaks larger ones)
    useEffect(() => {
        const checkBrowser = async () => {
            // Detect Brave
            if ((window.navigator as any).brave && await (window.navigator as any).brave.isBrave()) {
                setHasCanvasProtection(true);
                return;
            }

            // Detect Opera GX or normal Opera which often have privacy shields on
            const ua = window.navigator.userAgent || '';
            if (ua.includes('OPR/') || ua.includes('Opera GX')) {
                setHasCanvasProtection(true);
            }
        };

        checkBrowser();
    }, []);

    // Stable references for ForceGraph props to prevent hidden-canvas thrashing
    const getNodeColor = useCallback((node: any) => node.color || theme.primary || '#8b5cf6', [theme.primary]);
    const getNodeCanvasObjectMode = useCallback(() => 'after', []);
    const getLinkColor = useCallback(() => '#475569', []);

    const handleEngineStop = useCallback(() => {
        if (!initialZoomDone.current && fgRef.current) {
            // First time the layout settles, fit to view
            fgRef.current.zoomToFit(400, 20);
            initialZoomDone.current = true;
        }
    }, []);

    const handleReset = () => {
        if (fgRef.current) {
            fgRef.current.zoomToFit(400, 20);
            fgRef.current.d3ReheatSimulation();
        }
    };

    // Fix for Brave Browser Fingerprinting bug
    const handleNodeHover = useCallback((node: any) => {
        if (node) {
            // Apply cursor
            if (containerRef.current) containerRef.current.style.cursor = 'grab';
        } else {
            if (containerRef.current) containerRef.current.style.cursor = 'default';
        }
    }, []);

    return (
        <div
            className={`relative group rounded-xl overflow-hidden ${transparentBg ? 'h-full w-full' : 'my-4 border border-slate-700/50 bg-slate-900/80 md:bg-slate-900/40 shadow-xl md:backdrop-blur-sm transition-all hover:border-slate-600/50 ring-1 ring-white/5'}`}
            style={transparentBg ? {} : { height: numericHeight }}
            ref={containerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Controls */}
            {showControls && (
                <div className={`absolute bottom-2 right-2 z-10 flex gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
                    <button
                        onClick={handleReset}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors pointer-events-auto"
                        title="Reset View"
                    >
                        <RotateCcw size={14} />
                    </button>
                    {/* Notice for Brave/Opera GX Users with Canvas Poisoning Active */}
                    {hasCanvasProtection && (
                        <div className="hidden group-hover:flex items-center text-[10px] text-slate-500 bg-slate-800/80 px-2 rounded-lg border border-slate-700 h-[28px]">
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
                    <div className="flex flex-col items-center gap-2">
                        <RotateCcw size={24} className="animate-spin-slow opacity-20" />
                        <span className="text-xs font-mono uppercase tracking-widest opacity-40">Renderitzant Graf...</span>
                    </div>
                </div>
            )}

            {(hasMounted && dimensions.width > 0) && (
                <ForceGraph2D
                    ref={fgRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={graphData}
                    nodeRelSize={5} // Exact visual radius
                    nodeColor={getNodeColor} // Native property to color circles
                    nodeCanvasObjectMode={getNodeCanvasObjectMode} // Let the library draw the colored hit-detectable circles, we only add text and stroke
                    nodeCanvasObject={drawNode} // We draw ONLY outline and text over the built-in hit-detected nodes
                    onNodeHover={handleNodeHover}
                    nodeLabel="label" // Tooltip as fallback
                    linkColor={getLinkColor}
                    backgroundColor="rgba(0,0,0,0)"
                    linkWidth={1.5}
                    d3VelocityDecay={0.2} // Slightly lower decay for smoother movement
                    cooldownTicks={100}
                    onEngineStop={handleEngineStop}
                />
            )}
        </div>
    );
};

export default GraphVisualizer;

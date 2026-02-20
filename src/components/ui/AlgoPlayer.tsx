import { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, Code2, Database, LayoutTemplate } from 'lucide-react';
import GraphVisualizer from './GraphVisualizer';
import { algorithms } from '../../lib/algorithms';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

interface AlgoPlayerProps {
    algorithm: string;
}

export default function AlgoPlayer({ algorithm }: AlgoPlayerProps) {
    const algo = algorithms[algorithm];
    if (!algo) return <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">Algorisme no trobat: {algorithm}</div>;

    const [steps] = useState(algo.generateSteps());
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState<'viz' | 'code'>('viz');
    const speed = 1000;

    // Stable graph initial data to prevent nodes from exploding/remounting
    const [graphData] = useState(() => ({
        nodes: algo.initialGraph.nodes.map(n => ({ ...n })),
        links: algo.initialGraph.links.map(l => ({ ...l }))
    }));

    useEffect(() => {
        let timer: any;
        if (isPlaying) {
            timer = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, speed);
        }
        return () => clearInterval(timer);
    }, [isPlaying, steps.length, speed]);

    const step = steps[currentStep];

    const handlePlayPause = () => setIsPlaying(!isPlaying);
    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));
    const handleReset = () => { setIsPlaying(false); setCurrentStep(0); };
    const handleFullEnd = () => { setIsPlaying(false); setCurrentStep(steps.length - 1); };

    // Update node colors dynamically without changing graph array reference
    graphData.nodes.forEach((n: any) => {
        n.color = step.highlights[n.id] || '#334155'; // Use a sleeker unvisited slate color
    });

    // Highlighter setup
    const highlightedCode = useMemo(() => {
        return Prism.highlight(algo.code, Prism.languages.cpp, 'cpp');
    }, [algo.code]);

    const codeLines = algo.code.split('\n');
    const LINE_HEIGHT = 22;

    // Ensure the active line is scrolled into view (smooth implementation)
    const codeContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (codeContainerRef.current) {
            const activeOffset = (step.line - 1) * LINE_HEIGHT;
            const containerHeight = codeContainerRef.current.clientHeight;
            const currentScroll = codeContainerRef.current.scrollTop;

            if (activeOffset < currentScroll + 30 || activeOffset > currentScroll + containerHeight - 50) {
                codeContainerRef.current.scrollTo({
                    top: Math.max(0, activeOffset - containerHeight / 2),
                    behavior: 'smooth'
                });
            }
        }
    }, [step.line, activeTab]);

    return (
        <div className="not-prose my-12 flex flex-col w-full rounded-2xl border border-white/10 bg-[#0B0F17] overflow-hidden shadow-2xl relative z-10 font-sans group/player lg:h-[550px] max-h-[85vh] xl:max-h-[600px]">

            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden border-b border-white/5 bg-[#0a0d14]">
                <button
                    onClick={() => setActiveTab('viz')}
                    className={`flex-1 py-3 text-[11px] flex justify-center items-center gap-2 font-bold font-mono tracking-widest transition-colors ${activeTab === 'viz' ? 'text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-400' : 'text-slate-500 hover:text-slate-400'}`}
                >
                    <LayoutTemplate size={14} /> VIZ
                </button>
                <button
                    onClick={() => setActiveTab('code')}
                    className={`flex-1 py-3 text-[11px] flex justify-center items-center gap-2 font-bold font-mono tracking-widest transition-colors ${activeTab === 'code' ? 'text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-400' : 'text-slate-500 hover:text-slate-400'}`}
                >
                    <Code2 size={14} /> CODI & ESTAT
                </button>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Left Panel: Graph & Floating Controls */}
                <div className={`flex-1 flex flex-col relative bg-gradient-to-br from-[#0B0F17] via-[#0F1420] to-[#0A0D14] h-full ${activeTab === 'viz' ? 'flex' : 'hidden'} lg:flex`}>

                    {/* Mac-style Window Controls & Title */}
                    <div className="absolute top-4 right-4 flex justify-end items-center z-20 pointer-events-none">
                        <div className={`flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/20 shadow-lg transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-[9px] text-emerald-400 font-mono tracking-wider uppercase font-bold">Running</span>
                        </div>
                    </div>

                    {/* Visualizer Canvas (Fills parent dynamically) */}
                    <div className="absolute inset-x-0 top-0 bottom-[140px] sm:bottom-[150px] z-10 mix-blend-screen opacity-90">
                        <GraphVisualizer
                            initialData={graphData}
                            showControls={false}
                            updateTrigger={currentStep}
                            isAnimating={isPlaying}
                            transparentBg={true}
                        />
                    </div>

                    {/* Floating Bottom UI (Glassmorphism) */}
                    <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col gap-2 pointer-events-none">
                        {/* Description Card */}
                        <div className="bg-slate-900/75 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-xl pointer-events-auto transition-all duration-300 hover:bg-slate-900/85">
                            <p className="text-[12px] sm:text-[13px] text-emerald-300 font-medium leading-[18px] sm:leading-relaxed font-sans shadow-black drop-shadow-md">
                                {step.description}
                            </p>
                        </div>

                        {/* Player Controls Card */}
                        <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 shadow-2xl pointer-events-auto">
                            {/* Custom Slider Row (Native) */}
                            <div className="flex items-center gap-3 w-full px-1">
                                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono font-medium w-6 text-right">{currentStep}</span>
                                <input
                                    type="range"
                                    min={0}
                                    max={steps.length - 1}
                                    value={currentStep}
                                    onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                                    onInput={(e) => setCurrentStep(parseInt((e.target as HTMLInputElement).value))}
                                    className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                />
                                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono font-medium w-6">{steps.length - 1}</span>
                            </div>

                            {/* Controls Row */}
                            <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
                                <button onClick={handleReset} className="p-2 text-slate-400 hover:text-white rounded-xl transition-all active:scale-95">
                                    <SkipBack size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                <button onClick={handlePrev} className="p-2 text-slate-400 hover:text-white rounded-xl transition-all active:scale-95">
                                    <ChevronLeft size={16} className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                                </button>
                                <button
                                    onClick={handlePlayPause}
                                    className="p-3 bg-gradient-to-b from-emerald-400 to-emerald-600 text-slate-950 border border-emerald-400/50 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                >
                                    {isPlaying ? <Pause size={18} className="fill-current w-[18px] h-[18px]" /> : <Play size={18} className="ml-0.5 fill-current w-[18px] h-[18px]" />}
                                </button>
                                <button onClick={handleNext} className="p-2 text-slate-400 hover:text-white rounded-xl transition-all active:scale-95">
                                    <ChevronRight size={16} className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                                </button>
                                <button onClick={handleFullEnd} className="p-2 text-slate-400 hover:text-white rounded-xl transition-all active:scale-95">
                                    <SkipForward size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Code & Environment */}
                <div className={`lg:w-[460px] xl:w-[500px] flex-col bg-[#0d1117] relative z-20 shadow-[-15px_0_30px_rgba(0,0,0,0.3)] lg:border-l border-white/5 h-full ${activeTab === 'code' ? 'flex' : 'hidden'} lg:flex`}>

                    {/* Code Tab Header */}
                    <div className="h-10 border-b border-slate-800/80 flex items-end px-3 flex-shrink-0">
                        <div className="px-4 py-2 border-t border-x border-slate-800/80 rounded-t-xl text-slate-200 text-[10px] font-mono tracking-wider flex gap-2 items-center bg-[#161b22] shadow-sm relative top-[1px] z-10">
                            <Code2 size={12} className="text-emerald-500" />
                            <span>source.cpp</span>
                        </div>
                        <div className="flex-1 border-b border-slate-800/80 h-full relative -z-0"></div>
                    </div>

                    {/* IDE Viewport */}
                    <div className="flex-1 relative overflow-auto custom-scrollbar bg-[#0d1117] text-[12px] sm:text-[13px] pt-4 pb-6 min-h-[50%]" ref={codeContainerRef}>
                        <div className="relative min-w-max">
                            {/* Smooth Active Line Indicator */}
                            <div
                                className="absolute left-0 right-0 bg-gradient-to-r from-emerald-500/10 to-transparent border-l-[3px] border-emerald-500 pointer-events-none transition-all duration-300 ease-out"
                                style={{
                                    top: `${(step.line - 1) * LINE_HEIGHT}px`,
                                    height: `${LINE_HEIGHT}px`
                                }}
                            />

                            {/* Rendering Code & Line numbers */}
                            <div className="flex">
                                {/* Line Numbers */}
                                <div className="w-10 sm:w-12 flex-shrink-0 text-right pr-3 sm:pr-4 select-none border-r border-slate-800/50">
                                    {codeLines.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center justify-end font-mono text-[10px] transition-colors duration-200 ${step.line === i + 1 ? 'text-emerald-400 font-bold' : 'text-slate-600/70'}`}
                                            style={{ height: `${LINE_HEIGHT}px` }}
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>

                                {/* Syntax Highlighted Plain Code */}
                                <pre className="pl-3 sm:pl-4 m-0 !bg-transparent text-slate-300 font-mono tracking-tight flex-1">
                                    <code
                                        className="language-cpp block"
                                        dangerouslySetInnerHTML={{ __html: highlightedCode }}
                                        style={{ lineHeight: `${LINE_HEIGHT}px`, whiteSpace: 'pre' }}
                                    />
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Environment Variables Panel */}
                    <div className="h-[35%] min-h-[140px] max-h-[220px] bg-[#090b10] border-t border-slate-800/80 flex flex-col relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] flex-shrink-0">
                        <div className="px-4 py-1.5 sm:py-2 bg-[#0d1117] border-b border-slate-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Database size={11} className="text-sky-500" />
                                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-400">Memory State</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto custom-scrollbar p-2 sm:p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-1 content-start">
                            {Object.entries(step.variables).map(([k, v]) => (
                                <div key={k} className="flex text-[11px] sm:text-xs group hover:bg-slate-800/50 px-2 flex-wrap sm:flex-nowrap sm:px-3 py-1.5 rounded-lg border border-transparent hover:border-white/5 transition-all">
                                    <span className="text-sky-400 font-mono font-medium w-full lg:w-28 flex-shrink-0 tracking-wide block lg:inline">{k}</span>
                                    <span className="text-slate-600 mr-2 sm:mr-3 font-mono hidden lg:inline">=</span>
                                    <span className="text-emerald-300 font-mono break-all">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

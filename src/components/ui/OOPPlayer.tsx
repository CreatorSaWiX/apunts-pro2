import { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, Code2, Database, TerminalSquare } from 'lucide-react';
import { oopSimulations } from '../../lib/oopSimulations';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

interface OOPPlayerProps {
    simulation: string;
}

export default function OOPPlayer({ simulation }: OOPPlayerProps) {
    const sim = oopSimulations[simulation];
    if (!sim) return <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">Simulació no trobada: {simulation}</div>;

    const [steps] = useState(sim.generateSteps());
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState<'term' | 'code'>('code');
    const speed = 1500; // Slower for OOP to read descriptions

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

    // Highlight code blocks
    const highlightedFiles = useMemo(() => {
        const h: Record<string, string> = {};
        for (const [filename, code] of Object.entries(sim.files)) {
            h[filename] = Prism.highlight(code, Prism.languages.cpp, 'cpp');
        }
        return h;
    }, [sim.files]);

    const LINE_HEIGHT = 22;
    const codeContainerRef = useRef<HTMLDivElement>(null);

    // Ensure the active line is scrolled into view (smooth implementation)
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
    }, [step.line, step.activeFile, activeTab]);

    return (
        <div className="not-prose my-12 flex flex-col w-full rounded-2xl border border-white/10 bg-[#0B0F17] overflow-hidden shadow-2xl relative z-10 font-sans group/player h-[500px] lg:h-[550px] max-h-[85vh] xl:max-h-[600px]">
            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden border-b border-white/5 bg-[#0a0d14]">
                <button
                    onClick={() => setActiveTab('code')}
                    className={`flex-1 py-3 text-[11px] flex justify-center items-center gap-2 font-bold font-mono tracking-widest transition-colors ${activeTab === 'code' ? 'text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-400' : 'text-slate-500 hover:text-slate-400'}`}
                >
                    <Code2 size={14} /> CODI
                </button>
                <button
                    onClick={() => setActiveTab('term')}
                    className={`flex-1 py-3 text-[11px] flex justify-center items-center gap-2 font-bold font-mono tracking-widest transition-colors ${activeTab === 'term' ? 'text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-400' : 'text-slate-500 hover:text-slate-400'}`}
                >
                    <TerminalSquare size={14} /> TERMINAL
                </button>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Left Panel: Code & Environment */}
                <div className={`flex-1 min-w-0 flex flex-col relative bg-[#0d1117] h-full shadow-[15px_0_30px_rgba(0,0,0,0.3)] lg:border-r border-white/5 ${activeTab === 'code' ? 'flex' : 'hidden'} lg:flex`}>

                    {/* Simulated Window Controls */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-30 opacity-50 hidden sm:flex">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    </div>

                    {/* Code Tab Header */}
                    <div className="h-10 border-b border-slate-800/80 flex items-end px-3 flex-shrink-0 bg-[#0a0d14] pl-20 overflow-hidden">
                        {Object.keys(sim.files).map(filename => (
                            <div key={filename} className={`px-4 py-2 border-t border-x rounded-t-xl text-[10px] font-mono tracking-wider flex gap-2 items-center shadow-sm relative top-[1px] z-10 transition-colors cursor-default whitespace-nowrap
                                ${step.activeFile === filename ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400' : 'bg-[#161b22] border-transparent text-slate-500 border-b-slate-800/80'}`}>
                                <Code2 size={12} className={step.activeFile === filename ? "text-emerald-500" : "text-slate-600"} />
                                <span>{filename}</span>
                            </div>
                        ))}
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
                                <div className="w-10 flex-shrink-0 text-right pr-3 select-none border-r border-slate-800/50">
                                    {String(sim.files[step.activeFile] || '').split('\n').map((_: string, i: number) => (
                                        <div
                                            key={i}
                                            className={`flex items-center justify-end font-mono text-[10px] transition-colors duration-200 ${step.line === i + 1 ? 'text-emerald-400 font-bold' : 'text-slate-600/70'}`}
                                            style={{ height: `${LINE_HEIGHT}px` }}
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                                <pre className="pl-3 sm:pl-4 m-0 !bg-transparent text-slate-300 font-mono tracking-tight flex-1">
                                    <code
                                        className="language-cpp block"
                                        dangerouslySetInnerHTML={{ __html: String(highlightedFiles[step.activeFile] || '') }}
                                        style={{ lineHeight: `${LINE_HEIGHT}px`, whiteSpace: 'pre' }}
                                    />
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Environment Variables Panel */}
                    <div className="h-[35%] min-h-[140px] max-h-[200px] bg-[#090b10] border-t border-slate-800/80 flex flex-col relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] flex-shrink-0">
                        <div className="px-4 py-1.5 sm:py-2 bg-[#0d1117] border-b border-slate-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Database size={11} className="text-sky-500" />
                                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-400">Objectes a Memòria</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto custom-scrollbar p-2 flex flex-col gap-0.5 content-start">
                            {Object.entries(step.variables).map(([k, v]) => (
                                <div key={k} className="flex text-[11px] sm:text-xs group hover:bg-[#2a2d2e] px-2 py-1 rounded transition-none">
                                    <span className="text-[#9cdcfe] font-mono mr-2 shrink-0">{k}:</span>
                                    <span className="text-[#b5cea8] font-mono break-all">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Terminal & Controls */}
                <div className={`lg:w-[450px] xl:w-[480px] shrink-0 flex-col relative z-20 bg-gradient-to-br from-[#0B0F17] via-[#0F1420] to-[#0A0D14] h-full ${activeTab === 'term' ? 'flex' : 'hidden'} lg:flex`}>

                    <div className="flex-1 flex flex-col p-4 sm:p-6 pb-[160px] relative overflow-hidden">

                        {/* Terminal Window */}
                        <div className="flex-1 bg-black/40 border border-white/5 rounded-xl shadow-inner overflow-hidden flex flex-col backdrop-blur-sm relative">
                            <div className="bg-white/5 border-b border-white/5 px-3 py-2 flex items-center gap-2">
                                <TerminalSquare size={12} className="text-slate-400" />
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Terminal de Sortida</span>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-xs sm:text-[13px] text-slate-300 flex flex-col gap-1.5 leading-relaxed">
                                {step.terminalOutput.map((line: string, i: number) => (
                                    <div key={i} className={`${line.startsWith('>') ? 'text-sky-400 font-bold opacity-70' : 'text-slate-200'} transition-all`}>
                                        {line}
                                    </div>
                                ))}
                                <div className="w-2 h-4 bg-slate-500 animate-pulse mt-1"></div>
                            </div>
                        </div>

                    </div>

                    {/* Floating Bottom UI (controls & description) */}
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
            </div>
        </div>
    );
}

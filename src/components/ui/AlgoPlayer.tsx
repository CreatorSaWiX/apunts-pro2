import React, { useState, useEffect, useRef } from 'react';
import { Code2, Database, LayoutTemplate } from 'lucide-react';
import GraphVisualizer from './GraphVisualizer';
import { algorithms } from '../../lib/algorithms';
import ReactCodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';
import { cpp } from '@codemirror/lang-cpp';
import { PlayerShell } from './PlayerShell';
import { PlayerControls } from './PlayerControls';

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
    const handleNext = () => React.startTransition(() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1)));
    const handlePrev = () => React.startTransition(() => setCurrentStep(prev => Math.max(prev - 1, 0)));
    const handleReset = () => { setIsPlaying(false); React.startTransition(() => { setCurrentStep(0); }); };
    const handleFullEnd = () => { setIsPlaying(false); React.startTransition(() => { setCurrentStep(steps.length - 1); }); };

    // Update node colors dynamically without changing graph array reference
    graphData.nodes.forEach((n: any) => {
        n.color = step.highlights[n.id] || '#334155'; // Use a sleeker unvisited slate color
    });

    const customTheme = EditorView.theme({
        "&": { backgroundColor: "transparent !important", height: "100%" },
        ".cm-scroller": { fontFamily: "inherit" },
        ".cm-gutters": {
            backgroundColor: "transparent !important",
            borderRight: "1px solid rgba(30, 41, 59, 0.5) !important",
        },
        ".cm-activeLine": {
            background: "linear-gradient(90deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 100%) !important",
            borderLeft: "3px solid #10b981 !important",
        },
        ".cm-activeLineGutter": {
            backgroundColor: "transparent !important",
            color: "#34d399 !important",
            fontWeight: "bold"
        }
    });

    const editorRef = useRef<any>(null);

    useEffect(() => {
        if (editorRef.current?.view) {
            const view = editorRef.current.view;
            const docLines = view.state.doc.lines;
            const targetLine = Math.min(Math.max(1, step.line), docLines);
            const line = view.state.doc.line(targetLine);
            view.dispatch({
                selection: { anchor: line.from },
                effects: EditorView.scrollIntoView(line.from, { y: "center" })
            });
        }
    }, [step.line, activeTab]);

    return (
        <PlayerShell
            tabs={[
                { id: 'viz', label: 'VIZ', icon: <LayoutTemplate size={14} /> },
                { id: 'code', label: 'CODI & ESTAT', icon: <Code2 size={14} /> }
            ]}
            activeTab={activeTab}
            onTabChange={(id: any) => setActiveTab(id)}
            leftPanel={
                <div className={`flex-1 flex flex-col relative bg-gradient-to-br from-[#0B0F17] via-[#0F1420] to-[#0A0D14] h-full ${activeTab === 'viz' ? 'flex' : 'hidden'} lg:flex`}>
                    {/* Mac-style Window Controls & Title */}
                    <div className="absolute top-4 right-4 flex justify-end items-center z-20 pointer-events-none">
                        <div className={`flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/20 shadow-lg transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-[9px] text-emerald-400 font-mono tracking-wider uppercase font-bold">Running</span>
                        </div>
                    </div>

                    {/* Visualizer Canvas */}
                    <div className="absolute inset-x-0 top-0 bottom-[140px] sm:bottom-[150px] z-10 mix-blend-screen opacity-90">
                        <GraphVisualizer
                            initialData={graphData}
                            showControls={false}
                            updateTrigger={currentStep}
                            isAnimating={isPlaying}
                            transparentBg={true}
                        />
                    </div>

                    <PlayerControls
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        description={step.description}
                        isPlaying={isPlaying}
                        onStepChange={setCurrentStep}
                        onPlayPause={handlePlayPause}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        onReset={handleReset}
                        onFullEnd={handleFullEnd}
                    />
                </div>
            }
            rightPanel={
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
                    <div className="flex-1 overflow-hidden relative bg-[#0d1117] text-[12px] sm:text-[13px] pt-4 pb-6 min-h-[50%] flex flex-col">
                        <ReactCodeMirror
                            ref={editorRef}
                            value={algo.code}
                            readOnly={true}
                            editable={false}
                            height="100%"
                            theme={[vscodeDark, customTheme]}
                            extensions={[cpp()]}
                            className="flex-1 font-mono tracking-tight overflow-hidden"
                            basicSetup={{
                                lineNumbers: true,
                                foldGutter: false,
                                highlightActiveLine: true,
                                highlightSelectionMatches: false,
                                syntaxHighlighting: true,
                                drawSelection: false,
                                dropCursor: false,
                                allowMultipleSelections: false,
                                indentOnInput: false,
                                bracketMatching: true,
                                closeBrackets: false,
                                autocompletion: false,
                                rectangularSelection: false,
                                crosshairCursor: false,
                                closeBracketsKeymap: false,
                                searchKeymap: false,
                                foldKeymap: false,
                                completionKeymap: false,
                                lintKeymap: false,
                            }}
                        />
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
            }
        />
    );
}

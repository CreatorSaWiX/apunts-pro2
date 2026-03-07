import React, { useState, useEffect, useRef } from 'react';
import { Code2, Database, TerminalSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { oopSimulations } from '../../lib/oopSimulations';
import ReactCodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';
import { cpp } from '@codemirror/lang-cpp';
import { PlayerShell } from './PlayerShell';
import { PlayerControls } from './PlayerControls';

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
    const [userSelectedFile, setUserSelectedFile] = useState<string | null>(null);
    const [isMemoryExpanded, setIsMemoryExpanded] = useState(true);
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
    const displayFile = userSelectedFile || step.activeFile;

    useEffect(() => {
        setUserSelectedFile(null);
    }, [currentStep]);

    const handlePlayPause = () => {
        if (!isPlaying) setActiveTab('code');
        setIsPlaying(!isPlaying);
    };
    const handleNext = () => React.startTransition(() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1)));
    const handlePrev = () => React.startTransition(() => setCurrentStep(prev => Math.max(prev - 1, 0)));
    const handleReset = () => { setIsPlaying(false); React.startTransition(() => { setCurrentStep(0); setActiveTab('code'); }); };
    const handleFullEnd = () => { setIsPlaying(false); React.startTransition(() => { setCurrentStep(steps.length - 1); }); };

    const customTheme = EditorView.theme({
        "&": { backgroundColor: "transparent !important", height: "100%" },
        ".cm-scroller": {
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
            scrollbarWidth: "none",
            overscrollBehavior: "contain",
        },
        ".cm-scroller::-webkit-scrollbar": {
            display: "none",
        },
        ".cm-gutters": {
            backgroundColor: "transparent !important",
            borderRight: "1px solid rgba(255,255,255,0.06) !important",
            paddingRight: "8px",
            marginRight: "12px",
            paddingLeft: "16px",
        },
        ".cm-lineNumbers .cm-gutterElement": {
            color: "rgba(148, 163, 184, 0.3)",
            fontSize: "12px",
        },
        // Disable CM's built-in active line highlight — we use our custom overlay
        ".cm-activeLine": {
            backgroundColor: "transparent !important",
            background: "none !important",
        },
        ".cm-activeLineGutter": {
            backgroundColor: "transparent !important",
        },
        ".cm-content": {
            padding: "4px 0",
        },
        ".cm-line": {
            padding: "0 12px 0 0",
        },
    });

    const editorRef = useRef<any>(null);
    const highlightRef = useRef<HTMLDivElement>(null);
    const [highlightStyle, setHighlightStyle] = useState<{ top: number; height: number; opacity: number }>({ top: 0, height: 20, opacity: 0 });

    // Update highlight overlay position when step changes
    useEffect(() => {
        if (editorRef.current?.view && displayFile === step.activeFile) {
            const view = editorRef.current.view;
            const docLines = view.state.doc.lines;
            const targetLine = Math.min(Math.max(1, step.line), docLines);
            const line = view.state.doc.line(targetLine);

            // Save page scroll
            const savedScrollY = window.scrollY;

            // Set selection for cursor position
            view.dispatch({ selection: { anchor: line.from } });

            // Calculate line position for our custom overlay
            const lineBlock = view.lineBlockAt(line.from);
            const scroller = view.scrollDOM;
            if (scroller) {
                // Position relative to the scroller
                setHighlightStyle({
                    top: lineBlock.top - scroller.scrollTop,
                    height: lineBlock.height,
                    opacity: 1,
                });
            }

            // Restore page scroll
            window.scrollTo({ top: savedScrollY, behavior: 'instant' as ScrollBehavior });
            requestAnimationFrame(() => {
                window.scrollTo({ top: savedScrollY, behavior: 'instant' as ScrollBehavior });
            });
        } else {
            setHighlightStyle(prev => ({ ...prev, opacity: 0 }));
        }
    }, [step.line, step.activeFile, activeTab, displayFile]);

    return (
        <PlayerShell
            tabs={[
                { id: 'code', label: 'CODI', icon: <Code2 size={14} /> },
                { id: 'term', label: 'TERMINAL', icon: <TerminalSquare size={14} /> }
            ]}
            activeTab={activeTab}
            onTabChange={(id: any) => setActiveTab(id)}
            leftPanel={
                <div className={`flex-1 min-w-0 flex flex-col relative bg-[#0d1117] h-full shadow-[15px_0_30px_rgba(0,0,0,0.3)] lg:border-r border-white/5 ${activeTab === 'code' ? 'flex' : 'hidden'} lg:flex`}>
                    {/* Code Tab Header */}
                    <div className="h-10 border-b border-slate-800/80 flex items-end px-3 flex-shrink-0 bg-[#0a0d14] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {Object.keys(sim.files).map(filename => (
                            <div key={filename}
                                onClick={() => setUserSelectedFile(filename)}
                                className={`px-4 py-2 border-t border-x rounded-t-xl text-[10px] font-mono tracking-wider flex gap-2 items-center shadow-sm relative top-[1px] z-10 transition-colors cursor-pointer whitespace-nowrap
                                ${displayFile === filename ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400' : 'bg-[#161b22] border-transparent text-slate-500 border-b-slate-800/80 hover:bg-[#1f262e]'}`}>
                                <Code2 size={12} className={displayFile === filename ? "text-emerald-500" : "text-slate-600"} />
                                <span>{filename}</span>
                            </div>
                        ))}
                        <div className="flex-1 border-b border-slate-800/80 h-full relative -z-0 min-w-[20px]"></div>
                    </div>

                    {/* IDE Viewport */}
                    <div className="flex-1 overflow-auto relative bg-[#0d1117] text-[12px] sm:text-[13px] pt-4 pb-6 min-h-[50%] flex flex-col" style={{ overscrollBehavior: 'contain' }}>
                        {/* Animated highlight overlay */}
                        <div
                            ref={highlightRef}
                            className="absolute left-0 right-0 z-10 pointer-events-none"
                            style={{
                                top: `${highlightStyle.top + 20}px`,
                                height: `${highlightStyle.height}px`,
                                opacity: highlightStyle.opacity,
                                transition: 'top 0.35s cubic-bezier(0.0, 0.0, 0.2, 1), opacity 0.2s ease',
                                background: 'linear-gradient(90deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0) 70%)',
                                borderLeft: '3px solid #10b981',
                            }}
                        />
                        <ReactCodeMirror
                            ref={editorRef}
                            value={String(sim.files[displayFile] || '')}
                            readOnly={true}
                            editable={false}
                            height="100%"
                            theme={[vscodeDark, customTheme]}
                            extensions={[cpp()]}
                            className="flex-1 font-mono tracking-tight overflow-hidden"
                            basicSetup={{
                                lineNumbers: true,
                                foldGutter: false,
                                highlightActiveLine: displayFile === step.activeFile,
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
                    <div className={`${isMemoryExpanded ? 'h-[35%] min-h-[140px] max-h-[200px]' : 'h-auto'} bg-[#090b10] border-t border-slate-800/80 flex flex-col relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] flex-shrink-0 transition-all duration-300`}>
                        <div
                            className="px-4 py-1.5 sm:py-2 bg-[#0d1117] border-b border-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-[#161b22] transition-colors"
                            onClick={() => setIsMemoryExpanded(!isMemoryExpanded)}
                        >
                            <div className="flex items-center gap-2">
                                <Database size={11} className="text-sky-500" />
                                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-400 select-none">Objectes a Memòria</span>
                            </div>
                            <button className="text-slate-500 hover:text-slate-300">
                                {isMemoryExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                            </button>
                        </div>
                        {isMemoryExpanded && (
                            <div className="flex-1 overflow-auto custom-scrollbar p-2 flex flex-col gap-0.5 content-start">
                                {Object.entries(step.variables).map(([k, v]) => (
                                    <div key={k} className="flex text-[11px] sm:text-xs group hover:bg-[#2a2d2e] px-2 py-1 rounded transition-colors duration-200">
                                        <span className="text-[#9cdcfe] font-mono mr-2 shrink-0">{k}:</span>
                                        <span className="text-[#b5cea8] font-mono break-all">{v}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            }
            rightPanel={
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
        />
    );
}

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Code2, Database, TerminalSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { pro } from '../../lib/simulations/content/pro';
import type { Simulation, SimulationStep } from '../../lib/simulations/engine/types';
import ReactCodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';
import { cpp } from '@codemirror/lang-cpp';
import { PlayerShell } from './PlayerShell';
import { PlayerControls } from './PlayerControls';

interface OOPPlayerProps {
    simulation: string;
}

export default function OOPPlayer({ simulation }: OOPPlayerProps) {
    const sim = pro[simulation];
    if (!sim) return <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">Simulació no trobada: {simulation}</div>;
    return <OOPPlayerContent sim={sim} />;
}

function OOPPlayerContent({ sim }: { sim: Simulation }) {
    const { t } = useTranslation();
    const [steps] = useState<SimulationStep[]>(() => sim.generateSteps());
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState<'term' | 'code'>('code');
    const [selectedFileObj, setSelectedFileObj] = useState<{ step: number; file: string } | null>(null);
    const [isMemoryExpanded, setIsMemoryExpanded] = useState(true);
    const speed = 1500; // Slower for OOP to read descriptions

    const userSelectedFile = selectedFileObj?.step === currentStep ? selectedFileObj.file : null;
    const setUserSelectedFile = (file: string | null) => setSelectedFileObj(file ? { step: currentStep, file } : null);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (isPlaying && currentStep < steps.length - 1) {
            timer = setInterval(() => {
                setCurrentStep(prev => {
                    const next = prev + 1;
                    if (next >= steps.length - 1) {
                        setIsPlaying(false);
                        return steps.length - 1;
                    }
                    return next;
                });
            }, speed);
        }
        return () => clearInterval(timer);
    }, [isPlaying, currentStep, steps.length, speed]);

    const step: Partial<SimulationStep> = steps[currentStep] || {};
    const displayFile = userSelectedFile || step.visual?.activeFile || Object.keys(sim.files || {})[0];

    const handlePlayPause = () => {
        if (!isPlaying) {
            setActiveTab('code');
            if (currentStep >= steps.length - 1) {
                setCurrentStep(0);
            }
        }
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

    const editorRef = useRef<ReactCodeMirrorRef | null>(null);
    const highlightRef = useRef<HTMLDivElement>(null);
    const [highlightStyle, setHighlightStyle] = useState<{ top: number; height: number; opacity: number }>({ top: 0, height: 20, opacity: 0 });

    useEffect(() => {
        if (editorRef.current?.view && displayFile === step.visual?.activeFile) {
            const view = editorRef.current.view;
            const docLines = view.state.doc.lines;
            const lineNum = step.line || 1;
            const targetLine = Math.min(Math.max(1, lineNum), docLines);
            const line = view.state.doc.line(targetLine);

            // En lloc d'usar EditorView.scrollIntoView() que pot forçar el scroll de tota la finestra del navegador
            // i provocar conflictes de scroll tàctil en Android, actualitzem només la selecció interna:
            view.dispatch({
                selection: { anchor: line.from }
            });

            const lineBlock = view.lineBlockAt(line.from);
            const scroller = view.scrollDOM;

            setHighlightStyle({
                top: lineBlock.top,
                height: lineBlock.height,
                opacity: 1,
            });

            if (scroller) {
                // Calculem el scroll centrat exclusivament dins del contenidor de CodeMirror (0% impacte al DOM extern)
                const targetScrollTop = Math.max(0, lineBlock.top - (scroller.clientHeight / 2) + (lineBlock.height / 2));
                scroller.scrollTo({ top: targetScrollTop, behavior: 'smooth' });

                const handleScroll = () => {
                    if (highlightRef.current) {
                        highlightRef.current.style.transform = `translateY(-${scroller.scrollTop}px)`;
                    }
                };

                handleScroll();
                scroller.addEventListener('scroll', handleScroll, { passive: true });

                return () => {
                    scroller.removeEventListener('scroll', handleScroll);
                };
            }
        } else {
            setHighlightStyle(prev => ({ ...prev, opacity: 0 }));
        }
    }, [step.line, step.visual?.activeFile, activeTab, displayFile]);

    return (
        <PlayerShell
            tabs={[
                { id: 'code', label: t('player.code'), icon: <Code2 size={14} /> },
                { id: 'term', label: t('player.terminal'), icon: <TerminalSquare size={14} /> }
            ]}
            activeTab={activeTab}
            onTabChange={(id: string) => setActiveTab(id as 'term' | 'code')}
            leftPanel={
                <div className={`flex-1 min-w-0 flex flex-col relative bg-[#0d1117] h-full shadow-[15px_0_30px_rgba(0,0,0,0.3)] lg:border-r border-white/5 ${activeTab === 'code' ? 'flex' : 'hidden'} lg:flex`}>
                    <div className="h-10 border-b border-slate-800/80 flex items-end px-3 flex-shrink-0 bg-[#0a0d14] overflow-x-auto overflow-y-hidden custom-scrollbar touch-pan-x [-webkit-overflow-scrolling:touch]">
                        {Object.keys(sim.files || {}).map(filename => (
                            <div key={filename}
                                onClick={() => setUserSelectedFile(filename)}
                                className={`px-4 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex gap-2 items-center shadow-sm relative top-[1px] z-10 transition-colors cursor-pointer whitespace-nowrap shrink-0
                                ${displayFile === filename ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold' : 'bg-[#161b22] border-transparent text-slate-300 border-b-slate-800/80 hover:bg-[#1f262e] hover:text-white'}`}>
                                <Code2 size={14} className={displayFile === filename ? "text-emerald-400 shrink-0" : "text-slate-400 shrink-0"} />
                                <span>{filename}</span>
                            </div>
                        ))}
                        <div className="flex-1 border-b border-slate-800/80 h-full relative -z-0 min-w-[20px]"></div>
                    </div>

                    <div className="flex-1 relative overflow-hidden flex flex-col bg-[#0d1117] text-[12px] sm:text-[13px] pt-4 pb-6 min-h-[50%]">
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
                            value={String((displayFile && sim.files?.[displayFile]) || '')}
                            readOnly={true}
                            editable={false}
                            height="100%"
                            theme={[vscodeDark, customTheme]}
                            extensions={[cpp()]}
                            className="flex-1 font-mono tracking-tight overflow-hidden"
                            basicSetup={{
                                lineNumbers: true,
                                foldGutter: false,
                                highlightActiveLine: displayFile === step.visual?.activeFile,
                                highlightSelectionMatches: false,
                                bracketMatching: true,
                                autocompletion: false,
                            }}
                        />
                    </div>

                    <div className="h-32 bg-[#1e1e1e] border-t border-slate-800/80 flex flex-col shrink-0">
                        <div
                            className="bg-[#252526] px-3 py-1.5 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono select-none cursor-pointer hover:bg-[#2a2d2e] transition-colors"
                            onClick={() => setIsMemoryExpanded(!isMemoryExpanded)}
                        >
                            <div className="flex items-center gap-2">
                                <Database size={14} className="text-sky-400 shrink-0" />
                                <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-200">{t('player.memoryObjects')}</span>
                            </div>
                            <button type="button" className="text-slate-300 hover:text-white p-1" aria-label={isMemoryExpanded ? "Replegar memòria" : "Desplegar memòria"}>
                                {isMemoryExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                            </button>
                        </div>
                        {isMemoryExpanded && (
                            <div className="flex-1 overflow-auto custom-scrollbar p-3 flex flex-col gap-1 content-start">
                                {Object.entries(step.variables || {}).map(([k, v]) => (
                                    <div key={k} className="flex text-xs group hover:bg-[#2a2d2e] px-2.5 py-1.5 rounded transition-colors duration-200">
                                        <span className="text-[#9cdcfe] font-mono font-bold mr-2 shrink-0">{k}:</span>
                                        <span className="text-[#b5cea8] font-mono break-all">{String(v)}</span>
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
                        <div className="flex-1 bg-black/40 border border-white/5 rounded-xl shadow-inner overflow-hidden flex flex-col backdrop-blur-sm relative">
                            <div className="bg-white/5 border-b border-white/5 px-3 py-2 flex items-center gap-2">
                                <TerminalSquare size={12} className="text-slate-400" />
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">{t('player.terminalOutput')}</span>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-xs sm:text-[13px] text-slate-300 flex flex-col gap-1.5 leading-relaxed">
                                {(step.visual?.terminalOutput || []).map((line: string, i: number) => (
                                    <div key={i} className={`${line.startsWith('>') ? 'text-sky-400 font-bold opacity-70' : 'text-slate-200'} transition-all`}>
                                        {t(line as any)}
                                    </div>
                                ))}
                                <div className="w-2 h-4 bg-slate-500 animate-pulse mt-1"></div>
                            </div>
                        </div>
                    </div>

                    <PlayerControls
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        description={step.description ? (t(step.description, step.variables) as string) : ''}
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

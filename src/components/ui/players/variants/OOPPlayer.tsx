import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Code2, TerminalSquare } from 'lucide-react';
import { pro } from '../../../../lib/simulations/content/pro';
import type { Simulation, SimulationStep } from '../../../../lib/simulations/engine/types';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { PlayerShell } from '../shared/PlayerShell';
import { PlayerControls } from '../shared/PlayerControls';
import { usePlayerEngine } from '../shared/usePlayerEngine';
import { PlayerEditor } from '../shared/PlayerEditor';
import { PlayerMemory } from '../shared/PlayerMemory';
import { PlayerTerminal } from '../shared/PlayerTerminal';

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
    const [activeTab, setActiveTab] = useState<'term' | 'code'>('code');
    const [selectedFileObj, setSelectedFileObj] = useState<{ step: number; file: string } | null>(null);
    const [isMemoryExpanded, setIsMemoryExpanded] = useState(true);
    const [savedLayout, setSavedLayout] = useState([70, 30]);

    const {
        currentStep,
        setCurrentStep,
        isPlaying,
        handlePlayPause,
        handleNext,
        handlePrev,
        handleReset,
        handleFullEnd
    } = usePlayerEngine(steps.length, 1500);

    const userSelectedFile = selectedFileObj?.step === currentStep ? selectedFileObj.file : null;
    const setUserSelectedFile = (file: string | null) => setSelectedFileObj(file ? { step: currentStep, file } : null);

    const step: Partial<SimulationStep> = steps[currentStep] || {};
    const displayFile = userSelectedFile || (step.visual?.activeFile as string) || Object.keys(sim.files || {})[0];

    return (
        <PlayerShell
            tabs={[
                { id: 'code', label: t('player.code'), icon: <Code2 size={14} /> },
                { id: 'term', label: t('player.terminal'), icon: <TerminalSquare size={14} /> }
            ]}
            activeTab={activeTab}
            onTabChange={(id: string) => setActiveTab(id as 'term' | 'code')}
            controls={
                <PlayerControls
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    description={step.description ? (t(step.description, step.variables) as string) : ''}
                    isPlaying={isPlaying}
                    onStepChange={setCurrentStep}
                    onPlayPause={() => handlePlayPause(() => setActiveTab('code'))}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onReset={() => handleReset(() => setActiveTab('code'))}
                    onFullEnd={handleFullEnd}
                />
            }
            leftPanel={
                <div className={`flex-1 min-w-0 flex-col relative bg-[#0d1117] h-full shadow-[15px_0_30px_rgba(0,0,0,0.3)] lg:border-r border-white/5 ${activeTab === 'code' ? 'flex' : 'hidden'} group-data-[fullscreen=true]/player:flex lg:flex`}>
                    <div className="h-10 border-b border-slate-800/80 flex items-end px-3 shrink-0 bg-[#0a0d14] overflow-x-auto overflow-y-hidden custom-scrollbar touch-pan-x [-webkit-overflow-scrolling:touch]">
                        {Object.keys(sim.files || {}).map(filename => (
                            <div key={filename}
                                onClick={() => setUserSelectedFile(filename)}
                                className={`px-4 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex gap-2 items-center shadow-sm relative top-px z-10 transition-colors cursor-pointer whitespace-nowrap shrink-0
                                    ${displayFile === filename ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold' : 'bg-[#161b22] border-transparent text-slate-300 border-b-slate-800/80 hover:bg-[#1f262e] hover:text-white'}`}>
                                <Code2 size={14} className={displayFile === filename ? "text-emerald-400 shrink-0" : "text-slate-400 shrink-0"} />
                                <span>{filename}</span>
                            </div>
                        ))}
                        <div className="flex-1 border-b border-slate-800/80 h-full relative z-0 min-w-5"></div>
                    </div>

                    {/* Desktop Layout with Memory */}
                    <div className="hidden lg:flex flex-1 overflow-hidden min-h-0">
                        <Group
                            id="oop-layout"
                            orientation="vertical"
                            className="flex-1 overflow-hidden min-h-0"
                            onLayoutChanged={(layout) => {
                                const sizes = Object.values(layout);
                                if (sizes.length === 2) {
                                    setSavedLayout(sizes);
                                }
                            }}
                        >
                            <Panel minSize={5} defaultSize={isMemoryExpanded ? savedLayout[0] : 100} className="flex flex-col relative overflow-hidden bg-[#0d1117] min-h-0">
                                <PlayerEditor 
                                    code={String((displayFile && sim.files?.[displayFile]) || '')} 
                                    executionLine={displayFile === step.visual?.activeFile ? (step.line || 0) : 0} 
                                />
                            </Panel>

                            {isMemoryExpanded && (
                                <Separator className="h-1.5 bg-slate-800/80 hover:bg-emerald-500/50 active:bg-emerald-500 transition-colors cursor-row-resize z-50 flex items-center justify-center shrink-0">
                                    <div className="w-8 h-0.5 bg-slate-600 rounded-full" />
                                </Separator>
                            )}

                            {isMemoryExpanded && (
                                <Panel
                                    defaultSize={savedLayout[1]}
                                    minSize={10}
                                    className="flex flex-col min-h-0"
                                >
                                    <PlayerMemory 
                                        variables={step.variables || {}} 
                                        isExpanded={isMemoryExpanded} 
                                        onToggle={() => setIsMemoryExpanded(false)} 
                                    />
                                </Panel>
                            )}
                        </Group>
                    </div>

                    {/* Mobile Layout (Code only) */}
                    <div className="flex lg:hidden flex-col flex-1 overflow-hidden min-h-0">
                        <PlayerEditor 
                            code={String((displayFile && sim.files?.[displayFile]) || '')} 
                            executionLine={displayFile === step.visual?.activeFile ? (step.line || 0) : 0} 
                        />
                    </div>

                    {!isMemoryExpanded && (
                        <div className="hidden lg:block">
                            <PlayerMemory 
                                variables={step.variables || {}} 
                                isExpanded={isMemoryExpanded} 
                                onToggle={() => setIsMemoryExpanded(true)} 
                            />
                        </div>
                    )}
                </div>
            }
            rightPanel={
                <div className={`flex-1 flex-col relative z-20 bg-linear-to-br from-[#0B0F17] via-[#0F1420] to-[#0A0D14] h-full w-full ${activeTab === 'term' ? 'flex' : 'hidden'} group-data-[fullscreen=true]/player:flex lg:flex`}>
                    <PlayerTerminal 
                        output={(step.visual?.terminalOutput as string[]) || []} 
                        variables={step.variables || {}} 
                    />
                </div>
            }
        />
    );
}

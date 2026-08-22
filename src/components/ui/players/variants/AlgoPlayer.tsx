import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Code2, LayoutTemplate } from 'lucide-react';
import GraphVisualizer from '../../visualizers/GraphVisualizer';
import { graphs as algorithms } from '../../../../lib/simulations/content/graphs';
import type { Simulation, SimulationStep } from '../../../../lib/simulations/engine/types';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { PlayerShell } from '../shared/PlayerShell';
import { PlayerControls } from '../shared/PlayerControls';
import { usePlayerEngine } from '../shared/usePlayerEngine';
import { PlayerEditor } from '../shared/PlayerEditor';
import { PlayerMemory } from '../shared/PlayerMemory';

interface GraphNode {
    id: string | number;
    label?: string;
    color?: string;
    x?: number;
    y?: number;
}
interface GraphLink {
    source: string | number;
    target: string | number;
    color?: string;
}

interface AlgoPlayerProps {
    algorithm: string;
}

export default function AlgoPlayer({ algorithm }: AlgoPlayerProps) {
    const { t } = useTranslation();
    const algo = algorithms[algorithm];
    if (!algo) return <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">{t('player.notFound')}: {algorithm}</div>;
    return <AlgoPlayerContent algo={algo} />;
}

function AlgoPlayerContent({ algo }: { algo: Simulation }) {
    const { t } = useTranslation();
    const [steps] = useState<SimulationStep[]>(() => algo.generateSteps());
    const [activeTab, setActiveTab] = useState<'viz' | 'code'>('viz');
    const [isMemoryExpanded, setIsMemoryExpanded] = useState(true);
    const [savedLayout, setSavedLayout] = useState([65, 35]);

    const {
        currentStep,
        setCurrentStep,
        isPlaying,
        handlePlayPause,
        handleNext,
        handlePrev,
        handleReset,
        handleFullEnd
    } = usePlayerEngine(steps.length, 1000);

    const step = steps[currentStep];

    // Stable graph initial data to prevent nodes from exploding/remounting
    const [graphData] = useState(() => ({
        nodes: ((algo.initialState?.nodes as any[])?.map((n: any) => ({ ...n })) || []) as GraphNode[],
        links: ((algo.initialState?.links as any[])?.map((l: any) => ({ ...l })) || []) as GraphLink[]
    }));

    // Update node colors and labels dynamically
    // We modify the stable nodes in-place to preserve their physics state (x, y)
    graphData.nodes.forEach((n) => {
        n.color = (step?.visual?.highlights as any)?.[n.id] || '#334155';
        if (step?.visual?.nodeLabels && (step.visual.nodeLabels as any)[n.id]) {
            n.label = (step.visual.nodeLabels as any)[n.id];
        }
    });

    // Create a new graph data object for the visualizer to trigger its useEffect
    const currentGraphData = useMemo(() => ({
        nodes: graphData.nodes,
        links: ((step?.visual?.links || algo.initialState?.links || []) as any[]).map((l: any) => ({ ...l }))
    }), [graphData.nodes, step?.visual?.links, algo.initialState?.links]);

    return (
        <PlayerShell
            tabs={[
                { id: 'viz', label: 'VIZ', icon: <LayoutTemplate size={14} /> },
                { id: 'code', label: t('player.codeAndState'), icon: <Code2 size={14} /> }
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as 'viz' | 'code')}
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
                <div className={`flex-1 flex-col relative bg-linear-to-br from-[#0B0F17] via-[#0F1420] to-[#0A0D14] h-full ${activeTab === 'viz' ? 'flex' : 'hidden'} group-data-[fullscreen=true]/player:flex lg:flex order-last lg:order-none`}>
                    {/* Mac-style Window Controls & Title */}
                    <div className="absolute top-4 right-4 flex justify-end items-center z-20 pointer-events-none">
                        <div className={`flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/20 shadow-lg transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-[9px] text-emerald-400 font-mono tracking-wider uppercase font-bold">Running</span>
                        </div>
                    </div>

                    {/* Visualizer Canvas */}
                    <div className="absolute inset-0 z-10 mix-blend-screen opacity-90">
                        <GraphVisualizer
                            initialData={currentGraphData}
                            showControls={false}
                            updateTrigger={currentStep}
                            isAnimating={isPlaying}
                            transparentBg={true}
                        />
                    </div>
                </div>
            }
            rightPanel={
                <div className={`flex-1 flex-col w-full bg-[#0d1117] relative z-20 shadow-[-15px_0_30px_rgba(0,0,0,0.3)] lg:border-l border-white/5 h-full ${activeTab === 'code' ? 'flex' : 'hidden'} group-data-[fullscreen=true]/player:flex lg:flex order-first lg:order-none`}>
                    {/* Code Tab Header */}
                    <div className="h-10 border-b border-slate-800/80 flex items-end px-3 shrink-0 bg-[#0a0d14] overflow-hidden">
                        <div className="px-4 py-2 border-t border-x border-slate-800/80 rounded-t-xl text-emerald-400 text-[10px] font-mono tracking-wider flex gap-2 items-center bg-[#0d1117] shadow-sm relative top-px z-10">
                            <Code2 size={12} className="text-emerald-500" />
                            <span>source.cpp</span>
                        </div>
                        <div className="flex-1 border-b border-slate-800/80 h-full relative z-0"></div>
                    </div>

                    {/* Desktop Layout with Memory */}
                    <div className="hidden lg:flex flex-1 overflow-hidden min-h-0">
                        <Group
                            id="algo-layout"
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
                                <PlayerEditor code={algo.code || ''} executionLine={step.line || 0} />
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
                        <PlayerEditor code={algo.code || ''} executionLine={step.line || 0} />
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
        />
    );
}

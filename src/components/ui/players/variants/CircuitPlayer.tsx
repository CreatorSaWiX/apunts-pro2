import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Code2 } from 'lucide-react';
import { ci } from '../../../../lib/simulations/content/ci';
import type { Simulation, SimulationStep, CircuitVisualState } from '../../../../lib/simulations/engine/types';
import { PlayerShell } from '../shared/PlayerShell';
import { PlayerControls } from '../shared/PlayerControls';
import { usePlayerEngine } from '../shared/usePlayerEngine';
import { PlayerEditor } from '../shared/PlayerEditor';
import { getCircuitCanvas } from '../circuit/circuitRegistry';
import { CircuitRegisters } from '../circuit/CircuitRegisters';
import { pic18Asm } from '../circuit/asmLanguage';

interface CircuitPlayerProps {
    simulation: string;
}

export default function CircuitPlayer({ simulation }: CircuitPlayerProps) {
    const { t } = useTranslation();
    const sim = ci[simulation] || ci['pin_gpio'];
    if (!sim) {
        return (
            <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">
                {t('player.notFound', 'Simulació no trobada')}: {simulation}
            </div>
        );
    }
    return <CircuitPlayerContent sim={sim} />;
}

function CircuitPlayerContent({ sim }: { sim: Simulation }) {
    const { t } = useTranslation();
    const [steps] = useState<SimulationStep[]>(() => sim.generateSteps());
    const [activeTab, setActiveTab] = useState<'circuit' | 'code'>('circuit');

    const {
        currentStep,
        setCurrentStep,
        isPlaying,
        handlePlayPause,
        handleNext,
        handlePrev,
        handleReset,
        handleFullEnd
    } = usePlayerEngine(steps.length, 2000);

    const step = steps[currentStep] || {};
    const visual = (step.visual || {}) as CircuitVisualState;

    const CanvasComponent = getCircuitCanvas(sim.circuitType || sim.id);
    const circuitTabLabel = sim.circuitLabel || (sim.id === 'pin_gpio' ? 'Circuit (GPIO)' : 'Circuit');
    const asmFileName = sim.files ? Object.keys(sim.files)[0] : (sim.id === 'pin_gpio' ? 'gpio.asm' : `${sim.id}.asm`);

    const tabs = [
        { id: 'circuit', label: circuitTabLabel, icon: <Cpu size={14} /> },
        { id: 'code', label: 'Assembler', icon: <Code2 size={14} /> }
    ];

    const controls = (
        <PlayerControls
            currentStep={currentStep}
            totalSteps={steps.length}
            description={step.description ? t(step.description, step.variables) : ''}
            isPlaying={isPlaying}
            onStepChange={setCurrentStep}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrev={handlePrev}
            onReset={handleReset}
            onFullEnd={handleFullEnd}
        />
    );

    const leftPanel = (
        <div className={`flex-1 flex-col relative bg-[#090d16] h-full ${activeTab === 'circuit' ? 'flex' : 'hidden'} group-data-[fullscreen=true]/player:flex lg:flex`}>
            {/* SVG Canvas - with bottom space so floating controls in left panel don't overlap */}
            <div className="flex-1 w-full pb-36 overflow-hidden flex items-center justify-center">
                <CanvasComponent visual={visual} />
            </div>

            {/* Desktop Controls inside Left Panel Only */}
            <div className="hidden lg:block">
                {controls}
            </div>
        </div>
    );

    const rightPanel = (
        <div className={`flex-1 flex-col w-full bg-[#0d1117] relative z-20 shadow-[-15px_0_30px_rgba(0,0,0,0.3)] lg:border-l border-white/5 h-full ${activeTab === 'code' ? 'flex' : 'hidden'} group-data-[fullscreen=true]/player:flex lg:flex`}>
            {/* Tab Header */}
            <div className="h-10 border-b border-slate-800/80 flex items-end px-3 shrink-0 bg-[#0a0d14] overflow-hidden">
                <div className="px-4 py-2 border-t border-x border-slate-800/80 rounded-t-xl text-emerald-400 text-[10px] font-mono tracking-wider flex gap-2 items-center bg-[#0d1117] shadow-sm relative top-px z-10">
                    <Code2 size={12} className="text-emerald-500" />
                    <span>{asmFileName}</span>
                </div>
                <div className="flex-1 border-b border-slate-800/80 h-full relative z-0"></div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <PlayerEditor
                    code={sim.code || ''}
                    executionLine={step.line || 1}
                    language={pic18Asm}
                />
            </div>
            <CircuitRegisters visual={visual} registers={visual.registers} />
        </div>
    );

    return (
        <PlayerShell
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as 'circuit' | 'code')}
            leftPanel={leftPanel}
            rightPanel={rightPanel}
            controls={
                <div className="lg:hidden">
                    {controls}
                </div>
            }
        />
    );
}

import React, { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Code2, Layers, Database, Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';
import { sql } from '@codemirror/lang-sql';
import { sql as sqlSimulations } from '../../../../lib/simulations/content/sql';
import type { Simulation, SimulationStep } from '../../../../lib/simulations/engine/types';
import { PlayerShell } from '../shared/PlayerShell';
import { PlayerControls } from '../shared/PlayerControls';
import { usePlayerEngine } from '../shared/usePlayerEngine';
import { PlayerEditor } from '../shared/PlayerEditor';
import SchemaCanvas from '../../visualizers/sql/SchemaCanvas';
import { DatabaseTablesView } from '../../visualizers/sql/DatabaseTablesView';
import { SQLSourceTableDrawer, SQLResultDrawer } from './SQLTableDrawer';

interface SQLPlayerProps {
    simulation: string;
    defaultTab?: 'viz' | 'code';
}

export default function SQLPlayer({ simulation, defaultTab }: SQLPlayerProps) {
    const sim = sqlSimulations[simulation];

    if (!sim) {
        return (
            <div className="p-4 bg-red-500/10 text-red-500 rounded-lg font-mono text-xs border border-red-500/20">
                Simulació no trobada: {simulation}
            </div>
        );
    }

    return <SQLPlayerContent sim={sim} defaultTab={defaultTab} />;
}

function SQLPlayerContent({ sim, defaultTab }: { sim: Simulation; defaultTab?: 'viz' | 'code' }) {
    const { t } = useTranslation();
    const [steps] = useState<SimulationStep[]>(() => sim.generateSteps());
    const [mobileTab, setMobileTab] = useState<'viz' | 'code'>(defaultTab || 'viz');
    const [rightTab, setRightTab] = useState<'erd' | 'data'>('erd');
    const sqlLang = useMemo(() => sql(), []);

    const isSchemaOnly = steps.length <= 1;
    const hasControls = !isSchemaOnly;
    const isInteractivePlay = hasControls;

    // Estat del calaix inferior
    // Si és estàtic (només per veure taules), comença desplegat si hi ha taules; si és amb play, comença plegat fins al resultat
    const [isDrawerExpanded, setIsDrawerExpanded] = useState<boolean>(() => !isInteractivePlay);
    const [drawerHeight, setDrawerHeight] = useState<number>(200);
    const [selectedSourceTable, setSelectedSourceTable] = useState<string>('');
    const isDraggingRef = useRef(false);
    const startYRef = useRef(0);
    const startHeightRef = useRef(200);

    const {
        currentStep,
        setCurrentStep,
        isPlaying,
        handlePlayPause,
        handleNext,
        handlePrev,
        handleReset,
        handleFullEnd
    } = usePlayerEngine(steps.length, 1400);

    const step = steps[currentStep] || steps[0];
    const visual = (step?.visual || {}) as any;

    const sourceTables = visual?.sourceTables || {};
    const tableNames = Object.keys(sourceTables);
    const hasResult = Boolean(visual?.resultTable);

    // Columnes esperades per a la taula resultant de la consulta
    const projectedColumns = useMemo(() => {
        for (const s of steps) {
            if ((s.visual as any)?.resultTable?.columns?.length) {
                return (s.visual as any).resultTable.columns;
            }
        }
        return [];
    }, [steps]);

    // 1. En visualitzacions amb play (isInteractivePlay, ex: select_filtre_join):
    //    Calaix inferior EXCLUSIU per al resultat de la consulta (només en consultes/resultat)
    const showResultDrawer = isInteractivePlay && (sim.mode === 'query' || hasResult);

    // 2. En visualitzacions estàtiques que només servien per veure (ex: esquema_empresa):
    //    Calaix inferior ORIGINAL de taules de la base de dades
    const showSourceTableDrawer = !isInteractivePlay && tableNames.length > 0;

    const hasBottomDrawer = showResultDrawer || showSourceTableDrawer;

    // Si arriba un resultat a la consulta en un mode interactiu, desplega automàticament el calaix de resultat
    React.useEffect(() => {
        if (isInteractivePlay && visual?.resultTable) {
            setIsDrawerExpanded(true);
        }
    }, [isInteractivePlay, visual?.resultTable]);

    // Redimensionament suau amb ratolí
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDraggingRef.current = true;
        startYRef.current = e.clientY;
        startHeightRef.current = drawerHeight;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!isDraggingRef.current) return;
            const delta = startYRef.current - moveEvent.clientY;
            const newHeight = Math.min(Math.max(120, startHeightRef.current + delta), 460);
            setDrawerHeight(newHeight);
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    // Redimensionament amb gestos tàctils (mòbil/tauleta)
    const handleTouchStart = (e: React.TouchEvent) => {
        isDraggingRef.current = true;
        startYRef.current = e.touches[0].clientY;
        startHeightRef.current = drawerHeight;

        const handleTouchMove = (moveEvent: TouchEvent) => {
            if (!isDraggingRef.current) return;
            const delta = startYRef.current - moveEvent.touches[0].clientY;
            const newHeight = Math.min(Math.max(120, startHeightRef.current + delta), 460);
            setDrawerHeight(newHeight);
        };

        const handleTouchEnd = () => {
            isDraggingRef.current = false;
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };

        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
    };

    // Controls de reproducció compartits
    const descriptionText = step?.description && t(step.description, step.variables) !== step.description
        ? (t(step.description, step.variables) as string)
        : visual?.explanation || visual?.activeStepTitle || '';

    const controls = hasControls ? (
        <PlayerControls
            currentStep={currentStep}
            totalSteps={steps.length}
            description={descriptionText}
            isPlaying={isPlaying}
            onStepChange={setCurrentStep}
            onPlayPause={() => handlePlayPause()}
            onNext={handleNext}
            onPrev={handlePrev}
            onReset={() => handleReset()}
            onFullEnd={handleFullEnd}
        />
    ) : null;

    const hasTablesToDisplay = tableNames.length > 0 || hasResult;

    return (
        <PlayerShell
            tabs={[
                { id: 'code', label: t('player.code', 'Codi'), icon: <Code2 size={14} /> },
                { id: 'viz', label: 'Visualització', icon: <Layers size={14} /> }
            ]}
            activeTab={mobileTab}
            onTabChange={(id: string) => setMobileTab(id as 'viz' | 'code')}
            controls={
                hasControls && controls ? (
                    <div className="lg:hidden">
                        {controls}
                    </div>
                ) : undefined
            }
            leftPanel={
                <div className={`flex-1 min-w-0 flex flex-col relative bg-[#0d1117] h-full shadow-[15px_0_30px_rgba(0,0,0,0.3)] lg:border-r border-white/5 ${mobileTab === 'code' ? 'flex' : 'hidden'} group-data-[fullscreen=true]/player:flex lg:flex`}>
                    {/* Header de codi net estil Apple / Linear */}
                    <div className="h-10 border-b border-slate-800/80 flex items-end px-3 shrink-0 bg-[#0a0d14] overflow-x-auto overflow-y-hidden custom-scrollbar touch-pan-x [-webkit-overflow-scrolling:touch]">
                        <div className="px-4 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex gap-2 items-center shadow-sm relative top-px z-10 transition-colors bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold whitespace-nowrap shrink-0">
                            <Code2 size={14} className="text-emerald-400 shrink-0" />
                            <span>query.sql</span>
                        </div>
                        <div className="flex-1 border-b border-slate-800/80 h-full relative z-0 min-w-5"></div>
                    </div>

                    <div className="flex-1 overflow-hidden min-h-0 relative">
                        <PlayerEditor
                            code={sim.code || ''}
                            executionLine={hasControls ? (step?.line || 0) : 0}
                            language={sqlLang}
                        />
                    </div>

                    {/* Controls de reproducció i explicació a Desktop (sense fons darrere) */}
                    {hasControls && (
                        <div className="hidden lg:flex flex-col gap-2 p-3 shrink-0 z-20">
                            {/* Text explicatori amb alçada compacta */}
                            {descriptionText && (
                                <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-xl py-1 px-3 shadow-lg pointer-events-auto">
                                    <p className="m-0 text-[12px] sm:text-[13px] text-emerald-300 font-medium leading-tight sm:leading-snug font-sans shadow-black drop-shadow-md">
                                        {descriptionText}
                                    </p>
                                </div>
                            )}

                            {/* Barra de controls i slider idèntics als visualitzadors de programació */}
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
                                        className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                    />
                                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono font-medium w-6">{steps.length - 1}</span>
                                </div>

                                {/* Controls Row */}
                                <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
                                    <button type="button" aria-label="Reiniciar" onClick={() => handleReset()} className="p-2 text-slate-400 hover:text-white rounded-xl transition active:scale-95 cursor-pointer">
                                        <SkipBack size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                    <button type="button" aria-label="Anterior" onClick={handlePrev} className="p-2 text-slate-400 hover:text-white rounded-xl transition active:scale-95 cursor-pointer">
                                        <ChevronLeft size={16} className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                                    </button>
                                    <button type="button"
                                        aria-label={isPlaying ? "Pausar" : "Reproduir"}
                                        onClick={() => handlePlayPause()}
                                        className="p-3 bg-gradient-to-b from-emerald-400 to-emerald-600 text-slate-950 border border-emerald-400/50 rounded-full transition hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer"
                                    >
                                        {isPlaying ? <Pause size={18} className="fill-current w-[18px] h-[18px]" /> : <Play size={18} className="ml-0.5 fill-current w-[18px] h-[18px]" />}
                                    </button>
                                    <button type="button" aria-label="Següent" onClick={handleNext} className="p-2 text-slate-400 hover:text-white rounded-xl transition active:scale-95 cursor-pointer">
                                        <ChevronRight size={16} className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                                    </button>
                                    <button type="button" aria-label="Final" onClick={handleFullEnd} className="p-2 text-slate-400 hover:text-white rounded-xl transition active:scale-95 cursor-pointer">
                                        <SkipForward size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            }
            rightPanel={
                <div className={`flex-1 flex-col relative z-20 bg-linear-to-br from-[#0B0F17] via-[#0F1420] to-[#0A0D14] h-full w-full ${mobileTab === 'viz' ? 'flex' : 'hidden'} group-data-[fullscreen=true]/player:flex lg:flex`}>
                    {/* Capçalera neta amb pestanyes: Esquema ERD i Dades de la BD */}
                    <div className="h-10 border-b border-slate-800/80 flex items-end px-3 shrink-0 bg-[#0a0d14] overflow-x-auto overflow-y-hidden custom-scrollbar touch-pan-x [-webkit-overflow-scrolling:touch]">
                        {/* Pestanya 1: Esquema ERD */}
                        <button
                            type="button"
                            onClick={() => setRightTab('erd')}
                            className={`px-3.5 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex gap-2 items-center shadow-sm relative top-px z-10 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                                rightTab === 'erd'
                                    ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold'
                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                            }`}
                        >
                            <Layers size={13} className={rightTab === 'erd' ? 'text-emerald-400 shrink-0' : 'text-slate-500 shrink-0'} />
                            <span>Esquema ERD</span>
                        </button>

                        {/* Pestanya 2: Dades de la BD (NOMÉS en visualitzacions interactives amb explicació/play) */}
                        {isInteractivePlay && tableNames.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setRightTab('data')}
                                className={`px-3.5 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex gap-2 items-center shadow-sm relative top-px z-10 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                                    rightTab === 'data'
                                        ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold'
                                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                                }`}
                            >
                                <Database size={13} className={rightTab === 'data' ? 'text-emerald-400 shrink-0' : 'text-slate-500 shrink-0'} />
                                <span>Dades ({tableNames.length} {tableNames.length === 1 ? 'taula' : 'taules'})</span>
                            </button>
                        )}
                        <div className="flex-1 border-b border-slate-800/80 h-full relative z-0 min-w-5"></div>
                    </div>

                    {/* Contingut: Vista activa (Canvas ERD o Taules de dades) + Calaix inferior */}
                    <div className="flex-1 relative overflow-hidden min-h-0 bg-[#0d1117] flex flex-col">
                        {/* Vista principal activa */}
                        <div className="flex-1 min-h-0 relative overflow-hidden">
                            {(!isInteractivePlay || rightTab === 'erd') ? (
                                <SchemaCanvas
                                    schema={visual?.schema}
                                    activeTables={visual?.activeTables}
                                    activeColumns={visual?.activeColumns}
                                />
                            ) : (
                                <DatabaseTablesView
                                    sourceTables={sourceTables}
                                    activeTables={visual?.activeTables}
                                    activeColumns={visual?.activeColumns}
                                />
                            )}
                        </div>

                        {/* Calaix inferior:
                            1. Explicacions amb Play: calaix exclusiu de RESULTAT DE LA CONSULTA (SQLResultDrawer)
                            2. Visualitzacions estàtiques només per veure: calaix clàssic de TAULES FONT DE LA BD (SQLSourceTableDrawer)
                        */}
                        {hasBottomDrawer && (
                            isDrawerExpanded ? (
                                <>
                                    {/* Separador redimensionable */}
                                    <div
                                        onMouseDown={handleMouseDown}
                                        onTouchStart={handleTouchStart}
                                        className="h-2 bg-slate-800/90 hover:bg-emerald-500/50 active:bg-emerald-500 transition-colors cursor-row-resize z-30 flex items-center justify-center shrink-0 select-none touch-none"
                                        title="Arrossega per canviar l'alçada"
                                    >
                                        <div className="w-8 h-0.5 bg-slate-500 rounded-full" />
                                    </div>

                                    {/* Calaix obert */}
                                    <div
                                        style={{ height: drawerHeight }}
                                        className="flex flex-col shrink-0 min-h-0 bg-[#0d1117] relative z-20"
                                    >
                                        {showResultDrawer ? (
                                            <SQLResultDrawer
                                                resultTable={visual?.resultTable}
                                                projectedColumns={projectedColumns}
                                                isExpanded={true}
                                                onToggle={() => setIsDrawerExpanded(false)}
                                            />
                                        ) : (
                                            <SQLSourceTableDrawer
                                                sourceTables={sourceTables}
                                                selectedTable={selectedSourceTable || tableNames[0]}
                                                onSelectTable={setSelectedSourceTable}
                                                activeTables={visual?.activeTables}
                                                activeColumns={visual?.activeColumns}
                                                isExpanded={true}
                                                onToggle={() => setIsDrawerExpanded(false)}
                                            />
                                        )}
                                    </div>
                                </>
                            ) : (
                                showResultDrawer ? (
                                    <SQLResultDrawer
                                        resultTable={visual?.resultTable}
                                        projectedColumns={projectedColumns}
                                        isExpanded={false}
                                        onToggle={() => setIsDrawerExpanded(true)}
                                    />
                                ) : (
                                    <SQLSourceTableDrawer
                                        sourceTables={sourceTables}
                                        selectedTable={selectedSourceTable || tableNames[0]}
                                        onSelectTable={setSelectedSourceTable}
                                        activeTables={visual?.activeTables}
                                        activeColumns={visual?.activeColumns}
                                        isExpanded={false}
                                        onToggle={() => setIsDrawerExpanded(true)}
                                    />
                                )
                            )
                        )}
                    </div>
                </div>
            }
        />
    );
}

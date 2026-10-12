import React, { useState, useMemo, useEffect } from 'react';
import {
    Code2,
    Database,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { sql } from '@codemirror/lang-sql';
import { PlayerShell } from '../../../players/shared/PlayerShell';
import { PlayerEditor } from '../../../players/shared/PlayerEditor';
import { usePlayerEngine } from '../../../players/shared/usePlayerEngine';
import DataGrid from '../DataGrid';
import type { SQLTableData } from '../../../../../lib/simulations/engine/types';

interface UpdateStep {
    line: number;
    description: string;
    empleats: SQLTableData;
    departaments: SQLTableData;
    activeColumnsEmpleats: string[];
    activeColumnsDepartaments?: string[];
    preferredTable?: 'empleats' | 'departaments';
}

const UPDATE_CODE = `-- 1. UPDATE bàsic amb condició WHERE
UPDATE empleats
SET sou = sou + 10000,
    ciutat_empl = 'VIC'
WHERE num_dpt = 2;

-- 2. ERROR DE RESTRICCIÓ CHECK (sou > 80000)
UPDATE empleats
SET sou = 50000
WHERE num_empl = 3;

-- 3. ERROR DE CLAU FORANA (dpt 99 no existeix)
UPDATE empleats
SET num_dpt = 99
WHERE num_empl = 5;

-- 4. UPDATE amb subconsulta a WHERE
UPDATE empleats
SET sou = sou + 10000
WHERE num_dpt IN (
    SELECT num_dpt FROM departaments
    WHERE ciutat_dpt = 'MADRID'
);

-- 5. ERROR: Subconsulta a SET retorna > 1 fila
UPDATE empleats
SET sou = (SELECT sou FROM empleats WHERE num_dpt = 2)
WHERE num_empl = 1;

-- 6. Subconsulta escalar a SET (càlcul d'agregació)
UPDATE empleats e
SET sou = (
    SELECT AVG(sou) FROM empleats
    WHERE num_dpt = e.num_dpt
)
WHERE num_dpt = 2;

-- 7. ALERTA: Sense WHERE s'actualitzen totes les files!
UPDATE empleats
SET ciutat_empl = 'BARCELONA';`;

const EMPLEATS_COLUMNS = ['num_empl', 'nom_empl', 'sou', 'ciutat_empl', 'num_dpt'];
const DEPARTAMENTS_COLUMNS = ['num_dpt', 'nom_dpt', 'ciutat_dpt'];

const DEPARTAMENTS_BASE_ROWS = [
    [1, 'DIRECCIO', 'BARCELONA'],
    [2, 'VENDES', 'MADRID'],
    [3, 'INFORMATICA', 'MADRID']
];

const UPDATE_STEPS: UpdateStep[] = [
    {
        line: 0,
        description: "Taules 'empleats' i 'departaments' carregades amb dades inicials.",
        empleats: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 'MATARO', 1],
                [2, 'EUGENIA', 350000, 'TOLEDO', 2],
                [3, 'JOSEP', 250000, 'SITGES', 1],
                [4, 'RICARDO', 320000, 'BARCELONA', 2],
                [5, 'NURIA', 120000, 'GIRONA', 3]
            ],
            rowStatuses: ['normal', 'normal', 'normal', 'normal', 'normal']
        },
        departaments: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: DEPARTAMENTS_BASE_ROWS,
            rowStatuses: ['normal', 'normal', 'normal']
        },
        activeColumnsEmpleats: []
    },
    {
        line: 2,
        description: "Increment de sou (+10.000) i canvi a 'VIC' per als empleats del departament 2 (EUGENIA i RICARDO).",
        empleats: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 'MATARO', 1],
                [2, 'EUGENIA', 360000, 'VIC', 2],
                [3, 'JOSEP', 250000, 'SITGES', 1],
                [4, 'RICARDO', 330000, 'VIC', 2],
                [5, 'NURIA', 120000, 'GIRONA', 3]
            ],
            rowStatuses: ['normal', 'updated', 'normal', 'updated', 'normal']
        },
        departaments: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: DEPARTAMENTS_BASE_ROWS,
            rowStatuses: ['normal', 'normal', 'normal']
        },
        activeColumnsEmpleats: ['sou', 'ciutat_empl']
    },
    {
        line: 8,
        description: "Error: Violació de CHECK (sou > 80000). El sou 50.000 no està permès; sentència descartada.",
        empleats: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 'MATARO', 1],
                [2, 'EUGENIA', 360000, 'VIC', 2],
                [3, 'JOSEP', 250000, 'SITGES', 1],
                [4, 'RICARDO', 330000, 'VIC', 2],
                [5, 'NURIA', 120000, 'GIRONA', 3]
            ],
            rowStatuses: ['normal', 'normal', 'normal', 'normal', 'normal']
        },
        departaments: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: DEPARTAMENTS_BASE_ROWS,
            rowStatuses: ['normal', 'normal', 'normal']
        },
        activeColumnsEmpleats: ['sou']
    },
    {
        line: 13,
        description: "Error: Violació de clau forana (dpt 99 no existeix a departaments). Sentència descartada.",
        empleats: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 'MATARO', 1],
                [2, 'EUGENIA', 360000, 'VIC', 2],
                [3, 'JOSEP', 250000, 'SITGES', 1],
                [4, 'RICARDO', 330000, 'VIC', 2],
                [5, 'NURIA', 120000, 'GIRONA', 3]
            ],
            rowStatuses: ['normal', 'normal', 'normal', 'normal', 'normal']
        },
        departaments: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: DEPARTAMENTS_BASE_ROWS,
            rowStatuses: ['normal', 'normal', 'normal']
        },
        activeColumnsEmpleats: ['num_dpt']
    },
    {
        line: 18,
        description: "Subconsulta a WHERE: filtra departaments a MADRID (2 i 3) i incrementa sou (+10.000) a 3 empleats.",
        empleats: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 'MATARO', 1],
                [2, 'EUGENIA', 370000, 'VIC', 2],
                [3, 'JOSEP', 250000, 'SITGES', 1],
                [4, 'RICARDO', 340000, 'VIC', 2],
                [5, 'NURIA', 130000, 'GIRONA', 3]
            ],
            rowStatuses: ['normal', 'updated', 'normal', 'updated', 'updated']
        },
        departaments: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: DEPARTAMENTS_BASE_ROWS,
            rowStatuses: ['normal', 'active', 'active']
        },
        activeColumnsEmpleats: ['sou', 'num_dpt'],
        activeColumnsDepartaments: ['ciutat_dpt', 'num_dpt']
    },
    {
        line: 26,
        description: "Error: La subconsulta a SET retorna més d'una fila (370.000 i 340.000). A SET cal un únic valor escalar.",
        empleats: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 'MATARO', 1],
                [2, 'EUGENIA', 370000, 'VIC', 2],
                [3, 'JOSEP', 250000, 'SITGES', 1],
                [4, 'RICARDO', 340000, 'VIC', 2],
                [5, 'NURIA', 130000, 'GIRONA', 3]
            ],
            rowStatuses: ['normal', 'normal', 'normal', 'normal', 'normal']
        },
        departaments: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: DEPARTAMENTS_BASE_ROWS,
            rowStatuses: ['normal', 'normal', 'normal']
        },
        activeColumnsEmpleats: ['sou']
    },
    {
        line: 31,
        description: "Subconsulta d'agregació a SET: calcula AVG(sou) del dpt 2 (355.000) i l'assigna als seus empleats.",
        empleats: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 'MATARO', 1],
                [2, 'EUGENIA', 355000, 'VIC', 2],
                [3, 'JOSEP', 250000, 'SITGES', 1],
                [4, 'RICARDO', 355000, 'VIC', 2],
                [5, 'NURIA', 130000, 'GIRONA', 3]
            ],
            rowStatuses: ['normal', 'updated', 'normal', 'updated', 'normal']
        },
        departaments: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: DEPARTAMENTS_BASE_ROWS,
            rowStatuses: ['normal', 'normal', 'normal']
        },
        activeColumnsEmpleats: ['sou']
    },
    {
        line: 39,
        description: "Compte amb ometre el WHERE: sense filtre, s'actualitzen totes les files de la taula (ciutat = 'BARCELONA').",
        empleats: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 'BARCELONA', 1],
                [2, 'EUGENIA', 355000, 'BARCELONA', 2],
                [3, 'JOSEP', 250000, 'BARCELONA', 1],
                [4, 'RICARDO', 355000, 'BARCELONA', 2],
                [5, 'NURIA', 130000, 'BARCELONA', 3]
            ],
            rowStatuses: ['updated', 'updated', 'updated', 'updated', 'updated']
        },
        departaments: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: DEPARTAMENTS_BASE_ROWS,
            rowStatuses: ['normal', 'normal', 'normal']
        },
        activeColumnsEmpleats: ['ciutat_empl']
    }
];

export default function UpdatePlayer() {
    const [mobileTab, setMobileTab] = useState<'code' | 'viz'>('code');
    const [manualTable, setManualTable] = useState<'empleats' | 'departaments' | null>(null);
    const sqlLang = useMemo(() => sql(), []);

    const {
        currentStep,
        setCurrentStep,
        isPlaying,
        handlePlayPause,
        handleNext,
        handlePrev,
        handleReset,
        handleFullEnd
    } = usePlayerEngine(UPDATE_STEPS.length, 1600);

    const step = UPDATE_STEPS[currentStep] || UPDATE_STEPS[0];

    // Reset manual selection when moving steps
    useEffect(() => {
        setManualTable(null);
    }, [currentStep]);

    const activeTableName = manualTable || step.preferredTable || 'empleats';
    const currentTableData = activeTableName === 'empleats' ? step.empleats : step.departaments;
    const currentActiveColumns = activeTableName === 'empleats'
        ? step.activeColumnsEmpleats
        : (step.activeColumnsDepartaments || []);

    return (
        <PlayerShell
            tabs={[
                { id: 'code', label: 'Codi', icon: <Code2 size={14} /> },
                { id: 'viz', label: 'Dades', icon: <Database size={14} /> }
            ]}
            activeTab={mobileTab}
            onTabChange={(id: string) => setMobileTab(id as 'code' | 'viz')}
            leftPanel={
                <div className={`flex-1 min-w-0 flex flex-col relative bg-[#0d1117] h-full shadow-[15px_0_30px_rgba(0,0,0,0.3)] lg:border-r border-white/5 ${mobileTab === 'code' ? 'flex' : 'hidden'} lg:flex`}>
                    {/* Header de codi net estil Apple / Linear */}
                    <div className="h-10 border-b border-slate-800/80 flex items-end px-3 shrink-0 bg-[#0a0d14]">
                        <div className="px-4 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex gap-2 items-center bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold">
                            <Code2 size={14} className="text-emerald-400 shrink-0" />
                            <span>query.sql</span>
                        </div>
                        <div className="flex-1 border-b border-slate-800/80 h-full"></div>
                    </div>

                    {/* Editor amb línia d'execució activa */}
                    <div className="flex-1 overflow-hidden min-h-0 relative">
                        <PlayerEditor
                            code={UPDATE_CODE}
                            executionLine={step.line}
                            language={sqlLang}
                        />
                    </div>

                    {/* Controls de reproducció i explicació en una sola línia */}
                    <div className="flex flex-col gap-2 p-3 shrink-0 z-20">
                        {/* Explicació compacta d'un sol enunciat */}
                        <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-xl py-1 px-3 shadow-lg pointer-events-auto">
                            <p className="m-0 text-[12px] sm:text-[13px] text-emerald-300 font-medium leading-tight sm:leading-snug font-sans shadow-black drop-shadow-md">
                                {step.description}
                            </p>
                        </div>

                        {/* Barra de controls i slider */}
                        <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 shadow-2xl pointer-events-auto">
                            <div className="flex items-center gap-3 w-full px-1">
                                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono font-medium w-6 text-right">{currentStep}</span>
                                <input
                                    type="range"
                                    min={0}
                                    max={UPDATE_STEPS.length - 1}
                                    value={currentStep}
                                    onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono font-medium w-6">{UPDATE_STEPS.length - 1}</span>
                            </div>

                            <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
                                <button type="button" aria-label="Reiniciar" onClick={() => handleReset()} className="p-2 text-slate-400 hover:text-white rounded-xl transition cursor-pointer">
                                    <SkipBack size={16} />
                                </button>
                                <button type="button" aria-label="Anterior" onClick={handlePrev} className="p-2 text-slate-400 hover:text-white rounded-xl transition cursor-pointer">
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    type="button"
                                    aria-label={isPlaying ? "Pausar" : "Reproduir"}
                                    onClick={() => handlePlayPause()}
                                    className="p-3 bg-gradient-to-b from-emerald-400 to-emerald-600 text-slate-950 border border-emerald-400/50 rounded-full transition hover:scale-105 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                >
                                    {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="ml-0.5 fill-current" />}
                                </button>
                                <button type="button" aria-label="Següent" onClick={handleNext} className="p-2 text-slate-400 hover:text-white rounded-xl transition cursor-pointer">
                                    <ChevronRight size={16} />
                                </button>
                                <button type="button" aria-label="Final" onClick={handleFullEnd} className="p-2 text-slate-400 hover:text-white rounded-xl transition cursor-pointer">
                                    <SkipForward size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            rightPanel={
                <div className={`flex-1 flex flex-col relative bg-[#090d16] h-full ${mobileTab === 'viz' ? 'flex' : 'hidden'} lg:flex`}>
                    {/* Header de les taules estil Apple / Linear */}
                    <div className="h-10 border-b border-slate-800/80 px-3 bg-[#0a0d14] flex items-end shrink-0 gap-1">
                        <button
                            type="button"
                            onClick={() => setManualTable('empleats')}
                            className={`px-3.5 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex gap-2 items-center cursor-pointer transition-colors whitespace-nowrap ${
                                activeTableName === 'empleats'
                                    ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold'
                                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            <Database size={13} className={activeTableName === 'empleats' ? 'text-emerald-400 shrink-0' : 'text-slate-500 shrink-0'} />
                            <span>Taula: empleats</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setManualTable('departaments')}
                            className={`px-3.5 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex gap-2 items-center cursor-pointer transition-colors whitespace-nowrap ${
                                activeTableName === 'departaments'
                                    ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold'
                                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            <Database size={13} className={activeTableName === 'departaments' ? 'text-emerald-400 shrink-0' : 'text-slate-500 shrink-0'} />
                            <span>Taula: departaments</span>
                        </button>
                        <div className="flex-1 border-b border-slate-800/80 h-full"></div>
                    </div>

                    {/* Graella física de dades */}
                    <div className="flex-1 relative overflow-hidden min-h-0 bg-[#0d1117]">
                        <DataGrid
                            table={currentTableData}
                            tableName={activeTableName}
                            activeColumns={currentActiveColumns}
                            showFooter={true}
                        />
                    </div>
                </div>
            }
        />
    );
}

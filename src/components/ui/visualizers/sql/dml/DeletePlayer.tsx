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

interface DeleteStep {
    line: number;
    description: string;
    activeTable: 'empleats' | 'departaments';
    empleatsData: SQLTableData;
    departamentsData: SQLTableData;
}

const DELETE_CODE = `-- 1. Taules inicials 'empleats' i 'departaments'
SELECT * FROM empleats;

-- 2. Esborrat amb condició simple (num_dpt = 2)
DELETE FROM empleats
WHERE num_dpt = 2;

-- 3. Error de Clau Forana (RESTRICT)
DELETE FROM departaments
WHERE num_dpt = 1;

-- 4. Esborrat amb filtre de sou (sou <= 250000)
DELETE FROM empleats
WHERE sou <= 250000;

-- 5. Esborrat amb NOT EXISTS (departaments orfes)
DELETE FROM departaments d
WHERE NOT EXISTS (
    SELECT * FROM empleats e
    WHERE e.num_dpt = d.num_dpt
);

-- 6. PERILL: Esborrat massiu sense clàusula WHERE
DELETE FROM empleats;`;

const EMPLEATS_COLUMNS = ['num_empl', 'nom_empl', 'sou', 'num_dpt'];
const DEPARTAMENTS_COLUMNS = ['num_dpt', 'nom_dpt', 'ciutat_dpt'];

const DELETE_STEPS: DeleteStep[] = [
    {
        line: 2,
        description: "Taules 'empleats' (6 tuples) i 'departaments' (4 tuples). Cada empleat té assignat el seu departament.",
        activeTable: 'empleats',
        empleatsData: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [2, 'EUGENIA', 350000, 2],
                [3, 'JOSEP', 250000, 1],
                [4, 'LAURA', 280000, 3],
                [5, 'FERRAN', 240000, 1],
                [6, 'RICARDO', 320000, 2]
            ],
            rowStatuses: ['normal', 'normal', 'normal', 'normal', 'normal', 'normal']
        },
        departamentsData: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: [
                [1, 'DIRECCIO', 'BARCELONA'],
                [2, 'INFORMATICA', 'MADRID'],
                [3, 'LOGISTICA', 'VALENCIA'],
                [4, 'PERSONAL', 'GIRONA']
            ],
            rowStatuses: ['normal', 'normal', 'normal', 'normal']
        }
    },
    {
        line: 5,
        description: "Filtre WHERE num_dpt = 2: les tuples d'EUGENIA i RICARDO coincideixen i queden marcades per esborrar.",
        activeTable: 'empleats',
        empleatsData: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [2, 'EUGENIA', 350000, 2],
                [3, 'JOSEP', 250000, 1],
                [4, 'LAURA', 280000, 3],
                [5, 'FERRAN', 240000, 1],
                [6, 'RICARDO', 320000, 2]
            ],
            rowStatuses: ['normal', 'deleted', 'normal', 'normal', 'normal', 'deleted']
        },
        departamentsData: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: [
                [1, 'DIRECCIO', 'BARCELONA'],
                [2, 'INFORMATICA', 'MADRID'],
                [3, 'LOGISTICA', 'VALENCIA'],
                [4, 'PERSONAL', 'GIRONA']
            ],
            rowStatuses: ['normal', 'normal', 'normal', 'normal']
        }
    },
    {
        line: 5,
        description: "Execució completada: s'han eliminat 2 files d'empleats. El departament 2 ara queda orfe (sense empleats).",
        activeTable: 'empleats',
        empleatsData: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [3, 'JOSEP', 250000, 1],
                [4, 'LAURA', 280000, 3],
                [5, 'FERRAN', 240000, 1]
            ],
            rowStatuses: ['normal', 'normal', 'normal', 'normal']
        },
        departamentsData: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: [
                [1, 'DIRECCIO', 'BARCELONA'],
                [2, 'INFORMATICA', 'MADRID'],
                [3, 'LOGISTICA', 'VALENCIA'],
                [4, 'PERSONAL', 'GIRONA']
            ],
            rowStatuses: ['normal', 'normal', 'normal', 'normal']
        }
    },
    {
        line: 9,
        description: "Error: Violació de clau forana (RESTRICT). El departament 1 té empleats assignats i no es pot esborrar.",
        activeTable: 'departaments',
        empleatsData: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [3, 'JOSEP', 250000, 1],
                [4, 'LAURA', 280000, 3],
                [5, 'FERRAN', 240000, 1]
            ],
            rowStatuses: ['normal', 'normal', 'normal', 'normal']
        },
        departamentsData: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: [
                [1, 'DIRECCIO', 'BARCELONA'],
                [2, 'INFORMATICA', 'MADRID'],
                [3, 'LOGISTICA', 'VALENCIA'],
                [4, 'PERSONAL', 'GIRONA']
            ],
            rowStatuses: ['active', 'normal', 'normal', 'normal']
        }
    },
    {
        line: 13,
        description: "Filtre WHERE sou <= 250000: s'identifiquen JOSEP (250.000) i FERRAN (240.000) per a l'esborrat.",
        activeTable: 'empleats',
        empleatsData: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [3, 'JOSEP', 250000, 1],
                [4, 'LAURA', 280000, 3],
                [5, 'FERRAN', 240000, 1]
            ],
            rowStatuses: ['normal', 'deleted', 'normal', 'deleted']
        },
        departamentsData: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: [
                [1, 'DIRECCIO', 'BARCELONA'],
                [2, 'INFORMATICA', 'MADRID'],
                [3, 'LOGISTICA', 'VALENCIA'],
                [4, 'PERSONAL', 'GIRONA']
            ],
            rowStatuses: ['normal', 'normal', 'normal', 'normal']
        }
    },
    {
        line: 13,
        description: "Execució completada: s'han suprimit 2 empleats. Queden a la taula només CARME (400.000) i LAURA (280.000).",
        activeTable: 'empleats',
        empleatsData: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [4, 'LAURA', 280000, 3]
            ],
            rowStatuses: ['normal', 'normal']
        },
        departamentsData: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: [
                [1, 'DIRECCIO', 'BARCELONA'],
                [2, 'INFORMATICA', 'MADRID'],
                [3, 'LOGISTICA', 'VALENCIA'],
                [4, 'PERSONAL', 'GIRONA']
            ],
            rowStatuses: ['normal', 'normal', 'normal', 'normal']
        }
    },
    {
        line: 17,
        description: "Subconsulta NOT EXISTS: es detecten els departaments 2 ('INFORMATICA') i 4 ('PERSONAL') sense cap empleat assignat.",
        activeTable: 'departaments',
        empleatsData: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [4, 'LAURA', 280000, 3]
            ],
            rowStatuses: ['normal', 'normal']
        },
        departamentsData: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: [
                [1, 'DIRECCIO', 'BARCELONA'],
                [2, 'INFORMATICA', 'MADRID'],
                [3, 'LOGISTICA', 'VALENCIA'],
                [4, 'PERSONAL', 'GIRONA']
            ],
            rowStatuses: ['normal', 'deleted', 'normal', 'deleted']
        }
    },
    {
        line: 17,
        description: "Execució completada: s'han suprimit els departaments 2 i 4. Queden els departaments actius 1 i 3.",
        activeTable: 'departaments',
        empleatsData: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [4, 'LAURA', 280000, 3]
            ],
            rowStatuses: ['normal', 'normal']
        },
        departamentsData: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: [
                [1, 'DIRECCIO', 'BARCELONA'],
                [3, 'LOGISTICA', 'VALENCIA']
            ],
            rowStatuses: ['normal', 'normal']
        }
    },
    {
        line: 24,
        description: "Compte amb ometre el WHERE: 'DELETE FROM empleats;' sense filtre marca totes les files per esborrar.",
        activeTable: 'empleats',
        empleatsData: {
            columns: EMPLEATS_COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [4, 'LAURA', 280000, 3]
            ],
            rowStatuses: ['deleted', 'deleted']
        },
        departamentsData: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: [
                [1, 'DIRECCIO', 'BARCELONA'],
                [3, 'LOGISTICA', 'VALENCIA']
            ],
            rowStatuses: ['normal', 'normal']
        }
    },
    {
        line: 24,
        description: "Taula buida (0 files). L'esquema i les columnes de la taula es mantenen intactes (a diferència de DROP TABLE).",
        activeTable: 'empleats',
        empleatsData: {
            columns: EMPLEATS_COLUMNS,
            rows: [],
            rowStatuses: []
        },
        departamentsData: {
            columns: DEPARTAMENTS_COLUMNS,
            rows: [
                [1, 'DIRECCIO', 'BARCELONA'],
                [3, 'LOGISTICA', 'VALENCIA']
            ],
            rowStatuses: ['normal', 'normal']
        }
    }
];

export default function DeletePlayer() {
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
    } = usePlayerEngine(DELETE_STEPS.length, 1600);

    const step = DELETE_STEPS[currentStep] || DELETE_STEPS[0];

    // Reset manual selection when moving steps
    useEffect(() => {
        setManualTable(null);
    }, [currentStep]);

    const activeTableName = manualTable || step.activeTable;
    const currentTableData = activeTableName === 'empleats' ? step.empleatsData : step.departamentsData;

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
                            code={DELETE_CODE}
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
                                    max={DELETE_STEPS.length - 1}
                                    value={currentStep}
                                    onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono font-medium w-6">{DELETE_STEPS.length - 1}</span>
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
                            showFooter={true}
                        />
                    </div>
                </div>
            }
        />
    );
}

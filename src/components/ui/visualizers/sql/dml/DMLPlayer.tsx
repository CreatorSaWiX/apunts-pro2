import React, { useState, useMemo } from 'react';
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

interface DMLStep {
    line: number;
    description: string;
    tableData: SQLTableData;
}

const DML_CODE = `-- 1. Inserció correcta d'un empleat
INSERT INTO empleats (num_empl, nom_empl, sou, num_dpt)
VALUES (1, 'CARME', 400000, 1);

-- 2. Inserció d'un segon empleat vàlid
INSERT INTO empleats (num_empl, nom_empl, sou, num_dpt)
VALUES (2, 'EUGENIA', 350000, 2);

-- 3. ERROR DE PK DUPLICADA (num_empl = 1 ja existeix)
INSERT INTO empleats (num_empl, nom_empl, sou, num_dpt)
VALUES (1, 'JOAN', 200000, 1);

-- 4. Inserció d'un tercer empleat vàlid
INSERT INTO empleats (num_empl, nom_empl, sou, num_dpt)
VALUES (3, 'JOSEP', 250000, 1);

-- 5. ERROR DE CLAU FORANA (dpt 99 no existeix)
INSERT INTO empleats (num_empl, nom_empl, sou, num_dpt)
VALUES (4, 'LAURA', 180000, 99);

-- 6. ERROR DE RESTRICCIÓ CHECK (sou ha de ser > 80000)
INSERT INTO empleats (num_empl, nom_empl, sou, num_dpt)
VALUES (5, 'MARC', 50000, 1);

-- 7. Inserció d'un quart empleat vàlid
INSERT INTO empleats (num_empl, nom_empl, sou, num_dpt)
VALUES (6, 'RICARDO', 320000, 2);`;

const COLUMNS = ['num_empl', 'nom_empl', 'sou', 'num_dpt'];

const DML_STEPS: DMLStep[] = [
    {
        line: 0,
        description: "Taula 'empleats' creada, inicialment buida.",
        tableData: {
            columns: COLUMNS,
            rows: [],
            rowStatuses: []
        }
    },
    {
        line: 2,
        description: "Inserció de la fila (1, 'CARME', 400000, 1). Compleix totes les restriccions.",
        tableData: {
            columns: COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1]
            ],
            rowStatuses: ['inserted']
        }
    },
    {
        line: 6,
        description: "Inserció de la fila (2, 'EUGENIA', 350000, 2).",
        tableData: {
            columns: COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [2, 'EUGENIA', 350000, 2]
            ],
            rowStatuses: ['normal', 'inserted']
        }
    },
    {
        line: 10,
        description: "Error: Violació de clau primària (num_empl=1 ja existeix). Sentència descartada.",
        tableData: {
            columns: COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [2, 'EUGENIA', 350000, 2]
            ],
            rowStatuses: ['normal', 'normal']
        }
    },
    {
        line: 14,
        description: "Inserció de la fila (3, 'JOSEP', 250000, 1).",
        tableData: {
            columns: COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [2, 'EUGENIA', 350000, 2],
                [3, 'JOSEP', 250000, 1]
            ],
            rowStatuses: ['normal', 'normal', 'inserted']
        }
    },
    {
        line: 18,
        description: "Error: Violació de clau forana (num_dpt=99 no existeix a departaments). Sentència descartada.",
        tableData: {
            columns: COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [2, 'EUGENIA', 350000, 2],
                [3, 'JOSEP', 250000, 1]
            ],
            rowStatuses: ['normal', 'normal', 'normal']
        }
    },
    {
        line: 22,
        description: "Error: Violació de CHECK (sou ha de ser > 80000). Sentència descartada.",
        tableData: {
            columns: COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [2, 'EUGENIA', 350000, 2],
                [3, 'JOSEP', 250000, 1]
            ],
            rowStatuses: ['normal', 'normal', 'normal']
        }
    },
    {
        line: 26,
        description: "Inserció de la fila (6, 'RICARDO', 320000, 2). Total acumulat: 4 tuples.",
        tableData: {
            columns: COLUMNS,
            rows: [
                [1, 'CARME', 400000, 1],
                [2, 'EUGENIA', 350000, 2],
                [3, 'JOSEP', 250000, 1],
                [6, 'RICARDO', 320000, 2]
            ],
            rowStatuses: ['normal', 'normal', 'normal', 'inserted']
        }
    }
];

export default function DMLPlayer() {
    const [mobileTab, setMobileTab] = useState<'code' | 'viz'>('code');
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
    } = usePlayerEngine(DML_STEPS.length, 1600);

    const step = DML_STEPS[currentStep] || DML_STEPS[0];

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
                            code={DML_CODE}
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
                                    max={DML_STEPS.length - 1}
                                    value={currentStep}
                                    onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono font-medium w-6">{DML_STEPS.length - 1}</span>
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
                    {/* Header de la taula */}
                    <div className="h-10 border-b border-slate-800/80 px-3 bg-[#0a0d14] flex items-end shrink-0">
                        <div className="px-3.5 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex gap-2 items-center bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold whitespace-nowrap">
                            <Database size={13} className="text-emerald-400 shrink-0" />
                            <span>Taula: empleats</span>
                        </div>
                        <div className="flex-1 border-b border-slate-800/80 h-full"></div>
                    </div>

                    {/* Graella física de dades */}
                    <div className="flex-1 relative overflow-hidden min-h-0 bg-[#0d1117]">
                        <DataGrid
                            table={step.tableData}
                            tableName="empleats"
                            showFooter={true}
                        />
                    </div>
                </div>
            }
        />
    );
}

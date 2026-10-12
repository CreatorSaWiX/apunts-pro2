import React, { useState } from 'react';
import { Layers, Database, Code2, Key, Link2 } from 'lucide-react';
import UMLCanvas from './UMLCanvas';
import { umlAssociacions, umlHerencia } from '../../../../../lib/simulations/content/uml/schemas';

interface TransformCase {
    id: '1_n' | '1_1' | 'm_n' | 'inheritance';
    label: string;
    umlSchema: any;
    tables: {
        name: string;
        columns: {
            name: string;
            type: string;
            isPk?: boolean;
            isFk?: boolean;
            isNotNull?: boolean;
            isUnique?: boolean;
            references?: string;
            highlight?: boolean;
        }[];
    }[];
    sqlSnippet: string;
}

const TRANSFORM_CASES: TransformCase[] = [
    {
        id: '1_n',
        label: '1:N',
        umlSchema: {
            id: 'case_1_n',
            classes: [
                { ...umlAssociacions.classes.find(c => c.id === 'departament')!, x: 60, y: 60 },
                { ...umlAssociacions.classes.find(c => c.id === 'empleat')!, x: 420, y: 60 }
            ],
            associations: [
                umlAssociacions.associations.find(a => a.id === 'ass_departament_empleat')!
            ]
        },
        tables: [
            {
                name: 'DEPARTAMENT',
                columns: [
                    { name: 'num_dpt', type: 'INTEGER', isPk: true },
                    { name: 'nom_dpt', type: 'CHAR(30)' }
                ]
            },
            {
                name: 'EMPLEAT',
                columns: [
                    { name: 'dni', type: 'CHAR(9)', isPk: true },
                    { name: 'nom', type: 'CHAR(30)' },
                    { name: 'sou', type: 'INTEGER' },
                    {
                        name: 'num_dpt',
                        type: 'INTEGER',
                        isFk: true,
                        isNotNull: true,
                        references: 'DEPARTAMENT(num_dpt)',
                        highlight: true
                    }
                ]
            }
        ],
        sqlSnippet: `CREATE TABLE DEPARTAMENT (
    num_dpt  INTEGER PRIMARY KEY,
    nom_dpt  CHAR(30)
);

CREATE TABLE EMPLEAT (
    dni      CHAR(9) PRIMARY KEY,
    nom      CHAR(30),
    sou      INTEGER,
    num_dpt  INTEGER NOT NULL REFERENCES DEPARTAMENT(num_dpt)
);`
    },
    {
        id: '1_1',
        label: '1:1',
        umlSchema: {
            id: 'case_1_1',
            classes: [
                { ...umlAssociacions.classes.find(c => c.id === 'delegacio')!, x: 60, y: 60 },
                { ...umlAssociacions.classes.find(c => c.id === 'ciutat')!, x: 420, y: 60 }
            ],
            associations: [
                umlAssociacions.associations.find(a => a.id === 'ass_delegacio_ciutat')!
            ]
        },
        tables: [
            {
                name: 'CIUTAT',
                columns: [
                    { name: 'nom_ciutat', type: 'CHAR(30)', isPk: true },
                    { name: 'habitants', type: 'INTEGER' }
                ]
            },
            {
                name: 'DELEGACIO',
                columns: [
                    { name: 'codi_del', type: 'INTEGER', isPk: true },
                    { name: 'nom_del', type: 'CHAR(30)' },
                    {
                        name: 'nom_ciutat',
                        type: 'CHAR(30)',
                        isFk: true,
                        isUnique: true,
                        references: 'CIUTAT(nom_ciutat)',
                        highlight: true
                    }
                ]
            }
        ],
        sqlSnippet: `CREATE TABLE CIUTAT (
    nom_ciutat CHAR(30) PRIMARY KEY,
    habitants  INTEGER
);

CREATE TABLE DELEGACIO (
    codi_del   INTEGER PRIMARY KEY,
    nom_del    CHAR(30),
    nom_ciutat CHAR(30) UNIQUE REFERENCES CIUTAT(nom_ciutat)
);`
    },
    {
        id: 'm_n',
        label: 'M:N',
        umlSchema: {
            id: 'case_m_n',
            classes: [
                { ...umlAssociacions.classes.find(c => c.id === 'producte')!, x: 60, y: 60 },
                { ...umlAssociacions.classes.find(c => c.id === 'magatzem')!, x: 420, y: 60 }
            ],
            associations: [
                umlAssociacions.associations.find(a => a.id === 'ass_producte_magatzem')!
            ]
        },
        tables: [
            {
                name: 'PRODUCTE',
                columns: [
                    { name: 'codi_prod', type: 'INTEGER', isPk: true },
                    { name: 'descripcio', type: 'CHAR(50)' }
                ]
            },
            {
                name: 'MAGATZEM',
                columns: [
                    { name: 'codi_mag', type: 'INTEGER', isPk: true },
                    { name: 'ciutat', type: 'CHAR(30)' }
                ]
            },
            {
                name: 'EMMAGATZEMATGE',
                columns: [
                    { name: 'codi_prod', type: 'INTEGER', isPk: true, isFk: true, references: 'PRODUCTE(codi_prod)', highlight: true },
                    { name: 'codi_mag', type: 'INTEGER', isPk: true, isFk: true, references: 'MAGATZEM(codi_mag)', highlight: true }
                ]
            }
        ],
        sqlSnippet: `CREATE TABLE EMMAGATZEMATGE (
    codi_prod INTEGER REFERENCES PRODUCTE(codi_prod),
    codi_mag  INTEGER REFERENCES MAGATZEM(codi_mag),
    PRIMARY KEY (codi_prod, codi_mag)
);`
    },
    {
        id: 'inheritance',
        label: 'Herència',
        umlSchema: umlHerencia,
        tables: [
            {
                name: 'PERSONA',
                columns: [
                    { name: 'dni', type: 'VARCHAR(10)', isPk: true },
                    { name: 'nom', type: 'VARCHAR(50)' }
                ]
            },
            {
                name: 'EMPLEAT',
                columns: [
                    { name: 'dni', type: 'VARCHAR(10)', isPk: true, isFk: true, references: 'PERSONA(dni)', highlight: true },
                    { name: 'sou', type: 'INTEGER' }
                ]
            },
            {
                name: 'ESTUDIANT',
                columns: [
                    { name: 'dni', type: 'VARCHAR(10)', isPk: true, isFk: true, references: 'PERSONA(dni)', highlight: true },
                    { name: 'centre', type: 'VARCHAR(50)' }
                ]
            }
        ],
        sqlSnippet: `CREATE TABLE PERSONA (
    dni VARCHAR(10) PRIMARY KEY,
    nom VARCHAR(50)
);

CREATE TABLE EMPLEAT (
    dni VARCHAR(10) PRIMARY KEY REFERENCES PERSONA(dni),
    sou INTEGER NOT NULL
);

CREATE TABLE ESTUDIANT (
    dni    VARCHAR(10) PRIMARY KEY REFERENCES PERSONA(dni),
    centre VARCHAR(50)
);`
    }
];

export default function UMLToRelationalVisualizer() {
    const [activeCaseId, setActiveCaseId] = useState<'1_n' | '1_1' | 'm_n' | 'inheritance'>('1_n');
    const [rightView, setRightView] = useState<'tables' | 'sql'>('tables');
    const currentCase = TRANSFORM_CASES.find(c => c.id === activeCaseId) || TRANSFORM_CASES[0];

    return (
        <div className="w-full rounded-2xl border border-slate-800/80 bg-[#0d1117] flex flex-col overflow-hidden shadow-2xl my-6 select-none font-sans">
            {/* Capçalera minimalista d'estil Apple / Linear */}
            <div className="h-10 border-b border-slate-800/80 flex items-end px-3 shrink-0 bg-[#0a0d14] overflow-x-auto overflow-y-hidden custom-scrollbar">
                <div className="px-3.5 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex gap-2 items-center shadow-sm relative top-px z-10 bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold whitespace-nowrap shrink-0">
                    <Layers size={13} className="text-emerald-400 shrink-0" />
                    <span>UML &rarr; Relacional</span>
                </div>

                <div className="flex items-center gap-1 ml-2">
                    {TRANSFORM_CASES.map(c => {
                        const isSelected = c.id === activeCaseId;
                        return (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setActiveCaseId(c.id)}
                                className={`px-3 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex items-center transition-colors whitespace-nowrap shrink-0 cursor-pointer relative top-px ${
                                    isSelected
                                        ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold z-10'
                                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                                }`}
                            >
                                {c.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex-1 border-b border-slate-800/80 h-full relative z-0 min-w-5"></div>
            </div>

            {/* Panell Dual: Esquerra UML, Dreta Relacional */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80 bg-[#090d16]">
                {/* 1. UML */}
                <div className="flex flex-col min-h-[380px]">
                    <div className="h-9 border-b border-slate-800/60 bg-[#0a0d14] flex items-center px-3 shrink-0">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-400">
                            <Layers size={12} className="text-emerald-400" />
                            <span>Esquema UML</span>
                        </div>
                    </div>

                    <div className="flex-1 relative min-h-[340px]">
                        <UMLCanvas
                            schema={currentCase.umlSchema}
                            height={340}
                            interactive={true}
                            showHeader={false}
                        />
                    </div>
                </div>

                {/* 2. Model Relacional (Taules o SQL) */}
                <div className="flex flex-col min-h-[380px] bg-[#0d1117]">
                    <div className="h-9 border-b border-slate-800/60 bg-[#0a0d14] flex items-center justify-between px-3 shrink-0">
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setRightView('tables')}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                                    rightView === 'tables'
                                        ? 'bg-slate-800 text-emerald-400 font-bold'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <Database size={12} />
                                <span>Taules</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRightView('sql')}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                                    rightView === 'sql'
                                        ? 'bg-slate-800 text-emerald-400 font-bold'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <Code2 size={12} />
                                <span>SQL</span>
                            </button>
                        </div>
                    </div>

                    {rightView === 'tables' ? (
                        <div className="p-3 flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[340px] custom-scrollbar">
                            {currentCase.tables.map(table => (
                                <div
                                    key={table.name}
                                    className="rounded-lg border border-slate-800 bg-[#090d16] overflow-hidden"
                                >
                                    <div className="px-3 py-1.5 border-b border-slate-800/80 bg-slate-900/60 flex items-center gap-2 font-mono font-bold text-[11px] text-slate-200">
                                        <Database size={11} className="text-sky-400" />
                                        <span>{table.name}</span>
                                    </div>

                                    <div className="divide-y divide-slate-800/40 text-[11px] font-mono">
                                        {table.columns.map(col => (
                                            <div
                                                key={col.name}
                                                className={`px-3 py-1 flex items-center justify-between ${
                                                    col.highlight ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {col.isPk && <Key size={11} className="text-amber-400" />}
                                                    {col.isFk && <Link2 size={11} className="text-sky-400" />}
                                                    <span className={col.isPk ? 'font-bold text-amber-200' : ''}>
                                                        {col.name}
                                                    </span>
                                                    {col.isNotNull && (
                                                        <span className="text-[9px] text-indigo-400">NOT NULL</span>
                                                    )}
                                                    {col.isUnique && (
                                                        <span className="text-[9px] text-purple-400">UNIQUE</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {col.references && (
                                                        <span className="text-[10px] text-sky-400">
                                                            &rarr; {col.references}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-slate-500">
                                                        {col.type}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-3 flex-1 overflow-auto max-h-[290px] custom-scrollbar">
                            <pre className="m-0 text-emerald-300 font-mono text-[11px] leading-relaxed">
                                {currentCase.sqlSnippet}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

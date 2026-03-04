"use client";

import { useState, useMemo, useEffect } from 'react';
import GraphVisualizer from './GraphVisualizer';
import { Maximize, Minimize } from 'lucide-react';

type TreeState = "EMPTY" | "SINGLE" | "COMPLEX" | "LEFT_SUB" | "RIGHT_SUB";

export default function BinTreeVisualizer() {
    const [treeState, setTreeState] = useState<TreeState>("COMPLEX");
    const [lastAction, setLastAction] = useState<string>('Esperant ordres per BinTree<int> t...');
    const [updateKey, setUpdateKey] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };

        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('player-fullscreen');
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('player-fullscreen');
        }

        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('player-fullscreen');
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullscreen]);

    const handleEmptyConstr = () => {
        setTreeState("EMPTY");
        setLastAction("BinTree() -> Arbre buit creat!");
        setUpdateKey(k => k + 1);
    };

    const handleSingleConstr = () => {
        setTreeState("SINGLE");
        setLastAction("BinTree(10) -> Arbre d'un node creat!");
        setUpdateKey(k => k + 1);
    };

    const handleComplexConstr = () => {
        setTreeState("COMPLEX");
        setLastAction("BinTree(10, L, R) -> Arbre de 3 nodes creat!");
        setUpdateKey(k => k + 1);
    };

    const handleCallEmpty = () => {
        const isEmpty = treeState === "EMPTY";
        setLastAction(`t.empty() -> Retorna ${isEmpty ? 'true' : 'false'}`);
    };

    const handleCallValue = () => {
        if (treeState === "EMPTY") {
            setLastAction("t.value() -> ERROR (Segmentation Fault)! L'arbre està empty()");
        } else {
            setLastAction("t.value() -> Retorna 10 (l'Arrel)");
        }
    };

    const handleCallLeft = () => {
        if (treeState === "EMPTY") {
            setLastAction("t.left() -> ERROR! L'arbre està buit.");
        } else if (treeState === "SINGLE") {
            setTreeState("EMPTY");
            setLastAction("t.left() -> Retorna un Subarbre Buit");
            setUpdateKey(k => k + 1);
        } else if (treeState === "COMPLEX") {
            setTreeState("LEFT_SUB");
            setLastAction("t.left() -> Accedim al Subarbre Esquerre sencer");
            setUpdateKey(k => k + 1);
        } else if (treeState === "LEFT_SUB" || treeState === "RIGHT_SUB") {
            setTreeState("EMPTY");
            setLastAction("t.left() -> Retorna un Subarbre Buit");
            setUpdateKey(k => k + 1);
        }
    };

    const handleCallRight = () => {
        if (treeState === "EMPTY") {
            setLastAction("t.right() -> ERROR! L'arbre està buit.");
        } else if (treeState === "SINGLE") {
            setTreeState("EMPTY");
            setLastAction("t.right() -> Retorna un Subarbre Buit");
            setUpdateKey(k => k + 1);
        } else if (treeState === "COMPLEX") {
            setTreeState("RIGHT_SUB");
            setLastAction("t.right() -> Accedim al Subarbre Dret sencer");
            setUpdateKey(k => k + 1);
        } else if (treeState === "LEFT_SUB" || treeState === "RIGHT_SUB") {
            setTreeState("EMPTY");
            setLastAction("t.right() -> Retorna un Subarbre Buit");
            setUpdateKey(k => k + 1);
        }
    };

    // Graph JSON Generator
    const graphData = useMemo(() => {
        const nodes: any[] = [];
        const links: any[] = [];

        if (treeState === "EMPTY") {
            nodes.push({ id: "ghost", label: "Buit (Null)", color: "#1e293b" });
        } else if (treeState === "SINGLE") {
            nodes.push({ id: "1", label: "Val: 10", color: "#10b981" });
        } else if (treeState === "COMPLEX") {
            nodes.push({ id: "1", label: "Val: 10", color: "#10b981" });
            nodes.push({ id: "2", label: "Val: 20", color: "#3b82f6" });
            nodes.push({ id: "3", label: "Val: 30", color: "#3b82f6" });
            links.push({ source: "1", target: "2", label: "left()" });
            links.push({ source: "1", target: "3", label: "right()" });
        } else if (treeState === "LEFT_SUB") {
            // Un subarbre arrel=20
            nodes.push({ id: "2", label: "Val: 20", color: "#10b981" });
        } else if (treeState === "RIGHT_SUB") {
            // Un subarbre arrel=30
            nodes.push({ id: "3", label: "Val: 30", color: "#10b981" });
        }

        return { nodes, links };
    }, [treeState]);

    return (
        <>
            {isFullscreen && <div className="h-[400px] w-full my-16 hidden md:block opacity-0" />}

            <div className={`not-prose font-mono select-none overflow-hidden transition-all duration-300 ease-out origin-center flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-16
                ${isFullscreen
                    ? 'fixed inset-0 z-[99999] h-[100dvh] w-full rounded-none m-0 bg-[#0B0F17] p-8 md:p-16'
                    : 'relative w-full z-10 opacity-100 my-16'
                }`}
            >
                {/* Fullscreen Toggle */}
                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 text-slate-400 hover:text-white bg-[#1a212e]/80 hover:bg-[#232c3d]/90 backdrop-blur-md rounded-lg transition-all border border-white/10 shadow-lg active:scale-95"
                    title={isFullscreen ? "Minimitza (Esc)" : "Pantalla completa"}
                >
                    {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>

                {/* Controls (Constructors i Mètodes) */}
                <div className="flex flex-col gap-6 w-full max-w-[280px] shrink-0">

                    {/* Constructors */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 border-b border-emerald-500/20 pb-2">
                            <h3 className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase">CONSTRUCTORS (CREACIÓ)</h3>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={handleEmptyConstr} className="h-10 text-left px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 text-xs font-bold tracking-wide rounded-lg border border-emerald-500/20 transition-all">
                                BinTree()
                            </button>
                            <button onClick={handleSingleConstr} className="h-10 text-left px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 text-xs font-bold tracking-wide rounded-lg border border-emerald-500/20 transition-all">
                                BinTree(x)
                            </button>
                            <button onClick={handleComplexConstr} className="h-10 text-left px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 text-xs font-bold tracking-wide rounded-lg border border-emerald-500/20 transition-all">
                                BinTree(x, left, right)
                            </button>
                        </div>
                    </div>

                    {/* Consultes */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 border-b border-sky-500/20 pb-2 mt-4">
                            <h3 className="text-sky-400 text-[10px] font-bold tracking-widest uppercase">MÈTODES DE CONSULTA ("LLEGIR")</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={handleCallEmpty} className="h-10 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-bold rounded-lg border border-sky-500/20 transition-all">
                                t.empty()
                            </button>
                            <button onClick={handleCallValue} className="h-10 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-bold rounded-lg border border-sky-500/20 transition-all">
                                t.value()
                            </button>
                            <button onClick={handleCallLeft} className="h-10 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-bold rounded-lg border border-sky-500/20 transition-all">
                                t.left()
                            </button>
                            <button onClick={handleCallRight} className="h-10 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-bold rounded-lg border border-sky-500/20 transition-all">
                                t.right()
                            </button>
                        </div>
                    </div>
                </div>

                {/* Visualitzador del Graf i Missatges Terminal */}
                <div className="flex-1 flex flex-col w-full mt-4 md:mt-0">
                    <div className="min-h-[320px] relative w-full pointer-events-auto flex items-center justify-center">
                        <GraphVisualizer initialData={graphData} updateTrigger={updateKey} height={320} transparentBg={true} autoCenter={true} />
                    </div>

                    {/* Status Box sota el graf (Minimalista, sense fons) */}
                    <div className="w-full mt-4 flex items-center justify-center">
                        <span className={`text-sm tracking-wide ${lastAction.includes('ERROR') ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                            <span className="opacity-50 mr-2">&gt;</span>{lastAction}
                        </span>
                    </div>
                </div>

            </div>
        </>
    );
}

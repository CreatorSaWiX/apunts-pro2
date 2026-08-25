"use client";

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GraphVisualizer from './GraphVisualizer';
import { Maximize, Minimize } from 'lucide-react';

type TreeState = "EMPTY" | "SINGLE" | "COMPLEX" | "LEFT_SUB" | "RIGHT_SUB";

export default function BinTreeVisualizer() {
    const { t } = useTranslation();
    const [treeState, setTreeState] = useState<TreeState>("COMPLEX");
    const [lastActionKey, setLastActionKey] = useState<string>('pro.bintreeviz.waiting');
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
        setLastActionKey("pro.bintreeviz.empty_constr");
        setUpdateKey(k => k + 1);
    };

    const handleSingleConstr = () => {
        setTreeState("SINGLE");
        setLastActionKey("pro.bintreeviz.single_constr");
        setUpdateKey(k => k + 1);
    };

    const handleComplexConstr = () => {
        setTreeState("COMPLEX");
        setLastActionKey("pro.bintreeviz.complex_constr");
        setUpdateKey(k => k + 1);
    };

    const handleCallEmpty = () => {
        const isEmpty = treeState === "EMPTY";
        setLastActionKey(isEmpty ? "pro.bintreeviz.empty_true" : "pro.bintreeviz.empty_false");
    };

    const handleCallValue = () => {
        if (treeState === "EMPTY") {
            setLastActionKey("pro.bintreeviz.value_error");
        } else {
            setLastActionKey("pro.bintreeviz.value_success");
        }
    };

    const handleCallLeft = () => {
        if (treeState === "EMPTY") {
            setLastActionKey("pro.bintreeviz.left_error");
        } else if (treeState === "SINGLE") {
            setTreeState("EMPTY");
            setLastActionKey("pro.bintreeviz.left_empty");
            setUpdateKey(k => k + 1);
        } else if (treeState === "COMPLEX") {
            setTreeState("LEFT_SUB");
            setLastActionKey("pro.bintreeviz.left_sub");
            setUpdateKey(k => k + 1);
        } else if (treeState === "LEFT_SUB" || treeState === "RIGHT_SUB") {
            setTreeState("EMPTY");
            setLastActionKey("pro.bintreeviz.left_empty");
            setUpdateKey(k => k + 1);
        }
    };

    const handleCallRight = () => {
        if (treeState === "EMPTY") {
            setLastActionKey("pro.bintreeviz.right_error");
        } else if (treeState === "SINGLE") {
            setTreeState("EMPTY");
            setLastActionKey("pro.bintreeviz.right_empty");
            setUpdateKey(k => k + 1);
        } else if (treeState === "COMPLEX") {
            setTreeState("RIGHT_SUB");
            setLastActionKey("pro.bintreeviz.right_sub");
            setUpdateKey(k => k + 1);
        } else if (treeState === "LEFT_SUB" || treeState === "RIGHT_SUB") {
            setTreeState("EMPTY");
            setLastActionKey("pro.bintreeviz.right_empty");
            setUpdateKey(k => k + 1);
        }
    };

    interface TreeNodeItem {
        id: string;
        label: string;
        color: string;
    }

    interface TreeLinkItem {
        source: string;
        target: string;
        label?: string;
    }

    // Graph JSON Generator
    const graphData = useMemo(() => {
        const nodes: TreeNodeItem[] = [];
        const links: TreeLinkItem[] = [];
        const nullLabel = t("pro.bintreeviz.node_null", { defaultValue: "NULL" });

        if (treeState === "EMPTY") {
            nodes.push({ id: "null_root", label: nullLabel, color: "#334155" });
        } else if (treeState === "SINGLE") {
            nodes.push({ id: "1", label: t("pro.bintreeviz.node_val", { val: 10, defaultValue: "Val: 10" }), color: "#10b981" });
            nodes.push({ id: "null_1_l", label: nullLabel, color: "#334155" });
            nodes.push({ id: "null_1_r", label: nullLabel, color: "#334155" });
            links.push({ source: "1", target: "null_1_l", label: "left()" });
            links.push({ source: "1", target: "null_1_r", label: "right()" });
        } else if (treeState === "COMPLEX") {
            nodes.push({ id: "1", label: t("pro.bintreeviz.node_val", { val: 10, defaultValue: "Val: 10" }), color: "#10b981" });
            nodes.push({ id: "2", label: t("pro.bintreeviz.node_val", { val: 20, defaultValue: "Val: 20" }), color: "#3b82f6" });
            nodes.push({ id: "3", label: t("pro.bintreeviz.node_val", { val: 30, defaultValue: "Val: 30" }), color: "#3b82f6" });
            
            nodes.push({ id: "null_2_l", label: nullLabel, color: "#334155" });
            nodes.push({ id: "null_2_r", label: nullLabel, color: "#334155" });
            nodes.push({ id: "null_3_l", label: nullLabel, color: "#334155" });
            nodes.push({ id: "null_3_r", label: nullLabel, color: "#334155" });

            links.push({ source: "1", target: "2", label: "left()" });
            links.push({ source: "1", target: "3", label: "right()" });
            links.push({ source: "2", target: "null_2_l" });
            links.push({ source: "2", target: "null_2_r" });
            links.push({ source: "3", target: "null_3_l" });
            links.push({ source: "3", target: "null_3_r" });
        } else if (treeState === "LEFT_SUB") {
            nodes.push({ id: "2", label: t("pro.bintreeviz.node_val", { val: 20, defaultValue: "Val: 20" }), color: "#10b981" });
            nodes.push({ id: "null_2_l", label: nullLabel, color: "#334155" });
            nodes.push({ id: "null_2_r", label: nullLabel, color: "#334155" });
            links.push({ source: "2", target: "null_2_l", label: "left()" });
            links.push({ source: "2", target: "null_2_r", label: "right()" });
        } else if (treeState === "RIGHT_SUB") {
            nodes.push({ id: "3", label: t("pro.bintreeviz.node_val", { val: 30, defaultValue: "Val: 30" }), color: "#10b981" });
            nodes.push({ id: "null_3_l", label: nullLabel, color: "#334155" });
            nodes.push({ id: "null_3_r", label: nullLabel, color: "#334155" });
            links.push({ source: "3", target: "null_3_l", label: "left()" });
            links.push({ source: "3", target: "null_3_r", label: "right()" });
        }

        return { nodes, links };
    }, [treeState, t]);

    const lastActionText = t(lastActionKey);

    return (
        <>
            {isFullscreen && <div className="h-100 w-full my-16 hidden md:block opacity-0" />}

            <div className={`not-prose font-mono select-none overflow-hidden transition duration-300 ease-out origin-center flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-16
                ${isFullscreen
                    ? 'fixed inset-0 z-99999 h-dvh w-full rounded-none m-0 bg-[#0B0F17] p-8 md:p-16'
                    : 'relative w-full z-10 opacity-100 my-16'
                }`}
            >
                {/* Fullscreen Toggle */}
                <button type="button"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 text-slate-400 hover:text-white bg-[#1a212e]/80 hover:bg-[#232c3d]/90 backdrop-blur-md rounded-lg transition border border-white/10 shadow-lg active:scale-95 cursor-pointer"
                    title={isFullscreen ? "Minimitza (Esc)" : "Pantalla completa"}
                >
                    {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>

                {/* Controls (Constructors i Mètodes) */}
                <div className="flex flex-col gap-6 w-full max-w-70 shrink-0">

                    {/* Constructors */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 border-b border-emerald-500/20 pb-2">
                            <h3 className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase">{t("pro.bintreeviz.constructors", { defaultValue: "CONSTRUCTORS (CREACIÓ)" })}</h3>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button type="button" onClick={handleEmptyConstr} className="h-10 text-left px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 text-xs font-bold tracking-wide rounded-lg border border-emerald-500/20 transition cursor-pointer" aria-label="Botó interactiu">
                                BinTree()
                            </button>
                            <button type="button" onClick={handleSingleConstr} className="h-10 text-left px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 text-xs font-bold tracking-wide rounded-lg border border-emerald-500/20 transition cursor-pointer" aria-label="Botó interactiu">
                                BinTree(x)
                            </button>
                            <button type="button" onClick={handleComplexConstr} className="h-10 text-left px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 text-xs font-bold tracking-wide rounded-lg border border-emerald-500/20 transition cursor-pointer" aria-label="Botó interactiu">
                                BinTree(x, left, right)
                            </button>
                        </div>
                    </div>

                    {/* Consultes */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 border-b border-sky-500/20 pb-2 mt-4">
                            <h3 className="text-sky-400 text-[10px] font-bold tracking-widest uppercase">{t("pro.bintreeviz.queries", { defaultValue: "MÈTODES DE CONSULTA (\"LLEGIR\")" })}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={handleCallEmpty} className="h-10 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-bold rounded-lg border border-sky-500/20 transition cursor-pointer" aria-label="Botó interactiu">
                                t.empty()
                            </button>
                            <button type="button" onClick={handleCallValue} className="h-10 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-bold rounded-lg border border-sky-500/20 transition cursor-pointer" aria-label="Botó interactiu">
                                t.value()
                            </button>
                            <button type="button" onClick={handleCallLeft} className="h-10 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-bold rounded-lg border border-sky-500/20 transition cursor-pointer" aria-label="Botó interactiu">
                                t.left()
                            </button>
                            <button type="button" onClick={handleCallRight} className="h-10 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-bold rounded-lg border border-sky-500/20 transition cursor-pointer" aria-label="Botó interactiu">
                                t.right()
                            </button>
                        </div>
                    </div>
                </div>

                {/* Visualitzador del Graf i Missatges Terminal */}
                <div className="flex-1 flex flex-col w-full mt-4 md:mt-0">
                    <div className="min-h-80 relative w-full pointer-events-auto flex items-center justify-center">
                        <GraphVisualizer initialData={graphData} updateTrigger={updateKey} height={320} transparentBg={true} autoCenter={true} />
                    </div>

                    {/* Status Box sota el graf (Minimalista, sense fons) */}
                    <div className="w-full mt-4 flex items-center justify-center">
                        <span className={`text-sm tracking-wide ${lastActionText.includes('ERROR') ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                            <span className="opacity-50 mr-2">&gt;</span>{lastActionText}
                        </span>
                    </div>
                </div>

            </div>
        </>
    );
}

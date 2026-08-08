"use client";

import { useState, useMemo } from 'react';
import GraphVisualizer from './GraphVisualizer';
import { Plus, Minus } from 'lucide-react';

interface GraphNode {
    id: string;
    label: string;
    color?: string;
    overrideVal?: number;
}

interface GraphLink {
    source: string;
    target: string;
    label?: string;
}

export default function ListGraphVisualizer({ initialList = [10, 20, 30] }: { initialList?: number[] }) {
    const [list, setList] = useState<number[]>(initialList);
    const [inputVal, setInputVal] = useState<string>("");
    const [lastAction, setLastAction] = useState<string>("Inici (Llista estàtica generada automàticament pre-estesa)");
    const [updateKey, setUpdateKey] = useState<number>(0);

    const handlePushBack = () => {
        if (list.length >= 8) {
            setLastAction("Avís: Mida màxima de llista assolida (8 elements).");
            return;
        }
        const val = parseInt(inputVal) || Math.floor(Math.random() * 90) + 10;
        setList([...list, val]);
        setLastAction(`L.push_back(${val}) -> afegeix al final`);
        setInputVal("");
        setUpdateKey(k => k + 1);
    };

    const handlePushFront = () => {
        if (list.length >= 8) {
            setLastAction("Avís: Mida màxima de llista assolida (8 elements).");
            return;
        }
        const val = parseInt(inputVal) || Math.floor(Math.random() * 90) + 10;
        setList([val, ...list]);
        setLastAction(`L.push_front(${val}) -> afegeix a l'inici`);
        setInputVal("");
        setUpdateKey(k => k + 1);
    };

    const handlePopFront = () => {
        if (list.length === 0) return;
        const val = list[0];
        setList(list.slice(1));
        setLastAction(`L.pop_front() -> extreu ${val}`);
        setUpdateKey(k => k + 1);
    };

    const handlePopBack = () => {
        if (list.length === 0) return;
        const val = list[list.length - 1];
        setList(list.slice(0, -1));
        setLastAction(`L.pop_back() -> extreu ${val}`);
        setUpdateKey(k => k + 1);
    };

    // Construcció dinàmica del JSON del Graf basat en l'estat actual de 'list'
    const graphData = useMemo(() => {
        const nodes: GraphNode[] = [{ id: "begin", label: "begin()", color: "#10b981" }];
        const links: GraphLink[] = [];

        // Els elements reals de la llista
        list.forEach((val, index) => {
            // Assignem IDs forts usant identificadors únics basats en instància i dada o en index i valor
            // Com que en un Node la memòria és qui fixa, la key real seria referencial. Simplifiquem usant "node_X"
            nodes.push({ id: `node_${index}`, label: `Val: ${val}`, color: "#3b82f6", overrideVal: val });
        });

        nodes.push({ id: "end", label: "end()", color: "#ef4444" });

        // Enllaçar
        if (list.length === 0) {
            links.push({ source: "begin", target: "end" });
        } else {
            links.push({ source: "begin", target: "node_0" });
            for (let i = 0; i < list.length - 1; i++) {
                links.push({ source: `node_${i}`, target: `node_${i + 1}` });
            }
            links.push({ source: `node_${list.length - 1}`, target: "end" });
        }

        return { nodes, links };
    }, [list]);

    return (
        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-12 my-16 font-mono select-none not-prose">

            {/* Visualitzador del Graf incrustat (Amb Physics!) */}
            <div className="flex-1 min-h-87.5 relative w-full max-w-lg pointer-events-auto">
                {/* Passem el trigger perquè el ForceGraph forci el re-càlcul del Layout als links nous */}
                <GraphVisualizer initialData={graphData} updateTrigger={updateKey} height={350} transparentBg={true} autoCenter={true} />
            </div>

            {/* Comandaments de la Llista Enllaçada */}
            <div className="flex flex-col gap-4 w-full max-w-xs mt-8">
                <div className="flex items-center justify-between mb-2 border-b border-slate-800/80 pb-2">
                    <h3 className="text-slate-400 text-xs font-extrabold tracking-widest uppercase">mètodes std::list</h3>
                    <span className="text-[10px] text-slate-500 font-mono">Mida: {list.length}/8</span>
                </div>

                <div className="relative">
                    <input
                        type="number"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="Valor Node (ex: 42)"
                        className="w-full h-11 bg-slate-900/60 border border-slate-700/80 rounded-full px-4 text-center text-sky-200 font-bold focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-500 shadow-inner"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-1">
                    <button type="button"
                        onClick={handlePushFront}
                        disabled={list.length >= 8}
                        className="h-11 bg-emerald-500/15 hover:bg-emerald-500/25 disabled:opacity-40 disabled:hover:bg-emerald-500/15 text-emerald-400 font-bold text-xs tracking-wide rounded-full flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        title="Insereix al principi"
                    >
                        <Plus size={16} /> push_front
                    </button>

                    <button type="button"
                        onClick={handlePushBack}
                        disabled={list.length >= 8}
                        className="h-11 bg-emerald-500/15 hover:bg-emerald-500/25 disabled:opacity-40 disabled:hover:bg-emerald-500/15 text-emerald-400 font-bold text-xs tracking-wide rounded-full flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        title="Insereix al final"
                    >
                        <Plus size={16} /> push_back
                    </button>

                    <button type="button"
                        onClick={handlePopFront}
                        disabled={list.length === 0}
                        className="h-11 bg-rose-500/15 hover:bg-rose-500/25 disabled:opacity-40 disabled:hover:bg-rose-500/15 text-rose-400 font-bold text-xs tracking-wide rounded-full flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                        title="Extreu del principi"
                    >
                        <Minus size={16} /> pop_front
                    </button>

                    <button type="button"
                        onClick={handlePopBack}
                        disabled={list.length === 0}
                        className="h-11 bg-rose-500/15 hover:bg-rose-500/25 disabled:opacity-40 disabled:hover:bg-rose-500/15 text-rose-400 font-bold text-xs tracking-wide rounded-full flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                        title="Extreu del final"
                    >
                        <Minus size={16} /> pop_back
                    </button>
                </div>


                <div className="w-full mt-4 min-h-5 flex items-center justify-center">
                    {lastAction ? (
                        <span className={`text-xs font-bold text-center ${lastAction.startsWith('Error') ? 'text-rose-400' : 'text-slate-300'}`}>
                            {lastAction}
                        </span>
                    ) : (
                        <span className="text-xs text-slate-500 italic">Esperant ordres per la llista...</span>
                    )}
                </div>
            </div>

        </div>
    );
}

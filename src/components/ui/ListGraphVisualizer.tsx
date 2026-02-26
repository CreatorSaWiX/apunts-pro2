"use client";

import { useState, useMemo } from 'react';
import GraphVisualizer from './GraphVisualizer';
import { Plus, Minus } from 'lucide-react';

export default function ListGraphVisualizer() {
    // La nostra memòria virtual de la Llista Enllaçada
    const [list, setList] = useState<number[]>([10, 20, 30]);
    const [inputValue, setInputValue] = useState<string>('40');
    const [lastAction, setLastAction] = useState<string>('');
    const [updateKey, setUpdateKey] = useState(0);

    const handlePushFront = () => {
        if (!inputValue) return;
        const val = parseInt(inputValue, 10);
        if (isNaN(val)) return;
        if (list.length >= 8) {
            setLastAction("Error: Llista massa llarga per visualitzar (Overflow)");
            return;
        }
        setList([val, ...list]);
        setInputValue(Math.floor(Math.random() * 100).toString());
        setLastAction(`L.push_front(${val})`);
        setUpdateKey(k => k + 1);
    };

    const handlePushBack = () => {
        if (!inputValue) return;
        const val = parseInt(inputValue, 10);
        if (isNaN(val)) return;
        if (list.length >= 8) {
            setLastAction("Error: Llista massa llarga per visualitzar (Overflow)");
            return;
        }
        setList([...list, val]);
        setInputValue(Math.floor(Math.random() * 100).toString());
        setLastAction(`L.push_back(${val})`);
        setUpdateKey(k => k + 1);
    };

    const handlePopFront = () => {
        if (list.length === 0) {
            setLastAction("Error: Llista buida");
            return;
        }
        const val = list[0];
        setList(list.slice(1));
        setLastAction(`L.pop_front() -> extreu ${val}`);
        setUpdateKey(k => k + 1);
    };

    const handlePopBack = () => {
        if (list.length === 0) {
            setLastAction("Error: Llista buida");
            return;
        }
        const val = list[list.length - 1];
        setList(list.slice(0, -1));
        setLastAction(`L.pop_back() -> extreu ${val}`);
        setUpdateKey(k => k + 1);
    };

    // Construcció dinàmica del JSON del Graf basat en l'estat actual de 'list'
    const graphData = useMemo(() => {
        const nodes: any[] = [{ id: "begin", label: "begin()", color: "#10b981" }];
        const links: any[] = [];

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
            <div className="flex-1 min-h-[350px] relative w-full max-w-lg pointer-events-auto">
                {/* Passem el trigger perquè el ForceGraph forci el re-càlcul del Layout als links nous */}
                <GraphVisualizer initialData={graphData} updateTrigger={updateKey} height={350} transparentBg={true} autoCenter={true} />
            </div>

            {/* Comandaments de la Llista Enllaçada */}
            <div className="flex flex-col gap-4 w-full max-w-xs mt-8">
                <div className="flex items-center gap-2 mb-2 border-b border-slate-800/80 pb-2">
                    <h3 className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">mètodes std::list</h3>
                </div>

                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Valor Node"
                    className="w-full h-10 bg-slate-900/40 border border-slate-800 rounded-lg px-3 text-center text-sky-200 focus:outline-none focus:border-sky-500/50 transition-colors"
                />

                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                        onClick={handlePushFront}
                        className="h-10 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[10px] tracking-wide rounded-lg flex items-center justify-center gap-1 transition-all active:scale-[0.98] border border-emerald-500/20"
                        title="Insereix al principi"
                    >
                        <Plus size={14} /> p_front
                    </button>

                    <button
                        onClick={handlePushBack}
                        className="h-10 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[10px] tracking-wide rounded-lg flex items-center justify-center gap-1 transition-all active:scale-[0.98] border border-emerald-500/20"
                        title="Insereix al final"
                    >
                        <Plus size={14} /> p_back
                    </button>

                    <button
                        onClick={handlePopFront}
                        className="h-10 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-[10px] tracking-wide rounded-lg flex items-center justify-center gap-1 transition-all active:scale-[0.98] border border-rose-500/20"
                        title="Extreu del principi"
                    >
                        <Minus size={14} /> pop_front
                    </button>

                    <button
                        onClick={handlePopBack}
                        className="h-10 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-[10px] tracking-wide rounded-lg flex items-center justify-center gap-1 transition-all active:scale-[0.98] border border-rose-500/20"
                        title="Extreu del final"
                    >
                        <Minus size={14} /> pop_back
                    </button>
                </div>


                <div className="w-full mt-4 h-4 flex items-center justify-center">
                    {lastAction ? (
                        <span className={`text-[11px] font-bold ${lastAction.startsWith('Error') ? 'text-rose-400/80' : 'text-slate-500'}`}>
                            {lastAction}
                        </span>
                    ) : (
                        <span className="text-[11px] text-slate-800/80">Esperant ordres per la llista...</span>
                    )}
                </div>
            </div>

        </div>
    );
}

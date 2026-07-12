import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisReglesOrBase = () => {
    const [k, setK] = React.useState(2);
    const [vectors, setVectors] = React.useState<[number, number][]>([
        [1.5, 0.5],
        [0.5, 1.5],
        [1, 1],
    ]);

    const handleMove = (index: number, newPos: [number, number]) => {
        const next = [...vectors];
        next[index] = newPos;
        setVectors(next);
    };

    const activeVectors = vectors.slice(0, k);

    // Simple 2D Rank calculation
    // If only 1 vector, rank is 1 (unless 0). If 2+, check determinant
    let rank = 0;
    if (k >= 1) {
        const v1 = activeVectors[0];
        if (Math.abs(v1[0]) > 0.01 || Math.abs(v1[1]) > 0.01) rank = 1;
    }
    if (k >= 2) {
        const v1 = activeVectors[0];
        const v2 = activeVectors[1];
        const det = Math.abs(v1[0] * v2[1] - v1[1] * v2[0]);
        if (det > 0.1) rank = 2;
    }
    // With 3 vectors in R2, rank can still be at most 2
    if (k >= 3 && rank < 2) {
        // ... (simplified rank check)
    }

    const isLI = rank === k;
    const isBase = rank === 2 && k === 2;
    const canGenerate = rank === 2;

    return (
        <div className="w-full flex flex-col bg-slate-950">
            <div className="p-2 flex justify-between items-center bg-slate-900/60 border-b border-white/5 px-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dimensió de l'espai: <InlineMath math={"n=2"} /></span>
                <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Vectors (k):</span>
                    <input type="range" min="1" max="3" step="1" value={k} onChange={(e) => setK(parseInt(e.target.value))} className="w-24 accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                    <span className="text-[10px] font-black text-white w-4 text-center">{k}</span>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
                <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false}>
                    <Coordinates.Cartesian />

                    {activeVectors.map((v, i) => (
                        <React.Fragment key={i}>
                            <MovablePoint point={v} onMove={(p) => handleMove(i, p)} color={i === 0 ? Theme.blue : (i === 1 ? Theme.red : Theme.green)} />
                            <Vector tail={[0, 0]} tip={v} color={i === 0 ? Theme.blue : (i === 1 ? Theme.red : Theme.green)} />
                            <LaTeX at={v} tex={`u_${i + 1}`} color={i === 0 ? Theme.blue : (i === 1 ? Theme.red : Theme.green)} />
                        </React.Fragment>
                    ))}
                </Mafs>

                <div className="absolute top-4 right-4 w-60 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-2xl z-20">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-white/5 pb-2">Diagnòstic del Conjunt</h4>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-black/20 p-2 rounded text-center">
                                <div className="text-[8px] text-slate-500 mb-1 uppercase font-bold">Vectors</div>
                                <div className="text-sm font-black text-white">{k}</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded text-center border border-white/5">
                                <div className="text-[8px] text-slate-500 mb-1 uppercase font-bold">Rang</div>
                                <div className={`text-sm font-black ${rank === 2 ? 'text-indigo-400' : 'text-amber-400'}`}>{rank}</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full flex items-center justify-center text-[7px] font-bold ${isLI ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    {isLI ? "✓" : "✗"}
                                </div>
                                <span className="text-[9px] text-slate-300 font-medium">Linealment Independent (LI)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full flex items-center justify-center text-[7px] font-bold ${canGenerate ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    {canGenerate ? "✓" : "✗"}
                                </div>
                                <span className="text-[9px] text-slate-300 font-medium">Generador de <InlineMath math={"\\mathbb{R}^2"} /></span>
                            </div>
                            {k === 2 && (
                                <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                                    <div className={`w-3 h-3 rounded-full flex items-center justify-center text-[7px] font-bold ${isBase ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/20 text-slate-500'}`}>
                                        {isBase ? "✓" : "✗"}
                                    </div>
                                    <span className={`text-[9px] font-bold ${isBase ? 'text-indigo-400' : 'text-slate-500'}`}>És una BASE</span>
                                </div>
                            )}
                        </div>

                        <div className="text-[9px] text-slate-500 leading-relaxed italic p-2 bg-black/10 rounded-lg">
                            {k === 3 && <p><span className="text-white font-bold underline">Regla 1 (k &gt; n):</span> En haver-hi més vectors que dimensions, el conjunt és SEMPRE dependent (LD).</p>}
                            {k === 1 && <p><span className="text-white font-bold underline">Regla 2 (k &lt; n):</span> Amb un sol vector no podem generar tot el pla. Falten vectors.</p>}
                            {k === 2 && isBase && <p><span className="text-white font-bold underline">Regla 3 (k = n):</span> Com que hi ha 2 vectors i són LI, formen automàticament una base.</p>}
                            {k === 2 && !isBase && <p><span className="text-white font-bold underline">Observació:</span> Tot i tenir k=n vectors, com que són col·lineals (LD), no poden ser base.</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-3 bg-slate-900 border-t border-white/5 text-[10px] text-center text-slate-500">
                <span className="text-white font-bold tracking-tight uppercase">Base Explorer:</span> Canvia <span className="text-white italic">k</span> per veure com afecten les regles d'examen.
            </div>
        </div>
    );
};


export default VisReglesOrBase;

import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisAntiimatgeSubespais = () => {
    const [w, setW] = React.useState<[number, number]>([2, 1]);
    
    // Aplicació: f(x,y) = (x+y, 0.5(x+y))
    // Imatge: recta y = 0.5x, Nucli: recta y = -x
    const t = (w[0] + 0.5 * w[1]) / (1 + 0.25);
    const wProj: [number, number] = [t, 0.5 * t];
    const distToIm = Math.sqrt(Math.pow(w[0] - wProj[0], 2) + Math.pow(w[1] - wProj[1], 2));
    const isCompatible = distToIm < 0.2; // Slightly more tolerant for better UX

    const snapToImage = () => setW(wProj);

    // Una solució particular: x+y = t -> x=t, y=0
    const v0: [number, number] = [t, 0];

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-hidden border border-white/5 rounded-2xl shadow-2xl">
            {/* Header / Legend */}
            <div className="p-6 bg-slate-900/80 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Laboratori d'Antiimatges</span>
                    <p className="text-[11px] text-slate-400 italic leading-tight">Explora com subespais enters van a parar a un sol punt.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Nucli</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Imatge</span>
                    </div>
                    {!isCompatible && (
                        <button type="button" 
                            onClick={snapToImage}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                        >
                            Ajustar a la Imatge
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                {/* DOMINI */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-900/20 overflow-hidden min-h-[350px]">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Domini (E)</span>
                        {isCompatible ? (
                            <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] text-emerald-400 font-bold">
                                {"f⁻¹(w) = v₀ + Ker(f)"}
                            </div>
                        ) : (
                            <div className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded text-[9px] text-rose-400 font-bold">
                                Antiimatge buida (∅)
                            </div>
                        )}
                    </div>

                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        
                        {/* El Nucli Ker(f) */}
                        <Plot.OfX y={(x: number) => -x} color={Theme.red} opacity={0.2} weight={1} />
                        
                        {isCompatible && (
                            <>
                                {/* L'Antiimatge: Recta paral·lela al nucli passant per v0 */}
                                <Plot.OfX y={(x: number) => -x + (v0[0] + v0[1])} color={Theme.green} weight={4} />
                                <LaTeX at={[v0[0], v0[1] + 0.4]} tex="f^{-1}(\vec{w})" color={Theme.green} />
                            </>
                        )}
                    </Mafs>

                    {!isCompatible && (
                        <div className="absolute inset-0 flex items-center justify-center bg-rose-950/20 backdrop-blur-[1px] pointer-events-none z-10">
                            <span className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em] px-6 py-2 bg-black/40 rounded-full border border-rose-500/30">Incompatible</span>
                        </div>
                    )}
                </div>

                {/* CODOMINI */}
                <div className="relative bg-slate-900/10 overflow-hidden min-h-[350px]">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Codomini (F)</span>
                        <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] text-blue-400 font-bold">
                            Im(f): y = 0.5x
                        </div>
                    </div>

                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        
                        {/* La Imatge Im(f) */}
                        <Plot.OfX y={(x: number) => 0.5 * x} color={Theme.blue} opacity={0.4} weight={2} />
                        
                        {/* Projecció si és incompatible */}
                        {!isCompatible && (
                            <>
                                <Vector tail={wProj} tip={w} color="white" weight={1} opacity={0.3} />
                                <Circle center={wProj} radius={0.08} color={Theme.blue} />
                            </>
                        )}

                        {/* El vector w que volem assolir */}
                        <MovablePoint point={w} onMove={setW} color={isCompatible ? Theme.green : Theme.red} />
                        <Vector tail={[0, 0]} tip={w} color={isCompatible ? Theme.green : Theme.red} weight={4} />
                        <LaTeX at={w} tex="\vec{w}" color={isCompatible ? Theme.green : Theme.red} />

                        {!isCompatible && (
                            <LaTeX at={[w[0], w[1] - 0.7]} tex="\vec{w} \notin \text{Im}(f)" color={Theme.red} />
                        )}
                    </Mafs>
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/5">
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    <strong className="text-white">Interactua:</strong> Mou el vector <span className="text-emerald-400 font-bold">w</span>. Si cau dins la recta blava (Imatge), l'aplicació té solució i a l'esquerra veuràs tota la <span className="text-emerald-400 font-bold">recta d'antiimatges</span> que van a parar a ell.
                </p>
            </div>
        </div>
    );
};


export default VisAntiimatgeSubespais;

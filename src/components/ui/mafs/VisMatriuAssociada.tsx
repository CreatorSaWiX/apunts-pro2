import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisMatriuAssociada = () => {
    const [m11, setM11] = React.useState(1);
    const [m12, setM12] = React.useState(0.5);
    const [m21, setM21] = React.useState(0.5);
    const [m22, setM22] = React.useState(1);
    const [v, setV] = React.useState<[number, number]>([1, 1]);

    const transform = (p: [number, number]): [number, number] => [
        m11 * p[0] + m12 * p[1],
        m21 * p[0] + m22 * p[1]
    ];

    const e1: [number, number] = [1, 0];
    const e2: [number, number] = [0, 1];
    const fe1 = transform(e1);
    const fe2 = transform(e2);
    const fv = transform(v);

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-hidden border border-white/5 rounded-2xl shadow-2xl">
            {/* Matrix Input Panel - More compact */}
            <div className="px-6 py-4 bg-slate-900/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-8">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Columna 1: f(e₁)</span>
                            <div className="flex gap-2">
                                <input type="range" min="-2" max="2" step="0.1" value={m11} onChange={(e) => setM11(parseFloat(e.target.value))} className="w-16 accent-blue-500" />
                                <input type="range" min="-2" max="2" step="0.1" value={m21} onChange={(e) => setM21(parseFloat(e.target.value))} className="w-16 accent-blue-500" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Columna 2: f(e₂)</span>
                            <div className="flex gap-2">
                                <input type="range" min="-2" max="2" step="0.1" value={m12} onChange={(e) => setM12(parseFloat(e.target.value))} className="w-16 accent-rose-500" />
                                <input type="range" min="-2" max="2" step="0.1" value={m22} onChange={(e) => setM22(parseFloat(e.target.value))} className="w-16 accent-rose-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative p-4 bg-black/40 rounded-xl border border-white/5 shadow-xl flex items-center gap-4">
                    <div className="text-xl text-slate-500 font-serif italic">M =</div>
                    <div className="relative px-5 py-2 flex flex-col gap-2 font-mono text-lg">
                        <div className="absolute left-0 top-0 bottom-0 w-2 border-l-2 border-t-2 border-b-2 border-white/20 rounded-l-lg" />
                        <div className="absolute right-0 top-0 bottom-0 w-2 border-r-2 border-t-2 border-b-2 border-white/20 rounded-r-lg" />
                        <div className="flex gap-8">
                            <span className="w-8 text-center text-blue-400 font-bold">{m11.toFixed(1)}</span>
                            <span className="w-8 text-center text-rose-400 font-bold">{m12.toFixed(1)}</span>
                        </div>
                        <div className="flex gap-8">
                            <span className="w-8 text-center text-blue-400 font-bold">{m21.toFixed(1)}</span>
                            <span className="w-8 text-center text-rose-400 font-bold">{m22.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
                {/* DOMINI */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-900/20">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Domini (E)</span>
                        <div className="flex items-center gap-2">
                            <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] text-emerald-400 font-black uppercase">Intervenció lliure</div>
                        </div>
                    </div>

                    <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        
                        <Polygon points={[[0, 0], [1, 0], [1, 1], [0, 1]]} color="white" fillOpacity={0.03} weight={1} />

                        <Vector tail={[0, 0]} tip={e1} color={Theme.blue} weight={2} opacity={0.5} />
                        <Vector tail={[0, 0]} tip={e2} color={Theme.red} weight={2} opacity={0.5} />
                        
                        <Vector tail={[0, 0]} tip={v} color={Theme.green} weight={4} />
                        <MovablePoint point={v} onMove={setV} color={Theme.green} />
                        
                        <LaTeX at={e1} tex="\vec{e}_1" color={Theme.blue} />
                        <LaTeX at={e2} tex="\vec{e}_2" color={Theme.red} />
                        <LaTeX at={v} tex="\vec{v}" color={Theme.green} />
                    </Mafs>
                </div>

                {/* IMATGE */}
                <div className="relative bg-slate-900/10">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Imatge (f(E))</span>
                        <span className="text-[10px] text-indigo-400 font-bold uppercase">L'espai transformat</span>
                    </div>

                    <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        
                        <Polygon 
                            points={[[0, 0], fe1, [fe1[0] + fe2[0], fe1[1] + fe2[1]], fe2]}
                            color={Theme.indigo}
                            fillOpacity={0.1}
                            weight={1}
                        />

                        <Vector tail={[0, 0]} tip={fe1} color={Theme.blue} weight={3} />
                        <Vector tail={[0, 0]} tip={fe2} color={Theme.red} weight={3} />
                        <Vector tail={[0, 0]} tip={fv} color={Theme.green} weight={4} />

                        <LaTeX at={fe1} tex="f(\vec{e}_1)" color={Theme.blue} />
                        <LaTeX at={fe2} tex="f(\vec{e}_2)" color={Theme.red} />
                        <LaTeX at={fv} tex="f(\vec{v})" color={Theme.green} />
                    </Mafs>
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/5">
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    <strong className="text-white">Interactua:</strong> Mou el vector <span className="text-emerald-400 font-bold">verd</span> a l'esquerra per veure com la seva imatge es mou a la dreta segons la matriu <strong className="text-white">M</strong>. 
                    Fixa't com {"$f(\\vec{e}_1)$"} i {"$f(\\vec{e}_2)$"} (columnes de $M$) defineixen tota la quadrícula.
                </p>
            </div>
        </div>
    );
};

export default VisMatriuAssociada;

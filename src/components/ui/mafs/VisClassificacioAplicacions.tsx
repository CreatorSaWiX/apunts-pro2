import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisClassificacioAplicacions = () => {
    const [mode, setMode] = React.useState<'injective' | 'singular'>('injective');
    const [[e1x, e1y], setE1] = React.useState<[number, number]>([1, 0]);
    const [[e2x, e2y], setE2] = React.useState<[number, number]>([0, 1]);
    
    // Matrius predefinides però basades en la base mòbil si calgués.
    // Per simplicitat pedagògica, usem transformacions fixes que representen el concepte:
    const matrices = {
        'injective': [1, 0.4, -0.2, 0.8],
        'singular': [1, 1, 0.5, 0.5]
    };

    const m = matrices[mode];
    const f = (x: number, y: number): [number, number] => [m[0]*x + m[1]*y, m[2]*x + m[3]*y];

    const fe1 = f(e1x, e1y);
    const fe2 = f(e2x, e2y);

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-hidden border border-white/5 rounded-2xl shadow-2xl">
            <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                    <button type="button" 
                        onClick={() => setMode('injective')} 
                        className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${mode === 'injective' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Bijectiva
                    </button>
                    <button type="button" 
                        onClick={() => setMode('singular')} 
                        className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${mode === 'singular' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        No Injectiva
                    </button>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] transition-all duration-500 ${mode === 'injective' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        {mode === 'injective' ? "Isomorfisme: Det ≠ 0" : "Singular: Det = 0"}
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-900/20 min-h-[300px]">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Domini (Sortida)</span>
                        <span className="text-[10px] text-slate-300 font-bold uppercase italic">Espai Integre</span>
                    </div>

                    <Mafs viewBox={{ x: [-2.5, 2.5], y: [-2.5, 2.5] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Circle center={[0, 0]} radius={1} color={Theme.blue} fillOpacity={0.05} weight={1} />
                        
                        <Vector tail={[0, 0]} tip={[e1x, e1y]} color={Theme.blue} weight={3} />
                        <Vector tail={[0, 0]} tip={[e2x, e2y]} color={Theme.red} weight={3} />
                        
                        <MovablePoint point={[e1x, e1y]} onMove={setE1} color={Theme.blue} />
                        <MovablePoint point={[e2x, e2y]} onMove={setE2} color={Theme.red} />
                        
                        <LaTeX at={[e1x, e1y]} tex="\vec{e}_1" color={Theme.blue} />
                        <LaTeX at={[e2x, e2y]} tex="\vec{e}_2" color={Theme.red} />
                    </Mafs>
                </div>

                <div className="relative bg-slate-900/10 min-h-[300px]">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Codomini (Arribada)</span>
                        <span className={`text-[10px] font-bold uppercase ${mode === 'singular' ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {mode === 'singular' ? 'Col·lapse de Dimensió' : 'Deformació Conservativa'}
                        </span>
                    </div>

                    <Mafs viewBox={{ x: [-2.5, 2.5], y: [-2.5, 2.5] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        
                        {/* Circle transformed */}
                        <Plot.Parametric
                            t={[0, 2 * Math.PI]}
                            xy={(t: number) => f(Math.cos(t), Math.sin(t))}
                            color={mode === 'singular' ? Theme.red : Theme.green}
                            weight={mode === 'singular' ? 4 : 2}
                        />

                        <Vector tail={[0, 0]} tip={fe1} color={Theme.blue} weight={3} opacity={0.8} />
                        <Vector tail={[0, 0]} tip={fe2} color={Theme.red} weight={3} opacity={0.8} />
                        
                        <LaTeX at={fe1} tex="f(\vec{e}_1)" color={Theme.blue} />
                        <LaTeX at={fe2} tex="f(\vec{e}_2)" color={Theme.red} />
                    </Mafs>

                    {mode === 'singular' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
                            <div className="bg-rose-500/20 border border-rose-500/40 px-6 py-2 rounded-full shadow-2xl flex flex-col items-center">
                                <span className="text-[12px] font-black text-rose-100 uppercase tracking-[0.3em]">Rang 1</span>
                                <span className="text-[8px] text-rose-400/80 font-mono">Injectivitat perduda</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/5">
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    <strong className="text-white">Interactua:</strong> Mou <span className="text-blue-400 font-bold">e₁</span> i <span className="text-red-400 font-bold">e₂</span>. 
                    En mode <span className="text-indigo-400 font-bold">Bijectiu</span>, el cercle es deforma en una el·lipse però manté l'àrea i la dimensió. 
                    En mode <span className="text-rose-400 font-bold">Singular</span>, tot el domini es col·lapsa en una sola línia: el cercle "mor" i es torna un segment.
                </p>
            </div>
        </div>
    );
};


export default VisClassificacioAplicacions;

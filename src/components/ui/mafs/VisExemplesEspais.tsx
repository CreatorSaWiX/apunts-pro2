import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisExemplesEspais = () => {
    const [view, setView] = React.useState<'polys' | 'matrius' | 'trivial' | 'propietats'>('polys');
    const [scalar, setScalar] = React.useState(1.5);
    const [scalarProp, setScalarProp] = React.useState(0);
    const [vProp, setVProp] = React.useState<[number, number]>([2, 1]);

    // Polynomials: P(x) = x^2, Q(x) = x + 1
    const p = (x: number) => 0.5 * x * x;
    const q = (x: number) => x + 1;
    const sum = (x: number) => p(x) + q(x);

    // Matrices
    const m = [[1, -2], [0, 3]];

    return (
        <div className="w-full flex flex-col">
            <div className="p-2 flex flex-wrap justify-center gap-1.5 bg-slate-900/60 border-b border-white/5">
                <button type="button" onClick={() => setView('polys')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${view === 'polys' ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(5,150,105,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>Polinomis</button>
                <button type="button" onClick={() => setView('matrius')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${view === 'matrius' ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(5,150,105,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>Matrius</button>
                <button type="button" onClick={() => setView('trivial')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${view === 'trivial' ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(5,150,105,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>Espai Trivial</button>
                <button type="button" onClick={() => setView('propietats')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${view === 'propietats' ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>Propietats</button>
            </div>

            <div className="relative flex-1 overflow-hidden bg-slate-950/40">
                {view === 'polys' && (
                    <div className="flex-1 h-full">
                        <Mafs viewBox={{ x: [-3, 3], y: [-2, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                            <Coordinates.Cartesian />
                            <Plot.OfX y={p} color={Theme.blue} />
                            <Plot.OfX y={q} color={Theme.red} />
                            <Plot.OfX y={sum} color={Theme.yellow} weight={3} />
                            <LaTeX at={[-2, p(-2)]} tex="P(x)" color={Theme.blue} />
                            <LaTeX at={[2, q(2)]} tex="Q(x)" color={Theme.red} />
                            <LaTeX at={[1, sum(1) + 0.5]} tex="(P+Q)(x)" color={Theme.yellow} />
                        </Mafs>
                    </div>
                )}

                {view === 'matrius' && (
                    <div className="h-full flex flex-col items-center justify-center gap-6 p-8">
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Matriu <InlineMath math="A" /></span>
                                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-900 rounded-lg border border-white/5 font-mono text-sm">
                                    {m.flat().map((v, i) => <div key={i} className="w-10 h-10 flex items-center justify-center bg-black/40 rounded border border-white/5 text-blue-400">{v}</div>)}
                                </div>
                            </div>
                            <div className="text-2xl text-slate-600 font-black">× {scalar.toFixed(1)} =</div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">λ · A</span>
                                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-900 rounded-lg border border-emerald-500/30 font-mono text-sm">
                                    {m.flat().map((v, i) => <div key={i} className="w-10 h-10 flex items-center justify-center bg-emerald-950/40 rounded border border-emerald-500/10 text-emerald-400">{(v * scalar).toFixed(1)}</div>)}
                                </div>
                            </div>
                        </div>
                        <div className="w-64 flex flex-col gap-2">
                            <input type="range" min="-2" max="2" step="0.1" value={scalar} onChange={(e) => setScalar(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                            <div className="flex justify-between text-[8px] text-slate-600 font-bold uppercase"><span>Min (-2)</span><span>Escalar λ</span><span>Max (2)</span></div>
                        </div>
                    </div>
                )}

                {view === 'trivial' && (
                    <div className="flex-1 h-full">
                        <Mafs viewBox={{ x: [-2, 2], y: [-2, 2] }} pan={false} preserveAspectRatio={false}>
                            <Coordinates.Cartesian />
                            <Circle center={[0, 0]} radius={0.15} color={Theme.yellow} fillOpacity={1} />
                            <LaTeX at={[0, 0.5]} tex="E = \\{0_E\\}" color={Theme.yellow} />
                            <LaTeX at={[0, -0.7]} tex="0+0=0, \\, \\lambda \\cdot 0 = 0" color="gray" />
                        </Mafs>
                    </div>
                )}

                {view === 'propietats' && (
                    <div className="relative h-full flex flex-col">
                        <div className="flex-1">
                            <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} preserveAspectRatio={false}>
                                <Coordinates.Cartesian />
                                <MovablePoint point={vProp} onMove={setVProp} color={Theme.blue} />
                                <Vector tail={[0, 0]} tip={vProp} color={Theme.blue} />
                                <Vector tail={[0, 0]} tip={[scalarProp * vProp[0], scalarProp * vProp[1]]} color={Theme.yellow} weight={3} />
                                <LaTeX at={vProp} tex="v" color={Theme.blue} />
                                {scalarProp === 0 && <Circle center={[0, 0]} radius={0.15} color={Theme.yellow} fillOpacity={1} />}
                                <LaTeX at={[scalarProp * vProp[0], scalarProp * vProp[1]]} tex="\\lambda v" color={Theme.yellow} />
                            </Mafs>
                        </div>
                        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/5 shadow-2xl z-20 w-48">
                            <div className="flex flex-col gap-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Escalar <InlineMath math="\\lambda" /></span>
                                        <span className="text-xs font-mono text-indigo-400">{scalarProp.toFixed(1)}</span>
                                    </div>
                                    <input
                                        type="range" min="-2" max="2" step="1"
                                        value={scalarProp}
                                        onChange={(e) => setScalarProp(parseInt(e.target.value))}
                                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <div className="flex justify-between text-[7px] text-slate-600 font-bold">
                                        <button type="button" onClick={() => setScalarProp(-1)} className="hover:text-white transition-colors">-1</button>
                                        <button type="button" onClick={() => setScalarProp(0)} className="hover:text-white transition-colors">0</button>
                                        <button type="button" onClick={() => setScalarProp(1)} className="hover:text-white transition-colors">1</button>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-white/5 space-y-1.5">
                                    <p className={`text-[9px] transition-all ${scalarProp === 0 ? 'text-yellow-400 font-bold' : 'text-slate-500'}`}>
                                        {scalarProp === 0 ? <span>✓ <InlineMath math="0 \cdot v = 0_E" /></span> : <InlineMath math="0 \cdot v = 0_E" />}
                                    </p>
                                    <p className={`text-[9px] transition-all ${scalarProp === -1 ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
                                        {scalarProp === -1 ? <span>✓ <InlineMath math="(-1)v = -v" /></span> : <InlineMath math="(-1)v = -v" />}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 bg-slate-800/80 border-t border-white/5 text-[10px] text-center text-slate-500 italic">
                {view === 'polys' && <span>Suma de funcions: Es defineix punt a punt.</span>}
                {view === 'matrius' && <span>Escalar una matriu: Es multiplica cada component per <InlineMath math="\\lambda" />.</span>}
                {view === 'trivial' && <span>Espai Trivial: El conjunt format només pel zero.</span>}
                {view === 'propietats' && <span>Propietats: Observa com varien el producte quan <InlineMath math="\\lambda" /> és 0 o -1.</span>}
            </div>
        </div>
    );
};


export default VisExemplesEspais;

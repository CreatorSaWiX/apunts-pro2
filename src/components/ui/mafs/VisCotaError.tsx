import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisCotaError = () => {
    const [n, setN] = React.useState(4);
    const [mode, setMode] = React.useState<'low' | 'high'>('low');

    const a = 0; const b = 3;
    const f = mode === 'low' ? (x: number) => 0.1 * x * x + 1 : (x: number) => 3 / (x + 1.2);

    // Theoretical M2 and M4 values
    const M2 = mode === 'low' ? 0.2 : 6 / Math.pow(1.2, 3);
    const M4 = mode === 'low' ? 0.0001 : 72 / Math.pow(1.2, 5);

    // Calculated bounds
    const cotaT = (Math.pow(b - a, 3) * M2) / (12 * n * n);
    const cotaS = (Math.pow(b - a, 5) * M4) / (180 * Math.pow(n % 2 === 0 ? n : n + 1, 4));

    return (
        <div className="w-full flex flex-col">
            {/* 1. Curvature Mode Selection */}
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-center gap-3">
                <button type="button"
                    onClick={() => setMode('low')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'low' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-700 text-slate-400'}`}
                >
                    Baixa Curvatura
                </button>
                <button type="button"
                    onClick={() => setMode('high')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'high' ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-700 text-slate-400'}`}
                >
                    Alta Curvatura
                </button>
            </div>

            {/* 2. Visual Comparison Graph */}
            <div className="h-80 relative">
                <Mafs viewBox={{ x: [-0.5, 3.5], y: [-0.5, 4] }} pan={false} preserveAspectRatio={false}>
                    <Coordinates.Cartesian />

                    {/* Trapezoids visualization (Yellow) */}
                    {Array.from({ length: n }).map((_, i) => {
                        const dx = (b - a) / n;
                        const x0 = a + i * dx;
                        const x1 = a + (i + 1) * dx;
                        return <Polygon key={`t-${i}`} points={[[x0, 0], [x1, 0], [x1, f(x1)], [x0, f(x0)]]} color={Theme.yellow} fillOpacity={0.1} weight={1} />;
                    })}

                    {/* Simpson visualization (Green dots) */}
                    {Array.from({ length: n % 2 === 0 ? n : n + 1 }).map((_, i) => {
                        const sn = n % 2 === 0 ? n : n + 1;
                        const sdx = (b - a) / sn;
                        return <Circle key={`s-${i}`} center={[a + i * sdx, f(a + i * sdx)]} radius={0.05} color={Theme.green} fillOpacity={1} />;
                    })}

                    <Plot.OfX y={f} color={Theme.blue} weight={3} />
                    <LaTeX at={[1.5, f(1.5) + 0.4]} tex="f(x)" color={Theme.blue} />
                </Mafs>
                <div className="absolute top-4 right-4 flex flex-col gap-2 bg-black/60 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-yellow-500">
                        <div className="w-3 h-3 bg-yellow-500/20 border border-yellow-500 rounded" />
                        <span>TRAPEZIS: <InlineMath math="O(n^{-2})" /></span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-green-500">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span>SIMPSON: <InlineMath math="O(n^{-4})" /></span>
                    </div>
                </div>
            </div>

            {/* 3. Controls & Dashboard */}
            <div className="p-6 bg-slate-800/80 border-t border-white/10">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre d'intervals (n)</span>
                        <span className="bg-indigo-500 text-white font-mono px-3 py-1 rounded-lg text-lg font-bold shadow-lg shadow-indigo-500/20">{n}</span>
                    </div>
                    <input
                        type="range" min="2" max="30" step="1" value={n}
                        onChange={(e) => setN(parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/20 p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <InlineMath math="E_T" />
                        </div>
                        <div className="text-[10px] font-black text-yellow-500 uppercase mb-3">Cota Error Trapezis</div>
                        <div className="text-3xl font-mono text-white mb-2 tabular-nums">
                            {cotaT.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <span>Fórmula:</span>
                            <InlineMath math={"\\frac{(b-a)^3 M_2}{12 n^2}"} />
                        </div>
                    </div>

                    <div className="bg-black/20 p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <InlineMath math="E_S" />
                        </div>
                        <div className="text-[10px] font-black text-green-500 uppercase mb-3">Cota Error Simpson</div>
                        <div className="text-3xl font-mono text-white mb-2 tabular-nums">
                            {cotaS.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <span>Fórmula:</span>
                            <InlineMath math={"\\frac{(b-a)^5 M_4}{180 n^4}"} />
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 text-center">
                    <p className="text-xs text-indigo-300">
                        Per a <InlineMath math={"n = " + n} />, el mètode de Simpson és aproximadament
                        <span className="text-white font-bold mx-1">{(cotaT / cotaS).toFixed(0)} cops</span>
                        més precís que el dels trapezis.
                    </p>
                </div>
            </div>
        </div>
    );
};


export default VisCotaError;

import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisParitatIntegrals = () => {
    const [mode, setMode] = React.useState<'even' | 'odd'>('even');

    const f = mode === 'even' ? (t: number) => Math.cos(t) : (t: number) => Math.sin(t);
    const F = mode === 'even' ? (t: number) => Math.sin(t) : (t: number) => -Math.cos(t) + 1; // Integral de sin(t) des de 0 \u00e9s 1 - cos(t)

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 flex gap-4 bg-slate-800/50 border-b border-white/10 justify-center">
                <button type="button" onClick={() => setMode('even')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'even' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>f(x) Parella</button>
                <button type="button" onClick={() => setMode('odd')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'odd' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>f(x) Imparella</button>
            </div>
            <Mafs viewBox={{ x: [-4, 4], y: [-2, 2] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.orange} weight={3} opacity={0.5} />
                <Plot.OfX y={F} color={Theme.blue} weight={4} />

                <LaTeX at={[1, f(1) + 0.3]} tex="f(x)" color={Theme.orange} />
                <LaTeX at={[1, F(1) + 0.3]} tex="F(x) = \int_0^x f" color={Theme.blue} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-xs text-slate-300">
                {mode === 'even'
                    ? <p>Si <span className="text-orange-400 font-bold">f(x)</span> és **parella** (simètrica eix Y), la funció àrea **F(x)** és **imparella** (simètrica origen).</p>
                    : <p>Si <span className="text-orange-400 font-bold">f(x)</span> és **imparella**, la funció àrea **F(x)** és **parella**.</p>
                }
            </div>
        </div>
    );
};


export default VisParitatIntegrals;

import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisTaylorComportament = () => {
    const [n, setN] = React.useState(2);
    const f = (x: number) => Math.cos(x);

    const p_even = (x: number) => 1 - 0.5 * x * x; // Grau 2 (M\u00e0xim)
    const p_odd = (x: number) => 1 - 0.5 * x * x - (1 / 6) * Math.pow(x, 3); // Imaginem un f'''(0) != 0 per veure punt d'inflexi\u00f3

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-2, 2], y: [-1, 2] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={2} opacity={0.3} />
                <Plot.OfX y={n === 2 ? p_even : p_odd} color={n === 2 ? Theme.red : Theme.indigo} weight={4} />

                <Circle center={[0, 1]} radius={0.1} color={Theme.yellow} />
                <LaTeX at={[0, 1.4]} tex="a=0" color={Theme.yellow} />
            </Mafs>
            <div className="bg-slate-800/50 p-4 border-t border-white/10">
                <div className="flex justify-center gap-4 mb-3">
                    <button type="button" onClick={() => setN(2)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${n === 2 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>Grau 2 (Parell)</button>
                    <button type="button" onClick={() => setN(3)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${n === 3 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>Grau 3 (Senar)</button>
                </div>
                <p className="text-xs text-slate-400 text-center italic">
                    {n === 2
                        ? "Si la primera derivada no nul·la és parell, tenim un extrem (màxim o mínim)."
                        : "Si la primera derivada no nul·la és senar, tenim un punt d'inflexió."}
                </p>
            </div>
        </div>
    );
};


export default VisTaylorComportament;

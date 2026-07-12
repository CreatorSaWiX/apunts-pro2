import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisParametrizadaExp = () => {
    const [a, setA] = React.useState(0.5);
    // Per visualitzar-ho millor, fem que el gràfic sigui f(x) = e^{-(x-c)^2} si a>0 
    // o similar, però mantenint l'essència del problema.
    // x_c = 4/a. Si a=0.5, x_c=8.
    const f = (x: number) => {
        if (a === 0) return Math.exp(0.5 * x); // Cas degenerat per a=0 simplificat per visibilitat
        const exponent = 8 * x - a * (Math.pow(x, 2) + 16);
        // Protecció contra valors massa grans per al plot
        return Math.exp(Math.min(exponent, 10));
    }

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-5, 15], y: [-1, 5] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />
                <Plot.OfX y={f} color={a > 0 ? Theme.blue : Theme.red} weight={4} />

                {a !== 0 && (
                    <>
                        <circle cx={4 / a} cy={f(4 / a)} r={0.2} fill={a > 0 ? Theme.blue : Theme.red} stroke="white" />
                        <LaTeX at={[4 / a, f(4 / a) + 0.5]} tex={a > 0 ? "M\u00e0xim" : "M\u00ednim"} color="white" />
                    </>
                )}

                <LaTeX at={[10, 4]} tex={`a = ${a.toFixed(2)}`} color={Theme.yellow} />
            </Mafs>
            <div className="bg-slate-800/80 p-6 border-t border-white/10 text-white">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-medium w-24">Paràmetre a:</span>
                    <input
                        type="range"
                        min="-0.5"
                        max="0.8"
                        step="0.05"
                        value={a}
                        onChange={(e) => setA(parseFloat(e.target.value))}
                        className="flex-1 accent-yellow-400"
                    />
                    <span className="font-mono bg-black/40 px-3 py-1 rounded w-16 text-center">{a.toFixed(2)}</span>
                </div>
                <div className="text-xs text-slate-400 italic">
                    *Nota: S'ha limitat el valor màxim de l'exponent per a la visualització.
                    Punt crític a $x = 4/a$.
                </div>
            </div>
        </div>
    );
};


export default VisParametrizadaExp;

import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisDerivadaTangent = () => {
    const [a, setA] = React.useState(1.0);
    const f = (x: number) => 0.25 * Math.pow(x, 3) - x + 1;
    const df = (x: number) => 0.75 * Math.pow(x, 2) - 1;

    // Equació tangent: y = f(a) + f'(a)(x-a)
    const tangent = (x: number) => f(a) + df(a) * (x - a);

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />
                <Plot.OfX y={f} color={Theme.blue} weight={4} />

                {/* Recta tangent */}
                <Plot.OfX y={tangent} color={Theme.yellow} weight={3} opacity={0.6} />

                {/* Punt de la derivada */}
                <circle cx={a} cy={f(a)} r={0.2} fill={Theme.yellow} stroke="white" strokeWidth={0.05} />

                {/* Controls de text */}
                <LaTeX at={[-2.5, 2.5]} tex={`f'(a) = ${df(a).toFixed(2)}`} color={Theme.yellow} />
                <LaTeX at={[0.5, -2.5]} tex="y = f(a) + f'(a)(x-a)" color={Theme.yellow} />

                {/* Overlay per moure a (simplificat amb inputs ja que no podem importar MovablePoint fàcilment aquí sense moure tot) */}
                {/* Utilitzem un Slider o simplement mostrem instruccions per ara si MovablePoint no està exposat o és complexe */}
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 flex items-center justify-between text-white text-sm">
                <span>Arrossega per moure el punt <b>a</b>:</span>
                <input
                    type="range"
                    min="-2.5"
                    max="2.5"
                    step="0.1"
                    value={a}
                    onChange={(e) => setA(parseFloat(e.target.value))}
                    className="w-48 ml-4 accent-yellow-400"
                />
                <span className="font-mono bg-black/40 px-3 py-1 rounded ml-4">a = {a.toFixed(1)}</span>
            </div>
        </div>
    );
};


export default VisDerivadaTangent;

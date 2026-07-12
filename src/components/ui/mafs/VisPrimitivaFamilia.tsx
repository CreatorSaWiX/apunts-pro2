import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisPrimitivaFamilia = () => {
    const [C, setC] = React.useState(0);
    const [x, setX] = React.useState([1, 0]);

    const f = (t: number) => Math.cos(t);
    const F = (t: number, c: number) => Math.sin(t) + c;
    const df = (t: number) => Math.cos(t);

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Dibuixem 5 línies de la família de primitives */}
                {[-1.5, -0.75, 0, 0.75, 1.5].map((val) => (
                    <Plot.OfX
                        key={val}
                        y={(t) => F(t, val)}
                        color={Theme.green}
                        opacity={Math.abs(val - C) < 0.1 ? 1 : 0.2}
                        weight={Math.abs(val - C) < 0.1 ? 3 : 1}
                    />
                ))}

                <Plot.OfX y={f} color={Theme.orange} weight={3} />

                {/* Tangent interactiva */}
                <Line.ThroughPoints
                    point1={[x[0] - 0.7, F(x[0], C) - 0.7 * df(x[0])]}
                    point2={[x[0] + 0.7, F(x[0], C) + 0.7 * df(x[0])]}
                    color={Theme.yellow}
                    weight={3}
                />

                <Circle center={[x[0], F(x[0], C)]} radius={0.12} color={Theme.yellow} />
                <Vector tail={[x[0], 0]} tip={[x[0], f(x[0])]} color={Theme.orange} weight={3} />

                <MovablePoint point={[x[0], 0]} onMove={(p: [number, number]) => setX([p[0], 0])} color={Theme.orange} />

                <LaTeX at={[-3, 2.5]} tex="F(x) = \sin(x) + C" color={Theme.green} />
                <LaTeX at={[-3, -2]} tex="f(x) = \cos(x)" color={Theme.orange} />
            </Mafs>
            <div className="bg-slate-800/80 p-6 border-t border-white/10">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-slate-300 w-32 font-medium">Constant <InlineMath math="C" />:</span>
                    <input type="range" min="-1.5" max="1.5" step="0.75" value={C} onChange={(e) => setC(parseFloat(e.target.value))} className="flex-1 accent-green-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    <span className="font-mono text-sm w-12 text-center bg-green-500/20 text-green-400 py-1 rounded">{C}</span>
                </div>
                <p className="text-xs text-slate-400 italic leading-relaxed">
                    Observa com el pendent de la tangent (groga) a la primitiva és sempre igual al valor de la funció taronja a sota.
                    No importa quina vertical (<InlineMath math="C" />) triem, la "forma" de de la corba (el pendent) només depèn de <InlineMath math="f(x)" />.
                </p>
            </div>
        </div>
    );
};


export default VisPrimitivaFamilia;

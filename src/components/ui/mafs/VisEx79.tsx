import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisEx79 = () => {

    const [a, setA] = React.useState<number>(1);
    const levelValue = React.useMemo(() => (a ** 4) / Math.pow(1 + a ** 2, 3), [a]);

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">
                        Funció: <InlineMath math="f(x,y) = \frac{x^4 y^4}{(x^4 + y^2)^3}" />
                    </span>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest leading-none">
                        Corba de nivell: <InlineMath math={"y = " + a.toFixed(1) + "x^2"} />
                    </span>
                </div>
                <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5">
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Paràmetre a</span>
                        <input
                            type="range" min="-5" max="5" step="0.1" value={a}
                            onChange={(e) => setA(parseFloat(e.target.value))}
                            className="w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>
                    <div className="h-8 w-[1px] bg-white/10 mx-2" />
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Valor f(a)</span>
                        <span className="text-sm font-mono text-white font-bold">{levelValue.toFixed(4)}</span>
                    </div>
                </div>
            </div>
            <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={true}>
                <Coordinates.Cartesian />
                <Plot.OfX y={(x) => a * x ** 2} color={Theme.indigo} weight={3} />
                {/* Background levels */}
                {[-2, -1, 0, 1, 2].map(k => k !== a && (
                    <Plot.OfX key={k} y={(x) => k * x ** 2} color="#64748b" opacity={0.2} weight={1} />
                ))}
                <LaTeX at={[0, -3.5]} tex={"f(x, ax^2) = \\frac{a^4}{(1+a^2)^3}"} color={Theme.indigo} />
            </Mafs>
            <div className="p-3 bg-slate-900/80 border-t border-white/5 text-[10px] text-slate-400 italic text-center">
                Observeu que per a cada paràbola (valor de <InlineMath math="a" />), el valor de la funció és constant.
            </div>
        </div>
    );
};


export default VisEx79;

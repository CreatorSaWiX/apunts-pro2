import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisMapsTopograficsInteractiu = () => {
    const [k, setK] = React.useState(1);

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }} pan={true} zoom={true}>
                <Coordinates.Cartesian />

                {/* z = x^2 - y^2 = k  =>  y = +- sqrt(x^2 - k) */}
                {k > 0 && (
                    <>
                        <Plot.OfX y={(x) => Math.sqrt(Math.max(0, x * x - k))} color={Theme.yellow} weight={3} />
                        <Plot.OfX y={(x) => -Math.sqrt(Math.max(0, x * x - k))} color={Theme.yellow} weight={3} />
                    </>
                )}
                {k < 0 && (
                    <>
                        <Plot.OfX y={(x) => Math.sqrt(Math.pow(x, 2) - k)} color={Theme.blue} weight={3} />
                        <Plot.OfX y={(x) => -Math.sqrt(Math.pow(x, 2) - k)} color={Theme.blue} weight={3} />
                    </>
                )}
                {k === 0 && (
                    <>
                        <Plot.OfX y={(x) => x} color={Theme.green} weight={3} />
                        <Plot.OfX y={(x) => -x} color={Theme.green} weight={3} />
                    </>
                )}

                <LaTeX at={[0, 2.5]} tex={`x^2 - y^2 = ${k.toFixed(1)}`} color={k > 0 ? Theme.yellow : (k < 0 ? Theme.blue : Theme.green)} />
            </Mafs>
            <div className="bg-slate-800/50 p-4 border-t border-white/10">
                <span className="text-xs text-slate-400 block mb-2 font-bold tracking-wider">Ajusta l'altura (k):</span>
                <input type="range" min="-3" max="3" step="0.5" value={k} onChange={(e) => setK(parseFloat(e.target.value))} className="w-full accent-yellow-400" />
            </div>
        </div>
    );
};



export default VisMapsTopograficsInteractiu;

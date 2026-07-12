import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisTaylorCentrat = () => {
    const [a, setA] = React.useState([0, 0]);
    const [n, setN] = React.useState(3);

    const f = (x: number) => Math.sin(x) + 0.5 * x;
    const df = [
        (x: number) => Math.sin(x) + 0.5 * x,
        (x: number) => Math.cos(x) + 0.5,
        (x: number) => -Math.sin(x),
        (x: number) => -Math.cos(x),
        (x: number) => Math.sin(x),
        (x: number) => Math.cos(x),
        (x: number) => -Math.sin(x)
    ];

    const taylor = (x: number) => {
        let sum = 0;
        const fact = [1, 1, 2, 6, 24, 120, 720];
        for (let i = 0; i <= n; i++) {
            sum += (df[i](a[0]) / fact[i]) * Math.pow(x - a[0], i);
        }
        return sum;
    };

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-5, 5], y: [-3, 3] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={3} opacity={0.4} />
                <Plot.OfX y={taylor} color={Theme.yellow} weight={3} />

                <MovablePoint point={[a[0], f(a[0])]} onMove={(p) => setA([p[0], 0])} color={Theme.blue} />

                <LaTeX at={[a[0], f(a[0]) + 0.4]} tex="a" color={Theme.blue} />
                <LaTeX at={[-4, 2]} tex={`P_{${n}}(x)`} color={Theme.yellow} />
            </Mafs>
            <div className="bg-slate-800/50 p-4 border-t border-white/10">
                <div className="flex items-center gap-6 mb-4">
                    <div className="flex-1">
                        <span className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-wider">Grau del polinomi (n):</span>
                        <div className="flex items-center gap-4">
                            <input type="range" min="0" max="6" step="1" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="flex-1 accent-yellow-400" />
                            <span className="font-mono text-sm bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded w-8 text-center">{n}</span>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-slate-400 italic">
                    Arrossega el punt <InlineMath math="a" /> per la corba. El polinomi de Taylor es "centra" en aquest valor i s'adapta a la forma local de la funció en aquell punt exacte.
                </p>
            </div>
        </div>
    );
};


export default VisTaylorCentrat;

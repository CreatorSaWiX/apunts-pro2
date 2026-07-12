import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisTaylorLagrange = () => {
    const [x, setX] = React.useState([2, 0]);
    const f = (val: number) => Math.sin(val);
    const p1 = (val: number) => val; // P1 a x=0 \u00e9s y=x

    // Per a sin(x) i P1(x)=x, l'error \u00e9s sin(x) - x. 
    // El resta de Lagrange \u00e9s f''(c)/2! * x^2 = -sin(c)/2 * x^2.
    // Trobem c tal que -sin(c)/2 * x^2 = sin(x) - x  =>  sin(c) = 2(x - sin(x)) / x^2
    const cVal = x[0] === 0 ? 0 : Math.asin(Math.max(-1, Math.min(1, 2 * (x[0] - Math.sin(x[0])) / (x[0] * x[0]))));

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-1, 4], y: [-1, 2] }} pan={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={3} />
                <Plot.OfX y={p1} color={Theme.yellow} weight={3} opacity={0.4} />

                {/* Punt c de Lagrange */}
                <Vector tail={[0, 0]} tip={[cVal, 0]} color={Theme.green} weight={3} opacity={0.5} />
                <Circle center={[cVal, f(cVal)]} radius={0.1} color={Theme.green} />
                <LaTeX at={[cVal, -0.4]} tex="c" color={Theme.green} />

                <MovablePoint point={[x[0], 0]} onMove={(p) => setX([Math.max(0.1, Math.min(Math.PI, p[0])), 0])} color={Theme.red} />
                <LaTeX at={[x[0], -0.4]} tex="x" color={Theme.red} />

                <Line.Segment point1={[x[0], f(x[0])]} point2={[x[0], p1(x[0])]} color={Theme.red} weight={2} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-xs text-slate-400">
                El Teorema de Lagrange ens garanteix que existeix un punt <span className="text-green-400 font-bold"><InlineMath math="c \in (a,x)" /></span> on la derivada de la funció "explica" l'error comès.
            </div>
        </div>
    );
};


export default VisTaylorLagrange;

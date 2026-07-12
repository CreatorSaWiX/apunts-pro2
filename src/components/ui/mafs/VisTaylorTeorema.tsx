import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisTaylorTeorema = () => {
    const [x, setX] = React.useState([1.5, 0]);
    const f = (val: number) => Math.exp(val / 2);
    const p1 = (val: number) => 1 + 0.5 * val; // Tangent a 0

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-1, 3], y: [0, 5] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={3} />
                <Plot.OfX y={p1} color={Theme.yellow} weight={3} opacity={0.6} />

                <Line.Segment point1={[x[0], f(x[0])]} point2={[x[0], p1(x[0])]} color={Theme.red} weight={4} />
                <Circle center={[x[0], f(x[0])]} radius={0.08} color={Theme.red} />
                <Circle center={[x[0], p1(x[0])]} radius={0.08} color={Theme.red} />

                <MovablePoint point={[x[0], 0]} onMove={(p) => setX([Math.max(-0.5, Math.min(2.5, p[0])), 0])} color={Theme.red} />

                <LaTeX at={[x[0] + 0.2, (f(x[0]) + p1(x[0])) / 2]} tex="R_n(x)" color={Theme.red} />
                <LaTeX at={[0, 1.3]} tex="a" color={Theme.blue} />
            </Mafs>
            <div className="bg-slate-800/50 p-4 border-t border-white/10 text-center">
                El <span className="text-red-400 font-bold italic">Resta de Taylor</span> <InlineMath math="R_n(x)" /> és la distància vertical real entre la funció i el polinomi aproximat.
            </div>
        </div>
    );
};


export default VisTaylorTeorema;

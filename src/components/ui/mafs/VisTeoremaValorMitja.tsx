import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisTeoremaValorMitja = () => {
    const [a, setA] = React.useState(-2);
    const [b, setB] = React.useState(2);

    const f = (x: number) => 0.1 * Math.pow(x, 3) - 0.2 * x + 1;
    const slope = (f(b) - f(a)) / (b - a);

    // Trobem c tal que f'(c) = 0.3c^2 - 0.2 = slope => c = sqrt((slope + 0.2)/0.3)
    const cVal = Math.sqrt(Math.abs((slope + 0.2) / 0.3)) * (slope < 0 ? -1 : 1);

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-4, 4], y: [-1, 5] }} pan={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={3} />

                {/* Secant */}
                <Line.Segment point1={[a, f(a)]} point2={[b, f(b)]} color="white" opacity={0.3} weight={2} />

                {/* Tangent paral\u00b7lela */}
                <Line.ThroughPoints
                    point1={[cVal - 1, f(cVal) - slope]}
                    point2={[cVal + 1, f(cVal) + slope]}
                    color={Theme.yellow}
                    weight={4}
                />
                <Circle center={[cVal, f(cVal)]} radius={0.12} color={Theme.yellow} />

                <MovablePoint point={[a, f(a)]} onMove={(p) => setA(Math.min(p[0], b - 1.2))} color={Theme.red} />
                <MovablePoint point={[b, f(b)]} onMove={(p) => setB(Math.max(p[0], a + 1.2))} color={Theme.red} />

                <LaTeX at={[cVal, f(cVal) + 0.7]} tex="f'(c) = \frac{f(b)-f(a)}{b-a}" color={Theme.yellow} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-xs text-slate-400 text-center italic leading-relaxed">
                El pendent de la **secant** (blanca) \u00e9s igual al pendent de la **tangent** (groga) en algun punt interior <InlineMath math="c" />.
            </div>
        </div>
    );
};


export default VisTeoremaValorMitja;

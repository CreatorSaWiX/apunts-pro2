import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisTeoremaRolle = () => {
    const [a, setA] = React.useState(-2);
    const [b, setB] = React.useState(2);

    // Funci\u00f3 f(x) = -(x-a)(x-b) + 1. Aix\u00f2 garanteix f(a)=1 i f(b)=1.
    const f = (x: number) => -(x - a) * (x - b) + 1;
    const c = (a + b) / 2; // El punt on f'(c)=0 per una par\u00e0bola

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-4, 4], y: [-1, 5] }} pan={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={3} />

                {/* Linia horitzontal f(a)=f(b) */}
                <Line.Segment point1={[a, 1]} point2={[b, 1]} color="white" opacity={0.3} weight={2} />

                {/* Tangent horitzontal a c */}
                <Line.Segment point1={[c - 1, f(c)]} point2={[c + 1, f(c)]} color={Theme.yellow} weight={4} />
                <Circle center={[c, f(c)]} radius={0.12} color={Theme.yellow} />

                <MovablePoint point={[a, 1]} onMove={(p) => setA(Math.min(p[0], b - 1.2))} color={Theme.red} />
                <MovablePoint point={[b, 1]} onMove={(p) => setB(Math.max(p[0], a + 1.2))} color={Theme.red} />

                <LaTeX at={[c, f(c) + 0.5]} tex="f'(c) = 0" color={Theme.yellow} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-xs text-slate-400 text-center italic leading-relaxed">
                Si <InlineMath math="f(a) = f(b)" />, obligat\u00f2riament hi ha un punt <InlineMath math="c \in (a, b)" /> on la corba "gira" i la tangent \u00e9s perfectament **horitzontal**.
            </div>
        </div>
    );
};


export default VisTeoremaRolle;

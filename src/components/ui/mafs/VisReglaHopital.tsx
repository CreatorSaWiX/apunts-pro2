import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisReglaHopital = () => {
    const [x, setX] = React.useState([0.5, 0]);
    // Dues funcions que van a 0 quan x -> 0
    const f = (xVal: number) => Math.sin(2 * xVal);
    const g = (xVal: number) => Math.sin(xVal);

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-1, 1.5], y: [-1, 2.5] }} pan={false} zoom={true}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={3} />
                <Plot.OfX y={g} color={Theme.red} weight={3} />

                {/* Tangents a l'origen */}
                <Line.ThroughPoints point1={[-0.5, -1]} point2={[0.5, 1]} color={Theme.blue} opacity={0.3} weight={1} />
                <Line.ThroughPoints point1={[-1, -1]} point2={[1, 1]} color={Theme.red} opacity={0.3} weight={1} />

                <MovablePoint point={[x[0], 0]} onMove={(p) => setX([Math.max(0.05, Math.min(1.2, p[0])), 0])} color={Theme.yellow} />

                <Line.Segment point1={[x[0], 0]} point2={[x[0], f(x[0])]} color={Theme.blue} weight={2} />
                <Line.Segment point1={[x[0], 0]} point2={[x[0], g(x[0])]} color={Theme.red} weight={2} />

                <LaTeX at={[1.2, f(1.2)]} tex="f(x)" color={Theme.blue} />
                <LaTeX at={[1.2, g(1.2)]} tex="g(x)" color={Theme.red} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-xs text-slate-300 italic text-center">
                A prop de l'origen (<InlineMath math="x \to a" />), el quocient <span className="text-blue-400 font-bold">f(x)</span> / <span className="text-red-400 font-bold">g(x)</span> és pràcticament el mateix que el quocient entre les seves **velocitats (tangents)**.
            </div>
        </div>
    );
};


export default VisReglaHopital;

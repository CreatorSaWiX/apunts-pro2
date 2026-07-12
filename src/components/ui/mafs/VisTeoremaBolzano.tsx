import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisTeoremaBolzano = () => {
    const a = -2;
    const b = 3;
    const f = (x: number) => 0.5 * Math.pow(x, 2) - 2; // Arrel a x=2

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.red} weight={4} />

                {/* Interval [a,b] */}
                <Plot.OfX y={() => 0} color={"rgba(255, 255, 255, 0.2)"} weight={1} />
                <circle cx={a} cy={f(a)} r={0.15} fill={Theme.blue} stroke="white" strokeWidth={0.05} />
                <circle cx={b} cy={f(b)} r={0.15} fill={Theme.blue} stroke="white" strokeWidth={0.05} />

                {/* Punt c */}
                <circle cx={2} cy={0} r={0.2} fill={Theme.green} stroke="white" strokeWidth={0.1} />

                <Text x={a} y={f(a) - 0.5} color={Theme.blue} size={16}>f(a) {"<"} 0</Text>
                <Text x={b} y={f(b) + 0.5} color={Theme.blue} size={16}>f(b) {">"} 0</Text>
                <Text x={2.2} y={0.5} color={Theme.green} size={18}>Punt c (f(c) = 0)</Text>
                <LaTeX at={[-1, 2]} tex="f(x) \text{ contínua}" color={Theme.red} />
            </Mafs>
        </div>
    );
};


export default VisTeoremaBolzano;

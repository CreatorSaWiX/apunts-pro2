import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisExtremsRelatius = () => {
    const f = (x: number) => {
        if (x < 0) return 0; // Domini [0,1]
        return Math.pow(x, 2 / 3) * Math.pow(x - 1, 4);
    }

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-0.2, 1.2], y: [-0.05, 0.3] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />
                <Plot.OfX y={f} color={Theme.blue} weight={4} />
                <circle cx={1 / 7} cy={f(1 / 7)} r={0.02} fill={Theme.red} stroke="white" strokeWidth={0.01} />
                <circle cx={0} cy={0} r={0.02} fill={Theme.green} stroke="white" strokeWidth={0.01} />
                <circle cx={1} cy={0} r={0.02} fill={Theme.green} stroke="white" strokeWidth={0.01} />

                <LaTeX at={[1 / 7, f(1 / 7) + 0.03]} tex="M(1/7, f(1/7))" color={Theme.red} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 flex justify-center gap-8 text-xs font-mono">
                <span className="flex items-center gap-2 font-bold text-green-400">Mínims (f=0)</span>
                <span className="flex items-center gap-2 font-bold text-red-400">Màxim relatiu</span>
            </div>
        </div>
    );
};


export default VisExtremsRelatius;

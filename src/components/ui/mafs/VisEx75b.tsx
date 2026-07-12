import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisEx75b = () => {
    const [point, setPoint] = React.useState<[number, number]>([-2, 2]);
    const x = point[0];
    const y = point[1];

    // |x^2+4x+1| = -x^2-4x-1  <=> x^2+4x+1 <= 0
    const xMin = -2 - Math.sqrt(3);
    const xMax = -2 + Math.sqrt(3);
    const isInX = x >= xMin && x <= xMax;
    const isInY = Math.abs(y - 2) < 10;
    const isIn = isInX && isInY;

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-16">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Conjunt B: <InlineMath math="x^2+4x+1 \le 0, |y-2|<10" /></span>
                    <span className="text-xs font-mono text-white">x ∈ [{xMin.toFixed(2)}, {xMax.toFixed(2)}] | y ∈ (-8, 12)</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${isIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {isIn ? '✓ Punt de B' : '✗ Fora de B'}
                </div>
            </div>
            <Mafs viewBox={{ x: [-6, 2], y: [-10, 15] }} pan={true}>
                <Coordinates.Cartesian />
                <Polygon
                    points={[[xMin, -8], [xMax, -8], [xMax, 12], [xMin, 12]]}
                    color={Theme.indigo}
                    fillOpacity={0.15}
                    weight={0}
                />
                {/* Vertical borders (included) */}
                <Line.Segment point1={[xMin, -8]} point2={[xMin, 12]} color={Theme.indigo} weight={3} />
                <Line.Segment point1={[xMax, -8]} point2={[xMax, 12]} color={Theme.indigo} weight={3} />
                {/* Horizontal borders (excluded) */}
                <Line.Segment point1={[xMin, -8]} point2={[xMax, -8]} color={Theme.indigo} weight={3} style="dashed" />
                <Line.Segment point1={[xMin, 12]} point2={[xMax, 12]} color={Theme.indigo} weight={3} style="dashed" />

                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />
            </Mafs>
        </div>
    );
};


export default VisEx75b;

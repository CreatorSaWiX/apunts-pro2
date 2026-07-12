import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisEx77b = () => {
    const [point, setPoint] = React.useState<[number, number]>([0.5, 0.5]);
    const d2 = point[0] ** 2 + point[1] ** 2;
    const isIn = d2 <= 1;

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-16">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Domini B: <InlineMath math="g(x,y) = \sqrt{1-x^2-y^2}" /></span>
                    <span className="text-xs font-mono text-white">x² + y² ≤ 1</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${isIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {isIn ? '✓ Definit' : '✗ Fora del domini'}
                </div>
            </div>
            <Mafs viewBox={{ x: [-1.5, 1.5], y: [-1.5, 1.5] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />
                <Circle center={[0, 0]} radius={1} color={Theme.blue} fillOpacity={0.15} weight={3} />
                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />
            </Mafs>
        </div>
    );
};


export default VisEx77b;

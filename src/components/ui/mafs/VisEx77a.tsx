import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisEx77a = () => {

    const [point, setPoint] = React.useState<[number, number]>([1, 1]);
    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-16">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Domini A: <InlineMath math="f(x,y) = x^2 - y^2" /></span>
                    <span className="text-xs font-mono text-white">Dom(f) = ℝ²</span>
                </div>
                <div className="px-4 py-1.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black uppercase shadow-lg">
                    ✓ Sempre definit
                </div>
            </div>
            <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={true}>
                <Coordinates.Cartesian />
                <Polygon
                    points={[[-10, -10], [10, -10], [10, 10], [-10, 10]]}
                    color={Theme.blue} fillOpacity={0.15} weight={0}
                />
                <MovablePoint point={point} onMove={setPoint} color={Theme.green} />
            </Mafs>
        </div>
    );
};


export default VisEx77a;

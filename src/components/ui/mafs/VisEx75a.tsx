import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisEx75a = () => {

    const [point, setPoint] = React.useState<[number, number]>([3, 1]);
    const x = point[0];
    const y = point[1];
    const isIn = Math.abs(x - 3) < 2 && Math.abs(1 - y) <= 5;

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-16">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Conjunt A: <InlineMath math="|x-3|<2, |1-y|\le 5" /></span>
                    <span className="text-xs font-mono text-white">x ∈ (1, 5) | y ∈ [-4, 6]</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${isIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {isIn ? '✓ Punt de A' : '✗ Fora de A'}
                </div>
            </div>
            <Mafs viewBox={{ x: [0, 6], y: [-6, 8] }} pan={true}>
                <Coordinates.Cartesian />
                <Polygon
                    points={[[1, -4], [5, -4], [5, 6], [1, 6]]}
                    color={Theme.blue}
                    fillOpacity={0.15}
                    weight={0}
                />
                {/* Horizontal borders (included) */}
                <Line.Segment point1={[1, -4]} point2={[5, -4]} color={Theme.blue} weight={3} />
                <Line.Segment point1={[1, 6]} point2={[5, 6]} color={Theme.blue} weight={3} />
                {/* Vertical borders (excluded) */}
                <Line.Segment point1={[1, -4]} point2={[1, 6]} color={Theme.blue} weight={3} style="dashed" />
                <Line.Segment point1={[5, -4]} point2={[5, 6]} color={Theme.blue} weight={3} style="dashed" />

                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />
            </Mafs>
            <div className="p-4 bg-slate-900 border-t border-white/5 text-[10px] text-slate-500 leading-relaxed italic text-center">
                Rectangle amb vores mixtes: Les línies <span className="text-blue-400 font-bold">sòlides</span> pertanyen al conjunt, les <span className="text-blue-400 font-bold opacity-70">discontínues</span> no.
            </div>
        </div>
    );
};


export default VisEx75a;

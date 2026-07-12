import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisEx77c = () => {
    const [point, setPoint] = React.useState<[number, number]>([1, 1]);
    const isIn = point[0] + point[1] > 0;

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-16">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Domini C: <InlineMath math="h(x,y) = \ln(x+y)" /></span>
                    <span className="text-xs font-mono text-white"><InlineMath math="y > -x" /></span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${isIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {isIn ? '✓ Definit' : '✗ Fora del domini'}
                </div>
            </div>
            <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={true}>
                <Coordinates.Cartesian />
                <Polygon
                    points={[[-10, 10], [10, 10], [10, -10], [-10, 10]]}
                    color={Theme.blue} fillOpacity={0.15} weight={0}
                />
                <Plot.OfX y={(x) => -x} color={Theme.blue} weight={3} style="dashed" />
                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />
            </Mafs>
        </div>
    );
};


export default VisEx77c;

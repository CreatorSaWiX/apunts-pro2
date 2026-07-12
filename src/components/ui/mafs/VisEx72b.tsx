import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisEx72b = () => {
    const [point, setPoint] = React.useState<[number, number]>([Math.PI / 2, 2]);
    const val = point[1] * Math.sin(point[0]);
    const isInDomain = val >= 0;

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-20">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Condició: $y \\sin(x) \\ge 0$</span>
                    <span className="text-sm font-mono text-white">val = {val.toFixed(2)}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${isInDomain ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {isInDomain ? '✓ Dins del Domini' : '✗ Fora del Domini'}
                </div>
            </div>
            <Mafs viewBox={{ x: [-2 * Math.PI, 2 * Math.PI], y: [-4, 4] }} pan={false}>
                <Coordinates.Cartesian />

                {/* Ombrejat de zones (Casos sin(x)*y >= 0) amb Outline */}
                <Polygon points={[[-2 * Math.PI, 0], [-Math.PI, 0], [-Math.PI, 4], [-2 * Math.PI, 4]]} color={Theme.blue} fillOpacity={0.15} weight={2} />
                <Polygon points={[[0, 0], [Math.PI, 0], [Math.PI, 4], [0, 4]]} color={Theme.blue} fillOpacity={0.15} weight={2} />
                <Polygon points={[[-Math.PI, 0], [0, 0], [0, -4], [-Math.PI, -4]]} color={Theme.blue} fillOpacity={0.15} weight={2} />
                <Polygon points={[[Math.PI, 0], [2 * Math.PI, 0], [2 * Math.PI, -4], [Math.PI, -4]]} color={Theme.blue} fillOpacity={0.15} weight={2} />

                {/* Punt interactiu */}
                <MovablePoint point={point} onMove={setPoint} color={isInDomain ? Theme.green : Theme.red} />
            </Mafs>
        </div>
    );
};


export default VisEx72b;

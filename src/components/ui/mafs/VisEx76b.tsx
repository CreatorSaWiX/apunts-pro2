import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisEx76b = () => {
    const [point, setPoint] = React.useState<[number, number]>([0.5, 0.5]);
    const x = point[0];
    const y = point[1];
    const isIn = x > 0 && y > 0 && x * y <= 1;

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-16">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Conjunt B: <InlineMath math="x > 0, y > 0, xy \le 1" /></span>
                    <span className="text-xs font-mono text-white">xy = {(x * y).toFixed(2)}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${isIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {isIn ? '✓ Punt de B' : '✗ Fora de B'}
                </div>
            </div>
            <Mafs viewBox={{ x: [-0.5, 5], y: [-0.5, 5] }} pan={true}>
                <Coordinates.Cartesian />

                {/* Hyperbola region filling */}
                <Polygon
                    points={[
                        [0.1, 0.1], // Avoid 0 for cleaner visuals
                        [5, 0.1],
                        [5, 1 / 5],
                        ...Array.from({ length: 41 }, (_, i) => {
                            const xi = 5 - (i / 40) * 4.8;
                            return [xi, 1 / xi] as [number, number];
                        }),
                        [0.2, 5],
                        [0.1, 5]
                    ]}
                    color={Theme.blue} fillOpacity={0.15} weight={0}
                />

                {/* Boundaries */}
                <Plot.OfX y={(x) => (x >= 0.01 && x <= 5 ? 1 / x : NaN)} color={Theme.blue} weight={3} />
                <Line.Segment point1={[0, 0]} point2={[5, 0]} color={Theme.blue} weight={2} style="dashed" />
                <Line.Segment point1={[0, 0]} point2={[0, 5]} color={Theme.blue} weight={2} style="dashed" />

                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />
            </Mafs>
            <div className="p-4 bg-slate-900 border-t border-white/5 text-[10px] text-slate-500 leading-relaxed italic text-center">
                Regió al primer quadrant sota la hipèrbola. Els eixos <span className="text-blue-300 font-bold">x=0</span> i <span className="text-blue-300 font-bold">y=0</span> són frontera però no pertanyen al conjunt.
            </div>
        </div>
    );
};


export default VisEx76b;

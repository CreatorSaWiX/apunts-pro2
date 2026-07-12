import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisEx71b = () => {
    const [point, setPoint] = React.useState<[number, number]>([1, 0.5]);
    const x = point[0];
    const y = point[1];
    const isIn = Math.abs(y) <= x * x && y !== 0 && Math.abs(x) <= 2;

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-16">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Conjunt B: <InlineMath math="|y| \le x^2, y \ne 0, x \in [-2, 2]" /></span>
                    <span className="text-xs font-mono text-white">|y| = {Math.abs(y).toFixed(2)} | x² = {(x * x).toFixed(2)}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${isIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {isIn ? '✓ Punt de B' : '✗ Fora de B'}
                </div>
            </div>
            <Mafs viewBox={{ x: [-2.5, 2.5], y: [-4.5, 4.5] }} pan={false}>
                <Coordinates.Cartesian />

                {/* Region B filling - Top */}
                <Polygon
                    points={[
                        ...Array.from({ length: 41 }, (_, i) => {
                            const xi = -2 + (i / 40) * 4;
                            return [xi, xi * xi] as [number, number];
                        }),
                        [2, 0],
                        [-2, 0]
                    ]}
                    color={Theme.blue} fillOpacity={0.12} weight={0}
                />
                {/* Region B filling - Bottom */}
                <Polygon
                    points={[
                        ...Array.from({ length: 41 }, (_, i) => {
                            const xi = -2 + (i / 40) * 4;
                            return [xi, -xi * xi] as [number, number];
                        }),
                        [2, 0],
                        [-2, 0]
                    ]}
                    color={Theme.blue} fillOpacity={0.12} weight={0}
                />

                {/* Boundaries */}
                <Plot.OfX y={(x) => (Math.abs(x) <= 2 ? x * x : NaN)} color={Theme.blue} weight={2} />
                <Plot.OfX y={(x) => (Math.abs(x) <= 2 ? -x * x : NaN)} color={Theme.blue} weight={2} />
                <Line.Segment point1={[-2, -4]} point2={[-2, 4]} color={Theme.blue} weight={2} />
                <Line.Segment point1={[2, -4]} point2={[2, 4]} color={Theme.blue} weight={2} />

                {/* Excluded axis */}
                <Line.Segment point1={[-2, 0]} point2={[2, 0]} color={Theme.red} weight={2} style="dashed" opacity={0.5} />

                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />

                <LaTeX at={[1.8, 3.8]} tex="y = x^2" color={Theme.blue} />
                <LaTeX at={[1.8, -3.8]} tex="y = -x^2" color={Theme.blue} />
            </Mafs>
            <div className="p-4 bg-slate-900 border-t border-white/5 text-[10px] text-slate-500 leading-relaxed italic text-center">
                Regió entre paràboles. L'eix <span className="text-red-400 font-bold">y=0</span> (vermell) està exclòs del conjunt $B$ però és frontera.
                Arrossega el punt sobre l'eix per veure com canvia l'estat.
            </div>
        </div>
    );
};


export default VisEx71b;

import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisEx72a = () => {


    const [point, setPoint] = React.useState<[number, number]>([1, 1]);
    const val = 1 + point[0] * point[1];
    const isInDomain = val > 0;

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-20">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Condició: $1 + xy &gt; 0$</span>
                    <span className="text-sm font-mono text-white">$1 + ({point[0].toFixed(2)}) \\cdot ({point[1].toFixed(2)}) = {val.toFixed(2)}$</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${isInDomain ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {isInDomain ? '✓ Dins del Domini' : '✗ Fora del Domini'}
                </div>
            </div>
            <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false}>
                <Coordinates.Cartesian />

                {/* Ombrejat del domini xy > -1 per quadrants */}
                {/* Quadrant 1 i 3 (Sempre vàlids) */}
                <Polygon points={[[0, 0], [5, 0], [5, 5], [0, 5]]} color={Theme.blue} fillOpacity={0.3} weight={0} />
                <Polygon points={[[0, 0], [-5, 0], [-5, -5], [0, -5]]} color={Theme.blue} fillOpacity={0.3} weight={0} />

                {/* Quadrant 2 (xy > -1 => y < -1/x) */}
                <Polygon
                    points={[
                        [0, 0], [-5, 0],
                        ...Array.from({ length: 41 }, (_, i) => {
                            const x = -5 + i * 0.125;
                            if (x >= -0.1) return null;
                            return [x, -1 / x] as [number, number];
                        }).filter(p => p !== null) as [number, number][],
                        [-0.2, 5], [0, 5], [0, 0]
                    ]}
                    color={Theme.blue} fillOpacity={0.3} weight={0}
                />

                {/* Quadrant 4 (xy > -1 => y > -1/x) */}
                <Polygon
                    points={[
                        [0, 0], [5, 0],
                        ...Array.from({ length: 41 }, (_, i) => {
                            const x = 5 - i * 0.125;
                            if (x <= 0.1) return null;
                            return [x, -1 / x] as [number, number];
                        }).filter(p => p !== null) as [number, number][],
                        [0.2, -5], [0, -5], [0, 0]
                    ]}
                    color={Theme.blue} fillOpacity={0.3} weight={0}
                />

                {/* Fronteres */}
                <Plot.OfX y={(x) => -1 / x} color={Theme.indigo} weight={2} style="dashed" opacity={0.6} />

                {/* Punt interactiu */}
                <MovablePoint point={point} onMove={setPoint} color={isInDomain ? Theme.green : Theme.red} />

                {/* Indicador de punt */}
                <LaTeX at={[point[0], point[1] + 0.4]} tex={`(${point[0].toFixed(1)}, ${point[1].toFixed(1)})`} />
            </Mafs>
        </div>
    );
};


export default VisEx72a;

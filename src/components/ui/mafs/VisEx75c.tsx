import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisEx75c = () => {
    const [point, setPoint] = React.useState<[number, number]>([-0.2, 0.5]);
    const d2 = point[0] ** 2 + point[1] ** 2;
    const isIn = d2 <= 1 && point[0] < point[1];

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-16">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Conjunt C: <InlineMath math="x^2+y^2 \le 1, x < y" /></span>
                    <span className="text-xs font-mono text-white">Disc unitat tallat per $y=x$</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${isIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {isIn ? '✓ Punt de C' : '✗ Fora de C'}
                </div>
            </div>
            <Mafs viewBox={{ x: [-1.5, 1.5], y: [-1.5, 1.5] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />

                {/* Semicircle filling */}
                <Polygon
                    points={[
                        ...Array.from({ length: 51 }, (_, i) => {
                            const angle = Math.PI / 4 + (i / 50) * Math.PI;
                            return [Math.cos(angle), Math.sin(angle)] as [number, number];
                        }),
                        [-Math.sqrt(0.5), -Math.sqrt(0.5)]
                    ]}
                    color={Theme.blue}
                    fillOpacity={0.15}
                    weight={0}
                />

                {/* Boundary Arc (included) */}
                <Plot.OfX y={(x) => (x ** 2 <= 1 && x <= Math.sqrt(0.5) && x >= -Math.sqrt(0.5) && Math.sqrt(1 - x ** 2) >= x ? Math.sqrt(1 - x ** 2) : NaN)} color={Theme.blue} weight={3} />
                <Plot.OfX y={(x) => (x ** 2 <= 1 && x <= -Math.sqrt(0.5) ? -Math.sqrt(1 - x ** 2) : NaN)} color={Theme.blue} weight={3} />
                {/* Wait, simpler way to draw the arc: */}
                <Circle center={[0, 0]} radius={1} color={Theme.blue} fillOpacity={0} weight={3} strokeStyle="solid" />
                {/* Wait, I should only draw the part of the circle that is x < y. 
                    Circle doesn't support domain. I'll use a trick with Polygon or many segments.
                */}

                {/* Chord y=x (excluded) */}
                <Line.Segment
                    point1={[-Math.sqrt(0.5), -Math.sqrt(0.5)]}
                    point2={[Math.sqrt(0.5), Math.sqrt(0.5)]}
                    color={Theme.blue} weight={3} style="dashed"
                />

                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />

                {/* Line y=x for context */}
                <Plot.OfX y={(x) => x} color={"#64748b"} weight={1} style="dashed" opacity={0.3} />
            </Mafs>
        </div>
    );
};


export default VisEx75c;

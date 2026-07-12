import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisReglaBarrow = () => {
    const [interval, setInterval] = React.useState({ a: 1, b: 3 });
    const f = (x: number) => 0.4 * x + 0.8;
    const F = (x: number) => 0.2 * x * x + 0.8 * x;

    return (
        <div className="w-full flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="overflow-hidden p-2">
                    <Mafs viewBox={{ x: [-0.5, 4.5], y: [-0.5, 3.5] }} pan={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        <Polygon
                            points={[[interval.a, 0], [interval.b, 0], [interval.b, f(interval.b)], [interval.a, f(interval.a)]]}
                            color={Theme.blue} fillOpacity={0.4}
                        />
                        <Plot.OfX y={f} color={Theme.blue} weight={3} />
                        <MovablePoint point={[interval.a, 0]} onMove={(p: [number, number]) => setInterval(prev => ({ ...prev, a: Math.max(0, Math.min(p[0], interval.b - 0.2)) }))} color={Theme.blue} />
                        <MovablePoint point={[interval.b, 0]} onMove={(p: [number, number]) => setInterval(prev => ({ ...prev, b: Math.min(4, Math.max(p[0], interval.a + 0.2)) }))} color={Theme.blue} />
                        <LaTeX at={[(interval.a + interval.b) / 2, 0.4]} tex="\int_a^b f" color="white" />
                    </Mafs>
                </div>

                <div className="overflow-hidden p-2">
                    <Mafs viewBox={{ x: [-0.5, 4.5], y: [-0.5, 7] }} pan={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        <Plot.OfX y={F} color={Theme.red} weight={3} />

                        <Circle center={[interval.a, F(interval.a)]} radius={0.12} color={Theme.red} />
                        <Circle center={[interval.b, F(interval.b)]} radius={0.12} color={Theme.red} />

                        <Vector tail={[interval.b, F(interval.a)]} tip={[interval.b, F(interval.b)]} color={Theme.yellow} weight={3} />
                        <Line.Segment point1={[interval.a, F(interval.a)]} point2={[interval.b, F(interval.a)]} color="white" opacity={0.3} />

                        <LaTeX at={[interval.b + 0.6, (F(interval.a) + F(interval.b)) / 2]} tex="F(b)-F(a)" color={Theme.yellow} />
                    </Mafs>
                </div>
            </div>
            <div className="bg-slate-800/50 p-4 border-t border-white/10 text-center">
                <p className="font-light text-slate-200">
                    La <span className="text-blue-400 font-bold uppercase tracking-tighter">Àrea</span> sota la corba representa el guany total.
                    Aquest guany és exactament igual al <span className="text-yellow-400 font-bold uppercase tracking-tighter">Salt Vertical</span> en la funció primitiva.
                </p>
                <div className="mt-2 text-xl font-serif text-white italic">
                    <InlineMath math="\int_a^b f(x) dx = F(b) - F(a)" />
                </div>
            </div>
        </div>
    );
};


export default VisReglaBarrow;

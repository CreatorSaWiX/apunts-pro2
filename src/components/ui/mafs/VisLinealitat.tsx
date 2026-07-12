import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisLinealitat = () => {
    const [k, setK] = React.useState(1.5);
    const f = (x: number) => 0.5 * Math.sin(x) + 0.8;
    const g = (x: number) => 0.3 * x + 0.4;

    const a = 0.5;
    const b = 3.5;

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-0.5, 4.5], y: [-0.2, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Àrea k*f (Blava - a la base) */}
                <Polygon
                    points={[
                        [a, 0],
                        ...Array.from({ length: 30 }, (_, i) => {
                            const x = a + (i / 29) * (b - a);
                            return [x, k * f(x)] as [number, number];
                        }),
                        [b, 0]
                    ]}
                    color={Theme.blue}
                    fillOpacity={0.3}
                />

                {/* Àrea g (Taronja - apilada a sobre) */}
                <Polygon
                    points={[
                        ...Array.from({ length: 30 }, (_, i) => {
                            const x = a + (i / 29) * (b - a);
                            return [x, k * f(x)] as [number, number];
                        }),
                        ...Array.from({ length: 30 }, (_, i) => {
                            const x = b - (i / 29) * (b - a);
                            return [x, k * f(x) + g(x)] as [number, number];
                        })
                    ]}
                    color={Theme.orange}
                    fillOpacity={0.3}
                />

                {/* Línies de les funcions */}
                <Plot.OfX y={(x) => k * f(x) + g(x)} color={Theme.yellow} weight={3} />
                <Plot.OfX y={(x) => k * f(x)} color={Theme.blue} weight={2} opacity={0.5} />

                <LaTeX at={[a, -0.4]} tex="a" color="white" />
                <LaTeX at={[b, -0.4]} tex="b" color="white" />

                <LaTeX at={[2, 4.5]} tex={`\\int_a^b (k\\cdot f + g) = k\\int_a^b f + \\int_a^b g`} color={Theme.yellow} />
            </Mafs>
            <div className="bg-slate-800/80 p-6 border-t border-white/10 text-white">
                <div className="flex items-center gap-6 mb-4">
                    <span className="text-sm font-medium w-32 shrink-0">Escalar <InlineMath math="k" />:</span>
                    <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.1"
                        value={k}
                        onChange={(e) => setK(parseFloat(e.target.value))}
                        className="flex-1 accent-blue-400"
                    />
                    <span className="font-mono bg-blue-500/20 text-blue-400 px-3 py-1 rounded w-16 text-center">{k.toFixed(1)}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="flex items-center justify-center gap-2 bg-blue-500/10 p-2 rounded border border-blue-500/20">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span className="text-[10px] uppercase font-bold text-blue-400 tracking-tighter">Terme <InlineMath math="k \cdot \int f" /></span>
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-orange-500/10 p-2 rounded border border-orange-500/20">
                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                        <span className="text-[10px] uppercase font-bold text-orange-400 tracking-tighter">Terme <InlineMath math="\int g" /></span>
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                        <span className="text-[10px] uppercase font-bold text-yellow-500 tracking-tighter">Integral Suma</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default VisLinealitat;

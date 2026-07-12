import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisCombinacioLineal = () => {
    const [alpha, setAlpha] = React.useState(1.5);
    const [beta, setBeta] = React.useState(0.8);
    const [v, setV] = React.useState<[number, number]>([2, 1]);
    const [w, setW] = React.useState<[number, number]>([1, 2]);

    const res = [alpha * v[0] + beta * w[0], alpha * v[1] + beta * w[1]] as [number, number];
    const alphaV = [alpha * v[0], alpha * v[1]] as [number, number];
    const betaW = [beta * w[0], beta * w[1]] as [number, number];

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-1 min-w-[150px]">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Resultat</span>
                    <span className="text-sm font-mono text-white bg-indigo-600/30 px-2 py-1 rounded inline-block border border-indigo-500/20">
                        <InlineMath math={`\\vec{u} = ${alpha.toFixed(1)} \\vec{v} + ${beta.toFixed(1)} \\vec{w}`} />
                    </span>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-wider">
                            <span className="text-slate-400">Escalar α (v)</span>
                            <span className="text-white bg-slate-900 px-1.5 py-0.5 rounded">{alpha.toFixed(1)}</span>
                        </div>
                        <input type="range" min="-3" max="3" step="0.1" value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-wider">
                            <span className="text-slate-400">Escalar β (w)</span>
                            <span className="text-white bg-slate-900 px-1.5 py-0.5 rounded">{beta.toFixed(1)}</span>
                        </div>
                        <input type="range" min="-3" max="3" step="0.1" value={beta} onChange={(e) => setBeta(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                </div>
            </div>

            <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={true}>
                <Coordinates.Cartesian />

                {/* Projected vectors and parallelogram */}
                <Line.Segment point1={[0, 0]} point2={alphaV} color={Theme.blue} weight={2} style="dashed" opacity={0.4} />
                <Line.Segment point1={[0, 0]} point2={betaW} color={Theme.red} weight={2} style="dashed" opacity={0.4} />
                <Line.Segment point1={alphaV} point2={res} color={Theme.red} weight={1} style="dashed" opacity={0.2} />
                <Line.Segment point1={betaW} point2={res} color={Theme.blue} weight={1} style="dashed" opacity={0.2} />

                {/* Base vectors */}
                <Vector tail={[0, 0]} tip={v} color={Theme.blue} weight={3} />
                <Vector tail={[0, 0]} tip={w} color={Theme.red} weight={3} />

                {/* Result vector */}
                <Vector tail={[0, 0]} tip={res} color={Theme.indigo} weight={4} />

                {/* Markers for base vectors */}
                <MovablePoint point={v} onMove={setV} color={Theme.blue} />
                <MovablePoint point={w} onMove={setW} color={Theme.red} />

                <LaTeX at={v} tex={String.raw`\vec{v}`} color={Theme.blue} />
                <LaTeX at={w} tex={String.raw`\vec{w}`} color={Theme.red} />
                <LaTeX at={res} tex={String.raw`\vec{u}`} color={Theme.indigo} />
            </Mafs>
        </div>
    );
};


export default VisCombinacioLineal;

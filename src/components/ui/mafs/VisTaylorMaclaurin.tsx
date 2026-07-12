import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisTaylorMaclaurin = () => {
    const [mode, setMode] = React.useState(0);
    const [n, setN] = React.useState(2);

    const configs = [
        {
            label: 'exp(x)',
            f: (x: number) => Math.exp(x),
            p: (x: number, n: number) => {
                let s = 0; let f = 1;
                for (let i = 0; i <= n; i++) { if (i > 0) f *= i; s += Math.pow(x, i) / f; }
                return s;
            },
            view: { x: [-3, 3], y: [-1, 5] }
        },
        {
            label: 'sin(x)',
            f: (x: number) => Math.sin(x),
            p: (x: number, n: number) => {
                let s = 0; let f = 1;
                for (let i = 0; i <= n; i++) {
                    if (i > 0) f *= i;
                    if (i % 2 === 1) s += (Math.pow(-1, (i - 1) / 2) * Math.pow(x, i)) / f;
                }
                return s;
            },
            view: { x: [-5, 5], y: [-2, 2] }
        },
        {
            label: 'cos(x)',
            f: (x: number) => Math.cos(x),
            p: (x: number, n: number) => {
                let s = 0; let f = 1;
                for (let i = 0; i <= n; i++) {
                    if (i > 0) f *= i;
                    if (i % 2 === 0) s += (Math.pow(-1, i / 2) * Math.pow(x, i)) / f;
                }
                return s;
            },
            view: { x: [-5, 5], y: [-2, 2] }
        },
        {
            label: 'ln(1+x)',
            f: (x: number) => Math.log(1 + x),
            p: (x: number, n: number) => {
                let s = 0;
                for (let i = 1; i <= n; i++) {
                    s += (Math.pow(-1, i - 1) * Math.pow(x, i)) / i;
                }
                return s;
            },
            view: { x: [-0.9, 3], y: [-2, 2] }
        },
        {
            label: '1/(1-x)',
            f: (x: number) => 1 / (1 - x),
            p: (x: number, n: number) => {
                let s = 0;
                for (let i = 0; i <= n; i++) s += Math.pow(x, i);
                return s;
            },
            view: { x: [-1.5, 0.9], y: [-1, 5] }
        }
    ];

    return (
        <div className="w-full flex flex-col">
            <div className="p-2 flex flex-wrap gap-1 bg-slate-800/50 border-b border-white/10">
                {configs.map((c, i) => (
                    <button type="button" key={i} onClick={() => setMode(i)} className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-bold transition-all ${mode === i ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>{c.label}</button>
                ))}
            </div>
            <Mafs viewBox={{ x: configs[mode].view.x as [number, number], y: configs[mode].view.y as [number, number] }} pan={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={configs[mode].f} color={Theme.blue} weight={3} opacity={0.3} />
                <Plot.OfX y={(x) => configs[mode].p(x, n)} color={Theme.yellow} weight={3} />
                <Circle center={[0, configs[mode].f(0)]} radius={0.1} color={Theme.blue} />
            </Mafs>
            <div className="bg-slate-800/50 p-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase w-12 text-center">Grau {n}</span>
                    <input type="range" min="0" max="15" step="1" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="flex-1 accent-blue-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                </div>
            </div>
        </div>
    );
};


export default VisTaylorMaclaurin;

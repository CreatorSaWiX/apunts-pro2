import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisUnicitat3x = () => {
    const f = (x: number) => Math.pow(3, -x) - x;
    const df = (x: number) => -Math.pow(3, -x) * Math.log(3) - 1;

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-2, 3], y: [-4, 4] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />

                {/* Eix X per referència */}
                <Plot.OfX y={() => 0} color={"rgba(255, 255, 255, 0.2)"} weight={1} />

                {/* Funció f(x) */}
                <Plot.OfX y={f} color={Theme.blue} weight={4} />

                {/* Derivada f'(x) */}
                <Plot.OfX y={df} color={Theme.red} weight={3} opacity={0.7} />

                {/* Punt de tall (Arrel aproximada a x ≈ 0.455) */}
                <circle cx={0.455} cy={0} r={0.15} fill={Theme.green} stroke="white" strokeWidth={0.05} />

                <LaTeX at={[1.5, f(1.5) + 0.5]} tex="f(x) = 3^{-x} - x" color={Theme.blue} />
                <LaTeX at={[-1, df(-1) + 0.5]} tex="f'(x) < 0" color={Theme.red} />

                <Text x={0.6} y={0.5} color={Theme.green} size={14}>Única arrel</Text>
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] md:text-xs font-mono">
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full" /> f(x) (Decreixent)</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full" /> f'(x) (Sempre negativa)</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full" /> Arrel (Bolzano)</span>
            </div>
        </div>
    );
};


export default VisUnicitat3x;

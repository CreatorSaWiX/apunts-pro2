import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisEx76a = () => {

    const [point, setPoint] = React.useState<[number, number]>([0.5, 0.5]);
    const x = point[0];
    const y = point[1];
    const isIn = x * x - y * y < 1;

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-16">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Conjunt A: <InlineMath math="x^2 - y^2 < 1" /></span>
                    <span className="text-xs font-mono text-white">x² - y² = {(x * x - y * y).toFixed(2)}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${isIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {isIn ? '✓ Punt de A' : '✗ Fora de A'}
                </div>
            </div>
            <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={true}>
                <Coordinates.Cartesian />

                {/* Hyperbola region filling */}
                <Polygon
                    points={[
                        ...Array.from({ length: 41 }, (_, i) => {
                            const yi = -4 + (i / 40) * 8;
                            return [Math.sqrt(Math.max(0, 1 + yi * yi)) - 0.01, yi] as [number, number];
                        }).reverse(),
                        ...Array.from({ length: 41 }, (_, i) => {
                            const yi = -4 + (i / 40) * 8;
                            return [-Math.sqrt(Math.max(0, 1 + yi * yi)) + 0.01, yi] as [number, number];
                        })
                    ]}
                    color={Theme.blue} fillOpacity={0.15} weight={0}
                />

                {/* Boundaries (Dashed because < 1) */}
                <Plot.OfY x={(y) => Math.sqrt(1 + y * y)} color={Theme.blue} weight={2} style="dashed" />
                <Plot.OfY x={(y) => -Math.sqrt(1 + y * y)} color={Theme.blue} weight={2} style="dashed" />

                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />
            </Mafs>
            <div className="p-4 bg-slate-900 border-t border-white/5 text-[10px] text-slate-500 leading-relaxed italic text-center">
                Regió compresa entre les dues branques de la hipèrbola. Com que la desigualtat és estricta, la frontera <InlineMath math="x^2-y^2=1" /> no hi pertany.
            </div>
        </div>
    );
};


export default VisEx76a;

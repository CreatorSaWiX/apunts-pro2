import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisEx71a = () => {
    const [point, setPoint] = React.useState<[number, number]>([0.5, 0.5]);
    const dist = Math.sqrt(point[0] ** 2 + point[1] ** 2);
    const isIn = dist < 1;

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-16">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Conjunt A: <InlineMath math="x^2 + y^2 < 1" /></span>
                    <span className="text-xs font-mono text-white">Distància = {dist.toFixed(3)}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${isIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {isIn ? '✓ Dins del Conjunt' : '✗ Fora del Conjunt'}
                </div>
            </div>
            <Mafs viewBox={{ x: [-1.5, 1.5], y: [-1.5, 1.5] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />
                <Circle
                    center={[0, 0]}
                    radius={1}
                    color={Theme.blue}
                    fillOpacity={0.15}
                    strokeStyle="dashed"
                    weight={3}
                />
                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />
                <LaTeX at={[0.1, -1.2]} tex="x^2 + y^2 < 1" color={Theme.blue} />
            </Mafs>
            <div className="p-4 bg-slate-900 border-t border-white/5 text-[10px] text-slate-500 leading-relaxed italic text-center">
                El <span className="text-blue-400 font-bold">Disc Unitat Obert</span> inclou l'interior però no la vora.
                Observa com en moure el punt cap a la frontera (r=1) l'indicador canvia a vermell.
            </div>
        </div>
    );
};


export default VisEx71a;

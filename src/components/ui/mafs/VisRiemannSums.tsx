import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisRiemannSums = () => {
    const [n, setN] = React.useState(6);
    const [type, setType] = React.useState<'lower' | 'upper'>('lower');
    const [a, setA] = React.useState(0);
    const [b, setB] = React.useState(5);
    
    const f = (x: number) => 0.1 * x * x + 1;
    const dx = (b - a) / n;

    const rectangles = [];
    for (let i = 0; i < n; i++) {
        const x0 = a + i * dx;
        const x1 = a + (i + 1) * dx;
        // Suposem f creixent en l'interval per simplicitat didàctica
        const h = type === 'lower' 
            ? (dx > 0 ? f(x0) : f(x1)) 
            : (dx > 0 ? f(x1) : f(x0));
        
        rectangles.push(
            <Polygon
                key={i}
                points={[[x0, 0], [x1, 0], [x1, h], [x0, h]]}
                color={type === 'lower' ? Theme.blue : Theme.red}
                fillOpacity={0.3}
            />
        );
    }

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-1, 6], y: [-1, 5] }} pan={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                {rectangles}
                <Plot.OfX y={f} color={Theme.red} weight={3} />
                
                {/* Límits de l'integral */}
                <MovablePoint point={[a, 0]} onMove={(p) => setA(p[0])} color={Theme.blue} />
                <MovablePoint point={[b, 0]} onMove={(p) => setB(p[0])} color={Theme.blue} />
                
                <LaTeX at={[a, -0.4]} tex="a" color={Theme.blue} />
                <LaTeX at={[b, -0.4]} tex="b" color={Theme.blue} />
            </Mafs>
            <div className="bg-slate-800/50 p-4 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setType('lower')} className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase ${type === 'lower' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>Inferiors</button>
                        <button type="button" onClick={() => setType('upper')} className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase ${type === 'upper' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-400'}`}>Superiors</button>
                    </div>
                    <div className="flex items-center gap-3 flex-1 px-4">
                        <span className="text-[10px] text-slate-400 uppercase font-bold w-12">Parts: {n}</span>
                        <input type="range" min="2" max="40" step="1" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="flex-1 accent-indigo-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default VisRiemannSums;

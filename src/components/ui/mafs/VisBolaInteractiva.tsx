import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisBolaInteractiva = () => {
    const [r, setR] = React.useState(1.5);
    const [isClosed, setIsClosed] = React.useState(false);
    const [point, setPoint] = React.useState<[number, number]>([1, 1]);

    const dist = Math.sqrt(point[0] ** 2 + point[1] ** 2);
    const isIn = isClosed ? dist <= r : dist < r;

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Radi:</span>
                    <input
                        type="range" min="0.5" max="2.5" step="0.1" value={r}
                        onChange={(e) => setR(parseFloat(e.target.value))}
                        className="w-32 accent-blue-500"
                    />
                    <span className="text-xs font-mono text-blue-400 w-8">{r.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 p-1 rounded-lg">
                    <button type="button"
                        onClick={() => setIsClosed(false)}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition ${!isClosed ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        OBERTA
                    </button>
                    <button type="button"
                        onClick={() => setIsClosed(true)}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition ${isClosed ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        TANCADA
                    </button>
                </div>
            </div>
            <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />
                <Circle
                    center={[0, 0]}
                    radius={r}
                    color={Theme.blue}
                    fillOpacity={0.1}
                    strokeStyle={isClosed ? "solid" : "dashed"}
                />
                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />
                <LaTeX at={[0, -2.5]} tex={isClosed ? `\\bar{B}(\\vec{0}, ${r.toFixed(1)}) = \\{ \\vec{x} : d(\\vec{x},\\vec{0}) \\le ${r.toFixed(1)} \\}` : `B(\\vec{0}, ${r.toFixed(1)}) = \\{ \\vec{x} : d(\\vec{x},\\vec{0}) < ${r.toFixed(1)} \\}`} color={Theme.blue} />
            </Mafs>
            <div className="p-4 bg-slate-800/80 text-[11px] text-slate-300 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isIn ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>El punt {isIn ? 'pertany' : 'no pertany'} a la bola.</span>
                </div>
            </div>
        </div>
    );
};


export default VisBolaInteractiva;

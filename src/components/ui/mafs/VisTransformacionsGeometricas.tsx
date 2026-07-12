import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisTransformacionsGeometricas = () => {
    const [type, setType] = React.useState<'rot' | 'ref' | 'proj' | 'esc'>('rot');
    const [alpha, setAlpha] = React.useState(45);
    const [k, setK] = React.useState(1.5);
    
    const rad = (alpha * Math.PI) / 180;
    
    const getMatrix = () => {
        switch(type) {
            case 'rot': return [Math.cos(rad), -Math.sin(rad), Math.sin(rad), Math.cos(rad)];
            case 'ref': return [1, 0, 0, -1];
            case 'proj': return [1, 0, 0, 0];
            case 'esc': return [k, 0, 0, k];
        }
    };

    const m = getMatrix();
    const f = (x: number, y: number): [number, number] => [m[0]*x + m[1]*y, m[2]*x + m[3]*y];

    const shape = [
        [0, 0], [0, 3], [2, 3], [2, 2.5], [0.5, 2.5], [0.5, 1.8], [1.5, 1.8], [1.5, 1.3], [0.5, 1.3], [0.5, 0], [0, 0]
    ];

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-hidden border border-white/5 rounded-2xl shadow-2xl">
            {/* Control Header */}
            <div className="p-6 bg-slate-900/80 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                    <button type="button" onClick={() => setType('rot')} className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${type === 'rot' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Rotació</button>
                    <button type="button" onClick={() => setType('ref')} className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${type === 'ref' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Reflexió</button>
                    <button type="button" onClick={() => setType('proj')} className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${type === 'proj' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Projecció</button>
                    <button type="button" onClick={() => setType('esc')} className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${type === 'esc' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Escalat</button>
                </div>

                <div className="flex gap-8 min-w-[200px]">
                    {type === 'rot' && (
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex justify-between">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Angle</span>
                                <span className="text-[10px] font-mono text-indigo-400">{alpha}º</span>
                            </div>
                            <input type="range" min="0" max="360" value={alpha} onChange={(e) => setAlpha(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                        </div>
                    )}
                    {type === 'esc' && (
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex justify-between">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Factor</span>
                                <span className="text-[10px] font-mono text-emerald-400">{k.toFixed(1)}x</span>
                            </div>
                            <input type="range" min="0.1" max="2.5" step="0.1" value={k} onChange={(e) => setK(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                {/* Visualizer */}
                <div className="relative bg-slate-900/20 min-h-[400px] border-b md:border-b-0 md:border-r border-white/5">
                    <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        {/* Original Shadow */}
                        <Polygon points={shape as any} color={Theme.blue} fillOpacity={0.05} weight={1} />
                        {/* Transformed Shape */}
                        <Polygon 
                            points={shape.map(p => f(p[0], p[1])) as any} 
                            color={type === 'rot' ? Theme.indigo : (type === 'ref' ? Theme.red : (type === 'proj' ? Theme.orange : Theme.green))} 
                            fillOpacity={0.15}
                            weight={3}
                        />
                    </Mafs>
                </div>

                {/* Matrix Panel */}
                <div className="bg-slate-900/10 p-8 flex flex-col justify-center items-center gap-8">
                    <div className="relative p-8 bg-black/40 rounded-3xl border border-white/5 shadow-2xl flex items-center gap-8">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase border border-white/5 tracking-[0.2em]">Matriu Associada</div>
                        <div className="text-4xl text-slate-700 font-serif italic">M =</div>
                        <div className="relative px-8 py-6 flex flex-col gap-6 font-mono text-2xl">
                            {/* Brackets */}
                            <div className="absolute left-0 top-0 bottom-0 w-4 border-l-2 border-t-2 border-b-2 border-white/20 rounded-l-2xl" />
                            <div className="absolute right-0 top-0 bottom-0 w-4 border-r-2 border-t-2 border-b-2 border-white/20 rounded-r-2xl" />
                            
                            <div className="flex gap-16">
                                <span className="w-16 text-center text-white transition-all hover:scale-125 hover:text-indigo-400">{m[0].toFixed(2)}</span>
                                <span className="w-16 text-center text-white transition-all hover:scale-125 hover:text-indigo-400">{m[1].toFixed(2)}</span>
                            </div>
                            <div className="flex gap-16">
                                <span className="w-16 text-center text-white transition-all hover:scale-125 hover:text-indigo-400">{m[2].toFixed(2)}</span>
                                <span className="w-16 text-center text-white transition-all hover:scale-125 hover:text-indigo-400">{m[3].toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.1em] text-center max-w-[200px] leading-relaxed">
                        Aquesta matriu defineix com es mou cada punt de la "F"
                    </p>
                </div>
            </div>
        </div>
    );
};


export default VisTransformacionsGeometricas;

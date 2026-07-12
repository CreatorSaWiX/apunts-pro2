import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisComposicioAplicacions = () => {
    const [v, setV] = React.useState<[number, number]>([1, 1]);
    
    // f: rotació 45º
    const angleF = Math.PI / 4;
    const mF = [Math.cos(angleF), -Math.sin(angleF), Math.sin(angleF), Math.cos(angleF)];
    
    // g: escalat (2, 0.5)
    const mG = [2, 0, 0, 0.5];
    
    const f = (p: [number, number]): [number, number] => [mF[0]*p[0] + mF[1]*p[1], mF[2]*p[0] + mF[3]*p[1]];
    const g = (p: [number, number]): [number, number] => [mG[0]*p[0] + mG[1]*p[1], mG[2]*p[0] + mG[3]*p[1]];

    const fv = f(v);
    const gfv = g(fv);

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
            <div className="p-6 bg-slate-900/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Cadenes de Transformació</span>
                    <span className="text-[12px] text-slate-400 font-serif italic">{"Composició: (g ∘ f)(v) = g(f(v))"}</span>
                </div>
                <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/10">
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] text-slate-500 uppercase font-black">Entrada</span>
                        <span className="text-[10px] font-mono text-blue-400">({v[0].toFixed(1)}, {v[1].toFixed(1)})</span>
                    </div>
                    <div className="w-4 h-px bg-white/10" />
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] text-slate-500 uppercase font-black">Sortida</span>
                        <span className="text-[10px] font-mono text-emerald-400">({gfv[0].toFixed(1)}, {gfv[1].toFixed(1)})</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5 min-h-[300px]">
                {/* 1. DOMINI */}
                <div className="relative bg-slate-900/20">
                    <div className="absolute top-4 left-4 z-10">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">1. Vector Original</span>
                    </div>
                    <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Vector tail={[0, 0]} tip={v} color={Theme.blue} weight={4} />
                        <MovablePoint point={v} onMove={setV} color={Theme.blue} />
                        <LaTeX at={v} tex="\vec{v}" color={Theme.blue} />
                    </Mafs>
                </div>

                {/* 2. INTERMEDI (f) */}
                <div className="relative bg-slate-900/10">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">2. Pas f: Rotació 45º</span>
                    </div>
                    <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Vector tail={[0, 0]} tip={v} color={Theme.blue} opacity={0.1} style="dashed" />
                        <Vector tail={[0, 0]} tip={fv} color={Theme.indigo} weight={4} />
                        <LaTeX at={fv} tex="f(\vec{v})" color={Theme.indigo} />
                    </Mafs>
                </div>

                {/* 3. FINAL (g ∘ f) */}
                <div className="relative bg-slate-900/5">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">3. Pas g: Escalat (2, 0.5)</span>
                    </div>
                    <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Vector tail={[0, 0]} tip={fv} color={Theme.indigo} opacity={0.1} style="dashed" />
                        <Vector tail={[0, 0]} tip={gfv} color={Theme.green} weight={4} />
                        <LaTeX at={gfv} tex="g(f(\vec{v}))" color={Theme.green} />
                    </Mafs>
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/5 text-center">
                <p className="text-[10px] text-slate-400 italic max-w-2xl mx-auto leading-relaxed">
                    La composició és com una cadena de muntatge. L'ordre importa: <strong className="text-white italic">M(g ∘ f) = M(g) · M(f)</strong>. 
                    Fixa't com el vector primer rota (f) i després s'estira (g). Si canviéssim l'ordre, el resultat seria diferent!
                </p>
            </div>
        </div>
    );
};


export default VisComposicioAplicacions;

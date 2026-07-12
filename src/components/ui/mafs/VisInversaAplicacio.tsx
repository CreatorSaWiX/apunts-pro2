import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisInversaAplicacio = () => {
    const [v, setV] = React.useState<[number, number]>([2, 1]);
    
    // f: Deformació (Shear)
    const m = [1, 1, 0, 1];
    // f^-1: Deformació inversa
    const minv = [1, -1, 0, 1];
    
    const f = (p: [number, number]): [number, number] => [m[0]*p[0] + m[1]*p[1], m[2]*p[0] + m[3]*p[1]];
    const finv = (p: [number, number]): [number, number] => [minv[0]*p[0] + minv[1]*p[1], minv[2]*p[0] + minv[3]*p[1]];
    
    const fv = f(v);
    const restoredV = finv(fv);

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
            <div className="p-6 bg-slate-900/80 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Inversió d'Aplicacions</span>
                    <span className="text-[12px] text-slate-400 font-serif italic">{"L'efecte CTRL+Z: f⁻¹(f(v)) = v"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Isomorfisme (Det ≠ 0)
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5 min-h-[350px]">
                {/* 1. DIRECTA */}
                <div className="relative bg-slate-900/20">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">1. Transformació f</span>
                        <span className="text-[8px] text-slate-500 font-mono uppercase">Shear Horitzontal</span>
                    </div>
                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <MovablePoint point={v} onMove={setV} color={Theme.blue} />
                        <Vector tail={[0, 0]} tip={v} color={Theme.blue} opacity={0.1} style="dashed" />
                        <Vector tail={[0, 0]} tip={fv} color={Theme.indigo} weight={4} />
                        
                        <LaTeX at={v} tex="\vec{v}" color={Theme.blue} />
                        <LaTeX at={fv} tex="f(\vec{v})" color={Theme.indigo} />
                    </Mafs>
                </div>

                {/* 2. INVERSA */}
                <div className="relative bg-slate-900/10">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">2. Recuperació f⁻¹</span>
                        <span className="text-[8px] text-slate-500 font-mono uppercase">Matriu Inversa</span>
                    </div>
                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        <Vector tail={[0, 0]} tip={fv} color={Theme.indigo} opacity={0.1} style="dashed" />
                        <Vector tail={[0, 0]} tip={restoredV} color={Theme.green} weight={4} />
                        
                        <LaTeX at={fv} tex="f(\vec{v})" color={Theme.indigo} />
                        <LaTeX at={restoredV} tex="f^{-1}(f(\vec{v}))" color={Theme.green} />
                    </Mafs>
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/5">
                <p className="text-[10px] text-slate-400 text-center leading-relaxed max-w-2xl mx-auto">
                    <strong className="text-white">Interactua:</strong> Mou el vector <span className="text-blue-400 font-bold">v</span>. 
                    Si l'aplicació és bijectiva, sempre podem trobar una matriu inversa que ens retorni exactament al punt d'origen. 
                    És com si la segona màquina desfés la deformació de la primera.
                </p>
            </div>
        </div>
    );
};


export default VisInversaAplicacio;

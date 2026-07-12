import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisAxiomesProducte = () => {
    const [axiom, setAxiom] = React.useState<'e5' | 'e6' | 'e7' | 'e8'>('e6');
    const [u, setU] = React.useState<[number, number]>([2, 1]);
    const [v, setV] = React.useState<[number, number]>([0, 2]);
    const lambda = 1.5;
    const mu = 2;

    return (
        <div className="w-full flex flex-col">
            <div className="p-2 flex flex-wrap justify-center gap-1.5 bg-slate-900/60 border-b border-white/5">
                <button type="button" onClick={() => setAxiom('e6')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${axiom === 'e6' ? 'bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>e6 Distr u+v</button>
                <button type="button" onClick={() => setAxiom('e7')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${axiom === 'e7' ? 'bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>e7 Distr λ+μ</button>
                <button type="button" onClick={() => setAxiom('e5')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${axiom === 'e5' ? 'bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>e5 Pseudo-assoc</button>
                <button type="button" onClick={() => setAxiom('e8')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${axiom === 'e8' ? 'bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>e8 Neutre K</button>
            </div>

            <div className="flex-1 relative overflow-hidden">
                <Mafs viewBox={{ x: [-1, 5], y: [-1, 5] }} pan={false} preserveAspectRatio={false}>
                    <Coordinates.Cartesian />

                    {axiom === 'e6' && (
                        <>
                            <MovablePoint point={u} onMove={setU} color={Theme.blue} />
                            <MovablePoint point={v} onMove={setV} color={Theme.red} />
                            <Vector tail={[0, 0]} tip={u} color={Theme.blue} />
                            <Vector tail={[0, 0]} tip={v} color={Theme.red} />
                            <Vector tail={[0, 0]} tip={[u[0] + v[0], u[1] + v[1]]} color={Theme.pink} opacity={0.3} />
                            <Vector tail={[0, 0]} tip={[lambda * (u[0] + v[0]), lambda * (u[1] + v[1])]} color={Theme.yellow} weight={3} />
                            <LaTeX at={u} tex="u" color={Theme.blue} />
                            <LaTeX at={v} tex="v" color={Theme.red} />
                            <LaTeX at={[lambda * (u[0] + v[0]), lambda * (u[1] + v[1])]} tex="\lambda(u+v)" color={Theme.yellow} />
                        </>
                    )}

                    {axiom === 'e7' && (
                        <>
                            <MovablePoint point={u} onMove={setU} color={Theme.blue} />
                            <Vector tail={[0, 0]} tip={u} color={Theme.blue} />
                            <Vector tail={[0, 0]} tip={[lambda * u[0], lambda * u[1]]} color={Theme.indigo} opacity={0.5} />
                            <Vector tail={[0, 0]} tip={[(lambda + mu) * u[0], (lambda + mu) * u[1]]} color={Theme.yellow} weight={3} />
                            <LaTeX at={u} tex="u" color={Theme.blue} />
                            <LaTeX at={[lambda * u[0], lambda * u[1]]} tex="\lambda u" color={Theme.indigo} />
                            <LaTeX at={[(lambda + mu) * u[0], (lambda + mu) * u[1]]} tex="(\lambda+\mu)u" color={Theme.yellow} />
                        </>
                    )}

                    {axiom === 'e5' && (
                        <>
                            <MovablePoint point={u} onMove={setU} color={Theme.blue} />
                            <Vector tail={[0, 0]} tip={u} color={Theme.blue} />
                            <Vector tail={[0, 0]} tip={[mu * u[0], mu * u[1]]} color={Theme.indigo} />
                            <Vector tail={[0, 0]} tip={[lambda * mu * u[0], lambda * mu * u[1]]} color={Theme.yellow} weight={3} />
                            <LaTeX at={u} tex="u" color={Theme.blue} />
                            <LaTeX at={[mu * u[0], mu * u[1]]} tex="\mu u" color={Theme.indigo} />
                            <LaTeX at={[lambda * mu * u[0], lambda * mu * u[1]]} tex="\lambda(\mu u)" color={Theme.yellow} />
                        </>
                    )}

                    {axiom === 'e8' && (
                        <>
                            <MovablePoint point={u} onMove={setU} color={Theme.blue} />
                            <Vector tail={[0, 0]} tip={u} color={Theme.blue} />
                            <Vector tail={[0, 0]} tip={u} color={Theme.yellow} weight={3} opacity={0.5} />
                            <LaTeX at={u} tex="1 \cdot u = u" color={Theme.yellow} />
                        </>
                    )}
                </Mafs>
            </div>
            <div className="bg-slate-900/80 p-3 border-t border-white/5 text-[9px] text-center text-slate-500 font-medium">
                <span className="text-white">Arrossega els punts</span> per modificar els vectors i observar les propietats del producte escalar.
            </div>
        </div>
    );
};


export default VisAxiomesProducte;

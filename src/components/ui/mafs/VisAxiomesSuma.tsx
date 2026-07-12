import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisAxiomesSuma = () => {
    const [axiom, setAxiom] = React.useState<'e2' | 'e1' | 'e3' | 'e4'>('e2');
    const [u, setU] = React.useState<[number, number]>([2, 1]);
    const [v, setV] = React.useState<[number, number]>([1, 2]);
    const [w, setW] = React.useState<[number, number]>([-1, 1]);

    const sumUV: [number, number] = [u[0] + v[0], u[1] + v[1]];
    const sumUVW: [number, number] = [u[0] + v[0] + w[0], u[1] + v[1] + w[1]];

    return (
        <div className="w-full flex flex-col">
            <div className="p-2 flex flex-wrap justify-center gap-1.5 bg-slate-900/60 border-b border-white/5">
                <button type="button" onClick={() => setAxiom('e2')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${axiom === 'e2' ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>e2 Commutativa</button>
                <button type="button" onClick={() => setAxiom('e1')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${axiom === 'e1' ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>e1 Associativa</button>
                <button type="button" onClick={() => setAxiom('e3')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${axiom === 'e3' ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>e3 Neutre</button>
                <button type="button" onClick={() => setAxiom('e4')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${axiom === 'e4' ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>e4 Oposat</button>
            </div>

            <div className="flex-1 relative overflow-hidden">
                <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} preserveAspectRatio={false}>
                    <Coordinates.Cartesian />

                    {axiom === 'e2' && (
                        <>
                            <MovablePoint point={u} onMove={setU} color={Theme.blue} />
                            <MovablePoint point={v} onMove={setV} color={Theme.red} />
                            <Vector tail={[0, 0]} tip={u} color={Theme.blue} />
                            <Vector tail={[0, 0]} tip={v} color={Theme.red} />
                            <Vector tail={u} tip={sumUV} color={Theme.red} opacity={0.4} weight={1} />
                            <Vector tail={v} tip={sumUV} color={Theme.blue} opacity={0.4} weight={1} />
                            <Vector tail={[0, 0]} tip={sumUV} color={Theme.yellow} weight={3} />
                            <LaTeX at={u} tex="u" color={Theme.blue} />
                            <LaTeX at={v} tex="v" color={Theme.red} />
                            <LaTeX at={sumUV} tex="u+v = v+u" color={Theme.yellow} />
                        </>
                    )}

                    {axiom === 'e1' && (
                        <>
                            <MovablePoint point={u} onMove={setU} color={Theme.blue} />
                            <MovablePoint point={v} onMove={setV} color={Theme.red} />
                            <MovablePoint point={w} onMove={setW} color={Theme.green} />

                            <Vector tail={[0, 0]} tip={u} color={Theme.blue} />
                            <Vector tail={u} tip={sumUV} color={Theme.red} />
                            <Vector tail={sumUV} tip={sumUVW} color={Theme.green} />
                            <Vector tail={[0, 0]} tip={sumUVW} color={Theme.yellow} weight={3} />

                            <LaTeX at={u} tex="u" color={Theme.blue} />
                            <LaTeX at={sumUV} tex="u+v" color={Theme.red} />
                            <LaTeX at={sumUVW} tex="(u+v)+w" color={Theme.yellow} />
                        </>
                    )}

                    {axiom === 'e3' && (
                        <>
                            <MovablePoint point={u} onMove={setU} color={Theme.blue} />
                            <Vector tail={[0, 0]} tip={u} color={Theme.blue} />
                            <Circle center={[0, 0]} radius={0.15} color={Theme.yellow} fillOpacity={1} />
                            <LaTeX at={u} tex="u + 0_E = u" color={Theme.blue} />
                            <LaTeX at={[0.3, -0.3]} tex="0_E" color={Theme.yellow} />
                        </>
                    )}

                    {axiom === 'e4' && (
                        <>
                            <MovablePoint point={u} onMove={setU} color={Theme.blue} />
                            <Vector tail={[0, 0]} tip={u} color={Theme.blue} />
                            <Vector tail={[0, 0]} tip={[-u[0], -u[1]]} color={Theme.red} />
                            <Circle center={[0, 0]} radius={0.15} color={Theme.yellow} fillOpacity={1} />
                            <LaTeX at={u} tex="u" color={Theme.blue} />
                            <LaTeX at={[-u[0], -u[1]]} tex="-u" color={Theme.red} />
                        </>
                    )}
                </Mafs>
            </div>
            <div className="bg-slate-900/80 p-3 border-t border-white/5 text-[9px] text-center text-slate-500 font-medium">
                <span className="text-white">Arrossega els punts</span> per modificar els vectors i comprovar que l'axioma sempre es compleix.
            </div>
        </div>
    );
};


export default VisAxiomesSuma;

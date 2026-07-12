import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisClassificacioConjunts = () => {
    const [type, setType] = React.useState<'obert' | 'tancat' | 'acotat' | 'compacte'>('obert');
    const [point, setPoint] = React.useState<[number, number]>([1, 1]);

    const r = 1.5;
    const dist = Math.sqrt(point[0] ** 2 + point[1] ** 2);

    // Lògica de pertinença
    const isIn = type === 'obert' ? dist < r : dist <= r;

    return (
        <div className="w-full flex flex-col">
            <div className="p-2 flex flex-wrap gap-1 bg-slate-800/50 border-b border-white/10">
                {['obert', 'tancat', 'acotat', 'compacte'].map((t) => (
                    <button type="button" key={t} onClick={() => setType(t as any)} className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-black transition-all ${type === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:bg-slate-700'}`}>{t}</button>
                ))}
            </div>

            <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />

                {/* Conjunt Principal */}
                <Circle
                    center={[0, 0]}
                    radius={r}
                    color={Theme.blue}
                    fillOpacity={0.1}
                    strokeStyle={(type === 'obert') ? "dashed" : "solid"}
                    weight={3}
                />

                {/* Bola que l'acota (per Acotat/Compacte) */}
                {(type === 'acotat' || type === 'compacte') && (
                    <Circle center={[0, 0]} radius={2.5} color={Theme.yellow} fillOpacity={0} strokeStyle="dashed" weight={1} />
                )}

                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />

                {/* Labels de definició */}
                <LaTeX
                    at={[0, -2.5]}
                    tex={type === 'obert' ? "A \\cap Fr(A) = \\emptyset \\implies Obert" :
                        type === 'tancat' ? "Fr(A) \\subseteq A \\implies Tancat" :
                            type === 'acotat' ? "\\exists B(0, R) : A \\subseteq B \\implies Acotat" :
                                "Tancat + Acotat \\implies Compacte"}
                    color={Theme.blue}
                />
            </Mafs>

            <div className="bg-slate-800/50 p-4 border-t border-white/10">
                <p className="text-[11px] text-slate-300 text-center italic">
                    {type === 'obert' && "Vora discontínua: els punts del límit NO són del conjunt."}
                    {type === 'tancat' && "Vora contínua: el conjunt inclou la seva frontera."}
                    {type === 'acotat' && "Es pot tancar dins d'una bola groga finita."}
                    {type === 'compacte' && "És 'segur' l'extrem: tancat (vora plena) i no s'escapa a l'infinit."}
                </p>
            </div>
        </div>
    );
};


export default VisClassificacioConjunts;

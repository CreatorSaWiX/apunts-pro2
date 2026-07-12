import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisM1T6Ex6_3 = () => {
    const [op, setOp] = React.useState<'sum' | 'sub1' | 'sub2'>('sum');
    const v1: [number, number] = [2, 6];
    const v2: [number, number] = [-4, -8];
    const v3: [number, number] = [-1, 5];
    const v4: [number, number] = [3, 0];

    let result: [number, number] = [0, 0];
    if (op === 'sum') result = [v1[0] + v2[0], v1[1] + v2[1]];
    else if (op === 'sub1') result = [v1[0] - v3[0], v1[1] - v3[1]];
    else result = [v2[0] - v4[0], v2[1] - v4[1]];

    return (
        <div className="w-full flex flex-col">
            <div className="p-2 flex justify-center gap-2 bg-slate-900/40 border-b border-white/5">
                <button type="button" onClick={() => setOp('sum')} className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${op === 'sum' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>v1 + v2</button>
                <button type="button" onClick={() => setOp('sub1')} className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${op === 'sub1' ? 'bg-green-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>v1 - v3</button>
                <button type="button" onClick={() => setOp('sub2')} className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${op === 'sub2' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>v2 - v4</button>
            </div>
            <Mafs viewBox={{ x: [-8, 5], y: [-10, 8] }} pan={true} zoom={true}>
                <Coordinates.Cartesian subdivisions={5} />
                {op === 'sum' && (
                    <>
                        <Vector tail={[0, 0]} tip={v1} color={Theme.blue} />
                        <Vector tail={v1} tip={[v1[0] + v2[0], v1[1] + v2[1]]} color={Theme.blue} opacity={0.5} />
                        <Vector tail={[0, 0]} tip={result} color={Theme.yellow} weight={4} />
                        <LaTeX at={v1} tex="v_1" color={Theme.blue} />
                        <LaTeX at={result} tex="v_1 + v_2" color={Theme.yellow} />
                    </>
                )}
                {op === 'sub1' && (
                    <>
                        <Vector tail={[0, 0]} tip={v1} color={Theme.blue} />
                        <Vector tail={v1} tip={[v1[0] - v3[0], v1[1] - v3[1]]} color={Theme.green} opacity={0.5} />
                        <Vector tail={[0, 0]} tip={result} color={Theme.yellow} weight={4} />
                        <LaTeX at={v1} tex="v_1" color={Theme.blue} />
                        <LaTeX at={result} tex="v_1 - v_3" color={Theme.yellow} />
                    </>
                )}
                {op === 'sub2' && (
                    <>
                        <Vector tail={[0, 0]} tip={v2} color={Theme.red} />
                        <Vector tail={v2} tip={[v2[0] - v4[0], v2[1] - v4[1]]} color={Theme.orange} opacity={0.5} />
                        <Vector tail={[0, 0]} tip={result} color={Theme.yellow} weight={4} />
                        <LaTeX at={v2} tex="v_2" color={Theme.red} />
                        <LaTeX at={result} tex="v_2 - v_4" color={Theme.yellow} />
                    </>
                )}
            </Mafs>
            <div className="bg-slate-800/80 p-3 border-t border-white/10 text-[10px] text-center text-slate-400 italic">
                Mètode punta-cua: El vector groc és el resultat de l'operació.
            </div>
        </div>
    );
};



export default VisM1T6Ex6_3;

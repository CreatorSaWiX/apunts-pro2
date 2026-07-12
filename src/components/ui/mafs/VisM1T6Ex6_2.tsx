import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisM1T6Ex6_2 = () => {
    const v1: [number, number] = [2, 6];
    const v2: [number, number] = [-4, -8];
    const v3: [number, number] = [-1, 5];
    const v4: [number, number] = [3, 0];

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-5, 5], y: [-10, 8] }} pan={true} zoom={true}>
                <Coordinates.Cartesian subdivisions={5} />
                <Vector tail={[0, 0]} tip={v1} color={Theme.blue} weight={4} />
                <LaTeX at={[v1[0], v1[1] + 0.5]} tex="v_1 = (2, 6)" color={Theme.blue} />
                <Vector tail={[0, 0]} tip={v2} color={Theme.red} weight={4} />
                <LaTeX at={[v2[0], v2[1] - 0.5]} tex="v_2 = (-4, -8)" color={Theme.red} />
                <Vector tail={[0, 0]} tip={v3} color={Theme.green} weight={4} />
                <LaTeX at={[v3[0], v3[1] + 0.5]} tex="v_3 = (-1, 5)" color={Theme.green} />
                <Vector tail={[0, 0]} tip={v4} color={Theme.orange} weight={4} />
                <LaTeX at={[v4[0], v4[1] + 0.5]} tex="v_4 = (3, 0)" color={Theme.orange} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 flex flex-wrap justify-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full" /> v1</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full" /> v2</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full" /> v3</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full" /> v4</span>
            </div>
        </div>
    );
};


export default VisM1T6Ex6_2;

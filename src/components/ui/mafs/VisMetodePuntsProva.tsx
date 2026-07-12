import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisMetodePuntsProva = () => {
    const [point, setPoint] = React.useState<[number, number]>([1, 1]);
    const isIn = point[0] ** 2 + point[1] ** 2 <= 4;

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />

                {/* Regió del domini */}
                <Circle center={[0, 0]} radius={2} color={Theme.blue} fillOpacity={isIn ? 0.3 : 0.05} weight={3} />

                {/* Punt de test */}
                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />

                {/* Label dinàmic amb escapament correte i coordenades reals */}
                <LaTeX
                    at={[point[0], point[1] + 0.4]}
                    tex={isIn
                        ? `${point[0].toFixed(1)}^2 + ${point[1].toFixed(1)}^2 \\le 4 \\text{ (SÍ)}`
                        : `${point[0].toFixed(1)}^2 + ${point[1].toFixed(1)}^2 > 4 \\text{ (NO)}`
                    }
                    color={isIn ? Theme.green : Theme.red}
                />

                <LaTeX at={[0, -2.5]} tex="x^2 + y^2 \le 4" color={Theme.blue} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-xs">
                <span className={isIn ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                    {isIn ? "PUNT DINTRE: Sombregem tot l'interior." : "PUNT FORA: Aquesta zona no és del domini."}
                </span>
                <br /> <span className="text-slate-500 italic">Mou el punt per provar la inecuació.</span>
            </div>
        </div>
    );
};


export default VisMetodePuntsProva;

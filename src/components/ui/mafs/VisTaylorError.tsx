import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisTaylorError = () => {
    const f = (x: number) => Math.exp(x / 2);
    // P2 centrat a 0: f(0) + f'(0)x + f''(0)/2 x^2 = 1 + 0.5x + 0.125x^2
    const p2 = (x: number) => 1 + 0.5 * x + 0.125 * x * x;
    const errorLimit = 0.2;

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-2, 2], y: [0, 3] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Zona d'error admissible */}
                <Polygon
                    points={[
                        ...Array.from({ length: 41 }, (_, i) => {
                            const x = -2 + (i / 40) * 4;
                            return [x, f(x) + errorLimit] as [number, number];
                        }),
                        ...Array.from({ length: 41 }, (_, i) => {
                            const x = 2 - (i / 40) * 4;
                            return [x, f(x) - errorLimit] as [number, number];
                        })
                    ]}
                    color={Theme.green}
                    fillOpacity={0.15}
                    weight={0}
                />

                <Plot.OfX y={f} color={Theme.blue} weight={3} />
                <Plot.OfX y={p2} color={Theme.yellow} weight={3} />

                <LaTeX at={[0, 1.3]} tex="a=0" color={Theme.blue} />
                <LaTeX at={[1, 2.5]} tex="|R_2| \le 0.2" color={Theme.green} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
                La franja <span className="text-green-400 font-bold">verda</span> representa un error màxim permès de <InlineMath math="\pm 0.2" />.
                Observa que el polinomi groc és una bona aproximació només mentre es manté dins d'aquesta franja.
                Quan <InlineMath math="|x-a|" /> creix, l'error es dispara.
            </div>
        </div>
    );
};


export default VisTaylorError;

import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisTeoremaMitjana = () => {
    const f = (x: number) => Math.sin(x) + 2;
    const a = 0.5;
    const b = 4;
    // Valor mitjà aproximat per a la visualització
    const fMitja = 2.15;
    const c = 3.0; // Punt on f(c) = fMitja aproximat

    return (
        <div className="w-full h-full flex flex-col">
            <Mafs viewBox={{ x: [-0.5, 5], y: [-0.5, 4] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Àrea sota la corba */}
                <Polygon
                    points={[
                        [a, 0],
                        ...Array.from({ length: 30 }, (_, i) => {
                            const x = a + (i / 29) * (b - a);
                            return [x, f(x)] as [number, number];
                        }),
                        [b, 0]
                    ]}
                    color={Theme.blue}
                    fillOpacity={0.2}
                />

                {/* Rectangle de la mitjana */}
                <Polygon
                    points={[[a, 0], [b, 0], [b, fMitja], [a, fMitja]]}
                    color={Theme.green}
                    fillOpacity={0.2}
                    weight={2}
                />

                <Plot.OfX y={f} color={Theme.blue} weight={3} />
                <Line.Segment point1={[a, fMitja]} point2={[b, fMitja]} color={Theme.green} weight={3} />

                <circle cx={c} cy={f(c)} r={0.15} fill={Theme.green} stroke="white" />

                <LaTeX at={[c, f(c) + 0.4]} tex="f(c)" color={Theme.green} />
                <LaTeX at={[a, -0.4]} tex="a" color="white" />
                <LaTeX at={[b, -0.4]} tex="b" color="white" />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-xs text-slate-400 leading-relaxed">
                L'àrea del <span className="text-green-400 font-bold">rectangle verd</span> és exactament igual a l'àrea <span className="text-blue-400 font-bold">blava</span> sota la corba.
                L'alçada <InlineMath math="f(c)" /> representa el valor mitjà de la funció en l'interval.
            </div>
        </div>
    );
};


export default VisTeoremaMitjana;

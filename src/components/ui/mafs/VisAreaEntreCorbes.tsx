import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisAreaEntreCorbes = () => {
    const f = (x: number) => -0.5 * x * x + 3;
    const g = (x: number) => 0.5 * x + 1;
    // Punts de tall aproximats per a la visualització: x = -2.5, x = 1.5
    const a = -2.56;
    const b = 1.56;

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-4, 4], y: [-1, 5] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />

                {/* Àrea entre f i g */}
                <Polygon
                    points={[
                        ...Array.from({ length: 30 }, (_, i) => {
                            const x = a + (i / 29) * (b - a);
                            return [x, f(x)] as [number, number];
                        }),
                        ...Array.from({ length: 30 }, (_, i) => {
                            const x = b - (i / 29) * (b - a);
                            return [x, g(x)] as [number, number];
                        })
                    ]}
                    color={Theme.yellow}
                    fillOpacity={0.3}
                />

                <Plot.OfX y={f} color={Theme.blue} weight={3} />
                <Plot.OfX y={g} color={Theme.red} weight={3} />

                <LaTeX at={[a, f(a) + 0.5]} tex="x_1" color="white" />
                <LaTeX at={[b, f(b) + 0.5]} tex="x_2" color="white" />

                <LaTeX at={[0, 4]} tex="f(x)" color={Theme.blue} />
                <LaTeX at={[2, 1.5]} tex="g(x)" color={Theme.red} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-xs text-slate-400">
                L'àrea groga es calcula com <InlineMath math="\int_{x_1}^{x_2} (f(x) - g(x)) dx" />, on <InlineMath math="f(x)" /> és el sostre i <InlineMath math="g(x)" /> el terra.
            </div>
        </div>
    );
};


export default VisAreaEntreCorbes;

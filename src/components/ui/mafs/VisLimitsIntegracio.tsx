import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisLimitsIntegracio = () => {
    const [x, setX] = React.useState([1.5, 0]);
    const f = (t: number) => 1.8 + 1.2 * Math.sin(1.5 * t);
    const u = (val: number) => val * 0.4;
    const v = (val: number) => val + 1.5;

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-0.2, 5.5], y: [-0.2, 4.5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                <Polygon
                    points={[
                        [u(x[0]), 0],
                        ...Array.from({ length: 40 }, (_, i) => {
                            const t = u(x[0]) + (i / 39) * (v(x[0]) - u(x[0]));
                            return [t, f(t)] as [number, number];
                        }),
                        [v(x[0]), 0]
                    ]}
                    color={Theme.indigo}
                    fillOpacity={0.4}
                />

                <Plot.OfX y={f} color={Theme.blue} weight={2} opacity={0.3} />

                <MovablePoint point={[x[0], 0]} onMove={(p) => setX([Math.max(0.2, Math.min(3.5, p[0])), 0])} color={Theme.yellow} />

                {/* Vectors Velocitat del límit / Derivades */}
                <Vector tail={[v(x[0]), f(v(x[0])) / 2]} tip={[v(x[0]) + 1.2, f(v(x[0])) / 2]} color={Theme.green} weight={3} />
                <Vector tail={[u(x[0]), f(u(x[0])) / 2]} tip={[u(x[0]) + 0.5, f(u(x[0])) / 2]} color={Theme.red} weight={3} />

                <LaTeX at={[u(x[0]), -0.5]} tex="u(x)" color={Theme.red} />
                <LaTeX at={[v(x[0]), -0.5]} tex="v(x)" color={Theme.green} />

                <LaTeX at={[2.5, 4]} tex="F'(x) = f(v(x)) \cdot v'(x) - f(u(x)) \cdot u'(x)" color={Theme.indigo} />
            </Mafs>
            <div className="bg-slate-800/50 p-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-[10px] md:text-xs">
                    <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
                        <span className="text-green-400 font-bold">Límit Superior (v):</span> Al moure <InlineMath math="x" />, el límit dret corre cap endavant, sumant àrea proporcional a la seva velocitat <InlineMath math="v'(x)" />.
                    </div>
                    <div className="bg-red-500/10 p-2 rounded border border-red-500/20">
                        <span className="text-red-400 font-bold">Límit Inferior (u):</span> El límit esquerre també es mou, restant àrea al seu pas segons la velocitat <InlineMath math="u'(x)" />.
                    </div>
                </div>
            </div>
        </div>
    );
};


export default VisLimitsIntegracio;

import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisAdditivitatInterval = () => {
    const [a] = React.useState(0.5);
    const [b] = React.useState(4.5);
    const [c, setC] = React.useState(2.5);
    const f = (x: number) => 0.2 * Math.pow(x - 2.5, 2) + 0.5;

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-0.5, 5.5], y: [-0.5, 3] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Àrea [a, c] */}
                <Polygon
                    points={[
                        [a, 0],
                        ...Array.from({ length: 20 }, (_, i) => {
                            const x = a + (i / 19) * (c - a);
                            return [x, f(x)] as [number, number];
                        }),
                        [c, 0]
                    ]}
                    color={Theme.orange}
                    fillOpacity={0.3}
                />

                {/* Àrea [c, b] */}
                <Polygon
                    points={[
                        [c, 0],
                        ...Array.from({ length: 20 }, (_, i) => {
                            const x = c + (i / 19) * (b - c);
                            return [x, f(x)] as [number, number];
                        }),
                        [b, 0]
                    ]}
                    color={Theme.green}
                    fillOpacity={0.3}
                />

                <Plot.OfX y={f} color={Theme.blue} weight={3} />

                <MovablePoint point={[c, 0]} onMove={(p) => setC(Math.min(Math.max(p[0], a + 0.1), b - 0.1))} color={Theme.yellow} />

                <LaTeX at={[a, -0.4]} tex="a" color="white" />
                <LaTeX at={[b, -0.4]} tex="b" color="white" />
                <LaTeX at={[c, -0.4]} tex="c" color={Theme.yellow} />

                <LaTeX at={[(a + c) / 2, 0.4]} tex="\int_a^c f" color={Theme.orange} />
                <LaTeX at={[(c + b) / 2, 0.4]} tex="\int_c^b f" color={Theme.green} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-xs text-slate-400">
                L'àrea total sota la corba des de <InlineMath math="a" /> fins a <InlineMath math="b" /> és la suma de les dues àrees de colors:
                <br /><span className="text-white font-mono mt-1 inline-block">Integral Total = <span className="text-orange-400">Integral Taronja</span> + <span className="text-green-400">Integral Verda</span></span>
            </div>
        </div>
    );
};


export default VisAdditivitatInterval;

import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisTeoremaFonamental = () => {
    const [x, setX] = React.useState([2, 0]);
    const f = (t: number) => 0.25 * t * t + 0.5;


    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-1, 5], y: [-1, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Àrea des de 0 fins a x */}
                <Polygon
                    points={[
                        [0, 0],
                        ...Array.from({ length: 40 }, (_, i) => {
                            const t = (i / 39) * x[0];
                            return [t, f(t)] as [number, number];
                        }),
                        [x[0], 0]
                    ]}
                    color={Theme.blue}
                    fillOpacity={0.4}
                />

                {/* Línia de la funció f(t) */}
                <Plot.OfX y={f} color={Theme.blue} weight={3} />

                {/* El rectangle diferencial dF ≈ f(x) * dx */}
                <Polygon
                    points={[
                        [x[0], 0],
                        [x[0] + 0.4, 0],
                        [x[0] + 0.4, f(x[0])],
                        [x[0], f(x[0])]
                    ]}
                    color={Theme.yellow}
                    fillOpacity={0.6}
                />

                <MovablePoint
                    point={[x[0], 0]}
                    onMove={(p: [number, number]) => setX([Math.max(0, Math.min(4.4, p[0])), 0])}
                    color={Theme.yellow}
                />

                {/* Annotacions */}
                <LaTeX at={[x[0] / 2, f(x[0] / 2) / 2]} tex="F(x) = \small \int_0^x f" color="white" />
                <LaTeX at={[x[0] + 0.2, f(x[0]) + 0.4]} tex="f(x)" color={Theme.yellow} />
                <LaTeX at={[x[0] + 0.2, -0.4]} tex="dx" color={Theme.yellow} />

                <LaTeX at={[3, 4.5]} tex={`F(x) = \\int_0^x f(t) dt`} color={Theme.blue} />
            </Mafs>
            <div className="bg-slate-800/50 p-4 border-t border-white/10 text-center">
                A mesura que incrementem <InlineMath math="x" /> per un trosset <InlineMath math="dx" />, l'àrea augmenta exactament en <InlineMath math="f(x) \cdot dx" />.
                <br /><span className="text-yellow-400 font-bold mt-1 inline-block">És a dir, el ritme de canvi de l'àrea és l'alçada de la funció!</span>
            </div>
        </div>
    );
};


export default VisTeoremaFonamental;

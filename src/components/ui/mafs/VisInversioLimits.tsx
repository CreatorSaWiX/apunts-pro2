import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisInversioLimits = () => {
    const [a, setA] = React.useState(1);
    const [b, setB] = React.useState(3);
    const f = (x: number) => 0.5 * Math.sin(x) + 1.5;

    // Càlcul de la integral aproximada (primitiva de 0.5sin(x)+1.5 és -0.5cos(x)+1.5x)
    const calcInt = (from: number, to: number) => {
        const F = (val: number) => -0.5 * Math.cos(val) + 1.5 * val;
        return F(to) - F(from);
    };

    const integralValue = calcInt(a, b);

    return (
        <div className="w-full h-full flex flex-col">
            <Mafs viewBox={{ x: [-1, 5], y: [-0.5, 3] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Àrea */}
                <Polygon
                    points={[
                        [a, 0],
                        ...Array.from({ length: 20 }, (_, i) => {
                            const x = a + (i / 19) * (b - a);
                            return [x, f(x)] as [number, number];
                        }),
                        [b, 0]
                    ]}
                    color={integralValue >= 0 ? Theme.blue : Theme.red}
                    fillOpacity={0.3}
                />

                <Plot.OfX y={f} color={Theme.blue} weight={3} />

                <MovablePoint point={[a, 0]} onMove={(p) => setA(p[0])} color={Theme.yellow} />
                <MovablePoint point={[b, 0]} onMove={(p) => setB(p[0])} color={Theme.yellow} />

                <LaTeX at={[a, -0.4]} tex="a" color={Theme.yellow} />
                <LaTeX at={[b, -0.4]} tex="b" color={Theme.yellow} />

                <LaTeX at={[2, 2.5]} tex={`\\int_{${a.toFixed(1)}}^{${b.toFixed(1)}} f(x)dx = ${integralValue.toFixed(2)}`} color="white" />
            </Mafs>
            <div className="bg-slate-800/50 p-4 border-t border-white/10 text-center text-xs text-slate-400">
                Arrossega els punts <span className="text-yellow-400 font-bold italic">a</span> i <span className="text-yellow-400 font-bold italic">b</span>.
                Si <InlineMath math="b < a" />, la integral computa l'àrea en sentit contrari i el resultat canvia de signe (es torna <span className="text-red-400 font-bold">vermell</span>).
            </div>
        </div>
    );
};


export default VisInversioLimits;

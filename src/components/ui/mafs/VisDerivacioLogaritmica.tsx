import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisDerivacioLogaritmica = () => {
    const [xVal, setXVal] = React.useState([1.5, 0]);
    // f(x) = x^x. \u00c9s una funci\u00f3 que creix molt r\u00e0pid.
    const f = (x: number) => x > 0 ? Math.pow(x, x) : 0;
    // ln(f(x)) = x ln(x)
    const logF = (x: number) => x > 0 ? x * Math.log(x) : -5;

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="overflow-hidden p-2">
                <Mafs viewBox={{ x: [0, 3], y: [0, 5] }} pan={false} preserveAspectRatio={false}>
                    <Coordinates.Cartesian />
                    <Plot.OfX y={f} color={Theme.blue} weight={3} />
                    <Circle center={[xVal[0], f(xVal[0])]} radius={0.1} color={Theme.blue} />
                    <LaTeX at={[xVal[0], f(xVal[0]) + 0.5]} tex="x^x" color={Theme.blue} />
                    <MovablePoint point={[xVal[0], 0]} onMove={(p) => setXVal([Math.max(0.1, Math.min(2.5, p[0])), 0])} color={Theme.yellow} />
                </Mafs>
                <div className="p-2 text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest">Funció Original <InlineMath math="f(x) = x^x" /></div>
            </div>
            <div className="overflow-hidden p-2">
                <Mafs viewBox={{ x: [0, 3], y: [-1, 2] }} pan={false} preserveAspectRatio={false}>
                    <Coordinates.Cartesian />
                    <Plot.OfX y={logF} color={Theme.green} weight={3} />
                    <Circle center={[xVal[0], logF(xVal[0])]} radius={0.1} color={Theme.green} />
                    <LaTeX at={[xVal[0], logF(xVal[0]) + 0.4]} tex="\ln(f)" color={Theme.green} />
                </Mafs>
                <div className="p-2 text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest italic">Transformada <InlineMath math="\ln f(x) = x \ln x" /></div>
            </div>
        </div>
    );
};


export default VisDerivacioLogaritmica;

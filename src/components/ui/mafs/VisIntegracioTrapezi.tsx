import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisIntegracioTrapezi = () => {

    const [n, setN] = React.useState(4);
    const f = (x: number) => Math.sin(x) + 2;
    const a = 0;
    const b = 2 * Math.PI;
    const dx = (b - a) / n;

    const polygons = [];
    for (let i = 0; i < n; i++) {
        const x0 = a + i * dx;
        const x1 = a + (i + 1) * dx;
        polygons.push(
            <Polygon
                key={i}
                points={[[x0, 0], [x1, 0], [x1, f(x1)], [x0, f(x0)]]}
                color={Theme.blue}
                fillOpacity={0.3}
            />
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <Mafs viewBox={{ x: [-1, 7], y: [-1, 4] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />

                {polygons}

                <Plot.OfX y={f} color={Theme.red} weight={4} />

                <LaTeX at={[Math.PI, 3.5]} tex="\int_0^{2\pi} (\sin(x) + 2) dx \approx T_n" color={Theme.red} />
            </Mafs>
            <div className="bg-slate-800/50 p-4 border-t border-white/10 text-white">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-medium w-32">Subintervals (n):</span>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={n}
                        onChange={(e) => setN(parseInt(e.target.value))}
                        className="flex-1 accent-blue-400"
                    />
                    <span className="font-mono bg-black/40 px-3 py-1 rounded w-12 text-center">{n}</span>
                </div>
                <div className="text-xs text-slate-400 italic mt-2 text-center">
                    Mètode dels trapezis per aproximar l'àrea sota la corba d'una funció.
                </div>
            </div>
        </div>
    );
};


export default VisIntegracioTrapezi;

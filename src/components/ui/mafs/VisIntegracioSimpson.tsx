import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisIntegracioSimpson = () => {
    const [n, setN] = React.useState(4); // n ha de ser parell
    const f = (x: number) => Math.sin(x) + 2;
    const a = 0;
    const b = 2 * Math.PI;
    const dx = (b - a) / n;

    const polygons = [];

    for (let i = 0; i < n; i += 2) {
        const x0 = a + i * dx;
        const x1 = a + (i + 1) * dx;
        const x2 = a + (i + 2) * dx;

        const y0 = f(x0);
        const y1 = f(x1);
        const y2 = f(x2);

        const h = dx;
        const P = (x: number) => {
            const term1 = y0 * (x - x1) * (x - x2) / (2 * h * h);
            const term2 = -y1 * (x - x0) * (x - x2) / (h * h);
            const term3 = y2 * (x - x0) * (x - x1) / (2 * h * h);
            return term1 + term2 + term3;
        };

        const points = [[x0, 0]];
        // Dibuixem 10 segments de recta per donar l'aparença d'una paràbola suau
        for (let j = 0; j <= 10; j++) {
            const px = x0 + (j / 10) * (2 * h);
            points.push([px, P(px)]);
        }
        points.push([x2, 0]);

        polygons.push(
            <Polygon
                key={`poly-${i}`}
                points={points as [number, number][]}
                color={Theme.green}
                fillOpacity={0.3}
            />
        );

        polygons.push(
            <circle key={`p0-${i}`} cx={x0} cy={y0} r={0.06} fill="white" />
        );
        polygons.push(
            <circle key={`p1-${i}`} cx={x1} cy={y1} r={0.06} fill="white" />
        );
        polygons.push(
            <circle key={`p2-${i}`} cx={x2} cy={y2} r={0.06} fill="white" />
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <Mafs viewBox={{ x: [-1, 7], y: [-1, 4] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />

                {polygons}

                <Plot.OfX y={f} color={Theme.red} weight={4} />

                <LaTeX at={[Math.PI, 3.5]} tex="\int_0^{2\pi} (\sin(x) + 2) dx \approx S_n" color={Theme.red} />
            </Mafs>
            <div className="bg-slate-800/50 p-4 border-t border-white/10 text-white">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-medium w-auto">Subintervals (n parell):</span>
                    <input
                        type="range"
                        min="2"
                        max="20"
                        step="2"
                        value={n}
                        onChange={(e) => setN(parseInt(e.target.value))}
                        className="flex-1 accent-green-400"
                    />
                    <span className="font-mono bg-black/40 px-3 py-1 rounded w-12 text-center">{n}</span>
                </div>
                <div className="text-xs text-slate-400 italic mt-2 text-center">
                    El mètode de Simpson aproxima la corba usant arcs parabòlics definits per tres punts consecutius.
                </div>
            </div>
        </div>
    );
};



export default VisIntegracioSimpson;

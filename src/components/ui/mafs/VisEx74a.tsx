import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisEx74a = () => {
    const [point, setPoint] = React.useState<[number, number]>([1.5, 2]);
    const x = point[0], y = point[1];
    const isInDomain = (x * y > 0) && (y > x * x - 1);

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-4, 4], y: [-2, 6] }} pan={false}>
                <Coordinates.Cartesian />

                {/* Quadrant 1: y > x^2 - 1 i x,y > 0 */}
                <Polygon
                    points={[
                        [0, 0], [1, 0],
                        ...Array.from({ length: 31 }, (_, i) => {
                            const xi = 1 + i * 0.1;
                            return [xi, xi * xi - 1] as [number, number];
                        }),
                        [4, 15], [0, 15]
                    ]}
                    color={Theme.blue} fillOpacity={0.12} weight={0}
                />

                {/* Quadrant 3: y > x^2 - 1 i x,y < 0 
                    Només existeix quan x^2 - 1 < 0 => x entre -1 i 0 */}
                <Polygon
                    points={[
                        [0, 0],
                        ...Array.from({ length: 21 }, (_, i) => {
                            const xi = -i * 0.05;
                            return [xi, xi * xi - 1] as [number, number];
                        }),
                        [-1, 0], [0, 0]
                    ]}
                    color={Theme.blue} fillOpacity={0.12} weight={0}
                />

                <Plot.OfX y={(x) => x * x - 1} color={Theme.indigo} weight={2} style="dashed" />
                <MovablePoint point={point} onMove={setPoint} color={isInDomain ? Theme.green : Theme.red} />
                <LaTeX at={[point[0], point[1] + 0.4]} tex={`(${point[0].toFixed(1)}, ${point[1].toFixed(1)})`} />
            </Mafs>
            <div className="p-3 bg-slate-950 text-center border-t border-white/10">
                <span className={`text-[9px] font-black uppercase tracking-widest ${isInDomain ? 'text-green-400' : 'text-red-400'}`}>
                    {isInDomain ? "Dins del domini" : "Fora del domini"}
                </span>
            </div>
        </div>
    );
};


export default VisEx74a;

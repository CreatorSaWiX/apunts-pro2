import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisSuccessio1N = () => {
    const points = Array.from({ length: 30 }, (_, i) => {
        const n = i + 1;
        return [n, 1 / n];
    });

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-5, 5], y: [-2, 2] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />

                {/* Linia del límit y=0 */}
                <Plot.OfX y={() => 0} color={Theme.blue} weight={5} opacity={0.7} />

                {/* Funció contínua de fons per donar context */}
                <Plot.OfX y={(x) => 1 / x} color={Theme.red} weight={4} opacity={0.5} />

                {/* Punts de la successió (renderitzats després per estar a sobre) */}
                {points.map(([x, y], i) => (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={0.15}
                        fill={Theme.red}
                        stroke="white"
                        strokeWidth={0.02}
                        className="transition-all duration-300"
                    />
                ))}
                {/* Marques Canvas */}
                <Text x={2} y={-0.5} color={Theme.blue} size={18}>
                    Límit l = 0
                </Text>
                <LaTeX at={[3, 1]} tex="a_n = \frac{1}{n}" color={Theme.red} />
            </Mafs>
        </div>
    );
};


export default VisSuccessio1N;

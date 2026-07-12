import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisSuccessioOscilant = () => {
    const points = Array.from({ length: 20 }, (_, i) => {
        const n = i + 1;
        return [n, Math.pow(-1, n)];
    });

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-5, 5], y: [-2, 2] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Línies límit (que no n'hi ha un d'únic) */}
                <Plot.OfX y={() => 1} color={Theme.green} weight={5} opacity={0.5} />
                <Plot.OfX y={() => -1} color={Theme.green} weight={5} opacity={0.5} />
                <Plot.OfX y={() => 0} color={"rgba(255, 255, 255, 0.4)"} weight={5} opacity={0.5} />

                {/* Punts de la successió */}
                {points.map(([x, y], i) => (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={0.3}
                        fill={Theme.orange}
                        stroke="white"
                        strokeWidth={0.1}
                    />
                ))}
                {/* Marques Canvas */}
                <LaTeX at={[3, 1.3]} tex="a_n = (-1)^n" color={Theme.green} />
                <Text x={3} y={1.6} color={Theme.green} size={16}>Salt constant (Sense Límit)</Text>
            </Mafs>
        </div>
    );
};


export default VisSuccessioOscilant;

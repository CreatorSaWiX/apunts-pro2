import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisDominisComplexos = () => {
    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-5, 5], y: [-3, 3] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />

                {/* Regió del domini per a sqrt(y - sin(x)) >= 0 => y >= sin(x) */}
                <Polygon
                    points={[
                        ...Array.from({ length: 101 }, (_, i) => {
                            const x = -5 + (i * 10) / 100;
                            return [x, Math.sin(x)] as [number, number];
                        }),
                        [5, 3],
                        [-5, 3],
                    ]}
                    color={Theme.blue}
                    fillOpacity={0.2}
                    weight={2}
                />

                <Plot.OfX y={(x) => Math.sin(x)} color={Theme.blue} weight={3} />

                <LaTeX at={[0, 1.5]} tex="y \ge \sin(x)" color={Theme.blue} />
                <Text x={-4} y={2.5} color={Theme.blue} size={14}>Domini Ombrejat</Text>
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-xs text-slate-400">
                L'àrea blava representa el domini on la funció està definida. La vora és contínua perquè inclou el signe igual.
            </div>
        </div>
    );
};


export default VisDominisComplexos;

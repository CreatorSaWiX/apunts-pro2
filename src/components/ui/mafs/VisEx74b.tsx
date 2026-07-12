import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisEx74b = () => {
    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-4, 4], y: [-2, 6] }} pan={false}>
                <Coordinates.Cartesian />
                {/* Ombrejat suau per context */}
                <Polygon points={[[0, 15], [4, 15], [4, 0], [1, 0], [0, 0]]} color={Theme.blue} fillOpacity={0.05} weight={0} />
                <Polygon points={[[0, 0], [0, -1], [-4, 15], [-4, 0]]} color={Theme.blue} fillOpacity={0.05} weight={0} />

                {/* Corba de nivell y = 1/x */}
                <Plot.OfX y={(x) => 1 / x} color={Theme.red} weight={3} />

                {/* Punt (1,1) */}
                <Circle center={[1, 1]} radius={0.08} color={Theme.red} fillOpacity={1} />
                <LaTeX at={[1.5, 1.5]} tex="(1,1)" color={Theme.red} />
                <LaTeX at={[3, 0.7]} tex="y = 1/x" color={Theme.red} />
            </Mafs>
        </div>
    );
};


export default VisEx74b;

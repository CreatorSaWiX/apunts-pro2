import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisDistanciaEuclidia = () => {
    const [p1, setP1] = React.useState<[number, number]>([1, 1]);
    const [p2, setP2] = React.useState<[number, number]>([4, 3]);

    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const dist = Math.sqrt(dx * dx + dy * dy);

    return (
        <div className="w-full flex flex-col">
            <Mafs viewBox={{ x: [-1, 6], y: [-1, 5] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />

                {/* Triangle de Pitàgores */}
                <Polygon
                    points={[p1, [p2[0], p1[1]], p2]}
                    color={Theme.blue}
                    fillOpacity={0.05}
                    strokeStyle="dashed"
                    weight={1}
                />

                {/* Línia de distància real */}
                <Line.Segment point1={p1} point2={p2} color={Theme.red} weight={4} />

                {/* Labels de components */}
                <LaTeX at={[(p1[0] + p2[0]) / 2, p1[1] - 0.3]} tex={`|\\Delta x| = ${Math.abs(dx).toFixed(1)}`} color={Theme.blue} />
                <LaTeX at={[p2[0] + 0.6, (p1[1] + p2[1]) / 2]} tex={`|\\Delta y| = ${Math.abs(dy).toFixed(1)}`} color={Theme.blue} />

                {/* Punts arrossegables */}
                <MovablePoint point={p1} onMove={setP1} color={Theme.red} />
                <MovablePoint point={p2} onMove={setP2} color={Theme.red} />

                <LaTeX at={[(p1[0] + p2[0]) / 2 - 0.5, (p1[1] + p2[1]) / 2 + 0.5]} tex={`d = ${dist.toFixed(2)}`} color={Theme.red} />
            </Mafs>
        </div>
    );
};


export default VisDistanciaEuclidia;

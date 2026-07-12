import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisVectorAdditionIntro = () => (
    <div className="w-full h-[400px]">
        <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }} pan={true} zoom={true}>
            <Coordinates.Cartesian />
            <Vector tail={[0, 0]} tip={[2, 1]} color={Theme.blue} />
            <LaTeX at={[2.2, 1.2]} tex="u" color={Theme.blue} />
            <Vector tail={[0, 0]} tip={[1, 2]} color={Theme.red} />
            <LaTeX at={[1.2, 2.2]} tex="v" color={Theme.red} />
            <Vector tail={[0, 0]} tip={[3, 3]} color={Theme.indigo} />
            <LaTeX at={[3.2, 3.2]} tex="u + v" color={Theme.indigo} />
            <Line.Segment point1={[2, 1]} point2={[3, 3]} style="dashed" color="gray" />
            <Line.Segment point1={[1, 2]} point2={[3, 3]} style="dashed" color="gray" />
        </Mafs>
    </div>
);


export default VisVectorAdditionIntro;
